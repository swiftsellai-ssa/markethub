"use client";

import { useHub } from "@/lib/store";

export function Toast() {
  const { notice, noticeError, clearNotice } = useHub();
  if (!notice) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 max-w-sm border px-4 py-3 shadow-[0_0_32px_rgb(216_255_60/0.12)] ${
        noticeError
          ? "border-hot bg-ink-2 text-hot"
          : "border-lime bg-ink-2 text-lime"
      }`}
    >
      <div className="flex items-start gap-3">
        <p className="font-mono text-[12px] leading-relaxed tracking-wide">
          {noticeError ? "✕ " : "● "}
          {notice}
        </p>
        <button
          type="button"
          onClick={clearNotice}
          className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-mute hover:text-paper"
        >
          Close
        </button>
      </div>
    </div>
  );
}
