import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaSearch,
  FaCalendarAlt,
  FaChevronRight,
  FaHotel,
  FaUserFriends,
} from 'react-icons/fa';
import { useHotels, useSeasons } from '../../hooks/useHotels';
import { useCurrency } from '../../context/CurrencyContext';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import SEOHead from '../../components/seo/SEOHead';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import Button from '../../components/ui/Button';
import { fadeInUp } from '../../animations/variants';

const FALLBACK_HOTELS = [
  {
    id: 'sol-pyramid-hotel-fallback',
    slug: 'sol-pyramid-hotel',
    name: 'Sol Pyramid Hotel',
    destinationSlug: 'egypt',
    city: 'Giza',
    address: '05 Rawdet al Ahram, Haram, Giza, Egypt',
    stars: 5,
    heroImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
    pricePerNight: 75,
    currency: 'USD',
    description:
      'Steps away from the Great Pyramids of Giza with panoramic rooftop views, 100% Egyptian cotton linen, and bespoke luxury hospitality.',
    rooms: [
      { id: 'r1', slug: 'single-room', name: 'Single Room', maxOccupancy: 1, bedType: '1 Single Bed', ratePerNight: 75, seasonPricings: [] },
      { id: 'r2', slug: 'double-room', name: 'Double Room (Pyramids View)', maxOccupancy: 2, bedType: '1 King Bed', ratePerNight: 95, seasonPricings: [] },
      { id: 'r3', slug: 'executive-suite', name: 'Executive Suite', maxOccupancy: 3, bedType: '1 King Bed + Lounge', ratePerNight: 190, seasonPricings: [] },
    ],
  },
];

const HotelsCatalog = () => {
  const { t, i18n } = useTranslation();
  const isAr = (i18n.language || '').startsWith('ar');
  const { formatPrice } = useCurrency();
  const { hotels: apiHotels, loading } = useHotels({ limit: 50 });
  const { seasons } = useSeasons();

  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedStars, setSelectedStars] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allHotels = useMemo(() => {
    if (Array.isArray(apiHotels) && apiHotels.length > 0) {
      return apiHotels;
    }
    return FALLBACK_HOTELS;
  }, [apiHotels]);

  const destinations = useMemo(() => {
    const set = new Set();
    allHotels.forEach((h) => {
      if (h.destinationSlug) set.add(h.destinationSlug.toLowerCase());
    });
    return Array.from(set);
  }, [allHotels]);

  const filteredHotels = useMemo(() => {
    return allHotels.filter((hotel) => {
      const matchesDest =
        selectedDestination === 'all' ||
        (hotel.destinationSlug || '').toLowerCase() === selectedDestination;
      const matchesStars =
        selectedStars === 'all' || Number(hotel.stars || 5) === Number(selectedStars);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (hotel.name || '').toLowerCase().includes(q) ||
        (hotel.city || '').toLowerCase().includes(q) ||
        (hotel.description || '').toLowerCase().includes(q);
      return matchesDest && matchesStars && matchesSearch;
    });
  }, [allHotels, selectedDestination, selectedStars, searchQuery]);

  return (
    <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 min-h-screen pb-24 text-start">
      <SEOHead
        title={t('hotelsCatalog.seoTitle', 'Luxury Partner Hotels & Resorts | Dunas Travel')}
        description={t(
          'hotelsCatalog.seoDesc',
          'Explore Dunas Travel handpicked 5-star and boutique partner hotels across Egypt, Jordan, Dubai, and Turkey with seasonal room rates and direct reservation.'
        )}
      />

      <LuxuryHeroSection
        badge={t('hotelsCatalog.badge', 'HANDPICKED HOSPITALITY')}
        title={t('hotelsCatalog.title', 'Luxury Hotels & Resorts')}
        subtitle={t(
          'hotelsCatalog.subtitle',
          'Curated sanctuaries featuring iconic views, refined suites, and transparent seasonal pricing.'
        )}
        bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920"
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl-flip">
              <FaChevronRight className="text-[10px]" />
            </span>
            <span className="text-ivory-300">{t('hotelsCatalog.breadcrumb', 'Hotels')}</span>
          </div>
        }
      />

      <div className="container mx-auto px-6 max-w-6xl -mt-10 relative z-20">
        {/* Filter Bar */}
        <div className="bg-white dark:bg-obsidian-800 rounded-2xl shadow-xl border border-gold-500/30 p-5 md:p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 relative">
              <FaSearch className="w-4 h-4 text-gold-500 absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hotelsCatalog.searchPlaceholder', 'Search by hotel name or city...')}
                className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-obsidian-700 text-sm text-slate-900 dark:text-white outline-none focus:border-gold-500"
              />
            </div>

            <div className="md:col-span-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedDestination('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedDestination === 'all'
                    ? 'bg-gold-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 hover:border-gold-500/50 border border-transparent'
                }`}
              >
                {t('hotelsCatalog.allDestinations', 'All Destinations')}
              </button>
              {destinations.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-gold-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 hover:border-gold-500/50 border border-transparent'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-1.5">
              {['all', '5', '4', '3'].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setSelectedStars(starVal)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedStars === starVal
                      ? 'bg-slate-900 dark:bg-gold-500 text-gold-400 dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {starVal === 'all' ? (
                    t('hotelsCatalog.allStars', 'All ★')
                  ) : (
                    <>
                      <span>{starVal}</span>
                      <FaStar className="text-amber-400 dark:text-current text-[10px]" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Seasons Overview Banner */}
        {Array.isArray(seasons) && seasons.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-10 bg-gradient-to-r from-slate-900 via-[#0c1f4a] to-slate-900 text-white rounded-2xl p-5 md:p-6 border border-gold-500/30 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400 flex items-center gap-1.5 mb-1">
                  <FaCalendarAlt /> {t('hotelsCatalog.seasonalCalendar', 'Official Seasonal Rate Periods')}
                </span>
                <p className="text-xs text-slate-300">
                  {t(
                    'hotelsCatalog.seasonalCalendarDesc',
                    'Room rates automatically adjust based on our official Low, Shoulder, High, and Peak travel seasons.'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {seasons.map((season) => (
                  <div
                    key={season.id}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-gold-500/30 text-xs flex items-center gap-2"
                  >
                    <span className="font-bold text-gold-400">{season.name}</span>
                    <span className="text-[11px] text-slate-300 font-mono">
                      {String(season.startDate).slice(0, 10)} → {String(season.endDate).slice(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hotels Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonLoader count={3} type="card" />
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="bg-white dark:bg-obsidian-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-obsidian-700 space-y-4">
            <FaHotel className="text-4xl text-gold-500 mx-auto" />
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              {t('hotelsCatalog.noHotelsTitle', 'No matching hotels found')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-300 max-w-md mx-auto">
              {t('hotelsCatalog.noHotelsDesc', 'Try clearing your search or selecting another destination filter.')}
            </p>
            <Button
              variant="outline-gold"
              onClick={() => {
                setSelectedDestination('all');
                setSelectedStars('all');
                setSearchQuery('');
              }}
            >
              {t('hotelsCatalog.resetFilters', 'Reset Filters')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => {
              const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
              const lowestRoomPrice = rooms.reduce((min, r) => {
                const rate = Number(r.ratePerNight);
                return rate > 0 && rate < min ? rate : min;
              }, Number(hotel.pricePerNight) > 0 ? Number(hotel.pricePerNight) : Infinity);
              const startingPrice = Number.isFinite(lowestRoomPrice) ? lowestRoomPrice : 0;

              return (
                <motion.article
                  key={hotel.id || hotel.slug}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white dark:bg-obsidian-800 rounded-2xl overflow-hidden shadow-md border border-slate-200/70 dark:border-obsidian-700 flex flex-col justify-between group hover:border-gold-500/60 transition-all duration-300"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-900">
                      <img
                        src={
                          hotel.heroImageUrl ||
                          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'
                        }
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-1 bg-slate-950/85 backdrop-blur-sm text-gold-400 px-3 py-1 rounded-full text-xs font-bold border border-gold-500/30">
                        {Array.from({ length: Math.min(Math.max(Number(hotel.stars) || 5, 1), 5) }).map((_, i) => (
                          <FaStar key={i} className="text-[11px]" />
                        ))}
                      </div>
                      {hotel.city && (
                        <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 text-white text-xs font-semibold flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-gold-400" />
                          <span>
                            {hotel.city}
                            {hotel.destinationSlug ? ` • ${hotel.destinationSlug.toUpperCase()}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                        {hotel.name}
                      </h2>
                      {hotel.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {hotel.description}
                        </p>
                      )}

                      {rooms.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-obsidian-700 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300 block">
                            {t('hotelsCatalog.availableRooms', 'Room Categories')} ({rooms.length})
                          </span>
                          <div className="space-y-1.5">
                            {rooms.slice(0, 3).map((room) => (
                              <Link
                                key={room.id || room.slug}
                                to={`/hotels/${hotel.slug}/${room.slug}`}
                                className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-obsidian-900/60 hover:bg-amber-50/70 dark:hover:bg-obsidian-700 transition-colors"
                              >
                                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                                  <FaBed className="text-gold-500 shrink-0" />
                                  <span className="truncate">{room.name}</span>
                                </span>
                                <span className="flex items-center gap-2 shrink-0">
                                  <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                                    <FaUserFriends className="text-[10px]" /> {room.maxOccupancy || 2}
                                  </span>
                                  {Number(room.ratePerNight) > 0 && (
                                    <span className="font-bold text-gold-600 dark:text-gold-400">
                                      {formatPrice(Number(room.ratePerNight))}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-obsidian-900/50 border-t border-slate-100 dark:border-obsidian-700 flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        {t('tourCard.startingFrom', 'Rooms From')}
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {startingPrice > 0
                          ? formatPrice(startingPrice)
                          : isAr
                          ? 'عند الطلب'
                          : t('common.onRequest', 'On Request')}
                        {startingPrice > 0 && (
                          <span className="text-xs font-normal text-slate-400">
                            {' '}
                            / {t('hotel.night', 'night')}
                          </span>
                        )}
                      </span>
                    </div>

                    <Link to={`/hotels/${hotel.slug}`}>
                      <Button variant="outline-gold" className="px-4 py-2 text-xs uppercase font-bold">
                        {t('hotelsCatalog.exploreHotel', 'Explore Hotel')}
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsCatalog;
