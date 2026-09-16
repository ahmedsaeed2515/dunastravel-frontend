import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

const DEST_FALLBACK_IMAGES = {
  egypt: '/imgs/destinations/egypt.webp',
  egipto: '/imgs/destinations/egypt.webp',
  turkey: '/imgs/destinations/turkey.webp',
  dubai: '/imgs/destinations/dubai.webp',
  jordan: '/imgs/destinations/jordan.webp',
  morocco: '/imgs/destinations/morocco.webp',
  tunisia: '/imgs/destinations/tunisia.webp',
  greece: 'https://static.arrajol.com/styles/800x533/public/2020/11/14/287336-80888809099.jpg',
  'holy-land': '/images/holy-land.webp',
  holyland: '/images/holy-land.webp',
};

const staticDestinations = [
  { id: 'egypt', slug: 'egypt', title: 'Egypt', name: 'Egypt', toursCount: 9, image: DEST_FALLBACK_IMAGES.egypt, heroImageUrl: DEST_FALLBACK_IMAGES.egypt, tours: [] },
  { id: 'turkey', slug: 'turkey', title: 'Turkey', name: 'Turkey', toursCount: 15, image: DEST_FALLBACK_IMAGES.turkey, heroImageUrl: DEST_FALLBACK_IMAGES.turkey, tours: [] },
  { id: 'dubai', slug: 'dubai', title: 'Dubai', name: 'Dubai', toursCount: 9, image: DEST_FALLBACK_IMAGES.dubai, heroImageUrl: DEST_FALLBACK_IMAGES.dubai, tours: [] },
  { id: 'jordan', slug: 'jordan', title: 'Jordan', name: 'Jordan', toursCount: 7, image: DEST_FALLBACK_IMAGES.jordan, heroImageUrl: DEST_FALLBACK_IMAGES.jordan, tours: [] },
  { id: 'morocco', slug: 'morocco', title: 'Morocco', name: 'Morocco', toursCount: 1, image: DEST_FALLBACK_IMAGES.morocco, heroImageUrl: DEST_FALLBACK_IMAGES.morocco, tours: [] },
  { id: 'tunisia', slug: 'tunisia', title: 'Tunisia', name: 'Tunisia', toursCount: 1, image: DEST_FALLBACK_IMAGES.tunisia, heroImageUrl: DEST_FALLBACK_IMAGES.tunisia, tours: [] },
  { id: 'greece', slug: 'greece', title: 'Greece', name: 'Greece', toursCount: 1, image: DEST_FALLBACK_IMAGES.greece, heroImageUrl: DEST_FALLBACK_IMAGES.greece, tours: [] },
  { id: 'holy-land', slug: 'holy-land', title: 'Holy Land', name: 'Holy Land', toursCount: 0, image: DEST_FALLBACK_IMAGES['holy-land'], heroImageUrl: DEST_FALLBACK_IMAGES['holy-land'], tours: [] },
];

function readDestinations(response) {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response?.data)
        ? response.data
        : [];
  return items.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const slug = String(item.slug || item.id || '').toLowerCase();
    if (!slug) return null;
    const toursCount = Number(item.toursCount || (Array.isArray(item.tours) ? item.tours.length : 0));
    const image = item.heroImageUrl || item.image || DEST_FALLBACK_IMAGES[slug] || DEST_FALLBACK_IMAGES.egypt;
    return {
      ...item,
      id: item.id || slug,
      slug,
      title: item.title || item.name || slug,
      name: item.title || item.name || slug,
      image,
      heroImageUrl: image,
      toursCount: Number.isFinite(toursCount) ? Math.max(0, Math.round(toursCount)) : 0,
      tours: Array.isArray(item.tours) ? item.tours : [],
    };
  }).filter(Boolean);
}

const destinationsCache = new Map();
const pendingDestinationsRequests = new Map();
const DESTINATIONS_CACHE_TTL_MS = 300_000; // 5 minutes

export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const cacheKey = lang;
  const [destinations, setDestinations] = useState(() => {
    const cached = destinationsCache.get(cacheKey);
    return cached?.data || [];
  });
  const [loading, setLoading] = useState(() => !destinationsCache.has(cacheKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDestinations = async () => {
      try {
        const cached = destinationsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < DESTINATIONS_CACHE_TTL_MS) {
          if (isMounted) {
            setDestinations(cached.data);
            setLoading(false);
          }
          return;
        }

        if (!cached) {
          setLoading(true);
        }
        setError(null);

        let request = pendingDestinationsRequests.get(cacheKey);
        if (!request) {
          request = api
            .get(`/destinations?locale=${encodeURIComponent(lang)}`)
            .then((res) => {
              const items = readDestinations(res);
              const result = items.length > 0 ? items : staticDestinations;
              destinationsCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
            })
            .catch(() => {
              destinationsCache.set(cacheKey, { data: staticDestinations, timestamp: Date.now() });
              return staticDestinations;
            })
            .finally(() => pendingDestinationsRequests.delete(cacheKey));
          pendingDestinationsRequests.set(cacheKey, request);
        }

        const items = await request;
        if (isMounted) {
          setDestinations(items);
        }
      } catch (requestError) {
        if (isMounted) {
          const cached = destinationsCache.get(cacheKey);
          setDestinations(cached?.data || staticDestinations);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchDestinations();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, lang]);

  return {
    destinations,
    loading,
    error,
    retry: () => {
      destinationsCache.delete(cacheKey);
      setLoading(true);
    },
  };
}

export default useDestinations;
