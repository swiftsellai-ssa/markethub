import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
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

  const days = Number(new URL(req.url).searchParams.get("days") ?? "7");
  const windowDays = [7, 30, 90].includes(days) ? days : 7;

  const { data, error } = await supabase.rpc("analytics_funnel", {
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
