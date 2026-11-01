import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClock,
  FaUsers,
  FaTag,
  FaMapMarkerAlt,
  FaCheck,
  FaChevronRight,
  FaUtensils,
  FaTimes,
  FaCompass,
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaHeart
} from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import SuggestedTours from '../../components/tour/SuggestedTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import { fadeInUp } from '../../animations/variants';
import { formatDayLabel } from '../../utils/titleHelper';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const HONEYMOON_IMAGES = [
  'https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
];

const HONEYMOON_ITINERARY = [
  {
    day: 1,
    titleKey: 'honeymooners.day1Title',
    titleDefault: 'Arrival in Cairo',
    descKey: 'honeymooners.day1Desc',
    descDefault: 'Arrival at Cairo International Airport. Reception by our representative and private VIP transfer to your hotel. Check-in and romantic welcome amenity.',
    mealsKey: 'honeymooners.day1Meals',
    mealsDefault: 'Bed & Breakfast',
    location: 'Cairo'
  },
  {
    day: 2,
    titleKey: 'honeymooners.day2Title',
    titleDefault: 'Pyramids of Giza and Saqqara',
    descKey: 'honeymooners.day2Desc',
    descDefault: 'After breakfast, depart to visit the famous Pyramids of Giza: Cheops, Chephren, and Mycerinus, as well as the Sphinx. Continue to Saqqara to visit the Step Pyramid of Djoser and Memphis, the ancient capital. Return to hotel in Cairo.',
    mealsKey: 'honeymooners.day2Meals',
    mealsDefault: 'Breakfast & Lunch',
    location: 'Giza'
  },
  {
    day: 3,
    titleKey: 'honeymooners.day3Title',
    titleDefault: 'Historic Cairo & Grand Egyptian Museum',
    descKey: 'honeymooners.day3Desc',
    descDefault: 'Breakfast at hotel. Visit to the Grand Egyptian Museum (GEM) with its incredible treasures. Continue to the Citadel of Saladin, the Alabaster Mosque, Coptic Cairo, and the vibrant Khan El Khalili market. Return to hotel.',
    mealsKey: 'honeymooners.day3Meals',
    mealsDefault: 'Breakfast & Lunch',
    location: 'Cairo'
  },
  {
    day: 4,
    titleKey: 'honeymooners.day4Title',
    titleDefault: 'Cairo – Luxor – Luxury Nile Cruise',
    descKey: 'honeymooners.day4Desc',
    descDefault: 'Breakfast. Transfer to airport for domestic flight to Luxor. Arrival and embarkation on the 5-star deluxe Nile Cruise. Visit to the majestic temples of Karnak and Luxor. Dinner and romantic overnight on board.',
    mealsKey: 'honeymooners.day4Meals',
    mealsDefault: 'Full Board (Cruise)',
    location: 'Luxor'
  },
  {
    day: 5,
    titleKey: 'honeymooners.day5Title',
    titleDefault: 'Luxor West Bank – Edfu',
    descKey: 'honeymooners.day5Desc',
    descDefault: 'Visit to the Valley of the Kings where the royal tombs of pharaohs lie, including Queen Hatshepsut Temple and the Colossi of Memnon. Sailing on the Nile towards Edfu. Full board and overnight on board.',
    mealsKey: 'honeymooners.day5Meals',
    mealsDefault: 'Full Board (Cruise)',
    location: 'Edfu'
  },
  {
    day: 6,
    titleKey: 'honeymooners.day6Title',
    titleDefault: 'Edfu – Kom Ombo – Aswan',
    descKey: 'honeymooners.day6Desc',
    descDefault: 'Visit to the Temple of Edfu dedicated to god Horus. Sailing to Kom Ombo and visit to the unique dual temple dedicated to Sobek and Haroeris. Continue sailing to Aswan. Full board and overnight on board.',
    mealsKey: 'honeymooners.day6Meals',
    mealsDefault: 'Full Board (Cruise)',
    location: 'Aswan'
  },
  {
    day: 7,
    titleKey: 'honeymooners.day7Title',
    titleDefault: 'Aswan – Hurghada Red Sea',
    descKey: 'honeymooners.day7Desc',
    descDefault: 'After breakfast, disembark from cruise. Panoramic visit of Aswan. Transfer to airport for flight to Hurghada. Arrival and private transfer to luxury beachfront resort. Accommodation on All-Inclusive basis.',
    mealsKey: 'honeymooners.day7Meals',
    mealsDefault: 'All Inclusive (Resort)',
    location: 'Hurghada'
  },
  {
    day: 8,
    titleKey: 'honeymooners.day8Title',
    titleDefault: 'Hurghada Red Sea Relaxation',
    descKey: 'honeymooners.day8Desc',
    descDefault: 'Free day for the couple to enjoy the turquoise beaches of the Red Sea, spa treatments, or optional activities such as private yacht trip, snorkeling or desert safari under the stars.',
    mealsKey: 'honeymooners.day8Meals',
    mealsDefault: 'All Inclusive (Resort)',
    location: 'Hurghada'
  },
  {
    day: 9,
    titleKey: 'honeymooners.day9Title',
    titleDefault: 'Hurghada / Cairo',
    descKey: 'honeymooners.day9Desc',
    descDefault: 'Free morning to relax and enjoy the luxury resort facilities and beach. At the scheduled time, transfer to Hurghada airport for flight back to Cairo. Transfer to hotel for final overnight.',
    mealsKey: 'honeymooners.day9Meals',
    mealsDefault: 'All Inclusive (Resort)',
    location: 'Hurghada'
  },
  {
    day: 10,
    titleKey: 'honeymooners.day10Title',
    titleDefault: 'Departure',
    descKey: 'honeymooners.day10Desc',
    descDefault: 'Breakfast at hotel. At the scheduled time, private VIP transfer to Cairo International Airport for your international departure flight, carrying memories to last a lifetime.',
    mealsKey: 'honeymooners.day10Meals',
    mealsDefault: 'Breakfast',
    location: 'Cairo'
  }
];

const CURATED_HIGHLIGHTS = [
  { key: 'honeymooners.hl1', default: 'VIP Private airport greeting & romantic floral welcome upon arrival' },
  { key: 'honeymooners.hl2', default: '5-Star Deluxe Nile Cruise with private panoramic balcony suite' },
  { key: 'honeymooners.hl3', default: 'Private guided exploration of Giza Pyramids, Sphinx, Saqqara & Valley of the Kings' },
  { key: 'honeymooners.hl4', default: 'Romantic candlelit dining experience along the timeless Nile' },
  { key: 'honeymooners.hl5', default: 'All-Inclusive luxury relaxation at a premier Red Sea beachfront resort in Hurghada' },
  { key: 'honeymooners.hl6', default: 'Special honeymoon room touches, celebration cake & 24/7 dedicated concierge' }
];

const INCLUDES_LIST = [
  { key: 'honeymooners.inc1', default: '5-star luxury hotels in Cairo (Bed & Breakfast)' },
  { key: 'honeymooners.inc2', default: '5-star Deluxe Nile Cruise (Full Board: Breakfast, Lunch & Dinner)' },
  { key: 'honeymooners.inc3', default: '5-star Red Sea beachfront resort in Hurghada (All-Inclusive)' },
  { key: 'honeymooners.inc4', default: 'All domestic flights within Egypt (Cairo - Luxor / Aswan - Hurghada / Hurghada - Cairo)' },
  { key: 'honeymooners.inc5', default: 'Private VIP air-conditioned transfers for all arrivals, departures & sightseeing' },
  { key: 'honeymooners.inc6', default: 'Professional licensed Egyptologist tour guide (English / Spanish / Portuguese / Arabic)' },
  { key: 'honeymooners.inc7', default: 'Entrance fees to all mentioned historical monuments and temples' },
  { key: 'honeymooners.inc8', default: 'Special honeymoon surprises: welcome flowers, romantic room setup & celebration cake' },
  { key: 'honeymooners.inc9', default: '24/7 dedicated concierge service & local assistance throughout your stay' }
];

const EXCLUDES_LIST = [
  { key: 'honeymooners.exc1', default: 'International round-trip flights to/from Egypt' },
  { key: 'honeymooners.exc2', default: 'Egypt entry visa upon arrival' },
  { key: 'honeymooners.exc3', default: 'Optional excursions (e.g. Luxor Hot Air Balloon, Abu Simbel tour, Hurghada Diving)' },
  { key: 'honeymooners.exc4', default: 'Personal expenses, laundry, telephone calls, and beverages outside meal plans' },
  { key: 'honeymooners.exc5', default: 'Gratuities and tipping for guides, drivers, and cruise staff' }
];

export default function HoneymoonersDetails() {
  const { t } = useTranslation();
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const egyptTitle = t('honeymooners.egyptTitle', 'Honeymoon in Egypt');
  const durationText = t('honeymooners.statDuration', '10 Days / 09 Nights');
  const programTypeText = t('honeymooners.statType', 'Couples & Honeymoon');
  const minPaxText = t('honeymooners.statPax', '2 Persons (Couples)');
  const destinationText = t('honeymooners.statDest', 'Egypt (Cairo • Nile • Hurghada)');
  const codeText = t('honeymooners.statCode', 'EGY-HNM-10D');

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen text-start">
      <Helmet>
        <title>{`${egyptTitle} | Dunas Travel`}</title>
        <meta
          name="description"
          content={t(
            'honeymooners.egyptTagline',
            'A perfect trip to celebrate love, combining history, culture, romance, and unforgettable moments on the Red Sea.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('honeymooners.badgeLuxury', '💍 رحلات شهر العسل الملكية • EGY-HNM-10D')}
        title={egyptTitle}
        subtitle={`${durationText} • Cairo • Nile Cruise • Hurghada`}
        bgImage={HONEYMOON_IMAGES[activeImageIndex || 0]}
        onImageClick={() => setActiveImageIndex(0)}
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 uppercase tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <Link to="/destinations/egypt" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('dest.egypt.title', 'Egypt')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <Link to="/programs/honeymooners" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('honeymooners.title', 'Honeymooners Package')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <span className="text-ivory-300 truncate max-w-[220px] md:max-w-none">{egyptTitle}</span>
          </div>
        }
        primaryCta={null}
        secondaryCta={null}
      />

      {/* Key Stats Bar (Quick Info Bar) */}
      <div className="container mx-auto px-6 mt-6 relative z-20">
        <div className="bg-gradient-to-r from-amber-50 via-orange-100/70 to-amber-50 dark:bg-[#07163c] rounded-2xl shadow-card dark:shadow-[0_10px_35px_rgba(0,0,0,0.7)] overflow-hidden border-2 border-gold-500/70 dark:border-gold-500/40">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-gold-600/30 dark:divide-gold-500/30 bg-transparent dark:bg-[#07163c]">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-amber-800 dark:text-gold-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">
                {t('tour.duration', 'Duration')}
              </span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">
                {durationText}
              </span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaHeart className="text-rose-600 dark:text-rose-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">
                {t('tour.tourType', 'Program')}
              </span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">
                {programTypeText}
              </span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-amber-800 dark:text-gold-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">
                {t('tour.minPax', 'Min Pax')}
              </span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">
                {minPaxText}
              </span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaMapMarkerAlt className="text-amber-800 dark:text-gold-400 text-2xl mb-1 filter drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
              <span className="text-caption text-black dark:text-gold-300/90 font-black uppercase tracking-wider text-xs">
                {t('tour.destination', 'Destination')}
              </span>
              <span className="text-body-md font-black text-black dark:text-white text-base md:text-lg">
                {destinationText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview Section */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/60 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] p-6 md:p-8 rounded-2xl border-2 border-gold-500/80 dark:border-gold-500/70 shadow-lg dark:shadow-[0_14px_45px_rgba(0,0,0,0.85)]">
                <div className="flex items-center gap-3.5 mb-5 pb-3.5 border-b-2 border-gold-500/30 dark:border-gold-500/40">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-600 dark:from-amber-300 dark:via-gold-400 dark:to-amber-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,166,35,0.45)] shrink-0 font-black">
                    <FaCompass className="text-2xl text-slate-950" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-amber-100/90 dark:bg-gold-500/25 text-amber-900 dark:text-gold-300 text-[11px] sm:text-xs font-black uppercase tracking-wider rtl:tracking-normal border border-amber-300/60 dark:border-gold-400/50 mb-1 shadow-sm font-sans">
                      {t('tourDetail.aboutTourTag', 'TRIP DISCOVERY')}
                    </span>
                    <h2
                      className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-[#FFE066] dark:drop-shadow-[0_2px_12px_rgba(255,224,102,0.45)] font-display tracking-tight"
                      style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                    >
                      {t('tourDetail.overview', 'Overview')}
                    </h2>
                  </div>
                </div>
                <p className="text-body-lg text-slate-800 dark:text-slate-100 font-semibold leading-relaxed whitespace-pre-line text-base md:text-lg">
                  {t(
                    'honeymooners.overviewDesc',
                    'A perfect trip to celebrate your love, combining the grandeur of ancient Egypt with the serene beauty of the Red Sea. From the majestic Pyramids of Giza to the tranquil beaches of Hurghada, every moment is designed for romance and discovery. Sail the timeless Nile, explore magnificent temples, and relax in luxury resorts — all crafted to create unforgettable memories for you and your loved one.'
                  )}
                </p>
              </div>
            </motion.div>

            {/* Key Highlights (Curated Experiences) */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="inline-flex items-center gap-3.5 mb-6 pb-3.5 border-b-2 border-gold-500/30 dark:border-gold-500/40 w-fit max-w-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-600 dark:from-amber-300 dark:via-gold-400 dark:to-amber-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,166,35,0.45)] shrink-0 font-black">
                  <FaStar className="text-2xl text-slate-950" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-md bg-amber-100/90 dark:bg-gold-500/25 text-amber-900 dark:text-gold-300 text-[11px] sm:text-xs font-black uppercase tracking-wider rtl:tracking-normal border border-amber-300/60 dark:border-gold-400/50 mb-1 shadow-sm font-sans">
                    {t('tourDetail.curatedHighlightsTag', 'CURATED EXPERIENCES')}
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-[#FFE066] dark:drop-shadow-[0_2px_12px_rgba(255,224,102,0.45)] font-display tracking-tight"
                    style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                  >
                    {t('tourDetail.highlights', 'Key Highlights')}
                  </h2>
                </div>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CURATED_HIGHLIGHTS.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 bg-gradient-to-br from-amber-50 via-orange-50/80 to-amber-100/50 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] p-5 rounded-2xl shadow-md border-2 border-gold-500/70 dark:border-gold-500/70 hover:border-gold-500 dark:hover:border-gold-400 transition-all h-full"
                  >
                    <FaCheckCircle className="text-amber-800 dark:text-gold-400 text-lg mt-0.5 shrink-0 filter drop-shadow-[0_0_5px_rgba(245,166,35,0.4)]" />
                    <span className="text-body-sm font-bold text-slate-900 dark:text-white text-sm md:text-base leading-relaxed">
                      {t(item.key, item.default)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Day-by-Day Itinerary Section */}
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
                  <span className="text-amber-900 dark:text-gold-300 uppercase tracking-[4px] rtl:tracking-normal font-black text-xs sm:text-sm">
                    {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                  </span>
                </div>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)] font-display tracking-tight"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
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
                <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400 dark:bg-gold-500 shadow-[0_0_12px_rgba(245,166,35,0.6)]" />
                <div className="space-y-6">
                  {HONEYMOON_ITINERARY.map((day) => (
                    <div
                      key={day.day}
                      className="relative pl-12 rtl:pl-0 rtl:pr-12 md:pl-14 md:rtl:pr-14"
                    >
                      {/* Timeline Step Circle */}
                      <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-9 h-9 rounded-full bg-gold-500 dark:bg-gold-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-[0_0_15px_rgba(245,166,35,0.7)] border-2 border-gold-200 dark:border-gold-100 z-10">
                        {day.day}
                      </div>

                      {/* Day Card Box */}
                      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/60 dark:bg-gradient-to-br dark:from-[#0b1d4b] dark:via-[#0e245e] dark:to-[#112c72] rounded-2xl p-6 md:p-7 border-2 border-gold-500/80 dark:border-gold-500/70 hover:border-gold-600 dark:hover:border-gold-400 shadow-[0_10px_30px_rgba(245,166,35,0.25)] dark:shadow-[0_14px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(245,166,35,0.2)] transition-all duration-300">
                        <div className="flex flex-wrap items-center gap-3 mb-3.5 pb-2.5 border-b border-gold-600/30 dark:border-gold-500/30">
                          <span className="font-black text-amber-900 dark:text-gold-400 text-base md:text-xl tracking-wide font-display">
                            {formatDayLabel(t(day.titleKey, day.titleDefault) || day.titleDefault || '', day.day, t)}
                          </span>
                          {day.mealsKey && (
                            <span className="text-caption font-black text-black dark:text-gold-300 flex items-center gap-1.5 ml-auto rtl:ml-0 rtl:mr-auto text-xs bg-gold-500/30 dark:bg-gold-500/25 px-3.5 py-1.5 rounded-full border border-gold-600/50 shadow-sm">
                              <FaUtensils className="text-amber-900 dark:text-gold-400 text-sm" />{' '}
                              {t(day.mealsKey, day.mealsDefault)}
                            </span>
                          )}
                        </div>

                        <p className="text-body-sm text-black dark:text-slate-100 font-bold leading-relaxed text-sm md:text-base whitespace-pre-line">
                          {t(day.descKey, day.descDefault)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Inclusions & Exclusions Section */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="mb-8 relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-gold-500/25 border border-amber-300/70 dark:border-gold-400/50 mb-3 shadow-sm">
                  <FaShieldAlt className="text-amber-800 dark:text-gold-300 text-xs" />
                  <span className="text-amber-900 dark:text-gold-300 uppercase tracking-[4px] rtl:tracking-normal font-black text-xs">
                    {t('tourDetail.details', 'TOUR SPECIFICATIONS')}
                  </span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)] font-display font-black tracking-tight"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('tourDetail.incExc', "What's Included & Excluded")}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-24 h-1.5 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 dark:from-gold-400 dark:to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,166,35,0.6)]" />
                  <div className="w-2 h-2 rounded-full bg-gold-500 dark:bg-gold-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What is Included */}
                <div className="bg-gradient-to-br from-emerald-100/90 via-amber-100/80 to-emerald-100/70 dark:bg-gradient-to-br dark:from-[#042d1c] dark:via-[#063d26] dark:to-[#084d30] p-6 md:p-8 rounded-2xl border-2 border-emerald-500/70 dark:border-emerald-400/80 shadow-md">
                  <h3
                    className="text-display-md text-xl font-black text-black dark:text-emerald-300 mb-6 flex items-center gap-2.5 font-display"
                    style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                  >
                    <FaCheckCircle className="text-emerald-700 dark:text-emerald-400 flex-shrink-0 text-2xl" />
                    {t('tourDetail.included', 'What is Included')}
                  </h3>
                  <ul className="flex flex-col gap-3.5">
                    {INCLUDES_LIST.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-body-md text-black dark:text-emerald-50 font-extrabold text-sm md:text-base"
                      >
                        <FaCheck className="text-emerald-700 dark:text-emerald-400 mt-1 flex-shrink-0 text-base font-black" />
                        <span className="leading-relaxed">{t(item.key, item.default)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What is Excluded */}
                <div className="bg-gradient-to-br from-rose-100/90 via-orange-100/80 to-rose-100/70 dark:bg-gradient-to-br dark:from-[#320a14] dark:via-[#420d1a] dark:to-[#541122] p-6 md:p-8 rounded-2xl border-2 border-rose-500/70 dark:border-rose-400/80 shadow-md">
                  <h3
                    className="text-display-md text-xl font-black text-black dark:text-rose-300 mb-6 flex items-center gap-2.5 font-display"
                    style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                  >
                    <FaTimes className="text-rose-700 dark:text-rose-400 flex-shrink-0 text-2xl" />
                    {t('tourDetail.excluded', 'What is Excluded')}
                  </h3>
                  <ul className="flex flex-col gap-3.5">
                    {EXCLUDES_LIST.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-body-md text-black dark:text-rose-50 font-extrabold text-sm md:text-base"
                      >
                        <FaTimes className="text-rose-700 dark:text-rose-400 mt-1 flex-shrink-0 text-base font-black" />
                        <span className="leading-relaxed">{t(item.key, item.default)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Route Map */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
            >
              <RouteMap itinerary={HONEYMOON_ITINERARY} tourTitle={egyptTitle} />
            </motion.div>

            {/* Romantic Call to Action Banner */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 dark:from-[#2a1a2e] dark:via-[#1e1435] dark:to-[#1a1a30] rounded-3xl p-8 md:p-12 shadow-xl border-2 border-rose-300/80 dark:border-rose-800/60">
                <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                  <FaHeart className="text-rose-500 text-3xl animate-pulse" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4"
                  style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
                >
                  {t('honeymooners.ctaTitle', 'Ready to Celebrate Your Love?')}
                </h3>
                <p className="text-body-md text-slate-700 dark:text-slate-200 mb-8 max-w-xl mx-auto font-medium text-base md:text-lg leading-relaxed">
                  {t(
                    'honeymooners.ctaDesc',
                    'Let our expert travel designers craft the perfect romantic getaway tailored just for you.'
                  )}
                </p>
                <Link
                  to="/tailor-a-tour"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white font-black px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base md:text-lg"
                >
                  <FaHeart className="text-rose-200" />
                  <span>{t('honeymooners.ctaBtn', 'Start Planning Your Honeymoon')}</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Advanced Booking Component Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 self-start z-30">
              <AdvancedBooking
                tourTitle={egyptTitle}
                durationDays={10}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Social Proof Section */}
      <section className="mt-20">
        <ReviewsMap />
      </section>

      {/* Suggested Tours Strip */}
      <section className="mt-8">
        <SuggestedTours currentDestination="egypt" currentSlug="honeymoon-egypt" />
      </section>

      {/* Gallery Modal Lightbox */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 text-white text-2xl p-3 rounded-full bg-white/10 hover:bg-white/20 hover:text-gold-400 transition-colors"
              aria-label="Close image gallery"
            >
              <FaTimes />
            </button>
            <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-white/20">
              <img
                src={HONEYMOON_IMAGES[activeImageIndex] || HONEYMOON_IMAGES[0]}
                alt={egyptTitle}
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
