import { NextResponse } from "next/server";
import { z } from "zod";
import { isTrackEventName } from "@/lib/analytics-events";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  name: z.string().min(1).max(64),
  path: z.string().max(200).optional(),
  props: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !isTrackEventName(parsed.data.name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;

    const { error } = await supabase.from("analytics_events").insert({
      name: parsed.data.name,
      path: parsed.data.path ?? null,
      props: parsed.data.props ?? {},
      user_id: userId,
    });
    if (error) console.error("analytics_insert", error.message);
  } catch (err) {
    console.error("analytics_event", err);
  }

  return NextResponse.json({ ok: true });
}
