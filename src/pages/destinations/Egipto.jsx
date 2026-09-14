import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import tours from '../../data/tours.js';
import { useTours } from '../../hooks/useTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

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
  const [activeTab, setActiveTab] = React.useState('all');
  const { tours: liveTours = [] } = useTours({ destination: 'egypt', limit: 50 });

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
    const tourList = Array.isArray(liveTours) && liveTours.length > 0 ? liveTours : tours;
    const foundMap = new Map();
    tourList.forEach((t) => {
      if (t && t.slug) {
        foundMap.set(t.slug, t);
      }
    });

    return BASE_CLASSIC_SLUGS.map((slug) => {
      if (foundMap.has(slug)) {
        return foundMap.get(slug);
      }
      // Fallback matching in local tours array
      const local = tours.find((lt) => lt.slug === slug);
      if (local) return local;
      return null;
    }).filter(Boolean);
  }, [liveTours]);

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
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.egypt.badge', '🏛️ أسرار 7000 عام من الحضارة')}
        title={t('dest.egypt.headline', 'مصر.. حيث يلتقي التاريخ الخالد برغد الرفاهية')}
        subtitle={t('dest.egypt.subtitle', 'Egypt: Where Eternal History Meets Pure Luxury')}
        description={t(
          'dest.egypt.desc',
          'انطلق في رحلة أسطورية عبر الزمن؛ استمتع بزيارة أهرامات الجيزة الخالدة، وواجهات معابد الأقصر وأسوان الملكية، وابحر في نيل مصر على متن أفخم الفنادق العائمة مع استرخاء ساحر على شواطئ البحر الأحمر.'
        )}
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
        bgImage="/imgs/egyothero.webp"
        zoomDuration={12}
      />

      {/* Top Section: 9 Essential Standalone Trips (الرحلات الأساسية الـ 9) */}
      <section className="container mx-auto px-6 mt-16" id="tours-grid">


        {/* 9 Base Standalone Tours Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {baseClassic9Tours.map((tour) => (
            <TourCard key={tour.id || tour.slug} tour={tour} />
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
              <Link to="/programs/classic/classic-program" className="block w-full h-full overflow-hidden">
                <img
                  src="https://res.cloudinary.com/degbrq3ck/image/upload/w_600,h_450,c_fill,q_60,f_webp/v1783029636/Classic_Program_gfal0s.jpg"
                  alt="Classic Program"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/programs/classic/classic-program">
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
                  <Link to="/programs/classic/classic-program" className="group/btn">
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
                  src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
                  alt="Honeymoon in Egypt"
                  className="w-full h-full object-cover"
                  loading="lazy"
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
                  src="https://sft-nationaltours.com/wp-content/uploads/2024/11/holy-family-egypt_tg_1397-870x555.jpg"
                  alt="Holy Family Journey"
                  className="w-full h-full object-cover"
                  loading="lazy"
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

          {/* Card 4: Multi-Country Tours Program (جولات متعددة الدول - 9 رحلات) */}
          <motion.div
            variants={itemVariants}
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
                  src="https://res.cloudinary.com/degbrq3ck/image/upload/v1789341982/62de536e-2674-4518-b31c-ce74f137c119_jxxocg.jpg"
                  alt="Multi-Country Tours"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="populer-contnet flex flex-col flex-grow p-6 bg-white dark:bg-transparent">
              <Link to="/programs/multi-country">
                <h3
                  className="popular-title text-gray-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('nav.multiCountry', 'جولات متعددة الدول (9 رحلات دولية)')}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-slate-100 font-medium text-[14px] leading-relaxed line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.multiCountryDesc',
                  'برامج مجمعة تشمل مصر مع الأردن، المغرب، تونس، دبي، تركيا، واليونان بـ 9 رحلات دولية فريدة.'
                )}
              </p>
              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-gold-500/20 mt-auto flex items-center justify-end gap-3">
                <div className="populer-btn defult-btn shrink-0">
                  <Link to="/programs/multi-country" className="group/btn">
                    <span>{t('tourCard.viewDetails', 'عرض الـ 9 رحلات')}</span>
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
                  src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
                  alt="Egypt Extensions"
                  className="w-full h-full object-cover"
                  loading="lazy"
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
          style={{ backgroundImage: 'url(/imgs/egyothero.webp)' }}
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
