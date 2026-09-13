import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Keyboard, A11y } from 'swiper/modules';
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

import 'swiper/css';
import 'swiper/css/navigation';

export default function PhotoShowcaseCarousel({ photos = [], loading = false }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Autoplay State Machine: tab visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!swiperInstance?.autoplay) return;
      if (document.hidden) {
        swiperInstance.autoplay.stop();
        setIsPlaying(false);
      } else {
        if (!lightboxIndex && !prefersReducedMotion) {
          swiperInstance.autoplay.start();
          setIsPlaying(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [swiperInstance, lightboxIndex, prefersReducedMotion]);

  // Pause / Resume toggler
  const togglePlayPause = () => {
    if (!swiperInstance?.autoplay) return;
    if (isPlaying) {
      swiperInstance.autoplay.stop();
      setIsPlaying(false);
    } else {
      swiperInstance.autoplay.start();
      setIsPlaying(true);
    }
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoomScale(1);
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.stop();
      setIsPlaying(false);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomScale(1);
    if (swiperInstance?.autoplay && !prefersReducedMotion) {
      swiperInstance.autoplay.start();
      setIsPlaying(true);
    }
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % photos.length);
        setZoomScale(1);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
        setZoomScale(1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, photos.length]);

  if (loading && photos.length === 0) {
    return (
      <section className="py-20 bg-[#070D19] border-t border-white/5" aria-busy="true">
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

  const shouldLoop = photos.length > 3;

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#070D19] via-[#0B1528] to-[#070D19] border-t border-white/10 text-white select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('home.photoCarouselLabel', 'A Glimpse of Your Journey')}
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

      {/* Carousel Container */}
      <div className="container mx-auto px-4 md:px-8 relative">
        <Swiper
          key={`swiper-photo-${isRtl ? 'rtl' : 'ltr'}`}
          dir={isRtl ? 'rtl' : 'ltr'}
          modules={[Autoplay, Navigation, Keyboard, A11y]}
          loop={shouldLoop}
          speed={prefersReducedMotion ? 100 : 700}
          autoplay={
            prefersReducedMotion
              ? false
              : {
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          keyboard={{ enabled: true }}
          navigation={{
            prevEl: prevBtnRef.current,
            nextEl: nextBtnRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevBtnRef.current;
            swiper.params.navigation.nextEl = nextBtnRef.current;
          }}
          onSwiper={setSwiperInstance}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
          }}
          className="rounded-3xl !overflow-hidden py-4"
        >
          {photos.map((photo, index) => {
            const photoUrl = photo.optimizedUrl || photo.secureUrl || photo.url;
            const isRawFilename = (str) => {
              if (!str || typeof str !== 'string') return true;
              return /\.(jpe?g|png|webp|gif|svg|bmp)$/i.test(str) ||
                     /\d{4}[-_]\d{2}[-_]\d{2}/i.test(str) ||
                     /_at_\d+/i.test(str) ||
                     /^[a-f0-9]{16,}/i.test(str);
            };

            const rawTitle = photo.title || photo.altText || photo.alt || '';
            const photoTitle = isRawFilename(rawTitle) ? '' : rawTitle;

            return (
              <SwiperSlide key={photo.id || `photo-${index}`}>
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
                  aria-label={`${t('home.viewLarger', 'View larger photo')}${photoTitle ? `: ${photoTitle}` : ''}`}
                  className="group relative h-[380px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden border border-white/10 hover:border-[#0CB2DB]/80 bg-[#0E1726] shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0CB2DB]"
                >
                  <img
                    src={photoUrl}
                    alt={photoTitle || 'Dunas Travel'}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block text-[#0CB2DB] text-[11px] font-black uppercase tracking-widest mb-1.5">
                        {photo.category ? String(photo.category).toUpperCase() : 'DUNAS TRAVEL'}
                      </span>
                      {photoTitle ? (
                        <h3 className="text-white text-base md:text-lg font-bold line-clamp-2 leading-snug drop-shadow-md">
                          {photoTitle}
                        </h3>
                      ) : null}
                      <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center gap-1.5 text-white text-xs font-bold bg-[#0CB2DB] px-3.5 py-1.5 rounded-full shadow-lg">
                          <FaExpand className="w-3 h-3" />
                          <span>{t('home.viewPhoto', 'Explore Photo')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Carousel Navigation Arrows */}
        <button
          ref={prevBtnRef}
          type="button"
          aria-label={t('home.prevSlide', 'Previous Slide')}
          className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/70 hover:bg-[#0CB2DB] hover:text-slate-950 border border-white/20 hover:border-[#0CB2DB] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0CB2DB]"
        >
          {isRtl ? (
            <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>

        <button
          ref={nextBtnRef}
          type="button"
          aria-label={t('home.nextSlide', 'Next Slide')}
          className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/70 hover:bg-[#0CB2DB] hover:text-slate-950 border border-white/20 hover:border-[#0CB2DB] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0CB2DB]"
        >
          {isRtl ? (
            <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>

      {/* Autoplay Play/Pause & Counter Bar */}
      <div className="container mx-auto px-6 mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? t('home.pauseCarousel', 'Pause Autoplay') : t('home.playCarousel', 'Start Autoplay')}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0CB2DB]"
        >
          {isPlaying ? (
            <>
              <FaPause className="w-2.5 h-2.5 text-[#0CB2DB]" />
              <span>{t('home.pause', 'Pause')}</span>
            </>
          ) : (
            <>
              <FaPlay className="w-2.5 h-2.5 text-[#0CB2DB]" />
              <span>{t('home.play', 'Autoplay')}</span>
            </>
          )}
        </button>
      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={t('home.photoPreview', 'Photo Preview')}
          >
            {/* Modal Controls */}
            <div
              className="absolute top-6 right-6 z-20 flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomScale((s) => (s >= 2 ? 1 : s + 0.5))}
                aria-label={t('home.zoom', 'Zoom')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-110 cursor-pointer"
              >
                {zoomScale > 1 ? <FaSearchMinus className="w-4 h-4" /> : <FaSearchPlus className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label={t('home.close', 'Close')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center border border-white/20 transition-transform hover:scale-110 cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Previous Image in Lightbox */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
                setZoomScale(1);
              }}
              aria-label={t('home.prevPhoto', 'Previous Photo')}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#0CB2DB] hover:text-slate-950 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            >
              {isRtl ? <FaChevronRight className="w-5 h-5" /> : <FaChevronLeft className="w-5 h-5" />}
            </button>

            {/* Next Image in Lightbox */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % photos.length);
                setZoomScale(1);
              }}
              aria-label={t('home.nextPhoto', 'Next Photo')}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#0CB2DB] hover:text-slate-950 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            >
              {isRtl ? <FaChevronLeft className="w-5 h-5" /> : <FaChevronRight className="w-5 h-5" />}
            </button>

            {/* Main Lightbox Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex].optimizedUrl || photos[lightboxIndex].secureUrl || photos[lightboxIndex].url}
                alt={photos[lightboxIndex].alt || photos[lightboxIndex].title || 'Dunas Travel'}
                style={{ transform: `scale(${zoomScale})` }}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl transition-transform duration-300 shadow-2xl"
              />

              {/* Caption */}
              <div className="mt-4 text-center">
                <span className="inline-block text-[#0CB2DB] text-xs font-black uppercase tracking-widest mb-1">
                  {photos[lightboxIndex].category ? String(photos[lightboxIndex].category).toUpperCase() : 'DUNAS TRAVEL'}
                </span>
                <h4 className="text-white text-lg font-bold">
                  {photos[lightboxIndex].title || photos[lightboxIndex].alt || 'Dunas Travel'}
                </h4>
                <p className="text-white/60 text-xs mt-0.5">
                  {lightboxIndex + 1} / {photos.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
