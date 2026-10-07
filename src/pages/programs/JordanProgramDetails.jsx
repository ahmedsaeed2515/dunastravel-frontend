import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaClock,
  FaUsers,
  FaTag,
  FaMapMarkerAlt,
  FaCheck,
  FaChevronRight,
  FaUtensils,
  FaTimes as FaClose,
  FaCompass,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { getJordanProgramBySlug, useJordanPrograms } from '../../hooks/useJordanPrograms';
import TourCard from '../../components/tour/TourCard';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import SuggestedTours from '../../components/tour/SuggestedTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const RouteMap = lazy(() => import('../../components/tour/RouteMap'));
const ReviewsMap = lazy(() => import('../../components/tour/ReviewsMap'));

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function JordanProgramDetails() {
  const { t, i18n } = useTranslation();
  const { programId, slug } = useParams();
  const targetSlug = programId || slug;

  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(i18n.language) ? i18n.language : 'en';
  const program = getJordanProgramBySlug(targetSlug, locale);
  const allJordanPrograms = useJordanPrograms();

  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [targetSlug]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const item = el.querySelector('.related-carousel-item');
      const itemWidth = (item ? item.offsetWidth : 300) + 24;
      const currentScroll = el.scrollLeft;
      const visibleWidth = el.clientWidth;
      const totalWidth = el.scrollWidth;
      const isEnd = currentScroll + visibleWidth >= totalWidth - 10;

      if (isEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian-50 dark:bg-[#0f0f1a] px-6 py-24 text-center">
        <h1 className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-4 font-serif">
          {t('programs.notFound', 'Trip no longer available')}
        </h1>
        <p className="text-body-md text-obsidian-500 dark:text-obsidian-300 mb-8 max-w-md">
          {t('programs.notFoundDesc', 'The trip you are looking for does not exist or has been removed.')}
        </p>
        <Link
          to="/destinations/jordan"
          className="bg-gold-500 hover:bg-gold-600 text-obsidian-900 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          {t('programs.viewAllJordanTours', 'View All Jordan Tours')}
        </Link>
      </div>
    );
  }

  const { title, overview, duration, highlights, days, images, code, minPax, id, included, excluded } = program;
  const relatedPrograms = allJordanPrograms.filter((p) => p.id !== id);

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overview} />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.jordan.title', 'Jordan') + ' • ' + (code || duration)}
        title={title}
        subtitle={duration}
        bgImage={images[activeImageIndex || 0] || images[0]}
        onImageClick={() => setActiveImageIndex(0)}
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 uppercase tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <Link to="/destinations/jordan" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('dest.jordan.title', 'Jordan')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <span className="text-ivory-300 truncate max-w-[220px] md:max-w-none">{title}</span>
          </div>
        }
        primaryCta={null}
        secondaryCta={null}
      />

      {/* Key Stats Bar */}
      <div className="container mx-auto px-6 mt-6 relative z-20">
        <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 border-b border-gray-100 bg-obsidian-50">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.tourType', 'Program')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{minPax}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.code', 'Code')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{code}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaMapMarkerAlt className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.destination', 'Destination')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{t('dest.jordan.title', 'Jordan')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3.5 mb-5 pb-3.5 border-b-2 border-gold-500/30 dark:border-gold-500/40">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-600 dark:from-amber-300 dark:via-gold-400 dark:to-amber-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,166,35,0.45)] shrink-0 font-black">
                  <FaCompass className="text-2xl text-slate-950" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-md bg-amber-100/90 dark:bg-gold-500/25 text-amber-900 dark:text-gold-300 text-[11px] sm:text-xs font-black uppercase tracking-[3px] border border-amber-300/60 dark:border-gold-400/50 mb-1 shadow-sm font-sans">
                    {t('tourDetail.aboutTourTag', 'TRIP DISCOVERY')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-[#FFE066] dark:drop-shadow-[0_2px_12px_rgba(255,224,102,0.45)] font-display tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                    {t('tourDetail.overview', 'Overview')}
                  </h2>
                </div>
              </div>
              <p className="text-body-lg text-slate-800 dark:text-slate-100 font-semibold leading-relaxed whitespace-pre-line text-base md:text-lg">
                {overview}
              </p>
            </motion.div>

            {/* Key Highlights */}
            {Array.isArray(highlights) && highlights.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b-2 border-gold-500/30 dark:border-gold-500/40">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-600 dark:from-amber-300 dark:via-gold-400 dark:to-amber-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,166,35,0.45)] shrink-0 font-black">
                    <FaStar className="text-2xl text-slate-950" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-0.5 rounded-md bg-amber-100/90 dark:bg-gold-500/25 text-amber-900 dark:text-gold-300 text-[11px] sm:text-xs font-black uppercase tracking-[3px] border border-amber-300/60 dark:border-gold-400/50 mb-1 shadow-sm font-sans">
                      {t('tourDetail.curatedHighlightsTag', 'CURATED EXPERIENCES')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-[#FFE066] dark:drop-shadow-[0_2px_12px_rgba(255,224,102,0.45)] font-display tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                      {t('tourDetail.highlights', 'Key Highlights')}
                    </h2>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/50 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] p-4.5 rounded-xl shadow-md border-2 border-gold-500/70 dark:border-gold-500/70 hover:border-gold-500 dark:hover:border-gold-400 transition-all">
                      <FaCheckCircle className="text-amber-800 dark:text-gold-400 text-lg mt-0.5 shrink-0 filter drop-shadow-[0_0_5px_rgba(245,166,35,0.4)]" />
                      <span className="text-body-sm font-black text-slate-900 dark:text-white text-sm md:text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Itinerary */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="mb-10 text-center relative">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-gold-500/25 border border-amber-300/70 dark:border-gold-400/50 mb-3 shadow-sm">
                  <FaCalendarAlt className="text-amber-800 dark:text-gold-300 text-xs" />
                  <span className="text-amber-900 dark:text-gold-300 uppercase tracking-[4px] font-black text-xs sm:text-sm">
                    {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)] font-display tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                  {t('tourDetail.itinerary', 'Itinerary')}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold-500 to-amber-600 dark:via-gold-400 rounded-full" />
                  <div className="w-3 h-3 rounded-full bg-gold-500 dark:bg-gold-400 shadow-[0_0_12px_rgba(245,166,35,0.9)] ring-4 ring-gold-500/20" />
                  <div className="w-16 h-1 bg-gradient-to-l from-transparent via-gold-500 to-amber-600 dark:via-gold-400 rounded-full" />
                </div>
              </div>

              <div className="relative max-w-full">
                <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400" />
                <div className="space-y-6">
                  {days.map((d) => (
                    <div key={d.day} className="relative pl-10 md:pl-12">
                      <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {d.day}
                      </div>
                      <div className="bg-ivory-50 rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-obsidian-900">
                            {d.title ? d.title : `${t('tour.day', 'Day')} ${d.day}`}
                          </span>
                          {d.meals && (
                            <span className="text-caption text-obsidian-400 flex items-center gap-1.5 ml-auto text-xs">
                              <FaUtensils className="text-gold-500" />
                              {d.meals}
                            </span>
                          )}
                        </div>
                        <p className="text-body-sm text-obsidian-500 leading-relaxed whitespace-pre-line">
                          {d.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Inclusions & Exclusions */}
            {((Array.isArray(included) && included.length > 0) || (Array.isArray(excluded) && excluded.length > 0)) && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {Array.isArray(included) && included.length > 0 && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-6 md:p-8 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 shadow-sm">
                    <h3 className="text-display-md text-xl font-bold text-emerald-950 dark:text-emerald-300 mb-4 flex items-center gap-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <FaCheck className="text-emerald-600 dark:text-emerald-400 text-sm" />
                      {t('tourDetail.included', 'What is Included')}
                    </h3>
                    <ul className="space-y-3">
                      {included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-md text-emerald-900 dark:text-emerald-100">
                          <FaCheck className="text-emerald-600 dark:text-emerald-400 mt-1 shrink-0 text-sm" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(excluded) && excluded.length > 0 && (
                  <div className="bg-rose-50/70 dark:bg-rose-950/20 p-6 md:p-8 rounded-2xl border border-rose-200/70 dark:border-rose-800/40 shadow-sm">
                    <h3 className="text-display-md text-xl font-bold text-rose-950 dark:text-rose-300 mb-4 flex items-center gap-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <FaClose className="text-rose-600 dark:text-rose-400 text-sm" />
                      {t('tourDetail.excluded', 'What is Excluded')}
                    </h3>
                    <ul className="space-y-3">
                      {excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-md text-rose-900 dark:text-rose-100">
                          <FaClose className="text-rose-500 dark:text-rose-400 mt-1 shrink-0 text-sm" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Route Map */}
            {Array.isArray(days) && days.length > 0 && (
              <RouteMap itinerary={days} />
            )}
          </div>

          {/* Right Column: Advanced Booking Component Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 self-start z-30">
              <AdvancedBooking tourTitle={title} />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Map */}
      <section className="mt-16">
        <ReviewsMap />
      </section>

      {/* Related Programs Carousel */}
      {relatedPrograms.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-display-lg text-obsidian-900 dark:text-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('tourDetail.relatedTitle', 'You May Also Like')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" />
          </div>

          <div className="related-carousel" ref={carouselRef}>
            {relatedPrograms.map((rel) => (
              <div key={rel.id} className="related-carousel-item">
                <TourCard
                  tour={{
                    id: rel.id,
                    slug: `jordan/${rel.slug}`,
                    title: rel.title,
                    images: rel.images,
                    duration: rel.duration,
                    overview: rel.overview,
                    destination: 'Jordan',
                    badge: rel.code,
                    price: Number(rel.price || rel.basePriceUsd || 0),
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Modal */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl p-2 hover:text-gold-500 transition-colors"
          >
            <FaClose />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* CSS for Carousel */}
      <style>{`
        .related-carousel {
          display: flex;
          overflow-x: auto;
          gap: 24px;
          padding-bottom: 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .related-carousel::-webkit-scrollbar {
          display: none;
        }
        .related-carousel-item {
          flex: 0 0 auto;
          width: 280px;
          scroll-snap-align: start;
        }
        @media (min-width: 768px) {
          .related-carousel-item {
            width: 320px;
          }
        }
        @media (min-width: 1024px) {
          .related-carousel-item {
            width: 350px;
          }
        }
      `}</style>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination="jordan" currentSlug={targetSlug} />
    </div>
  );
}
