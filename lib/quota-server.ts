import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";
import { quotaFromRow, type QuotaSnapshot } from "./quota";

type WorkspaceQuotaRow = {
  id: string;
  plan: string;
  founding: boolean | null;
  x_runs_used: number;
  seo_runs_used: number;
  billing_cycle_start: string | null;
};

function admin() {
  if (!isServiceRoleConfigured()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return createAdminClient();
}

async function loadWorkspace(userId: string): Promise<WorkspaceQuotaRow | null> {
  const { data, error } = await admin()
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
  userId: string,
  row: WorkspaceQuotaRow,
): Promise<WorkspaceQuotaRow> {
  const start = monthStartISO();
  if (row.billing_cycle_start && row.billing_cycle_start >= start) {
    return row;
  }
  const { data, error } = await admin()
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
  if (error || !data) {
    return { ...row, x_runs_used: 0, seo_runs_used: 0, billing_cycle_start: start };
  }
  return data as WorkspaceQuotaRow;
}

export async function readQuota(userId: string): Promise<QuotaSnapshot> {
  let row = await loadWorkspace(userId);
  if (!row) {
    const { error } = await admin().from("workspaces").insert({ user_id: userId });
    if (error && error.code !== "23505") throw new Error(error.message);
    row = await loadWorkspace(userId);
  }
  if (!row) throw new Error("Workspace missing");
  row = await maybeResetMonth(userId, row);
  return quotaFromRow(row);
}

export async function takeDeskRun(
  userId: string,
  desk: "x" | "seo",
): Promise<{ ok: true; quota: QuotaSnapshot } | { ok: false; quota: QuotaSnapshot }> {
  const before = await readQuota(userId);
  const used = desk === "x" ? before.xUsed : before.seoUsed;
  const left = desk === "x" ? before.xLeft : before.seoLeft;
  if (left <= 0) return { ok: false, quota: before };

  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = used + 1;
  const { data, error } = await admin()
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq(field, used)
    .select("id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    const again = await readQuota(userId);
    const againLeft = desk === "x" ? again.xLeft : again.seoLeft;
    if (againLeft <= 0) return { ok: false, quota: again };
    throw new Error("Quota update raced. Try the run again.");
  }
  return { ok: true, quota: quotaFromRow(data) };
}

export async function refundDeskRun(
  userId: string,
  desk: "x" | "seo",
): Promise<void> {
  const current = await readQuota(userId);
  const used = desk === "x" ? current.xUsed : current.seoUsed;
  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = Math.max(0, used - 1);
  await admin()
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq(field, used);
}
