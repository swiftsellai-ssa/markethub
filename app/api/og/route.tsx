import { ImageResponse } from "next/og";
import { DEFAULT_OG_METRIC, DEFAULT_OG_TITLE, OG_HEIGHT, OG_WIDTH } from "@/lib/og";

export const runtime = "edge";

const SYNE =
  "https://cdn.jsdelivr.net/fontsource/fonts/syne@5.2.1/latin-800-normal.ttf";
const MONO =
  "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@5.2.5/latin-500-normal.ttf";

const CACHE =
  "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function clamp(value: string | null, fallback: string, max: number): string {
  const raw = (value ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return fallback;
  return raw.length > max ? `${raw.slice(0, max - 1)}…` : raw;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = clamp(searchParams.get("title"), DEFAULT_OG_TITLE, 110);
  const metric = clamp(searchParams.get("metric"), DEFAULT_OG_METRIC, 16);

  const [syne, mono] = await Promise.all([loadFont(SYNE), loadFont(MONO)]);
  const fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"] =
    [];
  if (syne) fonts.push({ name: "Syne", data: syne, weight: 800, style: "normal" });
  if (mono) {
    fonts.push({ name: "IBM Plex Mono", data: mono, weight: 500, style: "normal" });
  }

  const display = syne ? "Syne" : "sans-serif";
  const tick = mono ? "IBM Plex Mono" : "monospace";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#09090b",
          backgroundImage:
            "linear-gradient(to right, rgba(61,255,240,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(216,255,60,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#f4f6ff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-80px",
            fontSize: 520,
            fontFamily: display,
            fontWeight: 800,
            color: "rgba(216,255,60,0.06)",
            lineHeight: 1,
            display: "flex",
          }}
        >
          X
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #d8ff3c 0%, #3dfff0 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px 48px",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontFamily: display,
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                }}
              >
                <div style={{ display: "flex" }}>Markets</div>
                <div style={{ display: "flex", color: "#d8ff3c" }}>X</div>
                <div style={{ display: "flex" }}>Hub</div>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 10,
                  fontFamily: tick,
                  fontSize: 16,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#3dfff0",
                }}
              >
                Growth terminal
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(216,255,60,0.45)",
                padding: "10px 16px",
                fontFamily: tick,
                fontSize: 16,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#d8ff3c",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: "#d8ff3c",
                  display: "flex",
                }}
              />
              Live
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 980,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: display,
                fontSize: title.length > 60 ? 52 : 64,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontFamily: tick,
                fontSize: 22,
                color: "rgba(244,246,255,0.62)",
                letterSpacing: "0.02em",
              }}
            >
              One experiment. Track the result. Clone 2× winners.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#d8ff3c",
                  color: "#07080c",
                  fontFamily: tick,
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  padding: "12px 18px",
                }}
              >
                {metric} outlier
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #1c2030",
                  fontFamily: tick,
                  fontSize: 18,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#7c8196",
                  padding: "12px 18px",
                }}
              >
                X desk · SEO desk
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: tick,
                fontSize: 18,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#7c8196",
              }}
            >
              marketsxhub.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: fonts.length ? fonts : undefined,
      headers: {
        "Cache-Control": CACHE,
      },
    },
  );
}
