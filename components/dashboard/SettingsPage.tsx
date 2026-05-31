// components/dashboard/SettingsPage.tsx
"use client";

import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t("settings.title")}
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-md">
        <p className="text-gray-600 dark:text-gray-400">
          {t("settings.comingSoon")}
        </p>
      </div>
    </div>
  );
}
