import type { SupabaseClient } from "@supabase/supabase-js";
import { quotaFromRow, type QuotaSnapshot } from "./quota";

type WorkspaceQuotaRow = {
  id: string;
  plan: string;
  founding: boolean | null;
  x_runs_used: number;
  seo_runs_used: number;
  billing_cycle_start: string | null;
};

async function loadWorkspace(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkspaceQuotaRow | null> {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as WorkspaceQuotaRow | null;
}

function monthStartISO(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

async function maybeResetMonth(
  supabase: SupabaseClient,
  userId: string,
  row: WorkspaceQuotaRow,
): Promise<WorkspaceQuotaRow> {
  const start = monthStartISO();
  if (row.billing_cycle_start && row.billing_cycle_start >= start) {
    return row;
  }
  const { data, error } = await supabase
    .from("workspaces")
    .update({
      x_runs_used: 0,
      seo_runs_used: 0,
      billing_cycle_start: start,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .select("id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start")
    .single();
  if (error || !data) return { ...row, x_runs_used: 0, seo_runs_used: 0, billing_cycle_start: start };
  return data as WorkspaceQuotaRow;
}

export async function readQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<QuotaSnapshot> {
  let row = await loadWorkspace(supabase, userId);
  if (!row) {
    const { error } = await supabase.from("workspaces").insert({ user_id: userId });
    if (error && error.code !== "23505") throw new Error(error.message);
    row = await loadWorkspace(supabase, userId);
  }
  if (!row) throw new Error("Workspace missing");
  row = await maybeResetMonth(supabase, userId, row);
  return quotaFromRow(row);
}

export async function takeDeskRun(
  supabase: SupabaseClient,
  userId: string,
  desk: "x" | "seo",
): Promise<{ ok: true; quota: QuotaSnapshot } | { ok: false; quota: QuotaSnapshot }> {
  const before = await readQuota(supabase, userId);
  const used = desk === "x" ? before.xUsed : before.seoUsed;
  const left = desk === "x" ? before.xLeft : before.seoLeft;
  if (left <= 0) return { ok: false, quota: before };

  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = used + 1;
  const { data, error } = await supabase
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq(field, used)
    .select("id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    const again = await readQuota(supabase, userId);
    const againLeft = desk === "x" ? again.xLeft : again.seoLeft;
    if (againLeft <= 0) return { ok: false, quota: again };
    throw new Error("Quota update raced. Try the run again.");
  }
  return { ok: true, quota: quotaFromRow(data) };
}

export async function refundDeskRun(
  supabase: SupabaseClient,
  userId: string,
  desk: "x" | "seo",
): Promise<void> {
  const current = await readQuota(supabase, userId);
  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = Math.max(0, (desk === "x" ? current.xUsed : current.seoUsed) - 1);
  await supabase
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
}
