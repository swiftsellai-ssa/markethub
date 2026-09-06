const ITEMS = [
  "MarketsXHub",
  "X desk live",
  "SEO desk live",
  "2× = twice your average engagement",
  "Zero spend organic",
  "Founding 50 at $19/mo",
  "One post a day",
  "You publish. We keep score.",
];

export function Ticker() {
  const tape = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-b border-line bg-ink-2/80">
      <div className="ticker-track flex w-max gap-8 py-2 pr-8 font-mono text-[11px] tracking-[0.18em] text-lime">
        {tape.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            {item}
            <span className="text-cyan">✕</span>
          </span>
        ))}
      </div>
    </div>
  );
}
