import { NextResponse } from "next/server";
import { z } from "zod";
import { runSeoDesk } from "@/lib/bots/run-seo";
import { runXDesk } from "@/lib/bots/run-x";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 120;

const BrandSchema = z.object({
  name: z.string(),
  niche: z.string(),
  product: z.string(),
  audience: z.string(),
  cta: z.string(),
  tone: z.string(),
  siteUrl: z.string(),
  xHandle: z.string(),
});

const Body = z.object({
  deskType: z.enum(["x", "seo"]),
  brand: BrandSchema,
  strategy: z
    .object({
      winningHook: z.string(),
      winningFormat: z.string(),
      avoid: z.string(),
      doubleDown: z.string(),
      updatedAt: z.string(),
    })
    .optional(),
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
  hint: z.string().optional(),
});

type QuotaRow = { allowed: boolean; remaining_runs: number };

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Sign in required to run a desk.", code: "AUTH_REQUIRED" },
      { status: 401 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to run X or SEO.", code: "AUTH_REQUIRED" },
      { status: 401 },
    );
  }

  const { deskType, brand, strategy, recentPosts, hint } = parsed.data;

  const { data: quotaCheck, error: rpcErr } = await supabase.rpc(
    "consume_bot_run",
    { target_desk: deskType },
  );

  const row = (Array.isArray(quotaCheck) ? quotaCheck[0] : quotaCheck) as
    | QuotaRow
    | undefined;

  if (rpcErr || !row?.allowed) {
    return NextResponse.json(
      {
        error:
          "Quota exhausted for this billing cycle. Upgrade to Desk or Floor.",
      },
      { status: 403 },
    );
  }

  let result:
    | Awaited<ReturnType<typeof runXDesk>>
    | Awaited<ReturnType<typeof runSeoDesk>>;

  try {
    if (deskType === "x") {
      if (!strategy) {
        await supabase.rpc("refund_bot_run", { target_desk: deskType });
        return NextResponse.json(
          { error: "strategy is required for the X desk" },
          { status: 400 },
        );
      }
      result = await runXDesk({ brand, strategy, recentPosts });
    } else {
      result = await runSeoDesk({ brand, hint });
    }
  } catch (err) {
    await supabase.rpc("refund_bot_run", { target_desk: deskType });
    const message = err instanceof Error ? err.message : "Generate failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!result.ok) {
    await supabase.rpc("refund_bot_run", { target_desk: deskType });
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ...result.data,
    runsRemaining: row.remaining_runs,
    serverQuota: true,
  });
}
