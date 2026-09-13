import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const supportedLngs = ['en', 'ar', 'es', 'pt', 'it'];

const loadLocaleResource = async (lng) => {
  switch (lng) {
    case 'ar': return (await import('./locales/ar.json')).default;
    case 'es': return (await import('./locales/es.json')).default;
    case 'it': return (await import('./locales/it.json')).default;
    case 'pt': return (await import('./locales/pt.json')).default;
    case 'en': default: return (await import('./locales/en.json')).default;
  }
};

const getDefaultLng = () => {
  try {
    const stored = localStorage.getItem('i18nextLng');
    if (stored) {
      const lang = stored.split('-')[0];
      if (supportedLngs.includes(lang)) return lang;
    }
  } catch {
    // ignore
  }
  const navLng = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
  return supportedLngs.includes(navLng) ? navLng : 'en';
};

export const syncDocumentDirection = (lng) => {
  if (typeof document === 'undefined') return;
  const isAr = lng && (lng === 'ar' || lng.startsWith('ar'));
  const dir = isAr ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng || 'en';
  if (document.body) {
    document.body.dir = dir;
    if (isAr) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
};

i18n.use(LanguageDetector).use(initReactI18next);

let initPromise = null;

export const initI18n = async () => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const lng = getDefaultLng();
      const initialData = await loadLocaleResource(lng);
      
      const resources = {
        [lng]: { translation: initialData }
      };

      await i18n.init({
        resources,
        fallbackLng: 'en',
        lng,
        interpolation: { escapeValue: false },
        keySeparator: false,
      });

      syncDocumentDirection(lng);

      // Preload all supported locales in the background so language switching is instant and reactive
      supportedLngs.forEach(async (l) => {
        if (!i18n.hasResourceBundle(l, 'translation')) {
          try {
            const data = await loadLocaleResource(l);
            i18n.addResourceBundle(l, 'translation', data, true, true);
          } catch (e) {
            console.warn(`Failed to preload locale ${l}:`, e);
          }
        }
      });

      i18n.on('languageChanged', async (newLng) => {
        syncDocumentDirection(newLng);
        const lang = newLng.split('-')[0];
        if (supportedLngs.includes(lang)) {
          if (!i18n.hasResourceBundle(lang, 'translation')) {
            const data = await loadLocaleResource(lang);
            i18n.addResourceBundle(lang, 'translation', data, true, true);
          }
          // Notify react-i18next to force re-render components with newly loaded translations
          i18n.emit('loaded');
        }
      });
    } catch (err) {
      console.warn('initI18n fallback triggered:', err);
    }
  })();
  return initPromise;
};

export default i18n;


