import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaTimes,
  FaClock,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

export default function VideoShowcaseCarousel({ videos = [], loading = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // When modal open
  const [itemsPerView, setItemsPerView] = useState(3);

  const containerRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const timerRef = useRef(null);

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

  const totalSlides = videos.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay State Machine: pauses automatically if activeVideo is playing!
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused && !activeVideo && totalSlides > itemsPerView && !prefersReducedMotion) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, 6000);
    }
  }, [isPaused, activeVideo, totalSlides, itemsPerView, prefersReducedMotion, goToNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

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
    const threshold = 45;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        if (isRtl) goToPrev();
        else goToNext();
      } else {
        if (isRtl) goToNext();
        else goToPrev();
      }
    }
    setIsPaused(false);
    resetTimer();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:45';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading && videos.length === 0) {
    return (
      <section className="py-20 bg-[#050A14] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="h-8 w-48 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-80 bg-white/10 rounded-xl mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#050A14] via-[#091224] to-[#050A14] border-t border-white/10 text-white select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('home.videoCarouselLabel', 'Travel Stories & Moments Video Showcase')}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-gold-500 border border-gold-500/40 rounded-full bg-gold-500/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] mb-4">
            <span>{t('home.videoSectionSub', 'MOMENTS TO REMEMBER')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
          </div>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('home.videoSectionTitle', 'Travel Stories & Moments')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2 rounded-full" />
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
            {videos.map((video, index) => {
              const poster = video.posterUrl || video.thumbnailUrl || video.url;
              const videoTitle = video.title || video.alt || 'Dunas Travel Video';

              return (
                <div
                  key={video.id || `video-${index}`}
                  style={{ width: `${100 / totalSlides}%` }}
                  className="shrink-0 px-1"
                >
                  <div
                    onClick={() => setActiveVideo(video)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveVideo(video);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${t('home.playVideo', 'Play video clip of')} ${videoTitle}`}
                    className="group relative h-[240px] sm:h-[280px] md:h-[320px] rounded-3xl overflow-hidden border border-white/10 hover:border-gold-500/80 bg-[#0E1726] shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <img
                      src={poster}
                      alt={videoTitle}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Dark Overlay with Central Play Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/30 transition-colors flex flex-col justify-between p-5">
                      {/* Top Badge: Duration */}
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                          <FaClock className="w-3 h-3 text-gold-500" />
                          <span>{formatDuration(video.duration)}</span>
                        </span>
                      </div>

                      {/* Center Play Button */}
                      <div className="self-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gold-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)] group-hover:scale-115 transition-transform duration-300">
                          <FaPlay className="w-5 h-5 ml-1" />
                        </div>
                      </div>

                      {/* Bottom Title */}
                      <div>
                        <h3 className="text-white text-sm md:text-base font-bold line-clamp-2 leading-snug drop-shadow-md group-hover:text-gold-400 transition-colors">
                          {videoTitle}
                        </h3>
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
              className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/60 hover:bg-gold-500 hover:text-slate-950 border border-white/20 hover:border-gold-500 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
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
              className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-13 md:h-13 rounded-full bg-black/60 hover:bg-gold-500 hover:text-slate-950 border border-white/20 hover:border-gold-500 text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
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

      {/* Carousel Footer */}
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
                  ? 'w-8 bg-gold-500'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/media-gallery?tab=videos')}
            className="group relative px-6 py-2.5 text-white text-xs md:text-sm font-bold rounded-full uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-gold-500/35 hover:scale-105 active:scale-95 cursor-pointer outline-none bg-gradient-to-r from-gold-500 to-amber-700 text-slate-950 font-bold border border-gold-400/40"
          >
            <span className="flex items-center gap-2 text-slate-950">
              {t('home.viewAllVideos', 'View All Videos')}
              <FaChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title || 'Video Player'}
            onClick={() => setActiveVideo(null)}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-50 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              aria-label="Close Video"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <div
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {activeVideo.url.includes('cloudinary.com') || activeVideo.videoUrl?.includes('cloudinary.com') ? (
                <video
                  src={activeVideo.videoUrl || activeVideo.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  poster={activeVideo.posterUrl || activeVideo.thumbnailUrl}
                >
                  <track kind="captions" />
                </video>
              ) : (
                <video
                  src={activeVideo.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  poster={activeVideo.posterUrl || activeVideo.thumbnailUrl}
                >
                  <track kind="captions" />
                </video>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
