import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaTimes } from 'react-icons/fa';

const TravelikHeroSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isAr = lang.startsWith('ar');
  const isRtl = i18n.dir() === 'rtl';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const slides = [
    {
      id: 1,
      bgImage: '/imgs/slider-bg.png',
      fallbackBg: '/imgs/egyothero.webp',
      subTitle: isAr ? 'رحلات بحرية وفاخرة' : 'LUXURY YACHT & RESORT ESCAPES',
      titleLine1: isAr ? 'فخامة' : 'LUXURY',
      titleLine2: isAr ? 'اليخوت' : 'YACHT',
      ornament: '/imgs/lonns.png',
      description: isAr
        ? 'استمتع بأروع الرحلات البحرية والبرامج السياحية المخصصة في مصر والأردن وتركيا ودبي.'
        : 'Continually negotiate plug-and-play collaboration worldclass e-commerce engage embrace bespoke travel.',
      btnText: isAr ? 'شاهد الوجهات' : 'SEE DESTINATION',
      btnLink: '/tours',
    },
    {
      id: 2,
      bgImage: '/imgs/slider-two.png',
      fallbackBg: '/imgs/multicountryhero.jpg',
      subTitle: isAr ? 'مغامرات استثنائية' : 'UNMATCHED BESPOKE ODYSSEYS',
      titleLine1: isAr ? 'رحلات' : 'BESPOKE',
      titleLine2: isAr ? 'فاخرة' : 'JOURNEYS',
      ornament: '/imgs/lonns.png',
      description: isAr
        ? 'برامج سياحية متكاملة عبر أفضل الوجهات التاريخية والطبيعية الشاطئية الفاخرة.'
        : 'Uniquely engage embrace client-based testing procedures across Egypt, Petra, and Istanbul.',
      btnText: isAr ? 'استكشف الباقات' : 'EXPLORE PACKAGES',
      btnLink: '/programs/classic/classic-program',
    },
    {
      id: 3,
      bgImage: '/imgs/hero-poster.webp',
      fallbackBg: '/imgs/egyothero.webp',
      subTitle: isAr ? 'تجارب ملكية خاصة' : 'EXCLUSIVE ROYAL EXPERIENCES',
      titleLine1: isAr ? 'تجارب' : 'EXCLUSIVE',
      titleLine2: isAr ? 'ملكـيـة' : 'EXPERIENCES',
      ornament: '/imgs/lonns.png',
      description: isAr
        ? 'رحلات نيلية خاصة، زيارات أثرية حصرية، وخدمة ضيافة رفيعة المستوى على مدار الساعة.'
        : 'Discover private Nile cruises, ancient pharaonic tombs, and world-class 5-star hospitality.',
      btnText: isAr ? 'احجز الآن' : 'BOOK NOW',
      btnLink: '/contact',
    },
  ];

  // Auto advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlideData = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#0a1122] mt-[100px] sm:mt-[108px] lg:mt-[120px] pb-12 sm:pb-16 lg:pb-24 pt-4 sm:pt-6 lg:pt-8 px-3 sm:px-6 lg:px-12">
      {/* Container wrapper matching main-slider-wrpper with rounded border corners */}
      <div className="relative w-full max-w-[1720px] mx-auto min-h-[640px] sm:min-h-[720px] md:min-h-[820px] lg:min-h-[880px] rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex items-center">
        
        {/* Swiper background slides with slow Ken Burns zoom effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlideData.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 z-0 bg-cover bg-center hero-zoom-bg"
            style={{
              backgroundImage: `url('${activeSlideData.bgImage}'), url('${activeSlideData.fallbackBg}')`,
            }}
          >
            {/* Dark luxury overlay tint matching index-3dark theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060b18]/90 via-[#060b18]/65 to-transparent rtl:bg-gradient-to-l" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-[#060b18]/40" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Circular Video Badge (.circle__video) */}
        <div className="circle-video-container right-6 sm:right-12 md:right-24 lg:right-32 top-10 sm:top-16 lg:top-24 hidden md:flex items-center justify-center">
          {/* Rotating Circular Text SVG */}
          <svg className="rotate-svg" viewBox="0 0 200 200">
            <defs>
              <path
                id="circlePathHero"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
            </defs>
            <text className="rotate-text-path">
              <textPath href="#circlePathHero">
                {isAr ? '• شاهد الفيديو • DUNAS TRAVEL •' : 'watch video • watch video • watch video •'}
              </textPath>
            </text>
          </svg>

          {/* Central Play Button */}
          <button
            type="button"
            onClick={() => setIsVideoOpen(true)}
            className="circle-video-play-btn cursor-pointer"
            aria-label="Play Hero Video"
          >
            <FaPlay className="text-white ml-0.5 text-lg" />
          </button>
        </div>

        {/* Hero Content Area */}
        <div className="relative z-20 container mx-auto px-6 sm:px-12 lg:px-16 text-left rtl:text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideData.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="max-w-4xl"
            >
              {/* Badge Subtitle */}
              {activeSlideData.subTitle && (
                <span className="inline-block text-[#0cb2db] font-black text-xs sm:text-sm tracking-[4px] uppercase mb-3 sm:mb-5">
                  {activeSlideData.subTitle}
                </span>
              )}

              {/* Main Headline (Huge Typography) */}
              <h1 
                className="text-white font-normal uppercase tracking-tight text-[64px] sm:text-[100px] md:text-[150px] lg:text-[180px] xl:text-[210px] leading-[0.88] select-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {activeSlideData.titleLine1}
              </h1>

              <h1 
                className="text-white font-normal uppercase tracking-tight text-[64px] sm:text-[100px] md:text-[150px] lg:text-[180px] xl:text-[210px] leading-[0.88] flex items-center gap-3 sm:gap-6 mt-1 sm:mt-2 select-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {/* Inline Ornament Badge / Lonns Icon */}
                <img 
                  src={activeSlideData.ornament} 
                  alt="Dunas Ornament" 
                  className="w-12 sm:w-20 md:w-28 lg:w-36 h-auto inline-block object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[#0cb2db] font-bold">
                  {activeSlideData.titleLine2}
                </span>
              </h1>

              {/* Subtitle Description */}
              <p className="slider-contect-des text-slate-200 text-base sm:text-xl lg:text-2xl font-medium leading-relaxed max-w-xl my-6 sm:my-8 opacity-95">
                {activeSlideData.description}
              </p>

              {/* CTA Action Button */}
              <div className="pt-2">
                <Link to={activeSlideData.btnLink} className="travelik-hero-btn group inline-flex items-center gap-3">
                  <span>{activeSlideData.btnText}</span>
                  <svg width="18" height="14" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.96 4.9808C12.8146 4.9808 10.8592 3.0272 10.8592 0.88V0H9.0992V0.88C9.0992 2.44112 9.78384 3.90544 10.8583 4.9808H0V6.7408H10.8583C9.78384 7.81616 9.0992 9.28048 9.0992 10.8416V11.7216H10.8592V10.8416C10.8592 8.69528 12.8146 6.7408 14.96 6.7408H15.84V4.9808H14.96Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Bullets / Pagination Dots at bottom right */}
        <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-500 rounded-full cursor-pointer ${
                currentSlide === index
                  ? 'w-9 h-3 bg-[#0cb2db] shadow-[0_0_12px_rgba(12,178,219,0.8)]'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsVideoOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Video"
              >
                <FaTimes size={18} />
              </button>

              <div className="relative aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/COLrJumJeK0?autoplay=1"
                  title="Dunas Travel Experience Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TravelikHeroSection;
