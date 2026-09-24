import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { fetchWithSmartCache, getCachedEntry, abortQuery, CACHE_POLICIES } from '../utils/apiCache';

function supportedLocale(language) {
  const locale = (language || 'en').split('-')[0];
  return ['en', 'ar', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';
}

export function useHotel(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const queryKey = slug ? ['hotel', slug, lang] : null;

  const cached = queryKey ? getCachedEntry(queryKey) : null;
  const [hotel, setHotel] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(queryKey ? !cached : false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!slug || !queryKey) {
      setHotel(null);
      setLoading(false);
      return;
    }
    const fetchHotel = async () => {
      try {
        const currentCached = getCachedEntry(queryKey);
        if (!currentCached) setLoading(true);
        setError(null);

        const data = await fetchWithSmartCache(
          queryKey,
          async ({ signal } = {}) => {
            const item = await api.get(`/hotels/${encodeURIComponent(slug)}?locale=${lang}`, { signal });
            return item || null;
          },
          CACHE_POLICIES.TOUR_DETAILS
        );

        if (active) {
          setHotel(data || null);
        }
      } catch (requestError) {
        if (requestError?.name === 'AbortError' || requestError?.code === 'ERR_CANCELED') return;
        if (active) {
          setHotel(null);
          setError(requestError);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchHotel();
    return () => {
      active = false;
      abortQuery(queryKey);
    };
  }, [slug, lang]);

  return {
    hotel,
    loading,
    error,
  };
}

export function useHotels({ destinationSlug, limit = 24 } = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const queryKey = ['hotels', lang, { destinationSlug: destinationSlug || '', limit }];

  const cached = getCachedEntry(queryKey);
  const [hotels, setHotels] = useState(cached ? cached.data : []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchHotels = async () => {
      try {
        const currentCached = getCachedEntry(queryKey);
        if (!currentCached) setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          locale: lang,
          limit: String(limit),
        });
        if (destinationSlug) {
          queryParams.set('destinationSlug', destinationSlug);
        }

        const data = await fetchWithSmartCache(
          queryKey,
          async ({ signal } = {}) => {
            const res = await api.get(`/hotels?${queryParams.toString()}`, { signal });
            return Array.isArray(res) ? res : [];
          },
          CACHE_POLICIES.TOUR_CATALOG
        );

        if (active) {
          setHotels(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
        if (active) {
          setHotels([]);
          setError(err);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchHotels();
    return () => {
      active = false;
      abortQuery(queryKey);
    };
  }, [destinationSlug, limit, lang]);

  return {
    hotels,
    loading,
    error,
  };
}
