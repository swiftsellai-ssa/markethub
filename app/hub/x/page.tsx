"use client";

import { PostCard } from "@/components/PostCard";
import { RunBot } from "@/components/RunBot";
import { contentTypeForDate, contentTypeLabel, weekdayName } from "@/lib/calendar";
import { useHub } from "@/lib/store";
import { outliers, variationBrief } from "@/lib/outliers";

export default function XBotPage() {
  const { state, today, todayPost, updatePost, logMetrics } = useHub();
  const queue = [...state.posts].sort((a, b) => b.date.localeCompare(a.date));
  const wins = outliers(state.posts);
  const todayType = contentTypeForDate(today);

  return (
    <main className="px-5 py-8 md:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
            Bot 3 · Live · Zero spend
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
            X Pit
          </h1>
          <p className="mt-3 max-w-xl text-sm text-paper/65">
            Writing for {state.brand.name || "your brand"}. {weekdayName(today)}{" "}
            is a {contentTypeLabel(todayType).toLowerCase()} day. Copy the post,
            ship it, log numbers so the 2x rule has something to chew on.
          </p>
        </div>
        <RunBot />
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            Today
          </p>
          {todayPost ? (
            <PostCard
              post={todayPost}
              featured
              onStatus={(status) => updatePost(todayPost.id, { status })}
              onMetrics={(m) => logMetrics(todayPost.id, m)}
            />
          ) : (
            <div className="border border-dashed border-line p-6 text-sm text-paper/55">
              Nothing queued for today. Run the bot, or pick a draft from the
              queue.
            </div>
          )}

          <p className="pt-4 font-mono text-[11px] uppercase tracking-widest text-mute">
            Queue
          </p>
          <div className="space-y-3">
            {queue
              .filter((p) => p.id !== todayPost?.id)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onStatus={(status) => updatePost(post.id, { status })}
                  onMetrics={(m) => logMetrics(post.id, m)}
                />
              ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="border border-line bg-ink-2 p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
              Strategy
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Winning hook" value={state.strategy.winningHook || "Log a 2x post"} />
              <Row label="Format" value={state.strategy.winningFormat} />
              <Row label="Avoid" value={state.strategy.avoid} />
              <Row label="Double down" value={state.strategy.doubleDown} />
            </dl>
          </section>

          <section className="border border-line bg-ink-2 p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
              Last research
            </p>
            {state.research ? (
              <div className="mt-4 space-y-3 text-sm text-paper/75">
                <p>{state.research.notes}</p>
                <List title="Formats" items={state.research.topFormats} />
                <List title="Topics" items={state.research.topics} />
                <List title="Gaps" items={state.research.gaps} />
                <p>
                  <span className="text-mute">Polarizing · </span>
                  {state.research.polarizingTake}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-paper/50">No research yet.</p>
            )}
          </section>

          <section className="border border-line bg-ink-2 p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
              Outliers
            </p>
            {wins.length === 0 ? (
              <p className="mt-4 text-sm text-paper/50">
                Post, log metrics, and anything 2x above average lands here —
                then we write three variations.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {wins.map((post) => (
                  <li key={post.id} className="text-sm">
                    <p className="font-display text-lg leading-snug">{post.hook}</p>
                    <p className="mt-1 font-mono text-[11px] text-lime">
                      score {post.score} · 2x winner
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-paper/60">
                      {variationBrief(post).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-mute">
        {label}
      </dt>
      <dd className="mt-1 text-paper/80">{value}</dd>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
        {title}
      </p>
      <ul className="mt-1 list-disc space-y-1 pl-4">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
