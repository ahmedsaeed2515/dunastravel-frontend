import { useEffect, useState } from 'react';
import api from '../utils/api';
import { galleryImages as staticGalleryImages } from '../data/media';

const DEFAULT_GALLERY_IMAGES = staticGalleryImages.slice(0, 22).map((img, idx) => ({
  id: `gen-lib-${idx + 1}`,
  url: img.src,
  label: `المكتبة العامة - صورة ${idx + 1}`,
  altText: `المكتبة العامة - صورة ${idx + 1}`,
  mimeType: 'image/jpeg',
  category: 'general'
}));

function normalizeAssets(response, isSpecific = false) {
  if (!Array.isArray(response) || response.length === 0) {
    return {
      galleryImages: isSpecific ? [] : DEFAULT_GALLERY_IMAGES,
      videos: []
    };
  }
  const assets = response;
  const imgs = assets
    .filter((asset) => String(asset?.mimeType || '').startsWith('image/'))
    .map((asset) => ({ ...asset, url: asset.secureUrl || asset.url, label: asset.altText || asset.label || 'Dunas Travel' }));
  const vids = assets
    .filter((asset) => String(asset?.mimeType || '').startsWith('video/'))
    .map((asset) => ({ ...asset, url: asset.secureUrl || asset.url, label: asset.altText || asset.label || 'Dunas Travel' }));

  return {
    galleryImages: imgs.length > 0 ? imgs : (isSpecific ? [] : DEFAULT_GALLERY_IMAGES),
    videos: vids,
  };
}

import { fetchWithSmartCache, getCachedEntry, abortQuery, CACHE_POLICIES } from '../utils/apiCache';

export function useMedia(optionsOrTourId = null) {
  let tourId = null;
  let category = null;

  if (typeof optionsOrTourId === 'string') {
    tourId = optionsOrTourId;
  } else if (optionsOrTourId && typeof optionsOrTourId === 'object') {
    tourId = optionsOrTourId.tourId || null;
    category = optionsOrTourId.category || null;
  }

  const isSpecific = Boolean(tourId || category);
  const queryKey = ['media', category || (tourId ? `tour:${tourId}` : 'global')];
  const cached = getCachedEntry(queryKey);

  const [galleryImages, setGalleryImages] = useState(() => {
    return cached?.data?.galleryImages || (isSpecific ? [] : DEFAULT_GALLERY_IMAGES);
  });
  const [videos, setVideos] = useState(() => {
    return cached?.data?.videos || [];
  });
  const [loading, setLoading] = useState(() => !cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMedia = async () => {
      try {
        const currentCached = getCachedEntry(queryKey);
        if (!currentCached) {
          setLoading(true);
        }
        setError(null);

        let url = '/media';
        if (category) {
          url = `/media?category=${encodeURIComponent(category)}`;
        } else if (tourId) {
          url = `/media/tours/${encodeURIComponent(tourId)}`;
        }

        const result = await fetchWithSmartCache(
          queryKey,
          async (signal) => {
            try {
              const raw = await api.get(url, { signal });
              return normalizeAssets(raw, isSpecific);
            } catch {
              return {
                galleryImages: isSpecific ? [] : DEFAULT_GALLERY_IMAGES,
                videos: [],
              };
            }
          },
          CACHE_POLICIES.STATIC_CONFIG
        );

        if (isMounted) {
          setGalleryImages(result.galleryImages);
          setVideos(result.videos);
        }
      } catch (requestError) {
        if (requestError?.name === 'AbortError' || requestError?.code === 'ERR_CANCELED') return;
        if (isMounted) {
          setError(requestError?.status === 404 ? null : requestError);
          if (!isSpecific) {
            setGalleryImages(DEFAULT_GALLERY_IMAGES);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchMedia();

    return () => {
      isMounted = false;
      abortQuery(queryKey);
    };
  }, [category, tourId, isSpecific]);

  return {
    galleryImages,
    videos,
    loading,
    error,
    retry: () => {
      setLoading(true);
    },
  };
}

const showcaseCache = { data: null, timestamp: 0 };
const SHOWCASE_CACHE_TTL_MS = 60_000; // 60 seconds

export function invalidateShowcaseCache() {
  showcaseCache.data = null;
  showcaseCache.timestamp = 0;
}

function getCloudNameFromUrl(url) {
  if (!url) return 'u7xf91gp';
  const match = url.match(/cloudinary\.com\/([^/]+)\//);
  return match ? match[1] : 'u7xf91gp';
}

export function useMediaShowcase() {
  const [photos, setPhotos] = useState(() => showcaseCache.data?.photos || DEFAULT_GALLERY_IMAGES);
  const [videos, setVideos] = useState(() => showcaseCache.data?.videos || []);
  const [loading, setLoading] = useState(() => !showcaseCache.data);
  const [error, setError] = useState(null);

  const fetchShowcase = async (force = false) => {
    if (!force && showcaseCache.data && Date.now() - showcaseCache.timestamp < SHOWCASE_CACHE_TTL_MS) {
      setPhotos(showcaseCache.data.photos);
      setVideos(showcaseCache.data.videos);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/media/showcase');
      const fetchedPhotos = (res && Array.isArray(res.photos) && res.photos.length > 0)
        ? res.photos.map(p => ({
            ...p,
            url: p.optimizedUrl || p.secureUrl || p.url,
            label: p.title || p.altText || 'Dunas Travel',
            altText: p.altText || p.title || 'Dunas Travel',
          }))
        : DEFAULT_GALLERY_IMAGES;

      const fetchedVideos = (res && Array.isArray(res.videos) && res.videos.length > 0)
        ? res.videos.map(v => {
            const cloudName = getCloudNameFromUrl(v.secureUrl || v.url);
            return {
              ...v,
              url: v.secureUrl || v.url,
              label: v.title || v.altText || 'Dunas Travel',
              altText: v.altText || v.title || 'Dunas Travel',
              publicId: v.publicId,
              duration: v.duration,
              thumbnailUrl: v.thumbnailUrl || (v.publicId ? `https://res.cloudinary.com/${cloudName}/video/upload/w_600,h_400,c_fill,so_0,f_jpg/${v.publicId}.jpg` : undefined),
            };
          })
        : [];

      showcaseCache.data = { photos: fetchedPhotos, videos: fetchedVideos };
      showcaseCache.timestamp = Date.now();
      setPhotos(fetchedPhotos);
      setVideos(fetchedVideos);
    } catch (err) {
      console.warn('Failed to load media showcase from API, using defaults:', err);
      setError(err);
      if (!showcaseCache.data) {
        setPhotos(DEFAULT_GALLERY_IMAGES);
        setVideos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchShowcase();

    const handleFocus = () => {
      if (Date.now() - showcaseCache.timestamp > 30_000) {
        fetchShowcase(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return {
    photos,
    videos,
    loading,
    error,
    refetch: () => fetchShowcase(true),
  };
}

