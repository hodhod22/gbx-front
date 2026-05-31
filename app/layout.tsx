import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// SEO-optimerad metadata
export const metadata: Metadata = {
  title: {
    default:
      "GBX – Global Payment Platform | Stablecoin & Cross-Border Payments",
    template: "%s | GBX",
  },
  description:
    "GBX is the world's most stable currency – a stablecoin backed by fiat and precious metals. Send and receive money globally with instant, low-cost payments. API for cross-border transfers, payouts, and multi-currency wallets.",
  keywords:
    "GBX, stablecoin, cross-border payments, global payment platform, instant payout, low fee remittance, multi-currency wallet, fintech API, send money abroad, inflation protected",
  authors: [{ name: "GBX Team" }],
  creator: "GBX",
  publisher: "GBX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "GBX – Global Payment Platform",
    description:
      "The world's most stable currency for instant, low-cost global payments. Stablecoin backed by fiat and precious metals.",
    url: "https://www.poolbeferest.com",
    siteName: "GBX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GBX – Global Payment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GBX – Global Payment Platform",
    description:
      "The world's most stable currency for instant, low-cost global payments.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://www.poolbeferest.com",
    languages: {
      sv: "https://www.poolbeferest.com/sv",
      en: "https://www.poolbeferest.com/en",
      es: "https://www.poolbeferest.com/es",
      ru: "https://www.poolbeferest.com/ru",
      fa: "https://www.poolbeferest.com/fa",
      ar: "https://www.poolbeferest.com/ar",
      zh: "https://www.poolbeferest.com/zh",
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-site-verification-code", // Lägg till din verifieringskod
    // other: ["your-other-verification"],
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        {/* Förhindra indexering av utvecklingsmiljöer (valfritt) */}
        {process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" && (
          <meta name="robots" content="noindex,nofollow" />
        )}
        {/* Hreflang-taggar för flerspråkighet (dynamiska bättre men statiska fungerar) */}
        <link
          rel="alternate"
          hrefLang="sv"
          href="https://www.poolbeferest.com/sv"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://www.poolbeferest.com/en"
        />
        <link
          rel="alternate"
          hrefLang="es"
          href="https://www.poolbeferest.com/es"
        />
        <link
          rel="alternate"
          hrefLang="ru"
          href="https://www.poolbeferest.com/ru"
        />
        <link
          rel="alternate"
          hrefLang="fa"
          href="https://www.poolbeferest.com/fa"
        />
        <link
          rel="alternate"
          hrefLang="ar"
          href="https://www.poolbeferest.com/ar"
        />
        <link
          rel="alternate"
          hrefLang="zh"
          href="https://www.poolbeferest.com/zh"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.poolbeferest.com"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AuthenticatedLayout>
              <div className="mt-3 min-h-screen">{children}</div>
            </AuthenticatedLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
