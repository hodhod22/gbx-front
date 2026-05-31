// components/dashboard/TransactionsPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowUp,
  FiArrowDown,
  FiRepeat,
  FiDollarSign,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";

interface Transaction {
  id: number;
  type: "deposit" | "withdrawal" | "transfer_sent" | "transfer_received";
  amount: number; // i GBX
  counterparty_name?: string;
  status: "completed" | "pending" | "failed";
  created_at: string;
}

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      try {
        const res = await fetch(`${backendUrl}/api/gbx/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error(err);
        setError(t("transactions.error") || "Kunde inte ladda transaktioner");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [t]);

  const getIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <FiArrowDown className="text-green-500" />;
      case "withdrawal":
        return <FiArrowUp className="text-red-500" />;
      case "transfer_sent":
        return <FiRepeat className="text-orange-500" />;
      case "transfer_received":
        return <FiRepeat className="text-blue-500" />;
      default:
        return <FiDollarSign className="text-gray-500" />;
    }
  };

  const getTypeText = (tx: Transaction) => {
    if (tx.type === "deposit") return t("transactions.deposit");
    if (tx.type === "withdrawal") return t("transactions.withdrawal");
    if (tx.type === "transfer_sent")
      return `${t("transactions.sentTo")} ${tx.counterparty_name || t("transactions.user")}`;
    if (tx.type === "transfer_received")
      return `${t("transactions.receivedFrom")} ${tx.counterparty_name || t("transactions.user")}`;
    return "";
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-0">
            {t("transactions.title")}
          </h1>
          <div className="flex flex-wrap gap-3">
            {/* Filter */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("transactions.filterAll")}</option>
                <option value="deposit">
                  {t("transactions.filterDeposits")}
                </option>
                <option value="withdrawal">
                  {t("transactions.filterWithdrawals")}
                </option>
                <option value="transfer_sent">
                  {t("transactions.filterSent")}
                </option>
                <option value="transfer_received">
                  {t("transactions.filterReceived")}
                </option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Sortering */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as "newest" | "oldest")
                }
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{t("transactions.sortNewest")}</option>
                <option value="oldest">{t("transactions.sortOldest")}</option>
              </select>
              <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {sortedTransactions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t("transactions.noTransactions")}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="hidden md:grid md:grid-cols-5 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-2">{t("transactions.description")}</div>
              <div>{t("transactions.amount")}</div>
              <div>{t("transactions.status")}</div>
              <div>{t("transactions.date")}</div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 md:grid md:grid-cols-5 md:gap-4 flex flex-col space-y-2 md:space-y-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getIcon(tx.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTypeText(tx)}
                      </p>
                      {tx.counterparty_name && tx.type === "transfer_sent" && (
                        <p className="text-xs text-gray-500">
                          {tx.counterparty_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p
                      className={`text-sm font-semibold ${
                        tx.type === "deposit" || tx.type === "transfer_received"
                          ? "text-green-600"
                          : tx.type === "withdrawal" ||
                              tx.type === "transfer_sent"
                            ? "text-red-600"
                            : "text-gray-900"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "transfer_received"
                        ? "+"
                        : "-"}
                      {tx.amount.toFixed(4)} GBX
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {t(`transactions.status_${tx.status}`)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 md:text-right">
                    {new Date(tx.created_at).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
