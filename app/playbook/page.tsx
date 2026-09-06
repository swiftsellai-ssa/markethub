import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Shell } from "@/components/Shell";
import { Ticker } from "@/components/Ticker";

const POSTS = [
  {
    href: "/playbook/outlier-rule",
    title: "The 2x outlier rule",
    dek: "Stop guessing what works. Track, clone, repeat.",
  },
  {
    href: "/playbook/four-bots",
    title: "Four pits, one morning",
    dek: "SEO, video, X, ads — same three modes on every desk.",
  },
  {
    href: "/playbook/x-content-bot",
    title: "How the X pit actually runs",
    dek: "Research the last 48 hours. Write one post. Do not publish for you.",
  },
];

export default function PlaybookPage() {
  return (
    <Shell>
      <Ticker />
      <MarketingHeader />
      <main className="px-5 py-12 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
          Playbook
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight">
          Steal the loop even if you never pay us.
        </h1>
        <p className="mt-4 max-w-xl text-paper/65">
          MarketsXHub is a product. The compounding rule is not a secret. These
          pages are also how we eat our own SEO cooking.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="border border-line bg-ink-2 p-6 hover:glow-lime"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {post.title}
              </h2>
              <p className="mt-3 text-sm text-paper/60">{post.dek}</p>
            </Link>
          ))}
        </div>
      </main>
    </Shell>
  );
}
