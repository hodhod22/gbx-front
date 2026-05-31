"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const { user } = useAuth();

  useEffect(() => {
    if (!sessionId) {
      console.error("Ingen session_id i URL");
      setStatus("failed");
      return;
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}`; // Ändrat till 4000

    const verifyPayment = async () => {
      try {
        console.log("Verifierar session:", sessionId);
        const res = await fetch(
          `${backendUrl}/api/stripe/verify-session?session_id=${sessionId}`,
        );
        const data = await res.json();
        console.log("Svar från backend:", data);

        if (res.ok && data.success) {
          setStatus("success");
        } else {
          console.error("Verifiering misslyckades:", data.error);
          setStatus("failed");
        }
      } catch (err) {
        console.error("Fetch-fel:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Verifierar din betalning...
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Betalning lyckades!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ditt GBX-saldo har uppdaterats.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Gå till dashboard
            </Link>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-600 mb-4">
              Något gick fel. Kontakta support.
            </p>
            <Link href="/buy" className="text-blue-600 hover:underline">
              Försök igen
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
