export function Logo({
  invert = false,
  size = "md",
}: {
  invert?: boolean;
  size?: "sm" | "md";
}) {
  const mark = invert ? "bg-ink" : "bg-lime";
  const bars = invert ? "bg-paper" : "bg-ink";
  const word = invert ? "text-ink" : "text-paper";
  const h = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <span className={`inline-flex items-center gap-2 ${word}`}>
      <span className={`${h} ${mark} grid grid-cols-4 gap-px p-1.5`}>
        <span className={`${bars} self-end h-2`} />
        <span className={`${bars} self-end h-3 opacity-70`} />
        <span className={`${bars} self-end h-4 opacity-45`} />
        <span className={`${bars} self-end h-2.5`} />
      </span>
      <span className="font-serif text-xl tracking-tight">MarketHub</span>
    </span>
  );
}
