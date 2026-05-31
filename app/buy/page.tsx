"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { FiDollarSign, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const MINIMUM_AMOUNT_SEK = 3;
const PLATFORM_FEE_PERCENT = 0.0005; // 0.05%

export default function BuyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [gbxPriceSEK, setGbxPriceSEK] = useState<number | null>(null);
  const [estimatedGbx, setEstimatedGbx] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      try {
        const res = await fetch(`${backendUrl}/api/gbx/price/SEK`);
        const data = await res.json();
        if (data.price_per_gbx) setGbxPriceSEK(data.price_per_gbx);
      } catch (err) {
        console.error("Failed to fetch GBX price:", err);
      }
    };
    fetchPrice();
  }, []);

  useEffect(() => {
    if (amount && gbxPriceSEK) {
      const sekAmount = parseFloat(amount);
      if (!isNaN(sekAmount) && sekAmount > 0) {
        const stripePercent = 0.025;
        const stripeFixed = 3;
        const stripeFee = sekAmount * stripePercent + stripeFixed;
        const platformFee = sekAmount * PLATFORM_FEE_PERCENT;
        const netSek = sekAmount - stripeFee - platformFee;
        const gbx = netSek / gbxPriceSEK;
        setEstimatedGbx(gbx > 0 ? gbx : 0);
      } else {
        setEstimatedGbx(null);
      }
    } else {
      setEstimatedGbx(null);
    }
  }, [amount, gbxPriceSEK]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/buy");
    }
    if (!loading && user && user.isAdmin) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleProceed = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Ange ett giltigt belopp");
      return;
    }
    if (amountNum < MINIMUM_AMOUNT_SEK) {
      setError(`Minsta köpbelopp är ${MINIMUM_AMOUNT_SEK} SEK`);
      return;
    }
    // Skicka direkt till kortbetalningssidan (method = card)
    router.push(`/buy/payment/card?amount=${amountNum}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Laddar...
      </div>
    );
  }
  if (!user || user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("buy.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t("buy.subtitle")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("buy.amountPlaceholder")}
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minsta belopp: 3 SEK</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {estimatedGbx !== null && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t("buy.estimatedGbx")}:{" "}
                <span className="font-bold">{estimatedGbx.toFixed(4)} GBX</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">* {t("buy.feeInfo")}</p>
            </div>
          )}

          <button
            onClick={handleProceed}
            className="w-full mt-6 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {t("buy.button")} <FiArrowRight />
          </button>
        </div>

        <Link
          href="/fees"
          className="text-sm text-blue-600 hover:underline text-center block mt-4"
        >
          {t("fees.link")}
        </Link>
      </div>
    </div>
  );
}
