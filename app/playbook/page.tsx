import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";

const POSTS = [
  {
    href: "/playbook/outlier-rule",
    title: "The 2x outlier rule",
    dek: "Stop guessing what works. Track, clone, repeat.",
  },
  {
    href: "/playbook/four-bots",
    title: "Four bots, one morning",
    dek: "SEO, video, X, ads — same three modes on every desk.",
  },
  {
    href: "/playbook/x-content-bot",
    title: "How the X Content Bot actually runs",
    dek: "Research the last 48 hours. Write one post. Do not publish for you.",
  },
];

export default function PlaybookPage() {
  return (
    <div className="min-h-screen bg-paper text-ink paper-grid">
      <MarketingHeader />
      <main className="px-5 py-12 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
          Playbook
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight">
          Steal the loop even if you never pay us.
        </h1>
        <p className="mt-4 max-w-xl text-ink/70">
          MarketHub is a product. The compounding rule is not a secret. These
          pages are also how we eat our own SEO cooking.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="border border-ink/10 bg-paper p-6 hover:bg-lime"
            >
              <h2 className="font-serif text-2xl">{post.title}</h2>
              <p className="mt-3 text-sm text-ink/65">{post.dek}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
