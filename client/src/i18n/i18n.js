// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import he from "./locales/he.json"; // הנתיב לקובץ התרגום

i18n
  .use(initReactI18next)
  .init({
    resources: {
      he: {
        translation: he,
      },
    },
    lng: "he", // ברירת מחדל: עברית
    fallbackLng: "he", // במקרה שלא נמצאה שפה אחרת
    interpolation: {
      escapeValue: false, // React כבר עושה זאת עבורך
    },
  });

export default i18n;
