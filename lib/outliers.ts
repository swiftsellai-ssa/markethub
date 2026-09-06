import type { Post, Strategy } from "./types";

export function engagement(post: Post): number {
  const m = post.metrics;
  if (!m) return 0;
  return m.likes + m.replies * 2 + m.reposts * 3;
}

export function scoredPosts(posts: Post[]): Array<Post & { score: number }> {
  return posts
    .filter((p) => p.status === "posted" && p.metrics)
    .map((p) => ({ ...p, score: engagement(p) }))
    .sort((a, b) => b.score - a.score);
}

export function averageScore(posts: Post[]): number {
  const scored = scoredPosts(posts);
  if (scored.length === 0) return 0;
  return scored.reduce((sum, p) => sum + p.score, 0) / scored.length;
}

export function outliers(posts: Post[]): Array<Post & { score: number }> {
  const avg = averageScore(posts);
  if (avg === 0) return [];
  return scoredPosts(posts).filter((p) => p.score >= avg * 2);
}

export function worstPost(posts: Post[]): (Post & { score: number }) | null {
  const scored = scoredPosts(posts);
  if (scored.length < 2) return null;
  return scored[scored.length - 1] ?? null;
}

export function strategyFromPosts(posts: Post[], current: Strategy): Strategy {
  const wins = outliers(posts);
  const worst = worstPost(posts);
  if (wins.length === 0) return current;
  const top = wins[0];
  return {
    winningHook: top.hook,
    winningFormat: top.format,
    avoid: worst ? `${worst.format} — ${worst.topic}` : current.avoid,
    doubleDown: `${top.kind} · ${top.contentType} · ${top.format}`,
    updatedAt: new Date().toISOString(),
  };
}

export function variationBrief(post: Post): string[] {
  return [
    `Same hook format, tighter: keep the structure of "${post.hook}" but cut 20%.`,
    `Same topic, opposite angle: invert the claim in "${post.topic}".`,
    `Same format, different content type: rewrite as a ${post.contentType === "opinion" ? "how-to" : "opinion"}.`,
  ];
}
