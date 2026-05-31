// app/buy/payment/[method]/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

// Lista över metoder som Stripe hanterar (går direkt till checkout)
// Du kan lägga till fler här när du aktiverar dem i Stripe Dashboard
const STRIPE_METHODS = [
  "card",
  "alipay",
  "wechat",
  // "ideal", "klarna", "pix", "blik", "cartes_bancaires", "zarinpal", "troy"
];

function PaymentMethodPageContent() {
  const { method } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const amount = searchParams.get("amount") || "0";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);

  const methodId = method as string;
  const isStripeMethod = STRIPE_METHODS.includes(methodId);
  const methodNameKey = `payment.methods.${methodId}`;

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setShowUnderConstruction(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setError(t("payment.notLoggedIn"));
      setLoading(false);
      return;
    }

    if (!isStripeMethod) {
      setShowUnderConstruction(true);
      setLoading(false);
      return;
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    const parsedAmount = parseFloat(amount);

    try {
      const res = await fetch(
        `${backendUrl}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: parsedAmount }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("payment.initError"));

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t("payment.invalidResponse"));
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || t("payment.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
        >
          <FiArrowLeft /> {t("common.back")}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">{t(methodNameKey)}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t("payment.amount")}:{" "}
            <span className="font-bold text-lg">{amount} SEK</span>
          </p>

          {error && (
            <div className="bg-red-100 dark:bg-red-950/30 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {showUnderConstruction && (
            <div className="bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 p-3 rounded-lg mb-4 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              {t("payment.underConstruction")}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? t("payment.processing") : t("payment.button")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Laddar...
        </div>
      }
    >
      <PaymentMethodPageContent />
    </Suspense>
  );
}
