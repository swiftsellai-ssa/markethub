"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { useHub } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import type { Article } from "@/lib/types";

export default function SeoBotPage() {
  const { state, seoRunsLeft, addArticle, consumeSeoRun } = useHub();
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
    if (seoRunsLeft <= 0) {
      setError("No SEO runs left on this plan. Upgrade on /pricing.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/bots/seo/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: state.brand, hint }),
      });
      const data = (await res.json()) as Article & {
        error?: string;
        markdown?: string;
      };
      if (!res.ok) throw new Error(data.error || "Run failed");
      const article = addArticle({
        keyword: data.keyword,
        title: data.title,
        meta: data.meta,
        slug: data.slug,
        markdown: data.markdown,
        opportunity: data.opportunity,
      });
      consumeSeoRun();
      setOpen(article);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(false);
    }
  }

  const limit = PLANS[state.account.plan].seoRuns;

  return (
    <main className="px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
        Bot 1 · Live · {state.account.plan} · {seoRunsLeft}/{limit} briefs left
      </p>
      <h1 className="mt-3 font-serif text-4xl">SEO Bot</h1>
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
          disabled={busy || hasKey === false || seoRunsLeft <= 0}
          className="rounded-sm bg-lime px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-40"
        >
          {busy ? "Searching…" : "Write one page"}
        </button>
      </div>
      {hasKey === false ? (
        <p className="mt-3 text-xs text-mute">
          Add XAI_API_KEY to generate. Meanwhile read the{" "}
          <Link href="/playbook" className="underline">
            public playbook
          </Link>{" "}
          — that is MarketHub&apos;s own SEO.
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-warn">{error}</p> : null}

      {open ? (
        <article className="mt-8 border border-lime/40 bg-ink-2 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
            {open.keyword}
          </p>
          <h2 className="mt-2 font-serif text-2xl">{open.title}</h2>
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
                  <span className="font-serif text-lg">{a.title}</span>
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
