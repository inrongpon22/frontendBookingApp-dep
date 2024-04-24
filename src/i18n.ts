import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from './locale/en.json'
import thJSON from './locale/th.json'

i18n.use(initReactI18next).init({
 resources: {
  en:{...enJSON},
  th:{...thJSON},
 }, // Where we're gonna put translations' files
 lng: "en",     // Set the initial language of the App
});