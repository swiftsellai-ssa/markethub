import { isOperatorEmail } from "@/lib/insights-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";
import { quotaFromRow, type QuotaSnapshot } from "./quota";

const QUOTA_SELECT =
  "id, plan, founding, x_runs_used, seo_runs_used, billing_cycle_start, stripe_subscription_id, stripe_customer_id";

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

async function resolveAuthUserId(
  userId: string,
  email?: string | null,
): Promise<string> {
  const { data } = await admin().auth.admin.getUserById(userId);
  if (data?.user?.id) return data.user.id;

  if (email) {
    const { data: list } = await admin().auth.admin.listUsers({ perPage: 1000 });
    const match = list?.users.find(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase(),
    );
    if (match?.id) return match.id;
  }

  throw new Error(
    "This login is not in auth.users. Sign out, request a new magic link, then retry.",
  );
}

async function loadWorkspace(userId: string): Promise<WorkspaceQuotaRow | null> {
  const { data, error } = await admin()
    .from("workspaces")
    .select(QUOTA_SELECT)
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
    .select(QUOTA_SELECT)
    .single();
  if (error || !data) {
    return { ...row, x_runs_used: 0, seo_runs_used: 0, billing_cycle_start: start };
  }
  return data as WorkspaceQuotaRow;
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
    if (error.code === "23503" || /user_id/i.test(error.message)) {
      throw new Error(
        "Workspace insert failed (user_id FK). Sign out and open a fresh magic link.",
      );
    }
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
    .select(QUOTA_SELECT)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return { ...row, plan: "floor", founding: false };
  return data as WorkspaceQuotaRow;
}

/** Desk/Floor without Stripe is leftover from before the billing lock. */
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
    .select(QUOTA_SELECT)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return row;
  return data as WorkspaceQuotaRow;
}

export async function readQuota(
  userId: string,
  email?: string | null,
): Promise<QuotaSnapshot> {
  const uid = await resolveAuthUserId(userId, email);
  const operator = isOperatorEmail(email);
  let row = await ensureWorkspace(uid, operator);
  row = await maybeResetMonth(row);
  row = operator ? await grantFloor(row) : await dropUnpaidPaidPlan(row);
  return quotaFromRow(row);
}

export async function takeDeskRun(
  userId: string,
  desk: "x" | "seo",
  email?: string | null,
): Promise<{ ok: true; quota: QuotaSnapshot } | { ok: false; quota: QuotaSnapshot }> {
  const uid = await resolveAuthUserId(userId, email);
  const before = await readQuota(uid, email);
  const used = desk === "x" ? before.xUsed : before.seoUsed;
  const left = desk === "x" ? before.xLeft : before.seoLeft;
  if (left <= 0) return { ok: false, quota: before };

  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = used + 1;
  const { data, error } = await admin()
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", uid)
    .eq(field, used)
    .select(QUOTA_SELECT)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    const again = await readQuota(uid, email);
    const againLeft = desk === "x" ? again.xLeft : again.seoLeft;
    if (againLeft <= 0) return { ok: false, quota: again };
    throw new Error("Quota update raced. Try the run again.");
  }
  return { ok: true, quota: quotaFromRow(data) };
}

export async function refundDeskRun(
  userId: string,
  desk: "x" | "seo",
  email?: string | null,
): Promise<void> {
  const uid = await resolveAuthUserId(userId, email);
  const current = await readQuota(uid, email);
  const used = desk === "x" ? current.xUsed : current.seoUsed;
  const field = desk === "x" ? "x_runs_used" : "seo_runs_used";
  const nextUsed = Math.max(0, used - 1);
  await admin()
    .from("workspaces")
    .update({ [field]: nextUsed, updated_at: new Date().toISOString() })
    .eq("user_id", uid)
    .eq(field, used);
}
