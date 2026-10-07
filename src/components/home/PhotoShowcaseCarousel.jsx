import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';
import { galleryImages as defaultGalleryImages } from '../../data/media';
import useInViewport from '../../hooks/useInViewport';

const getOptimizedImageUrl = (url, width = 500, height = 650) => {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace('/image/upload/', `/image/upload/w_${width},h_${height},c_fill,q_auto:eco,f_auto/`);
  }
  return url;
};

const buildInfiniteMarqueeList = (items, prefix = 'gal', maxVisible = 6) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  let base = items.slice(0, Math.min(6, maxVisible));
  return [
    ...base.map((tItem, i) => ({ ...tItem, origIdx: i, isDuplicate: false, uKey: `${prefix}-set1-${tItem.id || i}-${i}` })),
    ...base.map((tItem, i) => ({ ...tItem, origIdx: i, isDuplicate: true, uKey: `${prefix}-set2-${tItem.id || i}-${i}` })),
  ];
};

function getDailySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function seededShuffle(array, seed) {
  const result = [...array];
  let m = result.length;
  let t, i;
  let s = seed;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  while (m) {
    i = Math.floor(rng() * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
}

export default function PhotoShowcaseCarousel({ photos = [], loading = false }) {
  const [sectionRef, isVisible] = useInViewport({ threshold: 0.05 });
  const { t, i18n } = useTranslation();

  const isRtl = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

  // Normalize photos coming from backend API with fallback
  const normalizedPhotos = useMemo(() => {
    const source = (Array.isArray(photos) && photos.length > 0) ? photos : defaultGalleryImages;
    return source.map((item, idx) => {
      const url = item.optimizedUrl || item.secureUrl || item.url || item.src;
      const isRawFilename = (str) => {
        if (!str || typeof str !== 'string') return true;
        return /\.(jpe?g|png|webp|gif|svg|bmp)$/i.test(str) ||
               /\d{4}[-_]\d{2}[-_]\d{2}/i.test(str) ||
               /_at_\d+/i.test(str) ||
               /^[a-f0-9]{16,}/i.test(str);
      };
      const rawTitle = item.label || item.title || item.alt || item.altText || '';
      const label = isRawFilename(rawTitle) ? 'Dunas Travel' : rawTitle;
      const category = item.category || 'Dunas Travel';

      return {
        id: item.id || `photo-${idx}`,
        url,
        label,
        category,
      };
    });
  }, [photos]);

  // Select 15 featured photos for the current 24-hour day using deterministic daily seed
  const featuredPhotos = useMemo(() => {
    if (normalizedPhotos.length <= 15) return normalizedPhotos;
    const seed = getDailySeed();
    return seededShuffle(normalizedPhotos, seed).slice(0, 15);
  }, [normalizedPhotos]);

  const openLightbox = (index) => {
    setActiveGalleryIndex(index);
    setZoomScale(1);
    setIsLightboxOpen(true);
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setZoomScale(1);
    setActiveGalleryIndex((prev) =>
      prev === featuredPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setZoomScale(1);
    setActiveGalleryIndex((prev) =>
      prev === 0 ? featuredPhotos.length - 1 : prev - 1
    );
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        isRtl ? prevImage() : nextImage();
      } else if (e.key === 'ArrowLeft') {
        isRtl ? nextImage() : prevImage();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen, isRtl, featuredPhotos.length]);

  if (loading && (!photos || photos.length === 0)) {
    return (
      <section className="py-16 md:py-24 border-t border-white/5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }} aria-busy="true">
        {/* Subtle shine overlay matching top header */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)' }} />
        {/* Top and Bottom Gold accent borders matching top header */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="h-8 w-48 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-80 bg-white/10 rounded-xl mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (normalizedPhotos.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden content-auto" style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}>
      <style>{`
        @keyframes photoShowcaseContinuous {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .photo-showcase-marquee-track {
          display: flex;
          width: max-content;
          animation: photoShowcaseContinuous 35s linear infinite;
          animation-play-state: paused;
        }
        .photo-showcase-marquee-track[data-active="true"] {
          animation-play-state: running;
          will-change: transform;
        }
        .photo-showcase-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .photo-showcase-marquee-track {
            animation: none !important;
            animation-play-state: paused !important;
            will-change: auto !important;
          }
        }
      `}</style>

      {/* Section Header */}
      <div className="container mx-auto px-6 mb-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#0CB2DB] border border-[#0CB2DB]/60 rounded-full bg-[#0CB2DB]/10 shadow-[0_0_15px_rgba(12,178,219,0.2)] mb-4">
            {t("home.galleryLabel", "CAPTURED MOMENTS")}
          </div>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.galleryHeading", "A Glimpse Into Your Journey")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#0CB2DB] to-transparent mx-auto mt-2" />
        </motion.div>
      </div>

      {/* Gallery Marquee Container with Seamless Top & Bottom Arch Overlays */}
      <div className="relative w-full overflow-hidden my-4">
        {/* Top Shape Overlay SVG */}
        <div className="absolute top-0 left-0 right-0 w-full z-20 pointer-events-none -mt-1 select-none">
          <svg className="w-full h-12 md:h-20 text-[#061D5D] fill-current" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,20 Q720,80 0,20 Z" />
          </svg>
        </div>

        {/* Marquee Track */}
        <div dir="ltr" className="w-full relative overflow-x-auto md:overflow-hidden py-8 z-10 scrollbar-none snap-x snap-mandatory md:snap-none">
          <div
            className="photo-showcase-marquee-track flex"
            data-active={isVisible ? "true" : "false"}
            style={{
              gap: "20px",
              paddingLeft: "20px",
            }}
          >
            {(() => {
              const infiniteImages = buildInfiniteMarqueeList(featuredPhotos, 'gal', featuredPhotos.length);
              return infiniteImages.map((img, idx) => {
                const originalIndex = typeof img.origIdx === 'number' ? img.origIdx : (idx % Math.max(1, featuredPhotos.length));
                return (
                  <div
                    key={img.uKey || `gal-${idx}`}
                    className={`flex-shrink-0 cursor-pointer overflow-hidden rounded-xl group relative transition-transform duration-300 hover:scale-[1.04] hover:z-30 border border-white/20 hover:border-[#0CB2DB] bg-slate-900/50 shadow-2xl ${img.isDuplicate ? 'hidden md:block' : 'block snap-start'}`}
                    onClick={() => openLightbox(originalIndex)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(originalIndex);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${t("home.viewLarger", "View larger image of")} ${img.label || 'dunas travel'}`}
                  >
                    <div className="w-[260px] sm:w-[300px] md:w-[340px] h-[350px] sm:h-[400px] md:h-[440px] overflow-hidden rounded-xl">
                      <img
                        src={getOptimizedImageUrl(img.url, 500, 650)}
                        alt={img.label || 'dunas travel'}
                        loading="lazy"
                        decoding="async"
                        width="340"
                        height="440"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    {/* Dunas Dark Gradient Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-xl">
                      <span className="text-[#0CB2DB] text-xs font-black tracking-widest uppercase mb-1">
                        {img.category || 'Dunas Travel'}
                      </span>
                      <span className="text-white text-sm font-bold truncate">
                        {img.label || 'dunas travel'}
                      </span>
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 text-white text-[11px] font-bold tracking-wider uppercase bg-[#0CB2DB]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                          {t("home.viewPhoto", "View Photo")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Bottom Shape Overlay SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none -mb-1 select-none">
          <svg className="w-full h-12 md:h-20 text-[#061D5D] fill-current" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,80 L1440,80 L1440,60 Q720,0 0,60 Z" />
          </svg>
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8 mb-4 relative z-10">
        <button
          onClick={() => navigate('/media-gallery?tab=photos')}
          className="group relative px-10 py-4 text-white text-sm md:text-base font-bold rounded-full uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#0CB2DB]/35 hover:scale-105 active:scale-95 cursor-pointer outline-none"
          style={{
            background: 'linear-gradient(135deg, #0CB2DB 0%, #1E3A8A 100%)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {t("home.viewAllImages", "View All Images")}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/95 flex items-center justify-center backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
            >
              <FaTimes size={32} />
            </button>

            <button
              className={`absolute ${isRtl ? 'right-4 md:right-10' : 'left-4 md:left-10'} text-ivory-50 hover:text-gold-500 transition-colors z-[101] p-4`}
              onClick={isRtl ? nextImage : prevImage}
            >
              <FaChevronLeft size={40} />
            </button>

            <motion.img
              key={activeGalleryIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: zoomScale }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={featuredPhotos[activeGalleryIndex]?.url}
              alt={featuredPhotos[activeGalleryIndex]?.label}
              className="max-w-[90vw] max-h-[90vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-md cursor-zoom-in"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.stopPropagation();
                const delta = e.deltaY > 0 ? -0.25 : 0.25;
                setZoomScale((s) => Math.max(1, Math.min(4, s + delta)));
              }}
            />

            {/* Zoom Controls */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[101] flex gap-3 bg-obsidian-900/70 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale((s) => Math.max(1, s - 0.5)); }}
                className="text-ivory-50 hover:text-gold-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
              >
                -
              </button>
              <span className="text-ivory-50 text-sm flex items-center">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale((s) => Math.min(4, s + 0.5)); }}
                className="text-ivory-50 hover:text-gold-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-lg font-bold"
              >
                +
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setZoomScale(1); }}
                className="text-gold-500 hover:text-gold-400 transition-colors text-xs font-semibold px-2"
              >
                RESET
              </button>
            </div>

            <button
              className={`absolute ${isRtl ? 'left-4 md:left-10' : 'right-4 md:right-10'} text-ivory-50 hover:text-gold-500 transition-colors z-[101] p-4`}
              onClick={isRtl ? prevImage : nextImage}
            >
              <FaChevronRight size={40} />
            </button>

            <div className="absolute bottom-10 left-0 right-0 text-center text-ivory-50">
              <p className="font-display text-2xl mb-1">
                {featuredPhotos[activeGalleryIndex]?.label}
              </p>
              <p className="text-gold-500 tracking-widest text-xs uppercase">
                {t('mediaGallery.subheading', 'Visual Journey')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
