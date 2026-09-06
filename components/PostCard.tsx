"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { contentTypeLabel } from "@/lib/calendar";
import { charCount, copyText, shortDate, tweetOverLimit } from "@/lib/format";
import { engagement } from "@/lib/outliers";
import type { Post } from "@/lib/types";

export function PostCard({
  post,
  featured = false,
  onStatus,
  onMetrics,
}: {
  post: Post;
  featured?: boolean;
  onStatus?: (status: Post["status"]) => void;
  onMetrics?: (metrics: {
    impressions: number;
    likes: number;
    replies: number;
    reposts: number;
  }) => void;
}) {
  const [open, setOpen] = useState(featured);

  return (
    <article
      className={`border ${
        featured ? "border-lime/50 bg-ink-2" : "border-line bg-ink-2/80"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
          {shortDate(post.date)} · {post.kind} ·{" "}
          {contentTypeLabel(post.contentType)} · {post.status}
        </p>
        <div className="flex items-center gap-2">
          <CopyButton
            text={copyText(post)}
            label={post.kind === "thread" ? "Copy thread" : "Copy post"}
            className="border-lime bg-lime text-ink"
          />
          {!featured ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="px-2 font-mono text-[11px] uppercase tracking-widest text-mute"
            >
              {open ? "Hide" : "Show"}
            </button>
          ) : null}
        </div>
      </header>

      <div className="px-4 py-4">
        <p className="font-serif text-xl leading-snug md:text-2xl">
          {post.tweets[0]}
        </p>
        {open || featured ? (
          <div className="mt-5 space-y-3">
            {post.tweets.map((tweet, i) => (
              <div key={i} className="border border-line/80 bg-ink px-3 py-3">
                {post.kind === "thread" ? (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
                    {i + 1} / {post.tweets.length}
                  </p>
                ) : null}
                <p className="mt-1 text-sm leading-relaxed">{tweet}</p>
                <p
                  className={`mt-2 font-mono text-[10px] ${
                    tweetOverLimit(tweet) ? "text-warn" : "text-mute"
                  }`}
                >
                  {charCount(tweet)} / 240
                </p>
              </div>
            ))}
            <p className="text-xs text-paper/50">
              Format: {post.format}. Topic: {post.topic}.
            </p>
            {post.researchNotes ? (
              <p className="text-xs text-paper/50">{post.researchNotes}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {onStatus || onMetrics ? (
        <footer className="flex flex-col gap-3 border-t border-line px-4 py-3">
          {onStatus ? (
            <div className="flex flex-wrap gap-2">
              {post.status !== "posted" ? (
                <button
                  type="button"
                  onClick={() => onStatus("posted")}
                  className="rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-paper/80"
                >
                  Mark posted
                </button>
              ) : null}
              {post.status !== "skipped" ? (
                <button
                  type="button"
                  onClick={() => onStatus("skipped")}
                  className="rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mute"
                >
                  Skip
                </button>
              ) : null}
              {post.status !== "ready" ? (
                <button
                  type="button"
                  onClick={() => onStatus("ready")}
                  className="rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mute"
                >
                  Ready
                </button>
              ) : null}
            </div>
          ) : null}
          {onMetrics ? <MetricsFields post={post} onSave={onMetrics} /> : null}
          {post.metrics ? (
            <p className="font-mono text-[11px] text-mute">
              {post.metrics.impressions} imp · {post.metrics.likes} likes ·{" "}
              {post.metrics.replies} replies · {post.metrics.reposts} reposts ·
              score {engagement(post)}
            </p>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}

function MetricsFields({
  post,
  onSave,
}: {
  post: Post;
  onSave: (metrics: {
    impressions: number;
    likes: number;
    replies: number;
    reposts: number;
  }) => void;
}) {
  const [impressions, setImpressions] = useState(
    String(post.metrics?.impressions ?? ""),
  );
  const [likes, setLikes] = useState(String(post.metrics?.likes ?? ""));
  const [replies, setReplies] = useState(String(post.metrics?.replies ?? ""));
  const [reposts, setReposts] = useState(String(post.metrics?.reposts ?? ""));

  return (
    <form
      className="grid grid-cols-2 gap-2 md:grid-cols-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          impressions: Number(impressions) || 0,
          likes: Number(likes) || 0,
          replies: Number(replies) || 0,
          reposts: Number(reposts) || 0,
        });
      }}
    >
      <Field label="Impressions" value={impressions} onChange={setImpressions} />
      <Field label="Likes" value={likes} onChange={setLikes} />
      <Field label="Replies" value={replies} onChange={setReplies} />
      <Field label="Reposts" value={reposts} onChange={setReposts} />
      <button
        type="submit"
        className="self-end rounded-sm border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-paper"
      >
        Log metrics
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
        {label}
      </span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line bg-ink px-2 py-2 text-sm outline-none focus:border-lime"
      />
    </label>
  );
}
