"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type TrackProps } from "@/lib/track";

export function TrackLink({
  event,
  eventProps,
  onClick,
  ...props
}: ComponentProps<typeof Link> & {
  event: string;
  eventProps?: TrackProps;
}) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
