"use client";

import Link from "next/link";
import { useHub } from "@/lib/store";
import { averageScore, outliers, scoredPosts } from "@/lib/outliers";
import { contentTypeLabel, weekdayName } from "@/lib/calendar";
import { shortDate } from "@/lib/format";

const DESKS = [
  {
    href: "/hub/x",
    name: "X",
    status: "Live",
    blurb: "Daily posts. Zero spend. Research → write → copy → log.",
  },
  {
    href: "/hub/seo",
    name: "SEO",
    status: "Live",
    blurb: "One keyword, one page brief. Ranking crawl comes later.",
  },
  {
    href: "/hub/video",
    name: "Video",
    status: "Week 3",
    blurb: "Scripts and shorts. Avatar render comes later.",
  },
  {
    href: "/hub/ads",
    name: "Ads",
    status: "Week 4",
    blurb: "Creatives and kill/scale. Spend stays paused until you say go.",
  },
];

export default function HubOverview() {
  const { state, today, todayPost } = useHub();
  const posted = scoredPosts(state.posts);
  const wins = outliers(state.posts);
  const avg = averageScore(state.posts);
  const readyCount = state.posts.filter(
    (p) => p.status === "ready" || p.status === "draft",
  ).length;

  return (
    <main className="px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
        {weekdayName(today)} · {shortDate(today)}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">
        {state.brand.name || "Four desks."}
      </h1>
      <p className="mt-3 max-w-xl text-paper/65">
        {state.account.plan} plan · {state.brand.niche || "Onboard a niche"}. X
        and SEO are live. Video and ads wait their week.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Stat label="In queue" value={String(readyCount)} />
        <Stat label="Posted with metrics" value={String(posted.length)} />
        <Stat
          label="2x outliers"
          value={posted.length ? String(wins.length) : "—"}
        />
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {DESKS.map((desk) => (
          <Link
            key={desk.href}
            href={desk.href}
            className="border border-line bg-ink-2 p-5 transition-colors hover:border-lime/40"
          >
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
              <span className="text-mute">{desk.status}</span>
              {desk.status === "Live" ? (
                <span className="text-lime">Open</span>
              ) : (
                <span className="text-mute">Preview</span>
              )}
            </div>
            <h2 className="mt-4 font-display text-2xl">{desk.name}</h2>
            <p className="mt-2 text-sm text-paper/60">{desk.blurb}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12 border border-line bg-ink-2 p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
          Today on X
        </p>
        {todayPost ? (
          <>
            <p className="mt-4 font-display text-2xl leading-snug">
              {todayPost.tweets[0]}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-mute">
              {todayPost.kind} · {contentTypeLabel(todayPost.contentType)} ·{" "}
              {todayPost.status}
            </p>
            <Link
              href="/hub/x"
              className="mt-5 inline-block rounded-sm bg-lime px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink"
            >
              Copy and ship
            </Link>
          </>
        ) : (
          <p className="mt-4 text-paper/60">
            No draft for today. Run the X bot.
          </p>
        )}
      </section>

      {avg > 0 ? (
        <p className="mt-6 text-sm text-paper/50">
          Average engagement score {avg.toFixed(1)}. 2x threshold{" "}
          {(avg * 2).toFixed(1)}.
        </p>
      ) : (
        <p className="mt-6 text-sm text-paper/50">
          Log metrics on posted tweets to turn on the outlier loop.
        </p>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-ink-2 px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
