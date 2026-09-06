const STEPS = [
  { n: "01", title: "Connect your brand", body: "Name, niche, audience, CTA. Two minutes." },
  { n: "02", title: "AI writes one experiment", body: "One X post or one SEO page — not a dump of 40 drafts." },
  { n: "03", title: "You publish", body: "Copy, post, done. MarketsXHub never tweets as you." },
  { n: "04", title: "We track results", body: "Paste impressions, likes, replies, reposts." },
  { n: "05", title: "2× outlier detected", body: "Anything at least twice your average engagement." },
  { n: "06", title: "AI writes 3 variations", body: "Same winning format. New original copy." },
  { n: "07", title: "Winner becomes baseline", body: "The format that wins twice is the new default." },
];

export function Workflow() {
  return (
    <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-7">
      {STEPS.map((step) => (
        <li key={step.n} className="bg-void px-4 py-5">
          <p className="font-mono text-[11px] tracking-[0.22em] text-lime">
            {step.n}
          </p>
          <h3 className="mt-3 font-display text-lg font-bold tracking-tight">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-paper/60">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
