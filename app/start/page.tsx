"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Shell } from "@/components/Shell";
import { Ticker } from "@/components/Ticker";
import { EMPTY_BRAND } from "@/lib/seed";
import { useHub } from "@/lib/store";
import type { Brand } from "@/lib/types";

export default function StartPage() {
  const router = useRouter();
  const { onboard, ready } = useHub();
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState<Brand>(EMPTY_BRAND);

  function go(demo: boolean) {
    onboard({ brand, email, demo });
    router.push("/hub/x");
  }

  return (
    <Shell>
      <Ticker />
      <MarketingHeader />
      <main className="mx-auto max-w-xl px-5 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
          Open a pit
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Your product. Your bots.
        </h1>
        <p className="mt-3 text-sm text-paper/65">
          Free: 7 X runs and 1 SEO brief. No card. The bots write for the brand
          you type here — not for MarketsXHub.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!brand.name.trim() || !brand.niche.trim()) return;
            go(false);
          }}
        >
          <Field
            label="Work email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="you@company.com"
          />
          <Field
            label="Brand / product name"
            value={brand.name}
            onChange={(v) => setBrand((b) => ({ ...b, name: v }))}
            required
            placeholder="Northwind"
          />
          <Field
            label="Niche"
            value={brand.niche}
            onChange={(v) => setBrand((b) => ({ ...b, niche: v }))}
            required
            placeholder="Payroll software for cafes"
          />
          <Area
            label="What it does"
            value={brand.product}
            onChange={(v) => setBrand((b) => ({ ...b, product: v }))}
            placeholder="A sentence a stranger could repeat."
          />
          <Area
            label="Who you're talking to"
            value={brand.audience}
            onChange={(v) => setBrand((b) => ({ ...b, audience: v }))}
            placeholder="Cafe owners who still do payroll in a spreadsheet"
          />
          <Field
            label="CTA"
            value={brand.cta}
            onChange={(v) => setBrand((b) => ({ ...b, cta: v }))}
            placeholder="Try the free payroll run"
          />
          <Field
            label="X handle"
            value={brand.xHandle}
            onChange={(v) => setBrand((b) => ({ ...b, xHandle: v }))}
            placeholder="@northwind"
          />
          <Field
            label="Site URL"
            value={brand.siteUrl}
            onChange={(v) => setBrand((b) => ({ ...b, siteUrl: v }))}
            placeholder="https://"
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={!ready || !brand.name.trim() || !brand.niche.trim()}
              className="bg-lime px-5 py-3 text-sm font-extrabold uppercase tracking-widest text-void disabled:opacity-40"
            >
              Open my pit
            </button>
            <button
              type="button"
              onClick={() => go(true)}
              className="border border-line px-5 py-3 text-sm text-paper/80 hover:border-lime hover:text-lime"
            >
              Load MarketsXHub demo
            </button>
          </div>
        </form>
      </main>
    </Shell>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line bg-ink-2 px-3 py-2 text-sm text-paper outline-none placeholder:text-mute/50 focus:border-lime"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
        {label}
      </span>
      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line bg-ink-2 px-3 py-2 text-sm text-paper outline-none placeholder:text-mute/50 focus:border-lime"
      />
    </label>
  );
}
