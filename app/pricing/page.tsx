"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Shell } from "@/components/Shell";
import { Ticker } from "@/components/Ticker";
import { PLAN_COMPARE, PLANS } from "@/lib/plans";
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
          Pricing
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
          Pay for the loop, not a pile of drafts.
        </h1>
        <p className="mt-4 max-w-xl text-paper/65">
          Founding 50 is <strong className="text-paper">$19 per month</strong>{" "}
          for Desk, locked for 12 months. After that — or after 50 people —
          Desk is $39/mo. No one-time fee. No charge today; we email you when
          billing opens.
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
              <p className="mt-1 text-sm text-cyan">{plan.subtitle}</p>
              <p className="mt-4 font-display text-5xl font-extrabold">
                {plan.price === 0 ? "$0" : `$${plan.price}`}
                {plan.price > 0 ? (
                  <span className="text-lg text-mute">/mo</span>
                ) : null}
              </p>
              {plan.foundingPrice ? (
                <p className="mt-1 text-sm text-lime">
                  Founding 50: ${plan.foundingPrice}/mo for 12 months
                </p>
              ) : null}
              <p className="mt-4 text-sm text-paper/65">{plan.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm text-paper/80">
                {plan.bots.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link
                href="/start"
                className="mt-8 inline-block bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void"
              >
                {plan.id === "free" ? "Start free" : "Start free, then upgrade"}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 overflow-x-auto border border-line">
          <p className="border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-mute">
            Side by side
          </p>
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-ink-2 font-mono text-[11px] uppercase tracking-widest text-mute">
              <tr>
                <th className="px-4 py-3 font-medium"> </th>
                <th className="px-4 py-3 font-medium">Free</th>
                <th className="px-4 py-3 font-medium text-lime">Desk</th>
                <th className="px-4 py-3 font-medium">Floor</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARE.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <td className="px-4 py-3 text-paper/70">{row.label}</td>
                  <td className="px-4 py-3">{row.free}</td>
                  <td className="px-4 py-3">{row.desk}</td>
                  <td className="px-4 py-3">{row.floor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-16 max-w-lg border border-line bg-ink-2 p-6 glow-cyan">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            Founding 50
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            Lock Desk at $19/mo for a year.
          </h2>
          <p className="mt-3 text-sm text-paper/65">
            Monthly, not one-time. No charge today. We email you when Stripe is
            live. After 12 months — or if the 50 slots fill — Desk is $39/mo.
            Floor stays $99/mo and includes every current desk plus Video and
            Ads when they launch.
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
