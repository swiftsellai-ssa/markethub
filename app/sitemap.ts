import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://marketsxhub.com";
  const paths = [
    "",
    "/pricing",
    "/start",
    "/playbook",
    "/playbook/outlier-rule",
    "/playbook/four-bots",
    "/playbook/x-content-bot",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
