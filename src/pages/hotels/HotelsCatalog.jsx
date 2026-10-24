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
    return Array.isArray(apiHotels) ? apiHotels : [];
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
        primaryCta={null}
        secondaryCta={null}
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
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:from-obsidian-800 dark:via-obsidian-800 dark:to-obsidian-900 dark:shadow-black/40 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-12 md:gap-4">
            {/* Search */}
            <div className="md:col-span-5">
              <label
                htmlFor="hotel-search"
                className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
              >
                <FaSearch className="text-gold-500" />
                {t('common.search', 'Search')}
              </label>
              <div className="relative">
                <FaSearch className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gold-500 rtl:left-auto rtl:right-4" />
                <input
                  id="hotel-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('hotelsCatalog.searchPlaceholder', 'Search by hotel name or city...')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-gold-500 focus:bg-white focus:ring-2 focus:ring-gold-500/25 dark:border-white/10 dark:bg-obsidian-900/80 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-obsidian-900 rtl:pl-4 rtl:pr-11"
                />
              </div>
            </div>

            {/* Destinations */}
            <div className="md:col-span-4">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <FaMapMarkerAlt className="text-gold-500" />
                {t('nav.destinations', 'Destinations')}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDestination('all')}
                  className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-3.5 py-2 text-[11px] font-bold tracking-wide capitalize transition-all duration-200 ${
                    selectedDestination === 'all'
                      ? 'border-gold-500/80 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-slate-950 shadow-md shadow-gold-500/25 ring-1 ring-inset ring-white/30'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-gold-400/70 hover:bg-gold-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:border-gold-400/60 dark:hover:bg-gold-500/10 dark:hover:text-white'
                  }`}
                >
                  {t('hotelsCatalog.allDestinations', 'All Destinations')}
                </button>
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setSelectedDestination(dest)}
                    className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-3.5 py-2 text-[11px] font-bold tracking-wide capitalize transition-all duration-200 ${
                      selectedDestination === dest
                        ? 'border-gold-500/80 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-slate-950 shadow-md shadow-gold-500/25 ring-1 ring-inset ring-white/30'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-gold-400/70 hover:bg-gold-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:border-gold-400/60 dark:hover:bg-gold-500/10 dark:hover:text-white'
                    }`}
                  >
                    {dest.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div className="md:col-span-3">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:justify-end">
                <FaStar className="text-gold-500" />
                {t('hotel.room.ratingLabel', 'Rating')}
              </p>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {['all', '5', '4', '3'].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setSelectedStars(starVal)}
                    className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border px-3.5 py-2 text-[11px] font-bold transition-all duration-200 ${
                      selectedStars === starVal
                        ? 'border-gold-500/80 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-slate-950 shadow-md shadow-gold-500/25 ring-1 ring-inset ring-white/30'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-gold-400/70 hover:bg-gold-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:border-gold-400/60 dark:hover:bg-gold-500/10 dark:hover:text-white'
                    }`}
                  >
                    {starVal === 'all' ? (
                      <span className="flex items-center gap-1">
                        <span>{t('hotelsCatalog.allStars', 'All').replace(/[★⭐]/g, '').trim()}</span>
                        <FaStar
                          className={`text-[10px] ${
                            selectedStars === starVal
                              ? 'text-slate-950'
                              : 'text-amber-500 dark:text-amber-400'
                          }`}
                        />
                      </span>
                    ) : (
                      <>
                        <span>{starVal}</span>
                        <FaStar
                          className={`text-[10px] ${
                            selectedStars === starVal
                              ? 'text-slate-950'
                              : 'text-amber-500 dark:text-amber-400'
                          }`}
                        />
                      </>
                    )}
                  </button>
                ))}
              </div>
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
              const pricedRooms = rooms.filter(
                (r) => String(r.priceDisplayMode || 'PRICE').toUpperCase() === 'PRICE',
              );
              const fallbackStartingPrice =
                rooms.length === 0 && Number(hotel.pricePerNight) > 0
                  ? Number(hotel.pricePerNight)
                  : Infinity;
              const lowestRoomPrice = pricedRooms.reduce((min, r) => {
                const rate = Number(r.ratePerNight);
                return rate > 0 && rate < min ? rate : min;
              }, fallbackStartingPrice);
              const startingPrice = Number.isFinite(lowestRoomPrice) ? lowestRoomPrice : 0;
              const roomCustomLabel = rooms
                .map((r) => (typeof r.priceLabel === 'string' ? r.priceLabel.trim() : ''))
                .find(Boolean) || '';
              const startingDisplay =
                startingPrice > 0
                  ? formatPrice(startingPrice)
                  : roomCustomLabel
                  ? roomCustomLabel
                  : isAr
                  ? 'عند الطلب'
                  : t('common.onRequest', 'On Request');

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
                            {rooms.slice(0, 3).map((room) => {
                              const roomMode = String(room.priceDisplayMode || 'PRICE').toUpperCase();
                              const roomLabel = typeof room.priceLabel === 'string' ? room.priceLabel.trim() : '';
                              return (
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
                                  {roomMode === 'CUSTOM_LABEL' ? (
                                    <span className="font-bold text-gold-600 dark:text-gold-400">
                                      {roomLabel || t('common.onRequest', 'On Request')}
                                    </span>
                                  ) : roomMode === 'PRICE' && Number(room.ratePerNight) > 0 ? (
                                    <span className="font-bold text-gold-600 dark:text-gold-400">
                                      {formatPrice(Number(room.ratePerNight))}
                                    </span>
                                  ) : null}
                                </span>
                              </Link>
                              );
                            })}
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
                        {startingDisplay}
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
