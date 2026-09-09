export const TRACK_EVENTS = [
  "cta_start_free",
  "cta_pricing",
  "workspace_created",
  "magic_link_sent",
  "desk_run",
  "desk_run_failed",
  "brand_saved",
  "checkout_started",
  "checkout_success",
  "founding_claimed",
  "metrics_logged",
] as const;

export type TrackEventName = (typeof TRACK_EVENTS)[number];

export function isTrackEventName(value: string): value is TrackEventName {
  return (TRACK_EVENTS as readonly string[]).includes(value);
}
