import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { Logo } from "./Logo";

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4 md:px-10">
      <Link href="/" aria-label="MarketsXHub home" className="shrink-0">
        <Logo />
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-3 font-mono text-[11px] sm:gap-5">
        <Link
          href="/playbook"
          className="hidden uppercase tracking-[0.22em] text-mute hover:text-lime sm:inline"
        >
          Playbook
        </Link>
        <Link
          href="/pricing"
          className="hidden uppercase tracking-[0.22em] text-mute hover:text-lime sm:inline"
        >
          Pricing
        </Link>
        <Link
          href="/hub"
          className="uppercase tracking-[0.22em] text-mute hover:text-lime"
        >
          Hub
        </Link>
        <span className="normal-case tracking-normal">
          <AuthNav />
        </span>
        <Link
          href="/start"
          className="bg-lime px-3 py-2 font-bold uppercase tracking-[0.18em] text-void hover:bg-cyan sm:px-4"
        >
          Start free
        </Link>
      </nav>
    </header>
  );
}
