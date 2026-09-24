import { useState, useEffect } from 'react';
import api from '../utils/api';

const DEFAULT_LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇪🇬', dir: 'rtl' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
];

import { fetchWithSmartCache, getCachedEntry, abortQuery, CACHE_POLICIES } from '../utils/apiCache';

export function useActiveLocales() {
  const queryKey = ['settings', 'public', 'locales'];
  const cached = getCachedEntry(queryKey);

  const [activeCodes, setActiveCodes] = useState(() => {
    return cached?.data || ['en', 'ar', 'es', 'pt', 'it'];
  });
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveLocales = async () => {
      try {
        const currentCached = getCachedEntry(queryKey);
        if (!currentCached) setLoading(true);

        const list = await fetchWithSmartCache(
          queryKey,
          async (signal) => {
            const data = await api.get('/settings/public/locales', { signal });
            return Array.isArray(data?.locales) && data.locales.length > 0
              ? data.locales
              : ['en', 'ar', 'es', 'pt', 'it'];
          },
          CACHE_POLICIES.STATIC_CONFIG
        );

        if (isMounted) {
          setActiveCodes(list);
        }
      } catch {
        // Resilient fallback to default locales on network error or offline
        if (isMounted && !cached) {
          setActiveCodes(['en', 'ar', 'es', 'pt', 'it']);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchActiveLocales();

    return () => {
      isMounted = false;
      abortQuery(queryKey);
    };
  }, []);

  const activeLanguages = DEFAULT_LOCALES.filter((l) => activeCodes.includes(l.code));

  return {
    activeCodes,
    activeLanguages: activeLanguages.length > 0 ? activeLanguages : DEFAULT_LOCALES,
    loading,
  };
}

export default useActiveLocales;
