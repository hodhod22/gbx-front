// frontend/components/LanguageSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { FiGlobe, FiCheck } from "react-icons/fi";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "sv", name: "Svenska", flag: "🇸🇪", dir: "ltr" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "ru", name: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "fa", name: "فارسی", flag: "🇮🇷", dir: "rtl" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "zh", name: "中文", flag: "🇨🇳", dir: "ltr" },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const { user, updateUserLanguage } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    languages.find((l) => l.code === i18n.language) || languages[0],
  );

  useEffect(() => {
    const lang = languages.find((l) => l.code === i18n.language);
    if (lang) {
      setCurrentLang(lang);
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = lang.code;
    }
  }, [i18n.language]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("i18nextLng", langCode);

    if (user) {
      updateUserLanguage(langCode);
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        aria-label={t("language.select") || "Select language"}
      >
        <FiGlobe className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition ${
                  currentLang.code === lang.code
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : ""
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {lang.name}
                </span>
                {currentLang.code === lang.code && (
                  <FiCheck className="w-4 h-4 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
