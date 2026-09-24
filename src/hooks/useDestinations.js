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

const DEST_FALLBACK_IMAGES = {
  egypt: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
  egipto: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
  egito: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
  turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
  jordan: 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg',
  morocco: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1920&q=80',
  tunisia: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=85',
  greece: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80',
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
export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const queryKey = ['destinations', lang];

  const [destinations, setDestinations] = useState(() => {
    const cached = getCachedEntry(queryKey);
    return cached?.data || staticDestinations;
  });
  const [loading, setLoading] = useState(() => !getCachedEntry(queryKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToQueryKey(queryKey, (updated, isErr) => {
      if (!isErr && updated) {
        setDestinations(updated);
        setLoading(false);
        setError(null);
      }
    });
    return unsubscribe;
  }, [lang]);

  useEffect(() => {
    let isMounted = true;

    const cached = getCachedEntry(queryKey);
    if (cached) {
      setDestinations(cached.data);
      if (!cached.isStale) {
        setLoading(false);
      }
    } else {
      setLoading(true);
    }

    fetchWithSmartCache(
      queryKey,
      async ({ signal } = {}) => {
        try {
          const res = await api.get(`/destinations?locale=${encodeURIComponent(lang)}`, { signal });
          const items = readDestinations(res);
          return items.length > 0 ? items : staticDestinations;
        } catch {
          return staticDestinations;
        }
      },
      { policy: CACHE_POLICIES.DESTINATIONS }
    )
      .then((items) => {
        if (isMounted) {
          setDestinations(items);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setDestinations(staticDestinations);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      abortQuery(queryKey);
    };
  }, [lang]);

  return {
    destinations,
    loading,
    error,
    retry: () => {
      invalidateQueries(queryKey);
      setLoading(true);
    },
  };
}

export default useDestinations;
