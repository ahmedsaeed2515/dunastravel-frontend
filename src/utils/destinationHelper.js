/**
 * Destination Normalization and Localization Utility
 * Handles mapping between tour country/city/destination and canonical destination routes & labels.
 */

export const DEST_ALIASES = {
  // UAE / Dubai
  'united arab emirates': 'dubai',
  'uae': 'dubai',
  'emirates': 'dubai',
  'الإمارات': 'dubai',
  'الامارات': 'dubai',
  'الإمارات بالكامل': 'dubai',
  'الامارات بالكامل': 'dubai',
  'دبي': 'dubai',
  'dubai': 'dubai',
  'dubái': 'dubai',
  'abu dhabi': 'dubai',
  'أبو ظبي': 'dubai',
  'ابو ظبي': 'dubai',
  'sharjah': 'dubai',

  // Egypt
  'egypt': 'egypt',
  'egipto': 'egypt',
  'egito': 'egypt',
  'egitto': 'egypt',
  'مصر': 'egypt',
  'cairo': 'egypt',
  'القاهرة': 'egypt',
  'luxor': 'egypt',
  'الأقصر': 'egypt',
  'aswan': 'egypt',
  'أسوان': 'egypt',
  'hurghada': 'egypt',
  'الغردقة': 'egypt',
  'sharm': 'egypt',
  'sharm el sheikh': 'egypt',
  'شرم الشيخ': 'egypt',
  'alexandria': 'egypt',
  'الإسكندرية': 'egypt',
  'siwa': 'egypt',
  'سيوة': 'egypt',

  // Turkey
  'turkey': 'turkey',
  'turquía': 'turkey',
  'turquia': 'turkey',
  'turchia': 'turkey',
  'تركيا': 'turkey',
  'istanbul': 'turkey',
  'إسطنبول': 'turkey',
  'اسطنبول': 'turkey',
  'cappadocia': 'turkey',
  'كابادوكيا': 'turkey',
  'antalya': 'turkey',
  'أنطاليا': 'turkey',

  // Jordan
  'jordan': 'jordan',
  'jordania': 'jordan',
  'jordânia': 'jordan',
  'giordania': 'jordan',
  'الأردن': 'jordan',
  'الاردن': 'jordan',
  'amman': 'jordan',
  'عمان': 'jordan',
  'petra': 'jordan',
  'البتراء': 'jordan',

  // Morocco
  'morocco': 'morocco',
  'marruecos': 'morocco',
  'marrocos': 'morocco',
  'marocco': 'morocco',
  'المغرب': 'morocco',
  'marrakech': 'morocco',
  'مراكش': 'morocco',
  'casablanca': 'morocco',

  // Tunisia
  'tunisia': 'tunisia',
  'túnez': 'tunisia',
  'tunez': 'tunisia',
  'تونس': 'tunisia',

  // Greece
  'greece': 'greece',
  'grecia': 'greece',
  'اليونان': 'greece',
  'athens': 'greece',
  'أثينا': 'greece',

  // Holy Land
  'holy land': 'holy-land',
  'holy-land': 'holy-land',
  'holyland': 'holy-land',
  'الأراضي المقدسة': 'holy-land',
  'الاراضي المقدسة': 'holy-land',
  'tierra santa': 'holy-land',
  'terra santa': 'holy-land',
  'jerusalem': 'holy-land',
  'القدس': 'holy-land',
  // Spain
  'spain': 'spain',
  'españa': 'spain',
  'espanha': 'spain',
  'spagna': 'spain',
  'إسبانيا': 'spain',
  'اسبانia': 'spain',
  'اسبانيا': 'spain',
  'madrid': 'spain',
  'مدريد': 'spain',

  // Brazil
  'brazil': 'brazil',
  'brasil': 'brazil',
  'brasile': 'brazil',
  'البرازيل': 'brazil',

  // Italy
  'italy': 'italy',
  'italia': 'italy',
  'itália': 'italy',
  'إيطاليا': 'italy',
  'ايطاليا': 'italy',
  'rome': 'italy',
  'روما': 'italy',

  // Multi-Country
  'multi-country': 'multi-country',
  'multi_country': 'multi-country',
  'multicountry': 'multi-country',
  'multi country': 'multi-country',
  'متعددة الدول': 'multi-country',
  'جولات متعددة الدول': 'multi-country',
  'جولات متعددة الدول (multi-country tours)': 'multi-country',
  'رحلة متعددة الدول': 'multi-country',
};

export const DEST_INFO = {
  egypt: {
    slug: 'egypt',
    i18nKey: 'home.destEgypt',
    fallback: {
      ar: 'مصر',
      en: 'Egypt',
      es: 'Egipto',
      pt: 'Egito',
      it: 'Egitto',
    },
  },
  dubai: {
    slug: 'dubai',
    i18nKey: 'home.destDubai',
    fallback: {
      ar: 'دبي',
      en: 'Dubai',
      es: 'Dubái',
      pt: 'Dubai',
      it: 'Dubai',
    },
  },
  turkey: {
    slug: 'turkey',
    i18nKey: 'home.destTurkey',
    fallback: {
      ar: 'تركيا',
      en: 'Turkey',
      es: 'Turquía',
      pt: 'Turquia',
      it: 'Turchia',
    },
  },
  jordan: {
    slug: 'jordan',
    i18nKey: 'home.destJordan',
    fallback: {
      ar: 'الأردن',
      en: 'Jordan',
      es: 'Jordania',
      pt: 'Jordânia',
      it: 'Giordania',
    },
  },
  morocco: {
    slug: 'morocco',
    i18nKey: 'home.destMorocco',
    fallback: {
      ar: 'المغرب',
      en: 'Morocco',
      es: 'Marruecos',
      pt: 'Marrocos',
      it: 'Marocco',
    },
  },
  tunisia: {
    slug: 'tunisia',
    i18nKey: 'home.destTunisia',
    fallback: {
      ar: 'تونس',
      en: 'Tunisia',
      es: 'Túnez',
      pt: 'Tunísia',
      it: 'Tunisia',
    },
  },
  greece: {
    slug: 'greece',
    i18nKey: 'home.destGreece',
    fallback: {
      ar: 'اليونان',
      en: 'Greece',
      es: 'Grecia',
      pt: 'Grécia',
      it: 'Grecia',
    },
  },
  'holy-land': {
    slug: 'holy-land',
    i18nKey: 'home.destHolyLand',
    fallback: {
      ar: 'الأراضي المقدسة',
      en: 'Holy Land',
      es: 'Tierra Santa',
      pt: 'Terra Santa',
      it: 'Terra Santa',
    },
  },
  spain: {
    slug: 'spain',
    i18nKey: 'home.destSpain',
    fallback: {
      ar: 'إسبانيا',
      en: 'Spain',
      es: 'España',
      pt: 'Espanha',
      it: 'Spagna',
    },
  },
  brazil: {
    slug: 'brazil',
    i18nKey: 'home.destBrazil',
    fallback: {
      ar: 'البرازيل',
      en: 'Brazil',
      es: 'Brasil',
      pt: 'Brasil',
      it: 'Brasile',
    },
  },
  italy: {
    slug: 'italy',
    i18nKey: 'home.destItaly',
    fallback: {
      ar: 'إيطاليا',
      en: 'Italy',
      es: 'Italia',
      pt: 'Itália',
      it: 'Italia',
    },
  },
  'multi-country': {
    slug: 'multi-country',
    i18nKey: 'home.destMultiCountry',
    fallback: {
      ar: 'رحلة متعددة الدول',
      en: 'Multi-Country Journey',
      es: 'Viaje Multipaís',
      pt: 'Viagem Multipaíses',
      it: 'Viaggio Multi-paese',
    },
  },
};

/**
 * Normalizes any text or identifier to a valid destination slug
 */
export function resolveDestinationSlug(val) {
  if (!val) return 'egypt';
  const clean = String(val).toLowerCase().trim();
  if (DEST_ALIASES[clean]) return DEST_ALIASES[clean];

  for (const [alias, canonical] of Object.entries(DEST_ALIASES)) {
    if (clean.includes(alias) || alias.includes(clean)) {
      return canonical;
    }
  }

  return clean;
}

/**
 * Resolves the destination slug from a tour object
 */
export function getTourDestinationSlug(tour) {
  if (!tour) return 'egypt';
  const candidates = [
    tour.destination,
    tour.country,
    tour.city,
    tour.category,
    tour.type,
    tour.slug,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const str = String(candidate).toLowerCase().trim();
    if (DEST_ALIASES[str]) {
      return DEST_ALIASES[str];
    }
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    const str = String(candidate).toLowerCase().trim();
    for (const [alias, canonical] of Object.entries(DEST_ALIASES)) {
      if (str.includes(alias)) {
        return canonical;
      }
    }
  }

  return 'egypt';
}

/**
 * Gets the localized destination display name
 */
export function getDestinationName(destSlug, t = (k) => k, lang = 'en') {
  const normSlug = resolveDestinationSlug(destSlug);
  const info = DEST_INFO[normSlug];
  const currentLocale = String(lang || 'en').split('-')[0].toLowerCase();

  if (info) {
    if (typeof t === 'function' && info.i18nKey) {
      const translated = t(info.i18nKey);
      if (translated && translated !== info.i18nKey) {
        return translated;
      }
    }
    return info.fallback[currentLocale] || info.fallback.en || normSlug;
  }

  return String(destSlug || 'Egypt');
}

/**
 * Returns the destination landing page URL
 */
export function getDestinationUrl(destSlug) {
  const normSlug = resolveDestinationSlug(destSlug);
  return `/destinations/${normSlug}`;
}
