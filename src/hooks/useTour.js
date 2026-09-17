import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { resolveDestinationSlug } from '../utils/destinationHelper';

export function getFallbackTour() {
  return null;
}

function normalizeTour(data, lang = 'en', fallback = null) {
  const id = data?.id || data?.slug;
  const slug = data?.slug || data?.id;
  const title = typeof data?.title === 'object' ? (data.title[lang] || data.title.en || data.title.ar) : (data?.title || slug);
  if (!id || !slug || !title) {
    throw new Error('Invalid tour details response');
  }
  const rawPrice = data.basePriceUsd ?? data.price ?? data.basePrice ?? 0;
  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }

  const backendImages = Array.isArray(data.images) && data.images.length > 0
    ? data.images.map((image) => (typeof image === 'string' ? image : image?.imageUrl || image?.url || '')).filter(Boolean)
    : [];
  if (backendImages.length === 0 && data.heroImage) {
    backendImages.push(data.heroImage);
  } else if (backendImages.length === 0 && data.heroImageUrl) {
    backendImages.push(data.heroImageUrl);
  }
  const images = backendImages.length > 0 ? backendImages : (fallback?.images || []);
  const heroImage = (typeof data.heroImage === 'string' && data.heroImage.trim() ? data.heroImage.trim() : null)
    || (typeof data.heroImageUrl === 'string' && data.heroImageUrl.trim() ? data.heroImageUrl.trim() : null)
    || images[0]
    || null;

  const rawItineraryList = (Array.isArray(data.itinerary) && data.itinerary.length > 0)
    ? data.itinerary
    : (Array.isArray(data.days) && data.days.length > 0)
      ? data.days
      : (Array.isArray(fallback?.itinerary) && fallback.itinerary.length > 0)
        ? fallback.itinerary
        : (Array.isArray(fallback?.days) && fallback.days.length > 0)
          ? fallback.days
          : [];

  const resolveField = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val[lang] || val.en || val.ar || Object.values(val)[0] || '';
    return String(val);
  };

  const itinerary = rawItineraryList.map((item, idx) => ({
    ...item,
    day: item.sortOrder !== undefined ? item.sortOrder + 1 : (item.day || idx + 1),
    title: resolveField(item.title) || resolveField(item.dayLabel) || `Day ${idx + 1}`,
    description: resolveField(item.description) || resolveField(item.desc) || '',
    meals: resolveField(item.meals) || null,
  }));

  const included = (Array.isArray(data.includedServices) && data.includedServices.length > 0)
    ? data.includedServices
    : (Array.isArray(data.included) && data.included.length > 0)
      ? data.included
      : (fallback?.included || []);

  const excluded = (Array.isArray(data.excludedServices) && data.excludedServices.length > 0)
    ? data.excludedServices
    : (Array.isArray(data.excluded) && data.excluded.length > 0)
      ? data.excluded
      : (fallback?.excluded || []);

  const highlights = (Array.isArray(data.highlights) && data.highlights.length > 0)
    ? data.highlights
    : (fallback?.highlights || []);

  return {
    ...data,
    images,
    heroImage,
    included,
    excluded,
    highlights,
    pricingTiers: Array.isArray(data.seasonPricing?.pricingTiers)
      ? data.seasonPricing.pricingTiers
      : data.seasonPricing?.pricingTiers?.categories
        || data.seasonPricing?.pricing?.categories
        || fallback?.pricingTiers
        || [],
    optionalExcursionsPricing: data.seasonPricing?.optionalExcursionsPricing || null,
    accommodation: data.hotelInfo?.accommodation || fallback?.accommodation || null,
    hotels: data.hotelInfo?.hotels || fallback?.hotels || null,
    hotelCategory: data.hotelInfo?.hotelCategory || fallback?.hotelCategory || null,
    excursions: data.terms?.excursions || fallback?.excursions || [],
    transportOptions: data.transportation?.transportOptions || null,
    route: data.transportation?.route || null,
    itinerary,
    price,
    destination: resolveDestinationSlug(
      data.destination || data.country || fallback?.destination || fallback?.country || data.city || fallback?.city || 'egypt'
    ),
    country: data.country || fallback?.country || 'Egypt',
  };
}

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!slug) {
      setTour(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const fetchTour = async () => {
      try {
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
          lang
        );
        if (isMounted) {
          setTour(result);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          const errorMsg = requestError?.response?.data?.message || requestError?.message || 'Tour not found';
          setError(typeof errorMsg === 'string' ? errorMsg : String(errorMsg));
          setTour(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}

export default useTour;


