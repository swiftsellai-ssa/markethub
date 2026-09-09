const MAX = 1_000_000_000;

export function nonNegativeInt(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(0, Math.floor(n)), MAX);
}
