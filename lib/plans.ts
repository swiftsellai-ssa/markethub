import type { Plan } from "./types";

export const PLANS: Record<
  Plan,
  {
    id: Plan;
    name: string;
    subtitle: string;
    price: number;
    foundingPrice?: number;
    blurb: string;
    xRuns: number;
    seoRuns: number;
    bots: string[];
  }
> = {
  free: {
    id: "free",
    name: "Free",
    subtitle: "Try the loop",
    price: 0,
    blurb: "Your brand, 7 X posts, 1 SEO brief, the scoreboard. No card.",
    xRuns: 7,
    seoRuns: 1,
    bots: ["X desk (7 runs)", "SEO desk (1 brief)", "2× outlier scoreboard"],
  },
  desk: {
    id: "desk",
    name: "Desk",
    subtitle: "Daily X bot",
    price: 39,
    foundingPrice: 19,
    blurb:
      "The X habit every morning. 90 runs, reports, outlier cloning. First 50 lock $19/mo for 12 months — then it is $39/mo.",
    xRuns: 90,
    seoRuns: 4,
    bots: ["Daily X desk", "SEO desk (4 briefs)", "Reports", "2× cloning"],
  },
  floor: {
    id: "floor",
    name: "Floor",
    subtitle: "Every desk, now and later",
    price: 99,
    blurb:
      "Every desk that is live today, plus access to Video and Ads when they launch. You are not paying $99 for two dark rooms.",
    xRuns: 90,
    seoRuns: 30,
    bots: [
      "Daily X desk",
      "SEO desk (30 briefs)",
      "Video + Ads when they launch",
      "Reports + 2× cloning",
    ],
  },
};

export const PLAN_COMPARE: Array<{
  label: string;
  free: string;
  desk: string;
  floor: string;
}> = [
  { label: "Price", free: "$0", desk: "$39/mo", floor: "$99/mo" },
  {
    label: "Founding 50",
    free: "—",
    desk: "$19/mo for 12 months",
    floor: "—",
  },
  { label: "X posts / month", free: "7", desk: "90", floor: "90" },
  { label: "SEO briefs / month", free: "1", desk: "4", floor: "30" },
  { label: "X desk (live)", free: "Yes", desk: "Daily", floor: "Daily" },
  { label: "SEO desk (live)", free: "1 brief", desk: "Yes", floor: "Yes" },
  { label: "Video desk", free: "—", desk: "—", floor: "Included when live" },
  { label: "Ads desk", free: "—", desk: "—", floor: "Included when live" },
  { label: "2× outlier cloning", free: "Yes", desk: "Yes", floor: "Yes" },
  {
    label: "New desks as they launch",
    free: "—",
    desk: "—",
    floor: "Included",
  },
];

export function xRunLimit(plan: Plan): number {
  return PLANS[plan].xRuns;
}

export function seoRunLimit(plan: Plan): number {
  return PLANS[plan].seoRuns;
}

export function canUseSeoDesk(plan: Plan): boolean {
  return plan === "floor" || plan === "free" || plan === "desk";
}
