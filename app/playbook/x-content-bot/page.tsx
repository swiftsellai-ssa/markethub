import type { Metadata } from "next";
import { PlaybookArticle } from "@/components/PlaybookArticle";

export const metadata: Metadata = {
  title: "How the X Content Bot actually runs — MarketHub Playbook",
  description:
    "The X Content Bot researches the last 48 hours, writes one tweet or thread, and never publishes for you. Zero ad spend.",
};

export default function XBotPlaybookPage() {
  return (
    <PlaybookArticle
      kicker="Playbook"
      title="How the X Content Bot actually runs"
      dek="Zero spend. One post a day. You still hit publish. The bot still does the work that used to eat Sunday."
    >
      <p>
        There is no organic post API we will use to tweet as you. That is a
        feature. A bot that can spend your reputation without a human click is
        a liability.
      </p>
      <p>
        Morning: search X for your niche over the last 48 hours. Note hooks,
        length, topics, replies. Find a gap. Find one polarizing take. Ignore
        “comment AGENT for my n8n kit” as a format to copy.
      </p>
      <p>
        Then write one single tweet or one thread. First line stops the scroll.
        Each tweet under 240 characters. No hashtags. No fake metrics. Content
        type rotates: insight, how-to, story, opinion, resource.
      </p>
      <p>
        You copy it from the hub. You post it. At night you paste impressions.
        If it 2xs, tomorrow clones the format. If it dies, the format gets
        banned.
      </p>
      <p>
        That is the free plan, seven times. Desk is the same loop every morning
        without counting Sundays.
      </p>
    </PlaybookArticle>
  );
}
