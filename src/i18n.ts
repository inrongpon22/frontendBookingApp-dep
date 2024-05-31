import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// resources
import enJSON from "./locale/en.json";
import thJSON from "./locale/th.json";

i18n.use(initReactI18next).init({
    // debug: true,
    resources: {
        en: { ...enJSON },
        th: { ...thJSON },
    },
    lng: "th", // Set the initial language of the App
});