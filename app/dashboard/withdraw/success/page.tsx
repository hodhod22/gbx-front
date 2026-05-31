"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiHome, FiRepeat } from "react-icons/fi";

export default function WithdrawSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Navigation efter 5 sekunder
    const timeoutId = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    // Uppdatera nedräkning varje sekund
    const intervalId = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Rensa timers när komponenten avmonteras
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("withdraw.successTitle")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t("withdraw.successMessage")}
        </p>

        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("withdraw.successInfo")}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {t("withdraw.successEmailSent")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <FiHome className="w-4 h-4" />
            {t("withdraw.goToDashboard")}
          </Link>
          <Link
            href="/dashboard/withdraw"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FiRepeat className="w-4 h-4" />
            {t("withdraw.newWithdraw")}
          </Link>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          {t("withdraw.redirectDashboard", { seconds: countdown })}
        </p>
      </div>
    </div>
  );
}
