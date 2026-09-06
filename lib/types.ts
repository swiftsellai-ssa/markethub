export type BotId = "seo" | "video" | "x" | "ads";

export type ContentType = "insight" | "howto" | "story" | "opinion" | "resource";

export type PostKind = "single" | "thread";

export type PostStatus = "draft" | "ready" | "posted" | "skipped";

export type Brand = {
  name: string;
  niche: string;
  product: string;
  audience: string;
  cta: string;
  tone: string;
  siteUrl: string;
  xHandle: string;
};

export type Metrics = {
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  loggedAt: string;
};

export type Research = {
  topFormats: string[];
  topics: string[];
  gaps: string[];
  polarizingTake: string;
  notes: string;
  ranAt: string;
};

export type Post = {
  id: string;
  date: string;
  kind: PostKind;
  tweets: string[];
  hook: string;
  topic: string;
  format: string;
  contentType: ContentType;
  status: PostStatus;
  metrics?: Metrics;
  researchNotes?: string;
  createdAt: string;
};

export type Strategy = {
  winningHook: string;
  winningFormat: string;
  avoid: string;
  doubleDown: string;
  updatedAt: string;
};

export type Plan = "free" | "desk" | "floor";

export type Article = {
  id: string;
  keyword: string;
  title: string;
  meta: string;
  slug: string;
  markdown: string;
  opportunity: string;
  createdAt: string;
};

export type Account = {
  email: string;
  plan: Plan;
  onboarded: boolean;
  foundingRequested: boolean;
  xRunsUsed: number;
  seoRunsUsed: number;
};

export type HubState = {
  account: Account;
  brand: Brand;
  posts: Post[];
  articles: Article[];
  strategy: Strategy;
  research: Research | null;
};
