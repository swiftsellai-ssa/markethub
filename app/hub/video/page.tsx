import { ComingDesk } from "@/components/ComingDesk";

export default function VideoPage() {
  return (
    <ComingDesk
      id="02"
      week="Week 3"
      name="Video desk"
      loop="Research trending topics. Write 45–60s scripts. Render. Post. Read watch-through. Clone the hook that won."
      modes={[
        "Research: X, TikTok, Reels in the niche — hook formats, length, comment heat.",
        "Publish: three scripts a day (authority tip, mistake + fix, product demo). Avatar render when Higgsfield (or Imagine video) is connected.",
        "Track: views and watch-through. 2x videos get reposted and become the next three templates.",
      ]}
      blocked="Avatar video MCP is not connected. Scripts can be written now; rendering waits."
    />
  );
}
