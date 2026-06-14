import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArenaLink — Find Players, Join Matches",
  description:
    "ArenaLink is a sports player matchmaking platform that helps you find teammates and join nearby matches. Play football, cricket, basketball and more!",
  keywords: [
    "sports",
    "matchmaking",
    "find players",
    "join matches",
    "football",
    "cricket",
    "basketball",
    "sports community",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
