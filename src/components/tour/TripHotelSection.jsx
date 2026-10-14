import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHotel, FaStar, FaMapMarkerAlt, FaBed, FaUsers, FaCalendarAlt,
  FaImages, FaCheckCircle, FaChevronRight, FaWifi, FaSwimmingPool,
  FaSpa, FaConciergeBell, FaUtensils, FaClock, FaShieldAlt, FaLock,
  FaInfoCircle, FaSearchPlus, FaTimes
} from 'react-icons/fa';
import { resolveLocalizedText } from '../../utils/titleHelper';

const FALLBACK_HOTEL_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200';

const getAmenityIcon = (name = '') => {
  const lower = String(name).toLowerCase();
  if (lower.includes('wifi') || lower.includes('واي فاي') || lower.includes('انترنت')) return <FaWifi className="text-amber-500 shrink-0" />;
  if (lower.includes('pool') || lower.includes('مسبح') || lower.includes('حمام سباحة')) return <FaSwimmingPool className="text-amber-500 shrink-0" />;
  if (lower.includes('spa') || lower.includes('سبا') || lower.includes('نادي صحي') || lower.includes('wellness')) return <FaSpa className="text-amber-500 shrink-0" />;
  if (lower.includes('concierge') || lower.includes('كونسيرج') || lower.includes('استقبال')) return <FaConciergeBell className="text-amber-500 shrink-0" />;
  if (lower.includes('dining') || lower.includes('restaurant') || lower.includes('مطعم') || lower.includes('وجبات')) return <FaUtensils className="text-amber-500 shrink-0" />;
  return <FaCheckCircle className="text-amber-500 shrink-0 text-xs" />;
};

export default function TripHotelSection({
  tour,
  assignedAccommodations = [],
  accommodationSummary = '',
  destinationName = '',
  t,
  lang = 'en',
  formatPrice,
  onOpenGlobalLightbox,
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);

  const tripHotel = tour?.tripHotel || null;
  const isTripDedicated = Boolean(tripHotel && tripHotel.id);

  // If dedicated trip hotel exists, resolve its primary assets
  const hotelName = tripHotel
    ? (resolveLocalizedText(tripHotel.nameJsonb || tripHotel.name, t, lang) || 'Luxury Private Hotel')
    : null;
  const hotelDesc = tripHotel
    ? (resolveLocalizedText(tripHotel.descriptionJsonb || tripHotel.description, t, lang) || '')
    : '';
  const hotelStars = Number(tripHotel?.stars ?? tripHotel?.starRating ?? 5);
  const hotelCity = resolveLocalizedText(tripHotel?.city || tour?.destination || destinationName || 'Egypt', t, lang);
  const heroImage = tripHotel?.heroImageUrl || (Array.isArray(tripHotel?.images) && tripHotel.images[0]?.url) || FALLBACK_HOTEL_IMG;

  const galleryList = Array.isArray(tripHotel?.images) && tripHotel.images.length > 0
    ? tripHotel.images.map(img => typeof img === 'string' ? img : (img.imageUrl || img.url)).filter(Boolean)
    : [heroImage];

  const rawAmenities = tripHotel?.amenities?.features || tripHotel?.amenitiesJsonb?.features || [];
  const amenitiesList = Array.isArray(rawAmenities)
    ? rawAmenities
    : (typeof rawAmenities === 'object' && rawAmenities !== null ? Object.values(rawAmenities) : []);

  const policies = tripHotel?.policies || tripHotel?.policiesJsonb || {};
  const roomsList = Array.isArray(tripHotel?.rooms) ? tripHotel.rooms : [];

  // Hotel rate sheet (6 columns) derived from dashboard-entered data.
  // A column is rendered only when at least one row carries a value for it,
  // so nothing appears in the storefront before it was entered in the dashboard.
  const rateSheetRows = (Array.isArray(assignedAccommodations) ? assignedAccommodations : [])
    .filter((acc) => acc && typeof acc === 'object')
    .map((acc, idx) => {
      const hotelObj = acc.hotel || {};
      const roomObj = acc.room || null;
      const hName = resolveLocalizedText(
        acc.nameJsonb || acc.hotelName || hotelObj.nameJsonb || hotelObj.name,
        t,
        lang
      ) || '';
      const city = resolveLocalizedText(
        acc.cityJsonb || acc.city || hotelObj.city || acc.destination || destinationName,
        t,
        lang
      ) || '';
      const categoryTier = String(acc.categoryTier || acc.category || '').trim();
      const toAmount = (value) => {
        const numeric = Number(value);
        return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
      };
      const doublePrice = toAmount(acc.doubleRoomPriceUsd ?? acc.doubleRoomPrice);
      const singlePrice = toAmount(acc.singleRoomPriceUsd ?? acc.singleRoomPrice);
      const seasonFee = toAmount(
        acc.seasonSupplementUsd ?? acc.seasonSupplement ?? acc.priceSupplementUsd ?? acc.priceSupplement
      );
      const boatName = resolveLocalizedText(acc.boatJsonb || acc.boatName, t, lang) || '';
      const boatPrice = toAmount(acc.boatPriceUsd ?? acc.boatPrice);
      const roomRate = toAmount(roomObj?.ratePerNight ?? roomObj?.basePriceUsd);
      return {
        acc,
        idx,
        hName,
        city,
        categoryTier,
        doublePrice,
        singlePrice,
        seasonFee,
        boatName,
        boatPrice,
        roomRate,
        hotelSlug: hotelObj.slug || null,
        roomSlug: roomObj?.slug || null,
        isGlobal: hotelObj.isGlobal !== false,
      };
    });

  const rateSheetColumns = {
    category: rateSheetRows.some((r) => Boolean(r.categoryTier)),
    hotelCity: rateSheetRows.some((r) => Boolean(r.hName || r.city)),
    double: rateSheetRows.some((r) => r.doublePrice > 0),
    single: rateSheetRows.some((r) => r.singlePrice > 0),
    season: rateSheetRows.some((r) => r.seasonFee > 0),
    boat: rateSheetRows.some((r) => Boolean(r.boatName) || r.boatPrice > 0),
  };
  const hasRateSheet =
    rateSheetColumns.category ||
    rateSheetColumns.double ||
    rateSheetColumns.single ||
    rateSheetColumns.season ||
    rateSheetColumns.boat;

  const categoryTierLabel = (tier) => {
    // Only map the legacy enum codes to localized labels; a manually-typed
    // category (free text entered in the dashboard) is shown exactly as typed.
    const key = String(tier || '').trim().toUpperCase();
    switch (key) {
      case '5_STAR':
      case '5_STARS':
        return t('hotelTable.category5Star', '5-Star Luxury');
      case '4_STAR':
      case '4_STARS':
        return t('hotelTable.category4Star', '4-Star Superior');
      case '3_STAR':
      case '3_STARS':
        return t('hotelTable.category3Star', '3-Star Comfort');
      case 'VIP':
        return t('hotelTable.categoryVip', 'Royal VIP');
      case 'CRUISE':
        return t('hotelTable.categoryCruise', 'Nile Cruise');
      case 'LUXURY':
      case 'LUX':
        return t('hotelTable.categoryLuxury', 'Luxury');
      default:
        return tier;
    }
  };

  const handleOpenPhoto = (idx) => {
    if (onOpenGlobalLightbox) {
      onOpenGlobalLightbox(idx);
    } else {
      setSelectedPhotoIndex(idx);
    }
  };

  return (
    <section className="relative mt-20 mb-12">
      {/* Background Frame with Subtle Gold Accent Border */}
      <div className="rounded-3xl border-2 border-gold-500/30 dark:border-gold-500/40 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 dark:from-[#07163c] dark:via-[#091c49] dark:to-[#07163c] shadow-xl dark:shadow-[0_16px_50px_rgba(0,0,0,0.7)] overflow-hidden">

        {/* Section Header */}
        <div className="px-6 md:px-10 pt-10 pb-6 border-b border-gold-500/20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-gold-300 font-black text-xs uppercase tracking-widest">
                {isTripDedicated ? (
                  <>
                    <FaLock className="text-amber-600 dark:text-gold-400 text-[10px]" />
                    {t('tourDetail.tripDedicatedTag', 'EXCLUSIVE TRIP ACCOMMODATION')}
                  </>
                ) : (
                  <>
                    <FaHotel className="text-amber-600 dark:text-gold-400 text-xs" />
                    {t('tour.hotelCategory', 'ACCOMMODATION & HOSPITALITY')}
                  </>
                )}
              </span>
              {tour?.hotelCategory && (
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  • {resolveLocalizedText(tour.hotelCategory, t, lang)}
                </span>
              )}
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 font-display tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
            >
              <FaHotel className="text-gold-500 shrink-0" />
              {isTripDedicated
                ? hotelName
                : t('dest.greece.hotelsTitle', 'Handpicked Partner Hotels & Rooms')}
            </h2>

            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-medium max-w-3xl leading-relaxed">
              {isTripDedicated && hotelDesc
                ? hotelDesc
                : (accommodationSummary
                    ? resolveLocalizedText(accommodationSummary, t, lang)
                    : t('dest.greece.hotelsDesc', 'Subject to availability, accommodation is provided in our handpicked luxury partner hotels at each destination.'))}
            </p>
          </div>

          {!isTripDedicated && (
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-gold-400 hover:text-amber-900 dark:hover:text-gold-300 hover:underline shrink-0 pb-1"
            >
              <span>{t('hotelsCatalog.browseAll', 'Browse All Partner Hotels')}</span>
              <FaChevronRight className="rtl-flip text-[10px]" />
            </Link>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* VIEW A: DEDICATED TRIP-SPECIFIC HOTEL FULL SHOWCASE */}
        {/* ------------------------------------------------------------------ */}
        {isTripDedicated && (
          <div className="p-6 md:p-10 space-y-10">

            {/* 1. Hotel Meta Bar & Quick Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 dark:bg-[#040f2b]/80 border border-gold-500/30">
              <div className="flex flex-wrap items-center gap-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <FaMapMarkerAlt className="text-gold-500 text-sm shrink-0" />
                  <span>{hotelCity}</span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 text-gold-500 text-xs">
                  {Array.from({ length: Math.min(Math.max(hotelStars, 1), 5) }).map((_, sIdx) => (
                    <FaStar key={sIdx} />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 ml-1">
                    ({hotelStars} {t('hotel.stars', 'Stars')})
                  </span>
                </div>

                {/* Exclusive Ownership Tag */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-black">
                  <FaCheckCircle className="text-[10px]" />
                  {t('tourDetail.privateOwnership', 'Private & Reserved for Tour')}
                </span>
              </div>

              {/* Photos Count & Fullscreen trigger */}
              {galleryList.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenPhoto(0)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-gold-400 hover:underline cursor-pointer"
                >
                  <FaImages className="text-gold-500" />
                  <span>{t('tourDetail.viewAllPhotos', 'View Gallery')} ({galleryList.length})</span>
                </button>
              )}
            </div>

            {/* 2. Visual Hero & Multi-Photo Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {/* Primary Panoramic Hero */}
              <div
                onClick={() => handleOpenPhoto(0)}
                className="lg:col-span-2 relative min-h-[280px] md:min-h-[360px] rounded-2xl overflow-hidden cursor-pointer group border-2 border-gold-500/40 shadow-md bg-slate-900"
              >
                <img
                  src={heroImage}
                  alt={hotelName}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_HOTEL_IMG;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-4 left-4 right-4 rtl:left-4 rtl:right-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-display drop-shadow-md">
                      {hotelName}
                    </h3>
                    <p className="text-xs text-gold-300 font-semibold drop-shadow-sm">
                      📍 {hotelCity}
                    </p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-gold-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <FaSearchPlus className="text-base" />
                  </span>
                </div>
              </div>

              {/* Side Thumbnails */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {galleryList.slice(1, 3).map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    onClick={() => handleOpenPhoto(idx + 1)}
                    className="relative h-36 lg:h-[172px] rounded-2xl overflow-hidden cursor-pointer group border-2 border-gold-500/30 bg-slate-900 shadow-sm"
                  >
                    <img
                      src={imgUrl}
                      alt={`${hotelName} - ${idx + 2}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_HOTEL_IMG;
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                      <FaSearchPlus className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}

                {galleryList.length <= 1 && (
                  <div className="relative h-36 lg:h-[172px] rounded-2xl overflow-hidden border-2 border-gold-500/20 bg-amber-500/10 flex flex-col items-center justify-center text-center p-4">
                    <FaHotel className="text-3xl text-gold-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {hotelName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {t('tourDetail.exclusiveLodging', 'Exclusive Tour Lodging')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Amenities Chip Grid */}
            {amenitiesList.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-amber-900 dark:text-gold-400 flex items-center gap-2">
                  <FaStar className="text-gold-500 text-xs" />
                  {t('hotel.amenities', 'Hotel Amenities & Curated Perks')}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {amenitiesList.map((item, aIdx) => (
                    <span
                      key={aIdx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#040f2b] border border-gold-500/30 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xs hover:border-gold-500 transition-colors"
                    >
                      {getAmenityIcon(item)}
                      <span>{resolveLocalizedText(item, t, lang)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Hotel Policies Bar */}
            {(policies.checkIn || policies.checkOut || policies.cancellation) && (
              <div className="p-4 rounded-2xl bg-amber-100/50 dark:bg-[#040f2b]/60 border border-gold-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <FaClock className="text-gold-500 text-base shrink-0" />
                  <div className="flex flex-wrap items-center gap-4">
                    {policies.checkIn && (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        <strong className="text-amber-900 dark:text-gold-400">{t('hotel.checkIn', 'Check-In')}:</strong> {policies.checkIn}
                      </span>
                    )}
                    {policies.checkOut && (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        <strong className="text-amber-900 dark:text-gold-400">{t('hotel.checkOut', 'Check-Out')}:</strong> {policies.checkOut}
                      </span>
                    )}
                  </div>
                </div>

                {policies.cancellation && (
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <FaShieldAlt className="text-xs" />
                    <span>{resolveLocalizedText(policies.cancellation, t, lang)}</span>
                  </div>
                )}
              </div>
            )}

            {/* 5. Dedicated Rooms & Suites Section */}
            {roomsList.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 font-display">
                    <FaBed className="text-gold-500" />
                    {t('hotel.roomsAndSuites', 'Available Rooms & Suites for this Journey')}
                  </h4>
                  <span className="text-xs font-bold text-amber-800 dark:text-gold-400">
                    {roomsList.length} {t('hotel.roomTypes', 'Room Options')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {roomsList.map((room, rIdx) => {
                    const roomName = resolveLocalizedText(room.nameJsonb || room.name, t, lang) || `Suite ${rIdx + 1}`;
                    const roomRate = Number(room.ratePerNight ?? room.ratePerNightUsd ?? room.basePriceUsd ?? 0);
                    const bedType = room.roomType || resolveLocalizedText(room.bedType, t, lang) || 'King / Twin';
                    const occupancy = Number(room.maxOccupancy ?? room.capacity ?? 2);
                    const mealPlan = room.mealPlan || 'BB';
                    const seasonPricings = Array.isArray(room.seasonPricings) ? room.seasonPricings : [];

                    return (
                      <div
                        key={room.id || rIdx}
                        className="p-5 rounded-2xl bg-white dark:bg-[#040f2b] border-2 border-gold-500/40 shadow-md space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h5 className="text-base font-black text-slate-900 dark:text-white font-display">
                                {roomName}
                              </h5>
                              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                                🛏️ {bedType}
                              </p>
                            </div>

                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-900 dark:text-gold-300 border border-amber-500/30 shrink-0 flex items-center gap-1">
                              <FaUsers className="text-[10px]" />
                              {occupancy} {t('hotel.guests', 'Guests')}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                              🍽️ {mealPlan === 'BB' ? 'Bed & Breakfast' : mealPlan === 'HB' ? 'Half Board' : mealPlan === 'FB' ? 'Full Board' : mealPlan === 'AI' ? 'All Inclusive' : mealPlan}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                              ✓ {t('hotel.roomAssigned', 'Included in Selection')}
                            </span>
                          </div>

                          {/* Room Seasonal Pricing Tiers */}
                          {seasonPricings.length > 0 && (
                            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-[#061842] border border-gold-500/20 space-y-2">
                              <span className="text-[11px] font-black uppercase text-amber-800 dark:text-gold-400 flex items-center gap-1">
                                <FaCalendarAlt className="text-xs" />
                                {t('tourDetail.seasonalTariff', 'Seasonal Tariff Overrides')}:
                              </span>
                              <div className="space-y-1.5">
                                {seasonPricings.map((sp, spIdx) => {
                                  const spName = resolveLocalizedText(sp.seasonName || sp.season?.nameJsonb, t, lang) || 'Special Season';
                                  const spRate = Number(sp.ratePerNight ?? sp.ratePerNightUsd ?? 0);
                                  const spSingle = Number(sp.singleSupplementUsd ?? sp.singleSupplement ?? 0);
                                  return (
                                    <div
                                      key={sp.id || spIdx}
                                      className="flex items-center justify-between text-xs bg-white/80 dark:bg-[#040f2b]/80 p-2 rounded-lg border border-border/40"
                                    >
                                      <div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                          {spName}
                                        </span>
                                        {(sp.startDate || sp.endDate) && (
                                          <span className="text-[10px] text-muted-foreground font-mono">
                                            {sp.startDate || '—'} → {sp.endDate || '—'}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-right rtl:text-left">
                                        <span className="font-black text-amber-900 dark:text-gold-300">
                                          {spRate > 0 ? formatPrice(spRate) : t('common.onRequest', 'Standard')}
                                        </span>
                                        {spSingle > 0 && (
                                          <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                                            +{formatPrice(spSingle)} SGL
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Room Price Bar */}
                        <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                            {t('hotel.roomBaseRate', 'Standard Room Rate')}:
                          </span>
                          <span className="text-base font-black text-amber-900 dark:text-white">
                            {roomRate > 0 ? `${formatPrice(roomRate)} / ${t('hotel.night', 'night')}` : t('tour.includedInTour', 'Included in Tour')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW B (1): HOTEL RATE SHEET — 6 conditional columns                */}
        {/* Columns only render when the dashboard entered data for them.       */}
        {/* ------------------------------------------------------------------ */}
        {!isTripDedicated && rateSheetRows.length > 0 && hasRateSheet && (
          <div className="p-6 md:p-10">
            <div className="overflow-x-auto rounded-2xl shadow-lg border-2 border-gold-400/60 dark:border-gold-500/40 bg-white dark:bg-[#040f2b]">
              <table className="w-full min-w-[720px] text-start border-collapse">
                <thead>
                  <tr className="bg-obsidian-900 dark:bg-[#02091c] text-gold-400 text-[11px] md:text-xs font-black uppercase tracking-wider">
                    {rateSheetColumns.category && (
                      <th className="px-4 py-3.5 text-start whitespace-nowrap">
                        {t('hotelTable.category', 'Hotel Category')}
                      </th>
                    )}
                    {rateSheetColumns.hotelCity && (
                      <th className="px-4 py-3.5 text-start">
                        {t('hotelTable.hotelAndCity', 'Hotel & City Names')}
                      </th>
                    )}
                    {rateSheetColumns.double && (
                      <th className="px-4 py-3.5 text-start whitespace-nowrap">
                        {t('hotelTable.doublePrice', 'Double Room Rate')}
                      </th>
                    )}
                    {rateSheetColumns.single && (
                      <th className="px-4 py-3.5 text-start whitespace-nowrap">
                        {t('hotelTable.singlePrice', 'Single Room Rate')}
                      </th>
                    )}
                    {rateSheetColumns.season && (
                      <th className="px-4 py-3.5 text-start whitespace-nowrap">
                        {t('hotelTable.seasonFee', 'Seasonal Fee')}
                      </th>
                    )}
                    {rateSheetColumns.boat && (
                      <th className="px-4 py-3.5 text-start whitespace-nowrap">
                        {t('hotelTable.boat', 'Boats')}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rateSheetRows.map((row) => (
                    <tr
                      key={row.acc.id || `${row.acc.hotelId || 'acc'}-${row.idx}`}
                      className="border-t border-gold-500/20 align-top"
                    >
                      {rateSheetColumns.category && (
                        <td className="px-4 py-4 text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100">
                          {row.categoryTier ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-500/15 text-amber-900 dark:text-gold-300 border border-gold-500/40">
                              <FaStar className="text-gold-500 text-[10px]" />
                              {categoryTierLabel(row.categoryTier)}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      )}

                      {rateSheetColumns.hotelCity && (
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <FaHotel className="text-gold-500 shrink-0" />
                            <span>{row.hName || t('hotelTable.unnamedHotel', 'Partner Hotel')}</span>
                          </div>
                          {row.city && (
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 flex items-center gap-1.5 mt-1">
                              <FaMapMarkerAlt className="text-gold-500 shrink-0" />
                              <span>{row.city}</span>
                            </div>
                          )}
                          {(row.acc.nights || row.acc.boardBasis || row.acc.regime) && (
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {row.acc.nights ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gold-500/20 text-amber-900 dark:text-gold-300 border border-gold-500/40">
                                  {row.acc.nights} {t('hotel.room.nightsCount', 'Nights')}
                                </span>
                              ) : null}
                              {(row.acc.boardBasis || row.acc.regime) && (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-slate-200 font-bold text-[10px]">
                                  🍽️ {row.acc.boardBasis || row.acc.regime}
                                </span>
                              )}
                            </div>
                          )}
                          {row.roomRate > 0 && (
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                              <FaBed className="text-sky-500 shrink-0" />
                              <span className="font-mono font-bold">{formatPrice(row.roomRate)}</span>
                              <span>/ {t('hotel.night', 'night')}</span>
                            </div>
                          )}
                          {row.hotelSlug && row.isGlobal && (
                            <Link
                              to={row.roomSlug ? `/hotels/${row.hotelSlug}/${row.roomSlug}` : `/hotels/${row.hotelSlug}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-gold-400 hover:underline mt-2"
                            >
                              <span>
                                {row.roomSlug
                                  ? t('tourDetail.viewRoomDetails', 'View Assigned Room')
                                  : t('hotelsCatalog.exploreHotel', 'Explore Hotel')}
                              </span>
                              <FaChevronRight className="rtl-flip text-[9px]" />
                            </Link>
                          )}
                        </td>
                      )}

                      {rateSheetColumns.double && (
                        <td className="px-4 py-4">
                          {row.doublePrice > 0 ? (
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm whitespace-nowrap">
                              {formatPrice(row.doublePrice)}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      )}

                      {rateSheetColumns.single && (
                        <td className="px-4 py-4">
                          {row.singlePrice > 0 ? (
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm whitespace-nowrap">
                              {formatPrice(row.singlePrice)}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      )}

                      {rateSheetColumns.season && (
                        <td className="px-4 py-4">
                          {row.seasonFee > 0 ? (
                            <span className="font-mono font-bold text-amber-600 dark:text-gold-400 text-sm whitespace-nowrap">
                              +{formatPrice(row.seasonFee)}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      )}

                      {rateSheetColumns.boat && (
                        <td className="px-4 py-4">
                          {row.boatName || row.boatPrice > 0 ? (
                            <div className="flex flex-col gap-1">
                              {row.boatName && (
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                  🚢 {row.boatName}
                                </span>
                              )}
                              {row.boatPrice > 0 && (
                                <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs whitespace-nowrap">
                                  +{formatPrice(row.boatPrice)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW B (2): GLOBAL CATALOG PARTNER HOTELS (legacy card grid)        */}
        {/* Shown only when no dashboard rate-sheet data exists.                */}
        {/* ------------------------------------------------------------------ */}
        {!isTripDedicated && assignedAccommodations.length > 0 && !hasRateSheet && (
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedAccommodations.map((acc, idx) => {
                const hotelObj = acc.hotel || {};
                const roomObj = acc.room || null;
                const isGlobal = hotelObj.isGlobal !== false;
                const hName = resolveLocalizedText(acc.nameJsonb || hotelObj.nameJsonb || hotelObj.name || acc.hotelName || acc.name || 'Luxury Partner Hotel', t, lang);
                const hSlug = hotelObj.slug || null;
                const stars = Number(hotelObj.stars ?? hotelObj.starRating ?? 5);
                const supplement = Number(acc.priceSupplement ?? acc.priceSupplementUsd ?? 0);
                const roomRate = Number(roomObj?.ratePerNight ?? roomObj?.basePriceUsd ?? 0);
                const cardImg = hotelObj.heroImageUrl || (Array.isArray(hotelObj.images) && hotelObj.images[0]?.imageUrl) || FALLBACK_HOTEL_IMG;

                return (
                  <div
                    key={acc.id || `${acc.hotelId}-${idx}`}
                    className="bg-white dark:bg-[#040f2b] rounded-2xl shadow-lg border-2 border-gold-400/60 dark:border-gold-500/40 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="bg-obsidian-900 dark:bg-[#02091c] px-5 py-3.5 border-b border-gold-500/30 flex items-center justify-between gap-2">
                        <span className="text-gold-400 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                          <FaMapMarkerAlt className="shrink-0" />
                          {resolveLocalizedText(acc.cityJsonb || hotelObj.city || acc.destination || acc.city || destinationName, t, lang)}
                        </span>
                        <span className="flex items-center gap-0.5 text-gold-400 text-xs">
                          {Array.from({ length: Math.min(Math.max(stars, 1), 5) }).map((_, sIdx) => (
                            <FaStar key={sIdx} />
                          ))}
                        </span>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={cardImg}
                          alt={hName}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_HOTEL_IMG;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h3 className="text-lg font-bold font-display drop-shadow-md">
                            {hName}
                          </h3>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {acc.nights && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-gold-500/20 text-amber-900 dark:text-gold-300 border border-gold-500/40">
                              {acc.nights} {t('hotel.room.nightsCount', 'Nights')}
                            </span>
                          )}
                          {(acc.boardBasis || acc.regime) && (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                              🍽️ {acc.boardBasis || acc.regime}
                            </span>
                          )}
                          {acc.dayRange && (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                              📅 {acc.dayRange}
                            </span>
                          )}
                        </div>

                        {roomObj && (
                          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-xs">
                            <span className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                              <FaBed /> {resolveLocalizedText(roomObj.name, t, lang)}
                            </span>
                            {roomRate > 0 && (
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                {formatPrice(roomRate)}/nt
                              </span>
                            )}
                          </div>
                        )}

                        {supplement > 0 && (
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs">
                            +{formatPrice(supplement)} {t('hotel.supplement', 'Supplement')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    {hSlug && isGlobal ? (
                      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#02091c]/70 border-t border-gold-500/20 flex items-center justify-between">
                        <Link
                          to={roomObj?.slug ? `/hotels/${hSlug}/${roomObj.slug}` : `/hotels/${hSlug}`}
                          className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-gold-400 hover:underline flex items-center gap-1.5"
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
                      <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#02091c]/70 border-t border-gold-500/20 flex items-center justify-between">
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
          </div>
        )}

        {/* Fallback for legacy tour.hotels array or dictionary */}
        {!isTripDedicated && assignedAccommodations.length === 0 && tour?.hotels && (
          <div className="p-6 md:p-10">
            {Array.isArray(tour.hotels) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tour.hotels.map((hotelItem, idx) => (
                  <div
                    key={`${hotelItem?.name || idx}-${idx}`}
                    className="bg-white dark:bg-[#040f2b] rounded-2xl shadow-md border-2 border-gold-400/60 dark:border-gold-500/40 p-5 space-y-2"
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
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-gold-400 hover:underline pt-1"
                      >
                        <span>{t('hotelsCatalog.exploreHotel', 'Explore Hotel')}</span>
                        <FaChevronRight className="rtl-flip text-[10px]" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : typeof tour.hotels === 'object' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(tour.hotels).map(([city, hotelList]) => (
                  <div
                    key={city}
                    className="bg-white dark:bg-[#040f2b] rounded-2xl shadow-md border-2 border-gold-400/60 dark:border-gold-500/40 overflow-hidden"
                  >
                    <div className="bg-obsidian-900 dark:bg-[#02091c] px-4 py-3 border-b border-gold-500/30">
                      <h3 className="text-gold-400 font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                        <FaMapMarkerAlt className="flex-shrink-0 text-xs" />
                        {resolveLocalizedText(city, t, lang)}
                      </h3>
                    </div>
                    <ul className="p-4 flex flex-col gap-1.5">
                      {Array.isArray(hotelList) && hotelList.map((hotel, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs md:text-sm text-slate-800 dark:text-slate-100 font-bold py-1 border-b border-gold-500/15 last:border-0"
                        >
                          <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 shadow-sm" />
                          {resolveLocalizedText(hotel, t, lang)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

      </div>

      {/* Internal Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-gold-400 p-2 text-2xl cursor-pointer z-50 transition-colors"
            >
              <FaTimes />
            </button>

            <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
              <img
                src={galleryList[selectedPhotoIndex] || FALLBACK_HOTEL_IMG}
                alt={hotelName}
                className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl border border-gold-500/30"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_HOTEL_IMG;
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-gold-400 font-bold text-sm">
                {selectedPhotoIndex + 1} / {galleryList.length}
              </span>
              <span className="text-white/60 text-xs">
                {hotelName}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
