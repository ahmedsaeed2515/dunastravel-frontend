import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
  FaPause,
  FaPlay,
  FaSearchPlus,
  FaSearchMinus,
} from 'react-icons/fa';

export default function PhotoShowcaseCarousel({ photos = [], loading = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  const containerRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const timerRef = useRef(null);

  // Responsive items visible
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerView(1);
      else if (w < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalSlides = photos.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Safe navigation
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay State Machine
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused && totalSlides > itemsPerView && !prefersReducedMotion) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, 5000);
    }
  }, [isPaused, totalSlides, itemsPerView, prefersReducedMotion, goToNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Page visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isRtl) goToNext();
        else goToPrev();
        resetTimer();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isRtl) goToPrev();
        else goToNext();
        resetTimer();
      }
    },
    [isRtl, goToNext, goToPrev, resetTimer],
  );

  // Touch swipe handling
  const handleTouchStart = (e) => {
    setIsPaused(true);
    isDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 45; // px

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left
        if (isRtl) goToPrev();
        else goToNext();
      } else {
        // Swiped right
        if (isRtl) goToNext();
        else goToPrev();
      }
    }
    setIsPaused(false);
    resetTimer();
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoomScale(1);
    setIsPaused(true);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomScale(1);
    setIsPaused(false);
  };

  if (loading && photos.length === 0) {
    return (
      <section className="py-20 bg-[#070D19] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="h-8 w-48 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-80 bg-white/10 rounded-xl mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#070D19] via-[#0B1528] to-[#070D19] border-t border-white/10 text-white select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('home.photoCarouselLabel', 'A Glimpse of Your Journey')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        resetTimer();
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Section Header */}
      <div className="container mx-auto px-6 mb-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#0CB2DB] border border-[#0CB2DB]/40 rounded-full bg-[#0CB2DB]/10 shadow-[0_0_15px_rgba(12,178,219,0.2)] mb-4">
            <span>{t('home.galleryLabel', 'CAPTURED MOMENTS')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0CB2DB] animate-pulse" />
          </div>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('home.galleryHeading', 'A Glimpse of Your Journey')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#0CB2DB] to-transparent mx-auto mt-2 rounded-full" />
        </motion.div>
      </div>

      {/* Carousel Track Container */}
      <div className="container mx-auto px-4 md:px-6 relative">
        <div
          className="overflow-hidden rounded-3xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{
              x: isRtl
                ? `${currentIndex * (100 / itemsPerView)}%`
                : `-${currentIndex * (100 / itemsPerView)}%`,
            }}
            transition={{
              type: prefersReducedMotion ? 'tween' : 'spring',
              stiffness: 260,
              damping: 30,
              duration: prefersReducedMotion ? 0.1 : 0.5,
            }}
            style={{
              width: `${(totalSlides / itemsPerView) * 100}%`,
            }}
          >
            {photos.map((photo, index) => {
              const photoUrl = photo.optimizedUrl || photo.url;
              const photoTitle = photo.title || photo.alt || 'Dunas Travel';
              const isCurrent = index >= currentIndex && index < currentIndex + itemsPerView;

              return (
                <div
                  key={photo.id || `photo-${index}`}
                  style={{ width: `${100 / totalSlides}%` }}
                  className="shrink-0 px-1"
                >
                  <div
                    onClick={() => openLightbox(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${t('home.viewLarger', 'View larger photo of')} ${photoTitle}`}
                    className="group relative h-[380px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden border border-white/10 hover:border-[#0CB2DB]/80 bg-[#0E1726] shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0CB2DB]"
                  >
                    <img
                      src={photoUrl}
                      alt={photo.alt || photoTitle}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block text-[#0CB2DB] text-[11px] font-black uppercase tracking-widest mb-1.5">
                          {photo.category ? photo.category.toUpperCase() : 'DUNAS TRAVEL'}
                        </span>
                        <h3 className="text-white text-base md:text-lg font-bold line-clamp-2 leading-snug drop-shadow-md">
                          {photoTitle}
                        </h3>
                        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-flex items-center gap-1.5 text-white text-xs font-bold bg-[#0CB2DB] px-3.5 py-1.5 rounded-full shadow-lg">
                            <FaExpand className="w-3 h-3" />
                            <span>{t('home.viewPhoto', 'Explore Photo')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Navigation Arrows */}
        {totalSlides > itemsPerView && (
          <>
            <button
              type="button"
              onClick={() => {
                if (isRtl) goToNext();
                else goToPrev();
                resetTimer();
              }}
              aria-label={t('home.prevSlide', 'Previous Slide')}
              className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/60 hover:bg-[#0CB2DB] border border-white/20 hover:border-[#0CB2DB] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0CB2DB]"
            >
              {isRtl ? (
                <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (isRtl) goToPrev();
                else goToNext();
                resetTimer();
              }}
              aria-label={t('home.nextSlide', 'Next Slide')}
              className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/60 hover:bg-[#0CB2DB] border border-white/20 hover:border-[#0CB2DB] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0CB2DB]"
            >
              {isRtl ? (
                <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Carousel Footer: Dots Indicator & Autoplay State */}
      <div className="container mx-auto px-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? t('home.playCarousel', 'Resume Autoplay') : t('home.pauseCarousel', 'Pause Autoplay')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center transition-colors cursor-pointer"
          >
            {isPaused ? <FaPlay className="w-3 h-3 ml-0.5" /> : <FaPause className="w-3 h-3" />}
          </button>
          <span className="text-xs text-white/60 font-mono">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                resetTimer();
              }}
              aria-label={`${t('home.goToSlide', 'Go to slide')} ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 bg-[#0CB2DB]'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/media-gallery?tab=photos')}
            className="group relative px-6 py-2.5 text-white text-xs md:text-sm font-bold rounded-full uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#0CB2DB]/35 hover:scale-105 active:scale-95 cursor-pointer outline-none bg-gradient-to-r from-[#0CB2DB] to-[#1E3A8A] border border-white/20"
          >
            <span className="flex items-center gap-2">
              {t('home.viewAllImages', 'View Full Gallery')}
              <FaChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={photos[lightboxIndex].title || 'Photo Lightbox'}
            onClick={closeLightbox}
          >
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale((prev) => Math.min(prev + 0.25, 2.5));
                }}
                className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Zoom In"
              >
                <FaSearchPlus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale((prev) => Math.max(prev - 0.25, 0.75));
                }}
                className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <FaSearchMinus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div
              className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={photos[lightboxIndex].id}
                src={photos[lightboxIndex].optimizedUrl || photos[lightboxIndex].url}
                alt={photos[lightboxIndex].alt || photos[lightboxIndex].title || 'Dunas Photo'}
                style={{ scale: zoomScale }}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200"
              />
              <div className="mt-4 text-center">
                <span className="text-[#0CB2DB] text-xs font-black uppercase tracking-widest block mb-1">
                  {photos[lightboxIndex].category || 'DUNAS TRAVEL'}
                </span>
                <p className="text-white font-bold text-lg">
                  {photos[lightboxIndex].title || photos[lightboxIndex].alt}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
