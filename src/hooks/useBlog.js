import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { blogs as fallbackBlogs } from '../data/blogs';
import { fetchWithSmartCache, getCachedEntry, abortQuery, CACHE_POLICIES } from '../utils/apiCache';

/**
 * Hook to fetch a single blog post by slug from GET /api/blogs/:slug with resilient fallback to full static catalog
 * Uses smart caching (SWR + in-flight deduplication + normalization).
 * @param {string} slug
 */
export function useBlog(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const queryKey = slug ? ['blog', slug, lang] : null;

  const initialFallback = slug ? fallbackBlogs.find((b) => b.slug === slug || b.id === slug) || null : null;
  const cached = queryKey ? getCachedEntry(queryKey) : null;

  const [blog, setBlog] = useState(cached ? cached.data : initialFallback);
  const [loading, setLoading] = useState(queryKey ? !cached : false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug || !queryKey) {
      return;
    }

    const fallbackItem = fallbackBlogs.find((b) => b.slug === slug || b.id === slug) || null;

    const fetchBlog = async () => {
      try {
        const currentCached = getCachedEntry(queryKey);
        if (!currentCached) {
          setLoading(true);
        }
        setError(null);

        const data = await fetchWithSmartCache(
          queryKey,
          async ({ signal } = {}) => {
            try {
              const res = await api.get(`/blogs/${encodeURIComponent(slug)}?locale=${encodeURIComponent(lang)}`, { signal });
              if (res && (res.title || res.slug || res.id)) {
                return fallbackItem ? { ...fallbackItem, ...res } : res;
              }
              if (fallbackItem) return fallbackItem;
              throw new Error('Invalid blog response');
            } catch {
              return fallbackItem;
            }
          },
          CACHE_POLICIES.CMS_CONTENT
        );

        if (isMounted) {
          setBlog(data || fallbackItem);
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
        if (isMounted) {
          setBlog(fallbackItem);
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBlog();

    return () => {
      isMounted = false;
      abortQuery(queryKey);
    };
  }, [slug, lang]);

  return {
    blog,
    loading,
    error,
    retry: () => {
      setLoading(true);
    },
  };
}
