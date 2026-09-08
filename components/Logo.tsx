export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "text-[15px]" : "text-lg";

  return (
    <span
      className={`inline-block whitespace-nowrap font-display font-extrabold tracking-[-0.06em] ${cls}`}
      aria-label="MarketsXHub"
    >
      Markets<span className="text-lime">X</span>Hub
    </span>
  );
}
