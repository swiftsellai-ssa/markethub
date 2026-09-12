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

/** Founder emails in INSIGHTS_ALLOWED_EMAILS get Floor for product testing. */
export function isOperatorEmail(email: string | null | undefined): boolean {
  return canViewInsights(email);
}

export function insightsConfigured(): boolean {
  return allowedEmails().length > 0;
}
