// frontend/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const supportedLangs = ["en", "sv", "ru", "fa", "ar", "zh","es"]; // ← ryska tillagd

if (typeof window !== "undefined") {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      debug: false,
      supportedLngs: supportedLangs,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: "/locales/{{lng}}/common.json",
      },
      detection: {
        order: ["localStorage", "cookie", "navigator"],
        caches: ["localStorage"],
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
