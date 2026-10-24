import { describe, it, expect } from 'vitest';
import { resolveTourType } from '../utils/titleHelper';

const destinationTranslations = {
  'home.destEgypt': { ar: 'مصر', en: 'Egypt', es: 'Egipto', pt: 'Egito', it: 'Egitto' },
  'home.destDubai': { ar: 'دبي', en: 'Dubai', es: 'Dubái', pt: 'Dubai', it: 'Dubai' },
  'home.destTurkey': { ar: 'تركيا', en: 'Turkey', es: 'Turquía', pt: 'Turquia', it: 'Turchia' },
  'home.destJordan': { ar: 'الأردن', en: 'Jordan', es: 'Jordania', pt: 'Jordânia', it: 'Giordania' },
  'home.destGreece': { ar: 'اليونان', en: 'Greece', es: 'Grecia', pt: 'Grécia', it: 'Grecia' },
  'home.destMorocco': { ar: 'المغرب', en: 'Morocco', es: 'Marruecos', pt: 'Marrocos', it: 'Marocco' },
  'home.destTunisia': { ar: 'تونس', en: 'Tunisia', es: 'Túnez', pt: 'Tunísia', it: 'Tunisia' },
};

const makeT = (lang) => (key, options) => {
  const translated = destinationTranslations[key]?.[lang];
  if (translated) return translated;
  return options?.defaultValue ?? key;
};

describe('resolveTourType destination localization', () => {
  it.each([
    ['Egypt', 'ar', 'مصر'],
    ['Egypt', 'es', 'Egipto'],
    ['Jordan', 'pt', 'Jordânia'],
    ['Dubai', 'it', 'Dubai'],
    ['Turkey', 'en', 'Turkey'],
    ['Greece', 'ar', 'اليونان'],
  ])('translates %s for %s', (value, lang, expected) => {
    expect(resolveTourType(value, makeT(lang), lang)).toBe(expected);
  });

  it('keeps existing category translations', () => {
    expect(resolveTourType('Classic', makeT('ar'), 'ar')).toBe('برنامج كلاسيكي');
    expect(resolveTourType('Honeymoon', makeT('es'), 'es')).toBe('Luna de Miel');
  });
});
