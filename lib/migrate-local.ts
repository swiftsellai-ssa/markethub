"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { HubState } from "@/lib/types";

export const HUB_STORAGE_KEY = "marketsxhub.v1";
const LEGACY_KEYS = ["markethub.v2", "markethub.v1"];

function readLocalHubState(): HubState | null {
  if (typeof window === "undefined") return null;

  for (const key of [HUB_STORAGE_KEY, ...LEGACY_KEYS]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as HubState;
      if (parsed?.brand && Array.isArray(parsed.posts)) return parsed;
    } catch {
      // ignore corrupt local rows
    }
  }
  return null;
}

/**
 * One-time hydration: import localStorage hub state into the user's workspace
 * the first time they log in. Clears client storage after a successful write.
 */
export async function checkAndMigrateLocalStorage(
  supabase: SupabaseClient,
  user: User,
): Promise<{ migrated: boolean; error?: string }> {
  const local = readLocalHubState();
  if (!local) return { migrated: false };

  const hasWork =
    Boolean(local.brand?.name) ||
    local.posts.length > 0 ||
    (local.articles?.length ?? 0) > 0;

  if (!hasWork) return { migrated: false };

  const { data: workspace, error: fetchErr } = await supabase
    .from("workspaces")
    .select("id, migrated_from_local")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchErr) {
    return { migrated: false, error: fetchErr.message };
  }

  if (!workspace) {
    const { error: insertErr } = await supabase.from("workspaces").insert({
      user_id: user.id,
      brand: local.brand,
      strategy: local.strategy,
      research: local.research,
      posts: local.posts,
      articles: local.articles ?? [],
      plan: "free",
      x_runs_used: 0,
      seo_runs_used: 0,
      queue_state: {
        account: local.account,
        migratedAt: new Date().toISOString(),
      },
      migrated_from_local: true,
      updated_at: new Date().toISOString(),
    });

    if (insertErr) {
      if (insertErr.code !== "23505") {
        return { migrated: false, error: insertErr.message };
      }
      const { data: existing } = await supabase
        .from("workspaces")
        .select("id, posts")
        .eq("user_id", user.id)
        .maybeSingle();
      const cloudPosts = existing && Array.isArray(existing.posts) ? existing.posts : [];
      if (existing && cloudPosts.length === 0 && local.posts.length > 0) {
        await supabase
          .from("workspaces")
          .update({
            brand: local.brand,
            strategy: local.strategy,
            research: local.research,
            posts: local.posts,
            articles: local.articles ?? [],
            migrated_from_local: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      }
    }
  } else if (!workspace.migrated_from_local) {
    const { error } = await supabase
      .from("workspaces")
      .update({
        brand: local.brand,
        strategy: local.strategy,
        research: local.research,
        posts: local.posts,
        articles: local.articles ?? [],
        queue_state: {
          account: local.account,
          migratedAt: new Date().toISOString(),
        },
        migrated_from_local: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workspace.id);

    if (error) {
      return { migrated: false, error: error.message };
    }
  } else {
    return { migrated: false };
  }

  for (const key of [HUB_STORAGE_KEY, ...LEGACY_KEYS]) {
    window.localStorage.removeItem(key);
  }

  return { migrated: true };
}
