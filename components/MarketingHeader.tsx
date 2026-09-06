import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingHeader() {
  return (
    <header className="flex items-center justify-between px-5 py-5 md:px-10">
      <Link href="/">
        <Logo invert />
      </Link>
      <nav className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest">
        <Link href="/playbook" className="hidden text-ink/60 sm:inline">
          Playbook
        </Link>
        <Link href="/pricing" className="hidden text-ink/60 sm:inline">
          Pricing
        </Link>
        <Link href="/hub" className="text-ink/60">
          Hub
        </Link>
        <Link
          href="/start"
          className="rounded-sm bg-ink px-4 py-2 text-paper"
        >
          Start free
        </Link>
      </nav>
    </header>
  );
}
