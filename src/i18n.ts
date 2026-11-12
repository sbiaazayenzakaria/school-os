import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// EN
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';

// FR
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frDashboard from './locales/fr/dashboard.json';

// DE
import deCommon from './locales/de/common.json';
import deNavigation from './locales/de/navigation.json';
import deDashboard from './locales/de/dashboard.json';

export const supportedLanguages = ['en', 'fr', 'de'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
};

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
};

const resources = {
  en: { common: enCommon, navigation: enNavigation, dashboard: enDashboard },
  fr: { common: frCommon, navigation: frNavigation, dashboard: frDashboard },
  de: { common: deCommon, navigation: deNavigation, dashboard: deDashboard },
};

const savedLang = localStorage.getItem(
  'schoolos_lang'
) as SupportedLanguage | null;
const detectedLang: SupportedLanguage =
  savedLang && supportedLanguages.includes(savedLang) ? savedLang : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: detectedLang,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'navigation', 'dashboard'],
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
