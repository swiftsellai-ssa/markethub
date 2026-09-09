export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/hub";
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return "/hub";
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return "/hub";
  if (trimmed.includes("://") || trimmed.includes("\\")) return "/hub";
  return trimmed.slice(0, 200);
}
