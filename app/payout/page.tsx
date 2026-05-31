// app/payout/page.tsx (eller lägg in i dashboard)
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PayoutPage() {
  const { user } = useAuth();
  const [maxPayout, setMaxPayout] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [onboardingUrl, setOnboardingUrl] = useState("");

  // Hämta maxbelopp
  useEffect(() => {
    const fetchMax = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/gbx/max-payout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMaxPayout(data.maxNetSek);
    };
    fetchMax();
  }, []);

  // Koppla bankkonto
  const handleConnectBank = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/gbx/onboarding-link", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  // Begär uttag
  const handleRequestPayout = async () => {
    const netAmount = parseFloat(amount);
    if (isNaN(netAmount) || netAmount <= 0) {
      setMessage("Ange ett giltigt belopp");
      return;
    }
    if (netAmount > maxPayout) {
      setMessage("Beloppet överstiger ditt maxuttag");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/gbx/request-payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ netAmountSek: netAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Uttag begärt! Payout ID: ${data.payoutId}`);
      setAmount("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Ta ut pengar</h1>

      <button
        onClick={handleConnectBank}
        className="w-full mb-4 bg-blue-600 text-white py-2 rounded-lg"
      >
        Koppla bankkonto
      </button>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Max uttag (efter avgifter): {maxPayout.toFixed(2)} SEK
        </label>
        <input
          type="number"
          placeholder="Belopp i SEK"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
        />
      </div>

      <button
        onClick={handleRequestPayout}
        disabled={loading || maxPayout <= 0}
        className="w-full bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Bearbetar..." : "Begär uttag"}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
}
