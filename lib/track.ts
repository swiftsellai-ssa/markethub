"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type TrackProps = Record<string, string | number | boolean | null>;

export function track(name: string, props?: TrackProps) {
  try {
    vercelTrack(name, props);
  } catch {
    // Hobby plans ignore custom events; first-party log still fires.
  }
  const body = JSON.stringify({
    name,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    props: props ?? {},
  });
  const send = () =>
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon("/api/event", blob)) send();
    return;
  }
  void send();
}
