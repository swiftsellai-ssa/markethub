"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { DeskTerminal } from "@/components/DeskTerminal";
import { planLabel } from "@/lib/quota";
import { useHub } from "@/lib/store";
import { track } from "@/lib/track";
import { averageScore, outliers, scoredPosts } from "@/lib/outliers";
import { contentTypeLabel, weekdayName } from "@/lib/calendar";
import { shortDate } from "@/lib/format";

const DESKS = [
  {
    href: "/hub/x",
    id: "03",
    name: "X",
    status: "Live" as const,
    purpose: "Daily posts. Research → copy → log. Zero spend.",
  },
  {
    href: "/hub/seo",
    id: "01",
    name: "SEO",
    status: "Live" as const,
    purpose: "One winnable keyword. One page brief. You publish.",
  },
  {
    href: "/hub/video",
    id: "02",
    name: "Video",
    status: "Coming" as const,
    purpose: "Scripts and shorts. Avatar render comes later.",
  },
  {
    href: "/hub/ads",
    id: "04",
    name: "Ads",
    status: "Coming" as const,
    purpose: "Creatives and kill/scale. Spend stays paused until you say go.",
  },
];

function CheckoutBeacon() {
  const params = useSearchParams();
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    if (params.get("checkout") !== "success") return;
    sent.current = true;
    track("checkout_success");
  }, [params]);
  return null;
}

export default function HubOverview() {
  return (
    <Suspense>
      <CheckoutBeacon />
      <HubOverviewBody />
    </Suspense>
  );
}

function HubOverviewBody() {
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
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
        {state.brand.name || "Four desks."}
      </h1>
      <p className="mt-3 max-w-xl text-paper/65">
        {planLabel(state.account.plan)} · {state.brand.niche || "Onboard a niche"}. X
        and SEO are live. Video and ads wait their week.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Stat label="In queue" value={String(readyCount)} />
        <Stat label="Posted with metrics" value={String(posted.length)} />
        <Stat
          label="2× outliers"
          value={posted.length ? String(wins.length) : "—"}
        />
      </div>

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        {DESKS.map((desk) => (
          <DeskTerminal key={desk.href} {...desk} />
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
              className="mt-5 inline-block bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void"
            >
              Copy and ship
            </Link>
          </>
        ) : (
          <p className="mt-4 text-paper/60">
            No draft for today. Run the X desk.
          </p>
        )}
      </section>

      {avg > 0 ? (
        <p className="mt-6 text-sm text-paper/50">
          Average engagement score {avg.toFixed(1)}. 2× threshold{" "}
          {(avg * 2).toFixed(1)}.
        </p>
      ) : (
        <p className="mt-6 text-sm text-paper/50">
          Paste X metrics in seconds to turn on the outlier loop. Automatic
          tracking is coming.
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
      <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
    </div>
  );
}
