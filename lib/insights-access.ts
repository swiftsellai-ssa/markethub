function allowedEmails(): string[] {
  const raw =
    process.env.INSIGHTS_ALLOWED_EMAILS || process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function canViewInsights(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = allowedEmails();
  if (allow.length === 0) return false;
  return allow.includes(email.trim().toLowerCase());
}

export function insightsConfigured(): boolean {
  return allowedEmails().length > 0;
}
