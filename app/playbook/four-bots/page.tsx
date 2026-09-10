import type { Metadata } from "next";
import { PlaybookArticle } from "@/components/PlaybookArticle";

export const metadata: Metadata = {
  title: "Four bots, one morning — MarketsXHub Playbook",
  description:
    "SEO, video, X, and ads bots. Each owns a channel. Each runs research, publish, and track. Do not stand up all four at once.",
  openGraph: {
    images: [
      {
        url: "/api/og?title=Four%20desks%2C%20one%20morning&metric=4%20desks",
        width: 1200,
        height: 630,
        alt: "Four desks, one morning — MarketsXHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og?title=Four%20desks%2C%20one%20morning&metric=4%20desks"],
  },
};

export default function FourBotsPage() {
  return (
    <PlaybookArticle
      kicker="Playbook"
      title="Four bots, one morning"
      dek="Each bot owns a channel completely. None of them need you after setup — except the last click."
    >
      <p>
        Bot 1 is SEO. Find keywords, write the page, publish, track rankings,
        double down on climbers.
      </p>
      <p>
        Bot 2 is video. Research the trend, write a 45–60s script, render, post,
        read watch-through.
      </p>
      <p>
        Bot 3 is X. That desk is live today. Research 48 hours of the niche,
        write one post, copy it, log the numbers.
      </p>
      <p>
        Bot 4 is ads. Steal formats that have been running 30 days. Launch
        paused. Kill zero-conversion spend. Never invent a budget.
      </p>
      <h2>Three modes, every desk</h2>
      <p>
        Research. Publish. Track and improve. If a bot cannot do all three it is
        a generator, not a teammate.
      </p>
      <h2>One bot a week</h2>
      <p>
        Do not stand up all four at once. Week 1 is X because it is free to
        ship and the feedback is fast. Week 2 is SEO. Week 3 is video. Week 4 is
        ads, still paused until you say go.
      </p>
    </PlaybookArticle>
  );
}
