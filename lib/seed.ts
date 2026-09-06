import type { Account, HubState } from "./types";

export const EMPTY_BRAND: HubState["brand"] = {
  name: "",
  niche: "",
  product: "",
  audience: "",
  cta: "",
  tone: "Direct, practical, no fluff. Short sentences. Never 'I'm excited to share.'",
  siteUrl: "",
  xHandle: "",
};

export const EMPTY_ACCOUNT: Account = {
  email: "",
  plan: "free",
  onboarded: false,
  foundingRequested: false,
  xRunsUsed: 0,
  seoRunsUsed: 0,
};

export const DEFAULT_BRAND: HubState["brand"] = {
  name: "MarketHub",
  niche: "AI marketing automation for founders",
  product:
    "MarketHub — four bots that own SEO, video, X, and ads. Each one researches, publishes, tracks results, and doubles down on anything that hits 2x average.",
  audience:
    "Founders who shipped a product and now need marketing without hiring a team",
  cta: "Open MarketHub, copy today's post, ship it",
  tone: "Direct, practical, no fluff. Short sentences. Never 'I'm excited to share.'",
  siteUrl: "",
  xHandle: "",
};

export const DEFAULT_STRATEGY: HubState["strategy"] = {
  winningHook: "",
  winningFormat: "Bold claim in line one. Then the mechanism.",
  avoid: "Comment-to-get-the-template threads. Pitch-first openers.",
  doubleDown: "Compounding vs volume. The 2x outlier rule.",
  updatedAt: "2026-09-06T00:00:00.000Z",
};

export const DEFAULT_RESEARCH: HubState["research"] = {
  topFormats: [
    "Long 'I built an AI marketing agent' threads with a numbered how-it-works list",
    "One-line counterintuitive claim that stands alone",
    "Specific system walkthrough: N bots, one loop, one job",
  ],
  topics: [
    "AI agents replacing marketing teams",
    "Grok Bot as a teammate that actually ships",
    "Volume of AI content vs distribution",
    "GEO / AI visibility vs qualified demand",
  ],
  gaps: [
    "Almost nobody talks about the scoreboard. They scrape, write, dump — and never kill losers or clone winners.",
    "Zero-spend organic loops. Every viral thread is selling n8n templates or paid UGC farms.",
  ],
  polarizingTake:
    "Citations and impressions are leading indicators, not outcomes. A bot that posts 1,000 times a day without a 2x rule is just a content hose.",
  notes:
    "Week of 5–6 Sep 2026: Greg Isenberg's 'launch with AI agents not marketing teams' still sets the frame. David Roberts-style 'I replaced my content team' threads keep getting comments via giveaway CTAs. Fresh founder posts: Gunz on 4 Grok bots in one group chat; Saad on not spending Sundays arguing with a chatbot; Quan Xu on visibility ≠ revenue. Gap we own: research → one post → read the data → clone 2x winners.",
  ranAt: "2026-09-06T02:00:00.000Z",
};

export const SEED_POSTS: HubState["posts"] = [
  {
    id: "seed-2026-09-06",
    date: "2026-09-06",
    kind: "single",
    tweets: [
      "Most founders don't have a marketing problem. They have a compounding problem.",
    ],
    hook: "Most founders don't have a marketing problem.",
    topic: "Compounding vs one-off posting",
    format: "Bold reframe in one line",
    contentType: "insight",
    status: "ready",
    researchNotes:
      "Standalone claims are traveling. Keep it under 240 and retweetable without a thread.",
    createdAt: "2026-09-06T01:00:00.000Z",
  },
  {
    id: "seed-2026-09-07",
    date: "2026-09-07",
    kind: "thread",
    tweets: [
      "You don't need 200 AI posts a day. You need one post that beats your average by 2x — then three variations of it tomorrow.",
      "Volume without a loop is noise. Every 'AI marketing agent' I read this week scrapes, writes, and dumps. None of them read the scoreboard.",
      "MarketHub's X bot does three things: research what's winning, write one post, wait for the data.",
      "If a post hits 2x average engagement, it becomes the template. The format that wins twice becomes the default.",
      "That's the whole product. Four bots. Same loop. SEO, video, X, ads.",
      "The bot doesn't guess. The data decides. You copy and post.",
    ],
    hook: "You don't need 200 AI posts a day.",
    topic: "The 2x outlier rule",
    format: "Stop [popular advice]. Here's the mechanism.",
    contentType: "insight",
    status: "draft",
    researchNotes:
      "Counter-position against volume-maxing UGC farms. Mechanism thread, not a giveaway.",
    createdAt: "2026-09-06T01:05:00.000Z",
  },
  {
    id: "seed-2026-09-08",
    date: "2026-09-08",
    kind: "single",
    tweets: [
      "Stop prompting ChatGPT for three posts every Sunday. That's not marketing. That's a second job with worse output.",
    ],
    hook: "Stop prompting ChatGPT for three posts every Sunday.",
    topic: "Founders stuck in the prompt loop",
    format: "Stop [popular advice].",
    contentType: "howto",
    status: "draft",
    researchNotes:
      "Saad's 'you didn't start a business to argue with a chatbot' is in the air. Our version: step out of the loop, keep the scoreboard.",
    createdAt: "2026-09-06T01:10:00.000Z",
  },
  {
    id: "seed-2026-09-09",
    date: "2026-09-09",
    kind: "thread",
    tweets: [
      "We built MarketHub the dishonest way first: a doc full of prompts. Then we made the X bot eat its own cooking.",
      "This morning it read what was winning in AI marketing, wrote one post, and put it in a queue. No ads. No spend.",
      "The embarrassing part: the first draft sounded like every other 'I replaced my marketing team' thread.",
      "So we added a kill rule. If a format underperforms, it gets banned. If it 2xs, it becomes the template.",
      "Dogfooding isn't a vibe. It's the only way a content bot doesn't drift into sludge.",
      "Tomorrow's post is already in the hub. I just have to copy it.",
    ],
    hook: "We built MarketHub the dishonest way first.",
    topic: "Dogfooding the X bot",
    format: "Story with a scar",
    contentType: "story",
    status: "draft",
    createdAt: "2026-09-06T01:15:00.000Z",
  },
  {
    id: "seed-2026-09-10",
    date: "2026-09-10",
    kind: "single",
    tweets: [
      "An n8n template is not a marketing team. If it can't kill losers and clone winners, it's a content hose with extra steps.",
    ],
    hook: "An n8n template is not a marketing team.",
    topic: "Templates vs a closed loop",
    format: "Polarizing one-liner",
    contentType: "opinion",
    status: "draft",
    researchNotes:
      "The feed is full of 'comment AGENT for my n8n kit'. Take the other side.",
    createdAt: "2026-09-06T01:20:00.000Z",
  },
  {
    id: "seed-2026-09-11",
    date: "2026-09-11",
    kind: "thread",
    tweets: [
      "Every marketing bot needs three modes. Not fifty integrations. Three.",
      "Research: what actually performed in the last 48 hours — hooks, length, topics, replies.",
      "Publish: one piece, on-format, ready to copy. Not a folder of 40 drafts you'll never ship.",
      "Track: read the scoreboard. 2x average becomes the template. The rest gets cut.",
      "SEO, video, X, ads — same three modes. Different channel.",
      "That's MarketHub. Steal the loop even if you never open the hub.",
    ],
    hook: "Every marketing bot needs three modes.",
    topic: "Research / publish / track",
    format: "How-to numbered mechanism",
    contentType: "resource",
    status: "draft",
    createdAt: "2026-09-06T01:25:00.000Z",
  },
];

export const EMPTY_STATE: HubState = {
  account: EMPTY_ACCOUNT,
  brand: EMPTY_BRAND,
  posts: [],
  articles: [],
  strategy: {
    winningHook: "",
    winningFormat: "",
    avoid: "",
    doubleDown: "",
    updatedAt: "",
  },
  research: null,
};

export const SEED_STATE: HubState = {
  account: {
    email: "",
    plan: "desk",
    onboarded: true,
    foundingRequested: false,
    xRunsUsed: 0,
    seoRunsUsed: 0,
  },
  brand: DEFAULT_BRAND,
  posts: SEED_POSTS,
  articles: [],
  strategy: DEFAULT_STRATEGY,
  research: DEFAULT_RESEARCH,
};
