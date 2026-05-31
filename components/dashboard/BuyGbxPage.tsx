// components/dashboard/BuyGbxPage.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BuyGbxPage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");

  const handleBuy = () => {
    // Implementera köp-logik
    alert(t("buy.action", { amount }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("buy.title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t("buy.subtitle")}
        </p>
        <input
          type="number"
          placeholder={t("buy.amountPlaceholder")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleBuy}
          className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          {t("buy.button")}
        </button>
      </div>
    </div>
  );
}
