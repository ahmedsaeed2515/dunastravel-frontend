import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import DurationSortFilter from '../../components/common/DurationSortFilter';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

import useLandingPage from '../../hooks/useLandingPage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Egipto() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isRtl = lang.startsWith('ar');
  const navigate = useNavigate();
  const { landingPage } = useLandingPage('egypt', { destinationOnly: true });
  const { tours: allLiveTours = [] } = useTours({ limit: 70 });
  const liveTours = useMemo(() => {
    const list = (allLiveTours || []).filter(t => {
      const d = String(t.destination || t.country || '').toLowerCase();
      return d.includes('egypt') || d.includes('cairo') || d.includes('luxor');
    });
    return list.length > 0 ? list : allLiveTours;
  }, [allLiveTours]);

  // Define the 9 standalone base classic tours for Egypt top section
  const BASE_CLASSIC_SLUGS = [
    'cairo-express-4d',
    'cairo-express-alexandria-5d',
    'egito-classico-8d',
    'egito-classico-ii-9d',
    'egito-historico-10d',
    'cairo-cruzeiro-sharm-11d',
    'grande-ramses-10d',
    'tesouros-egipto-9d',
    'complete-egypt-8d'
  ];

  const baseClassic9Tours = useMemo(() => {
    const tourList = Array.isArray(liveTours) ? liveTours : [];
    if (tourList.length === 0) return [];
    const foundMap = new Map();
    tourList.forEach((t) => {
      if (t && t.slug) {
        foundMap.set(t.slug, t);
      }
    });

    const result = BASE_CLASSIC_SLUGS.map((slug) => foundMap.get(slug)).filter(Boolean);
    return result.length > 0 ? result : tourList;
  }, [liveTours]);

  const dynamicHeroImage = landingPage?.heroImageUrl || 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp';
  const heroTitle = landingPage?.title || t('dest.egypt.headline', 'مصر.. حيث يلتقي التاريخ الخالد برغد الرفاهية');
  const heroSubtitle = landingPage?.subtitle || t('dest.egypt.subtitle', 'Egypt: Where Eternal History Meets Pure Luxury');
  const heroDesc = landingPage?.description || landingPage?.brief || t(
    'dest.egypt.desc',
    'انطلق في رحلة أسطورية عبر الزمن؛ استمتع بزيارة أهرامات الجيزة الخالدة، وواجهات معابد الأقصر وأسوان الملكية، وابحر في نيل مصر على متن أفخم الفنادق العائمة مع استرخاء ساحر على شواطئ البحر الأحمر.'
  );

  const [display9Tours, setDisplay9Tours] = React.useState([]);

  return (
    <div className="w-full min-h-screen bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{t('dest.egypt.seoTitle', 'Luxury Egypt Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'dest.egypt.seoDesc',
            'Discover Egypt in grand style. From the majestic Pyramids of Giza to the temples of Luxor and the Red Sea coast, embark on an unforgettable luxury journey.'
          )}
        />
        <link rel="preconnect" href="https://res.cloudinary.com" crossorigin />
        <link rel="preconnect" href="https://ar.scoopempire.com" />
        <link rel="preconnect" href="https://sft-nationaltours.com" />
        <link rel="preconnect" href="https://hl-tourism.com" />
        <link rel="preload" as="image" href={dynamicHeroImage} fetchpriority="high" />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.egypt.badge', '🏛️ أسرار 7000 عام من الحضارة')}
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDesc}
        highlights={[
          t('dest.egypt.tag1', '🚢 رحلات نيلية 5 نجوم ديلوكس'),
          t('dest.egypt.tag2', '👑 إرشاد سياحي خاص باللغات العالمية'),
          t('dest.egypt.tag3', '🐫 تجارب سفاري وحصريات الصحراء')
        ]}
        primaryCta={{
          text: t('dest.egypt.ctaPrimary', 'استكشف برامج مصر الفاخرة ←'),
          link: '#tours-grid'
        }}
        secondaryCta={{
          text: t('dest.egypt.ctaSecondary', 'صمّم رحلتك الخاصة'),
          link: '/tailor-tour'
        }}
        bgImage={dynamicHeroImage}
        zoomDuration={12}
      />

      {/* Top Section: 9 Essential Standalone Trips (الرحلات الأساسية الـ 9) */}
      <section className="container mx-auto px-6 mt-16" id="tours-grid">
        <div className="text-center mb-10">
          <span className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-2 font-bold">
            {t('dest.egypt.toursSubtitle', 'Handpicked Packages & Itineraries')}
          </span>
          <h2
            className="text-display-md text-obsidian-900 dark:text-ivory-50 font-display font-bold text-3xl md:text-4xl"
            style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
          >
            {t('dest.egypt.toursTitle', 'أبرز برامج ورحلات مصر الفاخرة')}
          </h2>
        </div>

        {/* Filter & Sort by Duration */}
        {baseClassic9Tours.length > 0 && (
          <DurationSortFilter
            tours={baseClassic9Tours}
            onFilterChange={setDisplay9Tours}
            className="mb-8"
          />
        )}

        {/* 9 Base Standalone Tours Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {(display9Tours.length > 0 ? display9Tours : baseClassic9Tours).map((tour, index) => (
            <TourCard key={tour.id || tour.slug} tour={tour} index={index} />
          ))}
        </motion.div>
      </section>

      {/* Bottom Section: 5 Master Programs (برامج مصر الـ 5) */}
      <section className="container mx-auto px-6 mt-24" id="egypt-programs">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4 font-bold"
          >
            {t('dest.egypt.programsSubtitle', 'Luxury Travel Programs in Egypt')}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-4 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.programsTitle', 'Handpicked Egypt Packages')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-obsidian-600 dark:text-ivory-300 max-w-2xl mx-auto"
          >
            {t(
              'dest.egypt.programsDesc',
              'Discover a wide selection of classic, honeymoon, and religious programs tailored for absolute comfort.'
            )}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Card 1: Classic Program (برنامج مصر الكلاسيكي) */}
          <motion.div
            variants={itemVariants}
            onClick={(e) => {
              if (!e.target.closest('a, button')) navigate('/tours/complete-egypt-8d');
            }}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#061d5d] border border-primary-500/20 dark:border-gold-500/30 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div className="populer-thumb relative h-[255px] bg-gray-100 dark:bg-[#041446] dunas-img-container overflow-hidden rounded-t-2xl">
              <Link to="/tours/complete-egypt-8d" className="block w-full h-full overflow-hidden">
                <img
                  src={getOptimizedCloudinaryUrl("https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg", { width: 500, quality: 'auto:eco' })}
                  alt="Classic Program"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="255"
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/tours/complete-egypt-8d">
                <h3
                  className="popular-title text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('classic.title', 'برنامج مصر الكلاسيكي')}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-slate-100 font-medium text-[14px] leading-relaxed line-clamp-3 mb-4 flex-grow">
                {t(
                  'classic.shortDesc',
                  'تجربة كلاسيكية متكاملة تغطي القاهرة، الأهرامات، والأقصر وأسوان عبر أفخم الفنادق العائمة.'
                )}
              </p>
              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-gold-500/20 mt-auto flex items-center justify-end gap-3">
                <div className="populer-btn defult-btn shrink-0">
                  <Link to="/tours/complete-egypt-8d" className="group/btn">
                    <span>{t('tourCard.viewDetails', 'View Details')}</span>
                    {isRtl ? (
                      <FaArrowLeft className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
                    ) : (
                      <FaArrowRight className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Honeymooners Program (شهر العسل في مصر) */}
          <motion.div
            variants={itemVariants}
            onClick={(e) => {
              if (!e.target.closest('a, button')) navigate('/programs/honeymooners');
            }}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#061d5d] border border-primary-500/20 dark:border-gold-500/30 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div className="populer-thumb relative h-[255px] bg-gray-100 dark:bg-[#041446] dunas-img-container overflow-hidden rounded-t-2xl">
              <Link to="/programs/honeymooners" className="block w-full h-full overflow-hidden">
                <img
                  src={getOptimizedCloudinaryUrl("https://res.cloudinary.com/nclvl0iu/image/upload/v1790018507/photo-1510414842594-a61c69b5ae57.webp", { width: 500, quality: 'auto:eco' })}
                  alt="Honeymoon in Egypt"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="255"
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/programs/honeymooners">
                <h3
                  className="popular-title text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('honeymooners.egyptTitle', 'شهر العسل في مصر')}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-slate-100 font-medium text-[14px] leading-relaxed line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.honeymoonersDesc',
                  'احتفل بحبك مع عشاء رومانسي على ضفاف النيل، وجولات يخوت خاصة، وإقامات فاخرة غير مسبوقة.'
                )}
              </p>
              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-gold-500/20 mt-auto flex items-center justify-end gap-3">
                <div className="populer-btn defult-btn shrink-0">
                  <Link to="/programs/honeymooners" className="group/btn">
                    <span>{t('tourCard.viewDetails', 'View Details')}</span>
                    {isRtl ? (
                      <FaArrowLeft className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
                    ) : (
                      <FaArrowRight className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Religious / Holy Family Program (رحلة العائلة المقدسة) */}
          <motion.div
            variants={itemVariants}
            onClick={(e) => {
              if (!e.target.closest('a, button')) navigate('/programs/religious');
            }}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#061d5d] border border-primary-500/20 dark:border-gold-500/30 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div className="populer-thumb relative h-[255px] bg-gray-100 dark:bg-[#041446] dunas-img-container overflow-hidden rounded-t-2xl">
              <Link to="/programs/religious" className="block w-full h-full overflow-hidden">
                <img
                  src={getOptimizedCloudinaryUrl("https://res.cloudinary.com/nclvl0iu/image/upload/v1790018506/55e7c5bc-ffec-4f75-a030-ffcc0ff396a2.webp", { width: 500, quality: 'auto:eco' })}
                  alt="Holy Family Journey"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="255"
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/programs/religious">
                <h3
                  className="popular-title text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('tour_jordan_title', 'رحلة العائلة المقدسة (مسار العائلة المقدسة في مصر)')}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-slate-100 font-medium text-[14px] leading-relaxed line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.religiousDesc',
                  'رحلة روحانية عميقة تتبع خطى العائلة المقدسة عبر أديرة وكنائس مصر القديمة والآثار الروحانية.'
                )}
              </p>
              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-gold-500/20 mt-auto flex items-center justify-end gap-3">
                <div className="populer-btn defult-btn shrink-0">
                  <Link to="/programs/religious" className="group/btn">
                    <span>{t('tourCard.viewDetails', 'View Details')}</span>
                    {isRtl ? (
                      <FaArrowLeft className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
                    ) : (
                      <FaArrowRight className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Multi-Country Tours Program */}
          <motion.div
            variants={itemVariants}
            onClick={(e) => {
              if (!e.target.closest('a, button')) navigate('/programs/multi-country');
            }}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#061d5d] border border-primary-500/20 dark:border-gold-500/30 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div className="populer-thumb relative h-[255px] bg-gray-100 dark:bg-[#041446] dunas-img-container overflow-hidden rounded-t-2xl">
              <Link to="/programs/multi-country" className="block w-full h-full overflow-hidden">
                <img
                  src={getOptimizedCloudinaryUrl("https://res.cloudinary.com/degbrq3ck/image/upload/v1789341982/62de536e-2674-4518-b31c-ce74f137c119_jxxocg.jpg", { width: 500, quality: 'auto:eco' })}
                  alt="Multi-Country Tours"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="255"
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/programs/multi-country">
                <h3
                  className="popular-title text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('nav.multiCountry', 'Multi-Country Tours')}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-slate-100 font-medium text-[14px] leading-relaxed line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.multiCountryDesc',
                  isRtl
                    ? 'برامج مجمعة تشمل مصر مع الأردن، المغرب، تونس، دبي، تركيا، واليونان بـ 9 رحلات دولية فريدة.'
                    : 'Combined itineraries including Egypt with Jordan, Morocco, Tunisia, Dubai, Turkey, and Greece.'
                )}
              </p>
              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-gold-500/20 mt-auto flex items-center justify-end gap-3">
                <div className="populer-btn defult-btn shrink-0">
                  <Link to="/programs/multi-country" className="group/btn">
                    <span>{t('tourCard.viewDetails', isRtl ? 'عرض الـ 9 رحلات' : 'View 9 Tours')}</span>
                    {isRtl ? (
                      <FaArrowLeft className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
                    ) : (
                      <FaArrowRight className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Egypt Extensions (رحلات الاستجمام والملحقات) */}
          <motion.div
            variants={itemVariants}
            onClick={(e) => {
              if (!e.target.closest('a, button')) navigate('/programs/extension');
            }}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#061d5d] border border-primary-500/20 dark:border-gold-500/30 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
            <div className="populer-thumb relative h-[255px] bg-gray-100 dark:bg-[#041446] dunas-img-container overflow-hidden rounded-t-2xl">
              <Link to="/programs/extension" className="block w-full h-full overflow-hidden">
                <img
                  src={getOptimizedCloudinaryUrl("https://ar.scoopempire.com/wp-content/uploads/sites/4/2026/03/pexels-vika-glitter-392079-18895967-scaled-1.jpg", { width: 500, quality: 'auto:eco' })}
                  alt="Egypt Extensions"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="255"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783026771/8_mpyvu4.jpg';
                  }}
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/programs/extension">
                <h3
                  className="popular-title text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('dest.egypt.extensionTitle', 'رحلات الاستجمام والملحقات')}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-slate-100 font-medium text-[14px] leading-relaxed line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.extensionDesc',
                  'مدد إقامتك في مصر مع رحلات شاطئية وصحراوية تشمل الغردقة، شرم الشيخ، أو واحة سيوة والإسكندرية.'
                )}
              </p>
              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-gold-500/20 mt-auto flex items-center justify-end gap-3">
                <div className="populer-btn defult-btn shrink-0">
                  <Link to="/programs/extension" className="group/btn">
                    <span>{t('tourCard.viewDetails', 'View Details')}</span>
                    {isRtl ? (
                      <FaArrowLeft className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
                    ) : (
                      <FaArrowRight className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tailor-Made CTA Section */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp)' }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span
            className="text-gold-400 uppercase tracking-widest text-sm font-bold block mb-4"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
          >
            {t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-white mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 16px rgba(0,0,0,0.95)' }}
          >
            {t('dest.egypt.ctaTitle', 'Let us design your perfect Egypt tour')}
          </h2>
          <p
            className="text-body-lg text-white mb-10 font-semibold"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.9)' }}
          >
            {t(
              'dest.egypt.ctaDesc',
              'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4 font-bold text-base">
                {t('home.tailorTour', 'Tailor Your Tour')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4 font-bold text-base text-white border-white/60">
                {t('nav.contact', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
