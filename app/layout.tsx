import type { Metadata } from "next";
import { Fraunces, Newsreader, Outfit } from "next/font/google";
import { getSettings } from "@/lib/data";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-reading",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return {
      metadataBase: new URL(siteUrl),
      title: {
        default: settings.authorName,
        template: `%s — ${settings.authorName}`,
      },
      description: settings.metaDescription,
      openGraph: {
        title: settings.authorName,
        description: settings.metaDescription,
        type: "website",
      },
    };
  } catch {
    return { title: "Ritu Gupta" };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${newsreader.variable} ${outfit.variable}`}>
      <body className="font-reading antialiased">
        <a href="#content" className="skip" suppressHydrationWarning>
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
