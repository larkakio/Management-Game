import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://management-game-blush.vercel.app";

const baseAppId = process.env.NEXT_PUBLIC_BASE_APP_ID ?? "69ef05698502c283edbf962b";

export const metadata: Metadata = {
  metadataBase: new URL(defaultSiteUrl.startsWith("http") ? defaultSiteUrl : `https://${defaultSiteUrl}`),
  title: "Neon Grid Command",
  description: "Swipe-driven cyberpunk management game on Base.",
  other: {
    "base:app_id": baseAppId,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
