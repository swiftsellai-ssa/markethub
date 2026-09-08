"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center justify-center border px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide ${className}`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
