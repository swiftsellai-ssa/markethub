import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";

const BOTS = [
  {
    id: "01",
    name: "SEO Bot",
    status: "Live",
    line: "One winnable keyword. One page. Queue it. Rankings come later.",
  },
  {
    id: "02",
    name: "Video Bot",
    status: "Next",
    line: "Trends in. Scripts out. Same face, every platform.",
  },
  {
    id: "03",
    name: "X Content Bot",
    status: "Live",
    line: "Reads the feed. Writes one post. Clones 2x winners.",
  },
  {
    id: "04",
    name: "Ads Bot",
    status: "Next",
    line: "Steal the format that has been running 30 days. Kill the rest.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink paper-grid">
      <MarketingHeader />

      <main>
        <section className="px-5 pb-16 pt-10 md:px-10 md:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
            For founders who shipped · not for agencies
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
            You built the product.
            <br />
            The bots do the marketing.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/75">
            MarketHub is a four-desk marketing OS. Each bot owns a channel —
            research, publish, track, then push whatever hits 2x average. Point
            it at your brand. It does not write as us.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/start"
              className="rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper"
            >
              Start free — 7 X runs
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-ink/70 underline decoration-ink/20 underline-offset-4"
            >
              Desk $39 · founding 50 at $19
            </Link>
          </div>
        </section>

        <section className="grid border-y border-ink/10 md:grid-cols-4">
          {BOTS.map((bot) => (
            <article
              key={bot.id}
              className={`border-ink/10 px-5 py-8 md:border-r md:last:border-r-0 ${
                bot.status === "Live" ? "bg-lime" : "bg-paper"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-widest">
                <span>{bot.id}</span>
                <span className={bot.status === "Live" ? "text-ink" : "text-mute"}>
                  {bot.status}
                </span>
              </div>
              <h2 className="mt-6 font-serif text-3xl">{bot.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{bot.line}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-12 px-5 py-20 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
              Why this isn&apos;t another generator
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              n8n templates dump content. A desk keeps score.
            </h2>
            <p className="mt-4 text-ink/70">
              The feed is full of agents that scrape, write, and spray. MarketHub
              writes one piece, waits for the number, and clones only the 2x
              outliers. You still hit publish. We still refuse to spend your ads
              budget without a click.
            </p>
          </div>
          <div className="border border-ink/10 bg-paper-2 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
              Free vs paid
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed">
              <li>
                <strong>Free.</strong> Your brand, 7 X runs, 1 SEO brief, the
                scoreboard. Enough to feel the loop.
              </li>
              <li>
                <strong>Desk — $39/mo.</strong> Daily X. 90 runs. Reports.
                Founding 50 lock $19.
              </li>
              <li>
                <strong>Floor — $99/mo.</strong> All four desks as they ship. SEO
                live now.
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-6 inline-block text-sm underline underline-offset-4"
            >
              Full pricing →
            </Link>
          </div>
        </section>

        <section
          id="loop"
          className="border-t border-ink/10 bg-ink px-5 py-20 text-paper md:px-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
            The outlier rule
          </p>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            Track every result. Find what is 2x above average. Push it harder.
            Build three variations. The winner becomes the new baseline.
          </h2>
          <Link
            href="/playbook/outlier-rule"
            className="mt-8 inline-block text-sm text-lime underline underline-offset-4"
          >
            Read the playbook
          </Link>
        </section>

        <section className="px-5 py-20 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
            Start with one desk
          </p>
          <h2 className="mt-4 font-serif text-4xl">X this week. SEO when you&apos;re ready.</h2>
          <p className="mt-4 max-w-xl text-ink/70">
            Point the hub at any product in two minutes. Or load the MarketHub
            demo and see how we market ourselves with the same bots.
          </p>
          <Link
            href="/start"
            className="mt-8 inline-block rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper"
          >
            Create a workspace
          </Link>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-5 py-6 text-xs text-ink/50 md:px-10">
        <span>MarketHub · four desks, one morning</span>
        <Link href="/pricing">Founding 50 open</Link>
      </footer>
    </div>
  );
}
