import { NextResponse } from "next/server";
import { canViewInsights, insightsConfigured } from "@/lib/insights-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!insightsConfigured()) {
    return NextResponse.json(
      {
        error: "Insights is locked. Set INSIGHTS_ALLOWED_EMAILS.",
        code: "INSIGHTS_UNCONFIGURED",
        rows: [],
      },
      { status: 403 },
    );
  }

  if (!canViewInsights(user.email)) {
    return NextResponse.json(
      { error: "Insights is operator-only.", code: "INSIGHTS_FORBIDDEN", rows: [] },
      { status: 403 },
    );
  }

  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Missing service role", rows: [] },
      { status: 503 },
    );
  }

  const days = Number(new URL(req.url).searchParams.get("days") ?? "7");
  const windowDays = [7, 30, 90].includes(days) ? days : 7;

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("analytics_funnel", {
    days: windowDays,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, rows: [] },
      { status: 500 },
    );
  }

  return NextResponse.json({
    days: windowDays,
    rows: (data ?? []) as Array<{ name: string; n: number }>,
  });
}
