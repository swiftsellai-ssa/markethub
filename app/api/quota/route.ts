import { NextResponse } from "next/server";
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
    const quota = await readQuota(user.id);
    return NextResponse.json(quota);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Quota read failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
