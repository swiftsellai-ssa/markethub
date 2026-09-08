import { ComingDesk } from "@/components/ComingDesk";

export default function AdsPage() {
  return (
    <ComingDesk
      id="04"
      week="Week 4"
      name="Ads desk"
      loop="Read competitor ads that have been running 30+ days. Generate creatives. Launch paused. Kill zero-conversion spend. Scale winners 20%."
      modes={[
        "Research: longest-running competitor ads — hook, visual, CTA, pain point.",
        "Publish: three creatives, same audience, A/B/C. Campaigns stay paused until you explicitly launch.",
        "Track: spend, CTR, CPA/ROAS. Kill and scale rules. Never invent a budget.",
      ]}
      blocked="X Ads API is already connected in this Grok environment. Facebook is not. This desk will default to X Ads, paused by default, no spend without a clear go."
    />
  );
}
