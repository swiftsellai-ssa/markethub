"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHub } from "@/lib/store";

const FUNNEL = [
  "cta_start_free",
  "workspace_created",
  "magic_link_sent",
  "desk_run",
  "desk_run_failed",
  "metrics_logged",
  "brand_saved",
  "cta_pricing",
  "checkout_started",
  "checkout_success",
  "founding_claimed",
] as const;

export default function InsightsPage() {
  const { sessionUser } = useHub();
  const [days, setDays] = useState(7);
  const [rows, setRows] = useState<Array<{ name: string; n: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionUser) return;
    fetch(`/api/insights?days=${days}`)
      .then((r) => r.json())
      .then((d: { rows?: Array<{ name: string; n: number }>; error?: string }) => {
        if (d.error) setError(d.error);
        setRows(d.rows ?? []);
      })
      .catch(() => setError("Could not load insights"));
  }, [sessionUser, days]);

  const byName = Object.fromEntries(rows.map((r) => [r.name, Number(r.n)]));
  const total = rows.reduce((sum, r) => sum + Number(r.n), 0);

  return (
    <main className="px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
        Launch scoreboard
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        Insights
      </h1>
      <p className="mt-3 max-w-xl text-sm text-paper/65">
        Site-wide funnel for the last {days} days. Page views live in Vercel →
        Analytics. These counts are first-party (your database).
      </p>

      {!sessionUser ? (
        <p className="mt-8 text-sm">
          <Link href="/login?next=/hub/insights" className="text-cyan hover:text-lime">
            Log in
          </Link>{" "}
          to read the tape.
        </p>
      ) : (
        <>
          <div className="mt-6 flex gap-2 font-mono text-[11px] uppercase tracking-widest">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`border px-3 py-1.5 ${
                  days === d
                    ? "border-lime bg-lime text-void"
                    : "border-line text-mute hover:text-lime"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>

          {error ? (
            <p className="mt-6 text-sm text-hot">
              {error}. Run <code>supabase/analytics.sql</code> in the SQL editor.
            </p>
          ) : null}

          <p className="mt-6 font-mono text-[11px] text-mute">
            {total} events in window
          </p>

          <table className="mt-4 w-full max-w-lg text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-widest text-mute">
              <tr>
                <th className="border-b border-line py-2">Event</th>
                <th className="border-b border-line py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {FUNNEL.map((name) => (
                <tr key={name} className="border-b border-line/60">
                  <td className="py-2 font-mono text-xs">{name}</td>
                  <td className="py-2 font-display text-lg font-extrabold">
                    {byName[name] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
