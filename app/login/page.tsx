"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Shell } from "@/components/Shell";
import { isBrowserSupabaseConfigured } from "@/lib/supabase/client";
import { track } from "@/lib/track";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/hub";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const configured = isBrowserSupabaseConfigured();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          next,
          source: "login",
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not send magic link");
      track("magic_link_sent", { source: "login" });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send magic link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <MarketingHeader />
      <main className="px-5 py-16 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
          Persist
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Sign in to your workspace
        </h1>
        <p className="mt-4 max-w-md text-paper/65">
          Magic link only. After login, any local queue migrates once into your
          Supabase workspace, and desk runs go through server-side quota.
        </p>

        {!configured ? (
          <p className="mt-8 max-w-lg border border-line bg-ink-2/60 px-4 py-3 text-sm text-warn">
            Supabase env vars are not set yet. Add them in Vercel /{" "}
            <code className="text-paper/80">.env.local</code>, run{" "}
            <code className="text-paper/80">supabase/schema.sql</code>, then
            redeploy.
          </p>
        ) : sent ? (
          <p className="mt-8 max-w-md text-lime">
            Check {email} for the magic link.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex max-w-md flex-col gap-3">
            <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-line bg-void px-3 py-2 text-sm text-paper outline-none focus:border-lime"
                placeholder="you@company.com"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void disabled:opacity-40"
            >
              {busy ? "Sending…" : "Email magic link"}
            </button>
            {error ? <p className="text-sm text-warn">{error}</p> : null}
          </form>
        )}

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
          <Link href="/hub" className="hover:text-lime">
            Back to hub
          </Link>
        </p>
      </main>
    </Shell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
