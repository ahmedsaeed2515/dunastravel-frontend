import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { blogs as fallbackBlogs } from '../data/blogs';
import { fetchWithSmartCache, getCachedEntry, abortQuery, CACHE_POLICIES } from '../utils/apiCache';

/**
 * Hook to fetch blog posts from GET /api/blogs with resilient fallback to full static catalog
 * Uses smart caching (SWR + in-flight deduplication + normalization).
 * @param {Object} filters Query params (category, tag, limit, page)
 */
export function useBlogs(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);

  const queryKey = ['blogs', lang, filters];
  const cached = getCachedEntry(queryKey);

  const [blogs, setBlogs] = useState(cached ? cached.data : fallbackBlogs);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const currentCached = getCachedEntry(queryKey);
        if (!currentCached) {
          setLoading(true);
        }
        setError(null);

        const params = new URLSearchParams({ locale: lang });
        Object.entries(filters || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') params.append(k, v);
        });

        const data = await fetchWithSmartCache(
          queryKey,
          async (signal) => {
            try {
              const res = await api.get(`/blogs?${params.toString()}`, { signal });
              const items = Array.isArray(res)
                ? res
                : Array.isArray(res?.items)
                  ? res.items
                  : Array.isArray(res?.data)
                    ? res.data
                    : null;
              if (!items || items.length === 0) {
                return fallbackBlogs;
              }
              // Merge backend items with fallback static catalog (keyed by slug/id)
              const mergedMap = new Map();
              fallbackBlogs.forEach((b) => mergedMap.set(b.slug || b.id, b));
              items.forEach((b) => mergedMap.set(b.slug || b.id, { ...mergedMap.get(b.slug || b.id), ...b }));
              return Array.from(mergedMap.values());
            } catch {
              return fallbackBlogs;
            }
          },
          CACHE_POLICIES.CMS_CONTENT
        );

        if (isMounted) {
          setBlogs(data && data.length > 0 ? data : fallbackBlogs);
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
        if (isMounted) {
          setBlogs(fallbackBlogs);
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBlogs();

    return () => {
      isMounted = false;
      abortQuery(queryKey);
    };
  }, [lang, JSON.stringify(filters)]);

  return {
    blogs,
    loading,
    error,
    retry: () => {
      setLoading(true);
    },
  };
}
