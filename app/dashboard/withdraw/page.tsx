"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  FiCreditCard,
  FiAlertCircle,
  FiArrowLeft,
  FiZap,
  FiClock,
  FiInfo,
} from "react-icons/fi";

interface WithdrawMethod {
  id: string;
  nameKey: string;
  icon: React.ReactNode;
  descriptionKey: string;
  minAmount: number;
  maxAmount: number;
  processingTimeKey: string;
  feeKey: string;
  feePercentage: number;
  feeFixed: number;
  isPopular?: boolean;
  isInstant?: boolean;
  isActive: boolean;
}

export default function WithdrawPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxPayout, setMaxPayout] = useState(0);
  const [gbxPriceSEK, setGbxPriceSEK] = useState(0);
  const [estimatedFee, setEstimatedFee] = useState(0);
  const [estimatedNet, setEstimatedNet] = useState(0);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      try {
        const balanceRes = await fetch(`${backendUrl}/api/gbx/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const balanceData = await balanceRes.json();
        setBalance(balanceData.balance ?? 0);
        const priceRes = await fetch(`${backendUrl}/api/gbx/price/SEK`);
        const priceData = await priceRes.json();
        setGbxPriceSEK(priceData.price_per_gbx ?? 0);
        const maxRes = await fetch(`${backendUrl}/api/gbx/max-payout`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const maxData = await maxRes.json();
        setMaxPayout(maxData.maxNetSek ?? 0);
        const onboardRes = await fetch(
          `${backendUrl}/api/gbx/check-stripe-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const onboardData = await onboardRes.json();
        setIsOnboarded(onboardData.isOnboarded || false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedMethod && amount) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum) && amountNum > 0) {
        const fee =
          amountNum * selectedMethod.feePercentage + selectedMethod.feeFixed;
        setEstimatedFee(fee);
        setEstimatedNet(amountNum - fee);
      } else {
        setEstimatedFee(0);
        setEstimatedNet(0);
      }
    }
  }, [selectedMethod, amount]);

  const withdrawMethods: WithdrawMethod[] = [
    {
      id: "card",
      nameKey: "withdraw.cardWithdrawal",
      icon: <FiCreditCard className="w-6 h-6" />,
      descriptionKey: "withdraw.cardWithdrawalDesc",
      minAmount: 100,
      maxAmount: 50000,
      processingTimeKey: "withdraw.processingTimeInstant",
      feeKey: "withdraw.feeCard",
      feePercentage: 0.025,
      feeFixed: 3,
      isPopular: true,
      isInstant: true,
      isActive: true,
    },
  ];

  const handleMethodSelect = (method: WithdrawMethod) => {
    setError("");
    setAmount("");
    if (method.id === "card") {
      if (!isOnboarded) {
        setError(t("withdraw.onboardingRequired"));
        return;
      }
      setSelectedMethod(method);
    }
  };

  const handleConnectBank = async () => {
    const token = localStorage.getItem("token");
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

  const handleWithdraw = async () => {
    if (!selectedMethod) {
      setError(t("withdraw.selectMethodError"));
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < selectedMethod.minAmount) {
      setError(
        `${t("withdraw.minAmountError")} ${selectedMethod.minAmount} SEK`,
      );
      return;
    }
    if (amountNum > maxPayout) {
      setError(`${t("withdraw.maxAmountError")} ${maxPayout.toFixed(2)} SEK`);
      return;
    }
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${backendUrl}/api/gbx/request-payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: selectedMethod.id,
          amount: amountNum,
          netAmountSek: estimatedNet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/dashboard/withdraw/success");
    } catch (err: any) {
      setError(err.message || t("withdraw.error"));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const balanceInSek = balance * gbxPriceSEK;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 md:py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <FiArrowLeft /> {t("common.back")}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("withdraw.title")}
        </h1>
        <p className="text-sm text-gray-500 mb-6">{t("withdraw.subtitle")}</p>

        {/* Banner om bank saknas */}
        {!isOnboarded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {t("withdraw.onboardingRequired")}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {t("withdraw.onboardingRequiredMsg")}
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

        <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg">
          <p className="text-white/80 text-sm mb-1">
            {t("withdraw.availableBalance")}
          </p>
          <p className="text-3xl font-bold text-white mb-1">
            {balance.toFixed(4)} GBX
          </p>
          <p className="text-white/70 text-sm">
            ≈ {balanceInSek.toFixed(2)} SEK
          </p>
          {maxPayout > 0 && (
            <p className="text-white/60 text-xs mt-2">
              {t("withdraw.maxWithdrawAfterFees")}: {maxPayout.toFixed(2)} SEK
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {withdrawMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMethod?.id === method.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-blue-600 text-xl">{method.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t(method.nameKey)}
                  </h3>
                  {method.isPopular && (
                    <span className="text-xs text-green-600">
                      {t("withdraw.popular")}
                    </span>
                  )}
                  {method.isInstant && (
                    <span className="text-xs text-orange-600 ml-1">
                      {t("withdraw.instant")}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {t(method.descriptionKey)}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>
                  {t("withdraw.minAmount")}: {method.minAmount} SEK
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {method.isInstant ? <FiZap /> : <FiClock />}
                  {t(method.processingTimeKey)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        {selectedMethod && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              {t("withdraw.withdrawWith")} {t(selectedMethod.nameKey)}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("withdraw.amountToWithdraw")}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`${t("withdraw.minAmount")} ${selectedMethod.minAmount} SEK`}
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  {t("withdraw.minAmount")}: {selectedMethod.minAmount} SEK
                </span>
                <span>
                  {t("withdraw.maxAmount")}: {selectedMethod.maxAmount} SEK
                </span>
              </div>
            </div>
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("withdraw.fee")}:</span>
                  <span>
                    {estimatedFee.toFixed(2)} SEK (
                    {selectedMethod.feePercentage * 100}% +{" "}
                    {selectedMethod.feeFixed} SEK)
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="font-medium">
                    {t("withdraw.netAmount")}:
                  </span>
                  <span className="font-bold text-green-600">
                    {estimatedNet.toFixed(2)} SEK
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={handleWithdraw}
              disabled={
                loading ||
                !amount ||
                parseFloat(amount) < selectedMethod.minAmount
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
            >
              {loading
                ? t("withdraw.processing")
                : t("withdraw.confirmWithdraw")}
            </button>
          </div>
        )}
      </div>
      <Link
        href="/fees"
        className="text-sm text-blue-600 hover:underline flex items-center gap-1 justify-end mt-4"
      >
        <FiInfo /> {t("fees.link")}
      </Link>
    </div>
  );
}
