import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { es } from './locales/es';

i18n
    .use(initReactI18next)
    .init({
        lng: localStorage.getItem('nfast_language') || 'en', // Default to English, persist to localStorage
        fallbackLng: 'en',
        resources: {
            en,
            es
        },
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

export default i18n;
