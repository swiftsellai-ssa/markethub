import { NextResponse } from "next/server";
import { z } from "zod";
import { FOUNDING_CAP } from "@/lib/founding";
import { allowRequest, clientIp, RATE } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const Body = z.object({
  email: z.string().email().max(200),
  source: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const source = (parsed.data.source ?? "founding_50_modal").slice(0, 80);

  const ipOk = await allowRequest(
    `founding:ip:${clientIp(req)}`,
    RATE.foundingIp.limit,
    RATE.foundingIp.window,
  );
  if (!ipOk) {
    return NextResponse.json(
      { error: "Too many founding requests. Try again later." },
      { status: 429 },
    );
  }

  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("founding_lead", email, source);
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const supabase = createAdminClient();

  const { count, error: countErr } = await supabase
    .from("founding_leads")
    .select("*", { count: "exact", head: true });

  if (countErr) {
    console.error("founding_lead_count", countErr.message);
    return NextResponse.json({ error: "Failed to record lead" }, { status: 500 });
  }

  const { data: existing } = await supabase
    .from("founding_leads")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { message: "Seat already claimed with this email", success: true },
      { status: 200 },
    );
  }

  if ((count ?? 0) >= FOUNDING_CAP) {
    return NextResponse.json(
      { error: "Founding 50 is full. Desk is $39/mo." },
      { status: 409 },
    );
  }

  const { error } = await supabase
    .from("founding_leads")
    .insert({ email, source });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "Seat already claimed with this email", success: true },
        { status: 200 },
      );
    }
    console.error("founding_lead_error", error.message);
    return NextResponse.json(
      { error: "Failed to record lead" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
