import { seoSystemPrompt, seoUserPrompt, SEO_RUN_JSON_SCHEMA } from "@/lib/seo-prompt";
import type { Brand } from "@/lib/types";
import { z } from "zod";

const Out = z.object({
  keyword: z.string(),
  opportunity: z.string(),
  title: z.string(),
  meta: z.string(),
  slug: z.string(),
  markdown: z.string(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })),
});

export type SeoRunInput = {
  brand: Brand;
  hint?: string;
};

export type SeoRunResult =
  | { ok: true; data: z.infer<typeof Out> }
  | { ok: false; status: number; error: string };

export async function runSeoDesk(input: SeoRunInput): Promise<SeoRunResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      error:
        "Missing XAI_API_KEY. Add it to .env.local and restart to generate live briefs.",
    };
  }

  if (!input.brand.name || !input.brand.niche) {
    return {
      ok: false,
      status: 400,
      error: "Onboard a brand and niche first",
    };
  }

  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.6",
      input: [
        { role: "system", content: seoSystemPrompt(input.brand) },
        { role: "user", content: seoUserPrompt(input.brand, input.hint) },
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
    return { ok: false, status: 502, error: "No article returned" };
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, status: 502, error: "Invalid JSON" };
  }

  const out = Out.safeParse(json);
  if (!out.success) {
    return { ok: false, status: 502, error: "Schema mismatch" };
  }

  return { ok: true, data: out.data };
}
