import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const supportedLngs = ['en', 'ar', 'es', 'pt', 'it'];

export const loadCoreLocaleResource = async (lng) => {
  switch (lng) {
    case 'ar': return (await import('./locales/core/ar.json')).default;
    case 'es': return (await import('./locales/core/es.json')).default;
    case 'it': return (await import('./locales/core/it.json')).default;
    case 'pt': return (await import('./locales/core/pt.json')).default;
    case 'en': default: return (await import('./locales/core/en.json')).default;
  }
};

export const loadExtendedLocaleResource = async (lng) => {
  switch (lng) {
    case 'ar': return (await import('./locales/extended/ar.json')).default;
    case 'es': return (await import('./locales/extended/es.json')).default;
    case 'it': return (await import('./locales/extended/it.json')).default;
    case 'pt': return (await import('./locales/extended/pt.json')).default;
    case 'en': default: return (await import('./locales/extended/en.json')).default;
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
      const coreData = await loadCoreLocaleResource(lng);
      
      const resources = {
        [lng]: { translation: coreData }
      };

      await i18n.init({
        resources,
        fallbackLng: 'en',
        lng,
        interpolation: { escapeValue: false },
        keySeparator: false,
      });

      syncDocumentDirection(lng);

      // Hydrate extended catalogue translations (tours/blogs) after initial render or immediately in test
      const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || Boolean(process.env?.VITEST));
      const hydrateExtended = async (targetLng) => {
        try {
          const extData = await loadExtendedLocaleResource(targetLng);
          i18n.addResourceBundle(targetLng, 'translation', extData, true, true);
        } catch (e) {
          console.warn('Extended locale load error:', e);
        }
      };

      if (isTest) {
        await hydrateExtended(lng);
      } else if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => hydrateExtended(lng), { timeout: 3000 });
      } else {
        setTimeout(() => hydrateExtended(lng), 500);
      }

      // Load locales lazily on-demand when switched
      i18n.on('languageChanged', async (newLng) => {
        syncDocumentDirection(newLng);
        const lang = newLng.split('-')[0];
        if (supportedLngs.includes(lang)) {
          if (!i18n.hasResourceBundle(lang, 'translation')) {
            const data = await loadCoreLocaleResource(lang);
            i18n.addResourceBundle(lang, 'translation', data, true, true);
          }
          hydrateExtended(lang).then(() => {
            i18n.emit('loaded');
          }).catch(() => {});
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


