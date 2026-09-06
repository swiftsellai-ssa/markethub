export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const x = size === "sm" ? "text-lg" : "text-2xl";
  const rest = size === "sm" ? "text-sm" : "text-base";

  return (
    <span className="inline-flex items-baseline font-display font-extrabold tracking-tight">
      <span className={`${rest} text-paper`}>Markets</span>
      <span className={`${x} text-lime`}>X</span>
      <span className={`${rest} text-paper`}>Hub</span>
    </span>
  );
}
