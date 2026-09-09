"use client";

import { useEffect, useState } from "react";
import { xRunLimit } from "@/lib/plans";
import { isQuotaSnapshot, planLabel, type QuotaSnapshot } from "@/lib/quota";
import { useHub } from "@/lib/store";
import { track } from "@/lib/track";
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
  serverQuota?: boolean;
  runsRemaining?: number | null;
  quota?: QuotaSnapshot;
  error?: string;
};

export function RunBot() {
  const {
    state,
    sessionUser,
    today,
    addPost,
    setResearch,
    setStrategy,
    xRunsLeft,
    consumeXRun,
    applyQuota,
  } = useHub();
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = xRunLimit(state.account.plan);
  const plan = planLabel(state.account.plan);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d: { hasKey?: boolean }) => setHasKey(Boolean(d.hasKey)))
      .catch(() => setHasKey(false));
  }, []);

  async function run() {
    if (!sessionUser) {
      setError("Sign in to run the X desk.");
      return;
    }
    if (xRunsLeft <= 0) {
      setError(`No X runs left on ${plan} (${xRunsLeft}/${limit} this month). Upgrade on /pricing.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/run-desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deskType: "x",
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
      const data = (await res.json()) as RunResponse;
      if (isQuotaSnapshot(data.quota)) applyQuota(data.quota);
      if (!res.ok) {
        track("desk_run_failed", { desk: "x" });
        throw new Error(data.error || "Run failed");
      }
      track("desk_run", { desk: "x" });

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
      if (!isQuotaSnapshot(data.quota)) consumeXRun();
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
        disabled={busy || hasKey === false || xRunsLeft <= 0 || !sessionUser}
        className="bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy
          ? "Researching X…"
          : `Run X bot · ${xRunsLeft}/${limit} · ${plan}`}
      </button>
      {!sessionUser ? (
        <p className="max-w-xs text-right text-xs text-mute">
          <a href="/login?next=/hub/x" className="text-cyan hover:text-lime">
            Log in
          </a>{" "}
          to run the desk. Quota is per account, not per browser.
        </p>
      ) : xRunsLeft <= 0 ? (
        <p className="max-w-xs text-right text-xs text-mute">
          {plan} is out of X runs this month.{" "}
          <a href="/pricing" className="text-cyan hover:text-lime">
            Upgrade
          </a>
          .
        </p>
      ) : (
        <p className="max-w-xs text-right text-xs text-mute">
          {plan} · {xRunsLeft} of {limit} X runs left this month.
        </p>
      )}
      {hasKey === false ? (
        <p className="max-w-xs text-right text-xs text-mute">
          Server is missing XAI_API_KEY. Seeded demo drafts still ship.
        </p>
      ) : null}
      {error ? <p className="max-w-xs text-right text-xs text-warn">{error}</p> : null}
    </div>
  );
}
