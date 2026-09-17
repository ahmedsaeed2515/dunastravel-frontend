import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

const toursCache = new Map();
const pendingRequests = new Map();
const CACHE_TTL_MS = 60_000;
const ALLOWED_FILTERS = new Set([
  'destination',
  'category',
  'market',
  'page',
  'limit',
  'search',
  'isFeatured',
]);



const DEST_ALIASES = {
  'united arab emirates': 'dubai',
  'uae': 'dubai',
  'emirates': 'dubai',
  'holy land': 'holy-land',
  'holyland': 'holy-land',
  'egypt': 'egypt',
  'turkey': 'turkey',
  'jordan': 'jordan',
  'morocco': 'morocco',
  'tunisia': 'tunisia',
  'greece': 'greece',
};

function normalizeDest(val) {
  const clean = String(val || '').toLowerCase().trim();
  return DEST_ALIASES[clean] || clean;
}

function getFieldVal(tour, fields, lang = 'en') {
  if (!tour || typeof tour !== 'object') return '';
  const cleanLang = (lang || 'en').substring(0, 2).toLowerCase();
  for (const f of fields) {
    const val = tour[f];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return val[cleanLang] || val[lang] || val.en || val.ar || val.es || val.pt || val.it || Object.values(val)[0] || '';
    }
  }
  for (const f of fields) {
    const val = tour[f];
    if (val !== undefined && val !== null && val !== '') {
      return String(val);
    }
  }
  return '';
}

function mapTour(tour, lang = 'en') {
  if (!tour || typeof tour !== 'object') {
    return null;
  }
  const id = tour.id || tour.slug || tour._id || `tour-${Math.random().toString(36).substring(2, 9)}`;
  const slug = tour.slug || tour.id || tour._id || id;

  const title = getFieldVal(tour, ['titleJsonb', 'name', 'title'], lang) || tour.name || tour.title || slug || 'Tour';

  const rawPrice = tour.basePriceUsd ?? tour.price ?? tour.basePrice ?? tour.raw?.price ?? 0;
  const parsedPrice = Number(rawPrice);
  const price = (Number.isFinite(parsedPrice) && parsedPrice >= 0) ? parsedPrice : 0;

  const overview = getFieldVal(tour, ['overviewJsonb', 'overview', 'description', 'desc'], lang) || '';
  const duration = getFieldVal(tour, ['durationJsonb', 'duration'], lang) || '';

  const destination = String(tour.destination || tour.country || '').toLowerCase();

  const heroImageObj = Array.isArray(tour.images)
    ? tour.images.find(img => img && typeof img === 'object' && (img.isHero === true || img.is_hero === true))
    : null;
  const resolvedHeroImage = (heroImageObj ? (heroImageObj.imageUrl || heroImageObj.url) : null)
    || (typeof tour.heroImage === 'string' && tour.heroImage.trim() ? tour.heroImage.trim() : (tour.heroImage?.imageUrl || tour.heroImage?.url || null))
    || (typeof tour.heroImageUrl === 'string' && tour.heroImageUrl.trim() ? tour.heroImageUrl.trim() : null)
    || (Array.isArray(tour.images) && tour.images.length > 0
        ? (typeof tour.images[0] === 'string' ? tour.images[0] : (tour.images[0]?.imageUrl || tour.images[0]?.url))
        : null)
    || '';

  let images = [];
  if (Array.isArray(tour.images) && tour.images.length > 0) {
    images = tour.images.map(img => typeof img === 'string' ? img : (img?.imageUrl || img?.url || '')).filter(Boolean);
  }
  if (images.length === 0 && resolvedHeroImage) {
    images = [resolvedHeroImage];
  } else if (images.length === 0 && tour.heroImage) {
    images = [typeof tour.heroImage === 'string' ? tour.heroImage : (tour.heroImage?.imageUrl || tour.heroImage?.url || '')].filter(Boolean);
  } else if (images.length === 0 && tour.heroImageUrl) {
    images = [tour.heroImageUrl];
  }

  const primaryHeroImage =
    resolvedHeroImage ||
    (typeof tour.heroImage === 'string' && tour.heroImage.trim() ? tour.heroImage.trim() : null) ||
    (typeof tour.heroImageUrl === 'string' && tour.heroImageUrl.trim() ? tour.heroImageUrl.trim() : null) ||
    images[0] ||
    '';

  const resolveList = (val) => {
    if (!val) return [];
    const cleanLang = (lang || 'en').substring(0, 2).toLowerCase();
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      val = val[cleanLang] || val[lang] || val.en || val.ar || val.es || val.pt || val.it || Object.values(val)[0] || [];
    }
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[cleanLang] || item[lang] || item.en || item.ar || item.es || item.pt || item.it || Object.values(item)[0] || '';
        }
        return String(item || '');
      }).filter(Boolean);
    }
    return [];
  };

  return {
    ...tour,
    id,
    slug,
    title,
    overview,
    duration,
    destination,
    country: tour.country || tour.destination || 'Egypt',
    category: tour.category || tour.type || tour.destination || '',
    images,
    heroImage: primaryHeroImage || resolvedHeroImage || images[0] || '',
    raw: { price, type: tour.category || tour.type || '' },
    price,
    basePriceUsd: price,
    code: typeof tour.code === 'object' ? (tour.code[lang] || tour.code.en || tour.code.ar) : (tour.code || id),
    highlights: resolveList(tour.highlights),
    included: resolveList(tour.included || tour.includes || tour.includedServices),
    excluded: resolveList(tour.excluded || tour.excludes || tour.excludedServices),
  };
}

function parseToursResponse(response, filters, lang) {
  let rawItems = [];
  let meta = {
    total: 0,
    page: Number(filters.page || 1),
    limit: Number(filters.limit || 12),
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  if (Array.isArray(response)) {
    rawItems = response;
    meta.total = response.length;
  } else if (Array.isArray(response?.items)) {
    rawItems = response.items;
    meta.total = Number(response.total ?? response.items.length);
    meta.page = Number(response.page ?? meta.page);
    meta.limit = Number(response.limit ?? meta.limit);
    meta.totalPages = Number(response.totalPages ?? Math.ceil(meta.total / (meta.limit || 1)));
    meta.hasNextPage = Boolean(response.hasNextPage ?? (meta.page < meta.totalPages));
    meta.hasPrevPage = Boolean(response.hasPrevPage ?? (meta.page > 1));
  } else if (Array.isArray(response?.data)) {
    rawItems = response.data;
    const m = response.meta || {};
    meta.total = Number(m.total ?? response.data.length);
    meta.page = Number(m.page ?? meta.page);
    meta.limit = Number(m.limit ?? meta.limit);
    meta.totalPages = Number(m.totalPages ?? Math.ceil(meta.total / (meta.limit || 1)));
    meta.hasNextPage = Boolean(m.hasNextPage ?? (meta.page < meta.totalPages));
    meta.hasPrevPage = Boolean(m.hasPrevPage ?? (meta.page > 1));
  }

  const items = rawItems
    .map((t) => {
      try {
        return mapTour(t, lang);
      } catch (err) {
        console.warn('[useTours] Skipping invalid tour item:', t, err);
        return null;
      }
    })
    .filter(Boolean);

  return { items, meta };
}

export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;
  const [toursState, setToursState] = useState(() => {
    const cached = toursCache.get(cacheKey);
    return cached?.data || {
      tours: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  });
  const [loading, setLoading] = useState(() => !toursCache.has(cacheKey));
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => {
    toursCache.delete(cacheKey);
    setRetryCount((c) => c + 1);
  };

  useEffect(() => {
    let isMounted = true;
    const currentFilters = JSON.parse(filterKey);
    const fetchTours = async () => {
      try {
        await Promise.resolve();
        const fresh = toursCache.get(cacheKey);
        if (fresh && Date.now() - fresh.timestamp < CACHE_TTL_MS) {
          if (isMounted) {
            setToursState(fresh.data);
            setLoading(false);
          }
          return;
        }
        setLoading(true);
        setError(null);
        let request = pendingRequests.get(cacheKey);
        if (!request) {
          const params = new URLSearchParams({ lang });
          Object.entries(currentFilters).forEach(([key, value]) => {
            if (ALLOWED_FILTERS.has(key) && value !== undefined && value !== null && value !== '') {
              params.set(key, String(value));
            }
          });
          request = api
            .get(`/tours?${params.toString()}`)
            .then((response) => parseToursResponse(response, currentFilters, lang))
            .then(({ items, meta }) => {
              const result = { tours: items, ...meta };
              toursCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
            })
            .catch((err) => {
              const emptyResult = {
                tours: [],
                total: 0,
                page: Number(currentFilters.page || 1),
                limit: Number(currentFilters.limit || 12),
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
              };
              if (isMounted) setError(err);
              return emptyResult;
            })
            .finally(() => pendingRequests.delete(cacheKey));
          pendingRequests.set(cacheKey, request);
        }
        const resultData = await request;
        if (isMounted) setToursState(resultData);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setToursState({
            tours: [],
            total: 0,
            page: 1,
            limit: 12,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchTours();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, filterKey, lang, retryCount]);

  return {
    tours: toursState.tours,
    total: toursState.total,
    page: toursState.page,
    limit: toursState.limit,
    totalPages: toursState.totalPages,
    hasNextPage: toursState.hasNextPage,
    hasPrevPage: toursState.hasPrevPage,
    loading,
    error,
    retry,
  };
}

