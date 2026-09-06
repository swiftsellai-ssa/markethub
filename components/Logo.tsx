export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "text-base" : "text-xl";

  return (
    <span
      className={`inline-block font-display font-extrabold tracking-tight ${cls}`}
      aria-label="MarketsXHub"
    >
      Markets<span className="text-lime">X</span>Hub
    </span>
  );
}
