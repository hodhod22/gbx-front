// components/dashboard/ProfilePage.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { FiUser, FiMail, FiHash, FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (user?.gbxId) {
      await navigator.clipboard.writeText(user.gbxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t("profile.title")}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header med avatar och namn */}
        <div className="bg-linear-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-semibold">{user?.name}</p>
              <p className="text-blue-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Info-kort */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-3">
            <FiUser className="w-5 h-5 text-blue-500" />
            <span className="font-medium w-24">{t("profile.name")}:</span>
            <span>{user?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-3">
            <FiMail className="w-5 h-5 text-blue-500" />
            <span className="font-medium w-24">{t("profile.email")}:</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <FiHash className="w-5 h-5 text-blue-500" />
            <span className="font-medium w-24">
              {t("profile.gbxId") || "GBX-ID"}:
            </span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono text-sm">
                {user?.gbxId || "laddar..."}
              </code>
              {user?.gbxId && (
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300"
                  title="Kopiera GBX-ID"
                >
                  {copied ? (
                    <FiCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tips-ruta */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 m-6 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <FiHash className="w-4 h-4" />
            Dela detta ID med vänner så kan de skicka GBX direkt till dig.
          </p>
        </div>
      </div>
    </div>
  );
}
