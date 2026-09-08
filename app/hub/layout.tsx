"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "@/components/AuthNav";
import { Logo } from "@/components/Logo";
import { useHub } from "@/lib/store";

const NAV = [
  { href: "/hub", label: "Overview", live: false },
  { href: "/hub/x", label: "X", live: true },
  { href: "/hub/seo", label: "SEO", live: true },
  { href: "/hub/video", label: "Video", live: false },
  { href: "/hub/ads", label: "Ads", live: false },
  { href: "/hub/brand", label: "Brand", live: false },
  { href: "/hub/report", label: "Report", live: false },
];

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { ready, state } = useHub();

  return (
    <div className="noise min-h-screen bg-void text-paper hub-grid">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-line bg-ink-2/80 md:w-56 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 py-4 md:block">
            <Link href="/" className="inline-block">
              <Logo size="sm" />
            </Link>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              {ready && state.account.onboarded
                ? state.brand.name || "Workspace"
                : "Workspace"}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              {ready ? state.account.plan : ""}
            </p>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em]">
              <AuthNav compact />
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:px-3 md:pb-6">
            {NAV.map((item) => {
              const active =
                item.href === "/hub"
                  ? path === "/hub"
                  : path === item.href || path.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between gap-2 whitespace-nowrap px-3 py-2 text-sm ${
                    active
                      ? "bg-lime font-bold text-void"
                      : "text-paper/70 hover:bg-void hover:text-lime"
                  }`}
                >
                  {item.label}
                  {item.live ? (
                    <span
                      className={`font-mono text-[9px] uppercase tracking-widest ${
                        active ? "text-void/70" : "text-lime"
                      }`}
                    >
                      Live
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          {ready && !state.account.onboarded ? (
            <div className="px-5 py-16 md:px-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
                New workspace
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
                Tell the bots who you are.
              </h1>
              <p className="mt-3 max-w-md text-paper/65">
                MarketsXHub writes for your product, not ours. Two minutes to
                onboard.
              </p>
              <Link
                href="/start"
                className="mt-8 inline-block bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-void"
              >
                Start free
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
