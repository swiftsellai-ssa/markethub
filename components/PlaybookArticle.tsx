import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingHeader } from "./MarketingHeader";
import { Shell } from "./Shell";
import { Ticker } from "./Ticker";

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
    <Shell>
      <Ticker />
      <MarketingHeader />
      <article className="mx-auto max-w-2xl px-5 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
          {kicker}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-paper/65">{dek}</p>
        <div className="playbook-body mt-10 space-y-5 text-[17px] leading-relaxed text-paper/80">
          {children}
        </div>
        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          <Link href="/start" className="text-lime hover:text-cyan">
            Open a pit
          </Link>
          {" · "}
          <Link href="/playbook" className="hover:text-lime">
            All playbook
          </Link>
        </p>
      </article>
    </Shell>
  );
}
