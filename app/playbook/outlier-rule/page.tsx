import type { Metadata } from "next";
import { PlaybookArticle } from "@/components/PlaybookArticle";

export const metadata: Metadata = {
  title: "The 2x outlier rule — MarketHub Playbook",
  description:
    "Track every result. Find what is 2x above average. Push it harder. Build three variations. The winner becomes the new baseline.",
};

export default function OutlierRulePage() {
  return (
    <PlaybookArticle
      kicker="Playbook"
      title="The 2x outlier rule"
      dek="Most AI marketing tools generate. Almost none keep score. The loop is the product."
    >
      <p>
        Track every result. Find what is performing 2x above average. Push it
        harder. Build variations of it. Test the variations. The winner of the
        variations becomes the new baseline. Repeat.
      </p>
      <p>
        That paragraph is the whole company. SEO pages that climb get more
        internal links. X posts that 2x get cloned into three variations next
        week. Ads that beat CPA get a 20% budget bump — after you approve spend.
      </p>
      <p>
        Volume without a loop is a content hose. A bot that posts a thousand
        times a day and never kills a loser is not a marketing team. It is a
        slot machine with extra steps.
      </p>
      <h2>How to run it by hand</h2>
      <ol>
        <li>Write down impressions, likes, replies, reposts for every post.</li>
        <li>
          Score = likes + replies × 2 + reposts × 3. Average the last 7 with
          numbers.
        </li>
        <li>Anything ≥ 2× average is an outlier. Save the hook format, not the joke.</li>
        <li>Write three new posts that steal the structure, never the wording.</li>
        <li>The format that wins twice is the default until something beats it.</li>
      </ol>
      <p>
        MarketHub does this in the hub. You can do it in a spreadsheet. The
        spreadsheet will not research X at 6am. That is the only difference
        worth paying for.
      </p>
    </PlaybookArticle>
  );
}
