"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Ensure a workspace row exists for the signed-in user (no Auth trigger required). */
export async function ensureWorkspace(
  supabase: SupabaseClient,
  user: User,
): Promise<{ ok: boolean; error?: string }> {
  const { data: existing, error: selectErr } = await supabase
    .from("workspaces")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (selectErr) {
    return { ok: false, error: selectErr.message };
  }
  if (existing) {
    return { ok: true };
  }

  const { error: insertErr } = await supabase.from("workspaces").insert({
    user_id: user.id,
  });

  if (insertErr) {
    // Race: another tab/trigger created it
    if (insertErr.code === "23505") {
      return { ok: true };
    }
    return { ok: false, error: insertErr.message };
  }

  return { ok: true };
}
