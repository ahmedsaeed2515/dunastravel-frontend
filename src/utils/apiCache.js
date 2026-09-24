/**
 * apiCache.js — Centralized Smart Cache, Deduplication & SWR Engine
 *
 * Implements:
 *  1. Stable Query Key Normalization (deterministic key sorting, strips undefined/null)
 *  2. Stale-While-Revalidate (SWR): serves stale cache immediately while background refetching
 *  3. In-Flight Request Deduplication / Single-Flight: concurrent requests share 1 network call
 *  4. Configurable TTL & Stale Policy Matrix
 *  5. Target & Pattern Cache Invalidation (mutations invalidate exact or prefix queries)
 *  6. Strict User Data Isolation (private user caches tagged and cleared on auth changes)
 *  7. Request Cancellation via AbortController for rapidly changing search/filters
 *  8. Memory Bound / LRU Eviction to prevent unbounded cache growth
 *  9. Real-Time Observability & Metrics (hit, miss, stale, deduplicated, refetches)
 */

// ── Configuration Defaults ──────────────────────────────────────────────────
const MAX_CACHE_ENTRIES = 500;

export const CACHE_POLICIES = {
  // Static configuration & dictionaries: 30m stale, 2h maxAge
  STATIC_CONFIG: { staleTime: 30 * 60 * 1000, ttl: 2 * 60 * 60 * 1000 },
  
  // Destination and landing page catalogs: 15m stale, 1h maxAge
  DESTINATIONS: { staleTime: 15 * 60 * 1000, ttl: 60 * 60 * 1000 },
  
  // Tour catalog list & filter views: 2m stale, 15m maxAge
  TOUR_CATALOG: { staleTime: 2 * 60 * 1000, ttl: 15 * 60 * 1000 },
  
  // Tour detail pages: 5m stale, 30m maxAge
  TOUR_DETAILS: { staleTime: 5 * 60 * 1000, ttl: 30 * 60 * 1000 },
  
  // Blog posts & FAQ articles: 15m stale, 1h maxAge
  CMS_CONTENT: { staleTime: 15 * 60 * 1000, ttl: 60 * 60 * 1000 },
  
  // Reviews: 3m stale, 15m maxAge
  REVIEWS: { staleTime: 3 * 60 * 1000, ttl: 15 * 60 * 1000 },
  
  // Search results: 45s stale, 5m maxAge
  SEARCH: { staleTime: 45 * 1000, ttl: 5 * 60 * 1000 },
  
  // Currency rates: 15m stale, 1h maxAge
  CURRENCY: { staleTime: 15 * 60 * 1000, ttl: 60 * 60 * 1000 },
  
  // Authenticated user data (wishlist, me, notifications): 30s stale, 3m maxAge
  USER_PRIVATE: { staleTime: 30 * 1000, ttl: 3 * 60 * 1000, isPrivate: true },
  
  // Realtime or transactional queries: bypass cache
  NO_CACHE: { staleTime: 0, ttl: 0 },
};

// ── Cache State Storage ─────────────────────────────────────────────────────
const cacheStore = new Map(); // key -> CacheEntry
const inFlightPromises = new Map(); // key -> Promise<any>
const activeAbortControllers = new Map(); // key -> AbortController
const keySubscribers = new Map(); // key -> Set<callback>

// ── Metrics Tracking ────────────────────────────────────────────────────────
const metrics = {
  hits: 0,
  misses: 0,
  staleHits: 0,
  deduplicated: 0,
  backgroundRefetches: 0,
  invalidations: 0,
};

export function getCacheMetrics() {
  const totalQueries = metrics.hits + metrics.staleHits + metrics.misses;
  const effectiveHitRate = totalQueries > 0
    ? (((metrics.hits + metrics.staleHits) / totalQueries) * 100).toFixed(1) + '%'
    : '0.0%';

  return {
    ...metrics,
    totalQueries,
    effectiveHitRate,
    cacheEntriesCount: cacheStore.size,
    inFlightCount: inFlightPromises.size,
  };
}

export function resetCacheMetrics() {
  metrics.hits = 0;
  metrics.misses = 0;
  metrics.staleHits = 0;
  metrics.deduplicated = 0;
  metrics.backgroundRefetches = 0;
  metrics.invalidations = 0;
}

// ── Query Key Normalization ─────────────────────────────────────────────────
/**
 * Normalizes query keys into stable, sorted, deterministic strings.
 * Handles arrays, plain objects, and strings.
 * Filters out undefined, null, and empty strings so { a: 1, b: undefined } matches { a: 1 }.
 */
export function normalizeQueryKey(key) {
  if (typeof key === 'string') {
    return key.trim();
  }

  if (Array.isArray(key)) {
    return key
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'number' || typeof item === 'boolean') return String(item);
        if (item && typeof item === 'object') return serializeSortedObject(item);
        return '';
      })
      .filter(Boolean)
      .join('::');
  }

  if (key && typeof key === 'object') {
    return serializeSortedObject(key);
  }

  return String(key);
}

function serializeSortedObject(obj) {
  if (!obj || typeof obj !== 'object') return '';
  const sortedKeys = Object.keys(obj).sort();
  const pairs = [];

  for (const k of sortedKeys) {
    const v = obj[k];
    if (v === undefined || v === null || v === '') continue;
    if (typeof v === 'object' && !Array.isArray(v)) {
      pairs.push(`${k}=(${serializeSortedObject(v)})`);
    } else {
      pairs.push(`${k}=${String(v)}`);
    }
  }

  return pairs.join('&');
}

// ── LRU Eviction ────────────────────────────────────────────────────────────
function enforceMaxEntries() {
  if (cacheStore.size <= MAX_CACHE_ENTRIES) return;
  
  // Evict oldest 10% of entries based on timestamp
  const entries = Array.from(cacheStore.entries());
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
  
  const toEvict = Math.ceil(MAX_CACHE_ENTRIES * 0.1);
  for (let i = 0; i < toEvict && i < entries.length; i++) {
    cacheStore.delete(entries[i][0]);
  }
}

// ── Subscriptions for Reactive SWR Updates ──────────────────────────────────
export function subscribeToQueryKey(rawKey, callback) {
  const key = normalizeQueryKey(rawKey);
  if (!keySubscribers.has(key)) {
    keySubscribers.set(key, new Set());
  }
  keySubscribers.get(key).add(callback);

  return () => {
    const subs = keySubscribers.get(key);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        keySubscribers.delete(key);
      }
    }
  };
}

function notifyKeySubscribers(key, data, isError = false) {
  const subs = keySubscribers.get(key);
  if (subs && subs.size > 0) {
    subs.forEach((cb) => {
      try {
        cb(data, isError);
      } catch (err) {
        console.error(`[apiCache] Subscriber notification error for ${key}:`, err);
      }
    });
  }
}

// ── Cache Entry Accessors ───────────────────────────────────────────────────
export function getCachedEntry(rawKey) {
  const key = normalizeQueryKey(rawKey);
  const entry = cacheStore.get(key);
  if (!entry) return null;

  const now = Date.now();
  // If entry has completely expired past TTL, remove it
  if (now > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  const isStale = now > entry.staleAt;
  return {
    key,
    data: entry.data,
    isStale,
    isPrivate: entry.isPrivate,
    timestamp: entry.timestamp,
  };
}

export function setCachedEntry(rawKey, data, policy = CACHE_POLICIES.TOUR_CATALOG) {
  if (!data || policy.ttl <= 0) return;

  const key = normalizeQueryKey(rawKey);
  const now = Date.now();
  const staleTime = policy.staleTime ?? 60_000;
  const ttl = policy.ttl ?? 300_000;

  cacheStore.set(key, {
    data,
    timestamp: now,
    staleAt: now + staleTime,
    expiresAt: now + ttl,
    isPrivate: Boolean(policy.isPrivate),
  });

  enforceMaxEntries();
}

// ── Cache Invalidation ──────────────────────────────────────────────────────
/**
 * Invalidates queries matching exact key or prefix.
 *
 * @param {string|Array|Function} matcher
 *   - Array/String: matches all keys that start with the normalized prefix
 *   - Function: (key, entry) => boolean
 */
export function invalidateQueries(matcher) {
  metrics.invalidations++;

  if (typeof matcher === 'function') {
    for (const [key, entry] of cacheStore.entries()) {
      if (matcher(key, entry)) {
        cacheStore.delete(key);
        notifyKeySubscribers(key, null);
      }
    }
    return;
  }

  const prefix = normalizeQueryKey(matcher);
  for (const [key] of cacheStore.entries()) {
    if (key === prefix || key.startsWith(prefix) || key.includes(prefix)) {
      cacheStore.delete(key);
      notifyKeySubscribers(key, null);
    }
  }
}

/**
 * Clears all private user-specific cache entries (called on auth state changes, logout, etc.)
 * Strictly protects against cross-user cache contamination.
 */
export function clearPrivateUserCache() {
  for (const [key, entry] of cacheStore.entries()) {
    if (
      entry.isPrivate ||
      key.includes('/auth/') ||
      key.includes('/bookings/me') ||
      key.includes('/favorites') ||
      key.includes('/in-app-notifications')
    ) {
      cacheStore.delete(key);
      notifyKeySubscribers(key, null);
    }
  }
}

/**
 * Completely resets entire cache store (useful in tests or hard reset)
 */
export function clearAllCache() {
  cacheStore.clear();
  inFlightPromises.clear();
  activeAbortControllers.clear();
  keySubscribers.clear();
  resetCacheMetrics();
}

// ── Request Cancellation ────────────────────────────────────────────────────
export function abortQuery(rawKey) {
  const key = normalizeQueryKey(rawKey);
  const controller = activeAbortControllers.get(key);
  if (controller) {
    controller.abort('Query superseded or cancelled');
    activeAbortControllers.delete(key);
  }
}

// ── Prefetching ─────────────────────────────────────────────────────────────
/**
 * Prefetches data into the cache ahead of user navigation (e.g. on card hover).
 * Skips if data is already fresh or already in-flight.
 */
export function prefetchQuery(rawKey, fetcher, options = {}) {
  const key = normalizeQueryKey(rawKey);
  const cached = cacheStore.get(key);
  if (cached && Date.now() < cached.staleAt) {
    return Promise.resolve(cached.data);
  }
  if (inFlightPromises.has(key)) {
    return inFlightPromises.get(key);
  }
  return fetchWithSmartCache(key, fetcher, options).catch(() => {});
}

// ── Core Fetch With Smart Cache & Deduplication ─────────────────────────────
/**
 * High-performance data fetcher wrapping any Promise generator (e.g. api.get)
 *
 * Execution flow:
 *  1. Fresh cache exists -> return immediately (0 network calls)
 *  2. In-flight identical request -> return existing promise (single-flight deduplication)
 *  3. Stale cache exists -> return stale data immediately for instant UI + background refetch
 *  4. Cache miss -> issue network request, populate cache, return fresh data
 */
export async function fetchWithSmartCache(rawKey, fetcher, options = {}) {
  const key = normalizeQueryKey(rawKey);
  // Support both passing policy directly as 3rd arg or as options.policy
  const policy = (options && (options.ttl !== undefined || options.staleTime !== undefined || options.isPrivate !== undefined))
    ? options
    : (options.policy || CACHE_POLICIES.TOUR_CATALOG);
  const now = Date.now();

  // If NO_CACHE policy or explicit bypass:
  if (options.bypassCache || policy.ttl <= 0) {
    metrics.misses++;
    return fetcher();
  }

  const cached = cacheStore.get(key);

  // 1. FRESH CACHE HIT
  if (cached && now < cached.staleAt) {
    metrics.hits++;
    return cached.data;
  }

  // 2. REQUEST DEDUPLICATION: Join already running in-flight request
  if (inFlightPromises.has(key)) {
    metrics.deduplicated++;
    return inFlightPromises.get(key);
  }

  // 3. STALE-WHILE-REVALIDATE (SWR) HIT
  if (cached && now < cached.expiresAt) {
    metrics.staleHits++;
    metrics.backgroundRefetches++;

    // Fire background refetch without blocking caller
    const backgroundPromise = (async () => {
      try {
        const freshData = await fetcher();
        if (freshData !== undefined && freshData !== null) {
          setCachedEntry(key, freshData, policy);
          notifyKeySubscribers(key, freshData);
        }
      } catch (err) {
        // Stale data remains usable on background refresh network failure
        console.warn(`[apiCache] Background revalidation failed for ${key}, retaining stale cache:`, err.message);
      } finally {
        inFlightPromises.delete(key);
        activeAbortControllers.delete(key);
      }
    })();

    inFlightPromises.set(key, backgroundPromise);
    // Return stale data immediately so user experiences ZERO loading lag!
    return cached.data;
  }

  // 4. CACHE MISS: Execute network request with single-flight deduplication
  metrics.misses++;

  const controller = new AbortController();
  activeAbortControllers.set(key, controller);

  const requestPromise = (async () => {
    try {
      const data = await fetcher({ signal: controller.signal });
      if (data !== undefined && data !== null) {
        setCachedEntry(key, data, policy);
        notifyKeySubscribers(key, data);
      }
      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      // If network failed but we have any cached entry (even if expired past TTL),
      // provide graceful offline/fallback resilience where safe!
      if (cached?.data && !policy.isPrivate) {
        console.warn(`[apiCache] Request failed for ${key}, falling back to expired cache:`, err.message);
        return cached.data;
      }
      throw err;
    } finally {
      inFlightPromises.delete(key);
      activeAbortControllers.delete(key);
    }
  })();

  inFlightPromises.set(key, requestPromise);
  return requestPromise;
}
