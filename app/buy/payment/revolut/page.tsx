// app/buy/payment/revolut/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function RevolutPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const amount = searchParams.get("amount") || "0";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  
  const handlePayWithRevolut = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/revolut/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        // Omdirigera till Revolut checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || "Kunde inte initiera betalning");
      }
    } catch (err) {
      setError("Nätverksfel, försök igen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/buy/payment/revolut");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Betala med Revolut
        </h1>
        <div className="text-center mb-6">
          <p className="text-gray-600">Belopp att betala:</p>
          <p className="text-3xl font-bold text-blue-600">{amount} SEK</p>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <button
          onClick={handlePayWithRevolut}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Förbereder betalning..." : "Betala med Revolut"}
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Du omdirigeras till Revoluts säkra betalningssida.
        </p>
      </div>
    </div>
  );
}

export default function RevolutPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Laddar...
        </div>
      }
    >
      <RevolutPaymentContent />
    </Suspense>
  );
}
