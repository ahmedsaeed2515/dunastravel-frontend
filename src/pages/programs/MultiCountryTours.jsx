import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import DurationSortFilter from '../../components/common/DurationSortFilter';

export default function MultiCountryTours() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { tours: liveTours } = useTours({ destination: 'multi-country', limit: 70 });
  const [filteredTours, setFilteredTours] = React.useState([]);
  const displayTours = liveTours || [];
  const toursToRender = filteredTours.length > 0 ? filteredTours : displayTours;

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${t('programs.multiCountryTitle', lang === 'ar' ? 'جولات متعددة الدول' : 'Multi-Country Tours')} | Dunas Travel`}</title>
        <meta name="description" content={t('programs.multiCountryDesc', lang === 'ar' ? 'استكشف جولاتنا عبر بلدان متعددة' : 'Explore our multi-country tours')} />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('programs.multiCountryBadge', lang === 'ar' ? '🌐 رحلات كبرى عبر بلدان متعددة' : '🌐 Grand Multi-Country Expeditions')}
        title={t('programs.multiCountryTitle', lang === 'ar' ? 'جولات متعددة الدول' : 'Multi-Country Tours')}
        subtitle={t('programs.multiCountrySubtitle', lang === 'ar' ? 'رحلات ملحمية عبر الحدود' : 'Epic Cross-Border Odysseys')}
        description={t(
          'programs.multiCountryHeroDesc',
          lang === 'ar'
            ? 'باقات سياحية متكاملة تربط بين سحر الحضارة الفرعونية في مصر، وغموض البتراء في الأردن، وفخامة دبي الحديثة، وعراقة إسطنبول وسحر جزر اليونان.'
            : 'Comprehensive itineraries connecting Egypt pharaonic wonders, Jordan Petra, Dubai modern luxury, Istanbul heritage, and Greece islands.'
        )}
        highlights={[
          t('programs.multiTag1', lang === 'ar' ? '✈️ طيران وتنقلات VIP مدمجة بالكامل' : '✈️ Fully Integrated VIP Flights & Transfers'),
          t('programs.multiTag2', lang === 'ar' ? '🗺️ باقات (مصر + الأردن / تركيا + دبي)' : '🗺️ Packages (Egypt + Jordan / Turkey + Dubai)'),
          t('programs.multiTag3', lang === 'ar' ? '📜 إدارة شاملة للتأشيرات والخدمات' : '📜 Comprehensive Visa & Logistics Management')
        ]}
        primaryCta={{
          text: t('programs.multiPrimaryCta', lang === 'ar' ? 'استكشف الرحلات المجمعة ←' : 'Explore Multi-Country Packages ←'),
          link: '#multi-tours-list'
        }}
        secondaryCta={{
          text: t('programs.multiSecondaryCta', lang === 'ar' ? 'طلب برنامج مخصص' : 'Request Custom Itinerary'),
          link: '/tailor-tour'
        }}
        bgImage="https://res.cloudinary.com/degbrq3ck/image/upload/v1789341982/62de536e-2674-4518-b31c-ce74f137c119_jxxocg.jpg"
      />

      {/* Breadcrumb Header */}
      <div className="bg-obsidian-950 border-y border-gold-500/10 py-4 px-6 text-caption text-ivory-300">
        <div className="container mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500 transition-colors">
            {t('nav.home', 'Home')}
          </Link>
          <span className="rtl-flip text-[10px] text-gold-500/50">
            <FaChevronRight />
          </span>
          <Link to="/destinations/egypt" className="hover:text-gold-500 transition-colors">
            {t('dest.egypt.title', 'Egypt')}
          </Link>
          <span className="rtl-flip text-[10px] text-gold-500/50">
            <FaChevronRight />
          </span>
          <span className="text-gold-500 font-medium">{t('nav.multiCountry', lang === 'ar' ? 'جولات متعددة الدول' : 'Multi-Country Tours')}</span>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="relative min-h-screen bg-obsidian-50 pt-16 pb-20" id="multi-tours-list">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-display-lg text-obsidian-900 font-display font-bold mb-4">
              {t('programs.multiCountryHeading', lang === 'ar' ? 'رحلات متعددة البلدان.. اكتشف أروع وجهات الشرق الأوسط والمتوسط' : 'Multi-Country Tours: Discover the Middle East & Mediterranean')}
            </h2>
            <p className="text-body-lg text-obsidian-600 max-w-2xl mx-auto">
              {t('programs.multiCountrySubheading', lang === 'ar' ? 'اختر وجهتك المفضلة التي تجمع أكثر من بلد ببرنامج سياحي واحد مريح وشامل.' : 'Choose your favorite destination combining multiple countries into one comfortable, all-inclusive itinerary.')}
            </p>
          </div>

          {displayTours.length > 0 && (
            <DurationSortFilter
              tours={displayTours}
              onFilterChange={setFilteredTours}
              className="mb-8"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toursToRender.map((tour) => (
              <TourCard key={tour.id} tour={tour} linkBase="/programs/multi-country" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
