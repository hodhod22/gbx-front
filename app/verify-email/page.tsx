"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token provided.");
      return;
    }

    const verify = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      try {
        const res = await fetch(
          `${backendUrl}/api/auth/verify-email?token=${token}`,
        );
        if (res.ok) {
          setStatus("success");
          setTimeout(() => router.push("/settings"), 3000);
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMsg(data.error || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      }
    };
    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold">Verifierar e-post...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You will be redirected shortly.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verification failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{errorMsg}</p>
            <button
              onClick={() => router.push("/settings")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go to Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
}
