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
  title: "MarketsXHub — Stop guessing what content works",
  description:
    "MarketsXHub runs one AI growth experiment at a time, tracks the result, and turns your 2× winners into the next baseline. X and SEO desks are live.",
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
