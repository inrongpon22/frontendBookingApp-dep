import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translations
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React"
      // Add more key-value pairs for English translations
    }
  },
  de: {
    translation: {
      "Welcome to React": "Willkommen bei React"
      // Add more key-value pairs for German translations
    }
  }
  // Add more languages here
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // language to use, more languages can be added later
    interpolation: {
      escapeValue: false // react already escapes values
    }
  });

export default i18n;