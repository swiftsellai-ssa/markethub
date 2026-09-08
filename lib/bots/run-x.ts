import {
  contentTypeForDate,
  kindForDate,
  todayISO,
  weekdayName,
} from "@/lib/calendar";
import { systemPrompt, userPrompt, X_RUN_JSON_SCHEMA } from "@/lib/prompts";
import type { Brand, Strategy } from "@/lib/types";
import { z } from "zod";

const RunOutput = z.object({
  research: z.object({
    topFormats: z.array(z.string()),
    topics: z.array(z.string()),
    gaps: z.array(z.string()),
    polarizingTake: z.string(),
    notes: z.string(),
  }),
  post: z.object({
    kind: z.enum(["single", "thread"]),
    tweets: z.array(z.string()),
    hook: z.string(),
    topic: z.string(),
    format: z.string(),
    contentType: z.enum(["insight", "howto", "story", "opinion", "resource"]),
  }),
  strategyUpdate: z.string(),
});

export type XRunInput = {
  brand: Brand;
  strategy: Strategy;
  recentPosts?: Array<{
    date: string;
    kind: "single" | "thread";
    hook: string;
    contentType: "insight" | "howto" | "story" | "opinion" | "resource";
    status: "draft" | "ready" | "posted" | "skipped";
    metrics?: {
      impressions: number;
      likes: number;
      replies: number;
      reposts: number;
      loggedAt: string;
    };
  }>;
};

export type XRunResult =
  | { ok: true; data: z.infer<typeof RunOutput> }
  | { ok: false; status: number; error: string };

export async function runXDesk(input: XRunInput): Promise<XRunResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        "Missing XAI_API_KEY. Add it to .env.local (console.x.ai) and restart the dev server.",
    };
  }

  if (!input.brand.name || !input.brand.niche) {
    return {
      ok: false,
      status: 400,
      error: "Onboard a brand and niche first",
    };
  }

  const recent = input.recentPosts ?? [];
  const date = todayISO();
  const lastKind = recent[0]?.kind;
  const from = new Date();
  from.setDate(from.getDate() - 2);
  const fromDate = from.toISOString().slice(0, 10);

  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.6",
      input: [
        { role: "system", content: systemPrompt(input.brand) },
        {
          role: "user",
          content: userPrompt({
            brand: input.brand,
            date,
            weekday: weekdayName(date),
            contentType: contentTypeForDate(date),
            kind: kindForDate(date, lastKind),
            strategy: input.strategy,
            recentPosts: recent,
          }),
        },
      ],
      tools: [{ type: "x_search", from_date: fromDate }],
      text: {
        format: {
          type: "json_schema",
          name: "x_content_run",
          strict: true,
          schema: X_RUN_JSON_SCHEMA,
        },
      },
    }),
  });

  const payload = (await response.json()) as {
    output_text?: string;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    return {
      ok: false,
      status: 502,
      error: payload.error?.message || "xAI request failed",
    };
  }

  const text =
    payload.output_text ||
    payload.output
      ?.find((item) => item.type === "message")
      ?.content?.find((c) => c.type === "output_text")?.text;

  if (!text) {
    return {
      ok: false,
      status: 502,
      error: "Grok returned no structured post",
    };
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Grok returned invalid JSON",
    };
  }

  const out = RunOutput.safeParse(json);
  if (!out.success) {
    return {
      ok: false,
      status: 502,
      error: "Grok JSON did not match the post schema",
    };
  }

  const tweets = out.data.post.tweets
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.length > 240 ? `${t.slice(0, 237)}...` : t));

  if (tweets.length === 0) {
    return { ok: false, status: 502, error: "Empty post" };
  }

  return {
    ok: true,
    data: {
      ...out.data,
      post: {
        ...out.data.post,
        tweets:
          out.data.post.kind === "single"
            ? tweets.slice(0, 1)
            : tweets.slice(0, 7),
      },
    },
  };
}
