import Link from "next/link";
import { DeskTerminal } from "@/components/DeskTerminal";
import { MarketingHeader } from "@/components/MarketingHeader";
import { TrackLink } from "@/components/TrackLink";
import { Shell } from "@/components/Shell";
import { Ticker } from "@/components/Ticker";
import { Workflow } from "@/components/Workflow";

const BOTS = [
  {
    id: "01",
    name: "SEO",
    status: "Live" as const,
    purpose: "Find a winnable keyword. AI writes one page. You publish it.",
    href: "/hub/seo",
  },
  {
    id: "02",
    name: "Video",
    status: "Coming" as const,
    purpose: "Trend → script → render. Same voice on every platform.",
    href: "/hub/video",
  },
  {
    id: "03",
    name: "X",
    status: "Live" as const,
    purpose: "Research the last 48 hours. One post. Clone 2× winners.",
    href: "/hub/x",
  },
  {
    id: "04",
    name: "Ads",
    status: "Coming" as const,
    purpose: "Long-running competitor ads in. Creatives out. Spend stays paused.",
    href: "/hub/ads",
  },
];

export default function LandingPage() {
  return (
    <Shell>
      <Ticker />
      <MarketingHeader />

      <main>
        <section className="relative px-5 pb-16 pt-12 md:px-10 md:pt-16">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
            <span className="live-dot" />
            Find the signal. Kill the noise. Scale the winners.
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Stop guessing what content works.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-snug text-paper md:text-2xl">
            MarketsXHub runs one AI growth experiment at a time, tracks the
            result, and turns your 2× winners into the next baseline.
          </p>
          <p className="mt-4 max-w-xl text-paper/60">
            It learns your voice — not ours. You still hit publish. We keep the
            scoreboard.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <TrackLink
              href="/start"
              event="cta_start_free"
              eventProps={{ location: "hero" }}
              className="bg-lime px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-void hover:bg-cyan"
            >
              Start free — 7 X runs
            </TrackLink>
            <TrackLink
              href="/pricing"
              event="cta_pricing"
              eventProps={{ location: "hero" }}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute hover:text-lime"
            >
              Desk $39/mo · founding 50 at $19/mo
            </TrackLink>
          </div>
        </section>

        <section className="border-y border-line px-5 py-16 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
            After you sign up
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            One experiment a day. The scoreboard decides the next one.
          </h2>
          <div className="mt-10">
            <Workflow />
          </div>
        </section>

        <section className="px-5 py-16 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
            Four desks
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Trading terminals for growth.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {BOTS.map((bot) => (
              <DeskTerminal key={bot.id} {...bot} />
            ))}
          </div>
        </section>

        <section
          id="loop"
          className="border-y border-line bg-ink-2 px-5 py-16 md:px-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-hot">
            What 2× means
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            A 2× outlier is any post that scores at least twice your account&apos;s
            average engagement.
          </h2>
          <p className="mt-5 max-w-2xl text-paper/65">
            Score = likes + replies × 2 + reposts × 3. Paste your X metrics in
            seconds. Automatic tracking is coming. Hit 2× your baseline and that
            format becomes the next three experiments.
          </p>
          <Link
            href="/playbook/outlier-rule"
            className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-lime"
          >
            Read the playbook →
          </Link>
        </section>

        <section className="grid gap-12 px-5 py-16 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
              Not another generator
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
              AI learns what works
              <br />
              for your brand.
            </h2>
            <p className="mt-5 text-paper/65">
              Most tools dump content. MarketsXHub runs a controlled experiment,
              measures engagement, and clones only the formats that beat your
              normal baseline. You still hit publish. We still refuse to spend
              your ads budget without a click.
            </p>
          </div>
          <div className="border border-line bg-ink-2 p-6 glow-cyan">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
              What you buy
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed">
              <li>
                <span className="text-lime">Free — $0.</span> Try the loop. 7 X
                posts, 1 SEO brief.
              </li>
              <li>
                <span className="text-lime">Desk — $39/mo.</span> Daily X bot.
                First 50 people lock <strong>$19/mo for 12 months</strong>, then
                $39. Not a one-time fee.
              </li>
              <li>
                <span className="text-lime">Floor — $99/mo.</span> Every desk
                that is live now, plus Video and Ads when they launch.
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-cyan hover:text-lime"
            >
              Compare plans →
            </Link>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
            Start with one desk
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            X this week. SEO when you&apos;re ready.
          </h2>
          <p className="mt-4 max-w-xl text-paper/60">
            Two minutes to point MarketsXHub at any product. Or load the demo
            and see how we run the same loop on ourselves.
          </p>
          <TrackLink
            href="/start"
            event="cta_start_free"
            eventProps={{ location: "footer_cta" }}
            className="mt-8 inline-block bg-lime px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-void hover:bg-cyan"
          >
            Create a workspace
          </TrackLink>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-6 font-mono text-[11px] tracking-[0.12em] text-mute md:px-10">
        <span>MarketsXHub · find the signal · scale the winners</span>
        <Link href="/pricing" className="hover:text-lime">
          Founding 50 open
        </Link>
      </footer>
    </Shell>
  );
}
