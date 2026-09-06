import { NextResponse } from "next/server";
import { z } from "zod";
import { seoSystemPrompt, seoUserPrompt, SEO_RUN_JSON_SCHEMA } from "@/lib/seo-prompt";
import type { Brand } from "@/lib/types";

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
  hint: z.string().optional(),
});

const Out = z.object({
  keyword: z.string(),
  opportunity: z.string(),
  title: z.string(),
  meta: z.string(),
  slug: z.string(),
  markdown: z.string(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })),
});

export async function POST(req: Request) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing XAI_API_KEY. Add it to .env.local and restart to generate live briefs.",
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
  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.6",
      input: [
        { role: "system", content: seoSystemPrompt(brand) },
        { role: "user", content: seoUserPrompt(brand, parsed.data.hint) },
      ],
      tools: [{ type: "web_search" }],
      text: {
        format: {
          type: "json_schema",
          name: "seo_brief",
          strict: true,
          schema: SEO_RUN_JSON_SCHEMA,
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
    return NextResponse.json({ error: "No article returned" }, { status: 502 });
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 502 });
  }

  const out = Out.safeParse(json);
  if (!out.success) {
    return NextResponse.json({ error: "Schema mismatch" }, { status: 502 });
  }

  return NextResponse.json(out.data);
}
