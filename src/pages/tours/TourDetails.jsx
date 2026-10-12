import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight, FaChevronLeft, FaClock, FaTag,
  FaCheck, FaTimes, FaMapMarkerAlt, FaBed, FaCheckCircle, FaUsers,
  FaCompass, FaStar, FaHotel, FaCalendarAlt, FaShieldAlt, FaImages, FaSearchPlus
} from 'react-icons/fa';
import { fadeInUp } from '../../animations/variants';
import BookingForm from '../../components/booking/BookingForm';
import { useCurrency } from '../../context/CurrencyContext';

import { useTour } from '../../hooks/useTour';
import { trackEvent } from '../../utils/analytics';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import { resolveTourTitle, resolveTourDuration, resolveTourOverview, resolveLocalizedText, resolveTourHeroImage, extractTourDays, resolveTourType } from '../../utils/titleHelper';
import { getTourDestinationSlug, getDestinationName, getDestinationUrl } from '../../utils/destinationHelper';

import SEOHead from '../../components/seo/SEOHead';
import SuggestedTours from '../../components/tour/SuggestedTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const ReviewsMap = lazy(() => import('../../components/tour/ReviewsMap'));
const RouteMap = lazy(() => import('../../components/tour/RouteMap'));

const TourDetails = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { formatPrice } = useCurrency();
  const params = useParams();
  const rawSlug = params.slug || params['*'] || params.programId || params.id;
  const slug = rawSlug ? String(rawSlug).trim() : 'complete-egypt-8d';

  const { tour, loading, error } = useTour(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (tour?.slug) {
      trackEvent('tour_view', { tourSlug: tour.slug });
    }
  }, [tour?.slug]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (loading) {
    return (
      <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen pt-32 px-6 container mx-auto">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (error || !tour) {
    const errorMessage = typeof error === 'object' && error !== null
      ? (error.message || String(error))
      : (error || t('tour.notFoundDesc', 'We could not find the requested luxury tour.'));

    return (
      <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen pt-32 px-6 container mx-auto">
        <ErrorState
          title={t('common.errorOccurred', 'Tour not found')}
          message={errorMessage}
          actionLabel={t('tour.browseAll', 'Browse Tours')}
          actionLink="/tours"
        />
      </div>
    );
  }

  const title = resolveTourTitle(tour, t, lang);
  const overview = resolveTourOverview(tour, t, lang);
  const duration = resolveTourDuration(tour, t, lang);
  const heroImg = resolveTourHeroImage(tour);

  const galleryImages = Array.isArray(tour.images) && tour.images.length > 0
    ? tour.images.map((img) => (typeof img === 'string' ? img : img?.imageUrl || img?.url || '')).filter(Boolean)
    : (heroImg ? [heroImg] : []);

  const openLightboxAt = (idx) => {
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  const assignedAccommodations =
    Array.isArray(tour.accommodations) && tour.accommodations.length > 0
      ? tour.accommodations
      : Array.isArray(tour.accommodation)
        ? tour.accommodation
        : Array.isArray(tour.hotelInfo?.accommodations)
          ? tour.hotelInfo.accommodations
          : Array.isArray(tour.hotelInfo?.accommodation)
            ? tour.hotelInfo.accommodation
            : [];
  const accommodationSummary =
    typeof tour.accommodation === 'string'
      ? tour.accommodation
      : typeof tour.hotelInfo?.notes === 'string'
        ? tour.hotelInfo.notes
        : typeof tour.hotelInfo?.accommodation === 'string'
          ? tour.hotelInfo.accommodation
          : '';
  const seasonRules = Array.isArray(tour.seasonRules) && tour.seasonRules.length > 0
    ? tour.seasonRules
    : (Array.isArray(tour.seasonPricing?.rules) ? tour.seasonPricing.rules : []);
  const hasHotelsData =
    Boolean(accommodationSummary) ||
    assignedAccommodations.length > 0 ||
    (Array.isArray(tour.hotels) && tour.hotels.length > 0) ||
    (tour.hotels && typeof tour.hotels === 'object' && Object.keys(tour.hotels).length > 0);

  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description: overview,
    touristType: 'Luxury Travelers',
    ...(heroImg ? { image: heroImg } : {}),
    offers: {
      '@type': 'Offer',
      price: tour.basePriceUsd,
      priceCurrency: tour.currency,
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Dunas Travel',
      url: 'https://dunastravel.com',
    },
  };

  const destinationSlug = getTourDestinationSlug(tour);
  const destinationName = getDestinationName(destinationSlug, t, lang);
  const destinationUrl = getDestinationUrl(destinationSlug);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dunastravel.com/' },
      { '@type': 'ListItem', position: 2, name: destinationName, item: `https://dunastravel.com${destinationUrl}` },
      { '@type': 'ListItem', position: 3, name: title, item: `https://dunastravel.com/tours/${tour.slug}` },
    ],
  };

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen text-start">
      <SEOHead
        title={title}
        description={overview}
        ogImage={heroImg}
        ogType="product"
        schema={[tourSchema, breadcrumbSchema]}
      />

      {/* Luxury Destination-Style Hero Section */}
      <LuxuryHeroSection
        badge={resolveTourType(tour.type || tour.category, t, lang) || resolveLocalizedText(tour.type || tour.category, t, lang) || t('tour.luxuryExperience', 'رحلة سياحية فاخرة')}
        title={title}
        subtitle={duration}
        bgImage={heroImg}
        onImageClick={() => openLightboxAt(0)}
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <Link to={destinationUrl} className="hover:text-ivory-50 transition-colors">
              {destinationName}
            </Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <span className="text-ivory-300">{title}</span>
          </div>
        }
        primaryCta={null}
        secondaryCta={null}
      />

      {/* 3. Quick Info Bar */}
      <div className="container mx-auto px-6 mt-6 relative z-20">
        <div className="bg-gradient-to-r from-amber-50 via-orange-100/70 to-amber-50 dark:bg-[#07163c] rounded-2xl shadow-card dark:shadow-[0_10px_35px_rgba(0,0,0,0.7)] overflow-hidden border-2 border-gold-500/70 dark:border-gold-500/40">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-gold-600/30 dark:divide-gold-500/30 bg-transparent dark:bg-[#07163c]">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-amber-800 dark:text-gold-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-amber-800 dark:text-gold-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">{t('tour.tourType', 'Tour Type')}</span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">{resolveTourType(tour.type || tour.category || 'City Break', t, lang) || resolveLocalizedText(tour.type || tour.category || 'City Break', t, lang)}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-amber-800 dark:text-gold-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">{t('tour.minPax', 'Min Pax')}</span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">{resolveLocalizedText(tour.minPax, t, lang) || '2 Pax'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Content Section */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          <div className="lg:col-span-2">

            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/60 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] p-6 md:p-8 rounded-2xl border-2 border-gold-500/80 dark:border-gold-500/70 shadow-lg dark:shadow-[0_14px_45px_rgba(0,0,0,0.85)]">
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
                <p className="text-body-lg text-black dark:text-slate-50 font-extrabold leading-relaxed text-base md:text-lg">{overview}</p>
              </div>
            </motion.div>

            {/* Highlights */}
            {Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <motion.div
                variants={fadeInUp}
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
                  {tour.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/50 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] p-5 rounded-xl shadow-md border-2 border-gold-500/70 dark:border-gold-500/70 hover:border-gold-500 dark:hover:border-gold-400 transition-all">
                      <FaCheckCircle className="text-amber-800 dark:text-gold-400 text-lg mt-0.5 shrink-0 filter drop-shadow-[0_0_5px_rgba(245,166,35,0.4)]" />
                      <span className="text-body-sm font-black text-black dark:text-white text-sm md:text-base leading-relaxed">{resolveLocalizedText(highlight, t, lang)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Itinerary */}
            <motion.div
              variants={fadeInUp}
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
                {/* Timeline Vertical Gold Line */}
                <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400 dark:bg-gold-500 shadow-[0_0_12px_rgba(245,166,35,0.6)]"></div>
                <div className="space-y-6">
                  {tour.itinerary && tour.itinerary.map((day) => (
                    <div key={day.day} className="relative pl-12 rtl:pl-0 rtl:pr-12 md:pl-14 md:rtl:pr-14">
                      {/* Timeline Step Circle */}
                      <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-9 h-9 rounded-full bg-gold-500 dark:bg-gold-400 text-primary-950 dark:text-primary-950 flex items-center justify-center text-sm font-black shadow-[0_0_15px_rgba(245,166,35,0.7)] border-2 border-gold-200 dark:border-gold-100 z-10">
                        {day.day}
                      </div>

                      {/* Day Card Box */}
                      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/60 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] rounded-2xl p-6 md:p-7 border-2 border-gold-500/80 dark:border-gold-500/70 hover:border-gold-600 dark:hover:border-gold-400 shadow-[0_10px_30px_rgba(245,166,35,0.25)] dark:shadow-[0_14px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(245,166,35,0.2)] transition-all duration-300">
                        <div className="flex flex-wrap items-center gap-3 mb-3.5 pb-2.5 border-b border-gold-600/30 dark:border-gold-500/30">
                          <span className="font-black text-amber-900 dark:text-gold-400 text-base md:text-xl tracking-wide">
                            {day.title
                              ? resolveLocalizedText(day.title, t, lang)
                              : `${t('tour.day', 'Day')} ${day.day}`}
                          </span>
                          {day.meals && (
                            <span className="text-caption font-black text-black dark:text-gold-300 flex items-center gap-1.5 ml-auto rtl:ml-0 rtl:mr-auto text-xs bg-gold-500/30 dark:bg-gold-500/25 px-3.5 py-1.5 rounded-full border border-gold-600/50 shadow-sm">
                              <FaBed className="text-amber-900 dark:text-gold-400 text-sm" /> {resolveLocalizedText(day.meals, t, lang)}
                            </span>
                          )}
                        </div>

                        {day.description && (
                          <p className="text-body-sm text-black dark:text-slate-50 font-bold leading-relaxed text-sm md:text-base">{resolveLocalizedText(day.description, t, lang)}</p>
                        )}

                        {!day.description && (
                          <div className="space-y-2">
                            {day.morning && (
                              <p className="text-body-sm text-black dark:text-slate-50 font-bold leading-relaxed text-sm md:text-base">{resolveLocalizedText(day.morning, t, lang)}</p>
                            )}
                            {day.afternoon && (
                              <p className="text-body-sm text-black dark:text-slate-50 font-bold leading-relaxed text-sm md:text-base">{resolveLocalizedText(day.afternoon, t, lang)}</p>
                            )}
                            {day.evening && (
                              <p className="text-body-sm text-black dark:text-slate-50 font-bold leading-relaxed text-sm md:text-base">{resolveLocalizedText(day.evening, t, lang)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Seasonal Pricing Tiers Section */}
            {seasonRules.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="mb-6">
                  <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-[4px] font-black block mb-2 text-xs">
                    {t('tourDetail.seasonalPricingSubtitle', 'TRANSPARENT TARIFFS')}
                  </span>
                  <h2 className="text-display-lg text-2xl md:text-3xl text-black dark:text-white font-display font-black flex items-center gap-3" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                    <FaCalendarAlt className="text-gold-500 text-2xl" />
                    {t('tourDetail.seasonalPricingTitle', 'Seasonal Pricing & Rates')}
                  </h2>
                  <div className="w-20 h-1.5 bg-gold-500 mt-3 rounded-full shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {seasonRules.map((rule, idx) => {
                    const baseTourPrice = Number(tour.price || 0);
                    const rawDirectPrice = Number(rule.priceUsd ?? rule.price ?? 0);
                    const rawMultiplier = Number(rule.multiplier ?? 0);
                    const rawSupplement = Number(rule.supplementUsd ?? rule.supplement ?? 0);
                    const computedBase = rawDirectPrice > 0
                      ? rawDirectPrice
                      : rawMultiplier > 0 && baseTourPrice > 0
                        ? Math.round(baseTourPrice * rawMultiplier * 100) / 100
                        : 0;
                    const rulePrice = computedBase > 0 ? computedBase + rawSupplement : 0;
                    const ruleLabel = rule.seasonName || rule.label || rule.season || rule.seasonCode || 'Season';
                    return (
                      <div
                        key={`${ruleLabel}-${idx}`}
                        className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/60 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] p-5 rounded-2xl border-2 border-gold-500/70 shadow-md flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-gold-400 block mb-1">
                            {resolveLocalizedText(ruleLabel, t, lang)}
                          </span>
                          {(rule.startDate || rule.endDate) && (
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono block">
                              {rule.startDate || '—'} → {rule.endDate || '—'}
                            </span>
                          )}
                        </div>
                        <div className="text-right rtl:text-left">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-300 block font-bold">
                            {t('tourCard.perPerson', 'Per Person')}
                          </span>
                          <span className="text-xl font-black text-black dark:text-white">
                            {rulePrice > 0 ? formatPrice(rulePrice) : t('common.onRequest', 'On Request')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Inclusions & Exclusions Section */}
            {((tour.included && tour.included.length > 0) || (tour.excluded && tour.excluded.length > 0)) && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="mb-8 relative">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-gold-500/25 border border-amber-300/70 dark:border-gold-400/50 mb-3 shadow-sm">
                    <FaShieldAlt className="text-amber-800 dark:text-gold-300 text-xs" />
                    <span className="text-amber-900 dark:text-gold-300 uppercase tracking-[4px] font-black text-xs">
                      {t('tourDetail.details', 'TOUR SPECIFICATIONS')}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)] font-display font-black tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                    {t('tourDetail.incExc', "What's Included & Excluded")}
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-24 h-1.5 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 dark:from-gold-400 dark:to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,166,35,0.6)]" />
                    <div className="w-2 h-2 rounded-full bg-gold-500 dark:bg-gold-400" />
                  </div>
                </div>

                <div className={`grid grid-cols-1 ${tour.excursions && tour.excursions.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                  {/* What is Included */}
                  {tour.included && tour.included.length > 0 && (
                    <div className="bg-gradient-to-br from-emerald-100/90 via-amber-100/80 to-emerald-100/70 dark:bg-gradient-to-br dark:from-[#042d1c] dark:via-[#063d26] dark:to-[#084d30] p-6 md:p-8 rounded-2xl border-2 border-emerald-500/70 dark:border-emerald-400/80 shadow-md">
                      <h3 className="text-display-md text-xl font-black text-black dark:text-emerald-300 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                        <FaCheckCircle className="text-emerald-700 dark:text-emerald-400 flex-shrink-0 text-2xl" />
                        {tour.inclusionsTitle ? resolveLocalizedText(tour.inclusionsTitle, t, lang) : t('tourDetail.included', 'What is Included')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {tour.included.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-black dark:text-emerald-50 font-extrabold text-sm md:text-base">
                            <FaCheck className="text-emerald-700 dark:text-emerald-400 mt-1 flex-shrink-0 text-base font-black" />
                            <span className="leading-relaxed">{resolveLocalizedText(item, t, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What is Excluded */}
                  {tour.excluded && tour.excluded.length > 0 && (
                    <div className="bg-gradient-to-br from-rose-100/90 via-orange-100/80 to-rose-100/70 dark:bg-gradient-to-br dark:from-[#320a14] dark:via-[#420d1a] dark:to-[#541122] p-6 md:p-8 rounded-2xl border-2 border-rose-500/70 dark:border-rose-400/80 shadow-md">
                      <h3 className="text-display-md text-xl font-black text-black dark:text-rose-300 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                        <FaTimes className="text-rose-700 dark:text-rose-400 flex-shrink-0 text-2xl" />
                        {tour.exclusionsTitle ? resolveLocalizedText(tour.exclusionsTitle, t, lang) : t('tourDetail.excluded', 'What is Excluded')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {tour.excluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-black dark:text-rose-50 font-extrabold text-sm md:text-base">
                            <FaTimes className="text-rose-700 dark:text-rose-400 mt-1 flex-shrink-0 text-base font-black" />
                            <span className="leading-relaxed">{resolveLocalizedText(item, t, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Excursions */}
                  {tour.excursions && tour.excursions.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/60 dark:bg-gradient-to-br dark:from-[#2e2003] dark:via-[#3d2b04] dark:to-[#4e3705] p-6 md:p-8 rounded-2xl border-2 border-gold-500/80 dark:border-gold-400/80 shadow-md">
                      <h3 className="text-display-md text-xl font-black text-black dark:text-gold-300 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                        <FaCheckCircle className="text-amber-800 dark:text-gold-400 flex-shrink-0 text-2xl" />
                        {t('tour.optionalExcursions', 'Optional Excursions')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {tour.excursions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-black dark:text-gold-100 font-extrabold text-sm md:text-base">
                            <FaCheck className="text-amber-800 dark:text-gold-400 mt-1 flex-shrink-0 text-base font-black" />
                            <span className="leading-relaxed">{resolveLocalizedText(item, t, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Multi-Photo Gallery Section */}
            {galleryImages.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-[4px] font-black block mb-2 text-xs">
                      {t('tourDetail.gallerySubtitle', 'VISUAL JOURNEY')}
                    </span>
                    <h2 className="text-display-lg text-2xl md:text-3xl text-black dark:text-white font-display font-black flex items-center gap-3" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                      <FaImages className="text-gold-500 text-2xl" />
                      {t('tourDetail.galleryTitle', 'Tour Photo Gallery')}
                    </h2>
                    <div className="w-20 h-1.5 bg-gold-500 mt-3 rounded-full shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                  </div>
                  <button
                    type="button"
                    onClick={() => openLightboxAt(0)}
                    className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-gold-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaSearchPlus /> {t('tourDetail.viewAllPhotos', 'View Fullscreen')} ({galleryImages.length})
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl}-${idx}`}
                      onClick={() => openLightboxAt(idx)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 border-gold-500/40 shadow-md bg-slate-900 ${
                        idx === 0 && galleryImages.length >= 3 ? 'col-span-2 md:col-span-2 h-64 md:h-72' : 'h-48 md:h-56'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${title} - ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="w-11 h-11 rounded-full bg-gold-500 text-slate-950 flex items-center justify-center shadow-lg">
                          <FaSearchPlus className="text-lg" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingForm tourId={tour.id} tourSlug={tour.slug} tourTitle={title} durationDays={extractTourDays(tour)} initialPrice={tour.basePriceUsd || tour.price} />
            </div>
          </div>

        </div>

        {/* Interactive Route Map (Full Width Section) */}
        {((tour.highlights && tour.highlights.length > 0) || (tour.itinerary && tour.itinerary.length > 0) || tour.routeMapJsonb || tour.routeMap) && (
          <div className="mt-20 w-full">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-gold-500 font-semibold bg-obsidian-900/50 rounded-2xl animate-pulse">Loading map route...</div>}>
              <RouteMap itinerary={tour.itinerary} highlights={tour.highlights} routeMap={tour.routeMapJsonb || tour.routeMap} tourTitle={title} />
            </Suspense>
          </div>
        )}

        {/* Accommodation & Assigned Hotels Section */}
        {hasHotelsData && (
          <div className="relative mt-20 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-50 via-gold-50/20 to-obsidian-50 dark:from-[#07163c] dark:via-[#0c225c] dark:to-[#07163c] rounded-3xl border border-gold-500/20"></div>
            <div className="relative z-10 px-4 md:px-12 py-16">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-caption text-gold-500 dark:text-gold-400 uppercase tracking-widest font-extrabold block mb-2">
                      {t('tour.hotelCategory', 'ACCOMMODATION & HOSPITALITY')}
                      {tour.hotelCategory ? ` — ${resolveLocalizedText(tour.hotelCategory, t, lang)}` : ''}
                    </span>
                    <h2 className="text-display-md text-3xl font-extrabold text-obsidian-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}>
                      <FaHotel className="text-gold-500" />
                      {t('dest.greece.hotelsTitle', 'Handpicked Partner Hotels & Rooms')}
                    </h2>
                    <p className="text-body-md text-obsidian-600 dark:text-slate-100 font-semibold mt-2">
                      {accommodationSummary
                        ? resolveLocalizedText(accommodationSummary, t, lang)
                        : t('dest.greece.hotelsDesc', 'Subject to availability, accommodation is provided in our handpicked luxury partner hotels at each destination.')}
                    </p>
                  </div>
                  <Link
                    to="/hotels"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:underline shrink-0"
                  >
                    <span>{t('hotelsCatalog.browseAll', 'Browse All Partner Hotels')}</span>
                    <FaChevronRight className="rtl-flip text-[10px]" />
                  </Link>
                </div>

                {/* Relational TripAccommodation Cards */}
                {assignedAccommodations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignedAccommodations.map((acc, idx) => {
                      const hotelObj = acc.hotel || {};
                      const roomObj = acc.room || null;
                      const isGlobal = hotelObj.isGlobal !== false;
                      const hotelName = resolveLocalizedText(hotelObj.name || acc.hotelName || 'Luxury Partner Hotel', t, lang);
                      const hotelSlug = hotelObj.slug || null;
                      const stars = Number(hotelObj.stars ?? hotelObj.starRating ?? 5);
                      const supplement = Number(acc.priceSupplement ?? acc.priceSupplementUsd ?? 0);
                      const roomRate = Number(roomObj?.ratePerNight ?? roomObj?.basePriceUsd ?? 0);

                      return (
                        <div
                          key={acc.id || `${acc.hotelId}-${idx}`}
                          className="bg-white dark:bg-[#07163c] rounded-2xl shadow-lg border-2 border-gold-400/60 dark:border-gold-500/40 overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            <div className="bg-obsidian-900 dark:bg-[#040f2b] px-5 py-3.5 border-b border-gold-500/30 flex items-center justify-between gap-2">
                              <span className="text-gold-400 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                                <FaMapMarkerAlt className="shrink-0" />
                                {resolveLocalizedText(hotelObj.city || acc.destination || acc.city || destinationName, t, lang)}
                              </span>
                              <span className="flex items-center gap-0.5 text-gold-400 text-xs">
                                {Array.from({ length: Math.min(Math.max(stars, 1), 5) }).map((_, sIdx) => (
                                  <FaStar key={sIdx} />
                                ))}
                              </span>
                            </div>

                            <div className="p-5 space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                                  {hotelName}
                                </h3>
                                {acc.nights && (
                                  <span className="px-3 py-1 rounded-full text-xs font-black bg-gold-500/20 text-amber-900 dark:text-gold-300 border border-gold-500/40 shrink-0">
                                    {acc.nights} {t('hotel.room.nightsCount', 'Nights')}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 text-xs">
                                {(acc.boardBasis || acc.regime) && (
                                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-bold">
                                    🍽️ {acc.boardBasis || acc.regime}
                                  </span>
                                )}
                                {acc.dayRange && (
                                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 font-semibold">
                                    📅 {acc.dayRange}
                                  </span>
                                )}
                                {roomObj && (
                                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-900 dark:text-sky-300 border border-sky-500/30 font-bold flex items-center gap-1.5">
                                    <FaBed /> {resolveLocalizedText(roomObj.name, t, lang)}
                                  </span>
                                )}
                                {supplement > 0 && (
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                                    +{formatPrice(supplement)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {hotelSlug && isGlobal ? (
                            <div className="px-5 py-3 bg-slate-50 dark:bg-[#040f2b]/60 border-t border-gold-500/20 flex items-center justify-between">
                              <Link
                                to={roomObj?.slug ? `/hotels/${hotelSlug}/${roomObj.slug}` : `/hotels/${hotelSlug}`}
                                className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1.5"
                              >
                                <span>{roomObj?.slug ? t('tourDetail.viewRoomDetails', 'View Assigned Room') : t('hotelsCatalog.exploreHotel', 'Explore Hotel')}</span>
                                <FaChevronRight className="rtl-flip text-[10px]" />
                              </Link>
                              {roomRate > 0 && (
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                  {formatPrice(roomRate)} / {t('hotel.night', 'night')}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="px-5 py-3 bg-slate-50 dark:bg-[#040f2b]/60 border-t border-gold-500/20 flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-800 dark:text-gold-300 flex items-center gap-1.5">
                                <FaHotel className="text-gold-500" />
                                {t('tourDetail.tripExclusiveHotel', 'Exclusive Trip Accommodation')}
                              </span>
                              {roomRate > 0 && (
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                  {formatPrice(roomRate)} / {t('hotel.night', 'night')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : Array.isArray(tour.hotels) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tour.hotels.map((hotelItem, idx) => (
                      <div
                        key={`${hotelItem?.name || idx}-${idx}`}
                        className="bg-gradient-to-br from-amber-50/50 via-orange-50/40 to-amber-50/30 dark:bg-[#07163c] rounded-2xl shadow-md border-2 border-gold-400/60 dark:border-gold-500/40 p-5 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <FaHotel className="text-gold-500" />
                            {resolveLocalizedText(hotelItem.name || hotelItem, t, lang)}
                          </h3>
                          {hotelItem.stars && (
                            <span className="flex items-center gap-0.5 text-gold-500 text-xs">
                              {Array.from({ length: Math.min(Math.max(Number(hotelItem.stars), 1), 5) }).map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </span>
                          )}
                        </div>
                        {(hotelItem.city || hotelItem.category || hotelItem.nights || hotelItem.roomType) && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                            {[
                              hotelItem.city,
                              hotelItem.category,
                              hotelItem.roomType,
                              hotelItem.boardBasis,
                              hotelItem.nights ? `${hotelItem.nights} ${t('hotel.room.nightsCount', 'Nights')}` : null,
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                          </p>
                        )}
                        {hotelItem.slug && hotelItem.isGlobal !== false && (
                          <Link
                            to={`/hotels/${hotelItem.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline pt-1"
                          >
                            <span>{t('hotelsCatalog.exploreHotel', 'Explore Hotel')}</span>
                            <FaChevronRight className="rtl-flip text-[10px]" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(tour.hotels || {}).map(([city, hotelList]) => (
                      <div
                        key={city}
                        className="bg-gradient-to-br from-amber-50/50 via-orange-50/40 to-amber-50/30 dark:bg-[#07163c] rounded-2xl shadow-md border-2 border-gold-400/60 dark:border-gold-500/40 overflow-hidden"
                      >
                        <div className="bg-obsidian-900 dark:bg-[#040f2b] px-4 py-3 border-b border-gold-500/30">
                          <h3 className="text-gold-400 dark:text-gold-400 font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                            <FaMapMarkerAlt className="flex-shrink-0 text-xs" />
                            {resolveLocalizedText(city, t, lang)}
                          </h3>
                        </div>
                        <ul className="p-4 flex flex-col gap-1.5">
                          {Array.isArray(hotelList) && hotelList.map((hotel, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-body-sm text-black dark:text-slate-100 font-bold py-1 border-b border-gold-500/15 dark:border-gold-500/20 last:border-0"
                            >
                              <span className="w-2 h-2 rounded-full bg-gold-600 dark:bg-gold-400 flex-shrink-0 shadow-[0_0_6px_rgba(245,166,35,0.6)]" />
                              {resolveLocalizedText(hotel, t, lang)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

      </section>

      {tour?.slug && (
        <Suspense fallback={<div className="py-12 text-center text-gold-500 font-semibold">Loading guest feedback...</div>}>
          <ReviewsMap tourId={tour.slug} />
        </Suspense>
      )}

      {/* Interactive Multi-Photo Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/95 flex flex-col items-center justify-center backdrop-blur-sm p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="absolute top-6 inset-x-6 flex items-center justify-between z-[101]">
              <span className="text-xs font-mono font-bold text-gold-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-gold-500/30">
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
              <button
                type="button"
                aria-label="Close image preview"
                onClick={() => setIsLightboxOpen(false)}
                className="text-ivory-50 hover:text-gold-500 cursor-pointer"
              >
                <FaTimes size={30} />
              </button>
            </div>

            <div className="relative flex items-center justify-center w-full max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-2 md:-left-12 w-10 h-10 rounded-full bg-slate-900/80 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <FaChevronLeft />
                </button>
              )}

              <img
                src={galleryImages[lightboxIndex] || heroImg}
                alt={`${title} - ${lightboxIndex + 1}`}
                className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />

              {galleryImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-2 md:-right-12 w-10 h-10 rounded-full bg-slate-900/80 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div
                className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full px-4 py-2"
                onClick={(e) => e.stopPropagation()}
              >
                {galleryImages.map((thumbUrl, idx) => (
                  <button
                    key={`${thumbUrl}-thumb-${idx}`}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      idx === lightboxIndex ? 'border-gold-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination={tour?.destination || 'egypt'} currentSlug={slug} />
    </div>
  );
};

export default TourDetails;

