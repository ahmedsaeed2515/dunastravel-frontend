import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaCompass, FaHotel, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import DurationSortFilter from '../../components/common/DurationSortFilter';
import { useLandingPage } from '../../hooks/useLandingPage';
import ErrorState from '../../components/ui/ErrorState';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import { useTours } from '../../hooks/useTours';
import Button from '../../components/ui/Button';

function readableSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.filter((section) => typeof section === 'string' && section.trim());
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const DEST_FALLBACK_DATA = {
  jordan: {
    badge: 'dest.jordan.badge',
    badgeDefault: '🏜️ Rose Red World Wonder & Cosmic Valleys',
    headline: 'dest.jordan.headline',
    headlineDefault: 'الأردن.. سحر البتراء الوردي وجمال وادي رم الكوني',
    subtitle: 'dest.jordan.subtitle',
    subtitleDefault: 'الأردن: حيث يلتقي تاريخ الأنباط بعجائب الصحراء والعافية في البحر الميت',
    desc: 'dest.jordan.desc',
    descDefault: 'اكتشف السيق العجيب والبتراء الوردية، وعش تجربة التخييم الفاخر تحت نجوم وادي رم، والاسترخاء في أفضل منتجعات البحر الميت.',
    tags: ['dest.jordan.tag1', 'dest.jordan.tag2', 'dest.jordan.tag3'],
    tagsDefault: ['🏛️ VIP Petra Entry & Guided Tour', '🌌 Luxury Bubble Camps in Wadi Rum', '🌊 Dead Sea Luxury Wellness Resorts'],
    heroImage: 'https://res.cloudinary.com/nclvl0iu/image/upload/w_1200,q_auto,f_auto/v1790354904/272930_compressed_f3rjnj_compressed.webp',
    hotelCities: ['amman', 'petra', 'wadiRum', 'aqaba', 'deadSea'],
  },
  turkey: {
    badge: 'dest.turkey.badge',
    badgeDefault: '✨ Bosphorus Magic & Cappadocia Wonders',
    headline: 'dest.turkey.headline',
    headlineDefault: 'تركيا.. جوهرة الأناضول والتاريخ البسفوري الفاخر',
    subtitle: 'dest.turkey.subtitle',
    subtitleDefault: 'جوهرة البسفور وسحر مناطيد كابادوكيا',
    desc: 'dest.turkey.desc',
    descDefault: 'استمتع بجولات القصور العثمانية في إسطنبول، وركوب المناطيد فوق مداخن كابادوكيا، والاستجمام في منتجعات الريفيرا التركية.',
    tags: ['dest.turkey.tag1', 'dest.turkey.tag2', 'dest.turkey.tag3'],
    tagsDefault: ['🎈 Private Cappadocia Hot Air Balloon Flights', '🛥️ Private Luxury Yacht Cruises on the Bosphorus', '🏰 Royal Cave Hotel Stays'],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80',
  },
  dubai: {
    badge: 'dest.dubai.badge',
    badgeDefault: '💎 Ultimate Luxury & Futuristic Experiences',
    headline: 'dest.dubai.headline',
    headlineDefault: 'دبي.. عاصمة الفخامة العالمية والمغامرات المستقبلية',
    subtitle: 'dest.dubai.subtitle',
    subtitleDefault: 'دبي: حيث تلتقي ناطحات السحاب بالرفاهية الملكية',
    desc: 'dest.dubai.desc',
    descDefault: 'عش تجربة الفخامة العالمية بين أشهر أفق معماري في العالم، والجزر الاصطناعية، وسفاري الصحراء الـ VIP.',
    tags: ['dest.dubai.tag1', 'dest.dubai.tag2', 'dest.dubai.tag3'],
    tagsDefault: ['🏙️ VIP Burj Khalifa & Observation Deck Tickets', '🏎️ Luxury Sports Car & Private Yacht Cruise', '🏜️ Royal Desert Safari with VIP Dinner'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
  },
  morocco: {
    badge: 'dest.morocco.badge',
    badgeDefault: '🕌 Imperial Medina Charm & Sahara Mystique',
    headline: 'dest.morocco.headline',
    headlineDefault: 'المغرب.. سحر المدن العريقة وغموض الصحراء الكبرى',
    subtitle: 'dest.morocco.subtitle',
    subtitleDefault: 'المغرب: أصالة الأندلس وجمال الرياضات الملكية والغروب الصحراوي',
    desc: 'dest.morocco.desc',
    descDefault: 'اكتشف أسواق مراكش وفاس الفاسحة، واستمتع بإقامة في أفخم الرياضات التراثية، ومغامرات الكثبان الذهبية في مرزوكة.',
    tags: ['dest.morocco.tag1', 'dest.morocco.tag2', 'dest.morocco.tag3'],
    tagsDefault: ['🏰 Stays in Historic Luxury Riads', '🐫 Luxury Sahara Desert Safari in Merzouga', '🎨 Exclusive Tours in Marrakech & Fes Souks'],
    heroImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1920&q=80',
  },
  tunisia: {
    badge: 'dest.tunisia.badge',
    badgeDefault: '🏛️ Ancient Carthage & Blue Mediterranean Charm',
    headline: 'dest.tunisia.headline',
    headlineDefault: 'تونس.. عبق قرطاج وسحر سيدي بوسعيد الأزرق',
    subtitle: 'dest.tunisia.subtitle',
    subtitleDefault: 'تونس: تاريخ الحضارات وعروس البحر الأبيض المتوسط',
    desc: 'dest.tunisia.desc',
    descDefault: 'استمتع بجولات بين آثار قرطاج الشامخة، والأزقة البيضاء والزرقاء ساحرة الجمال في سيدي بوسعيد، وواحات توزر الصحراوية.',
    tags: ['dest.tunisia.tag1', 'dest.tunisia.tag2', 'dest.tunisia.tag3'],
    tagsDefault: ['🏛️ El Jem Amphitheatre & Legendary Carthage', '🌊 Sidi Bou Said Blue & White Coastal Views', '🌴 Tozeur Oases & Luxury Sahara Camping'],
    heroImage: '/imgs/destinations/tunisia.webp',
  },
  greece: {
    badge: 'dest.greece.badge',
    badgeDefault: '🇬🇷 Greek Mythology & Iconic Aegean Islands',
    headline: 'dest.greece.headline',
    headlineDefault: 'اليونان.. مهد الحضارة وأسطورة الجزر الإيجية',
    subtitle: 'dest.greece.subtitle',
    subtitleDefault: 'اليونان: غروب سانتوريني الساحر وتاريخ الأكروبوليس الخالد',
    desc: 'dest.greece.desc',
    descDefault: 'رحلة خيالية بين بيوت سانتوريني البيضاء وشواطئ ميكونوس الفاخرة وآثار أثينا الأسطورية.',
    tags: ['dest.greece.tag1', 'dest.greece.tag2', 'dest.greece.tag3'],
    tagsDefault: ['🌅 Luxury Private Pool Suites in Santorini', '🏛️ VIP Acropolis & Ancient Ruins Tours', '🛥️ Private Yacht Cruises in Mykonos & Crete'],
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80',
  },
  egypt: {
    badge: 'dest.egypt.badge',
    badgeDefault: '🏛️ 7000 Years of Eternal History & Pure Luxury',
    headline: 'dest.egypt.headline',
    headlineDefault: 'Egypt: Where Eternal History Meets Pure Luxury',
    subtitle: 'dest.egypt.subtitle',
    subtitleDefault: 'Egypt: Legendary Pyramids & 5-Star Deluxe Nile Cruises',
    desc: 'dest.egypt.desc',
    descDefault: 'Embark on a legendary journey through time across Cairo, Luxor, Aswan, and Red Sea luxury resorts.',
    tags: ['dest.egypt.tag1', 'dest.egypt.tag2', 'dest.egypt.tag3'],
    tagsDefault: ['🚢 5-Star Deluxe Nile Cruises', '👑 Private Egyptologist Guides', '🐫 Luxury Desert Safaris'],
    heroImage: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
  },
  egipto: {
    badge: 'dest.egypt.badge',
    badgeDefault: '🏛️ 7000 Years of Eternal History & Pure Luxury',
    headline: 'dest.egypt.headline',
    headlineDefault: 'Egypt: Where Eternal History Meets Pure Luxury',
    subtitle: 'dest.egypt.subtitle',
    subtitleDefault: 'Egypt: Legendary Pyramids & 5-Star Deluxe Nile Cruises',
    desc: 'dest.egypt.desc',
    descDefault: 'Embark on a legendary journey through time across Cairo, Luxor, Aswan, and Red Sea luxury resorts.',
    tags: ['dest.egypt.tag1', 'dest.egypt.tag2', 'dest.egypt.tag3'],
    tagsDefault: ['🚢 5-Star Deluxe Nile Cruises', '👑 Private Egyptologist Guides', '🐫 Luxury Desert Safaris'],
    heroImage: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
  },
  'multi-country': {
    badge: 'nav.multiCountry',
    badgeDefault: '🌍 Multi-Country Expeditions',
    headline: 'dest.egypt.multiCountryTitle',
    headlineDefault: 'Grand Middle East & Mediterranean Multi-Country Tours',
    subtitle: 'dest.egypt.multiCountrySubtitle',
    subtitleDefault: 'Multi-Country Grand Expeditions',
    desc: 'dest.egypt.multiCountryDesc',
    descDefault: 'Explore combined itineraries featuring Egypt, Jordan, Dubai, and Greek islands.',
    tags: ['dest.starsMiddleEast', 'dest.egyptGreece', 'dest.egyptTurkey'],
    tagsDefault: ['🌟 Stars of the Middle East (19 Days)', '🏛️ Egypt & Greece (11 Days)', '✨ Egypt & Turkey (15 Days)'],
    heroImage: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1789341982/62de536e-2674-4518-b31c-ce74f137c119_jxxocg.jpg',
  },
  religious: {
    badge: 'nav.religious',
    badgeDefault: '🕊️ Holy Family Trail & Sacred Spiritual Pilgrimages',
    headline: 'dest.holylands.headline',
    headlineDefault: 'Holy Family Trail & Sacred Spiritual Pilgrimages',
    subtitle: 'dest.holylands.subtitle',
    subtitleDefault: 'Holy Family Trail & Sacred Spiritual Pilgrimages',
    desc: 'dest.holylands.desc',
    descDefault: 'Deep spiritual journey following the Holy Family trail across Egypt and Jordan.',
    tags: ['dest.holylands.tag1', 'dest.holylands.tag2', 'dest.holylands.tag3'],
    tagsDefault: ['📖 Expert Religious History Guides', '🏨 5-Star Stays Near Sacred Landmarks', '✈️ Complete VIP Visa & Transport Services'],
    heroImage: '/images/holy-land.webp',
  },
  holyland: {
    badge: 'nav.holyland',
    badgeDefault: '🕊️ Cradle of Civilizations & Sacred Heritage',
    headline: 'dest.holyland.title',
    headlineDefault: 'Holy Land: Ancient History & Eternal Spiritual Heritage',
    subtitle: 'dest.holyland.subtitle',
    subtitleDefault: 'Holy Land: Ancient History & Eternal Spiritual Heritage',
    desc: 'dest.holyland.desc',
    descDefault: 'Explore historic and spiritual landmarks in the Holy Land on curated tours.',
    tags: ['dest.holyland.tag1', 'dest.holyland.tag2', 'dest.holyland.tag3'],
    tagsDefault: ['🕊️ VIP Spiritual & Historical Heritage Tours', '🏨 Luxury Historic Hotel Stays', '✈️ Seamless Full Transport & Support'],
    heroImage: '/images/holy-land.webp',
  },
  'holy-land': {
    badge: 'nav.holyland',
    badgeDefault: '🕊️ Cradle of Civilizations & Sacred Heritage',
    headline: 'dest.holyland.title',
    headlineDefault: 'Holy Land: Ancient History & Eternal Spiritual Heritage',
    subtitle: 'dest.holyland.subtitle',
    subtitleDefault: 'Holy Land: Ancient History & Eternal Spiritual Heritage',
    desc: 'dest.holyland.desc',
    descDefault: 'Explore historic and spiritual landmarks in the Holy Land on curated tours.',
    tags: ['dest.holyland.tag1', 'dest.holyland.tag2', 'dest.holyland.tag3'],
    tagsDefault: ['🕊️ VIP Spiritual & Historical Heritage Tours', '🏨 Luxury Historic Hotel Stays', '✈️ Seamless Full Transport & Support'],
    heroImage: '/images/holy-land.webp',
  }
};

export default function LandingPageDetails({ destinationOnly = false, slug: slugProp }) {
  const params = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const routeSlug = params.slug || params.programSlug || params.programId || params.id;
  const rawSlug = slugProp || routeSlug || (pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : undefined);
  const slug = (rawSlug || '').toLowerCase().trim();
  const { t } = useTranslation();
  const { landingPage, loading, error, retry } = useLandingPage(slug, { destinationOnly });
  const { tours: allCatalogTours } = useTours({ limit: 70 });
  const [displayTours, setDisplayTours] = React.useState([]);

  React.useEffect(() => {
    setDisplayTours([]);
  }, [slug]);

  const config = DEST_FALLBACK_DATA[slug] || {};
  const effectiveLandingPage = landingPage || (config && (config.headline || config.headlineDefault) ? {
    id: slug,
    slug,
    title: config.headline ? t(config.headline, config.headlineDefault) : (config.headlineDefault || slug.toUpperCase()),
    subtitle: config.subtitle ? t(config.subtitle, config.subtitleDefault) : (config.subtitleDefault || ''),
    description: config.desc ? t(config.desc, config.descDefault) : (config.descDefault || ''),
    brief: config.desc ? t(config.desc, config.descDefault) : (config.descDefault || ''),
    type: 'DESTINATION',
    heroImageUrl: config.heroImage || '/images/holy-land.webp',
    tours: [],
    sections: [],
  } : null);

  const sortedTours = React.useMemo(() => {
    const providedTours = Array.isArray(landingPage?.tours) && landingPage.tours.length > 0
      ? landingPage.tours
      : [];

    const targetSlug = (slug === 'egipto' || slug === 'egito') ? 'egypt' : slug;
    const filteredProvidedTours = providedTours.filter((tour) => {
      if (targetSlug === 'holy-land' || targetSlug === 'holyland') {
        const s = String(tour?.slug || tour?.id || '').toLowerCase();
        if (s.includes('holy-family')) return false;
      }
      return true;
    });

    const DEST_ALIASES = {
      'united arab emirates': 'dubai',
      'uae': 'dubai',
      'emirates': 'dubai',
      'holy land': 'holy-land',
      'holyland': 'holy-land',
    };
    const normalizeDestStr = (str) => {
      const clean = String(str || '').toLowerCase().trim();
      return DEST_ALIASES[clean] || clean;
    };

    const matchedCatalogTours = (allCatalogTours || []).filter((tour) => {
      const rawDest = String(tour.destination || tour.country || '').toLowerCase();
      const tourDest = normalizeDestStr(rawDest);
      const normalizedTarget = normalizeDestStr(targetSlug);
      const tourCategory = String(tour.category || tour.type || '').toLowerCase();
      const tourSlug = String(tour.slug || tour.id || '').toLowerCase();

      if (normalizedTarget === 'holy-land') {
        if (tourSlug.includes('holy-family')) return false;
        return tourDest === 'holy-land';
      }
      if (normalizedTarget === 'religious') {
        return tourCategory.includes('religious') || tourDest.includes('coptic') || tourSlug.includes('holy-family');
      }
      if (normalizedTarget === 'multi-country' || normalizedTarget === 'multi_country') {
        return tourDest.includes('multi') || tourCategory.includes('multi');
      }
      return tourDest === normalizedTarget || tourDest.includes(normalizedTarget) || normalizedTarget.includes(tourDest);
    });

    const rawToursToDisplay = filteredProvidedTours.length > 0
      ? filteredProvidedTours
      : matchedCatalogTours;

    return [...rawToursToDisplay].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  }, [landingPage?.tours, allCatalogTours, slug]);

  if (loading && !effectiveLandingPage) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-6xl grid-cols-1 gap-8 px-6 py-24 md:grid-cols-3" role="status" aria-label={t('common.loading', 'Loading destination')}>
        {[0, 1, 2].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-obsidian-200/70 dark:bg-obsidian-800/50" />)}
      </div>
    );
  }

  if (error && !effectiveLandingPage) {
    const isMissing = error.status === 404;
    const isUnauthorized = error.status === 401 || error.status === 403;
    const title = isMissing
      ? t('destinations.unavailable', 'This destination is unavailable')
      : t('destinations.loadError', 'Destination details could not be loaded');
    const message = isMissing
      ? t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')
      : isUnauthorized
        ? t('destinations.accessError', 'You do not have permission to view this destination.')
        : error.message || t('destinations.retryDescription', 'Please try again in a moment.');
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-start">
        <ErrorState
          title={title}
          message={message}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
        <Link
          className="mx-auto mt-4 inline-flex min-h-11 items-center rounded-full border border-gold-500/30 px-5 py-3 font-semibold text-obsidian-900 dark:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          to="/destinations"
        >
          {t('destinations.back', 'Browse destinations')}
        </Link>
      </section>
    );
  }

  if (!effectiveLandingPage) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-start">
        <ErrorState
          title={t('destinations.unavailable', 'This destination is unavailable')}
          message={t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
        <Link
          className="mx-auto mt-4 inline-flex min-h-11 items-center rounded-full border border-gold-500/30 px-5 py-3 font-semibold text-obsidian-900 dark:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          to="/destinations"
        >
          {t('destinations.back', 'Browse destinations')}
        </Link>
      </section>
    );
  }

  const sections = readableSections(effectiveLandingPage.sections);

  const heroBadge = config.badge ? t(config.badge, config.badgeDefault) : (effectiveLandingPage.type || 'LUXURY DESTINATION');
  const heroTitle = effectiveLandingPage.title || (config.headline ? t(config.headline, config.headlineDefault) : slug.toUpperCase());
  const heroSubtitle = effectiveLandingPage.subtitle || (config.subtitle ? t(config.subtitle, config.subtitleDefault) : '');
  const heroDesc = effectiveLandingPage.description || (config.desc ? t(config.desc, config.descDefault) : effectiveLandingPage.brief || '');
  const heroHighlights = config.tags
    ? config.tags.map((tagKey, idx) => t(tagKey, config.tagsDefault?.[idx] || ''))
    : [];
  const heroImage = landingPage?.heroImageUrl || effectiveLandingPage?.heroImageUrl || config.heroImage || '/imgs/destinations/egypt.webp';

  // Jordan specific matrices
  const isJordan = slug === 'jordan';
  const hotelCities = config.hotelCities || [];
  const includedItems = isJordan ? t('dest.jordan.includesList', { returnObjects: true }) : null;
  const excludedItems = isJordan ? t('dest.jordan.excludesList', { returnObjects: true }) : null;
  const safeIncludes = Array.isArray(includedItems) ? includedItems : [];
  const safeExcludes = Array.isArray(excludedItems) ? excludedItems : [];

  return (
    <main className="bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{`${effectiveLandingPage.seoTitle || heroTitle} | Dunas Travel`}</title>
        {effectiveLandingPage.seoDescription && <meta name="description" content={effectiveLandingPage.seoDescription} />}
        {effectiveLandingPage.seoKeywords && <meta name="keywords" content={effectiveLandingPage.seoKeywords} />}
      </Helmet>

      {/* Luxury Hero Section */}
      {effectiveLandingPage.heroVideoUrl ? (
        <section className="relative isolate overflow-hidden bg-obsidian-900 text-ivory-50">
          <video
            src={effectiveLandingPage.heroVideoUrl}
            poster={heroImage}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian-950 via-obsidian-900/70 to-obsidian-950/40" />
          <div className="container mx-auto px-6 py-24 md:py-36">
            <Link
              to={destinationOnly ? '/destinations' : '/programs'}
              className="text-[11px] xs:text-xs sm:text-sm font-black uppercase tracking-widest text-[#F5A623] hover:text-white transition-colors inline-flex items-center gap-2 max-w-[94vw] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#F5A623]/60 backdrop-blur-md shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)' }}
            >
              <FaCompass className="text-[#F5A623] text-xs shrink-0" />
              <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-snug">{destinationOnly ? t('destinations.all', 'All destinations') : t('programs.all', 'All programs')}</span>
            </Link>
            <h1 className="mt-4 max-w-4xl text-display-xl font-display drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="mt-3 max-w-2xl text-xl sm:text-2xl text-gold-400 font-black tracking-widest uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_12px_rgba(245,166,35,0.7),_0_4px_24px_rgba(0,0,0,0.95)]">{heroSubtitle}</p>
            )}
            {effectiveLandingPage.brief && (
              <p className="mt-5 max-w-3xl leading-relaxed text-ivory-200 text-body-lg">{effectiveLandingPage.brief}</p>
            )}
          </div>
        </section>
      ) : (
        <LuxuryHeroSection
          badge={heroBadge}
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDesc}
          highlights={heroHighlights.length > 0 ? heroHighlights : undefined}
          primaryCta={{
            text: t('destinations.exploreTours', 'Explore Tours & Packages ←'),
            link: '#tours-grid'
          }}
          secondaryCta={{
            text: t('home.tailorTour', 'Tailor Your Tour'),
            link: '/tailor-tour'
          }}
          bgImage={heroImage}
          zoomDuration={12}
        />
      )}

      {/* Brief Overview Section */}
      {effectiveLandingPage.brief && !effectiveLandingPage.heroVideoUrl && (
        <section className="container mx-auto px-6 mt-16" id="overview">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-body-lg text-obsidian-600 dark:text-ivory-200 leading-relaxed">
              {effectiveLandingPage.brief}
            </p>
          </div>
        </section>
      )}

      {/* Curated Destination Tours Section */}
      <section className="container mx-auto px-6 mt-12" id="tours-grid">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-gold-500/15 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              {t('destinations.experiences', 'Curated Journeys')}
            </p>
            <h2 className="mt-1 text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('destinations.tours', 'Featured Experiences')}
            </h2>
          </div>
          <span className="rounded-full bg-gold-500/15 px-3.5 py-1 text-xs font-bold text-gold-700 dark:text-gold-400 border border-gold-500/30">
            {sortedTours.length} {sortedTours.length === 1 ? t('tours.tourSingular', 'Tour') : t('tours.tourPlural', 'Tours')}
          </span>
        </div>

        {/* Filter & Sort by Duration */}
        {sortedTours.length > 0 && (
          <DurationSortFilter
            tours={sortedTours}
            onFilterChange={setDisplayTours}
            className="mb-8"
          />
        )}

        {(displayTours.length > 0 ? displayTours : sortedTours).length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {(displayTours.length > 0 ? displayTours : sortedTours).map((tour) => (
              <TourCard
                key={tour.id}
                tour={{
                  ...tour,
                  price: Number(tour.basePriceUsd),
                  images: Array.isArray(tour.images) ? tour.images : (tour.heroImage ? [tour.heroImage] : []),
                  heroImage: tour.heroImage || (Array.isArray(tour.images) && tour.images.length > 0 ? (typeof tour.images[0] === 'string' ? tour.images[0] : tour.images[0]?.imageUrl) : null),
                  destination: tour.country,
                  badge: tour.customBadge,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-gold-500/20 bg-white/80 dark:bg-[#1a1a30]/80 backdrop-blur-xl p-10 md:p-14 text-center text-obsidian-700 dark:text-ivory-300 shadow-xl max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto mb-6 text-gold-500 text-3xl">
              🕊️
            </div>
            <h3 className="text-2xl font-serif font-bold text-obsidian-900 dark:text-ivory-50 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('destinations.toursComingSoonTitle', 'برامج ورحلات هذه الوجهة ستضاف قريباً جداً')}
            </h3>
            <p className="text-body-md text-obsidian-600 dark:text-ivory-300 leading-relaxed mb-8 max-w-xl mx-auto">
              {t('destinations.toursComingSoonDesc', 'يقوم فريقنا حالياً بتنسيق وإعداد أفخم الرحلات والبرامج السياحية لهذه الوجهة. يمكنك التواصل معنا الآن لتصميم رحلة مخصصة لك بالكامل!')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tailor-a-tour">
                <Button variant="gold-glow" className="px-8 py-3 font-bold">
                  {t('home.tailorTour', 'صمّم رحلتك المخصصة')} →
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="glass" className="px-8 py-3 font-semibold">
                  {t('nav.contact', 'تواصل معنا')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Jordan Accommodation Schedule (5 Cities Breakdown) */}
      {isJordan && hotelCities.length > 0 && (
        <section className="container mx-auto px-6 mt-24">
          <div className="text-center mb-12">
            <h2
              className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.hotelsTitle', 'Accommodation Schedule & Luxury Hotels')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(245,166,35,0.6)]" />
            <p className="text-body-md text-obsidian-600 dark:text-ivory-200 mt-4 max-w-2xl mx-auto font-medium">
              {t(
                'dest.jordan.hotelsDesc',
                'Based on availability, accommodation in one of the following hotels in each destination.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {hotelCities.map((city) => {
              const keyName = `hotelList${city.charAt(0).toUpperCase()}${city.slice(1)}`;
              return (
                <div
                  key={city}
                  className="group bg-white dark:bg-[#0f172a]/95 rounded-2xl shadow-card dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-gold-500/20 dark:border-gold-500/40 hover:border-gold-500 dark:hover:border-gold-400 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-obsidian-950 via-[#162550] to-obsidian-950 dark:from-[#0b132b] dark:via-[#162758] dark:to-[#0b132b] px-5 py-4 flex items-center gap-3 border-b border-gold-500/25">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 dark:text-gold-300 shrink-0 shadow-inner">
                      <FaHotel className="text-xs" />
                    </div>
                    <h3 className="text-gold-400 dark:text-gold-300 font-bold text-xs md:text-sm uppercase tracking-widest">
                      {t(`dest.jordan.hotelCities.${city}`, city)}
                    </h3>
                  </div>
                  <div className="p-5 bg-white dark:bg-transparent">
                    <p className="text-body-sm text-obsidian-700 dark:text-ivory-100 leading-relaxed font-medium whitespace-pre-line group-hover:dark:text-white transition-colors">
                      {t(`dest.jordan.${keyName}`, '')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Jordan Inclusions / Exclusions Matrix */}
      {isJordan && (safeIncludes.length > 0 || safeExcludes.length > 0) && (
        <section className="container mx-auto px-6 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Included */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#06201b]/95 dark:to-[#0d3b31]/90 rounded-2xl p-8 border border-emerald-500/30 dark:border-emerald-500/50 shadow-xl dark:shadow-[0_10px_35px_rgba(16,185,129,0.15)] hover:border-emerald-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FaCheck className="text-base" />
                </div>
                <h3
                  className="text-display-md text-2xl text-emerald-950 dark:text-emerald-300 font-display font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('tourDetail.included', 'What is Included')}
                </h3>
              </div>
              <ul className="flex flex-col gap-3.5">
                {safeIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-body-md text-obsidian-800 dark:text-emerald-50 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheck className="text-[10px]" />
                    </div>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              {t('dest.jordan.mandatoryFees', '') && (
                <p className="text-caption text-obsidian-600 dark:text-emerald-200/80 mt-6 italic border-t border-emerald-500/20 pt-3.5 font-medium">
                  {t('dest.jordan.mandatoryFees', '')}
                </p>
              )}
            </div>

            {/* Excluded */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#270b15]/95 dark:to-[#421427]/90 rounded-2xl p-8 border border-rose-500/30 dark:border-rose-500/50 shadow-xl dark:shadow-[0_10px_35px_rgba(244,63,94,0.15)] hover:border-rose-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-500/20">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shrink-0">
                  <FaTimes className="text-base" />
                </div>
                <h3
                  className="text-display-md text-2xl text-rose-950 dark:text-rose-300 font-display font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('tourDetail.excluded', 'What is Excluded')}
                </h3>
              </div>
              <ul className="flex flex-col gap-3.5">
                {safeExcludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-body-md text-obsidian-800 dark:text-rose-50 font-medium">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FaTimes className="text-[10px]" />
                    </div>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Jordan Children Policy */}
      {isJordan && (
        <section className="container mx-auto px-6 mt-20">
          <div className="bg-white dark:bg-[#0f172a]/95 rounded-2xl p-8 border border-gold-500/25 dark:border-gold-500/40 max-w-5xl mx-auto shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <h3
              className="text-display-md text-2xl text-obsidian-900 dark:text-ivory-50 mb-6 font-display text-center font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.childrenTitle', 'Children Policy')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['children_0to2', 'children_3to10', 'children_11plus'].map((key) => {
                const text = t(`dest.jordan.${key}`, '');
                if (!text) return null;
                return (
                  <div key={key} className="bg-obsidian-50 dark:bg-gradient-to-r dark:from-[#131e3d] dark:to-[#1a2852] p-5 rounded-xl border border-gold-500/20 dark:border-gold-500/35 flex items-start gap-3.5 shadow-sm hover:border-gold-400 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0">
                      <FaInfoCircle className="text-sm" />
                    </div>
                    <span className="text-body-sm text-obsidian-800 dark:text-ivory-100 font-medium leading-relaxed">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Sections from API */}
      {sections.length > 0 && (
        <section className="container mx-auto px-6 mt-16">
          <div className="mx-auto grid max-w-5xl gap-4">
            {sections.map((section, index) => (
              <div
                key={`${index}-${section.slice(0, 20)}`}
                className="rounded-2xl border border-gold-500/20 dark:border-gold-500/35 bg-white dark:bg-[#0f172a]/90 backdrop-blur-md p-6 md:p-8 text-obsidian-800 dark:text-ivory-100 shadow-md dark:shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
              >
                <p className="leading-relaxed font-medium">{section}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tailor-Made VIP Consultation CTA Section */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-obsidian-950/85 backdrop-blur-xs" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-400 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t(`dest.${slug}.ctaLabel`, t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?"))}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t(`dest.${slug}.ctaTitle`, t('dest.egypt.ctaTitle', `Let us design your perfect ${heroTitle} journey`))}
          </h2>
          <p
            className="text-body-lg text-ivory-50 mb-10 font-semibold leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
          >
            {t(
              `dest.${slug}.ctaDesc`,
              t('dest.egypt.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4 font-bold text-base">
                {t('home.tailorTour', 'Tailor Your Tour')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4 font-bold text-base text-ivory-50">
                {t('nav.contact', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
