import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from './locale/en.json'
import thJSON from './locale/th.json'
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
.use(LanguageDetector)
.use(initReactI18next).init({
 resources: {
  en:{...enJSON},
  th:{...thJSON},
 }, // Where we're gonna put translations' files
 detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Order of language detection
    lookupQuerystring: 'lng', // Query parameter name for language
    lookupCookie: 'i18next', // Cookie name for language
    lookupLocalStorage: 'i18nextLng', // Local storage key for language
    // Use the browser Accept-Language header
    lookupFromSubdomain: false, // Disable subdomain language detection
    lookupFromPath: false, // Disable path language detection
    lookupFromUrl: false, // Disable URL language detection
    lookupFromBrowser: true // Enable browser language detection
  },    // Set the initial language of the App
});