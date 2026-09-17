import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTours } from './useTours';

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

  const { tours: liveJordanTours } = useTours({ destination: 'Jordan', limit: 70 });

  return useMemo(() => {
    const sourceList = Array.isArray(liveJordanTours) ? liveJordanTours : [];
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
  }, [liveJordanTours, locale]);
}

export function getJordanProgramBySlug(slug, locale = 'en') {
  void slug;
  void locale;
  return null;
}

export default useJordanPrograms;
