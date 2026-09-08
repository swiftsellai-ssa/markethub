import { NextResponse } from "next/server";
import { z } from "zod";
import { FOUNDING_CAP } from "@/lib/founding";
import { siteUrl } from "@/lib/site-url";
import { getStripe, isStripeConfigured, priceIdForCheckout } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  tier: z.enum(["desk", "founding", "floor"]),
});

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet" },
      { status: 503 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Sign in required before checkout.", code: "AUTH_REQUIRED" },
      { status: 401 },
    );
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) {
    return NextResponse.json(
      { error: "Sign in before paying so the plan attaches to your workspace.", code: "AUTH_REQUIRED" },
      { status: 401 },
    );
  }

  if (parsed.data.tier === "founding") {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("founding_leads")
      .select("*", { count: "exact", head: true });
    if (error) {
      return NextResponse.json(
        { error: "Could not check founding seats" },
        { status: 500 },
      );
    }
    if ((count ?? 0) >= FOUNDING_CAP) {
      return NextResponse.json(
        { error: "Founding 50 is full. Desk is $39/mo." },
        { status: 409 },
      );
    }
  }

  const priceId = priceIdForCheckout(parsed.data.tier);
  if (!priceId) {
    return NextResponse.json(
      { error: "Price id missing for this tier" },
      { status: 503 },
    );
  }

  const origin = siteUrl(req);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/hub?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancel`,
    client_reference_id: user.id,
    customer_email: user.email,
    metadata: {
      userId: user.id,
      email: user.email,
      tier: parsed.data.tier,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        tier: parsed.data.tier,
      },
    },
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Checkout session missing URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
