// components/dashboard/BalancesPage.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Balance {
  currency: string;
  amount: number;
  symbol: string;
  flag: string;
}

export default function BalancesPage() {
  const { t } = useTranslation();
  const [balances] = useState<Balance[]>([
    { currency: "USD", amount: 1250.0, symbol: "$", flag: "🇺🇸" },
    { currency: "EUR", amount: 1150.0, symbol: "€", flag: "🇪🇺" },
    { currency: "TRY", amount: 12500.0, symbol: "₺", flag: "🇹🇷" },
    { currency: "SEK", amount: 8500.0, symbol: "kr", flag: "🇸🇪" },
    { currency: "BRL", amount: 3200.0, symbol: "R$", flag: "🇧🇷" },
    { currency: "CNY", amount: 4800.0, symbol: "¥", flag: "🇨🇳" },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t("balances.title")}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {balances.map((b) => (
          <div
            key={b.currency}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <span className="text-3xl">{b.flag}</span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {b.currency}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
              {b.symbol}
              {b.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
