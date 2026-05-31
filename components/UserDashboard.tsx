// components/UserDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  FiDollarSign,
  FiSend,
  FiArrowUp,
  FiTrendingUp,
  FiCreditCard,
  FiSmartphone,
  FiAlertCircle,
} from "react-icons/fi";

export default function UserDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [gbxPriceSEK, setGbxPriceSEK] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [maxPayout, setMaxPayout] = useState<number>(0);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Saldo
        const balanceRes = await fetch(`${backendUrl}/api/gbx/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const balanceData = await balanceRes.json();
        setBalance(balanceData.balance ?? 0);

        // Pris
        const priceRes = await fetch(`${backendUrl}/api/gbx/price/SEK`);
        const priceData = await priceRes.json();
        setGbxPriceSEK(priceData.price_per_gbx ?? 0);

        // Max uttag
        const maxRes = await fetch(`${backendUrl}/api/gbx/max-payout`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const maxData = await maxRes.json();
        setMaxPayout(maxData.maxNetSek ?? 0);

        // Stripe onboarding-status
        const onboardRes = await fetch(
          `${backendUrl}/api/gbx/check-stripe-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const onboardData = await onboardRes.json();
        setIsOnboarded(onboardData.isOnboarded || false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
    else setLoading(false);
  }, [user]);

  const handleConnectBank = async () => {
    const token = getToken();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${backendUrl}/api/gbx/onboarding-link`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyGbx = () => router.push("/buy");
  const handleSendGbx = () => router.push("/send");
  const handleWithdraw = () => router.push("/dashboard/withdraw");

  const formatBalance = (value: number | undefined | null): string => {
    const num = typeof value === "number" && !isNaN(value) ? value : 0;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const safeBalance =
    typeof balance === "number" && !isNaN(balance) ? balance : 0;
  const safePrice =
    typeof gbxPriceSEK === "number" && !isNaN(gbxPriceSEK) ? gbxPriceSEK : 0;
  const balanceInSek = safeBalance * safePrice;
  const safeMaxPayout =
    typeof maxPayout === "number" && !isNaN(maxPayout) ? maxPayout : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("user.welcome")}, {user?.name || t("user.user")}!
          </h1>
        </div>

        <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-white/80 text-sm mb-1">
            {t("user.yourGbxBalance")}
          </p>
          <p className="text-4xl font-bold text-white mb-2">
            {formatBalance(safeBalance)} GBX
          </p>
          <p className="text-white/70 text-sm">
            ≈ {balanceInSek.toFixed(2)} SEK
          </p>
          {safeMaxPayout > 0 && (
            <p className="text-white/60 text-xs mt-2">
              {t("user.maxWithdraw")}: {safeMaxPayout.toFixed(2)} SEK
            </p>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("user.currentGbxPrice")}
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            1 GBX = {safePrice.toFixed(4)} SEK
          </p>
        </div>

        {/* Visa bara banner om bank saknas */}
        {!isOnboarded && (
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {t("user.bankNotConnected")}
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {t("user.connectBankFirst")}
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnectBank}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm whitespace-nowrap"
              >
                {t("user.connectBank")}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleBuyGbx}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl py-5 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
          >
            <FiDollarSign size={28} />
            <span className="text-lg font-semibold">{t("user.buyGbx")}</span>
          </button>
          <button
            onClick={handleSendGbx}
            className="w-full bg-green-600 text-white rounded-xl py-5 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
          >
            <FiSend size={28} />
            <span className="text-lg font-semibold">{t("user.sendGbx")}</span>
          </button>
          <button
            onClick={handleWithdraw}
            disabled={!isOnboarded}
            className={`w-full rounded-xl py-5 flex items-center justify-center gap-3 shadow-lg transition transform hover:scale-[1.02] ${
              isOnboarded
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
            title={!isOnboarded ? t("user.connectBankFirst") : ""}
          >
            <FiArrowUp size={28} />
            <span className="text-lg font-semibold">
              {t("user.withdrawGbx")}
            </span>
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <FiTrendingUp className="w-4 h-4" />
            <span>{t("user.quickInfo")}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FiCreditCard className="w-3 h-3" /> {t("user.buyWithCard")}
            </div>
            <div className="flex items-center gap-1">
              <FiSend className="w-3 h-3" /> {t("user.sendToAnyone")}
            </div>
            <div className="flex items-center gap-1">
              <FiArrowUp className="w-3 h-3" /> {t("user.withdrawToBank")}
            </div>
            <div className="flex items-center gap-1">
              <FiSmartphone className="w-3 h-3" /> {t("user.mobileFriendly")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
