import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import tours from '../../data/tours.js';
import { useTours } from '../../hooks/useTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

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

export default function Egipto() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('all');
  const { tours: liveTours = [] } = useTours({ destination: 'egypt', limit: 50 });

  // Define the 9 standalone base classic tours for Egypt top section
  const BASE_CLASSIC_SLUGS = [
    'cairo-express-4d',
    'cairo-express-alexandria-5d',
    'egito-classico-8d',
    'egito-classico-ii-9d',
    'egito-historico-10d',
    'cairo-cruzeiro-sharm-11d',
    'grande-ramses-10d',
    'tesouros-egipto-9d',
    'complete-egypt-8d'
  ];

  const baseClassic9Tours = useMemo(() => {
    const tourList = Array.isArray(liveTours) && liveTours.length > 0 ? liveTours : tours;
    const foundMap = new Map();
    tourList.forEach((t) => {
      if (t && t.slug) {
        foundMap.set(t.slug, t);
      }
    });

    return BASE_CLASSIC_SLUGS.map((slug) => {
      if (foundMap.has(slug)) {
        return foundMap.get(slug);
      }
      // Fallback matching in local tours array
      const local = tours.find((lt) => lt.slug === slug);
      if (local) return local;
      return null;
    }).filter(Boolean);
  }, [liveTours]);

  return (
    <div className="w-full min-h-screen bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{t('dest.egypt.seoTitle', 'Luxury Egypt Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'dest.egypt.seoDesc',
            'Discover Egypt in grand style. From the majestic Pyramids of Giza to the temples of Luxor and the Red Sea coast, embark on an unforgettable luxury journey.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.egypt.badge', '🏛️ أسرار 7000 عام من الحضارة')}
        title={t('dest.egypt.headline', 'مصر.. حيث يلتقي التاريخ الخالد برغد الرفاهية')}
        subtitle={t('dest.egypt.subtitle', 'Egypt: Where Eternal History Meets Pure Luxury')}
        description={t(
          'dest.egypt.desc',
          'انطلق في رحلة أسطورية عبر الزمن؛ استمتع بزيارة أهرامات الجيزة الخالدة، وواجهات معابد الأقصر وأسوان الملكية، وابحر في نيل مصر على متن أفخم الفنادق العائمة مع استرخاء ساحر على شواطئ البحر الأحمر.'
        )}
        highlights={[
          t('dest.egypt.tag1', '🚢 رحلات نيلية 5 نجوم ديلوكس'),
          t('dest.egypt.tag2', '👑 إرشاد سياحي خاص باللغات العالمية'),
          t('dest.egypt.tag3', '🐫 تجارب سفاري وحصريات الصحراء')
        ]}
        primaryCta={{
          text: t('dest.egypt.ctaPrimary', 'استكشف برامج مصر الفاخرة ←'),
          link: '#tours-grid'
        }}
        secondaryCta={{
          text: t('dest.egypt.ctaSecondary', 'صمّم رحلتك الخاصة'),
          link: '/tailor-tour'
        }}
        bgImage="/imgs/egyothero.webp"
        zoomDuration={12}
      />

      {/* Top Section: 9 Essential Standalone Trips (الرحلات الأساسية الـ 9) */}
      <section className="container mx-auto px-6 mt-16" id="tours-grid">


        {/* 9 Base Standalone Tours Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {baseClassic9Tours.map((tour) => (
            <TourCard key={tour.id || tour.slug} tour={tour} />
          ))}
        </motion.div>
      </section>

      {/* Bottom Section: 5 Master Programs (برامج مصر الـ 5) */}
      <section className="container mx-auto px-6 mt-24" id="egypt-programs">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4 font-bold"
          >
            {t('dest.egypt.programsSubtitle', 'Egypt Signature Programs')}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-4 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.programsTitle', 'برامج مصر الرئيسية (5 برامج فريدة)')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-obsidian-600 dark:text-ivory-300 max-w-2xl mx-auto"
          >
            {t(
              'dest.egypt.programsDesc',
              'تصفح برامجنا المخصصة والتي تشمل البرنامج الكلاسيكي، شهر العسل، مسار العائلة المقدسة، الجولات متعددة الدول (9 رحلات)، والملحقات الاستجمامية.'
            )}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Card 1: Classic Program (برنامج مصر الكلاسيكي) */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#151728] rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gold-500/30 dark:border-obsidian-800 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/classic/classic-program" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/w_600,h_450,c_fill,q_60,f_webp/v1783029636/Classic_Program_gfal0s.jpg"
                alt="Classic Program"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />

            </Link>
            <div className="p-6 flex flex-col flex-grow">

              <Link to="/programs/classic/classic-program">
                <h3
                  className="text-display-md text-gold-600 dark:text-gold-400 font-bold mt-1 mb-3 hover:text-gold-500 transition-colors line-clamp-2 font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('classic.title', 'برنامج مصر الكلاسيكي')}
                </h3>
              </Link>
              <p className="text-body-sm text-gold-600 dark:text-gold-300 font-bold line-clamp-3 mb-4 flex-grow leading-relaxed">
                {t(
                  'classic.shortDesc',
                  'تجربة كلاسيكية متكاملة تغطي القاهرة، الأهرامات، والأقصر وأسوان عبر أفخم الفنادق العائمة.'
                )}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gold-500/20 mt-auto">
                <span className="text-xs font-extrabold text-gold-600 dark:text-gold-400">8 {t('common.days', 'Days')}</span>
                <Link to="/programs/classic/classic-program">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Honeymooners Program (شهر العسل في مصر) */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#151728] rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gold-500/30 dark:border-obsidian-800 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/honeymooners" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
                alt="Honeymoon in Egypt"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />

            </Link>
            <div className="p-6 flex flex-col flex-grow">

              <Link to="/programs/honeymooners">
                <h3
                  className="text-display-md text-gold-600 dark:text-gold-400 font-bold mt-1 mb-3 hover:text-gold-500 transition-colors line-clamp-2 font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('honeymooners.egyptTitle', 'شهر العسل في مصر')}
                </h3>
              </Link>
              <p className="text-body-sm text-gold-600 dark:text-gold-300 font-bold line-clamp-3 mb-4 flex-grow leading-relaxed">
                {t(
                  'dest.egypt.honeymoonersDesc',
                  'احتفل بحبك مع عشاء رومانسي على ضفاف النيل، وجولات يخوت خاصة، وإقامات فاخرة غير مسبوقة.'
                )}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gold-500/20 mt-auto">
                <span className="text-xs font-extrabold text-gold-600 dark:text-gold-400">10 {t('common.days', 'Days')}</span>
                <Link to="/programs/honeymooners">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Religious / Holy Family Program (رحلة العائلة المقدسة) */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#151728] rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gold-500/30 dark:border-obsidian-800 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/religious" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://sft-nationaltours.com/wp-content/uploads/2024/11/holy-family-egypt_tg_1397-870x555.jpg"
                alt="Holy Family Journey"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />

            </Link>
            <div className="p-6 flex flex-col flex-grow">

              <Link to="/programs/religious">
                <h3
                  className="text-display-md text-gold-600 dark:text-gold-400 font-bold mt-1 mb-3 hover:text-gold-500 transition-colors line-clamp-2 font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('tour_jordan_title', 'رحلة العائلة المقدسة (مسار العائلة المقدسة في مصر)')}
                </h3>
              </Link>
              <p className="text-body-sm text-gold-600 dark:text-gold-300 font-bold line-clamp-3 mb-4 flex-grow leading-relaxed">
                {t(
                  'dest.egypt.religiousDesc',
                  'رحلة روحانية عميقة تتبع خطى العائلة المقدسة عبر أديرة وكنائس مصر القديمة والآثار الروحانية.'
                )}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Link to="/programs/religious" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2.5 py-1 rounded-md font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  {t('programs.holyFamily10d', 'مسار العائلة المقدسة في مصر (10D)')}
                </Link>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gold-500/20 mt-auto">
                <span className="text-xs font-extrabold text-gold-600 dark:text-gold-400">10 {t('common.days', 'Days')}</span>
                <Link to="/programs/religious">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Multi-Country Tours Program (جولات متعددة الدول - 9 رحلات) */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#151728] rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gold-500/30 dark:border-obsidian-800 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/multi-country" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030113/Gemini_Generated_Image_cb2enncb2enncb2e_wvyejn.jpg"
                alt="Multi-Country Tours"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />

            </Link>
            <div className="p-6 flex flex-col flex-grow">

              <Link to="/programs/multi-country">
                <h3
                  className="text-display-md text-gold-600 dark:text-gold-400 font-bold mt-1 mb-3 hover:text-gold-500 transition-colors line-clamp-2 font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('nav.multiCountry', 'جولات متعددة الدول (9 رحلات دولية)')}
                </h3>
              </Link>
              <p className="text-body-sm text-gold-600 dark:text-gold-300 font-bold line-clamp-3 mb-4 flex-grow leading-relaxed">
                {t(
                  'dest.egypt.multiCountryDesc',
                  'برامج مجمعة تشمل مصر مع الأردن، المغرب، تونس، دبي، تركيا، واليونان بـ 9 رحلات دولية فريدة.'
                )}
              </p>

              {/* Multi-country 9 destination trips preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Link to="/tours/jewels-of-egypt-and-jordan-11-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  1. جواهر مصر والأردن (11D)
                </Link>
                <Link to="/tours/spices-of-egypt-and-morocco" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  2. توابل ونكهات مصر والمغرب (12D)
                </Link>
                <Link to="/tours/egypt-and-dubai-13-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  3. مصر ودبي (13D)
                </Link>
                <Link to="/tours/treasures-of-egypt-and-tunisia-16-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  4. كنوز مصر وتونس (16D)
                </Link>
                <Link to="/tours/stars-of-the-middle-east-16-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  5. نجوم الشرق الأوسط (16D)
                </Link>
                <Link to="/tours/marvels-of-dubai-and-turkey-14-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  6. روائع دبي وتركيا (14D)
                </Link>
                <Link to="/tours/cairo-and-athens-11-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  7. القاهرة وأثينا (11D)
                </Link>
                <Link to="/tours/essences-of-egypt-and-turkey-15-days" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  8. جواهر مصر وتركيا (15D)
                </Link>
                <Link to="/tours/estrellas-medio-oriente-19d" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  9. نجوم الشرق الأوسط الكبرى (19D)
                </Link>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gold-500/20 mt-auto">
                <span className="text-xs font-extrabold text-gold-600 dark:text-gold-400">9 {t('programs.journeysCount', 'رحلات دولية')}</span>
                <Link to="/programs/multi-country">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'عرض الـ 9 رحلات')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Egypt Extensions (رحلات الاستجمام والملحقات) */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-[#151728] rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gold-500/30 dark:border-obsidian-800 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/extension" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
                alt="Egypt Extensions"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />

            </Link>
            <div className="p-6 flex flex-col flex-grow">

              <Link to="/programs/extension">
                <h3
                  className="text-display-md text-gold-600 dark:text-gold-400 font-bold mt-1 mb-3 hover:text-gold-500 transition-colors line-clamp-2 font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('dest.egypt.extensionTitle', 'رحلات الاستجمام والملحقات')}
                </h3>
              </Link>
              <p className="text-body-sm text-gold-600 dark:text-gold-300 font-bold line-clamp-3 mb-4 flex-grow leading-relaxed">
                {t(
                  'dest.egypt.extensionDesc',
                  'مدد إقامتك في مصر مع رحلات شاطئية وصحراوية تشمل الغردقة، شرم الشيخ، أو واحة سيوة والإسكندرية.'
                )}
              </p>
              
              {/* Trip Tags Preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Link to="/tours/hurghada-4d3n" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2.5 py-1 rounded-md font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  {t('trip.hurghada.title', 'الغردقة')} (4D)
                </Link>
                <Link to="/tours/sharm-4d3n" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2.5 py-1 rounded-md font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  {t('trip.sharm.title', 'شرم الشيخ')} (4D)
                </Link>
                <Link to="/tours/siwa-oasis-alexandria" className="text-[11px] bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-300 px-2.5 py-1 rounded-md font-bold border border-gold-400 dark:border-gold-600 hover:bg-gold-500 hover:text-obsidian-950 transition-colors">
                  {t('tour_siwa_title', 'واحة سيوة والإسكندرية')} (5D)
                </Link>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gold-500/20 mt-auto">
                <span className="text-xs font-extrabold text-gold-600 dark:text-gold-400">4-5 {t('common.days', 'Days')}</span>
                <Link to="/programs/extension">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tailor-Made CTA Section */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/imgs/egyothero.webp)' }}
        />
        <div className="absolute inset-0 bg-obsidian-900/80" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.ctaTitle', 'Let us design your perfect Egypt tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'dest.egypt.ctaDesc',
              'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4">
                {t('home.tailorTour', 'Tailor Your Tour')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4">
                {t('nav.contact', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
