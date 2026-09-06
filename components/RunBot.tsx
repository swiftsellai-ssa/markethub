"use client";

import { useEffect, useState } from "react";
import { useHub } from "@/lib/store";
import type { ContentType, PostKind, Research } from "@/lib/types";

type RunResponse = {
  research: Omit<Research, "ranAt">;
  post: {
    kind: PostKind;
    tweets: string[];
    hook: string;
    topic: string;
    format: string;
    contentType: ContentType;
  };
  strategyUpdate: string;
};

export function RunBot() {
  const {
    state,
    today,
    addPost,
    setResearch,
    setStrategy,
    xRunsLeft,
    consumeXRun,
  } = useHub();
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d: { hasKey?: boolean }) => setHasKey(Boolean(d.hasKey)))
      .catch(() => setHasKey(false));
  }, []);

  async function run() {
    if (xRunsLeft <= 0) {
      setError("No X runs left on this plan. Upgrade on /pricing.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/bots/x/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: state.brand,
          strategy: state.strategy,
          recentPosts: state.posts.slice(0, 10).map((p) => ({
            date: p.date,
            kind: p.kind,
            hook: p.hook,
            contentType: p.contentType,
            status: p.status,
            metrics: p.metrics,
          })),
        }),
      });
      const data = (await res.json()) as RunResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Run failed");

      const research: Research = {
        ...data.research,
        ranAt: new Date().toISOString(),
      };
      setResearch(research);
      addPost({
        date: today,
        kind: data.post.kind,
        tweets: data.post.tweets,
        hook: data.post.hook,
        topic: data.post.topic,
        format: data.post.format,
        contentType: data.post.contentType,
        status: "ready",
        researchNotes: data.research.notes,
      });
      consumeXRun();
      if (data.strategyUpdate) {
        setStrategy({
          ...state.strategy,
          doubleDown: data.strategyUpdate,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={run}
        disabled={busy || hasKey === false || xRunsLeft <= 0}
        className="rounded-sm bg-lime px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? "Researching X…" : `Run X bot · ${xRunsLeft} left`}
      </button>
      {hasKey === false ? (
        <p className="max-w-xs text-right text-xs text-mute">
          Add <code className="text-paper/70">XAI_API_KEY</code> to{" "}
          <code className="text-paper/70">.env.local</code> to generate live.
          Seeded demo drafts still ship.
        </p>
      ) : null}
      {error ? <p className="max-w-xs text-right text-xs text-warn">{error}</p> : null}
    </div>
  );
}
