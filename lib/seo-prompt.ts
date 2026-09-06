import type { Brand } from "./types";

export const SEO_RUN_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "keyword",
    "opportunity",
    "title",
    "meta",
    "slug",
    "markdown",
    "faqs",
  ],
  properties: {
    keyword: { type: "string" },
    opportunity: {
      type: "string",
      description: "Why this keyword is winnable in 60-90 days.",
    },
    title: { type: "string", description: "Under 60 characters, keyword first." },
    meta: { type: "string", description: "Under 155 characters, benefit-led." },
    slug: { type: "string" },
    markdown: {
      type: "string",
      description: "Full article in markdown with H2s, FAQ, and one CTA.",
    },
    faqs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["q", "a"],
        properties: {
          q: { type: "string" },
          a: { type: "string" },
        },
      },
    },
  },
} as const;

export function seoSystemPrompt(brand: Brand): string {
  return `You are the SEO bot for ${brand.name}.

Product: ${brand.product}
Niche: ${brand.niche}
Audience: ${brand.audience}
CTA: ${brand.cta}
Site: ${brand.siteUrl || "(none yet)"}

Write one article built to rank. No keyword stuffing. Answer the query in the first two sentences. Include a FAQ. One CTA. Do not invent rankings, traffic, or customer counts.`;
}

export function seoUserPrompt(brand: Brand, hint?: string): string {
  return `Find one keyword ${brand.name} can realistically rank for.

Filters to prefer:
- Informational or commercial intent
- A modifier like: tool, guide, how to, vs, alternative, template, checker
- Weak SERP: thin pages, no FAQ, generic AI sludge in the top 10

${hint ? `User hint: ${hint}` : "Pick the best opportunity from web search."}

Then write the article for that keyword. Title under 60 chars. Meta under 155. Markdown with H2s. FAQ with 5 questions. CTA to ${brand.cta}.`;
}
