import type { Plan } from "./types";
import { seoRunLimit, xRunLimit } from "./plans";

export type QuotaSnapshot = {
  plan: Plan;
  founding: boolean;
  xUsed: number;
  xLimit: number;
  xLeft: number;
  seoUsed: number;
  seoLimit: number;
  seoLeft: number;
};

export function isPlan(value: string | null | undefined): value is Plan {
  return value === "free" || value === "desk" || value === "floor";
}

export function quotaFromRow(row: {
  plan?: string | null;
  founding?: boolean | null;
  x_runs_used?: number | null;
  seo_runs_used?: number | null;
}): QuotaSnapshot {
  const plan: Plan = isPlan(row.plan) ? row.plan : "free";
  const xUsed = Math.max(0, row.x_runs_used ?? 0);
  const seoUsed = Math.max(0, row.seo_runs_used ?? 0);
  const xLimit = xRunLimit(plan);
  const seoLimit = seoRunLimit(plan);
  return {
    plan,
    founding: Boolean(row.founding),
    xUsed,
    xLimit,
    xLeft: Math.max(0, xLimit - xUsed),
    seoUsed,
    seoLimit,
    seoLeft: Math.max(0, seoLimit - seoUsed),
  };
}

export function isQuotaSnapshot(value: unknown): value is QuotaSnapshot {
  if (!value || typeof value !== "object") return false;
  const v = value as QuotaSnapshot;
  return (
    isPlan(v.plan) &&
    typeof v.xUsed === "number" &&
    typeof v.xLimit === "number" &&
    typeof v.xLeft === "number" &&
    typeof v.seoUsed === "number" &&
    typeof v.seoLimit === "number" &&
    typeof v.seoLeft === "number"
  );
}

export function planLabel(plan: Plan): string {
  if (plan === "desk") return "Desk";
  if (plan === "floor") return "Floor";
  return "Free";
}
