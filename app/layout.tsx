import type { Metadata } from "next";
import { Geist_Mono, Syne } from "next/font/google";
import { HubProvider } from "@/lib/store";
import "./globals.css";

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
  title: "MarketsXHub — Four desks. The X pit is live.",
  description:
    "MarketsXHub is a four-desk marketing floor. SEO, video, X, and ads bots that research, publish, track, and clone 2x winners. Point it at your brand.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <HubProvider>{children}</HubProvider>
      </body>
    </html>
  );
}
