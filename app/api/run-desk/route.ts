import { NextResponse } from "next/server";
import { z } from "zod";
import { runSeoDesk } from "@/lib/bots/run-seo";
import { runXDesk } from "@/lib/bots/run-x";
import { planLabel } from "@/lib/quota";
import { refundDeskRun, takeDeskRun } from "@/lib/quota-server";
import { allowRequest, RATE } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 120;

const nonNegInt = z.number().int().nonnegative().max(1_000_000_000);

const BrandSchema = z.object({
  name: z.string().min(1).max(200),
  niche: z.string().min(1).max(200),
  product: z.string().max(2000),
  audience: z.string().max(2000),
  cta: z.string().max(200),
  tone: z.string().max(2000),
  siteUrl: z.string().max(500),
  xHandle: z.string().max(80),
});

const Body = z.object({
  deskType: z.enum(["x", "seo"]),
  brand: BrandSchema,
  strategy: z
    .object({
      winningHook: z.string().max(2000),
      winningFormat: z.string().max(2000),
      avoid: z.string().max(2000),
      doubleDown: z.string().max(2000),
      updatedAt: z.string().max(40),
    })
    .optional(),
  recentPosts: z
    .array(
      z.object({
        date: z.string().max(40),
        kind: z.enum(["single", "thread"]),
        hook: z.string().max(500),
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
            impressions: nonNegInt,
            likes: nonNegInt,
            replies: nonNegInt,
            reposts: nonNegInt,
            loggedAt: z.string().max(40),
          })
          .optional(),
      }),
    )
    .max(20)
    .optional(),
  hint: z.string().max(200).optional(),
});

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

  const burstOk = await allowRequest(
    `run:${user.id}`,
    RATE.runDesk.limit,
    RATE.runDesk.window,
  );
  if (!burstOk) {
    return NextResponse.json(
      { error: "Too many runs in a short window. Wait a few minutes." },
      { status: 429 },
    );
  }

  let taken: Awaited<ReturnType<typeof takeDeskRun>>;
  try {
    taken = await takeDeskRun(user.id, deskType);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Quota check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (!taken.ok) {
    const left = deskType === "x" ? taken.quota.xLeft : taken.quota.seoLeft;
    const limit = deskType === "x" ? taken.quota.xLimit : taken.quota.seoLimit;
    const planName = planLabel(taken.quota.plan);
    const upgradeHint =
      taken.quota.plan === "free"
        ? " Upgrade to Desk or Floor."
        : " Resets next billing cycle.";
    return NextResponse.json(
      {
        error: `No ${deskType.toUpperCase()} runs left on ${planName} (${left}/${limit} this month).${upgradeHint}`,
        code: "QUOTA",
        quota: taken.quota,
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
        await refundDeskRun(user.id, deskType);
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
    await refundDeskRun(user.id, deskType);
    const message = err instanceof Error ? err.message : "Generate failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!result.ok) {
    await refundDeskRun(user.id, deskType);
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const remaining =
    deskType === "x" ? taken.quota.xLeft : taken.quota.seoLeft;

  return NextResponse.json({
    ...result.data,
    runsRemaining: remaining,
    serverQuota: true,
    quota: taken.quota,
  });
}
