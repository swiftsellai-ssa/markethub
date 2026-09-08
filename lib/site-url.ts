export function siteUrl(req?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (req) return new URL(req.url).origin;
  return "https://www.marketsxhub.com";
}
