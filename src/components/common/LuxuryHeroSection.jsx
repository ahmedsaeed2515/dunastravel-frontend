import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

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
  stats = [],
  breadcrumbs = null,
  onImageClick = null,
  zoomDuration = 12,
  zoomScale = 1.15,
  ease = 'easeOut'
}) {
  const isRtl = document.dir === 'rtl' || true;

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
    <section className="relative w-full min-h-[100dvh] md:min-h-[680px] flex items-center justify-center overflow-hidden bg-obsidian-950 text-ivory-50 select-none">
      {/* Background Image Container with Cinematic Zoom & Multi-layer Overlay */}
      <div
        className={`absolute inset-0 z-0 overflow-hidden bg-obsidian-950 ${onImageClick ? 'cursor-pointer group' : ''}`}
        onClick={onImageClick || undefined}
      >
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: zoomScale }}
          transition={{
            duration: zoomDuration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          src={bgImage || 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920/v1783026771/8_mpyvu4.jpg'}
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = 'true';
              e.currentTarget.src = 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920/v1783026771/8_mpyvu4.jpg';
            }
          }}
          alt={title}
          className={`w-full h-full object-cover object-[center_35%] sm:object-center ${onImageClick ? 'transition-transform duration-700 group-hover:scale-105' : ''}`}
          loading="eager"
          fetchPriority="high"
        />
        {/* Dark Overlay Gradient for Maximum Text Contrast in All Modes */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/85 via-obsidian-950/70 to-obsidian-950/95 pointer-events-none" />
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
          <motion.div variants={itemVariants} className="inline-block mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-400/50 backdrop-blur-xl shadow-xl shadow-gold-500/20">
              <FaCompass className="text-gold-400 text-xs sm:text-sm" />
              <span className="text-[11px] xs:text-xs sm:text-sm font-extrabold tracking-widest text-gold-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {badge}
              </span>
            </div>
          </motion.div>
        )}

        {/* Headline */}
        <h1
          className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] tracking-tight mb-3 sm:mb-4 font-serif text-balance drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
        >
          {title}
        </h1>

        {/* Subtitle / English Tagline */}
        {subtitle && (
          <motion.p
            variants={itemVariants}
            className="text-sm xs:text-base sm:text-xl md:text-2xl font-black text-gold-300 dark:text-gold-300 tracking-widest uppercase mb-4 sm:mb-6 font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Detailed Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-lg md:text-xl text-ivory-50 max-w-3xl mx-auto leading-relaxed mb-5 sm:mb-8 font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] line-clamp-4 sm:line-clamp-none"
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
                className="px-3 py-1.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/20 hover:border-gold-500/50 hover:bg-gold-500/20 transition-all duration-300 shadow-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 sm:px-9 sm:py-4.5 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 border-2 border-gold-300/90 text-obsidian-950 font-black text-sm sm:text-lg shadow-xl shadow-gold-500/30 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer dark:bg-gradient-to-r dark:from-[#0d0e1c] dark:via-[#181a33] dark:to-[#0d0e1c] dark:border-gold-400 dark:shadow-[0_0_25px_rgba(245,166,35,0.4)] dark:!text-white"
              >
                <span className="font-black text-obsidian-950 dark:!text-white tracking-wide">{primaryCta.text}</span>
                {isRtl ? (
                  <FaArrowLeft className="text-xs sm:text-sm text-obsidian-950 dark:!text-white group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <FaArrowRight className="text-xs sm:text-sm text-obsidian-950 dark:!text-white group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            ) : (
              <Link
                to={primaryCta.link || '/tours'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 sm:px-9 sm:py-4.5 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 border-2 border-gold-300/90 text-obsidian-950 font-black text-sm sm:text-lg shadow-xl shadow-gold-500/30 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer dark:bg-gradient-to-r dark:from-[#0d0e1c] dark:via-[#181a33] dark:to-[#0d0e1c] dark:border-gold-400 dark:shadow-[0_0_25px_rgba(245,166,35,0.4)] dark:!text-white"
              >
                <span className="font-black text-obsidian-950 dark:!text-white tracking-wide">{primaryCta.text}</span>
                {isRtl ? (
                  <FaArrowLeft className="text-xs sm:text-sm text-obsidian-950 dark:!text-white group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <FaArrowRight className="text-xs sm:text-sm text-obsidian-950 dark:!text-white group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            )
          )}

          {secondaryCta && (
            secondaryCta.link?.startsWith('#') || secondaryCta.onClick ? (
              <a
                href={secondaryCta.link || '#'}
                onClick={(e) => handleCtaClick(e, secondaryCta)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 sm:px-9 sm:py-4.5 rounded-full bg-obsidian-950/80 border-2 border-gold-400/90 text-white font-extrabold text-sm sm:text-lg shadow-xl shadow-black/40 hover:bg-gold-500 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer dark:bg-[#0d0e1c] dark:border-gold-400 dark:!text-white"
              >
                <span className="font-extrabold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{secondaryCta.text}</span>
              </a>
            ) : (
              <Link
                to={secondaryCta.link || '/tailor-tour'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 sm:px-9 sm:py-4.5 rounded-full bg-obsidian-950/80 border-2 border-gold-400/90 text-white font-extrabold text-sm sm:text-lg shadow-xl shadow-black/40 hover:bg-gold-500 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer dark:bg-[#0d0e1c] dark:border-gold-400 dark:!text-white"
              >
                <span className="font-extrabold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{secondaryCta.text}</span>
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
