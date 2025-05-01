// i18n.ts

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import ja from './locales/ja.json';
import vi from './locales/vi.json';

const resources = {
  en: {translation: en},
  vi: {translation: vi},
  ja: {translation: ja},
};

const fallback = {languageTag: 'en', isRTL: false};
const locales = RNLocalize.getLocales();
const languageTag =
  locales.find(locale => Object.keys(resources).includes(locale.languageTag))
    ?.languageTag || fallback.languageTag;

i18n.use(initReactI18next).init({
  resources,
  lng: languageTag,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
