import { useState, useRef, useMemo, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useTours } from "../../hooks/useTours";
import { useMediaShowcase } from "../../hooks/useMedia";
const PhotoShowcaseCarousel = lazy(() => import("./PhotoShowcaseCarousel"));
const VideoShowcaseCarousel = lazy(() => import("./VideoShowcaseCarousel"));
import { useDestinations } from "../../hooks/useDestinations";
import { useServices } from "../../hooks/useServices";
import { transportation as fallbackTransportation } from "../../data/transportation";
import AnimatedCounter from "../common/AnimatedCounter";
import HomeHeroSection from "./HomeHeroSection";
import useInViewport from "../../hooks/useInViewport";
import { useCurrency } from "../../context/CurrencyContext";
import api from "../../utils/api";
import {
  resolveLocalizedText,
  resolveTourOverview,
  resolveTourTitle,
  resolveTourDuration,
  resolveTourHeroImage,
} from "../../utils/titleHelper";
import TourCard from "../tour/TourCard";
import {
  FaCalendarAlt,
  FaSuitcase,
  FaUsers,
  FaMapMarkedAlt,
  FaGlobe,
  FaCompass,
  FaClock,
  FaStar,
  FaTimes,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeadset,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";


const _destinationsData = [
  {
    id: "egypt",
    nameKey: "home.destEgypt",
    descKey: "home.destEgyptDesc",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/8_mpyvu4.jpg",
  },
  {
    id: "turkey",
    nameKey: "home.destTurkey",
    descKey: "home.destTurkeyDesc",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "dubai",
    nameKey: "home.destDubai",
    descKey: "home.destDubaiDesc",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "jordan",
    nameKey: "home.destJordan",
    descKey: "home.destJordanDesc",
    image: "https://pport.com/wp-content/uploads/2020/05/jordan-88.jpg",
  },
  {
    id: "morocco",
    nameKey: "home.destMorocco",
    descKey: "home.destMoroccoDesc",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "tunisia",
    nameKey: "home.destTunisia",
    descKey: "home.destTunisiaDesc",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "greece",
    nameKey: "home.destGreece",
    descKey: "home.destGreeceDesc",
    image: "https://static.arrajol.com/styles/800x533/public/2020/11/14/287336-80888809099.jpg",
  },
  {
    id: "holy-land",
    nameKey: "home.destHolyLand",
    descKey: "home.destHolyLandDesc",
    image: "/images/holy-land.webp",
  },
];

const _packagesData = [
  {
    id: "classic-program",
    nameKey: "egyptPackages.classic.name",
    nameDefault: "Classic Egypt Program",
    descKey: "egyptPackages.classic.desc",
    descDefault: "Timeless wonders of Cairo, Pyramids & Luxury Nile Cruise",
    badgeKey: "egyptPackages.classic.badge",
    badgeDefault: "Top Best Seller",
    durationKey: "egyptPackages.classic.duration",
    durationDefault: "8 Days / 7 Nights",
    tag1Key: "egyptPackages.classic.tag1",
    tag2Key: "egyptPackages.classic.tag2",
    tag3Key: "egyptPackages.classic.tag3",
    price: 1290,
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/w_600,h_450,c_fill,q_60,f_webp/v1783029636/Classic_Program_gfal0s.jpg",
    link: "/programs/classic/classic-program",
    featured: true,
  },
  {
    id: "honeymooners",
    nameKey: "egyptPackages.honeymooners.name",
    nameDefault: "Honeymoon & Romantic Luxury",
    descKey: "egyptPackages.honeymooners.desc",
    descDefault: "Enchanting Red Sea escapes & private Nile sunset cruises",
    badgeKey: "egyptPackages.honeymooners.badge",
    badgeDefault: "Pure Romance",
    durationKey: "egyptPackages.honeymooners.duration",
    durationDefault: "10 Days / 9 Nights",
    tag1Key: "egyptPackages.honeymooners.tag1",
    tag2Key: "egyptPackages.honeymooners.tag2",
    tag3Key: "egyptPackages.honeymooners.tag3",
    price: 1650,
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=65&fm=webp",
    link: "/programs/honeymooners",
    featured: false,
  },
  {
    id: "religious",
    nameKey: "egyptPackages.religious.name",
    nameDefault: "Holy Family & Sacred Journeys",
    descKey: "egyptPackages.religious.desc",
    descDefault: "Spiritual path along Coptic monasteries & ancient holy shrines",
    badgeKey: "egyptPackages.religious.badge",
    badgeDefault: "Spiritual Heritage",
    durationKey: "egyptPackages.religious.duration",
    durationDefault: "9 Days / 8 Nights",
    tag1Key: "egyptPackages.religious.tag1",
    tag2Key: "egyptPackages.religious.tag2",
    tag3Key: "egyptPackages.religious.tag3",
    price: 1390,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=65&fm=webp",
    link: "/programs/religious",
    featured: false,
  },
  {
    id: "multi-country",
    nameKey: "egyptPackages.multiCountry.name",
    nameDefault: "Egypt Multi-Country Combined",
    descKey: "egyptPackages.multiCountry.desc",
    descDefault: "Beyond borders: Egypt + Jordan, Turkey, Dubai or Jerusalem",
    badgeKey: "egyptPackages.multiCountry.badge",
    badgeDefault: "Grand Odyssey",
    durationKey: "egyptPackages.multiCountry.duration",
    durationDefault: "12-16 Days",
    tag1Key: "egyptPackages.multiCountry.tag1",
    tag2Key: "egyptPackages.multiCountry.tag2",
    tag3Key: "egyptPackages.multiCountry.tag3",
    price: 2450,
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/v1789341982/62de536e-2674-4518-b31c-ce74f137c119_jxxocg.jpg",
    link: "/programs/multi-country",
    featured: false,
  },
  {
    id: "extension",
    nameKey: "egyptPackages.extension.name",
    nameDefault: "Egypt Extensions & Escapes",
    descKey: "egyptPackages.extension.desc",
    descDefault: "Red Sea resorts in Hurghada, Sharm El Sheikh & Siwa Desert Oasis",
    badgeKey: "egyptPackages.extension.badge",
    badgeDefault: "Add-On Escapes ($0)",
    durationKey: "egyptPackages.extension.duration",
    durationDefault: "4 Days / 3 Nights",
    tag1Key: "egyptPackages.extension.tag1",
    tag2Key: "egyptPackages.extension.tag2",
    tag3Key: "egyptPackages.extension.tag3",
    price: 0,
    image: "https://ar.scoopempire.com/wp-content/uploads/sites/4/2026/03/pexels-vika-glitter-392079-18895967-scaled-1.jpg",
    link: "/programs/extension",
    featured: false,
  }
];

const _newDestinationsList = [
  {
    id: "egypt",
    nameAr: "مصر",
    nameEn: "Egypt",
    tagAr: "نبض النيل والأهرامات الخالدة",
    tagEn: "PHARAOHS & IMMORTAL TEMPLES",
    descAr: "رحلة عبر خمسة آلاف عام من السحر والغموض، من عظمة الجيزة إلى هدوء أسوان.",
    descEn: "A journey through five millennia of magic, from the majesty of Giza to the serenity of Aswan.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/8_mpyvu4.jpg",
    link: "/destinations/egypt"
  },
  {
    id: "turkey",
    nameAr: "تركيا",
    nameEn: "Turkey",
    tagAr: "حكاية الشرق وسحر إسطنبول",
    tagEn: "CAPPADOCIA BALLOONS & OTTOMAN LEGACY",
    descAr: "جسور الحضارة التاريخية، وشواطئ الريفييرا التركية، ومناطيد كبادوكيا الحالمة.",
    descEn: "Bridges of history, the sun-kissed Turkish Riviera, and the dreamlike balloon-filled skies of Cappadocia.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/11_xydddd.jpg",
    link: "/destinations/turkey"
  },
  {
    id: "dubai",
    nameAr: "دبي",
    nameEn: "Dubai",
    tagAr: "واحة المستقبل والرفاهية المطلقة",
    tagEn: "SKY-HIGH LUXURY & SAND DUNES",
    descAr: "ناطحات سحاب تعانق السماء، وتجارب تسوق فاخرة، وصحراء ذهبية لا تنام.",
    descEn: "Futuristic skylines, ultra-luxury retreats, and golden desert dunes that never sleep.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026772/14_z5msnu.jpg",
    link: "/destinations/dubai"
  },
  {
    id: "jordan",
    nameAr: "الأردن",
    nameEn: "Jordan",
    tagAr: "مدينة الأنباط الوردية وصحراء رم",
    tagEn: "PETRA WONDERS & BEDOUIN STARS",
    descAr: "من روعة البتراء المنحوتة في الصخر إلى هدوء وادي رم الساحر وسحر البحر الميت.",
    descEn: "From the pink-hued stone carvings of Petra to the starry silence of Wadi Rum.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/11_xydddd.jpg",
    link: "/destinations/jordan"
  },
  {
    id: "morocco",
    nameAr: "المغرب",
    nameEn: "Morocco",
    tagAr: "ألوان مراكش وعبق الأندلس",
    tagEn: "MEDINAS & ATLAS MOUNTAIN PALACES",
    descAr: "دروب فاس العتيقة، وقصور مراكش الفاخرة، وحكايات الصحراء تحت النجوم.",
    descEn: "The ancient winding streets of Fez, red palaces of Marrakech, and tales of the Sahara.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026771/10_t3dnh6.jpg",
    link: "/destinations/morocco"
  },
  {
    id: "tunisia",
    nameAr: "تونس",
    nameEn: "Tunisia",
    tagAr: "تاريخ قرطاج وجمال سيدي بو سعيد",
    tagEn: "CARTHAGE RUINS & MEDITERRANEAN BREEZE",
    descAr: "نسيم البحر الأبيض المتوسط يداعب جدران الضيعات البيضاء والزرقاء وأطلال قرطاج.",
    descEn: "Mediterranean breezes caressing whitewashed walls and the ancient columns of Carthage.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026772/15_rrczuy.jpg",
    link: "/destinations/tunisia"
  },
  {
    id: "greece",
    nameAr: "اليونان",
    nameEn: "Greece",
    tagAr: "أساطير بحر إيجة وجزر سانتوريني",
    tagEn: "SANTORINI DOMES & GREEK MYTHS",
    descAr: "قباب زرقاء ممتدة مع الأفق، ومياه فيروزية تحكي قصص الفلاسفة والآلهة.",
    descEn: "Blue domes meeting the infinite horizon, and turquoise waters whispering ancient myths.",
    image: "https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_800,c_fill/v1783026772/12_fukk6b.jpg",
    link: "/destinations/greece"
  },
  {
    id: "holyland",
    nameAr: "الأراضي المقدسة",
    nameEn: "Holy Land",
    tagAr: "مهد الأديان وعبق التاريخ",
    tagEn: "FAITH, HISTORY & SACRED PATHWAYS",
    descAr: "معالم روحية وتاريخية خالدة تروي قصص الأنبياء والحضارات المتعاقبة.",
    descEn: "Sacred spires and ancient pathways whispering stories of faith and human history.",
    image: "/images/holy-land.webp",
    link: "/destinations/holyland"
  }
];

const getOptimizedImageUrl = (url, width = 400, height = 450) => {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace('/image/upload/', `/image/upload/w_${width},h_${height},c_fill,q_auto:eco,f_auto/`);
  }
  return url;
};

const getThumbnailUrl = (url, size = 48) => {
  if (!url || typeof url !== 'string') return url;
  try {
    if (url.includes('images.unsplash.com')) {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', size.toString());
      parsedUrl.searchParams.set('h', size.toString());
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('q', '60');
      parsedUrl.searchParams.set('fm', 'webp');
      return parsedUrl.toString();
    }
    if (url.includes('cloudinary.com')) {
      if (url.includes('/upload/w_') || url.includes('/upload/f_auto')) {
        return url.replace(/\/upload\/[^/]+\//, `/upload/w_${size},h_${size},c_fill,q_60,f_auto/`);
      }
      return url.replace('/image/upload/', `/image/upload/w_${size},h_${size},c_fill,q_60,f_auto/`);
    }
  } catch (e) {
    return url;
  }
  return url;
};

const tourImageUrl = (tour) => {
  if (!tour) return '/imgs/egyothero.webp';
  return (
    resolveTourHeroImage(tour) ||
    (typeof tour?.heroImage === 'string' && tour.heroImage.trim() ? tour.heroImage.trim() : null) ||
    (typeof tour?.heroImageUrl === 'string' && tour.heroImageUrl.trim() ? tour.heroImageUrl.trim() : null) ||
    '/imgs/egyothero.webp'
  );
};

const buildInfiniteMarqueeList = (items, prefix = 'tour', maxVisible = 8) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  let base = items.slice(0, maxVisible);
  while (base.length < 4 && items.length > 0) {
    base = [...base, ...items].slice(0, maxVisible);
  }
  return [
    ...base.map((tItem, i) => ({ ...tItem, origIdx: i, isDuplicate: false, uKey: `${prefix}-set1-${tItem.id || tItem.slug || i}-${i}` })),
    ...base.map((tItem, i) => ({ ...tItem, origIdx: i, isDuplicate: true, uKey: `${prefix}-set2-${tItem.id || tItem.slug || i}-${i}` })),
    ...base.map((tItem, i) => ({ ...tItem, origIdx: i, isDuplicate: true, uKey: `${prefix}-set3-${tItem.id || tItem.slug || i}-${i}` })),
    ...base.map((tItem, i) => ({ ...tItem, origIdx: i, isDuplicate: true, uKey: `${prefix}-set4-${tItem.id || tItem.slug || i}-${i}` })),
  ];
};

const HomeExperienceSection = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const isRtl = i18n.dir() === 'rtl';
  const lang = i18n.language || 'en';
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [isAllToursPopupOpen, setIsAllToursPopupOpen] = useState(false);
  const [destSectionRef, isDestSectionVisible] = useInViewport({ threshold: 0.05 });
  const [transportSectionRef, isTransportSectionVisible] = useInViewport({ threshold: 0.05 });
  const pkgMarqueeRef = useRef(null);
  const destMarqueeRef = useRef(null);
  const pkgHoveredRef = useRef(false);
  const destHoveredRef = useRef(false);

  const handleMarqueeScroll = (ref, direction) => {
    if (!ref.current) return;
    const el = ref.current;
    const isPkg = ref === pkgMarqueeRef;
    const stepWidth = isPkg ? 260 : 310;
    const scrollDelta = direction === 'right' ? stepWidth : -stepWidth;

    const quarter = el.scrollWidth / 4;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (quarter > 0 && maxScroll > 0) {
      if (direction === 'right' && el.scrollLeft >= maxScroll - stepWidth * 2) {
        el.scrollLeft -= quarter * 2;
      } else if (direction === 'left' && el.scrollLeft <= stepWidth * 1.5) {
        el.scrollLeft += quarter * 2;
      }
    }

    el.scrollBy({ left: scrollDelta, behavior: 'smooth' });
  };
  const { photos: showcasePhotos, videos: showcaseVideos, loading: showcaseLoading } = useMediaShowcase();
  const {
    tours: allLiveToursRaw,
    loading: toursLoading,
    error: toursError,
  } = useTours({ limit: 70 });
  const allLiveTours = useMemo(() => Array.isArray(allLiveToursRaw) ? allLiveToursRaw : [], [allLiveToursRaw]);
  const { services: rawTransportation = [], loading: transportLoading } = useServices('transportation');
  const transportationList = useMemo(() => {
    const rawList = Array.isArray(rawTransportation) && rawTransportation.length > 0
      ? rawTransportation
      : fallbackTransportation;

    return rawList.map((v, idx) => {
      const seats = Number(v.seats || v.capacity || (v.category === 'bus' ? 45 : v.category === 'coaster' ? 24 : 4));
      const rawCat = String(v.vehicleCategory || v.category || '').toLowerCase();
      let normalizedCat;
      if (rawCat.includes('bus') || seats > 30) normalizedCat = 'bus';
      else if (rawCat.includes('coaster') || rawCat.includes('mini') || (seats > 8 && seats <= 30)) normalizedCat = 'coaster';
      else normalizedCat = 'private';

      const firstImage = Array.isArray(v.images)
        ? (typeof v.images[0] === 'string' ? v.images[0] : v.images[0]?.imageUrl)
        : null;
      const image = v.heroImage || v.image || v.heroImageUrl || firstImage || (
        normalizedCat === 'bus' ? '/imgs/transportation/bus1.jpeg' :
        normalizedCat === 'coaster' ? '/imgs/transportation/costar.jpeg' :
        '/imgs/transportation/privte.jpeg'
      );

      const price = Number(v.pricePerDay || v.pricePerTrip || v.price || v.basePriceUsd || 0);

      return {
        ...v,
        id: v.id || v._id || `trans-${idx}`,
        name: resolveLocalizedText(v.name || v.title, t, lang) || (
          normalizedCat === 'bus' ? 'Luxury Tour Bus' :
          normalizedCat === 'coaster' ? 'Executive Coaster' :
          'VIP Private Transfer'
        ),
        image,
        heroImage: image,
        category: normalizedCat,
        vehicleCategory: normalizedCat,
        seats,
        pricePerDay: price,
      };
    });
  }, [rawTransportation, lang, t]);
  const {
    destinations: liveDestinationsRaw,
    loading: destinationsLoading,
    error: destinationsError,
  } = useDestinations();
  const liveDestinations = useMemo(() => Array.isArray(liveDestinationsRaw) ? liveDestinationsRaw : [], [liveDestinationsRaw]);
  const DEST_HERO_MAP = {
    egypt: '/imgs/egyothero.webp',
    turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
    jordan: '/images/jordan-petra.webp',
    dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
    morocco: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
    greece: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
    tunisia: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
    'holy-land': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
    holyland: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=480&h=320&q=60&fm=webp',
  };

  const DEST_TOUR_COUNTS = {
    egypt: 9,
    turkey: 15,
    jordan: 7,
    dubai: 9,
    morocco: 1,
    greece: 1,
    tunisia: 1,
    'holy-land': 0,
    holyland: 0,
  };

  const liveDestinationCards = useMemo(() => {
    const cardMap = new Map();

    (liveDestinations || []).forEach((destination) => {
      const slug = destination.slug || destination.id;
      const heroImg = DEST_HERO_MAP[slug] || destination.heroImageUrl || destination.image;
      const dynamicCount = (allLiveTours || []).filter(t => t && (t.destination === slug || (slug.includes('holy') && (t.destination === 'holy-land' || t.destination === 'holyland')))).length;
      const exactCount = DEST_TOUR_COUNTS[slug] !== undefined ? DEST_TOUR_COUNTS[slug] : destination.toursCount;
      const toursCount = exactCount !== undefined ? exactCount : dynamicCount;
      const navKey = (slug === 'holy-land' || slug === 'holyland') ? 'holyland' : slug;

      const name = t(`nav.${navKey}`, destination.title || destination.name);
      const subtitle = t(`dest.${navKey}.subtitle`, destination.subtitle || destination.description || '');

      const key = (slug === 'holyland' || slug === 'holy-land') ? 'holy-land' : slug;

      cardMap.set(key, {
        id: slug === 'holy-land' ? 'holyland' : slug,
        name,
        description: subtitle,
        subtitle,
        image: heroImg,
        toursCount: toursCount,
        link: `/destinations/${slug === 'holy-land' ? 'holyland' : slug}`,
      });
    });

    const DESIRED_ORDER = ['egypt', 'turkey', 'dubai', 'jordan', 'morocco', 'tunisia', 'greece', 'holy-land'];

    const result = [];
    DESIRED_ORDER.forEach((key) => {
      if (cardMap.has(key)) {
        result.push(cardMap.get(key));
      } else {
        const navKey = key === 'holy-land' ? 'holyland' : key;
        result.push({
          id: key === 'holy-land' ? 'holyland' : key,
          name: t(`nav.${navKey}`, key.charAt(0).toUpperCase() + key.slice(1)),
          description: t(`dest.${navKey}.subtitle`, ''),
          subtitle: t(`dest.${navKey}.subtitle`, ''),
          image: DEST_HERO_MAP[key] || '/images/holy-land.webp',
          toursCount: DEST_TOUR_COUNTS[key] !== undefined ? DEST_TOUR_COUNTS[key] : (DEST_TOUR_COUNTS[navKey] !== undefined ? DEST_TOUR_COUNTS[navKey] : 0),
          link: `/destinations/${key === 'holy-land' ? 'holyland' : key}`,
        });
      }
    });

    return result;
  }, [liveDestinations, allLiveTours, t]);
  const livePackageCards = useMemo(() => {
    return _packagesData.map((pkg) => ({
      ...pkg,
      recordId: pkg.id,
      name: t(pkg.nameKey, pkg.nameDefault),
      desc: t(pkg.descKey, pkg.descDefault),
      badge: t(pkg.badgeKey, pkg.badgeDefault),
      duration: t(pkg.durationKey, pkg.durationDefault),
      tag1: pkg.tag1Key ? t(pkg.tag1Key, '') : '',
      tag2: pkg.tag2Key ? t(pkg.tag2Key, '') : '',
      tag3: pkg.tag3Key ? t(pkg.tag3Key, '') : '',
    }));
  }, [t]);

  const allToursForMarquee = useMemo(() => {
    if (!Array.isArray(allLiveTours)) return [];
    return allLiveTours.filter(Boolean).map((tour) => ({
      ...tour,
      description: tour.overview || tour.description || '',
      images: Array.isArray(tour.images) ? tour.images : [],
      link: `/tours/${tour.slug || tour.id}`,
    }));
  }, [allLiveTours]);



  const defaultPackageTours = useMemo(() => [], []);

  const packagesToursMap = useMemo(() => {
    const matches = (tour, values) => {
      if (!tour) return false;
      const searchable = `${tour.slug || ''} ${tour.category || ''} ${tour.title || ''}`.toLowerCase();
      return values.some((value) => searchable.includes(value));
    };
    const withLinkBase = (items) => (items || []).map((tour) => ({ ...tour, linkBase: tour.link ? '' : '/tours' }));
    const safeTours = Array.isArray(allLiveTours) ? allLiveTours : [];

    const classicLive = safeTours.filter((tour) => matches(tour, ['classic', 'classico', 'clásico', 'cairo']));
    const honeymoonLive = safeTours.filter((tour) => matches(tour, ['honeymoon', 'luna de miel', 'شهر العسل']));
    const religiousLive = safeTours.filter((tour) => matches(tour, ['religious', 'holy family', 'العائلة المقدسة']));
    const multiLive = safeTours.filter((tour) => matches(tour, ['multi-country', 'combined', 'and-', 'متعددة', 'stars-of-the-middle-east', 'middle-east']));
    const extLive = safeTours.filter((tour) => matches(tour, ['extension', 'escape']));

    return {
      'classic-program': withLinkBase(classicLive.length > 0 ? classicLive : safeTours),
      honeymooners: withLinkBase(honeymoonLive.length > 0 ? honeymoonLive : safeTours),
      religious: withLinkBase(religiousLive.length > 0 ? religiousLive : safeTours),
      'multi-country': withLinkBase(multiLive.length > 0 ? multiLive : safeTours),
      extension: withLinkBase(extLive.length > 0 ? extLive : safeTours),
    };
  }, [allLiveTours]);

  const packagesToursForMarquee = useMemo(() => {
    if (allLiveTours && allLiveTours.length > 0) {
      return allLiveTours.slice(0, 10).map((tour) => {
        const hero = (typeof tour.heroImage === 'string' && tour.heroImage.trim() ? tour.heroImage.trim() : null)
          || (typeof tour.heroImageUrl === 'string' && tour.heroImageUrl.trim() ? tour.heroImageUrl.trim() : null)
          || (Array.isArray(tour.images) && tour.images.length > 0 ? (typeof tour.images[0] === 'string' ? tour.images[0] : tour.images[0]?.imageUrl) : null)
          || '/imgs/egyothero.webp';
        return {
          ...tour,
          id: tour.id || tour.slug,
          title: resolveTourTitle(tour, t, lang),
          overview: resolveTourOverview(tour, t, lang),
          duration: resolveTourDuration(tour, t, lang),
          heroImage: hero,
          images: [hero],
          link: `/tours/${tour.slug || tour.id}`,
        };
      });
    }
    return (defaultPackageTours || []).slice(0, 8);
  }, [allLiveTours, defaultPackageTours, lang, t]);

  const destinationToursForMarquee = useMemo(() => {
    const isSingleDestTour = (tItem) => {
      if (!tItem) return false;
      const d = String(tItem.destination || tItem.country || '').toLowerCase().trim();
      if (d === 'multi-country' || d.includes('multi')) return false;
      return true;
    };

    return (allLiveTours || []).filter(isSingleDestTour).map((tourItem) => ({
      ...tourItem,
      id: tourItem.id || tourItem.slug,
      title: resolveTourTitle(tourItem, t, lang),
      duration: resolveTourDuration(tourItem, t, lang),
      overview: resolveTourOverview(tourItem, t, lang),
      destination: tourItem.destination || String(tourItem.country || '').toLowerCase() || 'egypt',
      heroImage: tourItem.heroImage || (Array.isArray(tourItem.images) && tourItem.images.length > 0 ? (typeof tourItem.images[0] === 'string' ? tourItem.images[0] : tourItem.images[0]?.imageUrl) : null) || '/imgs/egyothero.webp',
      images: Array.isArray(tourItem.images) && tourItem.images.length > 0 ? tourItem.images : [tourItem.heroImage || '/imgs/egyothero.webp'],
      link: `/tours/${tourItem.slug || tourItem.id}`,
    }));
  }, [allLiveTours, lang, t]);


  // Search Form State
  const [searchDest, setSearchDest] = useState("all");
  const [searchTour, setSearchTour] = useState("");
  const [searchPeople, setSearchPeople] = useState(1);

  const destinations = liveDestinationCards.map((destination) => ({
    id: destination.id,
    label: destination.name,
    img: destination.image,
  }));

  const slugify = (str) => String(str || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const DEST_ALIASES = useMemo(() => ({
    'united arab emirates': 'dubai',
    'uae': 'dubai',
    'emirates': 'dubai',
    'holy land': 'holyland',
    'holy-land': 'holyland',
  }), []);

  const normalizeDest = (d) => {
    const clean = String(d || '').toLowerCase().trim();
    return DEST_ALIASES[clean] || clean;
  };

  const getToursForDest = (destId) => {
    const result = [];
    const seenKeys = new Set();

    const addTourItem = (tour, defaultBaseUrl = '/tours', defaultDest = '') => {
      if (!tour) return;
      const idStr = tour.id || tour.slug || '';
      const rawTitle = tour.title || tour.name || '';
      const titleStr = resolveLocalizedText(rawTitle, t, lang) || (typeof rawTitle === 'string' ? rawTitle : '') || idStr;
      if (!idStr && !titleStr) return;

      const enTitle = typeof rawTitle === 'object' ? (rawTitle.en || rawTitle.ar || '') : String(rawTitle || '');
      const slugStr = tour.slug || slugify(`${idStr}-${enTitle || titleStr}`);
      const destName = normalizeDest(tour.destination || tour.country || defaultDest);
      const uniqueKey = `${destName}-${idStr || slugStr}`;
      if (seenKeys.has(uniqueKey)) return;
      seenKeys.add(uniqueKey);

      let baseUrl = defaultBaseUrl;
      if (destName === 'dubai') baseUrl = '/programs/dubai';
      else if (destName === 'turkey') baseUrl = '/programs/turkey';
      else if (destName === 'jordan') baseUrl = '/programs/jordan';

      result.push({
        id: `tour-${slugStr}`,
        label: titleStr,
        url: `${baseUrl}/${slugStr}`,
      });
    };

    const targetDest = normalizeDest(destId);

    if (targetDest === "all") {
      (allLiveTours || []).forEach((tour) => addTourItem(tour, "/tours"));
      return result;
    }

    // Live tours matching target destination alias
    const filteredLive = (allLiveTours || []).filter((tour) => {
      const tourDest = normalizeDest(tour.destination || tour.country);
      return tourDest === targetDest || tourDest.includes(targetDest) || targetDest.includes(tourDest);
    });
    filteredLive.forEach((tour) => addTourItem(tour, "/tours", targetDest));

    return result;
  };

  const destTours = searchDest ? getToursForDest(searchDest) : [];

  const handleSearch = () => {
    if (searchTour) {
      const found = destTours.find((tour) => tour.id === searchTour);
      if (found) { navigate(found.url); return; }
    }
    if (searchDest && searchDest !== "all") {
      navigate(`/destinations/${searchDest}`);
    }
  };

  // Transportation State
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [resForm, setResForm] = useState({
    vehicle: "",
    date: "",
    time: "",
    adults: 1,
    children: 0,
    pickup: "",
    dropoff: "",
    name: "",
    phone: "",
    email: "",
  });
  const [resSuccess, setResSuccess] = useState(false);

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  const handleResSubmit = async (e) => {
    e.preventDefault();
    if (resForm.date && resForm.date < todayStr) {
      return;
    }
    setResSuccess(true);
    setTimeout(() => setResSuccess(false), 5000);

    try {
      const selectedVehicle = transportationList.find((v) => v.id === resForm.vehicle);
      const vehicleName = selectedVehicle?.name || resForm.vehicle || 'Standard Vehicle';
      await api.post('/inquiries', {
        fullName: resForm.name.trim(),
        email: resForm.email.trim(),
        phone: resForm.phone.trim(),
        preferredLanguage: i18n.language || 'en',
        destinations: ['Egypt', 'Transportation Transfer'],
        startDate: resForm.date,
        adults: parseInt(resForm.adults, 10) || 1,
        children: parseInt(resForm.children, 10) || 0,
        notes: `[VIP Chauffeur & Transfer Reservation]\nVehicle: ${vehicleName} (ID: ${resForm.vehicle})\nPickup Date: ${resForm.date} at ${resForm.time}\nPickup Location: ${resForm.pickup}\nDropoff Location: ${resForm.dropoff}`,
      });
    } catch (err) {
      console.warn('Backend transfer inquiry submission warning:', err);
    }

    setResForm({
      vehicle: "",
      date: "",
      time: "",
      adults: 1,
      children: 0,
      pickup: "",
      dropoff: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleHomeReserveClick = (vehicleId) => {
    navigate('/transportation');
  };

  const filteredVehicles = useMemo(() => {
    const list = (fallbackTransportation && fallbackTransportation.length > 0) ? fallbackTransportation : (transportationList || []);
    if (vehicleFilter === "all") return list;
    return list.filter((v) => {
      const cat = (v.category || v.vehicleCategory || "").toLowerCase();
      if (vehicleFilter === "bus") return cat === "bus" || v.seats > 30;
      if (vehicleFilter === "coaster") return cat === "coaster" || (v.seats > 8 && v.seats <= 30);
      if (vehicleFilter === "private") return cat === "private" || v.seats <= 8;
      return cat === vehicleFilter.toLowerCase();
    });
  }, [vehicleFilter, transportationList]);

  const handleDestinationClick = (id) => {
    navigate(`/destinations/${id}`);
  };

  const [activePackage, setActivePackage] = useState(null);

  const handlePackageClick = (id) => {
    setActivePackage((prev) => (prev === id ? null : id));
  };

  const activePackageTours = useMemo(() => {
    if (!activePackage) return [];
    return packagesToursMap[activePackage] || [];
  }, [activePackage, packagesToursMap]);

  return (
    <div className="w-full">
      <Helmet>
        <title>
          {t(
            "home.metaTitle",
            "Dunas Travel | Award-Winning Experiences in Egypt, Jordan, Turkey, Tunisia, Greece, Holy Land, Morocco & Dubai",
          )}
        </title>
        <meta
          name="description"
          content={t(
            "home.metaDesc",
            "Experience true luxury with Dunas Travel — curated journeys through the timeless wonders of Egypt, Jordan, Turkey, Tunisia, Greece, the Holy Land, Morocco, and Dubai.",
          )}
        />
        <meta property="og:title" content="Dunas Travel" />
        <meta
          property="og:description"
          content="Premium luxury travel agency — Egypt, Jordan, Turkey, Tunisia, Greece, Holy Land, Morocco & Dubai"
        />
        <meta property="og:image" content="/dunas-travel-logo.webp" />
      </Helmet>

      {/* Yacht Dark Hero Section */}
      <HomeHeroSection />

      {/* Search Section */}
      <section id="search-section" className="relative w-full py-20 md:py-28 overflow-hidden mt-0">
        {/* Background Image with Dynamic Pulsing Motion & Rich Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/pyramids-search-bg.webp"
            alt="Search tours and holiday packages background"
            className="search-hero-bg-parallax w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
            width="1440"
            height="600"
          />
          {/* Ambient light glows */}
          <div className="hidden md:block absolute -top-20 -left-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-[110px] pointer-events-none" />
          <div className="hidden md:block absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/60 via-obsidian-950/40 to-obsidian-950/75" />
        </div>

        {/* Search Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          {/* Search Form Box */}
          <motion.div 
            initial={{ opacity: 0, y: 45, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl"
          >
            <div className="bg-black/50 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(245,166,35,0.2)] hover:border-amber-400/80 hover:shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_60px_rgba(245,166,35,0.35)] transition-all duration-500 relative overflow-hidden group/box">
              {/* Subtle top border illumination ray */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5 items-end">
                {/* Destination */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="search-dest-input" className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 uppercase tracking-widest mb-2 font-extrabold drop-shadow-md">
                    <FaMapMarkerAlt className="text-amber-400 text-xs animate-bounce" style={{ animationDuration: '2.5s' }} />
                    {t('home.searchDest', 'Destination')}
                  </label>
                  <div className="relative">
                    <select
                      id="search-dest-input"
                      value={searchDest}
                      onChange={(e) => { setSearchDest(e.target.value); setSearchTour(""); }}
                      className="w-full px-4 py-3.5 rounded-2xl border border-white/30 bg-black/50 backdrop-blur-md text-white font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 appearance-none cursor-pointer pr-10 rtl:pr-4 rtl:pl-10 shadow-inner transition-all hover:border-amber-400/80 hover:bg-black/70"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', color: '#FFFFFF' }}
                    >
                      <option value="all" style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}>
                        {t('home.searchAllDest', 'All Destinations')}
                      </option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id} style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-3.5 text-amber-400">
                      <FaChevronDown className="text-xs transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Tour */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="search-tour-input" className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 uppercase tracking-widest mb-2 font-extrabold drop-shadow-md">
                    <FaSuitcase className="text-amber-400 text-xs" />
                    {t('home.searchTour', 'Tour / Program')}
                  </label>
                  <div className="relative">
                    <select
                      id="search-tour-input"
                      value={searchTour}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        setSearchTour(selectedVal);
                        if (selectedVal) {
                          const found = destTours.find((tour) => tour.id === selectedVal);
                          if (found?.url) {
                            navigate(found.url);
                          }
                        }
                      }}
                      disabled={!searchDest || searchDest === "all"}
                      className="w-full px-4 py-3.5 rounded-2xl border border-white/30 bg-black/50 backdrop-blur-md text-white font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 appearance-none cursor-pointer pr-10 rtl:pr-4 rtl:pl-10 shadow-inner transition-all hover:border-amber-400/80 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', color: '#FFFFFF' }}
                    >
                      <option value="" style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}>
                        {searchDest === "all" ? t('home.selectDestFirst', 'Select a destination first') : t('home.searchAllTours', 'All Tours')}
                      </option>
                      {searchDest && searchDest !== "all" && destTours.map((item) => (
                        <option key={item.id} value={item.id} style={{ backgroundColor: '#0B132B', color: '#FFFFFF' }}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 flex items-center px-3.5 text-amber-400">
                      <FaChevronDown className="text-xs transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="col-span-1 md:col-span-1">
                  <motion.button
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={handleSearch}
                    className="group/btn relative overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3.5 font-black rounded-2xl transition-all duration-300 text-base sm:text-lg text-white shadow-[0_8px_30px_rgba(255,107,53,0.5)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.85)] cursor-pointer h-[52px] sm:h-[56px]"
                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #D93800 50%, #1E3A8A 100%)' }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    <FaSearch className="text-sm sm:text-base group-hover/btn:rotate-12 group-hover/btn:scale-125 transition-transform duration-300 text-amber-300" />
                    <span>{t('home.searchBtn', 'Search')}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Popular Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-8 text-center w-full max-w-5xl"
          >
            <p className="text-amber-400 text-xs sm:text-sm uppercase tracking-widest mb-4 font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {t('home.popularDests', 'Popular Destinations')}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
              {destinations.map((d, idx) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={`/destinations/${d.id}`}
                    className="group flex items-center gap-2.5 bg-black/50 hover:bg-black/80 backdrop-blur-xl border border-white/30 hover:border-amber-400 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(245,166,35,0.75)]"
                  >
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-400/80 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <img src={getThumbnailUrl(d.img, 48)} alt="" className="w-full h-full object-cover" width="24" height="24" loading="lazy" decoding="async" />
                    </span>
                    <span className="text-white text-xs sm:text-sm font-black group-hover:text-amber-300 transition-colors drop-shadow-sm">
                      {d.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Customize & Contact Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 350, damping: 15 }}>
                <Link
                  to="/tailor-a-tour"
                  className="relative overflow-hidden group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#F5A623] via-[#FFC857] to-[#D97706] text-[#0C1120] font-black text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-[0_0_25px_rgba(245,166,35,0.7)] hover:shadow-[0_0_40px_rgba(245,166,35,1)] transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('home.customize', 'Customize Your Trip')}
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 350, damping: 15 }}>
                <Link
                  to="/contact"
                  className="relative overflow-hidden group inline-flex items-center gap-2.5 bg-black/60 hover:bg-amber-500/20 backdrop-blur-xl border border-amber-400/70 hover:border-amber-400 text-amber-300 hover:text-white font-black text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(245,166,35,0.7)] transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('nav.contact', 'Contact Us')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About the Company */}
      <section className="py-12 bg-ivory-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <span className="text-gold-500 uppercase tracking-widest text-caption block mb-4">
                {t("home.whoWeAre", "QUIÉNES SOMOS")}
              </span>
              <h2 className="text-display-lg text-obsidian-900 mb-6">
                {t("home.aboutTitle", "Experiencias exclusivas, diseñadas a medida")}
              </h2>
              <p 
                className="text-body-lg text-black dark:text-white font-bold mb-8 leading-relaxed"
                style={{ fontWeight: 700 }}
              >
                {t(
                  "home.aboutDesc",
                  "En Dunas Travel diseñamos experiencias exclusivas por los destinos más fascinantes de Oriente Medio y el Mediterráneo. Con un profundo conocimiento de cada destino y una cuidada selección de hoteles, cruceros boutique y experiencias privadas, creamos itinerarios a medida donde la excelencia, la autenticidad y la atención personalizada convierten cada viaje en una experiencia verdaderamente inolvidable."
                )}
              </p>
              <Link to="/about">
                <Button variant="outline-gold" className="px-8 py-3">
                  {t("home.learnMore", "Learn More About Us")}
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative"
            >
              {/* Floating Airplane Overlay */}
              <div className="absolute top-2 right-4 sm:top-3 sm:right-6 md:top-4 md:right-8 z-20 pointer-events-none select-none">
                <style>{`
                  @keyframes planeHoverFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(-1.5deg); }
                  }
                `}</style>
                <div style={{ animation: 'planeHoverFloat 4s ease-in-out infinite' }}>
                  <img
                    src="/images/plane-icon.webp"
                    alt="Dunas Travel Jet"
                    className="w-20 sm:w-28 md:w-36 h-auto object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.4)]"
                    width="160"
                    height="80"
                  />
                </div>
              </div>

              <img
                src="/images/cairo-night-photo.webp"
                onError={(e) => { e.currentTarget.src = "/images/cairo-night-photo.webp"; }}
                alt="Cairo Night Photography - Crafting Luxury Journeys"
                className="w-full h-[300px] lg:h-[480px] object-cover rounded-[16px] shadow-[0_0_40px_rgba(245,166,35,0.25)] transition-transform duration-400 ease hover:-translate-y-[8px]"
                width="600"
                height="480"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-gray-50/50 dark:bg-[#07163c]">
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { count: 17, suffix: '+', icon: FaCalendarAlt, labelKey: 'about.heroStatsYears' },
              { count: 95654, suffix: '+', icon: FaSuitcase, labelKey: 'about.heroStatsTravelers' },
              { count: 438, suffix: '+', icon: FaUsers, labelKey: 'about.heroStatsEmployees' },
              { count: 182, suffix: '+', icon: FaMapMarkedAlt, labelKey: 'about.heroStatsGuides' },
              { count: 5, suffix: '', icon: FaGlobe, labelKey: 'about.heroStatsOffices' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="home-stat-card"
              >
                <s.icon className="stat-icon" />
                <div className="n">
                  <AnimatedCounter value={s.count} suffix={s.suffix} />
                </div>
                <div className="l">
                  {t(s.labelKey)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations & Their Tours - Travolo Style Replica */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #041446 0%, #061d5d 50%, #020b26 100%)' }}>
        {/* Ambient Royal Blue & Gold Glow Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#041446]/80 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="inline-block mb-2">
              <span className="text-[#F5A623] font-serif text-lg sm:text-xl tracking-widest font-normal lowercase block">
                {t("home.discoverMagic", "اكتشف السحر")}
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide font-serif drop-shadow-lg uppercase">
              {t("home.destTitle", "الوجهات وجولاتها")}
            </h2>

            {/* Accent Line */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent" />
              <div className="w-2 h-2 rotate-45 border border-[#F5A623] bg-[#F5A623]/40" />
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent" />
            </div>

            <p className="text-white font-bold text-sm sm:text-base max-w-xl mx-auto leading-relaxed drop-shadow-md">
              {t("home.destSectionDesc", "استكشف أكثر الوجهات الفاخرة سحراً وجمالاً، مع باقات وجولات سياحية صممت بعناية لتمنحك تجربة سفر استثنائية.")}
            </p>
          </div>

          {/* Destination Cards Grid - Exact Travolo Replica (3 Columns, Tall 520px Cards, Top Hanging Badge & Bottom Floating Box) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(destinationsLoading || toursLoading) && (
              <div className="lg:col-span-3 rounded-3xl border border-white/20 bg-[#041446]/50 px-6 py-16 text-center text-white backdrop-blur-md">
                <div className="inline-block w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-lg text-white">{t('common.loading', 'Loading destinations and tours...')}</p>
              </div>
            )}
            {(destinationsError || toursError) && liveDestinationCards.length === 0 && !destinationsLoading && !toursLoading && (
              <div className="lg:col-span-3 rounded-3xl border border-red-400/30 bg-red-950/20 px-6 py-16 text-center text-white backdrop-blur-md">
                {t('common.loadError', 'Unable to load live catalog data. Please try again later.')}
              </div>
            )}
            {!destinationsLoading && !toursLoading && liveDestinationCards.length === 0 && !destinationsError && !toursError && (
              <div className="lg:col-span-3 rounded-3xl border border-white/20 bg-[#041446]/50 px-6 py-16 text-center text-white backdrop-blur-md">
                {t('destination.empty', 'No destinations are currently available.')}
              </div>
            )}
            {!destinationsLoading && !toursLoading && liveDestinationCards.length > 0 && liveDestinationCards.map((dest, index) => {
              const tourCount = dest.toursCount;
              const isFirst = index % 3 === 0;

              return (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => navigate(dest.link)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(dest.link);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t("destination.viewGuide", "View destination guide")} ${dest.name}`}
                  className="group relative h-[480px] sm:h-[520px] rounded-[24px] overflow-hidden shadow-2xl border border-white/15 hover:border-[#F5A623]/80 transition-all duration-500 hover:-translate-y-2.5 cursor-pointer focus:outline-none flex flex-col justify-between"
                >
                  {/* Full Background Cover Photo */}
                  <img
                    src={dest.image}
                    srcSet={dest.image && dest.image.includes('images.unsplash.com') ? `
                      ${dest.image.replace(/w=\d+&h=\d+/, 'w=1000&q=90')} 1000w
                    ` : undefined}
                    sizes="(max-width: 768px) 600px, 1000px"
                    alt={dest.name}
                    width="1000"
                    height="800"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Gradient Overlay for photo contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041446]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge: Country Name in Ultra-Luxury Gold Box with Bold Black Text */}
                  <div className="absolute top-0 ltr:right-8 rtl:left-8 z-20">
                    <div 
                      className="px-7 py-3 rounded-b-2xl font-extrabold text-2xl sm:text-3xl font-serif shadow-[0_8px_25px_rgba(245,166,35,0.45)] flex items-center justify-center tracking-wide border-b-2 border-x-2 border-[#B38728]/70 hover:brightness-110 transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #FFE082 0%, #F5A623 45%, #D4AF37 80%, #B38728 100%)' }}
                    >
                      <span className="text-black font-extrabold tracking-wider" style={{ color: '#000000' }}>
                        {dest.name}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Translucent Strip Overlay: Royal Blue Background & Pure White Text Above Line */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 rounded-[20px] p-4 sm:p-5 shadow-2xl backdrop-blur-md transition-all duration-300 bg-[#041446]/90 border border-[#F5A623]/40 group-hover:bg-[#041446] group-hover:border-[#F5A623]/80">
                    {/* Description (Text above line: Pure Crisp White) */}
                    <p className="text-sm sm:text-base font-bold leading-relaxed line-clamp-2 mb-3 text-white tracking-wide" style={{ color: '#FFFFFF' }}>
                      {dest.description || t("destination.luxuryGuide", "Explore Sea & Get Relax")}
                    </p>

                    {/* Tour Count (Text below line) */}
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#F5A623] pt-2.5 border-t border-white/20">
                      <FaCompass className="text-[#F5A623]" size={16} />
                      <span className="text-white font-extrabold">{tourCount} {t("home.toursAvailable", "رحلة متوفرة")}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

{/* Destination Tours Marquee Section */}
      <section ref={destSectionRef} className="py-12 bg-ivory-100 dark:bg-obsidian-950 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="text-[#B45309] dark:text-[#F5A623] uppercase tracking-widest text-caption block mb-2 font-bold">
              {t("home.destToursBadge", isAr ? "تجارب مصممة بعناية فائقة عبر جميع وجهاتنا الساحرة" : "Meticulously crafted experiences across all our destinations")}
            </span>
            <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("home.destToursTitle", isAr ? "جولات الوجهات المميزة" : "Featured Destination Tours")}
            </h2>
            <div className="w-24 h-1 bg-gold-500 rounded-full mt-3 mx-auto"></div>
          </div>
        </div>

        {/* Marquee Strip */}
        <div className="relative group/marquee w-full">
          <div 
            dir="ltr" 
            ref={destMarqueeRef} 
            className="overflow-x-auto md:overflow-hidden w-full relative py-4 scrollbar-none snap-x snap-mandatory md:snap-none"
          >
            <div className="flex w-max gap-5 px-5 animate-continuous-marquee-left" data-active={isDestSectionVisible ? "true" : "false"}>
            {(() => {
              const infiniteList = buildInfiniteMarqueeList(destinationToursForMarquee, 'dest');
              return infiniteList.map((tData, idx) => {
                const resolvedTitle = resolveTourTitle(tData, t, lang);
                const resolvedDuration = resolveTourDuration(tData, t, lang);
                const rawDest = tData.destination === 'holy-land' ? 'holyland' : (tData.destination || 'egypt');
                const resolvedDest = t(`nav.${rawDest}`, rawDest.charAt(0).toUpperCase() + rawDest.slice(1));
                const imageUrl = tourImageUrl(tData);

                return (
                  <Link
                    key={`dest-tour-${tData.id || idx}-${idx}`}
                    to={tData.link || `/tours/${tData.slug || tData.id}`}
                    tabIndex={tData.isDuplicate ? -1 : undefined}
                    aria-hidden={tData.isDuplicate ? "true" : undefined}
                    className={`min-w-[260px] sm:min-w-[280px] md:min-w-[300px] shrink-0 group relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_36px_rgba(245,166,35,0.3)] transition-all duration-500 h-[340px] sm:h-[355px] border border-white/15 hover:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 ${tData.isDuplicate ? 'hidden md:block' : 'block snap-start'}`}
                  >
                    <img
                      src={getOptimizedImageUrl(imageUrl, 300, 355)}
                      alt={resolvedTitle}
                      width="300"
                      height="330"
                      className="w-full h-full object-cover cinematic-transition group-hover:scale-[1.06]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/20 to-transparent"></div>

                    <div className="package-badge-text absolute top-3 left-3 bg-gold-500/90 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase">
                      {resolvedDest}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end h-full">
                      <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-base sm:text-lg text-white font-bold mb-1.5 leading-snug line-clamp-2">
                          {resolvedTitle}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-white mb-3 pt-2 border-t border-white/20">
                          <span className="text-[12px] font-extrabold text-white flex items-center gap-1.5 drop-shadow-sm">
                            <FaClock className="text-gold-400 text-xs" />
                            <span>{resolvedDuration}</span>
                          </span>
                          {Number.isFinite(Number(tData.price)) && Number(tData.price) > 0 && (
                            <span className="text-gold-400 font-bold text-xs">
                              {formatPrice(tData.price)}
                            </span>
                          )}
                        </div>

                        {Number.isFinite(Number(tData.rating)) && Number.isFinite(Number(tData.reviewCount)) ? (
                          <div className="flex items-center gap-1 text-gold-400">
                            <FaStar size={11} />
                            <span className="text-ivory-50 text-xs font-semibold">
                              {Number(tData.rating).toFixed(1)} <span className="text-ivory-300 font-normal">({tData.reviewCount})</span>
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </div>
      </div>

        <div className="flex justify-center mt-12">
          <Link to="/tours">
            <button
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-400 hover:from-amber-400 hover:to-gold-500 text-black font-extrabold text-base md:text-lg px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(245,166,35,0.4)] hover:shadow-[0_6px_25px_rgba(245,166,35,0.6)] hover:scale-105 transition-all duration-300 border border-gold-600/30 cursor-pointer"
              style={{ color: '#000000', fontWeight: 800 }}
            >
              {t("home.exploreAllTours", isAr ? "استكشف جميع الرحلات" : "Explore All Tours")} →
            </button>
          </Link>
        </div>
      </section>

      {/* Packages Section — 5 Egypt Packages Ultra Luxury Bento Grid */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-ivory-50 dark:bg-obsidian-950">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Container Card with Top Header Background & Royal Gold Accents */}
          <div 
            className="relative rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 overflow-hidden border border-gold-500/30 shadow-[0_20px_60px_rgba(4,20,70,0.35)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}
          >
            {/* Subtle shine overlay matching top header */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)' }} />
            {/* Gold accent borders top & bottom matching top header style */}
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />

            {/* Decorative ambient glowing circles */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                <motion.span 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-sm font-bold uppercase tracking-wider mb-4 shadow-lg backdrop-blur-md"
                >
                  <span className="text-amber-400">✨</span> {t("home.ourPackages", "Discover Egypt Packages")}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl lg:text-6xl text-white font-serif tracking-tight mb-4 font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t("home.packagesTitle", "برامج وتجارب مصر المميزة")}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
                >
                  {t("home.packagesSubtitle", isAr ? "مجموعة نادرة من أرقى البرامج السياحية المصممة لاستكشاف سحر مصر والشرق الأوسط" : "Selection of premium itineraries designed to experience the magic of Egypt & the Middle East")}
                </motion.p>
              </div>

              {/* 5-Card Bento Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {livePackageCards.map((pkg, idx) => {
                  const isHero = pkg.featured || idx === 0;

                  return (
                    <motion.div
                      key={pkg.recordId || pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between border transition-all duration-500 backdrop-blur-xl ${
                        isHero 
                          ? "lg:col-span-2 min-h-[380px] sm:min-h-[420px] bg-gradient-to-br from-[#121c3b]/90 via-[#0d152d]/90 to-[#070c1b]/90 border-gold-500/40 hover:border-gold-400 shadow-[0_12px_40px_rgba(245,166,35,0.2)] hover:shadow-[0_16px_50px_rgba(245,166,35,0.35)]" 
                          : "min-h-[360px] bg-gradient-to-br from-[#121c3b]/80 via-[#0a1127]/80 to-[#060a17]/80 border-white/10 hover:border-gold-500/50 hover:shadow-[0_12px_36px_rgba(245,166,35,0.25)] hover:-translate-y-2"
                      }`}
                      onClick={() => handlePackageClick(pkg.id)}
                    >
                      {/* Background Image with High Clarity & Gradient Overlay */}
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060a17]/95 via-[#060a17]/40 to-transparent"></div>
                      </div>

                      {/* Top Floating Badges */}
                      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between gap-4">
                        {pkg.badge && (
                          <span 
                            className="package-badge-text inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500 text-caption uppercase tracking-wider shadow-lg backdrop-blur-md"
                            style={{ color: '#000000', fontWeight: 900 }}
                          >
                            <span className="package-badge-text" style={{ color: '#000000', fontWeight: 900 }}>★</span>
                            <span style={{ color: '#000000', fontWeight: 900 }}>{pkg.badge}</span>
                          </span>
                        )}
                        {pkg.duration && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 text-white font-medium text-caption border border-white/30 backdrop-blur-md shadow-md">
                            <FaClock className="text-gold-400 text-xs" /> {pkg.duration}
                          </span>
                        )}
                      </div>

                      {/* Content Container */}
                      <div className="relative z-10 p-6 sm:p-8 mt-auto flex flex-col justify-end">
                        {/* Tags Pills */}
                        {(pkg.tag1 || pkg.tag2 || pkg.tag3) && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[pkg.tag1, pkg.tag2, pkg.tag3].filter(Boolean).map((tText, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="text-[11px] font-semibold text-white bg-black/50 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-full shadow-sm"
                              >
                                {tText}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 
                          className={`${isHero ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"} text-white font-serif font-bold mb-2 group-hover:text-gold-300 transition-colors duration-300`}
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {pkg.name}
                        </h3>

                        <p className="text-body-sm text-white/90 line-clamp-2 mb-6 max-w-xl">
                          {pkg.desc}
                        </p>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end pt-4 border-t border-white/20 group-hover:border-gold-500/40 transition-colors">
                          <Link 
                            to={pkg.link} 
                            onClick={(e) => e.stopPropagation()}
                            className="explore-program-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xs border-2 border-white/80 cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #FFE082 0%, #F5A623 50%, #D4AF37 100%)', color: '#000000' }}
                          >
                            <span className="font-black tracking-wider text-black" style={{ color: '#000000', fontWeight: 900 }}>
                              {t("home.explorePackage", "Explore Program")}
                            </span>
                            <span className="rtl-flip font-black text-black" style={{ color: '#000000', fontWeight: 900 }}>→</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Interactive Nested Tours Accordion */}
              <AnimatePresence>
                {activePackage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden mt-12 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-gold-500/20 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold-500/20">
                      <h3 className="text-2xl md:text-3xl text-white font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {livePackageCards.find(p => p.id === activePackage)?.name} — {t("nav.tours", "Tours")}
                      </h3>
                      <button 
                        onClick={() => setActivePackage(null)}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 hover:text-obsidian-900 text-white flex items-center justify-center transition-all"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activePackageTours.slice(0, 6).map((tour) => (
                        <TourCard
                          key={tour.id}
                          tour={tour}
                          linkBase={tour.linkBase || "/tours"}
                        />
                      ))}
                    </div>

                    <div className="flex justify-center mt-10">
                      <Link 
                        to={livePackageCards.find(p => p.id === activePackage)?.link || "/tours"}
                        className="explore-program-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xs font-black border-2 border-white/80 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #FFE082 0%, #F5A623 50%, #D4AF37 100%)', color: '#000000' }}
                      >
                        <span className="font-black tracking-wider text-black" style={{ color: '#000000', fontWeight: 900 }}>
                          {t("home.explorePackage", "Explore Full Program")}
                        </span>
                        <span className="rtl-flip font-black text-black" style={{ color: '#000000', fontWeight: 900 }}>→</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>




      {/* Transportation & Transfers (Vehicles Marquee Slider Only) */}
      <section className="py-12 bg-ivory-50 dark:bg-obsidian-950 relative overflow-hidden content-auto">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold-500 uppercase tracking-widest text-caption block mb-4"
            >
              {t('home.transportSub', 'GET AROUND IN STYLE')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-display-lg text-obsidian-900 dark:text-white mb-6"
            >
              {t('home.transportTitle', 'Premium Transportation Services')}
            </motion.h2>

          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["all", "bus", "coaster", "private"].map((tab) => (
              <button
                key={tab}
                onClick={() => setVehicleFilter(tab)}
                className={`px-6 py-2 rounded-full border-2 transition-all duration-300 font-semibold tracking-wide cursor-pointer ${
                  vehicleFilter === tab
                    ? "bg-obsidian-900 dark:bg-obsidian-900 text-white border-gold-500 shadow-[0_0_15px_rgba(245,166,35,0.4)] scale-105"
                    : "bg-obsidian-900/70 dark:bg-obsidian-900/70 text-white/80 border-transparent hover:border-gold-500/50 hover:text-white"
                }`}
              >
                {tab === "all"
                  ? t("home.allVehicles", "All")
                  : tab === "bus"
                    ? t("home.buses", "Buses")
                    : tab === "coaster"
                      ? t("home.coasters", "Coasters")
                      : t("home.privateVehicles", "Private Vehicles")}
              </button>
            ))}
          </div>

          {/* Vehicles Strip: Infinite Marquee */}
          <div dir="ltr" className="w-full relative overflow-x-auto md:overflow-hidden py-4 scrollbar-none snap-x snap-mandatory md:snap-none">
            <div
              className="tour-marquee-track flex w-max"
              style={{
                gap: "16px",
                paddingLeft: "16px",
              }}
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
            >
              {(() => {
                const repeatedList = buildInfiniteMarqueeList(filteredVehicles, 'veh', 8);
                return repeatedList.map((vehicle, idx) => (
                  <div
                    key={`veh-${vehicle.id}-${idx}`}
                    className={`flex-shrink-0 flex flex-col rounded-[16px] overflow-hidden group relative w-[280px] h-[360px] md:h-[380px] transition-all duration-[350ms] ease-out hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(245,166,35,0.35)] hover:z-10 border border-obsidian-700/50 hover:border-gold-500 bg-obsidian-900 ${vehicle.isDuplicate ? 'hidden md:flex' : 'snap-start'}`}
                  >
                    <img
                      src={vehicle.heroImage || vehicle.image}
                      alt={vehicle.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent"></div>

                    <div className="package-badge-text absolute top-4 left-4 bg-gold-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded shadow-md">
                      {vehicle.category === 'bus' ? t('transportation.filter.buses', 'Buses') :
                        vehicle.category === 'coaster' ? t('transportation.filter.coasters', 'Coaster Vehicles') :
                          t('transportation.filter.private', 'Private Vehicles')}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                      <h3 className="font-display text-xl text-ivory-50 mb-1 drop-shadow-md">
                        {vehicle.name}
                      </h3>
                      <div className="flex items-center text-xs text-white mb-3 gap-1">
                        <svg
                          className="w-4 h-4 text-gold-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {vehicle.seats}{" "}
                        {t("transportation.seatsCount", "Seats")}
                      </div>

                      <div className="flex items-center justify-between mb-4 border-t border-ivory-50/20 pt-3 mt-1">
                        <span className="text-xs text-white uppercase tracking-wider">
                          {t("tourCard.from", "From")}
                        </span>
                        <span className="text-lg font-semibold text-gold-500">
                          {formatPrice(vehicle.pricePerDay)}
                          <span className="text-xs text-white font-normal">
                            {" "}
                            / {t("transportation.day", "day")}
                          </span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleHomeReserveClick(vehicle.id)}
                        className="w-full py-2 text-sm font-semibold text-white transition-colors border border-gold-500 rounded-lg flex items-center justify-center bg-obsidian-900/40 backdrop-blur-sm cursor-pointer outline-none hover:bg-gold-500 hover:text-obsidian-950"
                      >
                        {t("transportation.reserveNow", "Reserve Now")}
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white dark:bg-obsidian-950 border-t border-gray-100 dark:border-white/5 content-auto">
        {/* Decorative backdrop elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" 
          style={{ 
            background: 'radial-gradient(circle at 10% 20%, rgb(30,58,138) 0%, transparent 40%), radial-gradient(circle at 90% 80%, #F5A623 0%, transparent 40%)' 
          }} 
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="inline-block text-gold-600 dark:text-gold-400 uppercase tracking-[0.25em] text-caption mb-4 font-bold text-xs px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 shadow-sm">
              {t('home.servicesSub', 'Our Services')}
            </span>
            <h2 className="text-display-lg text-obsidian-900 dark:text-white font-display mb-6 tracking-wide">
              {t('home.servicesTitle', 'Services')}
            </h2>
            <p className="text-black dark:text-white text-body-md max-w-xl mx-auto font-body font-semibold">
              {t('home.servicesDesc', 'Premium travel solutions tailored to your needs')}
            </p>
            <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-8 rounded-full" />
          </motion.div>

          {/* Dynamic Expanding Panels */}
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto min-h-[500px] md:h-[550px]">
            
            {/* Hotels Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative flex-1 md:hover:grow-[1.4] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-lg border border-gold-200/20 flex flex-col justify-end"
            >
              <Link to="/services" className="absolute inset-0 z-20" aria-label={t('nav.hotelsTab', 'Hotels')} />
              {/* Background Image with Muted Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-black/40 opacity-95 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Golden Overlay Light Leak */}
              <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Background Motif: Arched Dome Outlines */}
              <svg className="absolute -right-12 -bottom-12 w-64 h-64 text-gold-500/10 pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
                <path d="M50 10v80M10 50h80" />
                <path d="M22 22l56 56M22 78l56-56" />
              </svg>

              {/* Content Panel */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-start transform md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Custom Palace Door SVG Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 group-hover:scale-110">
                  <svg className="w-9 h-9 text-gold-400 group-hover:text-obsidian-900 transition-colors duration-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 52V28C12 16.9543 20.9543 8 32 8C43.0457 8 52 16.9543 52 28V52" strokeLinecap="round"/>
                    <path d="M6 52H58" strokeLinecap="round"/>
                    <path d="M22 52V30C22 24.4772 26.4772 20 32 20C37.5228 20 42 24.4772 42 30V52" strokeLinecap="round"/>
                    <circle cx="32" cy="30" r="4" fill="currentColor"/>
                    <path d="M32 34V42" strokeLinecap="round"/>
                    <line x1="32" y1="8" x2="32" y2="14" strokeLinecap="round"/>
                    <path d="M28 14H36" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="space-y-3 flex-grow">
                  <span className="text-[11px] text-white group-hover:text-gold-400 font-extrabold uppercase tracking-[0.2em] transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">01 / Sanctuary Stay</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-gold-400 font-display tracking-wide transition-colors duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">{t('nav.hotelsTab', 'Hotels')}</h3>
                  <p className="text-white group-hover:text-gold-300 text-sm leading-relaxed font-body font-semibold max-w-sm transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] opacity-95">
                    {t('home.servicesHotelsDesc', 'Luxury 5-star accommodations and handpicked boutique hotels across all destinations')}
                  </p>
                  
                  {/* Action Link */}
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-white group-hover:text-gold-400 transition-colors pt-2 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    <span>{t('services.explore', 'Explore')}</span>
                    <FaArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Transportation Card */}
            <motion.a
              href="/programs/transportation"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex-1 md:hover:grow-[1.4] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-lg border border-gold-200/20 flex flex-col justify-end"
            >
              {/* Background Image with Muted Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://res.cloudinary.com/degbrq3ck/image/upload/w_600,c_limit,q_auto:eco,f_auto/v1783071610/bus1_lprkiy.jpg')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-black/40 opacity-95 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Golden Overlay Light Leak */}
              <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Background Motif: Navigational Lines */}
              <svg className="absolute -right-12 -bottom-12 w-64 h-64 text-gold-500/10 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <path d="M10 90 C 20 40, 80 60, 90 10" strokeLinecap="round" />
                <path d="M15 90 C 25 45, 75 55, 85 15" strokeLinecap="round" strokeDasharray="3 3" />
                <circle cx="90" cy="10" r="4" fill="currentColor" />
                <circle cx="10" cy="90" r="4" fill="currentColor" />
              </svg>

              {/* Content Panel */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-start transform md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Custom Windrose / Navigator SVG Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 group-hover:scale-110">
                  <svg className="w-9 h-9 text-gold-400 group-hover:text-obsidian-900 transition-colors duration-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="32" cy="32" r="24" strokeDasharray="4 4" strokeLinecap="round"/>
                    <path d="M32 12L36 28L32 32L28 28Z" fill="currentColor" opacity="0.3"/>
                    <path d="M32 52L28 36L32 32L36 36Z" fill="currentColor" opacity="0.3"/>
                    <path d="M12 32L28 28L32 32L28 36Z" fill="currentColor" opacity="0.3"/>
                    <path d="M52 32L36 36L32 32L36 28Z" fill="currentColor" opacity="0.3"/>
                    <path d="M32 10V22" strokeLinecap="round"/>
                    <path d="M30 14L32 10L34 14" strokeLinecap="round" strokeJoin="round"/>
                    <path d="M16 48C28 48 24 24 48 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="48" cy="20" r="3" fill="currentColor"/>
                  </svg>
                </div>

                <div className="space-y-3 flex-grow">
                  <span className="text-[11px] text-white group-hover:text-gold-400 font-extrabold uppercase tracking-[0.2em] transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">02 / Premium Voyage</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white group-hover:text-gold-400 font-display tracking-wide transition-colors duration-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">{t('nav.transportation', 'Transportation')}</h3>
                  <p className="text-white group-hover:text-gold-300 text-sm leading-relaxed font-body font-semibold max-w-sm transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] opacity-95">
                    {t('home.servicesTransportDesc', 'Private luxury vehicles, airport transfers, and chauffeur-driven tours with expert drivers')}
                  </p>
                  
                  {/* Action Link */}
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-white group-hover:text-gold-400 transition-colors pt-2 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    <span>{t('services.explore', 'Explore')}</span>
                    <FaArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </motion.a>

          </div>
        </div>
      </section>

      {/* 2. Photo Showcase Carousel */}
      <Suspense fallback={
        <div className="w-full min-h-[580px] h-[580px] my-6 bg-obsidian-950/50 backdrop-blur-md rounded-3xl border border-amber-500/10 flex flex-col items-center justify-center gap-4 text-gold-400/70">
          <div className="w-10 h-10 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase">Loading Photo Gallery...</span>
        </div>
      }>
        <PhotoShowcaseCarousel photos={showcasePhotos} loading={showcaseLoading} />
      </Suspense>

      {/* 3. Video Showcase Carousel */}
      <Suspense fallback={
        <div className="w-full min-h-[580px] h-[580px] my-6 bg-obsidian-950/50 backdrop-blur-md rounded-3xl border border-amber-500/10 flex flex-col items-center justify-center gap-4 text-gold-400/70">
          <div className="w-10 h-10 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase">Loading Video Showcase...</span>
        </div>
      }>
        <VideoShowcaseCarousel videos={showcaseVideos} loading={showcaseLoading} />
      </Suspense>

      {/* Contact Info Section */}
      <section 
        className="py-20 lg:py-32 relative overflow-hidden content-auto"
        style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}
      >
        {/* Subtle shine overlay matching top header */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, #fff 50%, transparent 100%)' }} />

        {/* Top and Bottom Gold accent borders matching top header */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)' }} />

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#F5A623]/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            
            {/* Left Column: Visual Focal Point + Typography Heading */}
            <div className="lg:col-span-2 space-y-8 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-caption uppercase tracking-[0.2em] font-bold text-xs mx-auto lg:mx-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {t('home.contactSub', 'Get In Touch')}
                </div>
                
                <h2 className="text-display-lg text-white font-display leading-tight tracking-wide gold-text-glow">
                  {t('home.contactTitle', "We're Here to Help")}
                </h2>
                
                <p className="text-body-md text-white leading-relaxed font-body max-w-md mx-auto lg:mx-0">
                  {i18n.language === 'ar' 
                    ? "فريق مستشاري السفر الفاخر لدينا متاح دائمًا لتصميم رحلتك المخصصة والإجابة على أي استفسارات على مدار الساعة."
                    : "Our dedicated travel advisors are standing by 24/7 to design your bespoke itinerary, answer questions, or provide support at any point of your journey."
                  }
                </p>
              </motion.div>

              {/* Headset Support Focal Point */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="relative w-48 h-48 mx-auto lg:ms-0 flex items-center justify-center"
              >
                {/* Glowing Circles */}
                <div className="absolute inset-0 rounded-full border border-[#F5A623]/25 animate-ring-slow" />
                <div className="absolute inset-4 rounded-full border border-[#F5A623]/40 animate-ring-fast" />
                
                {/* Center visual box */}
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#C9A227] to-[#F5A623] p-0.5 shadow-[#F5A623]/20 shadow-2xl relative flex items-center justify-center border border-white/10 group hover:rotate-6 transition-transform duration-500">
                  <div className="absolute inset-[2px] bg-[#061D5D] rounded-[22px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <FaHeadset className="w-12 h-12 text-[#F5A623] group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <a
                  href="https://wa.me/201149401111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
                >
                  <FaWhatsapp className="w-5 h-5 group-hover:rotate-12 transition-transform text-white" />
                  {i18n.language === 'ar' ? "تحدث معنا عبر واتساب" : "Chat on WhatsApp"}
                </a>
                
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glassmorphism-card text-white font-medium uppercase tracking-wider text-xs px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  {i18n.language === 'ar' ? "صفحة الاتصال" : "Contact Page"}
                  <FaArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column: 3 Contact Cards */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Card 1: Address */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="glassmorphism-card rounded-2xl p-6 md:p-8 flex items-start gap-6 group transition-all duration-300 text-start"
              >
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#061D5D] transition-all duration-300 shrink-0 shadow-lg">
                  <FaMapMarkerAlt className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest block">01 / {t('contact.office', 'Address')}</span>
                  <h3 className="text-lg font-bold text-white tracking-wide font-display">{t('home.contactAddress', 'Our Location')}</h3>
                  <p className="text-white/90 text-sm leading-relaxed font-body">
                    5 Hussein Said St, Old Hadayk El Ahram<br />
                    First floor, Flat 102 – 103<br />
                    Haram - Giza – Egypt
                  </p>
                  <a 
                    href="https://maps.google.com/?q=5+Hussein+Said+St,+Old+Hadayk+El+Ahram,+Haram,+Giza,+Egypt" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-white/80 transition-colors pt-2 group/link"
                  >
                    {i18n.language === 'ar' ? "عرض على الخريطة" : "Open in Google Maps"}
                    <FaArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform text-white" />
                  </a>
                </div>
              </motion.div>

              {/* Card 2: Phone */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -6 }}
                className="glassmorphism-card rounded-2xl p-6 md:p-8 flex items-start gap-6 group transition-all duration-300 text-start"
              >
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#061D5D] transition-all duration-300 shrink-0 shadow-lg">
                  <FaPhoneAlt className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest block">02 / {t('contact.phoneLabel', 'Phone')}</span>
                  <h3 className="text-lg font-bold text-white tracking-wide font-display">{t('home.contactPhone', 'Call Us')}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href="tel:+20233746643"
                      className="inline-flex items-center gap-2.5 text-white hover:text-white/80 text-sm font-medium transition-colors py-1 px-3 rounded-lg bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/15"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      02 33746643
                    </a>
                    <a
                      href="tel:+20233746654"
                      className="inline-flex items-center gap-2.5 text-white hover:text-white/80 text-sm font-medium transition-colors py-1 px-3 rounded-lg bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/15"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      02 33746654
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Email */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -6 }}
                className="glassmorphism-card rounded-2xl p-6 md:p-8 flex items-start gap-6 group transition-all duration-300 text-start"
              >
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#061D5D] transition-all duration-300 shrink-0 shadow-lg">
                  <FaEnvelope className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest block">03 / {t('contact.emailLabel', 'Email')}</span>
                  <h3 className="text-lg font-bold text-white tracking-wide font-display">{t('home.contactEmail', 'Email Us')}</h3>
                  
                  <div className="pt-2">
                    <a
                      href="mailto:info@dunas-travel.com"
                      aria-label="Send us an email at info@dunas-travel.com"
                      className="inline-flex items-center gap-2.5 text-white hover:text-white/80 text-sm font-medium transition-colors py-1.5 px-4 rounded-lg bg-white/10 border border-white/10 hover:border-white/30 hover:bg-white/15"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      info@dunas-travel.com
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section
        className="relative py-20 lg:py-28 bg-obsidian-900 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/u7xf91gp/image/upload/v1787814393/dunas-travel/catalog/30220e12459b5d974a167d56024e5403d2f5e9c8ec82006eaa849e42e640b042.webp')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display italic text-4xl md:text-5xl lg:text-6xl text-ivory-50 mb-6 drop-shadow-lg">
              {t("home.ctaTitle", "Your Next Adventure Awaits")}
            </h2>
            <p className="text-body-lg text-ivory-300 mb-10 max-w-xl mx-auto drop-shadow-md">
              {t(
                "home.ctaDesc",
                "Let us craft a journey tailored entirely to you",
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/contact">
                <Button
                  variant="gold-glow"
                  className="px-8 py-4 text-lg w-full sm:w-auto"
                >
                  {t("home.ctaStart", "Start Planning")}
                </Button>
              </Link>
              <Button
                variant="glass"
                className="px-8 py-4 text-lg w-full sm:w-auto"
                onClick={() => setIsAllToursPopupOpen(true)}
              >
                {t("home.ctaBrowse", "Browse Tours")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Tours Popup Modal */}
      <AnimatePresence>
        {isAllToursPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setIsAllToursPopupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[16px] max-w-[1000px] w-[95%] md:w-[90%] max-h-[85vh] overflow-y-auto p-5 md:p-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-2xl font-bold cursor-pointer text-gray-500 hover:text-black select-none z-[10000]"
                onClick={() => setIsAllToursPopupOpen(false)}
              >
                &times;
              </button>

              {/* Popup Title */}
              <h2 className="text-center font-display text-3xl font-semibold text-obsidian-900 mb-6">
                {t("home.allToursTitle", "All Tours")}
              </h2>

              {/* Tours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {allToursForMarquee.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col h-full text-left"
                  >
                    {/* Tour image on top */}
                    <div className="h-[180px] w-full overflow-hidden">
                      {tour.images[0] ? (
                        <img
                          src={tour.images[0]}
                          alt={t(`data.${tour.title}`, tour.title)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-obsidian-800 px-4 text-center text-sm text-ivory-300">
                          {t('tour.imageUnavailable', 'No image has been added for this tour.')}
                        </div>
                      )}
                    </div>

                    {/* Tour name below image */}
                    <h3 className="font-semibold text-base text-obsidian-900 p-3 pb-1 line-clamp-2">
                      {t(`data.${tour.title}`, tour.title)}
                    </h3>

                    {/* Short description if available */}
                    {tour.description && (
                      <p className="text-[13px] text-black font-medium px-3 pb-3 flex-grow line-clamp-3">
                        {t(`data.${tour.description}`, tour.description)}
                      </p>
                    )}

                    {/* View Details button at the bottom */}
                    <div className="p-3 pt-0 mt-auto">
                      <Link to={tour.link}>
                        <Button
                          variant="outline-gold"
                          className="w-full py-2 text-sm text-center"
                        >
                          {t("tourCard.viewDetails", "View Details")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Our Brands Logos - White Background */}
      <section 
        className="w-full bg-white dark:bg-white py-12 sm:py-16 content-auto our-brands-section"
        style={{ backgroundColor: '#ffffff', color: '#000000' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h3 
            className="text-center text-obsidian-900 dark:text-obsidian-900 text-xl sm:text-2xl font-bold mb-10 our-brands-title"
            style={{ color: '#000000' }}
          >
            {t('ourBrands.title', 'Our Brands')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 lg:gap-16 items-center justify-items-center">
            {[
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_webp/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.webp", alt: "Logo 1" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033441/logo20_f5rfsz.png", alt: "Logo 2" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033442/logo3_sk0tns.png", alt: "Logo 3" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033442/logo4_tso9ey.png", alt: "Logo 4" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783033440/logo5_qpuki9.png", alt: "Logo 5" },
              { src: "https://res.cloudinary.com/degbrq3ck/image/upload/w_200,h_120,c_limit,q_auto,f_auto/v1783074195/drilldown-removebg-preview_z9np4k.png", alt: "Logo 6" },
            ].map((logo, idx) => (
              <div key={idx} className="flex items-center justify-center w-full h-28 select-none">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={200}
                  height={120}
                  loading="lazy"
                  decoding="async"
                  className="max-h-20 md:max-h-24 max-w-[180px] md:max-w-[220px] w-auto h-auto object-contain hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeExperienceSection;
