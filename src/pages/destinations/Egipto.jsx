import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaArrowRight, 
  FaArrowLeft 
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import staticTours from '../../data/tours.js';
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
  const { tours: liveEgyptTours } = useTours({ destination: 'egypt', limit: 50 });
  const staticEgyptTours = staticTours.filter((tour) => tour && tour.destination === 'egypt');
  const egyptTours = (liveEgyptTours && liveEgyptTours.length > 0) ? liveEgyptTours : staticEgyptTours;

  const viewDetailsLabels = {
    ar: 'عرض التفاصيل',
    es: 'VER DETALLES',
    pt: 'VER DETALHES',
    it: 'MOSTRA DETTAGLI',
    en: 'VIEW DETAILS',
  };
  const langKey = (lang || 'en').substring(0, 2).toLowerCase();
  const viewDetailsText = t('tourCard.viewDetails', viewDetailsLabels[langKey] || 'VIEW DETAILS');

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

      {/* Brief Overview & 9 Egypt Tours Grid */}
      <section className="container mx-auto px-6 mt-16" id="tours-grid">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-black dark:text-ivory-100 font-bold leading-relaxed" style={{ color: '#000000' }}>
            {t(
              'dest.egypt.brief',
              'A civilisation that has captivated the world for millennia. Egypt blends monumental history with warm hospitality and breathtaking landscapes — from the iconic Pyramids and the Nile cruise to the coral reefs of the Red Sea. Every itinerary is crafted to deliver maximum comfort, luxury and authentic cultural immersion.'
            )}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {egyptTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </motion.div>
      </section>

      {/* Exclusive Egypt Experiences & Packages (5 Signature Suites) */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block font-body text-gold-600 dark:text-gold-400 font-extrabold tracking-[0.2em] uppercase text-sm mb-4"
          >
            {t('dest.egypt.programsSubtitle', isRtl ? 'برامج باقات ديلوكس' : 'Egypt Signature Suites')}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-display-lg text-black dark:text-ivory-50 mb-4 font-display font-extrabold text-3xl md:text-4xl"
            style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
          >
            {t('dest.egypt.programsTitle', isRtl ? 'باقات وبرامج مختارة بعناية' : 'Curated Egypt Programs & Packages')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-black dark:text-ivory-200 font-bold max-w-2xl mx-auto"
            style={{ color: '#000000' }}
          >
            {t(
              'dest.egypt.programsDesc',
              isRtl 
                ? 'اكتشف تشكيلة واسعة من البرامج الكلاسيكية، برامج شهر العسل، والرحلات الدينية المصممة وفق أعلى درجات الراحة.' 
                : 'Discover a wide selection of classic itineraries, honeymoon packages, and religious sacred tours crafted for ultimate comfort.'
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
          {/* Card 1: Classic Program */}
          <motion.div
            variants={itemVariants}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#121829] border border-primary-500/20 dark:border-white/10 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>

            <div className="populer-thumb relative h-[255px] bg-primary-950 travelik-img-container">
              <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-primary-950/85 backdrop-blur-md text-gold-400 text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-gold-500/40 shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <FaClock className="text-gold-400 text-xs" />
                <span>8 {t('common.days', 'Days')}</span>
              </div>

              <Link to="/programs/classic/classic-program" className="block w-full h-full figure reveal image-anime overflow-hidden">
                <img
                  src="https://res.cloudinary.com/degbrq3ck/image/upload/w_600,h_450,c_fill,q_60,f_webp/v1783029636/Classic_Program_gfal0s.jpg"
                  alt="Classic Program"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="populer-contnet p-6 flex flex-col flex-grow bg-white dark:bg-[#121829]">
              <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-extrabold mb-1">
                {t('nav.classic', 'Classic')}
              </span>
              <Link to="/programs/classic/classic-program">
                <h3
                  className="popular-title text-black dark:text-ivory-50 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
                >
                  {t('classic.title', 'Classic Egypt Programme')}
                </h3>
              </Link>

              <div className="populer-list mb-2">
                <span className="flex items-center gap-2 text-black dark:text-ivory-200 font-bold text-[14px]">
                  <FaMapMarkerAlt className="text-gold-500 text-sm flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="truncate text-black dark:text-ivory-100">{t('dest.egyptNile', 'Cairo & Nile')}</span>
                </span>
              </div>

              <p 
                className="text-black dark:text-ivory-200 font-bold text-[14px] line-clamp-2 mb-4 flex-grow leading-relaxed" 
                style={{ color: '#000000', opacity: 1, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '2.8em', lineHeight: '1.4em' }}
              >
                {t(
                  'classic.shortDesc',
                  'Experience the timeless beauty of Egypt with our signature classic itinerary covering all the iconic landmarks.'
                )}
              </p>

              <div className="flex items-center justify-between bg-gray-100/90 dark:bg-primary-950/60 rounded-xl px-3.5 py-2.5 mb-5 border border-gray-300/60 dark:border-white/5 transition-colors group-hover:border-gold-500/40">
                <div className="popular-ratting flex items-center gap-1.5">
                  <ul className="flex items-center gap-1">
                    <li className="text-[#FF974D] text-xs flex gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></li>
                    <li><span className="text-[14px] font-extrabold text-black dark:text-gold-400 ml-1 rtl:mr-1">(5.0)</span></li>
                  </ul>
                </div>
                <div className="populer-days flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-gold-300">
                  <FaUsers className="text-gold-500" />
                  <span className="text-black dark:text-gold-300">{isRtl ? 'شخصين فأكثر' : 'Min 2 Pax'}</span>
                </div>
              </div>

              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-white/10 mt-auto flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-black dark:text-gold-400 uppercase tracking-wider">
                  ID: EG-CLASSIC
                </span>
                <div className="populer-btn defult-btn">
                  <Link to="/programs/classic/classic-program" className="group/btn">
                    <span>{viewDetailsText}</span>
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

          {/* Card 2: Honeymooners Package */}
          <motion.div
            variants={itemVariants}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#121829] border border-primary-500/20 dark:border-white/10 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>

            <div className="populer-thumb relative h-[255px] bg-primary-950 travelik-img-container">
              <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-primary-950/85 backdrop-blur-md text-gold-400 text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-gold-500/40 shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <FaClock className="text-gold-400 text-xs" />
                <span>10 {t('common.days', 'Days')}</span>
              </div>

              <Link to="/programs/honeymooners" className="block w-full h-full figure reveal image-anime overflow-hidden">
                <img
                  src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
                  alt="Honeymoon in Egypt"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="populer-contnet p-6 flex flex-col flex-grow bg-white dark:bg-[#121829]">
              <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-extrabold mb-1">
                {t('nav.honeymooners', 'Honeymooners Package')}
              </span>
              <Link to="/programs/honeymooners">
                <h3
                  className="popular-title text-black dark:text-ivory-50 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
                >
                  {t('honeymooners.egyptTitle', 'Honeymoon in Egypt')}
                </h3>
              </Link>

              <div className="populer-list mb-2">
                <span className="flex items-center gap-2 text-black dark:text-ivory-200 font-bold text-[14px]">
                  <FaMapMarkerAlt className="text-gold-500 text-sm flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="truncate text-black dark:text-ivory-100">{t('dest.luxuryEgypt', 'Luxury Egypt')}</span>
                </span>
              </div>

              <p 
                className="text-black dark:text-ivory-200 font-bold text-[14px] line-clamp-2 mb-4 flex-grow leading-relaxed" 
                style={{ color: '#000000', opacity: 1, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '2.8em', lineHeight: '1.4em' }}
              >
                {t(
                  'dest.egypt.honeymoonersDesc',
                  'Celebrate your love with intimate candlelit dinners, private yacht cruises, and unmatched romantic luxury.'
                )}
              </p>

              <div className="flex items-center justify-between bg-gray-100/90 dark:bg-primary-950/60 rounded-xl px-3.5 py-2.5 mb-5 border border-gray-300/60 dark:border-white/5 transition-colors group-hover:border-gold-500/40">
                <div className="popular-ratting flex items-center gap-1.5">
                  <ul className="flex items-center gap-1">
                    <li className="text-[#FF974D] text-xs flex gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></li>
                    <li><span className="text-[14px] font-extrabold text-black dark:text-gold-400 ml-1 rtl:mr-1">(5.0)</span></li>
                  </ul>
                </div>
                <div className="populer-days flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-gold-300">
                  <FaUsers className="text-gold-500" />
                  <span className="text-black dark:text-gold-300">{isRtl ? 'شخصين فأكثر' : 'Min 2 Pax'}</span>
                </div>
              </div>

              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-white/10 mt-auto flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-black dark:text-gold-400 uppercase tracking-wider">
                  ID: EG-ROMANCE
                </span>
                <div className="populer-btn defult-btn">
                  <Link to="/programs/honeymooners" className="group/btn">
                    <span>{viewDetailsText}</span>
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

          {/* Card 3: Religious Programs */}
          <motion.div
            variants={itemVariants}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#121829] border border-primary-500/20 dark:border-white/10 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>

            <div className="populer-thumb relative h-[255px] bg-primary-950 travelik-img-container">
              <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-primary-950/85 backdrop-blur-md text-gold-400 text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-gold-500/40 shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <FaClock className="text-gold-400 text-xs" />
                <span>10-14 {t('common.days', 'Days')}</span>
              </div>

              <Link to="/programs/religious" className="block w-full h-full figure reveal image-anime overflow-hidden">
                <img
                  src="https://sft-nationaltours.com/wp-content/uploads/2024/11/holy-family-egypt_tg_1397-870x555.jpg"
                  alt="Holy Family & Pilgrimages"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="populer-contnet p-6 flex flex-col flex-grow bg-white dark:bg-[#121829]">
              <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-extrabold mb-1">
                {t('nav.religious', 'Religious Programs')}
              </span>
              <Link to="/programs/religious">
                <h3
                  className="popular-title text-black dark:text-ivory-50 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
                >
                  {t('tour_jordan_title', 'Journey of the Holy Family')}
                </h3>
              </Link>

              <div className="populer-list mb-2">
                <span className="flex items-center gap-2 text-black dark:text-ivory-200 font-bold text-[14px]">
                  <FaMapMarkerAlt className="text-gold-500 text-sm flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="truncate text-black dark:text-ivory-100">{t('dest.holySites', 'Holy Sites')}</span>
                </span>
              </div>

              <p 
                className="text-black dark:text-ivory-200 font-bold text-[14px] line-clamp-2 mb-4 flex-grow leading-relaxed" 
                style={{ color: '#000000', opacity: 1, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '2.8em', lineHeight: '1.4em' }}
              >
                {t(
                  'dest.egypt.religiousDesc',
                  'A spiritual journey through Egypt tracing ancient Coptic monasteries and sacred sites.'
                )}
              </p>
              
              <div className="flex items-center justify-between bg-gray-100/90 dark:bg-primary-950/60 rounded-xl px-3.5 py-2.5 mb-5 border border-gray-300/60 dark:border-white/5 transition-colors group-hover:border-gold-500/40">
                <div className="popular-ratting flex items-center gap-1.5">
                  <ul className="flex items-center gap-1">
                    <li className="text-[#FF974D] text-xs flex gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></li>
                    <li><span className="text-[14px] font-extrabold text-black dark:text-gold-400 ml-1 rtl:mr-1">(5.0)</span></li>
                  </ul>
                </div>
                <div className="populer-days flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-gold-300">
                  <FaUsers className="text-gold-500" />
                  <span className="text-black dark:text-gold-300">{isRtl ? 'شخصين فأكثر' : 'Min 2 Pax'}</span>
                </div>
              </div>

              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-white/10 mt-auto flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-black dark:text-gold-400 uppercase tracking-wider">
                  ID: EG-FAITH
                </span>
                <div className="populer-btn defult-btn">
                  <Link to="/programs/religious" className="group/btn">
                    <span>{viewDetailsText}</span>
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

          {/* Card 4: Multi-Country Tours */}
          <motion.div
            variants={itemVariants}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#121829] border border-primary-500/20 dark:border-white/10 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>

            <div className="populer-thumb relative h-[255px] bg-primary-950 travelik-img-container">
              <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-primary-950/85 backdrop-blur-md text-gold-400 text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-gold-500/40 shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <FaClock className="text-gold-400 text-xs" />
                <span>11-19 {t('common.days', 'Days')}</span>
              </div>

              <Link to="/programs/multi-country" className="block w-full h-full figure reveal image-anime overflow-hidden">
                <img
                  src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030113/Gemini_Generated_Image_cb2enncb2enncb2e_wvyejn.jpg"
                  alt="Multi-Country Tours"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="populer-contnet p-6 flex flex-col flex-grow bg-white dark:bg-[#121829]">
              <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-extrabold mb-1">
                {t('nav.multiCountry', 'Multi-Country Tours')}
              </span>
              <Link to="/programs/multi-country">
                <h3
                  className="popular-title text-black dark:text-ivory-50 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
                >
                  {t('nav.multiCountry', 'Multi-Country Tours')}
                </h3>
              </Link>

              <div className="populer-list mb-2">
                <span className="flex items-center gap-2 text-black dark:text-ivory-200 font-bold text-[14px]">
                  <FaMapMarkerAlt className="text-gold-500 text-sm flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="truncate text-black dark:text-ivory-100">{t('nav.multiCountry', 'Multi-Country')}</span>
                </span>
              </div>

              <p 
                className="text-black dark:text-ivory-200 font-bold text-[14px] line-clamp-2 mb-4 flex-grow leading-relaxed" 
                style={{ color: '#000000', opacity: 1, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '2.8em', lineHeight: '1.4em' }}
              >
                {t(
                  'dest.egypt.multiCountryDesc',
                  'Explore combined itineraries spanning Egypt, Jordan, Turkey and beyond for a truly grand adventure.'
                )}
              </p>

              <div className="flex items-center justify-between bg-gray-100/90 dark:bg-primary-950/60 rounded-xl px-3.5 py-2.5 mb-5 border border-gray-300/60 dark:border-white/5 transition-colors group-hover:border-gold-500/40">
                <div className="popular-ratting flex items-center gap-1.5">
                  <ul className="flex items-center gap-1">
                    <li className="text-[#FF974D] text-xs flex gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></li>
                    <li><span className="text-[14px] font-extrabold text-black dark:text-gold-400 ml-1 rtl:mr-1">(5.0)</span></li>
                  </ul>
                </div>
                <div className="populer-days flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-gold-300">
                  <FaUsers className="text-gold-500" />
                  <span className="text-black dark:text-gold-300">{isRtl ? 'شخصين فأكثر' : 'Min 2 Pax'}</span>
                </div>
              </div>

              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-white/10 mt-auto flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-black dark:text-gold-400 uppercase tracking-wider">
                  ID: EG-MULTI
                </span>
                <div className="populer-btn defult-btn">
                  <Link to="/programs/multi-country" className="group/btn">
                    <span>{viewDetailsText}</span>
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

          {/* Card 5: Egypt Extensions */}
          <motion.div
            variants={itemVariants}
            className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#121829] border border-primary-500/20 dark:border-white/10 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
          >
            <div className="about-sp">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
                <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
                <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>

            <div className="populer-thumb relative h-[255px] bg-primary-950 travelik-img-container">
              <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-primary-950/85 backdrop-blur-md text-gold-400 text-[12px] font-bold px-3.5 py-1.5 rounded-full border border-gold-500/40 shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <FaClock className="text-gold-400 text-xs" />
                <span>4-5 {t('common.days', 'Days')}</span>
              </div>

              <Link to="/programs/extension" className="block w-full h-full figure reveal image-anime overflow-hidden">
                <img
                  src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
                  alt="Egypt Extensions"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>

            <div className="populer-contnet p-6 flex flex-col flex-grow bg-white dark:bg-[#121829]">
              <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-extrabold mb-1">
                EXTENSION
              </span>
              <Link to="/programs/extension">
                <h3
                  className="popular-title text-black dark:text-ivory-50 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
                >
                  {t('dest.egypt.extensionTitle', 'Egypt Extensions')}
                </h3>
              </Link>

              <div className="populer-list mb-2">
                <span className="flex items-center gap-2 text-black dark:text-ivory-200 font-bold text-[14px]">
                  <FaMapMarkerAlt className="text-gold-500 text-sm flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="truncate text-black dark:text-ivory-100">Hurghada · Sharm · Siwa</span>
                </span>
              </div>

              <p 
                className="text-black dark:text-ivory-200 font-bold text-[14px] line-clamp-2 mb-4 flex-grow leading-relaxed" 
                style={{ color: '#000000', opacity: 1, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '2.8em', lineHeight: '1.4em' }}
              >
                {t(
                  'dest.egypt.extensionDesc',
                  'Extend your Egypt journey with added destinations like Hurghada, Sharm El Sheikh, or Siwa Oasis.'
                )}
              </p>

              <div className="flex items-center justify-between bg-gray-100/90 dark:bg-primary-950/60 rounded-xl px-3.5 py-2.5 mb-5 border border-gray-300/60 dark:border-white/5 transition-colors group-hover:border-gold-500/40">
                <div className="popular-ratting flex items-center gap-1.5">
                  <ul className="flex items-center gap-1">
                    <li className="text-[#FF974D] text-xs flex gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></li>
                    <li><span className="text-[14px] font-extrabold text-black dark:text-gold-400 ml-1 rtl:mr-1">(5.0)</span></li>
                  </ul>
                </div>
                <div className="populer-days flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-gold-300">
                  <FaUsers className="text-gold-500" />
                  <span className="text-black dark:text-gold-300">{isRtl ? 'شخصين فأكثر' : 'Min 2 Pax'}</span>
                </div>
              </div>

              <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-white/10 mt-auto flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-black dark:text-gold-400 uppercase tracking-wider">
                  ID: EG-EXT
                </span>
                <div className="populer-btn defult-btn">
                  <Link to="/programs/extension" className="group/btn">
                    <span>{viewDetailsText}</span>
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
        <div className="absolute inset-0 bg-obsidian-900/80" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.ctaTitle', 'Let us design your perfect Egypt tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'dest.egypt.ctaDesc',
              'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4">
                {t('home.tailorTour', 'Tailor Your Tour')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4">
                {t('nav.contact', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
