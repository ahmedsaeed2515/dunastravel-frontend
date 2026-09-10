import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTours } from './useTours';

import { resolveLocalizedText } from '../utils/titleHelper';

function getLocalizedField(fieldObj, locale) {
  if (!fieldObj) return '';
  const cleanLocale = (locale || 'en').substring(0, 2).toLowerCase();
  if (typeof fieldObj === 'object' && fieldObj !== null && !Array.isArray(fieldObj)) {
    return fieldObj[cleanLocale] || fieldObj[locale] || fieldObj.en || fieldObj.ar || fieldObj.es || fieldObj.pt || fieldObj.it || Object.values(fieldObj)[0] || '';
  }
  if (typeof fieldObj === 'string') {
    return resolveLocalizedText(fieldObj, (k) => k, locale);
  }
  return String(fieldObj || '');
}

function getObjectField(program, fields) {
  for (const f of fields) {
    const val = program[f];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return val;
    }
  }
  for (const f of fields) {
    const val = program[f];
    if (val !== undefined && val !== null && val !== '') {
      return val;
    }
  }
  return '';
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function useDubaiPrograms() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(lang) ? lang : 'en';
  const { tours } = useTours({ destination: 'United Arab Emirates', limit: 50 });

  return useMemo(() => {
    return tours.map((program) => {
      const titleObj = getObjectField(program, ['titleJsonb', 'name', 'title']);
      const title = getLocalizedField(titleObj, locale);
      const enTitle = getLocalizedField(titleObj, 'en');
      const slug = program.slug || slugify(`${program.id}-${enTitle}`);
      const duration = getLocalizedField(getObjectField(program, ['durationJsonb', 'duration']), locale);
      const highlights = getLocalizedField(getObjectField(program, ['highlightsJsonb', 'highlights']), locale);
      const overview = getLocalizedField(getObjectField(program, ['overviewJsonb', 'overview', 'description', 'desc']), locale);
      const code = getLocalizedField(getObjectField(program, ['codeJsonb', 'code']), locale) || program.id;
      const minPax = getLocalizedField(getObjectField(program, ['minPaxJsonb', 'minPax']), locale);
      const includes = getLocalizedField(getObjectField(program, ['includes', 'included']), locale);
      const excludes = getLocalizedField(getObjectField(program, ['excludes', 'excluded']), locale);

      const days = Array.isArray(program.days)
        ? program.days.map((d) => ({
            day: d.day,
            description: getLocalizedField(d.description, locale),
            meals: d.meals ? getLocalizedField(d.meals, locale) : null,
          }))
        : [];

      const heroImage = program.heroImage || program.heroImageUrl || (Array.isArray(program.images) && program.images.length > 0 ? (typeof program.images[0] === 'string' ? program.images[0] : program.images[0]?.imageUrl) : null) || null;
      const images = Array.isArray(program.images) && program.images.length > 0
        ? program.images.map(img => typeof img === 'string' ? img : img?.imageUrl || img?.url || '').filter(Boolean)
        : (heroImage ? [heroImage] : []);

      const pricing = program.pricing
        ? {
            ...program.pricing,
            hotels: Array.isArray(program.pricing.hotels)
              ? program.pricing.hotels.map((h) => (typeof h === 'object' ? getLocalizedField(h, locale) : h))
              : [],
          }
        : null;

      const extraNightPrices = program.extraNightPrices
        ? {
            ...program.extraNightPrices,
            hotels: Array.isArray(program.extraNightPrices.hotels)
              ? program.extraNightPrices.hotels.map((h) => (typeof h === 'object' ? getLocalizedField(h, locale) : h))
              : [],
          }
        : null;

      const exhibitionSurcharges = program.exhibitionSurcharges
        ? {
            dubai: Array.isArray(program.exhibitionSurcharges.dubai)
              ? program.exhibitionSurcharges.dubai.map((item) => ({
                  ...item,
                  event: getLocalizedField(item.event, locale),
                  dates: getLocalizedField(item.dates, locale),
                }))
              : null,
            abuDhabi: Array.isArray(program.exhibitionSurcharges.abuDhabi)
              ? program.exhibitionSurcharges.abuDhabi.map((item) => ({
                  ...item,
                  event: getLocalizedField(item.event, locale),
                  dates: getLocalizedField(item.dates, locale),
                }))
              : null,
          }
        : null;

      return {
        ...program,
        id: program.id,
        title,
        slug,
        heroImage,
        images,
        duration,
        highlights: Array.isArray(highlights) ? highlights : [],
        overview,
        code,
        minPax,
        includes,
        excludes,
        days,
        pricing,
        extraNightPrices,
        exhibitionSurcharges,
        raw: program,
      };
    });
  }, [locale, tours]);
}

export function getDubaiProgramBySlug(slug, locale = 'en') {
  // Detail resolution is asynchronous and must go through GET /api/tours/:slug.
  // This legacy synchronous helper is intentionally inert so it cannot read a local catalog.
  void slug;
  void locale;
  return null;
}

export default useDubaiPrograms;
