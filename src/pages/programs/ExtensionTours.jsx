import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import TourCard from '../../components/tour/TourCard';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

export const EXTENSION_PACKAGES = [
  {
    id: 'hurghada-4d3n',
    titleKey: 'trip.hurghada.title',
    titleDefault: 'Hurghada Red Sea Extension',
    durationKey: 'trip.hurghada.duration',
    durationDefault: '04 Days / 03 Nights',
    destinationsKey: 'trip.hurghada.title',
    destinationsDefault: 'Hurghada',
    img: 'https://1.bp.blogspot.com/-HqmKDzZ73hY/XgSOtrhSAOI/AAAAAAAARdc/cxtywSwZxLIaZPfw98FzQHYtiPblmzg2gCLcBGAsYHQ/w1200-h630-p-k-no-nu/%D8%A3%D9%81%D8%B6%D9%84-%D8%A7%D9%84%D8%A3%D9%86%D8%B4%D8%B7%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A%D8%A9-%D9%81%D9%89-%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9-825x510.jpg',
    descKey: 'trip.hurghada.day1.desc',
    descDefault: 'Transfer to Cairo Airport and board flight to Hurghada. Enjoy 3 nights all-inclusive resort stay.',
    price: 0
  },
  {
    id: 'sharm-4d3n',
    titleKey: 'trip.sharm.title',
    titleDefault: 'Sharm El Sheikh VIP Extension',
    durationKey: 'trip.sharm.duration',
    durationDefault: '04 Days / 03 Nights',
    destinationsKey: 'trip.sharm.title',
    destinationsDefault: 'Sharm El Sheikh',
    img: 'https://nileholiday.com/wp-content/uploads/2019/10/sharm-el-sheikh-top-attractions-1-1920x750.jpg',
    descKey: 'trip.sharm.day1.desc',
    descDefault: 'Transfer to Cairo Airport and board flight to Sharm El Sheikh. 3 nights all-inclusive stay & Sinai desert safari options.',
    price: 0
  },
  {
    id: 'siwa-oasis-alexandria',
    titleKey: 'tour_siwa_title',
    titleDefault: 'Siwa Oasis & Alexandria Expedition',
    durationKey: 'tour_siwa_duration',
    durationDefault: '05 Days / 04 Nights',
    destinationsKey: 'tour_siwa_destination',
    destinationsDefault: 'Siwa Oasis & Alexandria',
    img: '/imgs/services/service-317.webp',
    descKey: 'tour_siwa_summary',
    descDefault: 'Cairo → Wadi El Natroun → Marsa Matruh → Siwa → Alexandria → Cairo',
    price: 0
  }
];

export default function ExtensionTours() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('extensions.title', 'Egypt Extensions | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'extensions.desc',
            'Extend your Egypt holiday with added beach resorts in Hurghada, Sharm El Sheikh, or desert adventures in Siwa Oasis.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('extensions.badge', '🏖️ إضافات وامتدادات إقامة فاخرة')}
        title={t('extensions.heading', 'امتدادات الرحلات.. طوّل متعة الاسترخاء والاستكشاف')}
        subtitle={t('extensions.subtitle', 'Egypt Extensions: Beach Resorts & Oasis Escapes')}
        description={t(
          'extensions.heroDesc',
          'مدّد رحلتك السياحية بأيام إضافية من الاستجمام الشاطئي على منتجعات الغردقة وشرم الشيخ 5 نجوم، أو مغامرات واحة سيوة وسيناء التاريخية مع طيران وتنقلات سريعة.'
        )}
        highlights={[
          t('extensions.tag1', '🏖️ منتجعات الغردقة وشرم الشيخ الشاملة All-Inclusive'),
          t('extensions.tag2', '🌴 رحلات واحة سيوة والإسكندرية الاستكشافية'),
          t('extensions.tag3', '✈️ طيران داخلي مريح من وإلى القاهرة')
        ]}
        primaryCta={{
          text: t('extensions.ctaPrimary', 'تصفّح باقات التمديد ←'),
          link: '#extensions-list'
        }}
        secondaryCta={{
          text: t('extensions.ctaSecondary', 'إضافة أيام لرحلتك الحالية'),
          link: '/tailor-tour'
        }}
        bgImage="https://ar.scoopempire.com/wp-content/uploads/sites/4/2026/03/pexels-vika-glitter-392079-18895967-scaled-1.jpg"
      />

      {/* Breadcrumb Navigation */}
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
          <span className="text-gold-500 font-medium">
            {t('extensions.subtitle', 'Egypt Extensions')}
          </span>
        </div>
      </div>

      {/* Packages Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl text-obsidian-900 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('extensions.sectionTitle', 'Available Extension Packages')}
          </h2>
          <p className="text-body-md text-obsidian-500 max-w-xl mx-auto">
            {t(
              'extensions.sectionDesc',
              'Select an extension add-on to pair seamlessly with your Egypt itinerary.'
            )}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {EXTENSION_PACKAGES.map((pkg) => {
            const adaptedTour = {
              id: pkg.id,
              slug: pkg.id,
              title: t(pkg.titleKey, pkg.titleDefault),
              overview: t(pkg.descKey, pkg.descDefault),
              destination: t(pkg.destinationsKey, pkg.destinationsDefault),
              duration: t(pkg.durationKey, pkg.durationDefault),
              price: pkg.price || null,
              rating: 5.0,
              minPax: '2+',
              badge: t('extensions.addOnAvailable', 'Add-on'),
              heroImage: pkg.img,
              images: [pkg.img],
            };
            return (
              <motion.div key={pkg.id} variants={fadeInUp}>
                <TourCard
                  tour={adaptedTour}
                  linkBase="/programs/extension"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
