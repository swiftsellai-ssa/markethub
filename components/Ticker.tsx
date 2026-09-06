const ITEMS = [
  "X DESK LIVE",
  "SEO DESK LIVE",
  "2x OUTLIERS CLONE",
  "ZERO SPEND ORGANIC",
  "FOUNDING 50 @ $19",
  "ONE POST A DAY",
  "DATA DECIDES",
  "MARKETSXHUB",
];

export function Ticker() {
  const tape = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-b border-line bg-ink-2/80">
      <div className="ticker-track flex w-max gap-8 py-2 pr-8 font-mono text-[11px] uppercase tracking-[0.28em] text-lime">
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
