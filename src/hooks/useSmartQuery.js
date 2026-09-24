import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchWithSmartCache,
  getCachedEntry,
  subscribeToQueryKey,
  invalidateQueries,
  abortQuery,
  normalizeQueryKey,
  CACHE_POLICIES,
} from '../utils/apiCache';

/**
 * useSmartQuery — High-performance React hook for cached data fetching
 *
 * Capabilities:
 *  - Instant synchronous cache hydration (ZERO loading spinner if cached)
 *  - Background Stale-While-Revalidate (SWR) with reactive updates across all components
 *  - Multi-component request deduplication (N mounting components share 1 request)
 *  - Automatic abort on key change or component unmount
 *  - Error recovery and manual refetch
 *
 * @param {string|Array|object} queryKey - Canonical query identifier
 * @param {Function} queryFn - Async data fetcher function
 * @param {object} options
 * @param {object} options.policy - Cache policy (staleTime, ttl, isPrivate)
 * @param {boolean} options.enabled - Whether query should execute (defaults to true)
 * @param {Function} options.onSuccess - Optional callback on fresh data
 * @param {Function} options.onError - Optional callback on error
 */
export function useSmartQuery(queryKey, queryFn, options = {}) {
  const {
    policy = CACHE_POLICIES.TOUR_CATALOG,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const normalizedKey = queryKey && enabled ? normalizeQueryKey(queryKey) : null;

  // Initial state from synchronous cache lookup
  const [data, setData] = useState(() => {
    if (!normalizedKey) return null;
    const entry = getCachedEntry(normalizedKey);
    return entry ? entry.data : null;
  });

  const [loading, setLoading] = useState(() => {
    if (!normalizedKey) return false;
    const entry = getCachedEntry(normalizedKey);
    // If we have cached data (even stale), we don't block the UI with a full loading state!
    return !entry;
  });

  const [isRefetching, setIsRefetching] = useState(() => {
    if (!normalizedKey) return false;
    const entry = getCachedEntry(normalizedKey);
    return Boolean(entry && entry.isStale);
  });

  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const currentKeyRef = useRef(normalizedKey);
  currentKeyRef.current = normalizedKey;

  // Refetch function
  const refetch = useCallback(async () => {
    if (!normalizedKey || !queryFn) return;
    invalidateQueries(normalizedKey);
    if (isMountedRef.current) {
      setIsRefetching(true);
      setError(null);
    }
    try {
      const fresh = await fetchWithSmartCache(normalizedKey, queryFn, {
        policy,
        bypassCache: true,
      });
      if (isMountedRef.current && currentKeyRef.current === normalizedKey) {
        setData(fresh);
        setIsRefetching(false);
        setLoading(false);
        onSuccess?.(fresh);
      }
      return fresh;
    } catch (err) {
      if (isMountedRef.current && currentKeyRef.current === normalizedKey) {
        setError(err);
        setIsRefetching(false);
        setLoading(false);
        onError?.(err);
      }
      throw err;
    }
  }, [normalizedKey, queryFn, policy, onSuccess, onError]);

  // Subscribe to background cache updates from other callers or SWR refetches
  useEffect(() => {
    if (!normalizedKey) return;

    const unsubscribe = subscribeToQueryKey(normalizedKey, (updatedData, isErr) => {
      if (!isMountedRef.current || currentKeyRef.current !== normalizedKey) return;
      if (isErr) {
        // Keep existing data on background error
        setIsRefetching(false);
      } else if (updatedData !== null) {
        setData(updatedData);
        setLoading(false);
        setIsRefetching(false);
        setError(null);
      }
    });

    return unsubscribe;
  }, [normalizedKey]);

  // Main fetch effect
  useEffect(() => {
    isMountedRef.current = true;

    if (!normalizedKey || !enabled || typeof queryFn !== 'function') {
      return;
    }

    const cached = getCachedEntry(normalizedKey);
    if (cached) {
      setData(cached.data);
      setError(null);
      if (!cached.isStale) {
        setLoading(false);
        setIsRefetching(false);
        return;
      }
      // If stale, start background refetch
      setLoading(false);
      setIsRefetching(true);
    } else {
      setLoading(true);
      setIsRefetching(false);
      setError(null);
    }

    let isEffectActive = true;

    fetchWithSmartCache(normalizedKey, queryFn, { policy })
      .then((result) => {
        if (isEffectActive && isMountedRef.current && currentKeyRef.current === normalizedKey) {
          setData(result);
          setError(null);
          setLoading(false);
          setIsRefetching(false);
          onSuccess?.(result);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (isEffectActive && isMountedRef.current && currentKeyRef.current === normalizedKey) {
          setError(err);
          setLoading(false);
          setIsRefetching(false);
          onError?.(err);
        }
      });

    return () => {
      isEffectActive = false;
      // Abort in-flight network request if superseded
      abortQuery(normalizedKey);
    };
  }, [normalizedKey, enabled, policy]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    isRefetching,
    isStale: !loading && isRefetching,
    error,
    refetch,
  };
}

export default useSmartQuery;
