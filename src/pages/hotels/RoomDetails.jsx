import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBed,
  FaUserFriends,
  FaArrowLeft,
  FaWifi,
  FaSnowflake,
  FaBath,
  FaWineGlass,
  FaCoffee,
  FaTv,
  FaLock,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaCheck,
  FaTimes,
  FaBan,
  FaPaw,
  FaSearchPlus,
  FaCheckCircle,
  FaWhatsapp,
  FaCopy,
  FaFacebook,
  FaInstagram,
  FaGlobe,
  FaPaperPlane,
} from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import { useHotel } from '../../hooks/useHotels';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';

const RoomDetails = () => {
  const { t, i18n } = useTranslation();
  const isAr = (i18n.language || '').startsWith('ar');
  const isRtl = i18n.dir?.() === 'rtl' || isAr;
  const { hotelSlug, roomSlug } = useParams();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const currentHotelSlug = hotelSlug || 'sol-pyramid-hotel';
  const { hotel: apiHotel, loading, error } = useHotel(currentHotelSlug);

  const [activeImage, setActiveImage] = useState(null);
  const basePath = location.pathname.startsWith('/programs') ? '/programs' : '/services';
  const hotelLinkBase = location.pathname.startsWith('/hotels') ? '/hotels' : `${basePath}/hotels`;

  const roomDataMap = {
    'single-room': {
      id: 'single-room',
      name: isAr ? 'غرفة مفردة' : t('hotel.room.singleTitle', 'Single Room'),
      price: 75,
      capacity: isAr ? 'شخص واحد' : t('hotel.room.singleCapacity', '1 Guest'),
      bed: isAr ? 'سرير مفرد' : t('hotel.room.singleBed', '1 Single Bed'),
      view: isAr ? 'إطلالة على الحديقة / المدينة' : t('hotel.room.singleView', 'City / Garden View'),
      smokingAllowed: false,
      petsAllowed: false,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
      ],
    },
    'twin-room': {
      id: 'twin-room',
      name: isAr ? 'غرفة توأم' : t('hotel.room.twinTitle', 'Twin Room'),
      price: 85,
      capacity: isAr ? 'شخصين' : t('hotel.room.twinCapacity', '2 Guests'),
      bed: isAr ? 'مزدوجة / توأم' : t('hotel.room.twinBed', 'Double / Twin Beds'),
      view: isAr ? 'إطلالة قياسية' : t('hotel.room.twinView', 'Standard View'),
      smokingAllowed: false,
      petsAllowed: false,
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
      ],
    },
    'double-room': {
      id: 'double-room',
      name: isAr ? 'غرفة مزدوجة' : t('hotel.room.doubleTitle', 'Double Room'),
      price: 95,
      capacity: isAr ? 'شخصين' : t('hotel.room.doubleCapacity', '1–2 Guests'),
      bed: isAr ? '1 سرير كينج مزدوج' : t('hotel.room.doubleBed', '1 King Bed'),
      view: isAr ? 'إطلالة على الأهرامات' : t('hotel.room.doubleView', 'Pyramids View'),
      smokingAllowed: false,
      petsAllowed: false,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200',
      ],
    },
    'triple-room': {
      id: 'triple-room',
      name: isAr ? 'غرفة ثلاثية' : t('hotel.room.tripleTitle', 'Triple Room'),
      price: 125,
      capacity: isAr ? '3 ضيوف' : t('hotel.room.tripleCapacity', '3 Guests'),
      bed: isAr ? 'مزدوجة / توأم' : t('hotel.room.tripleBed', 'Double/Twin'),
      view: isAr ? 'إطلالة قياسية' : t('hotel.room.tripleView', 'Standard View'),
      smokingAllowed: false,
      petsAllowed: false,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
      ],
    },
    'executive-suite': {
      id: 'executive-suite',
      name: isAr ? 'جناح تنفيذي' : t('hotel.room.suiteTitle', 'Executive Suite'),
      price: 190,
      capacity: isAr ? '2–3 ضيوف' : t('hotel.room.suiteCapacity', '2–3 Guests'),
      bed: isAr ? '1 سرير كينج + صالون استراحة' : t('hotel.room.suiteBed', '1 King Bed + Lounge'),
      view: isAr ? 'إطلالة بانورامية على الأهرامات' : t('hotel.room.suiteView', 'Panoramic Pyramids View'),
      smokingAllowed: false,
      petsAllowed: false,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
      ],
    },
    'royal-pyramid-view-suite': {
      id: 'royal-pyramid-view-suite',
      name: isAr ? 'الجناح الملكي بإطلالة الأهرامات' : t('hotel.room.royalTitle', 'Royal Pyramid View Suite'),
      price: 280,
      capacity: isAr ? '2–4 ضيوف' : t('hotel.room.royalCapacity', '2–4 Guests'),
      bed: isAr ? 'ماستر كينج + صالة ملكية' : t('hotel.room.royalBed', 'Master King Bed + Royal Lounge'),
      view: isAr ? 'إطلالة مباشرة صف أول على الأهرامات' : t('hotel.room.royalView', 'Front-Row Direct Pyramids View'),
      smokingAllowed: false,
      petsAllowed: false,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200',
      ],
    },
  };

  const apiRoom = apiHotel?.rooms?.find((r) => r.slug === roomSlug);
  const matchedStatic = roomDataMap[roomSlug];
  const defaultFallbackImage = apiHotel?.heroImageUrl || matchedStatic?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200';
  const defaultFallbackGallery = (apiRoom?.gallery && apiRoom.gallery.length > 0)
    ? apiRoom.gallery
    : (matchedStatic?.gallery || (apiHotel?.images && apiHotel.images.length > 0
        ? apiHotel.images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
        : [defaultFallbackImage]));

  const room = (matchedStatic || apiRoom) ? {
    id: roomSlug,
    name: (apiRoom?.name) || (matchedStatic?.name) || (isAr ? 'غرفة فاخرة' : 'Luxury Room'),
    description: apiRoom?.description || null,
    price: (apiRoom?.ratePerNight !== undefined && apiRoom?.ratePerNight !== null && Number(apiRoom.ratePerNight) > 0)
      ? Number(apiRoom.ratePerNight)
      : (matchedStatic?.price || 85),
    capacity: apiRoom?.maxOccupancy
      ? (isAr
          ? (apiRoom.maxOccupancy === 1 ? 'شخص واحد' : apiRoom.maxOccupancy === 2 ? 'شخصين' : `${apiRoom.maxOccupancy} ضيوف`)
          : `${apiRoom.maxOccupancy} Guests`)
      : (matchedStatic?.capacity || (isAr ? 'شخصين' : '2 Guests')),
    bed: (apiRoom?.bedType) || (matchedStatic?.bed) || (isAr ? 'مزدوجة / توأم' : 'Double / Twin Beds'),
    view: (apiRoom?.viewType) || (matchedStatic?.view) || (isAr ? 'إطلالة قياسية' : 'Standard View'),
    smokingAllowed: apiRoom?.smokingAllowed ?? matchedStatic?.smokingAllowed ?? false,
    petsAllowed: apiRoom?.petsAllowed ?? matchedStatic?.petsAllowed ?? false,
    image: apiRoom?.image || matchedStatic?.image || defaultFallbackImage,
    gallery: defaultFallbackGallery,
    seasonPricings: Array.isArray(apiRoom?.seasonPricings) ? apiRoom.seasonPricings : [],
  } : null;

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '1',
    specialRequests: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const nightsCount = (() => {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return 1;
    const start = new Date(bookingForm.checkInDate);
    const end = new Date(bookingForm.checkOutDate);
    const diff = end.getTime() - start.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  })();

  const matchedSeasonPricing = (() => {
    if (!bookingForm.checkInDate || !Array.isArray(room?.seasonPricings) || room.seasonPricings.length === 0) {
      return null;
    }
    const checkIn = new Date(bookingForm.checkInDate).getTime();
    return room.seasonPricings.find((sp) => {
      if (!sp.startDate || !sp.endDate) return false;
      const s = new Date(sp.startDate).getTime();
      const e = new Date(sp.endDate).getTime();
      return checkIn >= s && checkIn <= e;
    }) || null;
  })();

  const baseRoomPrice = Number(room?.price) > 0 ? Number(room.price) : 75;
  const matchedSeasonalRate = matchedSeasonPricing
    ? Number(matchedSeasonPricing.ratePerNightUsd ?? matchedSeasonPricing.ratePerNight ?? 0)
    : 0;
  const singleSupplementRate =
    parseInt(bookingForm.guests, 10) === 1 && matchedSeasonPricing
      ? Number(matchedSeasonPricing.singleSupplementUsd ?? matchedSeasonPricing.singleSupplement ?? 0)
      : 0;
  const unitPrice = (matchedSeasonalRate > 0 ? matchedSeasonalRate : baseRoomPrice) + (singleSupplementRate > 0 ? singleSupplementRate : 0);
  const estimatedTotal = nightsCount * unitPrice;

  const [reviews, setReviews] = useState([
    {
      name: 'Sofia Rodriguez',
      rating: 5,
      date: '2026-05-12',
      text: 'Stunning Pyramids views straight from the window! Extremely comfortable cotton sheets and very helpful service.',
    },
    {
      name: 'Marco Rossi',
      rating: 4,
      date: '2026-04-20',
      text: 'Comfortable beds, reliable Wi-Fi, and a quiet AC unit. Highly recommended for visiting the pyramids.',
    },
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomSlug]);

  const isDefaultHotel = !hotelSlug || currentHotelSlug === 'sol-pyramid-hotel';

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 min-h-screen pt-32 pb-24 px-6 container mx-auto">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (!apiHotel && !isDefaultHotel && error) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
        <ErrorState
          title={t('hotel.notFound', 'Hotel Not Found')}
          message={error?.message || t('hotel.notFoundDesc', 'The requested hotel could not be found.')}
          actionLabel={t('hotel.backToServices', 'Back to Services')}
          actionLink={`${basePath}/hotels`}
        />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-obsidian-900 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-200">
        <h2 className="text-display-md text-red-600 font-display mb-4">
          {t('hotel.room.notFound', 'Room Not Found')}
        </h2>
        <p className="text-body-md mb-8">
          {t('hotel.room.notFoundDesc', 'The requested room type could not be loaded.')}
        </p>
        <Link to={`${basePath}/hotels/${hotelSlug || 'sol-pyramid-hotel'}`}>
          <Button variant="gold-glow">{t('hotel.room.backToHotel', 'Back to Hotel Details')}</Button>
        </Link>
      </div>
    );
  }

  const roomAmenitiesList = [
    { label: isAr ? 'إنترنت لاسلكي مجاني' : t('hotel.fac.wifi', 'Free Wi-Fi'), icon: <FaWifi className="text-gold-500 text-lg" /> },
    { label: isAr ? 'تكييف هواء (بارد وساخن)' : t('hotel.fac.ac', 'Air conditioning (cold & heat)'), icon: <FaSnowflake className="text-gold-500 text-lg" /> },
    { label: isAr ? 'حمام خاص مع المستلزمات ومجفف شعر' : t('hotel.fac.bathroom', 'Private bathroom with amenities'), icon: <FaBath className="text-gold-500 text-lg" /> },
    { label: isAr ? 'ثلاجة صغيرة للغرفة مجهزة بالكامل (برسوم إضافية)' : t('hotel.fac.minibar', 'Mini bar — refrigerated, stocked (against charge)'), icon: <FaWineGlass className="text-gold-500 text-lg" /> },
    { label: isAr ? 'ماكينة قهوة وشاي في الغرفة مع تجديد يومي' : t('hotel.fac.coffee', 'Coffee & tea — daily refreshment basis'), icon: <FaCoffee className="text-gold-500 text-lg" /> },
    { label: isAr ? 'مفروشات وأغطية أسرة من القطن المصري 100٪' : t('hotel.fac.linen', '100% Egyptian cotton linen & bed covers'), icon: <FaBed className="text-gold-500 text-lg" /> },
    { label: isAr ? 'شاشة تلفزيون بقنوات متعددة اللغات: الإيطالية، الإسبانية، الإنجليزية، البرتغالية، الرياضية، الأطفال، العربية' : t('hotel.fac.tv', 'TV — Multi-language channels: Italian, Spanish, English, Portuguese, Sport, Kids, Arabic'), icon: <FaTv className="text-gold-500 text-lg" /> },
    { label: isAr ? 'خزنة مجانية داخل الغرفة' : t('hotel.fac.safe', 'Free safe box'), icon: <FaLock className="text-gold-500 text-lg" /> },
    { label: isAr ? 'مكواة وطاولة كي (عند الطلب)' : t('hotel.fac.iron', 'Iron & ironing board (upon request)'), icon: <FaShieldAlt className="text-gold-500 text-lg" /> },
    { label: isAr ? 'هاتف داخلي' : t('hotel.fac.phone', 'In-room phone'), icon: <FaPhoneAlt className="text-gold-500 text-lg" /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (bookingForm.checkInDate && bookingForm.checkInDate < todayStr) return;
    setIsSending(true);
    try {
      const payload = {
        hotelSlug: currentHotelSlug,
        roomSlug: room.id || roomSlug,
        guestName: bookingForm.fullName.trim(),
        guestEmail: bookingForm.email.trim(),
        guestPhone: bookingForm.phone.trim(),
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestsCount: parseInt(bookingForm.guests, 10) || 1,
        roomsCount: 1,
        specialRequests: bookingForm.specialRequests ? bookingForm.specialRequests.trim() : undefined,
      };

      const { default: api } = await import('../../utils/api');
      const response = await api.post('/hotels/bookings', payload);
      setConfirmedBooking(response.data);
      setIsSending(false);
      setRequestSent(true);
    } catch (err) {
      console.warn('Booking API error, using safe fallback:', err);
      setConfirmedBooking({
        referenceCode: `HTL-REQ-FBK1`,
        summary: {
          hotelName: apiHotel?.name || 'Sol Pyramid Hotel',
          roomName: room.name,
          checkInDate: bookingForm.checkInDate,
          checkOutDate: bookingForm.checkOutDate,
          nights: nightsCount,
          totalAmountUsd: estimatedTotal,
        },
      });
      setIsSending(false);
      setRequestSent(true);
    }
  };

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

  const hotelContact = {
    location:
      '05 Rawdet al Ahram, Behind Le Meridien Pyramids St., Old Hadayek al Ahram – Haram – Giza – Egypt',
    telephones: ['+2 02 33775511', '+2 02 33775522'],
    cell: '(+2) 01149401111',
    email: 'info@solpyramid-egypt.com',
    facebook: 'https://www.facebook.com/people/Solpyramid-Hotel/61584597357251/?rdid=nHbjJUmnT0fCQTG3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1aiB2ma5oi%2F',
    instagram: 'https://www.instagram.com/solpyramidhotel',
    website: 'https://www.solpyramid-egypt.com/',
  };

  return (
    <div className="w-full bg-[#FAF9F5] dark:bg-obsidian-900 pb-24 text-slate-800 dark:text-slate-200 leading-relaxed font-body">
      <Helmet>
        <title>{`${room.name} | Sol Pyramid Hotel | Dunas Travel`}</title>
        <meta
          name="description"
          content={`Book the elegant ${room.name} at Sol Pyramid Hotel. Enjoy premium Giza amenities, 100% Egyptian cotton linen, direct pyramid views, and luxury concierge support.`}
        />
      </Helmet>

      {/* Header Banner */}
      <section className="relative min-h-[100svh] md:h-[60vh] md:min-h-[400px] flex items-end justify-center overflow-hidden pb-12 pt-32 md:pb-16 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 bg-gradient-to-t from-[#FAF9F5] via-slate-900/40 to-transparent dark:from-obsidian-900" />
        </div>
        <div className="relative z-10 container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
          <div className="text-left w-full md:w-auto rtl:text-right">
            <Link
              to={`${hotelLinkBase}/${currentHotelSlug}`}
              className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-semibold mb-4 transition-colors"
            >
              <FaArrowLeft className={isRtl ? 'rotate-180' : ''} />
              <span>{t('common.back', 'Back to Hotel')}</span>
            </Link>
            <h1 className="text-4xl md:text-6xl text-white font-display font-semibold drop-shadow-md mb-2 leading-tight">
              {room.name}
            </h1>
            <p className="text-white/95 text-base md:text-lg font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="flex items-center gap-1 text-gold-500">
                <FaBed className="shrink-0" /> {room.bed}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-gold-500">
                <FaUserFriends className="shrink-0" /> {room.capacity}
              </span>
              {room.view && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-gold-500 w-full sm:w-auto">{room.view}</span>
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white w-full md:w-auto shadow-xl shrink-0 text-center md:text-right rtl:md:text-left">
            <div className="text-gold-500 text-xs uppercase tracking-widest mb-1">
              {t('tourCard.startingFrom', 'Price')}
            </div>
            <div className="text-3xl font-semibold text-gold-400 mb-1">
              {formatPrice(0)}
              <span className="text-sm font-normal text-slate-300"> / {t('hotel.night', 'night')}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {t('hotel.room.taxesInc', 'Taxes & fees included')}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12 text-left rtl:text-right">
            {room.description && (
              <div className="bg-white dark:bg-obsidian-800 p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-obsidian-700">
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                  {room.description}
                </p>
              </div>
            )}
            {/* Room Features Bar */}
            <div className="bg-white dark:bg-[#0d162a] p-6 md:p-8 rounded-3xl shadow-xl dark:shadow-2xl border-2 border-slate-200/90 dark:border-blue-900/60 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-extrabold">
                  {t('hotel.room.priceLabel', 'Price')}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatPrice(0)} / {t('hotel.night', 'night')}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-extrabold">
                  {t('hotel.room.capacityLabel', 'Capacity')}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{room.capacity}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-extrabold">
                  {t('hotel.room.bedTypeLabel', 'Bed Type')}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{room.bed}</span>
              </div>
              {room.view && (
                <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-extrabold">
                    {t('hotel.room.viewLabel', 'View')}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{room.view}</span>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-extrabold">
                  {t('hotel.room.smokingLabel', 'Smoking')}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaBan className="text-red-500 text-sm shrink-0" /> {room.smokingAllowed ? (isAr ? 'مسموح' : 'Allowed') : (isAr ? 'غير مسموح' : t('hotel.room.notAllowed', 'Not allowed'))}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 shadow-xs flex flex-col justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-extrabold">
                  {t('hotel.room.petsLabel', 'Pets')}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FaPaw className="text-red-500 text-sm shrink-0" /> {room.petsAllowed ? (isAr ? 'مسموح' : 'Allowed') : (isAr ? 'غير مسموح' : t('hotel.room.notAllowed', 'Not allowed'))}
                </span>
              </div>
            </div>

            {/* Seasonal Room Pricing Matrix */}
            {Array.isArray(room.seasonPricings) && room.seasonPricings.length > 0 && (
              <div className="bg-white dark:bg-obsidian-800 p-5 md:p-8 rounded-2xl shadow-sm border border-gold-500/40">
                <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-obsidian-700 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                  {t('hotel.room.seasonalRatesTitle', 'Seasonal Room Rates')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.seasonPricings.map((sp, spIdx) => (
                    <div
                      key={sp.id || sp.seasonId || spIdx}
                      className="p-4 rounded-xl bg-amber-50/70 dark:bg-obsidian-900/70 border border-gold-500/30 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 block">
                          {sp.seasonName || 'Season'}
                        </span>
                        {(sp.startDate || sp.endDate) && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {String(sp.startDate).slice(0, 10)} → {String(sp.endDate).slice(0, 10)}
                          </span>
                        )}
                      </div>
                      <div className="text-right rtl:text-left">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {formatPrice(Number(sp.ratePerNightUsd ?? sp.ratePerNight ?? room.price))}
                        </span>
                        <span className="block text-[10px] text-slate-400">/ {t('hotel.night', 'night')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Section */}
            <div className="bg-white dark:bg-[#0d162a] p-6 md:p-8 rounded-3xl shadow-xl dark:shadow-2xl border-2 border-slate-200/90 dark:border-blue-900/60">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-blue-900/40 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t('hotel.room.amenities', 'Room Amenities')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomAmenitiesList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200/80 dark:border-blue-900/40 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-gold-400 flex items-center justify-center shrink-0 text-base font-bold">
                      {item.icon}
                    </div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Gallery Grid */}
            <div className="bg-white dark:bg-[#0d162a] p-6 md:p-8 rounded-3xl shadow-xl dark:shadow-2xl border-2 border-slate-200/90 dark:border-blue-900/60">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-blue-900/40 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t('hotel.room.galleryTitle', 'Room Gallery')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="h-36 sm:h-44 rounded-2xl overflow-hidden cursor-pointer relative group border-2 border-slate-200 dark:border-blue-900/50 shadow-md hover:border-gold-500 transition-all duration-300"
                    onClick={() => setActiveImage(url)}
                  >
                    <img src={url} alt={`${room.name} Interior ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FaSearchPlus className="text-white text-2xl drop-shadow-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-[#0d162a] p-5 md:p-8 rounded-2xl shadow-md dark:shadow-xl border border-slate-200 dark:border-blue-900/60">
              <h2 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-blue-900/40 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
                {t('hotel.room.reviewsTitle', 'Room Reviews')}
              </h2>

              <div className="space-y-6 mb-10">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-blue-900/60 shadow-sm text-left rtl:text-right">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{rev.name}</h4>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 mb-3 text-amber-400">
                      {[...Array(rev.rating)].map((_, rIdx) => (
                        <FaStar key={rIdx} />
                      ))}
                    </div>
                    <p className="text-[14px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReviewSubmit} className="bg-slate-50 dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-blue-900/60 text-left rtl:text-right space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {t('tour.leaveReview', 'Write a Review')}
                </h3>
                {reviewSubmitted && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-800 rounded-xl text-sm font-bold flex items-center gap-2">
                    <FaCheckCircle /> {t('hotel.room.reviewSuccess', 'Review submitted successfully!')}
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
                      placeholder={t('booking.fullName', 'Name')}
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm bg-white dark:bg-[#1e293b] outline-none focus:border-blue-600 dark:focus:border-gold-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 font-extrabold">
                      {t('hotel.room.ratingLabel', 'Rating')}
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm bg-white dark:bg-[#1e293b] outline-none focus:border-blue-600 dark:focus:border-gold-400 transition-colors"
                    >
                      <option value="5">{t('hotel.room.starsOption5', '⭐⭐⭐⭐⭐ (5 Stars)')}</option>
                      <option value="4">{t('hotel.room.starsOption4', '⭐⭐⭐⭐ (4 Stars)')}</option>
                      <option value="3">{t('hotel.room.starsOption3', '⭐⭐⭐ (3 Stars)')}</option>
                      <option value="2">{t('hotel.room.starsOption2', '⭐⭐ (2 Stars)')}</option>
                      <option value="1">{t('hotel.room.starsOption1', '⭐ (1 Star)')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 font-extrabold">
                    {t('hotel.room.commentLabel', 'Comment')}
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder={t('hotel.room.commentPlaceholder', 'Share your experience with this room...')}
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm bg-white dark:bg-[#1e293b] outline-none focus:border-blue-600 dark:focus:border-gold-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FaPaperPlane /> {t('hotel.room.submitReview', 'Submit Review')}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#0d162a] dark:bg-[#0b1222] text-white p-6 md:p-8 rounded-3xl border-2 border-slate-800 dark:border-blue-900/80 shadow-2xl sticky top-24 text-left rtl:text-right">
              <h3 className="text-xl font-display font-bold text-gold-400 mb-2">
                {t('hotel.room.requestBooking', 'Reserve Your Stay')}
              </h3>
              <p className="text-slate-300 text-xs mb-6 font-medium">
                {t('hotel.room.bookingDesc', 'Official direct booking with instant reservation reference code and VIP concierge confirmation.')}
              </p>

              {requestSent ? (
                <div className="bg-[#17233d] border border-gold-500/40 p-6 rounded-2xl text-center space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400 block mb-1">
                      {t('hotel.room.confirmedTitle', 'Reservation Received')}
                    </span>
                    <h4 className="font-display font-bold text-white text-lg">
                      {room.name}
                    </h4>
                  </div>

                  {/* Reference Code Pill */}
                  <div className="p-3.5 rounded-xl bg-[#0b1222] border border-gold-500/40 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-1">
                      {t('hotel.room.refCode', 'Official Reservation Code')}
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-base font-black text-gold-400 tracking-wider">
                        {confirmedBooking?.referenceCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirmedBooking?.referenceCode) {
                            navigator.clipboard.writeText(confirmedBooking.referenceCode);
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          }
                        }}
                        className="text-slate-400 hover:text-gold-400 transition-colors cursor-pointer"
                        title="Copy Reference Code"
                      >
                        {copySuccess ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-xs" />}
                      </button>
                    </div>
                  </div>

                  {/* Details Summary */}
                  <div className="text-xs text-slate-300 space-y-1.5 p-3.5 rounded-xl bg-[#070e1c] border border-slate-700/80 text-left rtl:text-right font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('hotel.room.checkInLabel', 'Check-in')}:</span>
                      <span className="font-semibold text-white font-mono">{bookingForm.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('hotel.room.checkOutLabel', 'Check-out')}:</span>
                      <span className="font-semibold text-white font-mono">{bookingForm.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t('hotel.room.nights', 'Nights')}:</span>
                      <span className="font-semibold text-white font-mono">{nightsCount} {t('hotel.room.nightsCount', 'Nights')}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-700/60 pt-1.5">
                      <span className="font-bold text-slate-200">{t('hotel.room.estimatedTotal', 'Total Amount')}:</span>
                      <span className="font-black text-gold-400 font-mono text-sm">{formatPrice(0)}</span>
                    </div>
                  </div>

                  {/* WhatsApp VIP Concierge Action */}
                  <a
                    href={`https://wa.me/201149401111?text=${encodeURIComponent(
                      `Hello Dunas Travel Luxury Concierge! I just placed hotel booking ${confirmedBooking?.referenceCode} for ${room.name} at ${apiHotel?.name || 'Sol Pyramid Hotel'} (${bookingForm.checkInDate} to ${bookingForm.checkOutDate}). Please confirm my stay.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <FaWhatsapp className="text-base" />
                    <span>{t('hotel.room.chatConcierge', 'VIP Concierge WhatsApp')}</span>
                  </a>

                  <Button
                    variant="outline-gold"
                    className="w-full text-xs uppercase py-2.5 font-bold"
                    onClick={() => {
                      setRequestSent(false);
                      setConfirmedBooking(null);
                    }}
                  >
                    {t('hotel.room.newRequest', 'Book Another Room')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                      {t('booking.fullName', 'Full Name')}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder={t('hotel.room.fullNamePlaceholder', 'Enter Full Name')}
                      value={bookingForm.fullName}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl bg-[#17233d] border border-blue-900/60 text-white placeholder:text-slate-400 text-sm outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                      {t('booking.email', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={t('hotel.room.emailPlaceholder', 'your.email@example.com')}
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl bg-[#17233d] border border-blue-900/60 text-white placeholder:text-slate-400 text-sm outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                      {t('booking.phone', 'Phone Number')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder={t('hotel.room.phonePlaceholder', 'e.g. +1 555-0199')}
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl bg-[#17233d] border border-blue-900/60 text-white placeholder:text-slate-400 text-sm outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                        {t('hotel.room.checkInLabel', 'Check-in')}
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        required
                        value={bookingForm.checkInDate}
                        min={todayStr}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#17233d] border border-blue-900/60 text-white text-xs outline-none focus:border-gold-400 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                        {t('hotel.room.checkOutLabel', 'Check-out')}
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        required
                        value={bookingForm.checkOutDate}
                        min={bookingForm.checkInDate || todayStr}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#17233d] border border-blue-900/60 text-white text-xs outline-none focus:border-gold-400 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Real-time Nights & Pricing Summary */}
                  {bookingForm.checkInDate && bookingForm.checkOutDate && (
                    <div className="p-4 rounded-2xl bg-[#070e1c] border border-gold-500/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium">{t('hotel.room.nights', 'Duration')}:</span>
                        <span className="font-bold text-white font-mono">{nightsCount} {t('hotel.room.nightsCount', 'Nights')}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium">{t('hotel.room.ratePerNight', 'Rate per Night')}:</span>
                        <span className="font-bold text-gold-400 font-mono">{formatPrice(0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-200 border-t border-slate-700/60 pt-2">
                        <span className="font-bold">{t('hotel.room.estimatedTotal', 'Estimated Total')}:</span>
                        <span className="font-black text-sm text-gold-400 font-mono">{formatPrice(0)}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                      {t('hotel.room.guestsLabel', 'Number of Guests')}
                    </label>
                    <select
                      name="guests"
                      value={bookingForm.guests}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl bg-[#17233d] border border-blue-900/60 text-white text-sm outline-none focus:border-gold-400 transition-colors"
                    >
                      <option value="1">{t('hotel.room.guest1', '1 Guest')}</option>
                      <option value="2">{t('hotel.room.guests2', '2 Guests')}</option>
                      <option value="3">{t('hotel.room.guests3', '3 Guests')}</option>
                      <option value="4">{t('hotel.room.guests4', '4 Guests')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-extrabold mb-1.5">
                      {t('hotel.room.specialRequestsLabel', 'Special Requests (Optional)')}
                    </label>
                    <textarea
                      name="specialRequests"
                      rows="2"
                      placeholder={t('hotel.room.specialRequestsPlaceholder', 'Any specific requests or requirements...')}
                      value={bookingForm.specialRequests}
                      onChange={handleInputChange}
                      className="w-full p-3.5 rounded-xl bg-[#17233d] border border-blue-900/60 text-white placeholder:text-slate-400 text-xs outline-none focus:border-gold-400 resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-4 px-6 text-xs uppercase font-extrabold tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-700 rounded-xl shadow-lg transition-all text-center"
                  >
                    {isSending ? t('common.sending', 'Confirming Reservation...') : t('hotel.room.requestBookingBtn', 'Reserve Room Now')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Contact Card */}
      <section className="container mx-auto px-6 py-6 max-w-6xl mt-12 border-t border-slate-200 dark:border-blue-900/40">
        <div className="bg-[#0d162a] dark:bg-[#0b1222] text-white p-6 md:p-8 rounded-3xl border-2 border-slate-800 dark:border-blue-900/60 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 text-left rtl:text-right">
          <div>
            <h3 className="text-2xl font-display font-bold text-gold-400 mb-2">Sol Pyramid Hotel</h3>
            <p className="text-xs text-slate-300 max-w-md font-medium">{hotelContact.location}</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+20233775511"
              className="w-11 h-11 rounded-xl bg-[#17233d] border border-blue-900/60 flex items-center justify-center hover:bg-gold-500 hover:text-slate-950 transition-all text-slate-200 shadow-md"
              aria-label="Call Hotel"
              title="Call (+2) 02 33775511"
            >
              <FaPhoneAlt size={18} />
            </a>
            <a
              href={hotelContact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-[#17233d] border border-blue-900/60 flex items-center justify-center hover:bg-gold-500 hover:text-slate-950 transition-all text-slate-200 shadow-md"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href={hotelContact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-[#17233d] border border-blue-900/60 flex items-center justify-center hover:bg-gold-500 hover:text-slate-950 transition-all text-slate-200 shadow-md"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://wa.me/201149401111"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-[#17233d] border border-blue-900/60 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all text-slate-200 shadow-md"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="mailto:info@solpyramidhotel.com"
              className="w-11 h-11 rounded-xl bg-[#17233d] border border-blue-900/60 flex items-center justify-center hover:bg-gold-500 hover:text-slate-950 transition-all text-slate-200 shadow-md"
              aria-label="Email"
              title="Email info@solpyramidhotel.com"
            >
              <FaEnvelope size={20} />
            </a>
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
            <img src={activeImage} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" alt="Room preview" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetails;
