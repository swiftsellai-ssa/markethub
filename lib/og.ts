import { siteUrl } from "./site-url";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const DEFAULT_OG_TITLE = "MarketsXHub — AI Growth Operating System";
export const DEFAULT_OG_METRIC = "2×";

export function ogImagePath(input?: { title?: string; metric?: string }): string {
  const params = new URLSearchParams();
  if (input?.title) params.set("title", input.title);
  if (input?.metric) params.set("metric", input.metric);
  const query = params.toString();
  return query ? `/api/og?${query}` : "/api/og";
}

export function ogImageUrl(input?: { title?: string; metric?: string }): string {
  return `${siteUrl()}${ogImagePath(input)}`;
}
