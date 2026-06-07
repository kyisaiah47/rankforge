import type { Metadata } from "next";
import { Host_Grotesk, Onest, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-text",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RankForge — Real-time Leaderboards",
  description: "Production-grade leaderboard infrastructure for any game. Powered by AWS DynamoDB + Vercel.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${onest.variable} ${geistMono.variable} dark`}>
      <body className="antialiased font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
