import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchWithSmartCache,
  getCachedEntry,
  setCachedEntry,
  invalidateQueries,
  clearPrivateUserCache,
  clearAllCache,
  normalizeQueryKey,
  getCacheMetrics,
  resetCacheMetrics,
  prefetchQuery,
  CACHE_POLICIES,
} from '../utils/apiCache';

describe('Smart Query Cache & Deduplication Engine (apiCache.js)', () => {
  beforeEach(() => {
    clearAllCache();
    vi.restoreAllMocks();
  });

  describe('Query Key Normalization', () => {
    it('normalizes object keys deterministically regardless of insertion order', () => {
      const key1 = normalizeQueryKey(['tours', { page: 1, destination: 'egypt', limit: 10 }]);
      const key2 = normalizeQueryKey(['tours', { limit: 10, destination: 'egypt', page: 1 }]);
      expect(key1).toBe(key2);
    });

    it('ignores undefined, null, and empty string filter properties', () => {
      const key1 = normalizeQueryKey(['tours', { destination: 'egypt', category: undefined, search: '' }]);
      const key2 = normalizeQueryKey(['tours', { destination: 'egypt' }]);
      expect(key1).toBe(key2);
    });

    it('handles nested objects and arrays deterministically', () => {
      const key1 = normalizeQueryKey(['tours', { filter: { country: 'eg', city: 'cairo' } }]);
      const key2 = normalizeQueryKey(['tours', { filter: { city: 'cairo', country: 'eg' } }]);
      expect(key1).toBe(key2);
    });
  });

  describe('Fresh Cache & Deduplication', () => {
    it('serves fresh cached data immediately without invoking fetcher', async () => {
      const fetcher = vi.fn().mockResolvedValue({ id: 'tour-1', name: 'Pyramids' });
      const key = ['tour', 'pyramids'];

      // First call: cache miss, invokes fetcher
      const result1 = await fetchWithSmartCache(key, fetcher, { policy: CACHE_POLICIES.TOUR_DETAILS });
      expect(result1).toEqual({ id: 'tour-1', name: 'Pyramids' });
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Second call: fresh cache hit, zero network calls
      const result2 = await fetchWithSmartCache(key, fetcher, { policy: CACHE_POLICIES.TOUR_DETAILS });
      expect(result2).toEqual({ id: 'tour-1', name: 'Pyramids' });
      expect(fetcher).toHaveBeenCalledTimes(1);

      const metrics = getCacheMetrics();
      expect(metrics.hits).toBe(1);
      expect(metrics.misses).toBe(1);
    });

    it('deduplicates 50 concurrent in-flight requests into exactly 1 network call (Cache Stampede Protection)', async () => {
      let resolvePromise;
      const slowFetch = vi.fn().mockImplementation(() => new Promise((resolve) => {
        resolvePromise = resolve;
      }));

      const key = ['destinations', 'all'];

      // Dispatch 50 concurrent requests simultaneously
      const promises = Array.from({ length: 50 }, () =>
        fetchWithSmartCache(key, slowFetch, { policy: CACHE_POLICIES.DESTINATIONS })
      );

      // Resolve the single origin request
      resolvePromise(['Egypt', 'Dubai', 'Jordan']);

      const results = await Promise.all(promises);

      // Every caller gets the authoritative payload
      results.forEach((res) => {
        expect(res).toEqual(['Egypt', 'Dubai', 'Jordan']);
      });

      // Exactly 1 network fetch executed
      expect(slowFetch).toHaveBeenCalledTimes(1);

      const metrics = getCacheMetrics();
      expect(metrics.misses).toBe(1);
      expect(metrics.deduplicated).toBe(49);
    });
  });

  describe('Stale-While-Revalidate (SWR)', () => {
    it('serves stale cached data immediately while executing background revalidation', async () => {
      const key = ['tours', 'featured'];
      const initialData = { tours: [{ id: 1, title: 'Old Tour' }] };
      const updatedData = { tours: [{ id: 1, title: 'Fresh Tour' }] };

      // Manually set an entry with expired staleTime but valid TTL
      setCachedEntry(key, initialData, { staleTime: -1000, ttl: 60_000 });

      const revalidationFetcher = vi.fn().mockResolvedValue(updatedData);

      // SWR call should return stale data immediately without blocking
      const returned = await fetchWithSmartCache(key, revalidationFetcher, {
        policy: { staleTime: 10_000, ttl: 60_000 },
      });

      expect(returned).toEqual(initialData);
      expect(revalidationFetcher).toHaveBeenCalledTimes(1);

      // Allow background microtask to settle
      await vi.waitFor(() => {
        const freshEntry = getCachedEntry(key);
        expect(freshEntry.data).toEqual(updatedData);
      });

      const metrics = getCacheMetrics();
      expect(metrics.staleHits).toBe(1);
      expect(metrics.backgroundRefetches).toBe(1);
    });

    it('returns stale data (never undefined) to a concurrent caller joining the background revalidation', async () => {
      const key = ['settings', 'public', 'locales'];
      const initialData = ['en', 'ar'];
      const updatedData = ['en', 'ar', 'es'];

      setCachedEntry(key, initialData, { staleTime: -1000, ttl: 60_000 });

      let resolveFetch;
      const fetcher = vi.fn(() => new Promise((resolve) => {
        resolveFetch = resolve;
      }));

      const policy = { staleTime: 10_000, ttl: 60_000 };

      // First subscriber gets stale data and kicks off the background refetch.
      const first = await fetchWithSmartCache(key, fetcher, { policy });
      expect(first).toEqual(initialData);

      // Second subscriber joins the in-flight revalidation and must still
      // receive the cached payload instead of the background promise result.
      const second = await fetchWithSmartCache(key, fetcher, { policy });
      expect(second).toEqual(initialData);
      expect(fetcher).toHaveBeenCalledTimes(1);

      resolveFetch(updatedData);
      await vi.waitFor(() => {
        expect(getCachedEntry(key).data).toEqual(updatedData);
      });
    });
  });

  describe('Targeted Cache Invalidation', () => {
    it('invalidates specific entity queries on mutation', async () => {
      const tourKey = ['tour', 'grand-pyramids', 'en'];
      const catalogKey = ['tours', { lang: 'en', destination: 'egypt' }];

      setCachedEntry(tourKey, { id: 'grand-pyramids', title: 'Old Title' });
      setCachedEntry(catalogKey, { tours: [{ id: 'grand-pyramids' }] });

      expect(getCachedEntry(tourKey)).not.toBeNull();
      expect(getCachedEntry(catalogKey)).not.toBeNull();

      // Invalidate only the specific tour
      invalidateQueries(['tour', 'grand-pyramids']);

      expect(getCachedEntry(tourKey)).toBeNull();
      // Catalog remains intact
      expect(getCachedEntry(catalogKey)).not.toBeNull();

      // Invalidate all tours catalog
      invalidateQueries(['tours']);
      expect(getCachedEntry(catalogKey)).toBeNull();
    });
  });

  describe('User Data Cache Isolation', () => {
    it('clears all private user caches on logout without polluting public catalog caches', () => {
      const publicTour = ['tour', 'classic-program'];
      const publicDestinations = ['destinations', 'en'];
      const privateWishlist = ['/auth/favorites', 'user-1'];
      const privateBookings = ['/bookings/me', 'user-1'];

      setCachedEntry(publicTour, { title: 'Classic' }, CACHE_POLICIES.TOUR_DETAILS);
      setCachedEntry(publicDestinations, ['Egypt'], CACHE_POLICIES.DESTINATIONS);
      setCachedEntry(privateWishlist, [{ tourId: 't-1' }], CACHE_POLICIES.USER_PRIVATE);
      setCachedEntry(privateBookings, [{ id: 'b-1' }], CACHE_POLICIES.USER_PRIVATE);

      // Verify all are in cache
      expect(getCachedEntry(publicTour)).not.toBeNull();
      expect(getCachedEntry(publicDestinations)).not.toBeNull();
      expect(getCachedEntry(privateWishlist)).not.toBeNull();
      expect(getCachedEntry(privateBookings)).not.toBeNull();

      // User logs out
      clearPrivateUserCache();

      // Private entries are completely wiped
      expect(getCachedEntry(privateWishlist)).toBeNull();
      expect(getCachedEntry(privateBookings)).toBeNull();

      // Public catalog remains cached for high performance
      expect(getCachedEntry(publicTour)).not.toBeNull();
      expect(getCachedEntry(publicDestinations)).not.toBeNull();
    });
  });

  describe('Prefetching Ahead of Navigation', () => {
    it('prefetches low-cost query in background without duplicate fetching', async () => {
      const fetcher = vi.fn().mockResolvedValue({ id: 'tour-99', title: 'Alexandria Day Tour' });
      const key = ['tour', 'alexandria-day-tour', 'en'];

      // Prefetch on card hover
      prefetchQuery(key, fetcher, { policy: CACHE_POLICIES.TOUR_DETAILS });

      // Wait for background prefetch to settle
      await vi.waitFor(() => {
        expect(fetcher).toHaveBeenCalledTimes(1);
      });

      // When user clicks the card and navigates:
      const clickedResult = await fetchWithSmartCache(key, fetcher, { policy: CACHE_POLICIES.TOUR_DETAILS });
      expect(clickedResult).toEqual({ id: 'tour-99', title: 'Alexandria Day Tour' });

      // No second network request is performed!
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('Shared Query Cancellation Protection', () => {
    it('does not abort a shared in-flight query when other subscribers are still active', async () => {
      const { subscribeToQueryKey, abortQuery } = await import('../utils/apiCache');
      const key = ['destinations', 'ar'];
      let capturedSignal;
      let resolveReq;

      const fetcher = vi.fn().mockImplementation(({ signal } = {}) => {
        capturedSignal = signal;
        return new Promise((resolve) => {
          resolveReq = resolve;
        });
      });

      const unsubNavbar = subscribeToQueryKey(key, () => {});
      const unsubHome = subscribeToQueryKey(key, () => {});

      const promise = fetchWithSmartCache(key, fetcher, { policy: CACHE_POLICIES.DESTINATIONS });

      // Home unmounts and unsubscribes, then calls abortQuery(key)
      unsubHome();
      abortQuery(key);

      // Because Navbar is still subscribed, signal MUST NOT be aborted!
      expect(capturedSignal?.aborted).toBe(false);

      resolveReq([{ slug: 'egypt', title: 'Egypt' }]);
      const data = await promise;
      expect(data).toEqual([{ slug: 'egypt', title: 'Egypt' }]);
      unsubNavbar();
    });
  });
});
