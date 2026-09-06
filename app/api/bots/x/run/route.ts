import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contentTypeForDate,
  kindForDate,
  todayISO,
  weekdayName,
} from "@/lib/calendar";
import { systemPrompt, userPrompt, X_RUN_JSON_SCHEMA } from "@/lib/prompts";
import type { Brand, Strategy } from "@/lib/types";

export const maxDuration = 120;

const Body = z.object({
  brand: z.object({
    name: z.string(),
    niche: z.string(),
    product: z.string(),
    audience: z.string(),
    cta: z.string(),
    tone: z.string(),
    siteUrl: z.string(),
    xHandle: z.string(),
  }),
  strategy: z.object({
    winningHook: z.string(),
    winningFormat: z.string(),
    avoid: z.string(),
    doubleDown: z.string(),
    updatedAt: z.string(),
  }),
  recentPosts: z
    .array(
      z.object({
        date: z.string(),
        kind: z.enum(["single", "thread"]),
        hook: z.string(),
        contentType: z.enum([
          "insight",
          "howto",
          "story",
          "opinion",
          "resource",
        ]),
        status: z.enum(["draft", "ready", "posted", "skipped"]),
        metrics: z
          .object({
            impressions: z.number(),
            likes: z.number(),
            replies: z.number(),
            reposts: z.number(),
            loggedAt: z.string(),
          })
          .optional(),
      }),
    )
    .optional(),
});

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

export async function POST(req: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing XAI_API_KEY. Add it to .env.local (console.x.ai) and restart the dev server.",
      },
      { status: 503 },
    );
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!parsed.data.brand.name || !parsed.data.brand.niche) {
    return NextResponse.json(
      { error: "Onboard a brand and niche first" },
      { status: 400 },
    );
  }

  const brand = parsed.data.brand as Brand;
  const strategy = parsed.data.strategy as Strategy;
  const recent = parsed.data.recentPosts ?? [];
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
        { role: "system", content: systemPrompt(brand) },
        {
          role: "user",
          content: userPrompt({
            brand,
            date,
            weekday: weekdayName(date),
            contentType: contentTypeForDate(date),
            kind: kindForDate(date, lastKind),
            strategy,
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
    return NextResponse.json(
      { error: payload.error?.message || "xAI request failed" },
      { status: 502 },
    );
  }

  const text =
    payload.output_text ||
    payload.output
      ?.find((item) => item.type === "message")
      ?.content?.find((c) => c.type === "output_text")?.text;

  if (!text) {
    return NextResponse.json(
      { error: "Grok returned no structured post" },
      { status: 502 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Grok returned invalid JSON" },
      { status: 502 },
    );
  }

  const out = RunOutput.safeParse(json);
  if (!out.success) {
    return NextResponse.json(
      { error: "Grok JSON did not match the post schema" },
      { status: 502 },
    );
  }

  const tweets = out.data.post.tweets
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.length > 240 ? `${t.slice(0, 237)}...` : t));

  if (tweets.length === 0) {
    return NextResponse.json({ error: "Empty post" }, { status: 502 });
  }

  return NextResponse.json({
    ...out.data,
    post: {
      ...out.data.post,
      tweets:
        out.data.post.kind === "single" ? tweets.slice(0, 1) : tweets.slice(0, 7),
    },
  });
}
