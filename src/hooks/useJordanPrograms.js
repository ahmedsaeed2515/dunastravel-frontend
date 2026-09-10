import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTours } from './useTours';
import { jordanTours } from '../data/jordanTours.js';

function getLocalizedField(fieldObj, locale) {
  if (!fieldObj) return '';
  if (typeof fieldObj === 'string') return fieldObj;
  return fieldObj[locale] || fieldObj.en || fieldObj.ar || Object.values(fieldObj)[0] || '';
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function useJordanPrograms() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(lang) ? lang : 'en';

  const { tours: liveJordanTours } = useTours({ destination: 'Jordan', limit: 50 });

  return useMemo(() => {
    const sourceList = (liveJordanTours && liveJordanTours.length > 0) ? liveJordanTours : jordanTours;
    return sourceList.map((program) => {
      const title = getLocalizedField(program.name || program.title, locale);
      const enTitle = getLocalizedField(program.name || program.title, 'en');
      const slug = program.slug || slugify(`${program.id}-${enTitle}`);
      const duration = getLocalizedField(program.duration, locale);
      const highlights = getLocalizedField(program.highlights, locale);
      const overview = getLocalizedField(program.overview, locale);
      const code = getLocalizedField(program.code, locale) || program.id;
      const minPax = getLocalizedField(program.minPax, locale);

      const days = Array.isArray(program.days)
        ? program.days.map((d) => ({
            day: d.day,
            title: getLocalizedField(d.title, locale),
            description: getLocalizedField(d.description, locale),
            meals: d.meals ? getLocalizedField(d.meals, locale) : null,
          }))
        : [];

      const resolveList = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) {
          return val.map(item => {
            if (typeof item === 'object' && item !== null) {
              return item[locale] || item.en || item.ar || item.es || Object.values(item)[0] || '';
            }
            return String(item || '');
          }).filter(Boolean);
        }
        if (typeof val === 'object' && val !== null) {
          return (val[locale] || val.en || val.ar || []).map(item => String(item || '')).filter(Boolean);
        }
        return [];
      };

      const included = resolveList(program.included || program.includes);
      const excluded = resolveList(program.excluded || program.excludes);

      const heroImage = program.heroImage || program.heroImageUrl || (Array.isArray(program.images) && program.images.length > 0 ? (typeof program.images[0] === 'string' ? program.images[0] : program.images[0]?.imageUrl) : null) || null;
      const images = Array.isArray(program.images) && program.images.length > 0
        ? program.images.map(img => typeof img === 'string' ? img : img?.imageUrl || img?.url || '').filter(Boolean)
        : (heroImage ? [heroImage] : []);

      return {
        ...program,
        id: program.id,
        title,
        slug,
        heroImage,
        images,
        duration,
        highlights: Array.isArray(highlights) ? highlights : [],
        included,
        excluded,
        overview,
        code,
        minPax,
        days,
        raw: program,
      };
    });
  }, [locale]);
}

export function getJordanProgramBySlug(slug, locale = 'en') {
  if (!slug) return null;
  const normSlug = String(slug).toLowerCase();
  
  const targetLocale = ['ar', 'en', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';

  const matched = jordanTours.find((p) => {
    const pSlug = p.slug || slugify(`${p.id}-${getLocalizedField(p.name, 'en')}`);
    return pSlug.toLowerCase() === normSlug || p.id.toLowerCase() === normSlug;
  });

  if (!matched) return null;

  const title = getLocalizedField(matched.name || matched.title, targetLocale);
  const duration = getLocalizedField(matched.duration, targetLocale);
  const highlights = getLocalizedField(matched.highlights, targetLocale);
  const overview = getLocalizedField(matched.overview, targetLocale);
  const code = getLocalizedField(matched.code, targetLocale) || matched.id;
  const minPax = getLocalizedField(matched.minPax, targetLocale);

  const resolveList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[targetLocale] || item.en || item.ar || item.es || Object.values(item)[0] || '';
        }
        return String(item || '');
      }).filter(Boolean);
    }
    if (typeof val === 'object' && val !== null) {
      return (val[targetLocale] || val.en || val.ar || []).map(item => String(item || '')).filter(Boolean);
    }
    return [];
  };

  const included = resolveList(matched.included || matched.includes);
  const excluded = resolveList(matched.excluded || matched.excludes);

  const days = Array.isArray(matched.days)
    ? matched.days.map((d) => ({
        day: d.day,
        title: getLocalizedField(d.title, targetLocale),
        description: getLocalizedField(d.description, targetLocale),
        meals: d.meals ? getLocalizedField(d.meals, targetLocale) : null,
      }))
    : [];

  return {
    ...matched,
    id: matched.id,
    title,
    slug: matched.slug || slugify(`${matched.id}-${getLocalizedField(matched.name, 'en')}`),
    images: Array.isArray(matched.images) && matched.images.length > 0 ? matched.images : [matched.heroImage],
    duration,
    highlights: Array.isArray(highlights) ? highlights : [],
    included,
    excluded,
    overview,
    code,
    minPax,
    days,
    raw: matched,
  };
}

export default useJordanPrograms;
