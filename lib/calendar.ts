import type { ContentType, PostKind } from "./types";

const WEEKDAY_TYPE: Record<number, ContentType> = {
  0: "resource",
  1: "insight",
  2: "howto",
  3: "story",
  4: "opinion",
  5: "resource",
  6: "story",
};

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysISO(iso: string, days: number): string {
  const dt = new Date(`${iso}T12:00:00`);
  dt.setDate(dt.getDate() + days);
  return todayISO(dt);
}

export function weekdayName(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-AU", {
    weekday: "long",
  });
}

export function contentTypeForDate(iso: string): ContentType {
  const day = new Date(`${iso}T12:00:00`).getDay();
  return WEEKDAY_TYPE[day] ?? "insight";
}

export function kindForDate(iso: string, lastKind?: PostKind): PostKind {
  if (lastKind) return lastKind === "single" ? "thread" : "single";
  const day = new Date(`${iso}T12:00:00`).getDay();
  return day % 2 === 0 ? "single" : "thread";
}

export function contentTypeLabel(type: ContentType): string {
  switch (type) {
    case "insight":
      return "Insight";
    case "howto":
      return "How-to";
    case "story":
      return "Story";
    case "opinion":
      return "Opinion";
    case "resource":
      return "Resource";
  }
}
