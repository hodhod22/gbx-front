"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";

interface Fee {
  id: string;
  name: string;
  stripe_percent: number | null;
  stripe_fixed: number | null;
  platform_percent: number;
  total_percent: number | null;
  total_fixed: number | null;
  currency: string | null;
  note: string | null;
}

export default function FeesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFees = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      try {
        const res = await fetch(`${backendUrl}/api/fees`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) setFees(data.methods);
        else setError(data.error || "Failed to load fees");
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-3">
      <div className="max-w-6xl mx-auto mb-32">
        {/* Tillbaka-knapp */}
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FiArrowLeft /> {t("common.back")}
        </button>

        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {t("fees.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t("fees.subtitle")}
        </p>

        {/* Mobil: visa endast metod + total avgift */}
        <div className="block md:hidden space-y-3">
          {fees.map((method) => (
            <div
              key={method.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {method.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {method.total_percent !== null
                  ? `${method.total_percent}% + ${method.total_fixed} ${method.currency?.toUpperCase()}`
                  : t("fees.variable")}
                {method.note && (
                  <span className="ml-1 text-xs text-gray-400">
                    ({method.note})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: full tabell */}
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("fees.method")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("fees.stripeFee")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("fees.platformFee")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("fees.totalFee")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {fees.map((method) => (
                <tr key={method.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {method.stripe_percent !== null
                      ? `${method.stripe_percent}% + ${method.stripe_fixed} ${method.currency?.toUpperCase()}`
                      : t("fees.variable")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {method.platform_percent}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {method.total_percent !== null
                      ? `${method.total_percent}% + ${method.total_fixed} ${method.currency?.toUpperCase()}`
                      : t("fees.variable")}
                    {method.note && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({method.note})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs text-blue-800 dark:text-blue-200">
          {t("fees.note")}
        </div>
      </div>
    </div>
  );
}
