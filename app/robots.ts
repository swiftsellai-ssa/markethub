import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://marketsxhub.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/hub", "/api"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
