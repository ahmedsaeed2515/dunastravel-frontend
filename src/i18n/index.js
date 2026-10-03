import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const supportedLngs = ['en', 'ar', 'es', 'pt', 'it'];

const toTitleCase = (value) => {
  if (typeof value !== 'string' || !value) return value;
  if (value.startsWith('http://') || value.startsWith('https://') || (value.includes('@') && !value.includes(' '))) {
    return value;
  }
  if (value.includes('<') && value.includes('>')) {
    return value.replace(/(^|>)([^<]+)(?=<|$)/g, (_, prefix, content) => {
      const capitalized = content.replace(/\b[a-z\u00C0-\u024F]/g, (c) => c.toUpperCase());
      return prefix + capitalized;
    });
  }
  return value.replace(/\b[a-z\u00C0-\u024F]/g, (c) => c.toUpperCase());
};

const transformObjToTitleCase = (obj) => {
  if (!obj) return obj;
  if (typeof obj === 'string') return toTitleCase(obj);
  if (Array.isArray(obj)) {
    return obj.map(item => typeof item === 'string' ? toTitleCase(item) : transformObjToTitleCase(item));
  }
  if (typeof obj === 'object') {
    const res = {};
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === 'string') {
        res[k] = toTitleCase(v);
      } else if (typeof v === 'object' && v !== null) {
        res[k] = transformObjToTitleCase(v);
      } else {
        res[k] = v;
      }
    }
    return res;
  }
  return obj;
};

const loadLocaleResource = async (lng) => {
  let raw;
  switch (lng) {
    case 'ar': return (await import('./locales/ar.json')).default;
    case 'es': raw = (await import('./locales/es.json')).default; break;
    case 'it': raw = (await import('./locales/it.json')).default; break;
    case 'pt': raw = (await import('./locales/pt.json')).default; break;
    case 'en': default: raw = (await import('./locales/en.json')).default; break;
  }
  return transformObjToTitleCase(raw);
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



const pascalCasePostProcessor = {
  type: 'postProcessor',
  name: 'pascalCaseProcessor',
  process(value) {
    const currentLng = i18n.language || 'en';
    if (currentLng === 'ar' || currentLng.startsWith('ar')) return value;
    return toTitleCase(value);
  }
};

i18n.use(pascalCasePostProcessor).use(LanguageDetector).use(initReactI18next);

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
        postProcess: ['pascalCaseProcessor'],
      });

      syncDocumentDirection(lng);

      // Load locales lazily on-demand when switched

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


