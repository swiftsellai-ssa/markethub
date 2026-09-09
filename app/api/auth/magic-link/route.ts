import { NextResponse } from "next/server";
import { z } from "zod";
import { allowRequest, clientIp, RATE } from "@/lib/rate-limit";
import { safeNextPath } from "@/lib/safe-path";
import { siteUrl } from "@/lib/site-url";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  email: z.string().email().max(200),
  next: z.string().max(200).optional(),
  source: z.string().max(40).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Auth is not configured yet" },
      { status: 503 },
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const ip = clientIp(req);

  const emailOk = await allowRequest(
    `magic:email:${email}`,
    RATE.magicLinkEmail.limit,
    RATE.magicLinkEmail.window,
  );
  const ipOk = await allowRequest(
    `magic:ip:${ip}`,
    RATE.magicLinkIp.limit,
    RATE.magicLinkIp.window,
  );
  if (!emailOk || !ipOk) {
    return NextResponse.json(
      { error: "Too many magic links. Try again in an hour." },
      { status: 429 },
    );
  }

  const next = safeNextPath(parsed.data.next);
  const redirect = `${siteUrl(req)}${next}`;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not send magic link";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, source: parsed.data.source ?? "login" });
}
