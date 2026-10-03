import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaChevronRight
} from 'react-icons/fa';
import { services } from '../../data/services';
import { useCurrency } from '../../context/CurrencyContext';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import DurationSortFilter from '../../components/common/DurationSortFilter';



export default function ReligiousTours() {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [displayTours, setDisplayTours] = React.useState([]);

  const religiousPrograms = services.filter((s) => s.category === 'religious');
  const adaptedTours = React.useMemo(() => {
    return religiousPrograms.map((tour) => ({
      id: tour.id,
      slug: tour.slug,
      title: tour.title,
      overview: tour.shortDesc || tour.description || '',
      destination: tour.location,
      duration: tour.itinerary ? `${tour.itinerary.length} Days` : '',
      price: tour.price,
      rating: tour.rating || 5.0,
      minPax: '2+',
      badge: 'Religious',
      heroImage: tour.images && tour.images[0] ? tour.images[0] : null,
      images: tour.images || [],
    }));
  }, [religiousPrograms]);

  const toursToRender = displayTours.length > 0 ? displayTours : adaptedTours;

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${t('nav.religious', 'Religious Programs')} | ${t('site.luxuryTravel', 'Dunas Travel')}`}</title>
        <meta
          name="description"
          content={t(
            'programs.religiousMetaDesc',
            'Embark on a sacred journey through ancient Coptic monasteries in Egypt and the holy sites of Jordan. Deeply spiritual, meticulously organized pilgrimages with expert guides.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('programs.religiousBadge', '🌐 رحلات الإيمان والتراكم الحضاري الروحي')}
        title={t('programs.religiousHeadline', 'الرحلات الدينية والروحانية.. رحلة الروح والسكينة')}
        subtitle={t('programs.religiousSubtitle', 'Religious & Cultural Tours: One Sacred Journey')}
        description={t(
          'programs.religiousLead',
          'سِر على خطى العائلة المقدسة وزُر الأديرة القبطية القديمة في مصر ومساجد وأضرحة آل البيت والأراضي المقدسة برعاية كاملة وتنظيم سياحي فاخر بمرشدين متمرسين.'
        )}
        highlights={[
          t('programs.religiousTag1', '🕊️ جولات الأديرة والمواقع القبطية بمصر'),
          t('programs.religiousTag2', '📜 إرشاد تاريخي وروحي متمرس'),
          t('programs.religiousTag3', '✈️ إقامات 5 نجوم وتنقلات مريحة مجهزة بالكامل')
        ]}
        primaryCta={{
          text: t('programs.religiousPrimaryCta', 'تصفّح البرامج الدينية ←'),
          link: '#religious-list'
        }}
        secondaryCta={{
          text: t('programs.religiousSecondaryCta', 'طلب برنامج ديني خاص'),
          link: '/tailor-tour'
        }}
        bgImage="https://images.akhbarelyom.com/UP/20240601193248245.jpg"
      />

      {/* Breadcrumb Bar */}
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
          <span className="text-gold-500 font-medium">{t('nav.religious', 'Religious Programs')}</span>
        </div>
      </div>

      {/* Value Proposition Cards */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-ivory-50 rounded-xl border border-gold-500/10 shadow-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: '✝️',
                title: t('programs.relVal1Title', 'Coptic Heritage'),
                desc: t(
                  'programs.relVal1Desc',
                  "Trace ancient routes of the Holy Family through Egypt's sacred monasteries"
                )
              },
              {
                icon: '🕊️',
                title: t('programs.relVal2Title', 'Spiritual Immersion'),
                desc: t(
                  'programs.relVal2Desc',
                  'Deeply meaningful visits with expert theologian guides who bring history to life'
                )
              },
              {
                icon: '🙏',
                title: t('programs.relVal3Title', 'Complete Care'),
                desc: t(
                  'programs.relVal3Desc',
                  'All logistics handled — visas, hotels, transfers and full pilgrimage support included'
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="text-display-sm text-obsidian-900 font-semibold">{item.title}</h3>
                <p className="text-body-sm text-obsidian-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Religious Programs Grid */}
      <section className="container mx-auto px-6 pb-16">
        {adaptedTours.length > 0 ? (
          <>
            <DurationSortFilter
              tours={adaptedTours}
              onFilterChange={setDisplayTours}
              className="mb-8"
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {toursToRender.map((adaptedTour) => (
                <motion.div key={adaptedTour.id} variants={fadeInUp}>
                  <TourCard
                    tour={adaptedTour}
                    linkBase="/services/religious"
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20 bg-ivory-50 rounded-xl border border-gold-500/10 p-8 shadow-card">
            <FaSearch size={48} className="text-gold-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-display-md text-2xl text-obsidian-900 font-display mb-2">
              {t('programs.noReligiousFound', 'No Religious Programs Found')}
            </h3>
            <p className="text-body-md text-obsidian-500 max-w-md mx-auto mb-6">
              {t(
                'programs.noReligiousDesc',
                'We are currently updating our religious programs catalog. Please contact us for a tailor-made pilgrimage itinerary.'
              )}
            </p>
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow">
                {t('nav.tailorMade', 'Request Custom Tour')}
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-obsidian-900 text-ivory-50 py-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://thf.bing.com/th/id/R.e047649d8bd183efbdd320d17de8a8b1?rik=d18ZW0xT%2fK31lQ&pid=ImgRaw&r=0')"
          }}
        />
        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-caption font-semibold block mb-4">
            {t('programs.religiousCTALabel', 'Bespoke Sacred Journeys')}
          </span>
          <h2
            className="text-display-lg text-4xl font-display mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('programs.religiousCTATitle', 'Need a custom pilgrimage itinerary?')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10 leading-relaxed">
            {t(
              'programs.religiousCTADesc',
              'Our spiritual travel specialists will craft a personalized pilgrimage itinerary just for you — combining sacred sites across Egypt, Jordan, and the Holy Land with premium accommodation and expert theological guides.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-8 py-4">
                {t('nav.tailorMade', 'Design Your Pilgrimage')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline-gold" className="w-full sm:w-auto px-8 py-4">
                {t('nav.contact', 'Contact Our Team')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
