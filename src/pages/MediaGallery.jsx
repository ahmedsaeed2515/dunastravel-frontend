import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaTimes, FaExpand } from "react-icons/fa";
import { useMediaShowcase, useMedia } from "../hooks/useMedia";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ErrorState from "../components/ui/ErrorState";

const MediaGallery = () => {
  const { t } = useTranslation();
  const { photos: showcasePhotos = [], loading: showcaseLoading, error: showcaseError } = useMediaShowcase();
  const { galleryImages = [], loading: fallbackLoading } = useMedia({ category: 'general' });

  // Use showcase photos from dashboard if available, otherwise fallback to general library
  const displayImages = (Array.isArray(showcasePhotos) && showcasePhotos.length > 0)
    ? showcasePhotos
    : galleryImages;

  const loading = showcaseLoading && displayImages.length === 0;
  const error = showcaseError && displayImages.length === 0 ? showcaseError : null;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex === null ? null : displayImages[selectedIndex];

  if (loading) return <SkeletonLoader count={8} />;
  if (error) return <ErrorState message={error.message || "Failed to load media"} />;

  return (
    <main className="min-h-screen bg-[#070D19] px-6 pb-24 pt-[140px] text-ivory-50">
      <Helmet>
        <title>{t("mediaGallery.seoTitle", "Media Gallery | Dunas Travel")}</title>
        <meta name="description" content={t("mediaGallery.seoDesc", "Explore Dunas Travel's published media gallery.")} />
      </Helmet>
      <section className="container mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-500">
            {t("mediaGallery.subheading", "Capturing beauty, magic, and timeless elegance across the world")}
          </p>
          <h1 className="font-display text-4xl text-white md:text-5xl">
            {t("mediaGallery.title", "Media Gallery & Luxury Moments")}
          </h1>
        </div>
        {displayImages.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-ivory-300">
            {t("mediaGallery.empty", "No published media is available yet.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayImages.map((asset, index) => (
              <button
                type="button"
                key={asset.id || index}
                onClick={() => setSelectedIndex(index)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0E1726] shadow-lg transition-all duration-500 hover:border-gold-500/60 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
                aria-label="View photo"
              >
                <img
                  src={asset.optimizedUrl || asset.secureUrl || asset.url || asset.src}
                  alt={asset.altText || asset.title || asset.label || ""}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Hover overlay with expand icon and label */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
                  <span className="self-end flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-gold-400 backdrop-blur-md border border-gold-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                    <FaExpand className="h-4 w-4" />
                  </span>
                  {(asset.title || asset.altText || asset.label) && (
                    <p className="text-xs font-semibold text-white truncate text-right">
                      {asset.title || asset.altText || asset.label}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
          <img
            src={selected.optimizedUrl || selected.secureUrl || selected.url || selected.src}
            alt={selected.altText || selected.title || selected.label || ""}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
};

export default MediaGallery;
