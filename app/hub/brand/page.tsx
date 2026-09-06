"use client";

import { useEffect, useState } from "react";
import { useHub } from "@/lib/store";
import type { Brand } from "@/lib/types";

const FIELDS: Array<{ key: keyof Brand; label: string; rows?: number }> = [
  { key: "name", label: "Brand" },
  { key: "niche", label: "Niche" },
  { key: "audience", label: "Audience", rows: 3 },
  { key: "product", label: "Product", rows: 4 },
  { key: "cta", label: "CTA" },
  { key: "tone", label: "Tone", rows: 3 },
  { key: "siteUrl", label: "Site URL" },
  { key: "xHandle", label: "X handle" },
];

export default function BrandPage() {
  const { state, setBrand, reset } = useHub();
  const [draft, setDraft] = useState<Brand>(state.brand);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(state.brand);
  }, [state.brand]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setBrand(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-8 md:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
        Voice
      </p>
      <h1 className="mt-3 font-serif text-4xl">Brand</h1>
      <p className="mt-3 text-sm text-paper/65">
        The X bot writes in this voice. Right now it is marketing MarketHub to
        founders. Change it when you point the bots at another product.
      </p>

      <form onSubmit={save} className="mt-8 space-y-4">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
              {field.label}
            </span>
            {field.rows ? (
              <textarea
                rows={field.rows}
                value={draft[field.key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [field.key]: e.target.value }))
                }
                className="mt-1 w-full border border-line bg-ink-2 px-3 py-2 text-sm outline-none focus:border-lime"
              />
            ) : (
              <input
                value={draft[field.key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [field.key]: e.target.value }))
                }
                className="mt-1 w-full border border-line bg-ink-2 px-3 py-2 text-sm outline-none focus:border-lime"
              />
            )}
          </label>
        ))}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-sm bg-lime px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink"
          >
            {saved ? "Saved" : "Save brand"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-sm border border-line px-4 py-2 text-xs font-medium uppercase tracking-widest text-mute"
          >
            Reset demo data
          </button>
        </div>
      </form>
    </main>
  );
}
