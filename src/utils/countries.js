import { countries as rawCountries } from 'countries-list';
import flagData from 'flag-icons/country.json';
import isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import arLocale from 'i18n-iso-countries/langs/ar.json';
import esLocale from 'i18n-iso-countries/langs/es.json';
import ptLocale from 'i18n-iso-countries/langs/pt.json';
import itLocale from 'i18n-iso-countries/langs/it.json';

const LOCALES = {
  en: enLocale,
  ar: arLocale,
  es: esLocale,
  pt: ptLocale,
  it: itLocale,
};

Object.entries(LOCALES).forEach(([, locale]) => {
  try {
    isoCountries.registerLocale(locale);
  } catch {
    // The locale may already be registered during hot module replacement.
  }
});

const FLAG_CODES = new Set(flagData.map((country) => country.code.toUpperCase()));

// Shared calling codes are used by several territories. Prefer the sovereign
// country that most travellers expect when a number is pasted without an ISO code.
const SHARED_DIAL_PRIORITY = {
  '+1': 'US',
  '+7': 'RU',
  '+39': 'IT',
  '+44': 'GB',
  '+47': 'NO',
  '+61': 'AU',
  '+212': 'MA',
  '+213': 'DZ',
  '+216': 'TN',
  '+218': 'LY',
  '+220': 'GM',
  '+221': 'SN',
  '+222': 'MR',
  '+223': 'ML',
  '+224': 'GN',
  '+225': 'CI',
  '+226': 'BF',
  '+227': 'NE',
  '+228': 'TG',
  '+229': 'BJ',
  '+230': 'MU',
  '+231': 'LR',
  '+232': 'SL',
  '+233': 'GH',
  '+234': 'NG',
  '+235': 'TD',
  '+236': 'CF',
  '+237': 'CM',
  '+238': 'CV',
  '+239': 'ST',
  '+240': 'GQ',
  '+241': 'GA',
  '+242': 'CG',
  '+243': 'CD',
  '+244': 'AO',
  '+245': 'GW',
  '+246': 'IO',
  '+248': 'SC',
  '+249': 'SD',
  '+250': 'RW',
  '+251': 'ET',
  '+252': 'SO',
  '+253': 'DJ',
  '+254': 'KE',
  '+255': 'TZ',
  '+256': 'UG',
  '+257': 'BI',
  '+258': 'MZ',
  '+260': 'ZM',
  '+261': 'MG',
  '+262': 'RE',
  '+263': 'ZW',
  '+264': 'NA',
  '+265': 'MW',
  '+266': 'LS',
  '+267': 'BW',
  '+268': 'SZ',
  '+269': 'KM',
  '+290': 'SH',
  '+291': 'ER',
  '+297': 'AW',
  '+298': 'FO',
  '+299': 'GL',
  '+350': 'GI',
  '+351': 'PT',
  '+352': 'LU',
  '+353': 'IE',
  '+354': 'IS',
  '+355': 'AL',
  '+356': 'MT',
  '+357': 'CY',
  '+358': 'FI',
  '+359': 'BG',
  '+370': 'LT',
  '+371': 'LV',
  '+372': 'EE',
  '+373': 'MD',
  '+374': 'AM',
  '+375': 'BY',
  '+376': 'AD',
  '+377': 'MC',
  '+378': 'SM',
  '+380': 'UA',
  '+381': 'RS',
  '+382': 'ME',
  '+383': 'XK',
  '+385': 'HR',
  '+386': 'SI',
  '+387': 'BA',
  '+389': 'MK',
  '+420': 'CZ',
  '+421': 'SK',
  '+423': 'LI',
  '+500': 'FK',
  '+501': 'BZ',
  '+502': 'GT',
  '+503': 'SV',
  '+504': 'HN',
  '+505': 'NI',
  '+506': 'CR',
  '+507': 'PA',
  '+508': 'PM',
  '+509': 'HT',
  '+590': 'GP',
  '+591': 'BO',
  '+592': 'GY',
  '+593': 'EC',
  '+594': 'GF',
  '+595': 'PY',
  '+596': 'MQ',
  '+597': 'SR',
  '+598': 'UY',
  '+599': 'CW',
  '+670': 'TL',
  '+672': 'NF',
  '+673': 'BN',
  '+674': 'NR',
  '+675': 'PG',
  '+676': 'TO',
  '+677': 'SB',
  '+678': 'VU',
  '+679': 'FJ',
  '+680': 'PW',
  '+681': 'WF',
  '+682': 'CK',
  '+683': 'NU',
  '+685': 'WS',
  '+686': 'KI',
  '+687': 'NC',
  '+688': 'TV',
  '+689': 'PF',
  '+690': 'TK',
  '+691': 'FM',
  '+692': 'MH',
  '+850': 'KP',
  '+852': 'HK',
  '+853': 'MO',
  '+855': 'KH',
  '+856': 'LA',
  '+880': 'BD',
  '+886': 'TW',
  '+960': 'MV',
  '+961': 'LB',
  '+962': 'JO',
  '+963': 'SY',
  '+964': 'IQ',
  '+965': 'KW',
  '+966': 'SA',
  '+967': 'YE',
  '+968': 'OM',
  '+970': 'PS',
  '+971': 'AE',
  '+972': 'IL',
  '+973': 'BH',
  '+974': 'QA',
  '+975': 'BT',
  '+976': 'MN',
  '+977': 'NP',
  '+992': 'TJ',
  '+993': 'TM',
  '+994': 'AZ',
  '+995': 'GE',
  '+996': 'KG',
  '+998': 'UZ',
};

// Common nationality adjectives/names used in old free-text values. These keep
// existing profiles and drafts readable after the switch to a country picker.
const NATIONALITY_ALIASES = {
  EG: ['egyptian', 'مصري', 'مصرية', 'مصرى'],
  SA: ['saudi', 'saudi arabian', 'سعودي', 'سعودية'],
  AE: ['emirati', 'emirian', 'إماراتي', 'إماراتية', 'اماراتي', 'اماراتية'],
  KW: ['kuwaiti', 'كويتي', 'كويتية'],
  QA: ['qatari', 'قطري', 'قطرية'],
  BH: ['bahraini', 'بحريني', 'بحرينية'],
  OM: ['omani', 'عماني', 'عمانية'],
  JO: ['jordanian', 'أردني', 'أردنية', 'اردني', 'اردنية'],
  LB: ['lebanese', 'لبناني', 'لبنانية'],
  SY: ['syrian', 'سوري', 'سورية', 'سوريا'],
  IQ: ['iraqi', 'عراقي', 'عراقية'],
  PS: ['palestinian', 'فلسطيني', 'فلسطينية'],
  YE: ['yemeni', 'يمني', 'يمنية'],
  SD: ['sudanese', 'سوداني', 'سودانية'],
  LY: ['libyan', 'ليبي', 'ليبية'],
  TN: ['tunisian', 'تونسي', 'تونسية'],
  DZ: ['algerian', 'جزائري', 'جزائرية'],
  MA: ['moroccan', 'مغربي', 'مغربية'],
  TR: ['turkish', 'turk', 'تركي', 'تركية'],
  US: ['american', 'أمريكي', 'أمريكية', 'امريكي', 'امريكية'],
  GB: ['british', 'briton', 'brit', 'إنجليزي', 'انجليزي', 'بريطاني', 'بريطانية'],
  CA: ['canadian', 'كندي', 'كندية'],
  AU: ['australian', 'أسترالي', 'أسترالية', 'استرالي', 'استرالية'],
  NZ: ['new zealander', 'kiwi', 'نيوزيلندي', 'نيوزيلندية'],
  FR: ['french', 'فرنسي', 'فرنسية'],
  DE: ['german', 'ألماني', 'ألمانية', 'الماني', 'المانية'],
  IT: ['italian', 'إيطالي', 'إيطالية', 'ايطالي', 'ايطالية'],
  ES: ['spanish', 'إسباني', 'إسبانية', 'اسباني', 'اسبانية'],
  PT: ['portuguese', 'برتغالي', 'برتغالية'],
  BR: ['brazilian', 'برازيلي', 'برازيلية'],
  AR: ['argentinian', 'argentine', 'أرجنتيني', 'أرجنتينية'],
  MX: ['mexican', 'مكسيكي', 'مكسيكية'],
  CO: ['colombian', 'كولومبي', 'كولومبية'],
  PE: ['peruvian', 'بيروفي', 'بيروفية'],
  CL: ['chilean', 'تشيلي', 'تشيلية'],
  EC: ['ecuadorian', 'إكوادوري', 'إكوادورية'],
  PA: ['panamanian', 'بنمي', 'بنمية'],
  CR: ['costa rican', 'كوستاريكي', 'كوستاريكية'],
  RU: ['russian', 'روسي', 'روسية'],
  CN: ['chinese', 'صيني', 'صينية'],
  JP: ['japanese', 'ياباني', 'يابانية'],
  IN: ['indian', 'هندي', 'هندية'],
  PK: ['pakistani', 'باكستاني', 'باكستانية'],
  PH: ['filipino', 'philippine', 'فلبيني', 'فلبينية'],
  ID: ['indonesian', 'إندونيسي', 'إندونيسية'],
  MY: ['malaysian', 'ماليزي', 'ماليزية'],
  ZA: ['south african', 'جنوب أفريقي', 'جنوب أفريقية'],
  NG: ['nigerian', 'نيجيري', 'نيجيرية'],
  KE: ['kenyan', 'كيني', 'كينية'],
  GH: ['ghanaian', 'غاني', 'غانية'],
  ET: ['ethiopian', 'إثيوبي', 'إثيوبية'],
  IR: ['iranian', 'إيراني', 'إيرانية', 'ايراني', 'ايرانية'],
  AF: ['afghan', 'أفغاني', 'أفغانية'],
  BD: ['bangladeshi', 'بنغلاديشي', 'بنغلاديشية'],
  LK: ['sri lankan', 'سريلانكي', 'سريلانكية'],
  NP: ['nepali', 'نيبالي', 'نيبالية'],
  TH: ['thai', 'تايلاندي', 'تايلاندية'],
  VN: ['vietnamese', 'فيتنامي', 'فيتنامية'],
  KR: ['south korean', 'korean', 'كوري', 'كورية'],
  UA: ['ukrainian', 'أوكراني', 'أوكرانية'],
  PL: ['polish', 'بولندي', 'بولندية'],
  RO: ['romanian', 'روماني', 'رومانية'],
  GR: ['greek', 'يوناني', 'يونانية'],
  SE: ['swedish', 'سويدي', 'سويدية'],
  NO: ['norwegian', 'نرويجي', 'نرويجية'],
  DK: ['danish', 'دنماركي', 'دنماركية'],
  FI: ['finnish', 'فنلندي', 'فنلندية'],
  NL: ['dutch', 'هولندي', 'هولندية'],
  BE: ['belgian', 'بلجيكي', 'بلجيكية'],
  CH: ['swiss', 'سويسري', 'سويسرية'],
  AT: ['austrian', 'نمساوي', 'نمساوية'],
  IE: ['irish', 'أيرلندي', 'أيرلندية'],
  CZ: ['czech', 'تشيكي', 'تشيكية'],
  HU: ['hungarian', 'هنغاري', 'هنغارية'],
  BG: ['bulgarian', 'بلغاري', 'بلغارية'],
  HR: ['croatian', 'كرواتي', 'كرواتية'],
  RS: ['serbian', 'صربي', 'صربية'],
  SK: ['slovak', 'سلوفاكي', 'سلوفاكية'],
  SI: ['slovenian', 'سلوفيني', 'سلوفينية'],
  LT: ['lithuanian', 'ليتواني', 'ليتوانية'],
  LV: ['latvian', 'لاتفي', 'لاتفية'],
  EE: ['estonian', 'إستوني', 'إستونية'],
};

const aliasIndex = new Map();
Object.entries(NATIONALITY_ALIASES).forEach(([code, aliases]) => {
  aliases.forEach((alias) => aliasIndex.set(alias.toLowerCase(), code));
});

const normalize = (value) => String(value || '').trim().toLowerCase();

const nameLookup = new Map();
Object.keys(LOCALES).forEach((language) => {
  const names = isoCountries.getNames(language);
  Object.entries(names).forEach(([code, name]) => {
    if (!name) return;
    nameLookup.set(normalize(name), code.toUpperCase());
  });
});

export const COUNTRIES = Object.entries(rawCountries)
  .filter(([code, details]) => {
    return (
      FLAG_CODES.has(code.toUpperCase()) &&
      Array.isArray(details.phone) &&
      details.phone.length > 0
    );
  })
  .map(([code, details]) => {
    const isoCode = code.toUpperCase();
    const dialCode = `+${details.phone[0]}`;
    const aliases = NATIONALITY_ALIASES[isoCode] || [];
    return {
      code: isoCode,
      nameEn: details.name,
      nativeName: details.native || details.name,
      dialCode,
      dialCodes: details.phone.map((phone) => `+${phone}`),
      aliases,
      searchText: [
        isoCode,
        details.name,
        details.native,
        ...(details.alias || []),
        ...aliases,
        dialCode,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
  })
  .sort((a, b) => a.nameEn.localeCompare(b.nameEn));

export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((country) => [country.code, country]));

const COUNTRY_BY_DIAL = (() => {
  const map = new Map();
  COUNTRIES.forEach((country) => {
    country.dialCodes.forEach((dialCode) => {
      if (!map.has(dialCode)) map.set(dialCode, []);
      map.get(dialCode).push(country);
    });
  });
  return map;
})();

const DIAL_CODES_LONGEST_FIRST = [...COUNTRY_BY_DIAL.keys()].sort(
  (a, b) => b.length - a.length
);

export const getDefaultCountry = (code = 'EG') =>
  COUNTRY_BY_CODE.get(String(code || '').toUpperCase()) || COUNTRY_BY_CODE.get('EG') || COUNTRIES[0];

export const getCountryName = (code, language = 'en') => {
  const isoCode = String(code || '').toUpperCase();
  if (!isoCode) return '';
  const languageKey = String(language || 'en').split('-')[0];
  return (
    isoCountries.getName(isoCode, languageKey) ||
    isoCountries.getName(isoCode, 'en') ||
    COUNTRY_BY_CODE.get(isoCode)?.nameEn ||
    isoCode
  );
};

export const getCountryDisplayName = (country, language = 'en') => {
  if (!country) return '';
  return getCountryName(country.code, language);
};

export const resolveCountry = (value) => {
  const normalized = normalize(value);
  if (!normalized) return null;

  const upper = normalized.toUpperCase();
  if (COUNTRY_BY_CODE.has(upper)) return COUNTRY_BY_CODE.get(upper);

  const aliasCode = aliasIndex.get(normalized);
  if (aliasCode && COUNTRY_BY_CODE.has(aliasCode)) {
    return COUNTRY_BY_CODE.get(aliasCode);
  }

  const nameCode = nameLookup.get(normalized);
  if (nameCode && COUNTRY_BY_CODE.has(nameCode)) {
    return COUNTRY_BY_CODE.get(nameCode);
  }

  const country = COUNTRIES.find((item) => {
    return (
      normalize(item.nameEn) === normalized ||
      normalize(item.nativeName) === normalized ||
      item.aliases.some((alias) => normalize(alias) === normalized)
    );
  });

  return country || null;
};

export const parsePhoneValue = (value, fallbackCountryCode = 'EG') => {
  const stringValue = String(value || '').trim();
  if (!stringValue) {
    return { country: getDefaultCountry(fallbackCountryCode), nationalNumber: '' };
  }

  if (!stringValue.startsWith('+')) {
    return { country: getDefaultCountry(fallbackCountryCode), nationalNumber: stringValue };
  }

  const digits = stringValue.replace(/[^\d+]/g, '');
  const matchedDialCode = DIAL_CODES_LONGEST_FIRST.find((dialCode) =>
    digits.startsWith(dialCode)
  );

  if (!matchedDialCode) {
    return { country: getDefaultCountry(fallbackCountryCode), nationalNumber: stringValue };
  }

  const matches = COUNTRY_BY_DIAL.get(matchedDialCode) || [];
  const preferredCode = SHARED_DIAL_PRIORITY[matchedDialCode];
  const country =
    (preferredCode && matches.find((item) => item.code === preferredCode)) || matches[0] || null;

  return {
    country: country || getDefaultCountry(fallbackCountryCode),
    nationalNumber: digits.slice(matchedDialCode.length).replace(/^[\s-]+/, ''),
  };
};

export const buildPhoneValue = (dialCode, nationalNumber) => {
  const digits = String(nationalNumber || '').replace(/[^\d\s\-()]/g, '').trim();
  if (!dialCode) return digits;
  return digits ? `${dialCode} ${digits}` : dialCode;
};

export const matchesCountryQuery = (country, query, language = 'en') => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  const localizedName = getCountryName(country.code, language);
  const haystack = `${country.searchText} ${normalize(localizedName)}`;
  return haystack.includes(normalizedQuery);
};

export default COUNTRIES;
