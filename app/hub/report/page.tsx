"use client";

import { useHub } from "@/lib/store";
import { averageScore, outliers, scoredPosts, worstPost } from "@/lib/outliers";
import { shortDate } from "@/lib/format";

export default function ReportPage() {
  const { state } = useHub();
  const posted = scoredPosts(state.posts);
  const wins = outliers(state.posts);
  const worst = worstPost(state.posts);
  const avg = averageScore(state.posts);
  const queued = state.posts.filter(
    (p) => p.status === "draft" || p.status === "ready",
  ).length;

  return (
    <main className="px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
        Weekly
      </p>
      <h1 className="mt-3 font-display text-4xl">Report</h1>
      <p className="mt-3 max-w-xl text-sm text-paper/65">
        Same shape every Monday: what moved, what died, what to clone. The X bot
        fills this as you log metrics. The other bots join when they go live.
      </p>

      <blockquote className="mt-10 max-w-3xl border-l-2 border-lime pl-5 font-display text-2xl leading-snug md:text-3xl">
        This week: {posted.length} posts with numbers. {wins.length} hit 2x.
        {worst
          ? ` Worst: “${worst.hook}”.`
          : " Log at least two posts to name a worst."}{" "}
        Biggest opportunity: {wins[0]?.hook || "keep shipping until something 2xs"}.
      </blockquote>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Stat label="Avg score" value={avg ? avg.toFixed(1) : "—"} />
        <Stat label="2x threshold" value={avg ? (avg * 2).toFixed(1) : "—"} />
        <Stat label="Still in queue" value={String(queued)} />
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="border border-line bg-ink-2 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            Clone these
          </p>
          {wins.length === 0 ? (
            <p className="mt-4 text-sm text-paper/50">No outliers yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {wins.map((p) => (
                <li key={p.id}>
                  <p className="font-display text-lg">{p.hook}</p>
                  <p className="font-mono text-[11px] text-lime">
                    {shortDate(p.date)} · score {p.score} · {p.format}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border border-line bg-ink-2 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            Current default
          </p>
          <p className="mt-4 text-sm text-paper/75">{state.strategy.doubleDown}</p>
          <p className="mt-3 text-sm text-paper/50">Avoid: {state.strategy.avoid}</p>
        </div>
      </section>
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
