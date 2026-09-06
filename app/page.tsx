import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Shell } from "@/components/Shell";
import { Ticker } from "@/components/Ticker";

const BOTS = [
  {
    id: "01",
    name: "SEO Pit",
    status: "Live",
    line: "One winnable keyword. One page. Queue it. Rankings come later.",
  },
  {
    id: "02",
    name: "Video Pit",
    status: "Next",
    line: "Trends in. Scripts out. Same face, every platform.",
  },
  {
    id: "03",
    name: "X Pit",
    status: "Live",
    line: "Reads the tape. Writes one post. Clones 2x winners.",
  },
  {
    id: "04",
    name: "Ads Pit",
    status: "Next",
    line: "Steal the format that has been running 30 days. Kill the rest.",
  },
];

export default function LandingPage() {
  return (
    <Shell>
      <Ticker />
      <MarketingHeader />

      <main>
        <section className="relative px-5 pb-20 pt-12 md:px-10 md:pt-20">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.32em] text-cyan">
            <span className="live-dot" />
            Night pit · X desk open · zero spend
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-[14vw] font-extrabold leading-[0.8] tracking-[-0.06em] md:text-[9rem]">
            Markets
            <span className="text-lime">X</span>
            Hub
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70">
            Four desks. One morning. Each bot owns a channel — research, publish,
            track, then shove whatever hits 2x. Point it at your brand. It does
            not write as us.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/start"
              className="bg-lime px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-void hover:bg-cyan"
            >
              Open a pit — 7 X runs
            </Link>
            <Link
              href="/pricing"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute hover:text-lime"
            >
              Desk $39 · founding 50 @ $19
            </Link>
          </div>
        </section>

        <section className="grid border-y border-line md:grid-cols-4">
          {BOTS.map((bot) => (
            <article
              key={bot.id}
              className={`border-line px-5 py-8 md:border-r md:last:border-r-0 ${
                bot.status === "Live" ? "bg-ink-2 glow-lime" : "bg-void"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-widest">
                <span className="text-mute">{bot.id}</span>
                <span
                  className={
                    bot.status === "Live" ? "text-lime" : "text-mute"
                  }
                >
                  {bot.status === "Live" ? "● live" : "dark"}
                </span>
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">
                {bot.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                {bot.line}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-12 px-5 py-20 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
              Not another generator
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
              n8n dumps content.
              <br />
              A pit keeps score.
            </h2>
            <p className="mt-5 text-paper/65">
              The tape is full of agents that scrape, write, and spray.
              MarketsXHub writes one piece, waits for the number, and clones
              only the 2x outliers. You still hit publish. We still refuse to
              spend your ads budget without a click.
            </p>
          </div>
          <div className="border border-line bg-ink-2 p-6 glow-cyan">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
              The board
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed">
              <li>
                <span className="text-lime">Free.</span> Your brand, 7 X runs, 1
                SEO brief, the scoreboard.
              </li>
              <li>
                <span className="text-lime">Desk — $39/mo.</span> Daily X. 90
                runs. Founding 50 lock $19.
              </li>
              <li>
                <span className="text-lime">Floor — $99/mo.</span> All four pits
                as they open. SEO live now.
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-cyan hover:text-lime"
            >
              Full board →
            </Link>
          </div>
        </section>

        <section
          id="loop"
          className="border-y border-line bg-ink-2 px-5 py-20 md:px-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-hot">
            Outlier rule
          </p>
          <h2 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
            Track every tick. Find 2x. Push it. Three variations. Winner becomes
            the baseline.
          </h2>
          <Link
            href="/playbook/outlier-rule"
            className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-lime"
          >
            Read the playbook →
          </Link>
        </section>

        <section className="px-5 py-20 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
            Open one pit
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            X this week. SEO when you&apos;re ready.
          </h2>
          <p className="mt-4 max-w-xl text-paper/60">
            Two minutes to point the floor at any product. Or load the
            MarketsXHub demo and watch us eat our own cooking.
          </p>
          <Link
            href="/start"
            className="mt-8 inline-block bg-lime px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-void hover:bg-cyan"
          >
            Create a workspace
          </Link>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-mute md:px-10">
        <span>MarketsXHub · four pits · one morning</span>
        <Link href="/pricing" className="hover:text-lime">
          Founding 50 open
        </Link>
      </footer>
    </Shell>
  );
}
