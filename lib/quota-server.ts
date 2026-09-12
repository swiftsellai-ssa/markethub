import { isOperatorEmail } from "@/lib/insights-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";
import { quotaFromRow, type QuotaSnapshot } from "./quota";

const QUOTA_SELECT =
  "id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start, stripe_subscription_id, stripe_customer_id";
const QUOTA_SELECT_SLIM =
  "id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start";

type WorkspaceQuotaRow = {
  id: string;
  plan: string;
  founding: boolean | null;
  x_runs_used: number;
  seo_runs_used: number;
  billing_cycle_start: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
};

function admin() {
  if (!isServiceRoleConfigured()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return createAdminClient();
}

function fallbackQuota(email?: string | null): QuotaSnapshot {
  return quotaFromRow({
    plan: isOperatorEmail(email) ? "floor" : "free",
    founding: false,
    x_runs_used: 0,
    seo_runs_used: 0,
  });
}

async function loadWorkspace(userId: string): Promise<WorkspaceQuotaRow | null> {
  const full = await admin()
    .from("workspaces")
    .select(QUOTA_SELECT)
    .eq("user_id", userId)
    .maybeSingle();
  if (!full.error) return (full.data as WorkspaceQuotaRow | null) ?? null;

  const slim = await admin()
    .from("workspaces")
    .select(QUOTA_SELECT_SLIM)
    .eq("user_id", userId)
    .maybeSingle();
  if (slim.error) throw new Error(slim.error.message);
  if (!slim.data) return null;
  return {
    ...(slim.data as Omit<
      WorkspaceQuotaRow,
      "stripe_subscription_id" | "stripe_customer_id"
    >),
    stripe_subscription_id: null,
    stripe_customer_id: null,
  };
}

function monthStartISO(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

async function maybeResetMonth(
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
    .select(QUOTA_SELECT_SLIM)
    .maybeSingle();
  if (error || !data) {
    return { ...row, x_runs_used: 0, seo_runs_used: 0, billing_cycle_start: start };
  }
  return { ...row, ...(data as WorkspaceQuotaRow) };
}

async function ensureWorkspace(
  userId: string,
  operator: boolean,
): Promise<WorkspaceQuotaRow> {
  let row = await loadWorkspace(userId);
  if (row) return row;

  const { error } = await admin().from("workspaces").insert({
    user_id: userId,
    plan: operator ? "floor" : "free",
    x_runs_used: 0,
    seo_runs_used: 0,
  });

  if (error && error.code !== "23505") {
    console.error("workspace_insert", error.code, error.message);
    throw new Error(error.message);
  }

  row = await loadWorkspace(userId);
  if (!row) throw new Error("Workspace missing");
  return row;
}

async function grantFloor(row: WorkspaceQuotaRow): Promise<WorkspaceQuotaRow> {
  if (row.plan === "floor") return row;
  const { data, error } = await admin()
    .from("workspaces")
    .update({
      plan: "floor",
      founding: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .select(QUOTA_SELECT_SLIM)
    .maybeSingle();
  if (error) {
    console.error("grant_floor", error.message);
    return { ...row, plan: "floor", founding: false };
  }
  if (!data) return { ...row, plan: "floor", founding: false };
  return { ...row, ...(data as WorkspaceQuotaRow), plan: "floor" };
}

async function dropUnpaidPaidPlan(
  row: WorkspaceQuotaRow,
): Promise<WorkspaceQuotaRow> {
  if (row.plan !== "desk" && row.plan !== "floor") return row;
  if (row.stripe_subscription_id || row.stripe_customer_id) return row;

  const { data, error } = await admin()
    .from("workspaces")
    .update({
      plan: "free",
      founding: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .is("stripe_subscription_id", null)
    .is("stripe_customer_id", null)
    .select(QUOTA_SELECT_SLIM)
    .maybeSingle();
  if (error) {
    console.error("drop_unpaid_plan", error.message);
    return row;
  }
  if (!data) return row;
  return { ...row, ...(data as WorkspaceQuotaRow) };
}

export async function readQuota(
  userId: string,
  email?: string | null,
): Promise<QuotaSnapshot> {
  const operator = isOperatorEmail(email);
  try {
    let row = await ensureWorkspace(userId, operator);
    row = await maybeResetMonth(row);
    row = operator ? await grantFloor(row) : await dropUnpaidPaidPlan(row);
    return quotaFromRow(row);
  } catch (err) {
    console.error("read_quota", err);
    return fallbackQuota(email);
  }
}

export async function takeDeskRun(
  userId: string,
  desk: "x" | "seo",
  email?: string | null,
): Promise<{ ok: true; quota: QuotaSnapshot } | { ok: false; quota: QuotaSnapshot }> {
  const operator = isOperatorEmail(email);
  const before = await readQuota(userId, email);
  const used = desk === "x" ? before.xUsed : before.seoUsed;
  const left = desk === "x" ? before.xLeft : before.seoLeft;
  if (left <= 0 && !operator) return { ok: false, quota: before };
  if (left <= 0 && operator) {
    return { ok: true, quota: before };
  }

  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = used + 1;
  const { data, error } = await admin()
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq(field, used)
    .select(QUOTA_SELECT_SLIM)
    .maybeSingle();
  if (error) {
    console.error("take_desk_run", error.message);
    if (operator) return { ok: true, quota: before };
    throw new Error(error.message);
  }
  if (!data) {
    const again = await readQuota(userId, email);
    const againLeft = desk === "x" ? again.xLeft : again.seoLeft;
    if (againLeft <= 0 && !operator) return { ok: false, quota: again };
    return { ok: true, quota: again };
  }
  return { ok: true, quota: quotaFromRow(data) };
}

export async function refundDeskRun(
  userId: string,
  desk: "x" | "seo",
  email?: string | null,
): Promise<void> {
  if (isOperatorEmail(email)) return;
  const current = await readQuota(userId, email);
  const used = desk === "x" ? current.xUsed : current.seoUsed;
  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = Math.max(0, used - 1);
  await admin()
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq(field, used);
}
