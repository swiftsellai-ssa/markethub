import { NextResponse } from "next/server";
import { isOperatorEmail } from "@/lib/insights-access";
import { quotaFromRow } from "@/lib/quota";
import { readQuota } from "@/lib/quota-server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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
  try {
    const quota = await readQuota(user.id, user.email);
    return NextResponse.json(quota);
  } catch (err) {
    console.error("quota_route", err);
    return NextResponse.json(
      quotaFromRow({
        plan: isOperatorEmail(user.email) ? "floor" : "free",
        x_runs_used: 0,
        seo_runs_used: 0,
      }),
    );
  }
}
