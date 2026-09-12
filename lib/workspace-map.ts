import { EMPTY_STATE, SEED_STATE } from "./seed";
import type { HubState, Plan } from "./types";

export type WorkspaceRow = {
  id: string;
  user_id: string;
  plan: Plan;
  brand: HubState["brand"] | Record<string, unknown> | null;
  strategy: HubState["strategy"] | null;
  research: HubState["research"] | null;
  posts: HubState["posts"] | null;
  articles: HubState["articles"] | null;
  x_runs_used: number;
  seo_runs_used: number;
  founding: boolean | null;
};

function isPlan(value: string | null | undefined): value is Plan {
  return value === "free" || value === "desk" || value === "floor";
}

export function workspaceToHub(row: WorkspaceRow, email: string): HubState {
  const brand = {
    ...EMPTY_STATE.brand,
    ...(row.brand && typeof row.brand === "object" ? row.brand : {}),
  };
  return {
    account: {
      email,
      plan: isPlan(row.plan) ? row.plan : "free",
      onboarded: Boolean(brand.name),
      foundingRequested: Boolean(row.founding),
      xRunsUsed: row.x_runs_used ?? 0,
      seoRunsUsed: row.seo_runs_used ?? 0,
    },
    brand,
    posts: Array.isArray(row.posts) ? row.posts : [],
    articles: Array.isArray(row.articles) ? row.articles : [],
    strategy: row.strategy ?? {
      ...SEED_STATE.strategy,
      updatedAt: new Date().toISOString(),
    },
    research: row.research ?? null,
  };
}

/** Keep local queue/report if the cloud row is an empty insert. */
export function mergeHub(cloud: HubState, local: HubState): HubState {
  const cloudEmpty = cloud.posts.length === 0 && cloud.articles.length === 0;
  const localHas =
    local.posts.length > 0 ||
    local.articles.length > 0 ||
    Boolean(local.brand.name);
  if (!cloudEmpty || !localHas) return cloud;
  return {
    ...cloud,
    brand: cloud.brand.name ? cloud.brand : local.brand,
    posts: local.posts,
    articles: local.articles.length ? local.articles : cloud.articles,
    strategy: cloud.strategy.updatedAt ? cloud.strategy : local.strategy,
    research: cloud.research ?? local.research,
    account: {
      ...cloud.account,
      onboarded: cloud.account.onboarded || local.account.onboarded,
    },
  };
}

export function hubToWorkspacePatch(state: HubState) {
  return {
    brand: state.brand,
    strategy: state.strategy,
    research: state.research,
    posts: state.posts,
    articles: state.articles,
    updated_at: new Date().toISOString(),
  };
}
