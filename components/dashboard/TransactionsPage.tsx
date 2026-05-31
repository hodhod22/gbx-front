// components/dashboard/TransactionsPage.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiRepeat,
  FiDownload,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

interface Transaction {
  id: string;
  type: "transfer" | "deposit" | "withdraw";
  from: string;
  to: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "transfer",
      from: "Ali",
      to: "You",
      amount: 250,
      currency: "USD",
      date: "2026-05-19",
      status: "completed",
    },
    {
      id: "2",
      type: "deposit",
      from: "Bank",
      to: "Wallet",
      amount: 500,
      currency: "EUR",
      date: "2026-05-18",
      status: "completed",
    },
    {
      id: "3",
      type: "withdraw",
      from: "Wallet",
      to: "Bank",
      amount: 1000,
      currency: "TRY",
      date: "2026-05-17",
      status: "pending",
    },
  ]);

  const getStatusIcon = (status: string) => {
    if (status === "completed")
      return <FiCheckCircle className="text-green-500" />;
    if (status === "pending") return <FiClock className="text-yellow-500" />;
    return <FiXCircle className="text-red-500" />;
  };

  const getTypeIcon = (type: string) => {
    if (type === "transfer") return <FiRepeat />;
    if (type === "deposit") return <FiDownload />;
    return <FiSend />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t("transactions.title")}
      </h1>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {getTypeIcon(tx.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tx.type === "transfer"
                      ? `${t("transactions.from")} ${tx.from}`
                      : tx.type === "deposit"
                        ? `${t("transactions.depositFrom")} ${tx.from}`
                        : `${t("transactions.withdrawTo")} ${tx.to}`}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${tx.type === "deposit" ? "text-green-600" : tx.type === "withdraw" ? "text-red-600" : "text-blue-600"}`}
                >
                  {tx.type === "deposit"
                    ? "+"
                    : tx.type === "withdraw"
                      ? "-"
                      : "→"}{" "}
                  {tx.amount} {tx.currency}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {getStatusIcon(tx.status)}
                  <span>{t(`transactions.${tx.status}`)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
