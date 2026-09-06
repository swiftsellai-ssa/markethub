import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between px-5 py-4 md:px-10">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.22em]">
        <Link href="/playbook" className="hidden text-mute hover:text-lime sm:inline">
          Playbook
        </Link>
        <Link href="/pricing" className="hidden text-mute hover:text-lime sm:inline">
          Pricing
        </Link>
        <Link href="/hub" className="text-mute hover:text-lime">
          Floor
        </Link>
        <Link
          href="/start"
          className="bg-lime px-4 py-2 font-bold text-void hover:bg-cyan"
        >
          Open a pit
        </Link>
      </nav>
    </header>
  );
}
