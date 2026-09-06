import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingHeader } from "./MarketingHeader";

export function PlaybookArticle({
  kicker,
  title,
  dek,
  children,
}: {
  kicker: string;
  title: string;
  dek: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink paper-grid">
      <MarketingHeader />
      <article className="mx-auto max-w-2xl px-5 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
          {kicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-ink/70">{dek}</p>
        <div className="playbook-body mt-10 space-y-5 text-[17px] leading-relaxed text-ink/85">
          {children}
        </div>
        <p className="mt-12 text-sm">
          <Link href="/start" className="underline underline-offset-4">
            Start a free hub
          </Link>
          {" · "}
          <Link href="/playbook" className="underline underline-offset-4">
            All playbook
          </Link>
        </p>
      </article>
    </div>
  );
}
