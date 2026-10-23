import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar,
  FaMapMarkerAlt,
  FaWifi,
  FaSnowflake,
  FaBath,
  FaWineGlass,
  FaCoffee,
  FaBed,
  FaTv,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaGlobe,
  FaBan,
  FaPaw,
  FaSearchPlus,
  FaShieldAlt,
  FaUtensils,
  FaShoppingBag,
  FaCreditCard,
  FaUserFriends,
  FaCheckCircle,
  FaTimes,
} from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import { useHotel } from '../../hooks/useHotels';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import ConsentGate from '../../components/privacy/ConsentGate';

const HotelDetails = () => {
  const { t, i18n } = useTranslation();
  const isAr = (i18n.language || '').startsWith('ar');
  const isRtl = i18n.dir?.() === 'rtl' || isAr;
  const { formatPrice } = useCurrency();
  const { slug } = useParams();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/programs') ? '/programs' : '/services';
  const roomLinkBase = location.pathname.startsWith('/hotels') ? '/hotels' : `${basePath}/hotels`;
  const currentSlug = slug || '';
  const { hotel: apiHotel, loading, error } = useHotel(currentSlug);

  const [activeImage, setActiveImage] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [reviews, setReviews] = useState([
    {
      name: 'David Mercer',
      rating: 5,
      date: '2026-05-30',
      text: 'Stunning hotel with incredible proximity to the Pyramids entrance. Highly recommended!',
    },
    {
      name: 'Elena Rostova',
      rating: 5,
      date: '2026-04-14',
      text: 'Comfortable 3-star service, brand new room equipment, and friendly staff. Rooftop dinner will be fantastic.',
    },
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 min-h-screen pt-32 pb-24 px-6 container mx-auto">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (!apiHotel && error) {
    return (
      <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 min-h-screen pt-32 pb-24 px-6 container mx-auto flex items-center justify-center">
        <ErrorState
          title={t('hotel.notFoundTitle', 'Hotel Not Found')}
          message={error?.message || t('hotel.notFoundDesc', 'The requested hotel could not be found.')}
          actionLabel={t('hotel.browseAll', 'Browse Luxury Hotels')}
          actionLink={basePath}
        />
      </div>
    );
  }

  if (!apiHotel) {
    return (
      <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 min-h-screen pt-32 pb-24 px-6 container mx-auto">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  const hotelInfo = {
    name: apiHotel?.name || '',
    stars: apiHotel?.stars || 5,
    yearBuilt: '2025',
    totalRooms: apiHotel?.rooms?.length ? `${apiHotel.rooms.length} ${t('hotel.roomTypesAvailable', 'room types')}` : t('hotel.overview.roomsCount', '20 rooms'),
    checkIn: apiHotel?.policies?.checkIn || '3:00 PM',
    checkOut: apiHotel?.policies?.checkOut || '12:00 PM',
    smoking: apiHotel?.policies?.smoking || t('hotel.overview.smokingPolicyVal', 'Non-smoking throughout property'),
    pets: apiHotel?.policies?.pets || t('hotel.overview.petsPolicyVal', 'Not allowed'),
    location:
      apiHotel?.address ||
      (apiHotel?.city ? `${apiHotel.city}, ${apiHotel.destinationSlug || ''}` : ''),
    telephones: apiHotel?.phone ? [apiHotel.phone] : [],
    cell: apiHotel?.phone || '',
    email: apiHotel?.email || '',
    facebook: '',
    instagram: '',
    website: apiHotel?.website || '',
  };

  const roomTypes = (apiHotel?.rooms && apiHotel.rooms.length > 0)
    ? apiHotel.rooms.map((r) => {
        const resolvedPrice = (r.ratePerNight !== undefined && r.ratePerNight !== null && Number(r.ratePerNight) > 0)
          ? Number(r.ratePerNight)
          : null;
        return {
          id: r.slug,
          name: r.name || r.slug,
          price: resolvedPrice,
          capacity: r.maxOccupancy ? (isAr ? (r.maxOccupancy === 1 ? 'شخص واحد' : r.maxOccupancy === 2 ? 'شخصين' : `${r.maxOccupancy} ضيوف`) : `${r.maxOccupancy} Guests`) : (isAr ? 'شخصين' : '2 Guests'),
          bed: r.bedType || r.description || (isAr ? 'مزدوجة / توأم' : 'Double / Twin Beds'),
          view: r.viewType || (isAr ? 'إطلالة قياسية' : 'Standard View'),
          image: r.image || r.imageUrl || apiHotel?.heroImageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
          seasonPricings: Array.isArray(r.seasonPricings) ? r.seasonPricings : [],
        };
      })
    : [];

  const inRoomAmenities = [
    { label: isAr ? 'إنترنت لاسلكي مجاني' : t('hotel.fac.wifi', 'Free Wi-Fi'), icon: <FaWifi className="text-gold-500" /> },
    { label: isAr ? 'تكييف هواء (بارد وساخن)' : t('hotel.fac.ac', 'Air conditioning (cold & heat)'), icon: <FaSnowflake className="text-gold-500" /> },
    { label: isAr ? 'حمام خاص مع المستلزمات' : t('hotel.fac.bathroom', 'Private bathroom with amenities'), icon: <FaBath className="text-gold-500" /> },
    { label: isAr ? 'ثلاجة صغيرة للغرفة (برسوم إضافية)' : t('hotel.fac.minibar', 'Mini bar — refrigerated, stocked (against charge)'), icon: <FaWineGlass className="text-gold-500" /> },
    { label: isAr ? 'ماكينة قهوة وشاي مع تجديد يومي' : t('hotel.fac.coffee', 'In-room coffee & tea — daily refreshment basis'), icon: <FaCoffee className="text-gold-500" /> },
    { label: isAr ? 'مفروشات من القطن المصري 100٪' : t('hotel.fac.linen', '100% Egyptian cotton linen & bed covers'), icon: <FaBed className="text-gold-500" /> },
    { label: isAr ? 'شاشة تلفزيون بقنوات متعددة اللغات' : t('hotel.fac.tv', 'TV — Multi-language channels: Italian, Spanish, English, Portuguese, Sport, Kids, Arabic'), icon: <FaTv className="text-gold-500" /> },
    { label: isAr ? 'خزنة مجانية داخل الغرفة' : t('hotel.fac.safe', 'Free safe box'), icon: <FaLock className="text-gold-500" /> },
    { label: isAr ? 'مكواة وطاولة كي (عند الطلب)' : t('hotel.fac.iron', 'Iron & ironing board (upon request)'), icon: <FaShieldAlt className="text-gold-500" /> },
    { label: isAr ? 'هاتف داخلي' : t('hotel.fac.phone', 'In-room phone'), icon: <FaPhoneAlt className="text-gold-500" /> },
  ];

  const hotelWideFacilities = [
    { label: isAr ? 'متجر هدايا وتذكارات' : t('hotel.fac.giftshop', 'Gift shop'), icon: <FaShoppingBag className="text-gold-500" /> },
    { label: isAr ? 'مطعم على السطح بإطلالة الأهرامات' : t('hotel.fac.restaurant', 'Rooftop restaurant (coming soon)'), icon: <FaUtensils className="text-gold-500" /> },
    { label: isAr ? 'مقهى واستراحة للمشروبات والوجبات الخفيفة' : t('hotel.fac.bar', 'Bar with wide range of snack options (coming soon)'), icon: <FaWineGlass className="text-gold-500" /> },
    { label: isAr ? 'دفع إلكتروني آمن عبر بطاقات الائتمان' : t('hotel.fac.payment', 'SSL-secured online payment'), icon: <FaCreditCard className="text-gold-500" /> },
  ];

  const hotelHeroImage = apiHotel?.heroImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200';

  // Prefer the gallery explicitly saved from the dashboard (stored on
  // amenities.images). Fall back to the API `images` collection for older
  // responses that still resolve the gallery from linked media assets.
  const configuredGallery = Array.isArray(apiHotel?.amenities?.images)
    ? apiHotel.amenities.images
    : [];
  const gallerySource = configuredGallery.length > 0 ? configuredGallery : (apiHotel?.images || []);
  const rawGallery = gallerySource
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean);

  const galleryImages = rawGallery.length > 0
    ? (apiHotel?.heroImageUrl && !rawGallery.includes(apiHotel.heroImageUrl) ? [apiHotel.heroImageUrl, ...rawGallery] : rawGallery)
    : (apiHotel?.heroImageUrl ? [apiHotel.heroImageUrl] : []);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    const reviewObj = {
      name: newReview.name,
      rating: parseInt(newReview.rating),
      date: new Date().toISOString().split('T')[0],
      text: newReview.text,
    };
    setReviews([reviewObj, ...reviews]);
    setNewReview({ name: '', rating: 5, text: '' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 pb-24 text-slate-800 dark:text-slate-200 leading-relaxed font-body">
      <Helmet>
        <title>{t('hotel.seoTitle', 'Sol Pyramid Hotel | Giza Pyramids View | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'hotel.seoDesc',
            'Stay steps away from the Pyramids of Giza at Sol Pyramid Hotel. Enjoy modern 3-star luxury, elegant rooms with Pyramids views, rooftop dining coming soon, and family-friendly hospitality.'
          )}
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative min-h-[90svh] md:h-[85vh] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hotelHeroImage}
            alt={hotelInfo.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-6xl flex flex-col items-center justify-center text-center w-full">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-gold-400 text-base md:text-lg">
                  {Array.from({ length: Math.min(Math.max(Number(apiHotel?.stars) || 5, 1), 5) }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </span>
                <span className="text-white text-[11px] md:text-xs font-semibold uppercase tracking-widest">
                  {apiHotel?.stars ? t('hotel.overview.threeStarHotel', `${apiHotel.stars}-Star Hotel`) : t('hotel.overview.starsLabel', 'Luxury Hotel')}
                </span>
              </div>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gold-400" />
              <div className="flex items-center gap-1.5 text-white text-[11px] md:text-xs font-bold uppercase tracking-widest bg-black/50 px-4 py-1.5 rounded-full border border-gold-400/60 backdrop-blur-sm shadow-lg">
                <FaMapMarkerAlt className="text-sm shrink-0 text-gold-400" />
                <span>{apiHotel?.city ? t('hotel.overview.locationGiza', `${apiHotel.city}, Egypt`) : (isAr ? 'الجيزة • إطلالة على الأهرامات' : t('hotel.overview.gizaPyramidsView', 'Giza • Pyramids View'))}</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-display-2xl text-white font-display font-bold drop-shadow-2xl mb-4 leading-tight tracking-wide">
              {hotelInfo.name}
            </h1>
            {currentSlug !== 'sol-pyramid-hotel' && (
              <>
                <p className="text-white/90 text-xl md:text-2xl font-medium italic mb-8 drop-shadow-lg">
                  "{apiHotel?.description ? (apiHotel.description.slice(0, 160) + '...') : t('hotel.tagline', 'Where History Meets Supreme Luxury')}"
                </p>
                <div className="flex flex-wrap justify-center gap-2.5 mb-8">
                  <span className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white">
                    {t('hotel.overview.checkInLabel', 'Check-in')}: {hotelInfo.checkIn}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white">
                    {t('hotel.overview.checkOutLabel', 'Check-out')}: {hotelInfo.checkOut}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white">
                    {hotelInfo.totalRooms}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-1.5">
                    <FaBan className="text-red-400" /> {t('hotel.overview.smokingPolicyVal', 'No Smoking')}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-1.5">
                    <FaPaw className="text-red-400" /> {t('hotel.overview.petsPolicyVal', 'No Pets')}
                  </span>
                </div>
              </>
            )}
            {currentSlug === 'sol-pyramid-hotel' && <div className="mb-10" />}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#rooms">
                <button className="px-8 py-3 text-sm uppercase font-extrabold tracking-wider text-white bg-gold-500 hover:bg-gold-600 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105">
                  {t('hotel.room.viewRooms', 'View Available Rooms')}
                </button>
              </a>
              <a href="#location">
                <button className="px-8 py-3 text-sm uppercase font-extrabold tracking-wider text-white bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-white/30 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105">
                  {t('hotel.location.subtitle', 'View Location')}
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Hotel Overview */}
      <section className="container mx-auto px-6 py-12 max-w-6xl -mt-10 relative z-20">
        <div className="bg-white dark:bg-obsidian-800 rounded-2xl shadow-card border border-slate-200/50 dark:border-obsidian-700 p-5 md:p-12 text-left rtl:text-right">
          <h2 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gold-500 rounded-full" />
            {t('hotel.overview.title', 'Hotel Overview')}
          </h2>
          <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-10">
            "{apiHotel?.description || t(
              'hotel.overview.desc',
              "Luxury 5-star establishment designed for travellers who want to explore the greatest sights with supreme comfort, personal service, and world-class hospitality."
            )}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                🏗️
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('hotel.overview.yearBuilt', 'Built')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">2025</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                ⭐
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('tour.tourType', 'Rating')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {apiHotel?.stars
                    ? `${apiHotel.stars}★ ${t('hotel.overview.luxuryHotel', 'Hotel')}`
                    : t('hotel.overview.starsLabel', '5-Star Hotel')}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                🛏️
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('hotel.overview.totalRooms', 'Total Rooms')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{hotelInfo.totalRooms}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                🕒
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('hotel.overview.checkInOut', 'Check-in / Check-out')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {hotelInfo.checkIn} / {hotelInfo.checkOut}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                🚭
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('hotel.overview.smokingPolicy', 'Smoking')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                  {t('hotel.overview.smokingPolicyVal', 'Non-smoking throughout')}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                🐾
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('hotel.overview.pets', 'Pets')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {t('hotel.overview.petsPolicyVal', 'No pets allowed')}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-obsidian-700/50 p-5 rounded-xl border border-slate-200/60 dark:border-obsidian-600 col-span-1 sm:col-span-2 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600 shrink-0 text-xl font-bold">
                💳
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-300 block font-bold">
                  {t('hotel.fac.hotelWideTitle', 'Payments')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {t('hotel.fac.payment', 'SSL-secured online payment')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Room Types */}
      <section id="rooms" className="container mx-auto px-6 py-12 max-w-6xl text-left rtl:text-right">
        <div className="text-center mb-12">
          <span className="text-gold-600 uppercase tracking-widest text-xs font-semibold block mb-2">
            {t('hotel.room.selection', 'ACCOMMODATIONS')}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 dark:text-white">
            {t('hotel.room.title', 'Available Room Types')}
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomTypes.map((room) => (
            <div
              key={room.id}
              className="bg-white dark:bg-[#0d162a] rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl border-2 border-slate-200/90 dark:border-blue-900/60 flex flex-col justify-between hover:border-gold-500 dark:hover:border-gold-400 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 group transform hover:-translate-y-1.5"
            >
              <div>
                {/* Image Section */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d162a]/90 via-[#0d162a]/30 to-transparent" />

                  {/* View Badge (Vibrant Gold/Amber High Contrast) */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 flex items-center gap-1.5 bg-amber-400 dark:bg-amber-400 text-obsidian-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl border border-gold-300">
                    <span className="w-2 h-2 rounded-full bg-obsidian-900 animate-pulse" />
                    <span>{room.view}</span>
                  </div>

                  {/* Top Right Royal Blue Pill */}
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 bg-[#1e3a8a]/90 text-white backdrop-blur-md border border-amber-400/40 text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <FaUserFriends className="text-amber-300" />
                    <span>{room.capacity}</span>
                  </div>

                  {/* Bottom Image Overlay Strip */}
                  <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-white">
                    <span className="text-xs font-bold text-amber-300 drop-shadow flex items-center gap-1.5">
                      <FaBed className="text-gold-400 text-sm" /> {room.bed}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase bg-amber-900/80 text-amber-200 px-2.5 py-0.5 rounded-md border border-amber-600/40">
                      {t('hotel.overview.luxuriousComfort', 'Luxury Suite')}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-gold-400 transition-colors leading-tight font-display mb-4">
                    {room.name}
                  </h3>

                  {/* Feature Badges: Royal Blue, Gold, Brown & White */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Royal Blue Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 text-xs font-extrabold shadow-2xs">
                      <FaUserFriends className="text-blue-700 dark:text-blue-400 text-sm shrink-0" />
                      <span>{room.capacity}</span>
                    </span>

                    {/* Gold Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 text-xs font-extrabold shadow-2xs">
                      <FaBed className="text-amber-600 dark:text-gold-400 text-sm shrink-0" />
                      <span>{room.bed}</span>
                    </span>

                    {/* Terracotta/Brown Accent Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5c2c16]/10 dark:bg-[#5c2c16]/40 border border-[#8b4513]/30 text-[#6b3e26] dark:text-[#f59e0b] text-xs font-extrabold shadow-2xs">
                      <FaStar className="text-[#b45309] dark:text-amber-400 text-xs shrink-0" />
                      <span>5 Star Service</span>
                    </span>
                  </div>
                  {Array.isArray(room.seasonPricings) && room.seasonPricings.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-obsidian-700 space-y-1.5">
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-gold-600 dark:text-gold-400">
                        {t('hotel.room.seasonalRates', 'Seasonal Rates')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {room.seasonPricings.map((sp, spIdx) => (
                          <span
                            key={sp.id || sp.seasonId || spIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-obsidian-900 border border-gold-500/30 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                          >
                            <span className="text-gold-600 dark:text-gold-400 font-bold">{sp.seasonName || 'Season'}:</span>
                            <span>{formatPrice(Number(sp.ratePerNightUsd ?? sp.ratePerNight ?? room.price))}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Section (Royal Blue View Details Button & $0 Price Display) */}
              <div className="p-5 sm:p-6 bg-slate-100 dark:bg-[#070e1c] border-t-2 border-slate-200/90 dark:border-blue-900/60 flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-black mb-0.5">
                    {t('tourCard.startingFrom', 'Price')}
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('tourCard.from', 'From')}</span>
                    <span className="text-[#1e3a8a] dark:text-gold-400 font-extrabold">{formatPrice(0)}</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ {t('hotel.night', 'night')}</span>
                  </div>
                </div>
                <Link to={`${roomLinkBase}/${currentSlug}/${room.id}`}>
                  <button className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-[#1e3a8a] hover:bg-[#1d4ed8] dark:bg-[#1e40af] dark:hover:bg-[#2563eb] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95">
                    {t('tourCard.viewDetails', 'View Details')}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="bg-slate-900 py-20 text-white border-y border-slate-800 text-left rtl:text-right">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold block mb-2">
              {t('hotel.fac.comfort', 'PREMIUM SERVICES')}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-gold-400">
              {t('hotel.fac.title', 'Hotel Facilities')}
            </h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-800/40 p-5 md:p-10 rounded-2xl border border-slate-800 shadow-inner">
              <h3 className="text-xl font-display font-semibold text-gold-400 mb-6 border-b border-slate-700/50 pb-3 flex items-center gap-2">
                📶 {t('hotel.fac.inRoomTitle', 'In-Room Amenities')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inRoomAmenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 p-5 md:p-10 rounded-2xl border border-slate-800 shadow-inner flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-semibold text-gold-400 mb-6 border-b border-slate-700/50 pb-3 flex items-center gap-2">
                  🏢 {t('hotel.fac.hotelWideTitle', 'Hotel-Wide Facilities')}
                </h3>
                <div className="space-y-4">
                  {hotelWideFacilities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-slate-300">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-center">
                <span className="text-gold-400 font-semibold block uppercase tracking-wider mb-1 text-xs">
                  🔒 {t('hotel.fac.securePayTitle', 'SSL Secured Reservation')}
                </span>
                <p className="text-[11px] text-slate-300">
                  {t(
                    'hotel.fac.securePayDesc',
                    'Book with absolute confidence. All payments are processed through SSL-secured payment portals.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="container mx-auto px-6 py-20 max-w-6xl text-left rtl:text-right scroll-mt-28">
        <div className="text-center mb-12">
          <span className="text-gold-600 uppercase tracking-widest text-xs font-semibold block mb-2">
            {t('hotel.location.subtitle', 'HOW TO FIND US')}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 dark:text-white">
            {t('hotel.location.proximityTitle', 'Steps From Giza Pyramids')}
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="bg-white dark:bg-obsidian-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-obsidian-700 p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="lg:w-1/2 flex flex-col justify-between py-2">
            <div>
              <p className="text-slate-700 dark:text-slate-200 text-[15px] leading-relaxed mb-6">
                "{t(
                  'hotel.location.proximityDesc',
                  'Sol Pyramid Hotel enjoys a premium spot in Haram, Giza, located right behind Le Meridien Pyramids. It puts you in immediate walking or short-driving distance to the ancient pyramids, making it the perfect base camp for history buffs and global travelers.'
                )}"
              </p>

              <div className="space-y-3.5 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600 text-lg shrink-0" />
                  <span>{t('hotel.location.dist1', 'Giza Pyramids Entrance — 5 mins walk')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600 text-lg shrink-0" />
                  <span>{t('hotel.location.dist2', 'Grand Egyptian Museum (GEM) — 10 mins drive')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600 text-lg shrink-0" />
                  <span>{t('hotel.location.dist3', 'Cairo International Airport — 45 mins drive')}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-700/50 border border-slate-200 dark:border-obsidian-600 text-slate-700 dark:text-slate-200 flex items-start gap-4">
              <FaMapMarkerAlt className="text-gold-600 text-xl mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1 text-xs uppercase tracking-wider">
                  {t('hotel.location.exactAddress', 'Exact Address')}
                </span>
                <p className="text-sm font-medium leading-relaxed">{hotelInfo.location}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 min-h-[350px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
            <ConsentGate category="marketing" providerName="Google Maps" height="350px">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(hotelInfo.location || `${hotelInfo.name}, ${apiHotel?.city || 'Egypt'}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen=""
                loading="lazy"
                title={t('hotel.location.title', 'Hotel Location')}
              />
            </ConsentGate>
          </div>
        </div>
      </section>

      {/* Video Walkthrough */}
      {apiHotel?.amenities?.youtubeId && (
        <section className="bg-slate-900 py-20 text-white border-y border-slate-800 text-center">
          <div className="container mx-auto px-6 max-w-4xl">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold block mb-2">
              {t('hotel.video.subtitle', 'CINEMATIC TOUR')}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-gold-400 mb-4">
              {t('hotel.video.title', 'Video Walkthrough')}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-10">
              "{t(
                'hotel.video.desc',
                'Watch our exclusive video tour to experience the atmosphere, elegant accommodations, and views.'
              )}"
            </p>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
              {isPlayingVideo ? (
                <ConsentGate
                  category="marketing"
                  providerName="YouTube"
                  height="100%"
                  fallbackThumbnail={`https://img.youtube.com/vi/${apiHotel?.amenities?.youtubeId}/hqdefault.jpg`}
                >
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://www.youtube.com/embed/${apiHotel?.amenities?.youtubeId}?autoplay=1`}
                    title={`${hotelInfo.name} Cinematic Video Tour`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </ConsentGate>
              ) : (
                <div
                  className="w-full h-full absolute inset-0 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-gold-500"
                  onClick={() => setIsPlayingVideo(true)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Play ${hotelInfo.name} Cinematic Video Tour`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${apiHotel?.amenities?.youtubeId}/hqdefault.jpg`}
                    alt={`${hotelInfo.name} Cinematic Video Tour Placeholder`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width="800"
                    height="450"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500/90 text-slate-950 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold-400">
                      <svg className="w-8 h-8 ml-1.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section className="container mx-auto px-6 py-20 max-w-6xl text-left rtl:text-right">
        <div className="text-center mb-12">
          <span className="text-gold-600 uppercase tracking-widest text-xs font-semibold block mb-2">
            {t('hotel.gallery.subtitle', 'VISUAL INSIGHTS')}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 dark:text-white">
            {t('hotel.gallery.title', 'Gallery')}
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          {galleryImages.map((url, idx) => (
            <div
              key={idx}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative shadow-sm border border-slate-200 bg-slate-100 mb-4"
              onClick={() => setActiveImage(url)}
            >
              <img
                src={url}
                alt={`Sol Pyramid Hotel Gallery ${idx + 1}`}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaSearchPlus className="text-white text-2xl" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white dark:bg-[#0b1222] py-16 border-t border-slate-200 dark:border-blue-900/40 text-left rtl:text-right">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-gold-600 dark:text-gold-400 uppercase tracking-widest text-xs font-bold block mb-2">
              {t('hotel.gallery.subtitle', 'GUEST FEEDBACK')}
            </span>
            <h2 className="text-3xl font-display font-semibold text-slate-900 dark:text-white">
              {t('hotel.room.reviewsTitle', 'Reviews & Ratings')}
            </h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-12">
            <div className="bg-slate-50 dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-blue-900/60 shadow-md dark:shadow-xl text-center">
              <span className="text-5xl font-black text-slate-900 dark:text-white">5.0</span>
              <div className="flex justify-center gap-1 text-amber-400 my-3 text-xl">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-300">
                {t('hotel.room.reviewsCountVal', 'Based on {{count}} reviews', { count: reviews.length })}
              </span>
            </div>

            <div className="md:col-span-2 space-y-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-6 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-blue-900/60 shadow-md dark:shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{rev.name}</h4>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-1 mb-3 text-amber-400">
                    {[...Array(rev.rating)].map((_, rIdx) => (
                      <FaStar key={rIdx} />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-slate-50 dark:bg-[#0f172a] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-blue-900/60 shadow-md dark:shadow-xl space-y-4"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {t('tour.leaveReview', 'Write a Review')}
            </h3>
            {reviewSubmitted && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-800 rounded-xl text-sm font-bold flex items-center gap-2">
                <FaCheckCircle /> {t('booking.reservationConfirmed', 'Review submitted successfully!')}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 font-extrabold">
                  {t('booking.fullName', 'Name')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('booking.fullName', 'Your Name')}
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm bg-white dark:bg-[#1e293b] outline-none focus:border-blue-600 dark:focus:border-gold-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 font-extrabold">
                  {t('tour.tourType', 'Rating')}
                </label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm bg-white dark:bg-[#1e293b] outline-none focus:border-blue-600 dark:focus:border-gold-400 transition-colors"
                >
                  <option value="5">⭐⭐⭐⭐⭐ ({t('booking.guests', '5 Stars')})</option>
                  <option value="4">⭐⭐⭐⭐ ({t('booking.guests', '4 Stars')})</option>
                  <option value="3">⭐⭐⭐ ({t('booking.guests', '3 Stars')})</option>
                  <option value="2">⭐⭐ ({t('booking.guests', '2 Stars')})</option>
                  <option value="1">⭐ ({t('booking.guests', '1 Star')})</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 font-extrabold">
                {t('booking.specialRequirements', 'Comment')}
              </label>
              <textarea
                required
                rows="3"
                placeholder={t('booking.specialRequestPlaceholder', 'Share your experience at Sol Pyramid Hotel...')}
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm bg-white dark:bg-[#1e293b] outline-none resize-none focus:border-blue-600 dark:focus:border-gold-400 transition-colors"
              />
            </div>
            <button type="submit" className="px-6 py-3 text-xs uppercase font-extrabold tracking-wider text-white bg-[#1e3a8a] hover:bg-[#1d4ed8] dark:bg-[#1e40af] dark:hover:bg-[#2563eb] rounded-xl shadow-md transition-all">
              {t('tour.submitReview', 'Submit Review')}
            </button>
          </form>
        </div>
      </section>

      {/* Direct Contact Footer Card */}
      <section className="container mx-auto px-6 py-6 max-w-6xl mt-8">
        <div className="bg-slate-900 text-white p-5 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-left rtl:text-right">
          <div>
            <h3 className="text-xl font-display font-semibold text-gold-400 mb-2">{hotelInfo.name}</h3>
            <p className="text-xs text-slate-400 max-w-md">{hotelInfo.location}</p>
          </div>

          <div className="flex items-center gap-3">
            {hotelInfo.telephones[0] && (
              <a
                href={`tel:${hotelInfo.telephones[0].replace(/[^\d+]/g, '')}`}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
                aria-label="Call Hotel"
                title={`Call ${hotelInfo.telephones[0]}`}
              >
                <FaPhoneAlt size={16} />
              </a>
            )}
            {hotelInfo.facebook && (
              <a
                href={hotelInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
            )}
            {hotelInfo.instagram && (
              <a
                href={hotelInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
            )}
            {hotelInfo.telephones[0] && (
              <a
                href={`https://wa.me/${hotelInfo.telephones[0].replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all text-slate-300"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            )}
            {hotelInfo.email && (
              <a
                href={`mailto:${hotelInfo.email}`}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gold-500 hover:text-slate-900 transition-all text-slate-300"
                aria-label="Email"
                title={`Email ${hotelInfo.email}`}
              >
                <FaEnvelope size={18} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-gold-500 z-50 transition-colors"
              onClick={() => setActiveImage(null)}
              aria-label="Close image preview"
            >
              <FaTimes size={32} />
            </button>
            <img
              src={activeImage}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              alt="Gallery preview"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelDetails;
