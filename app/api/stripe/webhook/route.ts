import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, planFromPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function customerIdOf(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

async function scheduleDeskAfter12Months(subscriptionId: string) {
  const deskPrice = process.env.NEXT_PUBLIC_STRIPE_DESK_PRICE_ID;
  if (!deskPrice) return;

  const stripe = getStripe();
  const schedule = await stripe.subscriptionSchedules.create({
    from_subscription: subscriptionId,
  });
  const phase = schedule.phases[0];
  if (!phase) return;

  await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "release",
    phases: [
      {
        items: phase.items.map((item) => ({
          price: typeof item.price === "string" ? item.price : item.price.id,
          quantity: item.quantity ?? 1,
        })),
        start_date: phase.start_date,
        duration: { interval: "month", interval_count: 12 },
      },
      {
        items: [{ price: deskPrice, quantity: 1 }],
      },
    ],
  });
}

async function applyCheckoutSession(session: Stripe.Checkout.Session) {
  const stripe = getStripe();
  const customerId = customerIdOf(session.customer);

  const userId = session.metadata?.userId || session.client_reference_id || null;
  const userEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.email ||
    null;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 1,
  });
  const priceId = lineItems.data[0]?.price?.id ?? null;
  const mapped = planFromPriceId(priceId);

  if (!mapped) {
    console.error("stripe_webhook_unknown_price", priceId);
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (mapped.founding && subscriptionId) {
    try {
      await scheduleDeskAfter12Months(subscriptionId);
    } catch (err) {
      console.error("stripe_founding_schedule", err);
    }
  }

  const supabase = createAdminClient();
  const foundingUntil = mapped.founding
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const patch = {
    plan: mapped.plan,
    founding: mapped.founding,
    founding_until: foundingUntil,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    const { error } = await supabase
      .from("workspaces")
      .update(patch)
      .eq("user_id", userId);
    if (error) {
      console.error("stripe_webhook_workspace_update", error.message);
    }
    return;
  }

  if (userEmail) {
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
      perPage: 200,
    });
    if (listErr) {
      console.error("stripe_webhook_list_users", listErr.message);
      return;
    }
    const match = list.users.find(
      (u) => u.email?.toLowerCase() === userEmail.toLowerCase(),
    );
    if (!match) {
      console.error("stripe_webhook_no_user_for_email", userEmail);
      return;
    }
    const { error } = await supabase
      .from("workspaces")
      .update(patch)
      .eq("user_id", match.id);
    if (error) {
      console.error("stripe_webhook_workspace_email_update", error.message);
    }
  }
}

async function applySubscription(sub: Stripe.Subscription) {
  const supabase = createAdminClient();
  const customerId = customerIdOf(sub.customer);
  if (!customerId) return;

  const status = sub.status;
  if (
    status === "canceled" ||
    status === "unpaid" ||
    status === "incomplete_expired"
  ) {
    const { error } = await supabase
      .from("workspaces")
      .update({
        plan: "free",
        founding: false,
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_customer_id", customerId);
    if (error) console.error("stripe_webhook_sub_cancel", error.message);
    return;
  }

  if (status !== "active" && status !== "trialing") return;

  const priceId = sub.items.data[0]?.price?.id;
  const mapped = planFromPriceId(priceId);
  if (!mapped) return;

  const userId = sub.metadata?.userId || null;
  const patch = {
    plan: mapped.plan,
    founding: mapped.founding,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    const { error } = await supabase
      .from("workspaces")
      .update(patch)
      .eq("user_id", userId);
    if (error) console.error("stripe_webhook_sub_update", error.message);
    return;
  }

  const { error } = await supabase
    .from("workspaces")
    .update(patch)
    .eq("stripe_customer_id", customerId);
  if (error) console.error("stripe_webhook_sub_update_customer", error.message);
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json(
      { error: `Webhook signature error: ${message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription") {
          await applyCheckoutSession(session);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await applySubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("stripe_webhook_handler", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
