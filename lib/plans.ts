import type { Plan } from "./types";

export const PLANS: Record<
  Plan,
  {
    id: Plan;
    name: string;
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
    price: 0,
    blurb: "One desk, seven runs. Enough to see if the loop beats your Sundays.",
    xRuns: 7,
    seoRuns: 1,
    bots: ["X Content Bot"],
  },
  desk: {
    id: "desk",
    name: "Desk",
    price: 39,
    foundingPrice: 19,
    blurb: "Daily X bot. Scoreboard. Outlier cloning. The habit, not the toy.",
    xRuns: 90,
    seoRuns: 4,
    bots: ["X Content Bot", "Reports"],
  },
  floor: {
    id: "floor",
    name: "Floor",
    price: 99,
    blurb: "All four desks as they come online. SEO live now. Video and ads next.",
    xRuns: 90,
    seoRuns: 30,
    bots: ["X", "SEO", "Video (soon)", "Ads (soon)"],
  },
};

export function xRunLimit(plan: Plan): number {
  return PLANS[plan].xRuns;
}

export function seoRunLimit(plan: Plan): number {
  return PLANS[plan].seoRuns;
}

export function canUseSeoDesk(plan: Plan): boolean {
  return plan === "floor" || plan === "free" || plan === "desk";
}
