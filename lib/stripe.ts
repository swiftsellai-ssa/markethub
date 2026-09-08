import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.NEXT_PUBLIC_STRIPE_DESK_PRICE_ID &&
      process.env.NEXT_PUBLIC_STRIPE_FLOOR_PRICE_ID,
  );
}

/** Maps a Stripe Price id → MarketsXHub plan. Founding is Desk at $19. */
export function planFromPriceId(priceId: string | undefined | null): {
  plan: "desk" | "floor";
  founding: boolean;
} | null {
  if (!priceId) return null;

  if (priceId === process.env.NEXT_PUBLIC_STRIPE_FOUNDING_PRICE_ID) {
    return { plan: "desk", founding: true };
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_DESK_PRICE_ID) {
    return { plan: "desk", founding: false };
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_FLOOR_PRICE_ID) {
    return { plan: "floor", founding: false };
  }
  return null;
}

export function priceIdForCheckout(tier: "desk" | "founding" | "floor"): string | null {
  if (tier === "founding") {
    return process.env.NEXT_PUBLIC_STRIPE_FOUNDING_PRICE_ID ?? null;
  }
  if (tier === "desk") {
    return process.env.NEXT_PUBLIC_STRIPE_DESK_PRICE_ID ?? null;
  }
  return process.env.NEXT_PUBLIC_STRIPE_FLOOR_PRICE_ID ?? null;
}
