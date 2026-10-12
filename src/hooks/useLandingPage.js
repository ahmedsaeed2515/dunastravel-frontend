import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import {
  fetchWithSmartCache,
  getCachedEntry,
  subscribeToQueryKey,
  CACHE_POLICIES,
} from '../utils/apiCache';

function normalizeLandingPage(value) {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid landing page response');
  }

  const slug = value.slug || value.id;
  if (!slug) {
    throw new Error('Missing landing page slug');
  }

  const rawTours = Array.isArray(value.tours) ? value.tours : [];

  return {
    ...value,
    id: value.id || slug,
    slug,
    title: typeof value.title === 'string' && value.title.trim() ? value.title : slug,
    subtitle: typeof value.subtitle === 'string' ? value.subtitle : '',
    description: typeof value.description === 'string' ? value.description : '',
    brief: typeof value.brief === 'string' ? value.brief : '',
    type: value.type || 'DESTINATION',
    sections: Array.isArray(value.sections) ? value.sections : [],
    tours: rawTours.map((tour, idx) => {
      const tourId = tour?.id || tour?.slug || `tour-${idx}`;
      const tourSlug = tour?.slug || tourId;
      const title = typeof tour?.title === 'string' && tour.title.trim()
        ? tour.title
        : (tour?.title?.en || tour?.title?.ar || tourSlug || 'Tour');
      const basePriceUsd = tour?.basePriceUsd != null ? String(tour.basePriceUsd) : '0';
      const currency = typeof tour?.currency === 'string' && tour.currency.trim() ? tour.currency : 'USD';
      const heroImgObj = Array.isArray(tour?.images)
        ? tour.images.find(img => img && typeof img === 'object' && (img.isHero === true || img.is_hero === true))
        : null;
      const heroImage = (heroImgObj ? (heroImgObj.imageUrl || heroImgObj.url) : null)
        || (typeof tour?.heroImage === 'string' && tour.heroImage.trim() ? tour.heroImage.trim() : (tour?.heroImage?.imageUrl || tour?.heroImage?.url || null))
        || (typeof tour?.heroImageUrl === 'string' && tour.heroImageUrl.trim() ? tour.heroImageUrl.trim() : null)
        || (Array.isArray(tour?.images) && tour.images.length > 0
            ? (typeof tour.images[0] === 'string' ? tour.images[0] : (tour.images[0]?.imageUrl || tour.images[0]?.url))
            : null);
      const images = Array.isArray(tour?.images) && tour.images.length > 0
        ? tour.images.map(img => typeof img === 'string' ? img : img?.imageUrl || img?.url || '').filter(Boolean)
        : (heroImage ? [heroImage] : []);

      return {
        ...tour,
        id: tourId,
        slug: tourSlug,
        title,
        basePriceUsd,
        currency,
        images,
        heroImage,
        country: tour?.country || '',
        city: tour?.city || '',
        customBadge: tour?.customBadge || null,
      };
    }),
  };
}

const destinationSlugAliases = {
  egito: 'egypt',
  egipto: 'egypt',
  turquia: 'turkey',
  jordania: 'jordan',
  marruecos: 'morocco',
  marrocos: 'morocco',
  grecia: 'greece',
  tunez: 'tunisia',
  tunisie: 'tunisia',
  'holy-land': 'holyland',
  tierrasanta: 'holyland',
  terrasanta: 'holyland',
};

export function useLandingPage(slug, { destinationOnly = false } = {}) {
  const { i18n } = useTranslation();
  const locale = supportedLocale(i18n.language);

  const endpoint = destinationOnly ? '/destinations' : '/tour-landing-pages';
  const canonicalSlug = slug
    ? (destinationOnly ? (destinationSlugAliases[String(slug).toLowerCase()] || slug) : slug)
    : null;

  const queryKey = canonicalSlug ? ['landing-page', destinationOnly ? 'dest' : 'lp', canonicalSlug, locale] : null;

  const findSeededFromDestinationsList = () => {
    if (!canonicalSlug) return null;
    const listCached = getCachedEntry(['destinations', locale]);
    if (!Array.isArray(listCached?.data)) return null;
    const match = listCached.data.find((d) => {
      const s = String(d?.slug || d?.id || '').toLowerCase();
      return s === canonicalSlug || (destinationSlugAliases[s] && destinationSlugAliases[s] === canonicalSlug);
    });
    if (!match) return null;
    try {
      return normalizeLandingPage(match);
    } catch {
      return null;
    }
  };

  const [landingPage, setLandingPage] = useState(() => {
    if (!queryKey) return null;
    const cached = getCachedEntry(queryKey);
    if (cached?.data) return cached.data;
    return findSeededFromDestinationsList();
  });
  const [loading, setLoading] = useState(() => {
    if (!queryKey) return false;
    const cached = getCachedEntry(queryKey);
    if (cached?.data) return false;
    const seeded = findSeededFromDestinationsList();
    return !(seeded && Array.isArray(seeded.tours) && seeded.tours.length > 0);
  });
  const [error, setError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let active = true;
    if (!canonicalSlug || !queryKey) {
      setLandingPage(null);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = subscribeToQueryKey(queryKey, (data) => {
      if (!active) return;
      if (data) {
        setLandingPage(data);
        setError(null);
        setLoading(false);
      }
    });

    const cached = getCachedEntry(queryKey);
    if (cached?.data) {
      setLandingPage(cached.data);
      if (!cached.isStale) {
        setLoading(false);
      }
    } else {
      const seeded = findSeededFromDestinationsList();
      if (seeded) {
        setLandingPage(seeded);
        setLoading(!(Array.isArray(seeded.tours) && seeded.tours.length > 0));
      } else {
        setLandingPage(null);
        setLoading(true);
      }
    }

    fetchWithSmartCache(
      queryKey,
      async ({ signal } = {}) => {
        const raw = await api.get(
          `${endpoint}/${encodeURIComponent(canonicalSlug)}?locale=${encodeURIComponent(locale)}`,
          { signal }
        );
        return normalizeLandingPage(raw);
      },
      { policy: CACHE_POLICIES.DESTINATIONS }
    )
      .then((page) => {
        if (active && page) {
          setLandingPage(page);
          setError(null);
        }
      })
      .catch((reason) => {
        if (!active) return;
        if (reason?.name === 'AbortError' || reason?.code === 'ERR_CANCELED') return;
        setError(reason);
        setLandingPage(null);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [destinationOnly, locale, canonicalSlug, reloadNonce]);

  return { landingPage, loading, error, retry: () => setReloadNonce((value) => value + 1) };
}

export default useLandingPage;
