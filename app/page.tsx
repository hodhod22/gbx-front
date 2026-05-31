// app/page.tsx
import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

// Metadata for SEO – genereras på servern
export const metadata: Metadata = {
  title: "GBX - Global Payment Platform | World's Most Stable Currency",
  description:
    "Send and receive money worldwide with zero internal fees. GBX is a stable, multi-currency payment platform backed by fiat currencies and precious metals. Free transfers, bank-level security, instant payouts.",
  keywords: [
    "GBX",
    "global payment",
    "stablecoin",
    "cross-border payments",
    "free transfers",
    "multi-currency wallet",
    "instant payout",
    "fintech",
    "stable currency",
    "international money transfer",
    "low fee remittance",
    "crypto to bank",
    "stable value asset",
  ].join(", "),
  openGraph: {
    title: "GBX - The World's Most Stable Currency",
    description:
      "Join GBX and experience free, fast, and secure global payments. Send money to anyone, anywhere, with zero internal fees.",
    url: "https://www.poolbeferest.com",
    siteName: "GBX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GBX - Global Payment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GBX - Global Payment Platform",
    description:
      "Send and receive money worldwide with zero fees. The most stable digital currency.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://www.poolbeferest.com",
    languages: {
      en: "https://www.poolbeferest.com/en",
      sv: "https://www.poolbeferest.com/sv",
      es: "https://www.poolbeferest.com/es",
      ru: "https://www.poolbeferest.com/ru",
      fa: "https://www.poolbeferest.com/fa",
      ar: "https://www.poolbeferest.com/ar",
      zh: "https://www.poolbeferest.com/zh",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function Page() {
  return <HomePageClient />;
}
