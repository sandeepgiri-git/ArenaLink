import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
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
    <html lang="en" className={`dark ${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-body-md text-on-background bg-background selection:bg-secondary selection:text-on-secondary">
        {children}
      </body>
    </html>
  );
}
