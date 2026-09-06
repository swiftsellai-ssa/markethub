import type { Brand, ContentType, Post, PostKind, Strategy } from "./types";
import { contentTypeLabel } from "./calendar";

export const X_RUN_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["research", "post", "strategyUpdate"],
  properties: {
    research: {
      type: "object",
      additionalProperties: false,
      required: ["topFormats", "topics", "gaps", "polarizingTake", "notes"],
      properties: {
        topFormats: {
          type: "array",
          items: { type: "string" },
          description: "Top 3 content formats performing on X right now.",
        },
        topics: {
          type: "array",
          items: { type: "string" },
          description: "Topics generating the most discussion.",
        },
        gaps: {
          type: "array",
          items: { type: "string" },
          description: "Angles nobody has covered this week.",
        },
        polarizingTake: {
          type: "string",
          description: "One counterintuitive take in the niche.",
        },
        notes: {
          type: "string",
          description: "Short research brief: hooks, lengths, what is getting replies.",
        },
      },
    },
    post: {
      type: "object",
      additionalProperties: false,
      required: ["kind", "tweets", "hook", "topic", "format", "contentType"],
      properties: {
        kind: { type: "string", enum: ["single", "thread"] },
        tweets: {
          type: "array",
          items: { type: "string" },
          description: "Each tweet under 240 characters. Single = 1 item. Thread = 5-7 items.",
        },
        hook: { type: "string" },
        topic: { type: "string" },
        format: { type: "string" },
        contentType: {
          type: "string",
          enum: ["insight", "howto", "story", "opinion", "resource"],
        },
      },
    },
    strategyUpdate: {
      type: "string",
      description: "One paragraph: what to repeat, what to avoid tomorrow.",
    },
  },
} as const;

export function systemPrompt(brand: Brand): string {
  return `You are the daily X content bot for ${brand.name}.

MY DETAILS:
- Niche: ${brand.niche}
- Product: ${brand.product}
- Target audience: ${brand.audience}
- CTA: ${brand.cta}
- Tone: ${brand.tone}
- Site: ${brand.siteUrl || "(none yet)"}

RULES:
- Never start with "I am excited to share" or "In today's world".
- First line must stop the scroll: bold claim, question, or counterintuitive statement.
- Each tweet under 240 characters. Short sentences. No filler. No hashtags.
- Single tweet: one retweetable thought, under 240 chars, no thread needed.
- Thread: tweet 1 hook, tweet 2 problem/context, tweets 3-5 insight (one point each), tweet 6 takeaway, tweet 7 CTA. Every tweet must stand alone.
- Do not invent metrics, customer counts, or revenue.
- Original content. Model formats you found, never copy wording.
- Soft CTA only when it earns it. Prefer a sharp question over a pitch.
- You cannot publish to X. You write copy-paste ready posts.`;
}

export function userPrompt(input: {
  brand: Brand;
  date: string;
  weekday: string;
  contentType: ContentType;
  kind: PostKind;
  strategy: Strategy;
  recentPosts: Array<Pick<Post, "date" | "kind" | "hook" | "contentType" | "status" | "metrics">>;
}): string {
  const recent = input.recentPosts
    .slice(0, 8)
    .map((p) => {
      const score = p.metrics
        ? `impressions ${p.metrics.impressions}, likes ${p.metrics.likes}`
        : p.status;
      return `- ${p.date} [${p.kind}/${p.contentType}] ${p.hook} (${score})`;
    })
    .join("\n");

  return `TODAY: ${input.date} (${input.weekday})
WRITE: ${input.kind === "thread" ? "one thread" : "one single tweet"}
CONTENT TYPE: ${contentTypeLabel(input.contentType)} — ${typeBrief(input.contentType)}

CURRENT STRATEGY:
- Winning hook: ${input.strategy.winningHook || "none yet"}
- Winning format: ${input.strategy.winningFormat || "none yet"}
- Avoid: ${input.strategy.avoid || "none yet"}
- Double down: ${input.strategy.doubleDown || "none yet"}

RECENT POSTS:
${recent || "(none)"}

PART 1 — RESEARCH (use X search, last 48 hours):
Search X for: ${input.brand.niche}, AI marketing agents, founder content systems, Grok bots marketing.
Find top performing posts (not replies). Note hook format, length, topic, what is getting replies.
Find one gap and one polarizing take.

PART 2 — WRITE:
If a winning format exists, use it as the template and write a new original post.
Otherwise model the current top performer you found, then write our version for ${input.brand.name}.

Proven formats to steal structurally (not wording):
- "[Number] things that [bad outcome] most people don't know"
- "Stop [popular advice]. Here's what actually works."
- "How to [result] in [time] without [barrier]"
- "If you're not doing this, you're losing [specific thing]"
- One bold observation that is retweetable alone.

Return JSON only matching the schema.`;
}

function typeBrief(type: ContentType): string {
  switch (type) {
    case "insight":
      return "one counterintuitive finding from the niche";
    case "howto":
      return "one specific actionable tip";
    case "story":
      return "one experience or result — building MarketHub by using MarketHub is fair game";
    case "opinion":
      return "take a clear side on a niche debate";
    case "resource":
      return "something genuinely useful, not a dump of links";
  }
}
