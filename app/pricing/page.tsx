"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Shell } from "@/components/Shell";
import { Ticker } from "@/components/Ticker";
import { PLANS } from "@/lib/plans";
import { useHub } from "@/lib/store";

export default function PricingPage() {
  const { state, requestFounding } = useHub();
  const [email, setEmail] = useState(state.account.email);
  const [done, setDone] = useState(state.account.foundingRequested);
  const [error, setError] = useState<string | null>(null);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/founding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not join");
      return;
    }
    requestFounding(email);
    setDone(true);
  }

  return (
    <Shell>
      <Ticker />
      <MarketingHeader />
      <main className="px-5 py-12 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
          The board
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
          Cheaper than a freelancer. Stricter than a content hose.
        </h1>
        <p className="mt-4 max-w-xl text-paper/65">
          You are not paying for AI tweets. You are paying for a daily loop that
          reads the scoreboard. First 50 desks lock $19/mo for a year.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {Object.values(PLANS).map((plan) => (
            <article
              key={plan.id}
              className={`border border-line bg-ink-2 p-6 ${
                plan.id === "desk" ? "glow-lime" : ""
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
                {plan.name}
              </p>
              <p className="mt-4 font-display text-5xl font-extrabold">
                {plan.price === 0 ? "$0" : `$${plan.price}`}
                {plan.price > 0 ? (
                  <span className="text-lg text-mute">/mo</span>
                ) : null}
              </p>
              {plan.foundingPrice ? (
                <p className="mt-1 text-sm text-lime">
                  Founding 50: ${plan.foundingPrice}/mo locked
                </p>
              ) : null}
              <p className="mt-4 text-sm text-paper/65">{plan.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm text-paper/80">
                <li>{plan.xRuns} X runs / month</li>
                <li>{plan.seoRuns} SEO briefs / month</li>
                {plan.bots.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link
                href="/start"
                className="mt-8 inline-block bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void"
              >
                {plan.id === "free" ? "Open a pit" : "Start, then upgrade"}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 max-w-lg border border-line bg-ink-2 p-6 glow-cyan">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            Founding 50
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            Lock Desk at $19 before billing opens.
          </h2>
          <p className="mt-3 text-sm text-paper/65">
            No charge today. We email you when Stripe is live. The $19 rate
            holds for 12 months. After 50, Desk is $39.
          </p>
          {done ? (
            <p className="mt-6 text-sm text-lime">
              You&apos;re on the list. Watch your inbox.
            </p>
          ) : (
            <form onSubmit={join} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 border border-line bg-void px-3 py-2 text-sm outline-none placeholder:text-mute/50 focus:border-lime"
              />
              <button
                type="submit"
                className="bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void"
              >
                Join founding 50
              </button>
            </form>
          )}
          {error ? <p className="mt-3 text-sm text-hot">{error}</p> : null}
        </section>
      </main>
    </Shell>
  );
}
