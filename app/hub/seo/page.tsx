"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { useHub } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { isQuotaSnapshot, planLabel, type QuotaSnapshot } from "@/lib/quota";
import { track } from "@/lib/track";
import type { Article } from "@/lib/types";

export default function SeoBotPage() {
  const { state, sessionUser, seoRunsLeft, addArticle, consumeSeoRun, applyQuota } =
    useHub();
  const [hint, setHint] = useState("");
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Article | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d: { hasKey?: boolean }) => setHasKey(Boolean(d.hasKey)))
      .catch(() => setHasKey(false));
  }, []);

  async function run() {
    if (!sessionUser) {
      setError("Sign in to run the SEO desk.");
      return;
    }
    if (seoRunsLeft <= 0) {
      setError(
        `No SEO runs left on ${planLabel(state.account.plan)} (${seoRunsLeft}/${PLANS[state.account.plan].seoRuns} this month). Upgrade on /pricing.`,
      );
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/run-desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deskType: "seo",
          brand: state.brand,
          hint,
        }),
      });
      const data = (await res.json()) as Article & {
        error?: string;
        markdown?: string;
        serverQuota?: boolean;
        quota?: QuotaSnapshot;
      };
      if (isQuotaSnapshot(data.quota)) applyQuota(data.quota);
      if (!res.ok) {
        track("desk_run_failed", { desk: "seo" });
        throw new Error(data.error || "Run failed");
      }
      track("desk_run", { desk: "seo" });
      const article = addArticle({
        keyword: data.keyword,
        title: data.title,
        meta: data.meta,
        slug: data.slug,
        markdown: data.markdown,
        opportunity: data.opportunity,
      });
      if (!isQuotaSnapshot(data.quota)) consumeSeoRun();
      setOpen(article);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(false);
    }
  }

  const limit = PLANS[state.account.plan].seoRuns;
  const plan = planLabel(state.account.plan);

  return (
    <main className="px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
        Bot 1 · Live · {plan} · {seoRunsLeft}/{limit} briefs left
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        SEO desk
      </h1>
      <p className="mt-3 max-w-xl text-sm text-paper/65">
        Finds one winnable keyword for {state.brand.name || "your product"},
        writes the page, puts it in the queue. Ranking tracking still needs
        DataForSEO — the brief is the part that ships today.
      </p>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <input
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Optional: a keyword or theme"
          className="flex-1 border border-line bg-ink-2 px-3 py-2 text-sm outline-none focus:border-lime"
        />
        <button
          type="button"
          onClick={run}
          disabled={busy || hasKey === false || seoRunsLeft <= 0 || !sessionUser}
          className="bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void disabled:opacity-40"
        >
          {busy ? "Searching…" : "Write one page"}
        </button>
      </div>
      {!sessionUser ? (
        <p className="mt-3 text-xs text-mute">
          <Link href="/login?next=/hub/seo" className="text-cyan hover:text-lime">
            Log in
          </Link>{" "}
          to run SEO. Quota is per account.
        </p>
      ) : seoRunsLeft <= 0 ? (
        <p className="mt-3 text-xs text-mute">
          {plan} is out of SEO briefs this month.{" "}
          <Link href="/pricing" className="text-cyan hover:text-lime">
            Upgrade
          </Link>
          .
        </p>
      ) : null}
      {hasKey === false ? (
        <p className="mt-3 text-xs text-mute">
          Server is missing XAI_API_KEY. Read the{" "}
          <Link href="/playbook" className="underline">
            public playbook
          </Link>{" "}
          meanwhile.
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-warn">{error}</p> : null}

      {open ? (
        <article className="mt-8 border border-lime/40 bg-ink-2 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            {open.keyword}
          </p>
          <h2 className="mt-2 font-display text-2xl">{open.title}</h2>
          <p className="mt-2 text-sm text-paper/60">{open.meta}</p>
          <p className="mt-3 text-sm text-paper/70">{open.opportunity}</p>
          <div className="mt-4">
            <CopyButton
              text={open.markdown}
              label="Copy markdown"
              className="border-lime bg-lime text-ink"
            />
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-paper/70">
            {open.markdown}
          </pre>
        </article>
      ) : null}

      <section className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
          Queue
        </p>
        {state.articles.length === 0 ? (
          <p className="mt-4 text-sm text-paper/50">No briefs yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.articles.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpen(a)}
                  className="w-full border border-line bg-ink-2 px-4 py-3 text-left hover:border-lime/40"
                >
                  <span className="font-display text-lg">{a.title}</span>
                  <span className="mt-1 block font-mono text-[11px] text-mute">
                    {a.keyword}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
