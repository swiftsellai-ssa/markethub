import { createAdminClient } from "@/lib/supabase/admin";
import { isServiceRoleConfigured } from "@/lib/supabase/env";

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 64);
  return "unknown";
}

/**
 * Returns true if the request is allowed.
 * Fails open when security.sql has not been applied yet (missing RPC).
 */
export async function allowRequest(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!isServiceRoleConfigured()) return true;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("hit_rate_limit", {
      p_key: key.slice(0, 200),
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error("rate_limit", error.message);
      return true;
    }
    return Boolean(data);
  } catch (err) {
    console.error("rate_limit", err);
    return true;
  }
}

export const RATE = {
  runDesk: { limit: 6, window: 300 },
  magicLinkEmail: { limit: 5, window: 3600 },
  magicLinkIp: { limit: 10, window: 3600 },
  foundingIp: { limit: 8, window: 3600 },
} as const;
