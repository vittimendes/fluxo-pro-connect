
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptTranslation from "./locales/pt.json";
import enTranslation from "./locales/en.json";

const resources = {
  pt: {
    translation: ptTranslation
  },
  en: {
    translation: enTranslation
  }
};

// Initialize i18n with explicit typing
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false // not needed for React as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    supportedLngs: ['pt', 'en'] // Explicitly define supported languages
  });

export default i18n;
