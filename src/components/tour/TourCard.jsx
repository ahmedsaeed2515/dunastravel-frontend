import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaRegHeart, 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaArrowRight, 
  FaArrowLeft 
} from 'react-icons/fa';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../hooks/useWishlist';
import { trackEvent } from '../../utils/analytics';
import { 
  resolveTourTitle, 
  resolveTourDuration, 
  resolveTourOverview, 
  resolveLocalizedText, 
  resolveTourHeroImage 
} from '../../utils/titleHelper';

const marketFlag = (market) => {
  const flags = { Brasil: '🇧🇷', Italia: '🇮🇹', Spain: '🇪🇸', Egypt: '🇪🇬' };
  return flags[market] ?? '🌍';
};

/* Multilingual destination name lookup — slug → { ar, en, es, pt, it } */
const DESTINATION_NAMES = {
  egypt:                  { ar: 'مصر',        en: 'Egypt',    es: 'Egipto',  pt: 'Egito',    it: 'Egitto'  },
  turkey:                 { ar: 'تركيا',      en: 'Turkey',   es: 'Turquía', pt: 'Turquia',  it: 'Turchia' },
  dubai:                  { ar: 'دبي',        en: 'Dubai',    es: 'Dubái',   pt: 'Dubai',    it: 'Dubai'   },
  emirates:               { ar: 'الإمارات',   en: 'Emirates', es: 'Emiratos',pt: 'Emirados',  it: 'Emirati' },
  uae:                    { ar: 'الإمارات',   en: 'UAE',      es: 'EAU',     pt: 'EAU',      it: 'EAU'     },
  'united arab emirates': { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates', es: 'Emiratos Árabes Unidos', pt: 'Emirados Árabes Unidos', it: 'Emirati Arabi Uniti' },
  jordan:                 { ar: 'الأردن',     en: 'Jordan',   es: 'Jordania',pt: 'Jordânia', it: 'Giordania'},
  tunisia:                { ar: 'تونس',       en: 'Tunisia',  es: 'Túnez',   pt: 'Tunísia',  it: 'Tunisia' },
  greece:                 { ar: 'اليونان',    en: 'Greece',   es: 'Grecia',  pt: 'Grécia',   it: 'Grecia'  },
  morocco:                { ar: 'المغرب',     en: 'Morocco',  es: 'Marruecos',pt:'Marrocos', it: 'Marocco' },
  spain:                  { ar: 'إسبانيا',    en: 'Spain',    es: 'España',  pt: 'Espanha',  it: 'Spagna'  },
  brazil:                 { ar: 'البرازيل',   en: 'Brazil',   es: 'Brasil',  pt: 'Brasil',   it: 'Brasile' },
  italy:                  { ar: 'إيطاليا',    en: 'Italy',    es: 'Italia',  pt: 'Itália',   it: 'Italia'  },
};

const resolveDestinationName = (dest, lang) => {
  if (!dest) return '';
  const slug = String(dest).toLowerCase().trim();
  const entry = DESTINATION_NAMES[slug];
  if (entry) return entry[lang] || entry.en || dest;
  return dest;
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } 
  }
};




const contentStaggerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: 0.15 } 
  }
};

const TourCard = ({
  tour,
  linkBase = '/tours',
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isRtl = lang.startsWith('ar');
  const { formatPrice } = useCurrency();
  const { isFavorite, toggleFavorite } = useWishlist();
  const navigate = useNavigate();

  if (!tour) return null;

  const title = resolveTourTitle(tour, t, lang);
  const overview = resolveTourOverview(tour, t, lang);
  const duration = resolveTourDuration(tour, t, lang);
  const durationStr = typeof duration === 'string' ? duration : String(duration || '');
  const durationLabel = durationStr.includes('/') ? durationStr.split('/')[0].trim() : durationStr;

  const resolvePrice = (tData) => Number(tData?.price ?? tData?.basePriceUsd ?? 0);
  const displayPrice = resolvePrice(tour);
  const tourImage =
    resolveTourHeroImage(tour) ||
    (typeof tour.heroImageUrl === 'string' ? tour.heroImageUrl.trim() : null) ||
    (Array.isArray(tour.images) && tour.images.length > 0 ? (typeof tour.images[0] === 'string' ? tour.images[0] : tour.images[0]?.imageUrl) : null);

  const codeText = resolveLocalizedText(tour.code, t, lang);
  const minPaxText = resolveLocalizedText(tour.minPax, t, lang);

  // Destination name: try slug-based translation first, then fall back to generic resolve
  const rawDest = tour.destination || tour.subtitle || '';
  const destinationText =
    resolveDestinationName(rawDest, lang) ||
    resolveLocalizedText(rawDest, t, lang) ||
    (isRtl ? 'مصر' : 'Egypt');

  const ratingValue = tour.rating || 5.0;

  const detailUrl = `${linkBase}/${tour.slug || tour.id}`;
  const fav = isFavorite(tour.id || tour.slug);

  const bookNowLabels = {
    ar: 'احجز الآن',
    es: 'RESERVAR AHORA',
    pt: 'RESERVAR AGORA',
    it: 'PRENOTA ORA',
    en: 'BOOK NOW',
  };
  const langKey = (lang || 'en').substring(0, 2).toLowerCase();
  const bookNowText = t('tourCard.btnBookNow', bookNowLabels[langKey] || 'BOOK NOW');

  const handleCardClick = () => {
    trackEvent('tour_card_click', {
      tourSlug: tour.slug,
      interfaceSlug: typeof window !== 'undefined' ? sessionStorage.getItem('dunas_origin_interface') : undefined,
    });
    navigate(detailUrl);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(tour);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="populer-single-box style-classic group relative flex flex-col h-full bg-white dark:bg-[#121829] border border-primary-500/20 dark:border-white/10 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_24px_50px_rgba(245,166,35,0.28)] hover:border-gold-500 hover:-translate-y-2.5 transition-all duration-500 cursor-pointer text-left rtl:text-right"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Dunas Corner Accent Ornament (.about-sp) */}
      <div className="about-sp">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
          <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
          <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        </svg>
      </div>

      {/* Dunas Thumbnail (.populer-thumb) */}
      <div className="populer-thumb relative h-[255px] bg-gray-100 dark:bg-obsidian-900 dunas-img-container overflow-hidden rounded-t-2xl">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle wishlist"
          className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 z-20 w-10 h-10 rounded-full bg-primary-950/80 backdrop-blur-md flex items-center justify-center border border-gold-500/40 text-gold-400 hover:scale-110 active:scale-95 hover:bg-gold-500 hover:text-primary-950 transition-all duration-300 shadow-lg cursor-pointer"
        >
          {fav ? <FaHeart className="text-red-500" size={16} /> : <FaRegHeart size={16} />}
        </button>

        {/* Duration Badge */}
        {durationLabel && (
          <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-primary-950/90 backdrop-blur-md text-white text-[12px] font-extrabold px-3.5 py-1.5 rounded-full border border-gold-500/50 shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
            <FaClock className="text-gold-400 text-xs" />
            <span className="text-white font-extrabold">{durationLabel}</span>
          </div>
        )}

        {/* Custom Badge */}
        {tour.badge && (
          <div className="absolute top-14 left-3.5 rtl:left-auto rtl:right-3.5 z-20 bg-gold-500 text-primary-950 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            {resolveLocalizedText(tour.badge, t, lang)}
          </div>
        )}

        {/* Market Flag */}
        {tour.market && (
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 bg-primary-950/60 backdrop-blur-md text-xs px-2.5 py-1 rounded-full border border-white/10 shadow-md select-none">
            {marketFlag(tour.market)}
          </div>
        )}

        {/* Image — CSS controls the hover zoom */}
        <Link to={detailUrl} className="block w-full h-full overflow-hidden">
          {tourImage ? (
            <img
              src={tourImage}
              alt={`${title} — ${destinationText}`}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              width="400"
              height="255"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/imgs/egyothero.webp';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-900 px-6 text-center text-sm text-gold-200">
              {t('tour.imageUnavailable', 'No image has been added for this tour.')}
            </div>
          )}
        </Link>
      </div>

      {/* Dunas Content Section (.populer-contnet) */}
      <motion.div 
        className="populer-contnet flex flex-col flex-grow bg-white dark:bg-[#121829]"
        variants={contentStaggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Title */}
        <Link to={detailUrl}>
          <h3 
            className="popular-title text-black dark:text-ivory-50 font-bold text-[22px] leading-snug line-clamp-2 mb-2.5" 
            style={{ fontFamily: "'Playfair Display', 'Cairo', serif", color: '#000000' }}
          >
            {title}
          </h3>
        </Link>

        {/* Location */}
        <div className="populer-list mb-2">
          <span className="flex items-center gap-2 text-black dark:text-ivory-200 font-bold text-[14px]">
            <FaMapMarkerAlt className="text-gold-500 text-sm flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="truncate text-black dark:text-ivory-100">{destinationText}</span>
          </span>
        </div>

        {/* Overview Paragraph */}
        <p 
          className="text-black dark:text-ivory-200 font-bold text-[14px] leading-relaxed line-clamp-2 mb-4 flex-grow" 
          style={{ 
            color: '#000000',
            opacity: 1,
            fontWeight: 700,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '2.8em',
            lineHeight: '1.4em'
          }}
        >
          {overview}
        </p>

        {/* Days & Ratings */}
        <div className="flex items-center justify-between bg-gray-100/90 dark:bg-primary-950/60 rounded-xl px-3.5 py-2.5 mb-5 border border-gray-300/60 dark:border-white/5 transition-colors group-hover:border-gold-500/40">
          {/* Rating */}
          <div className="popular-ratting flex items-center gap-1.5">
            <ul className="flex items-center gap-1">
              <li className="text-[#FF974D] text-xs flex gap-0.5"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></li>
              <li><span className="text-[14px] font-extrabold text-black dark:text-gold-400 ml-1 rtl:mr-1">({ratingValue.toFixed(1)})</span></li>
            </ul>
          </div>

          {/* Pax / Group Tag */}
          <div className="populer-days flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-gold-300">
            <FaUsers className="text-gold-500" />
            <span className="text-black dark:text-gold-300">{minPaxText || (isRtl ? 'شخصين فأكثر' : 'Min 2 Pax')}</span>
          </div>
        </div>

        {/* Footer CTA & Price Section (.populer-btn-and-days) */}
        <div className="populer-btn-and-days pt-3.5 border-t border-gray-200 dark:border-white/10 mt-auto flex items-center justify-between gap-3">
          {/* Price - Displayed on the right side in RTL, opposite to Book Now button */}
          <div className="flex flex-col text-start">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('tourCard.startingFrom', 'يبدأ من')}
            </span>
            <div className="flex items-baseline gap-1 text-[#D97706] dark:text-gold-400 font-extrabold text-lg md:text-xl">
              <span>{displayPrice > 0 ? formatPrice(displayPrice) : t('tourCard.onRequest', 'On Request')}</span>
              {displayPrice > 0 && (
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  / {t('tourCard.perPerson', 'للشخص')}
                </span>
              )}
            </div>
          </div>

          {/* Book Now Button */}
          <div className="populer-btn defult-btn shrink-0">
            <Link 
              to={detailUrl} 
              className="group/btn"
              aria-label={`${bookNowText} - ${title}`}
            >
              <span>{bookNowText}</span>
              {isRtl ? (
                <FaArrowLeft className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
              ) : (
                <FaArrowRight className="text-xs inline-block ml-2 rtl:mr-2 transform group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              )}
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(TourCard);
