import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const FALLBACK_HERO_IMAGE = 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920/v1783026771/8_mpyvu4.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LuxuryHeroSection({
  badge = 'تجارب سياحية فاخرة',
  title = 'اكتشف روعة السفر الملكي',
  subtitle = '',
  description = '',
  highlights = [],
  primaryCta = { text: 'استكشف الباقات', link: '#tours' },
  secondaryCta = { text: 'صمّم رحلتك الخاصة', link: '/tailor-tour' },
  bgImage = '/imgs/egyothero.webp',
  bgImages = null,
  rotateInterval = 3000,
  rotateTransition = 1.2,
  stats = [],
  breadcrumbs = null,
  onImageClick = null,
  zoomDuration = 12,
  zoomScale = 1.15,
  ease = 'easeOut'
}) {
  const isRtl = document.dir === 'rtl' || true;

  // ---- Hero background rotation (optional) -------------------------------
  // Callers may pass `bgImages` (e.g. the tour gallery) to cycle the hero
  // background. When omitted we keep the original single-image behaviour so
  // every other page using this component is unaffected.
  const images = useMemo(() => {
    const source = Array.isArray(bgImages) && bgImages.length > 0 ? bgImages : [bgImage];
    const cleaned = source.filter((url) => typeof url === 'string' && url.trim().length > 0);
    const unique = Array.from(new Set(cleaned));
    return unique.length > 0 ? unique : [FALLBACK_HERO_IMAGE];
  }, [bgImages, bgImage]);

  const imagesKey = images.join('|');
  const canRotate = images.length > 1;
  // Latest playlist kept in a ref so the rotation timer is not restarted by
  // unrelated parent re-renders (the array identity changes on every render).
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState !== 'hidden'
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // The zoom lives on a wrapper so it keeps running smoothly while the inner
  // cross-fade swaps images.
  const zoomControls = useAnimationControls();

  // Reset to the first frame whenever the playlist itself changes (new tour).
  // (Kept as a clamped index instead of state so prop changes never cascade.)
  const safeIndex = images.length > 0 ? activeIndex % images.length : 0;

  // Respect the user's reduced-motion preference.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }
    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  // Stop rotating/zooming once the hero scrolls out of the viewport.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Stop when the browser tab is backgrounded.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handleVisibility = () => setIsTabVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const shouldAnimate = isInView && isTabVisible && !prefersReducedMotion;

  // Continuous cinematic zoom (wrapper-level).
  useEffect(() => {
    if (prefersReducedMotion) {
      zoomControls.set({ scale: 1 });
      return;
    }
    if (shouldAnimate) {
      zoomControls.start({
        scale: zoomScale,
        transition: { duration: zoomDuration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
      });
    } else {
      zoomControls.stop();
    }
  }, [shouldAnimate, prefersReducedMotion, zoomScale, zoomDuration, zoomControls]);

  // Advance the playlist, preloading the next frame first so the cross-fade
  // never flashes a blank image.
  useEffect(() => {
    if (!canRotate || !shouldAnimate) return undefined;
    const playlist = imagesRef.current;
    const current = activeIndex % playlist.length;
    const upcoming = playlist[(current + 1) % playlist.length];
    if (upcoming) {
      const preloader = new Image();
      preloader.decoding = 'async';
      preloader.src = upcoming;
    }
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % playlist.length);
    }, rotateInterval);
    return () => clearTimeout(timer);
  }, [activeIndex, canRotate, shouldAnimate, imagesKey, rotateInterval]);

  const handleCtaClick = (e, target) => {
    if (target?.onClick) {
      e.preventDefault();
      target.onClick();
    } else if (target?.link && target.link.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(target.link.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100dvh] md:min-h-[680px] flex items-center justify-center overflow-hidden bg-obsidian-950 text-ivory-50 select-none">
      {/* Background Image Container with Cinematic Zoom & Cross-fade */}
      <div
        className={`absolute inset-0 z-0 overflow-hidden bg-obsidian-950 ${onImageClick ? 'cursor-pointer group' : ''}`}
        onClick={onImageClick || undefined}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={zoomControls}
          className="absolute inset-0 w-full h-full"
        >
          <div className={`absolute inset-0 w-full h-full transition-transform duration-700 ${onImageClick ? 'group-hover:scale-105' : ''}`}>
            <AnimatePresence initial={false}>
              <motion.img
                key={`${safeIndex}-${images[safeIndex]}`}
                src={images[safeIndex] || FALLBACK_HERO_IMAGE}
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallback) {
                    e.currentTarget.dataset.fallback = 'true';
                    e.currentTarget.src = FALLBACK_HERO_IMAGE;
                  }
                }}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-[center_35%] sm:object-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: canRotate ? rotateTransition : 0, ease: 'easeInOut' }}
                loading={safeIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={safeIndex === 0 ? 'high' : 'auto'}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>



      {/* Main Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 container mx-auto px-3.5 sm:px-6 text-center max-w-5xl pt-16 xs:pt-20 sm:pt-28 md:pt-32 pb-10 sm:pb-16 flex flex-col items-center justify-center min-h-[500px] sm:min-h-0"
      >
        {/* Breadcrumb Slot */}
        {breadcrumbs && (
          <motion.div variants={itemVariants} className="mb-4 sm:mb-6 flex justify-center">
            <div className="inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-obsidian-950/80 border border-gold-500/30 backdrop-blur-md shadow-lg shadow-black/40">
              {breadcrumbs}
            </div>
          </motion.div>
        )}

        {/* Eyebrow Glass Badge */}
        {badge && (
          <motion.div variants={itemVariants} className="inline-block max-w-full mb-4 sm:mb-6 px-2">
            <div
              className="inline-flex items-center justify-center gap-2 sm:gap-2.5 max-w-[94vw] sm:max-w-max px-3.5 py-2 xs:px-4.5 xs:py-2.5 sm:px-6 sm:py-3 rounded-full border border-[#F5A623]/60 backdrop-blur-xl shadow-xl shadow-black/50 text-center transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}
            >
              <FaCompass className="text-[#F5A623] text-xs sm:text-base animate-pulse shrink-0" />
              <span className="text-[11px] xs:text-xs sm:text-base font-extrabold tracking-wider text-[#F5A623] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-snug sm:leading-normal">
                {badge}
              </span>
            </div>
          </motion.div>
        )}

        {/* Headline */}
        <h1
          className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.25] tracking-tight mb-3 sm:mb-4 font-serif text-balance drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
        >
          {title}
        </h1>

        {/* Subtitle / English Tagline */}
        {subtitle && (
          <motion.p
            variants={itemVariants}
            className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-gold-400 tracking-widest uppercase mb-4 sm:mb-6 font-sans drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_12px_rgba(245,166,35,0.7),_0_4px_24px_rgba(0,0,0,0.95)]"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Detailed Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-base md:text-xl text-ivory-100 max-w-3xl mx-auto leading-relaxed mb-5 sm:mb-8 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-4 sm:line-clamp-none"
          >
            {description}
          </motion.p>
        )}

        {/* Highlight Tags / Quick Badges */}
        {highlights && highlights.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 mb-6 sm:mb-10 max-w-4xl mx-auto"
          >
            {highlights.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-obsidian-950/60 backdrop-blur-md text-ivory-100 text-[11px] sm:text-sm font-medium border border-white/20 hover:border-gold-500/50 hover:bg-gold-500/20 transition-all duration-300 shadow-md"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Call to Actions (CTAs) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto"
        >
          {primaryCta && (
            primaryCta.link?.startsWith('#') || primaryCta.onClick ? (
              <a
                href={primaryCta.link || '#'}
                onClick={(e) => handleCtaClick(e, primaryCta)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 hover:from-gold-400 hover:to-amber-300 border border-gold-300/80 !text-black dark:!text-black font-extrabold text-sm sm:text-lg shadow-xl shadow-gold-500/30 hover:scale-105 hover:shadow-gold-500/50 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <span className="!text-black dark:!text-black font-extrabold">{primaryCta.text}</span>
                {isRtl ? (
                  <FaArrowLeft className="text-xs sm:text-sm !text-black dark:!text-black group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <FaArrowRight className="text-xs sm:text-sm !text-black dark:!text-black group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            ) : (
              <Link
                to={primaryCta.link || '/tours'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 hover:from-gold-400 hover:to-amber-300 border border-gold-300/80 !text-black dark:!text-black font-extrabold text-sm sm:text-lg shadow-xl shadow-gold-500/30 hover:scale-105 hover:shadow-gold-500/50 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <span className="!text-black dark:!text-black font-extrabold">{primaryCta.text}</span>
                {isRtl ? (
                  <FaArrowLeft className="text-xs sm:text-sm !text-black dark:!text-black group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <FaArrowRight className="text-xs sm:text-sm !text-black dark:!text-black group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            )
          )}

          {secondaryCta && (
            secondaryCta.link?.startsWith('#') || secondaryCta.onClick ? (
              <a
                href={secondaryCta.link || '#'}
                onClick={(e) => handleCtaClick(e, secondaryCta)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 hover:from-amber-300 hover:to-gold-300 border border-gold-300/80 !text-black dark:!text-black font-extrabold text-sm sm:text-lg shadow-lg shadow-gold-500/25 hover:scale-105 hover:shadow-gold-400/40 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span className="!text-black dark:!text-black font-extrabold">{secondaryCta.text}</span>
              </a>
            ) : (
              <Link
                to={secondaryCta.link || '/tailor-tour'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-gold-400 to-amber-500 hover:from-amber-300 hover:to-gold-300 border border-gold-300/80 !text-black dark:!text-black font-extrabold text-sm sm:text-lg shadow-lg shadow-gold-500/25 hover:scale-105 hover:shadow-gold-400/40 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span className="!text-black dark:!text-black font-extrabold">{secondaryCta.text}</span>
              </Link>
            )
          )}
        </motion.div>

        {/* Optional Stats Bar */}
        {stats && stats.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto w-full"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-xl sm:text-3xl font-extrabold text-gold-400 font-serif">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-sm text-ivory-300 mt-0.5 sm:mt-1 font-light">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
