// components/dashboard/SendGbxPage.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSend, FiAlertCircle } from "react-icons/fi";

export default function SendGbxPage() {
  const { t } = useTranslation();
  const [recipientGbxId, setRecipientGbxId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    setError("");
    setSuccess("");

    if (!recipientGbxId.trim()) {
      setError("Ange mottagarens GBX-ID");
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Ange ett giltigt belopp större än 0");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/gbx/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipientGbxId: recipientGbxId.trim(),
            amount: amountNum,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Överföring misslyckades");
      setSuccess(data.message);
      setRecipientGbxId("");
      setAmount("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <FiSend className="w-6 h-6 text-green-600 dark:text-green-400" />
          {t("send.title")}
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          {t("send.subtitle")}
        </p>

        {error && (
          <div className="bg-red-100 dark:bg-red-950/30 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-950/30 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <input
          type="text"
          placeholder="Mottagarens GBX-ID (t.ex. a1b2c3d4)"
          value={recipientGbxId}
          onChange={(e) => setRecipientGbxId(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <input
          type="number"
          placeholder="Belopp (GBX)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            "Skickar..."
          ) : (
            <>
              <FiSend /> Skicka GBX
            </>
          )}
        </button>
        <p className="text-xs text-center text-gray-400 mt-4">
          Du hittar mottagarens GBX-ID i deras profil.
        </p>
      </div>
    </div>
  );
}
