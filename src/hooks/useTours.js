import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import {
  fetchWithSmartCache,
  getCachedEntry,
  subscribeToQueryKey,
  invalidateQueries,
  abortQuery,
  CACHE_POLICIES,
} from '../utils/apiCache';
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

  // Build clean normalized filters
  const cleanFilters = {};
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (ALLOWED_FILTERS.has(key) && value !== undefined && value !== null && value !== '') {
      cleanFilters[key] = String(value);
    }
  });

  const queryKey = ['tours', { lang, ...cleanFilters }];

  const [toursState, setToursState] = useState(() => {
    const cached = getCachedEntry(queryKey);
    return cached?.data || {
      tours: [],
      total: 0,
      page: Number(cleanFilters.page || 1),
      limit: Number(cleanFilters.limit || 12),
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  });
  const [loading, setLoading] = useState(() => !getCachedEntry(queryKey));
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => {
    invalidateQueries(queryKey);
    setRetryCount((c) => c + 1);
  };

  // Subscribe to background revalidation or cache invalidations
  useEffect(() => {
    const unsubscribe = subscribeToQueryKey(queryKey, (updatedData, isErr) => {
      if (!isErr && updatedData) {
        setToursState(updatedData);
        setLoading(false);
        setError(null);
      }
    });
    return unsubscribe;
  }, [JSON.stringify(queryKey)]);

  useEffect(() => {
    let isMounted = true;

    const cached = getCachedEntry(queryKey);
    if (cached) {
      setToursState(cached.data);
      if (!cached.isStale) {
        setLoading(false);
      }
    } else {
      setLoading(true);
    }

    const fetcher = async ({ signal } = {}) => {
      const params = new URLSearchParams({ lang });
      Object.entries(cleanFilters).forEach(([key, value]) => {
        params.set(key, value);
      });

      const response = await api.get(`/tours?${params.toString()}`, { signal });
      let { items, meta } = parseToursResponse(response, cleanFilters, lang);

      // If a category filter was specified (e.g. Classic, Religious, Honeymoon, Extension)
      // and returned few items, fetch broad catalog to ensure all relevant tours are included
      if (cleanFilters.category && items.length < 3) {
        try {
          const catLower = cleanFilters.category.toLowerCase();
          const broadParams = new URLSearchParams({ lang, limit: '70' });
          const broadRes = await api.get(`/tours?${broadParams.toString()}`, { signal });
          const { items: allItems } = parseToursResponse(broadRes, {}, lang);

          const matchedBroad = allItems.filter((t) => {
            const searchStr = `${t.category || ''} ${t.slug || ''} ${t.title || ''} ${t.country || ''} ${t.destination || ''}`.toLowerCase();
            if (catLower === 'classic') {
              return searchStr.includes('classic') || searchStr.includes('clásico') || searchStr.includes('classico') || (t.country || '').toLowerCase().includes('egypt');
            }
            if (catLower === 'religious') {
              return searchStr.includes('religious') || searchStr.includes('holy') || searchStr.includes('coptic') || searchStr.includes('دين');
            }
            if (catLower === 'honeymoon') {
              return searchStr.includes('honeymoon') || searchStr.includes('romance') || searchStr.includes('luna');
            }
            if (catLower === 'extension') {
              return searchStr.includes('extension') || searchStr.includes('escape') || searchStr.includes('hurghada') || searchStr.includes('sharm');
            }
            return searchStr.includes(catLower);
          });

          if (matchedBroad.length > items.length) {
            items = matchedBroad;
            meta = {
              total: items.length,
              page: Number(cleanFilters.page || 1),
              limit: Number(cleanFilters.limit || 12),
              totalPages: Math.ceil(items.length / Number(cleanFilters.limit || 12)),
              hasNextPage: false,
              hasPrevPage: false,
            };
          }
        } catch (err) {
          // Keep initial fetched items if broad fetch fails
        }
      }

      return { tours: items, ...meta };
    };

    fetchWithSmartCache(queryKey, fetcher, {
      policy: CACHE_POLICIES.TOUR_CATALOG,
    })
      .then((result) => {
        if (isMounted) {
          setToursState(result);
          setError(null);
          setLoading(false);
        }
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return;
        if (isMounted) {
          setError(requestError);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      abortQuery(queryKey);
    };
  }, [JSON.stringify(queryKey), lang, retryCount]);

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

