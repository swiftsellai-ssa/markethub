import type { Metadata } from "next";
import { Geist_Mono, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_OG_TITLE } from "@/lib/og";
import { HubProvider } from "@/lib/store";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.marketsxhub.com";
const DESCRIPTION =
  "MarketsXHub runs one AI growth experiment at a time, tracks the result, and turns your 2× winners into the next baseline. X and SEO desks are live.";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "MarketsXHub — Stop guessing what content works",
  description: DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    siteName: "MarketsXHub",
    title: DEFAULT_OG_TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "MarketsXHub — AI growth operating system. One experiment. 2× winners become the baseline.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_OG_TITLE,
    description: DESCRIPTION,
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <HubProvider>{children}</HubProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
