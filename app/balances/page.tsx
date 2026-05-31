// components/dashboard/BalancesPage.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  FiShoppingCart,
  FiSend,
  FiDownload,
  FiTrendingUp,
  FiShield,
  FiGlobe,
  FiDollarSign,
} from "react-icons/fi";

interface Transaction {
  id: number;
  type: "transfer_sent" | "transfer_received" | "deposit" | "withdrawal";
  amount: number;
  counterparty_name?: string;
  created_at: string;
}

export default function BalancesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

        // Hämta senaste transaktioner (exempel – anpassa till din backend)
        const txRes = await fetch(
          `${backendUrl}/api/gbx/transactions?limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.transactions || []);
        }
      } catch (err) {
        console.error(err);
        setError(t("balances.error") || "Kunde inte ladda data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

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
      <div className="max-w-4xl mx-auto">
        {/* Saldokort */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-8">
          <p className="text-blue-100 text-sm mb-2">{t("balances.title")}</p>
          <p className="text-4xl md:text-5xl font-bold tracking-tight">
            {balance?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{" "}
            GBX
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/buy"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition"
            >
              <FiShoppingCart /> {t("user.buyGbx")}
            </Link>
            <Link
              href="/send"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition"
            >
              <FiSend /> {t("user.sendGbx")}
            </Link>
            <Link
              href="/dashboard/withdraw"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition"
            >
              <FiDownload /> {t("user.withdrawGbx")}
            </Link>
          </div>
        </div>

        {/* Senaste transaktioner */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t("balances.latestTransactions")}
          </h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              {t("balances.noTransactions")}
            </p>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {tx.type === "deposit" && t("balances.deposit")}
                      {tx.type === "withdrawal" && t("balances.withdrawal")}
                      {tx.type === "transfer_sent" &&
                        `${t("balances.sentTo")} ${tx.counterparty_name || t("balances.user")}`}
                      {tx.type === "transfer_received" &&
                        `${t("balances.receivedFrom")} ${tx.counterparty_name || t("balances.user")}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toFixed(4)} GBX
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Övertygande sektion – världens mest stabila valuta */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
          <FiShield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("balances.stableTitle")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("balances.stableText")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <FiGlobe className="text-blue-500" />
              <span className="text-sm">
                85% {t("balances.currencyBasket")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" />
              <span className="text-sm">
                15% {t("balances.preciousMetals")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-blue-500" />
              <span className="text-sm">
                {t("balances.inflationProtected")}
              </span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t("balances.callToAction")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
