import type { Post } from "./types";

export function charCount(text: string): number {
  return [...text].length;
}

export function tweetOverLimit(text: string, limit = 240): boolean {
  return charCount(text) > limit;
}

export function copyText(post: Post): string {
  if (post.kind === "single") return post.tweets[0] ?? "";
  return post.tweets.join("\n\n");
}

export function shortDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
