// app/buy/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { FiCreditCard, FiSmartphone, FiDollarSign } from "react-icons/fi";

export default function BuyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSelectMethod = (method: string) => {
    if (!user) {
      router.push(`/login?redirect=/buy/payment/${method}&amount=${amount}`);
      return;
    }
    if (method !== "card") {
      // För UPI och M-Pesa – visa tillfälligt meddelande om under konstruktion
      alert(t("payment.underConstruction"));
      return;
    }
    router.push(`/buy/payment/${method}?amount=${amount}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {t("buy.title")}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
            {t("payment.amount")}
          </p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("buy.amountPlaceholder")}
            className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {error && (
            <div className="bg-red-100 dark:bg-red-950/30 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={() => handleSelectMethod("card")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiCreditCard /> {t("payment.methods.card")}
            </button>
            <button
              onClick={() => handleSelectMethod("upi")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiSmartphone /> {t("payment.methods.upi")}
            </button>
            <button
              onClick={() => handleSelectMethod("mpesa")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiDollarSign /> {t("payment.methods.mpesa")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
