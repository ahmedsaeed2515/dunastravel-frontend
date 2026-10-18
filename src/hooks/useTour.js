import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { resolveDestinationSlug } from '../utils/destinationHelper';
import {
  fetchWithSmartCache,
  getCachedEntry,
  setCachedEntry,
  subscribeToQueryKey,
  CACHE_POLICIES,
} from '../utils/apiCache';
import { isBareDayLabel } from '../utils/titleHelper';

/** Word used right before the day number, per language (fallback chain). */
const DAY_WORD_BY_LANG = {
  ar: 'اليوم',
  en: 'Day',
  es: 'Día',
  it: 'Giorno',
  pt: 'Dia',
  fr: 'Jour',
};

export function getFallbackTour() {
  return null;
}

function normalizeTour(data, lang = 'en', fallback = null) {
  const id = data?.id || data?.slug;
  const slug = data?.slug || data?.id;
  const resolveLocalizedObj = (obj) => {
    if (!obj || typeof obj !== 'object') return '';
    return (
      obj[lang] ||
      obj.en ||
      obj.ar ||
      obj.es ||
      obj.pt ||
      obj.it ||
      Object.values(obj).find((v) => typeof v === 'string' && v.trim()) ||
      ''
    );
  };
  const rawTitle = data?.title ?? data?.titleJsonb ?? data?.name ?? data?.nameJsonb;
  const title = rawTitle && typeof rawTitle === 'object'
    ? resolveLocalizedObj(rawTitle)
    : (rawTitle || slug);
  if (!id || !slug || !title) {
    throw new Error('Invalid tour details response');
  }
  const rawPrice = data.basePriceUsd ?? data.price ?? data.basePrice ?? 0;
  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }

  const backendImages = Array.isArray(data.images) && data.images.length > 0
    ? data.images.map((image) => (typeof image === 'string' ? image : image?.imageUrl || image?.url || '')).filter(Boolean)
    : [];
  if (backendImages.length === 0 && data.heroImage) {
    backendImages.push(data.heroImage);
  } else if (backendImages.length === 0 && data.heroImageUrl) {
    backendImages.push(data.heroImageUrl);
  }
  const images = backendImages.length > 0 ? backendImages : (fallback?.images || []);
  const heroImage = (typeof data.heroImage === 'string' && data.heroImage.trim() ? data.heroImage.trim() : null)
    || (typeof data.heroImageUrl === 'string' && data.heroImageUrl.trim() ? data.heroImageUrl.trim() : null)
    || images[0]
    || null;

  const rawItineraryList = (Array.isArray(data.itinerary) && data.itinerary.length > 0)
    ? data.itinerary
    : (Array.isArray(data.days) && data.days.length > 0)
      ? data.days
      : (Array.isArray(fallback?.itinerary) && fallback.itinerary.length > 0)
        ? fallback.itinerary
        : (Array.isArray(fallback?.days) && fallback.days.length > 0)
          ? fallback.days
          : [];

  const resolveField = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return resolveLocalizedObj(val);
    return String(val);
  };

  const itinerary = rawItineraryList.map((item, idx) => {
    const dayNum = item.sortOrder !== undefined ? item.sortOrder + 1 : (item.day || idx + 1);
    const resolvedTitle = resolveField(item.title) || resolveField(item.dayLabel);
    let title = resolvedTitle;
    // Legacy data stores the English "Day N" (or another locale's bare label) in
    // every locale's title. Rewrite any bare label with the active language's word.
    if (isBareDayLabel(title)) {
      title = '';
    }
    if (!title) {
      const dayWord = DAY_WORD_BY_LANG[lang] || DAY_WORD_BY_LANG.en;
      title = `${dayWord} ${dayNum}`;
    }
    return {
      ...item,
      day: dayNum,
      title,
      description: resolveField(item.description) || resolveField(item.desc) || '',
      meals: resolveField(item.meals) || null,
    };
  });

  const included = (Array.isArray(data.includedServices) && data.includedServices.length > 0)
    ? data.includedServices
    : (Array.isArray(data.included) && data.included.length > 0)
      ? data.included
      : (fallback?.included || []);

  const excluded = (Array.isArray(data.excludedServices) && data.excludedServices.length > 0)
    ? data.excludedServices
    : (Array.isArray(data.excluded) && data.excluded.length > 0)
      ? data.excluded
      : (fallback?.excluded || []);

  const highlights = (Array.isArray(data.highlights) && data.highlights.length > 0)
    ? data.highlights
    : (fallback?.highlights || []);

  return {
    ...data,
    images,
    heroImage,
    included,
    excluded,
    highlights,
    pricingTiers: Array.isArray(data.seasonPricing?.pricingTiers)
      ? data.seasonPricing.pricingTiers
      : data.seasonPricing?.pricingTiers?.categories
        || data.seasonPricing?.pricing?.categories
        || fallback?.pricingTiers
        || [],
    seasonRules: Array.isArray(data.seasonPricing?.rules)
      ? data.seasonPricing.rules
      : Array.isArray(data.seasonPricing)
        ? data.seasonPricing
        : fallback?.seasonRules || [],
    optionalExcursionsPricing: data.seasonPricing?.optionalExcursionsPricing || null,
    accommodation: data.hotelInfo?.accommodation || fallback?.accommodation || null,
    accommodations: Array.isArray(data.accommodations) && data.accommodations.length > 0
      ? data.accommodations
      : fallback?.accommodations || [],
    hotels: data.hotelInfo?.hotels || fallback?.hotels || null,
    hotelCategory: data.hotelInfo?.hotelCategory || fallback?.hotelCategory || null,
    excursions: data.terms?.excursions || fallback?.excursions || [],
    transportOptions: data.transportation?.transportOptions || null,
    route: data.transportation?.route || null,
    itinerary,
    price,
    routeMap: data.routeMap || data.routeMapJsonb || fallback?.routeMap || null,
    routeMapJsonb: data.routeMapJsonb || data.routeMap || null,
    destination: resolveDestinationSlug(
      data.destination || data.country || fallback?.destination || fallback?.country || data.city || fallback?.city || 'egypt'
    ),
    country: data.country || fallback?.country || 'Egypt',
  };
}

export function prefetchTour(slug, lang = 'en') {
  if (!slug) return Promise.resolve(null);
  const normalizedLang = supportedLocale(lang);
  const currentKey = ['tour', slug, normalizedLang];
  return fetchWithSmartCache(
    currentKey,
    async () => {
      const raw = await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(normalizedLang)}`);
      return normalizeTour(raw, normalizedLang);
    },
    { policy: CACHE_POLICIES.TOUR_DETAILS }
  );
}

export function useTour(slug, options = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const queryKey = slug ? ['tour', slug, lang] : null;

  // Live Sync: keep tour details in sync when explicitly requested (e.g. admin preview or configured interval).
  // Defaults to OFF for regular customer views to eliminate redundant serverless polling storms.
  const liveSync = options.liveSync === true || (options.liveSync !== false && options.liveSyncInterval !== undefined);
  const liveSyncInterval = options.liveSyncInterval ?? 10_000;

  const [tour, setTour] = useState(() => {
    if (!queryKey) return null;
    const cached = getCachedEntry(queryKey);
    if (!cached || !cached.data) return null;
    try {
      return normalizeTour(cached.data, lang);
    } catch {
      return cached.data;
    }
  });
  const [loading, setLoading] = useState(() => {
    if (!queryKey) return false;
    const cached = getCachedEntry(queryKey);
    return !cached;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!slug) {
      setTour(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    const currentKey = ['tour', slug, lang];
    const fetcher = ({ signal } = {}) =>
      api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`, { signal })
        .then((raw) => normalizeTour(raw, lang));

    // Had the data been served from a FRESH cache entry (i.e. we did NOT just hit
    // the network)? If yes, run a quick live check shortly after mount so recent
    // dashboard edits (route map / itinerary / etc.) appear immediately.
    let servedFromFreshCache = false;

    // Reactive subscription to cache changes for this query key
    const unsubscribe = subscribeToQueryKey(currentKey, (data) => {
      if (!isMounted) return;
      if (data) {
        try {
          setTour(normalizeTour(data, lang));
        } catch {
          setTour(data);
        }
        setError(null);
        setLoading(false);
      }
    });

    setError(null);
    const cached = getCachedEntry(currentKey);
    if (cached && cached.data) {
      try {
        setTour(normalizeTour(cached.data, lang));
      } catch {
        setTour(cached.data);
      }
      if (!cached.isStale) {
        servedFromFreshCache = true;
        setLoading(false);
      }
    } else {
      setTour(null);
      setLoading(true);
    }

    fetchWithSmartCache(
      currentKey,
      fetcher,
      { policy: CACHE_POLICIES.TOUR_DETAILS }
    )
      .then((data) => {
        if (isMounted && data) {
          const normalized = normalizeTour(data, lang);
          setTour(normalized);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (!isMounted) return;
        if (requestError?.name === 'AbortError' || requestError?.code === 'ERR_CANCELED') {
          const fallbackCached = getCachedEntry(currentKey);
          if (fallbackCached && fallbackCached.data) {
            try {
              setTour(normalizeTour(fallbackCached.data, lang));
            } catch {
              setTour(fallbackCached.data);
            }
          }
          return;
        }
        const errorMsg = requestError?.response?.data?.message || requestError?.message || 'Tour not found';
        setError(typeof errorMsg === 'string' ? errorMsg : String(errorMsg));
        setTour(null);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    // ── LIVE SYNC (dashboard ↔ frontend) ─────────────────────────────────────
    // Silently refetch tour details so edits made in the dashboard (Interactive
    // Itinerary Journey Map, itinerary, highlights, ...) are reflected on this
    // page without waiting for the 5min stale / 30min TTL cache window.
    let pollId = null;
    let initialCheckId = null;
    let refreshing = false;

    const refresh = async (force) => {
      if (!isMounted || refreshing) return;
      if (!force && typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      refreshing = true;
      try {
        const raw = await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`);
        const normalized = normalizeTour(raw, lang);
        if (!isMounted) return;
        // Skip re-render when nothing actually changed (keeps the page calm).
        setTour((prev) => {
          if (!prev) return normalized;
          try {
            return JSON.stringify(prev) === JSON.stringify(normalized) ? prev : normalized;
          } catch {
            return normalized;
          }
        });
        setError(null);
        setCachedEntry(currentKey, normalized, CACHE_POLICIES.TOUR_DETAILS);
      } catch {
        // Keep current data on network hiccups — never blank the page silently.
      } finally {
        refreshing = false;
      }
    };

    if (liveSync) {
      // Immediate verification when the page opened with fresh-cached data.
      if (servedFromFreshCache) {
        initialCheckId = setTimeout(() => refresh(true), 600);
      }

      // Continuous background sync while the page is open.
      pollId = setInterval(() => refresh(false), liveSyncInterval);

      // Instant refresh whenever the user returns to this tab (e.g. after saving
      // an edit in the dashboard tab) — visibility + window focus events.
      const onVisibility = () => {
        if (document.visibilityState === 'visible') refresh(true);
      };
      const onFocus = () => refresh(true);
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('focus', onFocus);

      return () => {
        isMounted = false;
        unsubscribe();
        if (initialCheckId) clearTimeout(initialCheckId);
        if (pollId) clearInterval(pollId);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('focus', onFocus);
      };
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [slug, lang, liveSync, liveSyncInterval]);

  return { tour, loading, error };
}

export default useTour;


