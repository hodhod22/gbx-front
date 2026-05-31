"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import {
  FiGlobe,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";

export default function HomePageClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Sätt engelska som standard om inget språk är valt
  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng");
    if (!savedLang && i18n.language !== "en") {
      i18n.changeLanguage("en");
      localStorage.setItem("i18nextLng", "en");
    }
  }, [i18n]);

  useEffect(() => {
    if (!loading && user) {
      if (user.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            GBX
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("home.globalPaymentPlatform")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login?action=buy"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition shadow-lg transform hover:scale-105"
            >
              {t("home.getStarted")}
            </Link>
            <Link
              href="/login?action=send"
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold py-3 px-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition transform hover:scale-105"
            >
              {t("home.learnMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600">
              1M+
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("stats.users")}
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600">
              $2.5B
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("stats.volume")}
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-green-600">
              0%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("stats.fees")}
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-600">
              180+
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("stats.countries")}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            {t("home.whyChoose")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <FiZap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.freeTransfers")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("home.freeTransfersDesc")}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <FiGlobe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.globalReach")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("home.globalReachDesc")}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <FiShield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("home.bankSecurity")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("home.bankSecurityDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GBX Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-1 text-sm mb-4">
            <FiTrendingUp /> {t("gbx.title")}
          </div>
          <h2 className="text-3xl font-bold mb-4">
            1 GBX = <span className="text-yellow-500">$1.00</span> (
            {t("gbx.stable")})
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t("gbx.subtitle")}
          </p>
          <Link
            href="/gbx"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("home.readMoreAboutGbx")} <FiDollarSign />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white text-center rounded-t-3xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.readyTitle")}
          </h2>
          <p className="text-lg opacity-90 mb-8">{t("home.readyDesc")}</p>
          <Link
            href="/login?action=buy"
            className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-lg inline-block"
          >
            {t("home.createAccount")}
          </Link>
        </div>
      </section>

      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            name: "GBX",
            description:
              "Global payment platform with stable digital currency GBX. Zero internal transfer fees, multi-currency support, bank-level security.",
            brand: {
              "@type": "Brand",
              name: "GBX",
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free internal transfers",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
            provider: {
              "@type": "Organization",
              name: "GBX",
              url: "https://www.poolbeferest.com",
            },
          }),
        }}
      />
    </div>
  );
}
