import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDestinations } from '../../hooks/useDestinations';
import { useTours } from '../../hooks/useTours';
import TourCard from '../../components/tour/TourCard';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const Destinations = () => {
  const { t } = useTranslation();
  const { destinations, loading: destsLoading, refreshing: destsRefreshing, error } = useDestinations();
  const destinationsList = Array.isArray(destinations) ? destinations : [];

  // Only fetch the fallback tour catalog if /destinations finished loading and any destination is still missing embedded tours
  const needsFallbackTours = !destsLoading && destinationsList.some(
    (d) => (Number(d?.toursCount) > 0) && (!Array.isArray(d?.tours) || d.tours.length === 0)
  );
  const { tours: allTours, loading: toursLoading } = useTours(
    { limit: 48 },
    { enabled: needsFallbackTours }
  );
  const isFetchingTours = destsLoading || destsRefreshing || (needsFallbackTours && toursLoading);

  const mainHeroBgImage = destinationsList.find((d) => d?.heroImageUrl || d?.image)?.heroImageUrl 
    || destinationsList.find((d) => d?.heroImageUrl || d?.image)?.image
    || "https://res.cloudinary.com/degbrq3ck/image/upload/e_upscale,e_enhance,e_sharpen:120,f_auto,q_auto:best/v1783026771/5_upvijm.jpg";

  return <main className="min-h-screen bg-obsidian-50 pb-24">
    <Helmet>
      <title>{t('destinations.title', 'All Destinations | Luxury Travel')}</title>
      <meta name="description" content={t('destinations.metaDesc', 'Explore our handpicked luxury tours across our active destinations.')} />
    </Helmet>

    {/* Main Hero */}
    <LuxuryHeroSection
      badge={t('destinations.worldCurated', 'The World, Curated')}
      title={t('destinations.heading', 'Our Destinations')}
      bgImage={mainHeroBgImage}
      primaryCta={{
        text: t('destinations.exploreTours', 'Explore Tours & Packages ←'),
        link: '#tours-grid'
      }}
      secondaryCta={{
        text: t('home.tailorTour', 'Tailor Your Tour'),
        link: '/tailor-tour'
      }}
      zoomDuration={12}
    />

    {/* Destinations Iteration */}
    <section id="tours-grid" className="container mx-auto px-6 -mt-16 relative z-20">
      {error && destinationsList.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-800">
          {t('destinations.loadError', 'Destinations could not be loaded. Please try again later.')}
        </div>
      ) : destinationsList.length === 0 && !isFetchingTours ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-obsidian-200 bg-white p-8 text-center text-obsidian-600">
          {t('destinations.empty', 'No destinations are currently available.')}
        </div>
      ) : (
        <div className="flex flex-col gap-24">
          {destinationsList.map((destination, destIndex) => {
            const destSlug = String(destination?.slug || destination?.id || '').toLowerCase();
            const targetSlug = (destSlug === 'egipto' || destSlug === 'egito') ? 'egypt' : destSlug;

            const providedToursRaw = Array.isArray(destination?.tours) ? destination.tours : [];
            const providedTours = providedToursRaw.filter((tour) => {
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

            const matchedTours = (allTours || []).filter((tour) => {
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

            const LOCAL_DEST_IMAGES = {
              dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
              morocco: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1920&q=80',
              egypt: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
              egipto: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
              egito: 'https://res.cloudinary.com/nclvl0iu/image/upload/v1790131551/egyothero.webp',
              jordan: 'https://res.cloudinary.com/nclvl0iu/image/upload/w_800,h_533,c_fill,q_auto,f_auto/v1790354904/272930_compressed_f3rjnj_compressed.webp',
              turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80',
              greece: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80',
              tunisia: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=85',
              'holy-land': '/images/holy-land.webp',
              holyland: '/images/holy-land.webp',
            };

            const destTours = providedTours.length > 0 ? providedTours : matchedTours;
            const cardImage = destination.heroImageUrl 
              || destination.image 
              || LOCAL_DEST_IMAGES[targetSlug]
              || '/imgs/egyothero.webp';

            return (
              <motion.article 
                key={destination.id} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                {/* Destination Card / Header */}
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 shadow-card group">
                  <img 
                    src={cardImage} 
                    alt={destination.name} 
                    loading={destIndex === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                      if (cardImage !== '/imgs/egyothero.webp') {
                        e.currentTarget.src = LOCAL_DEST_IMAGES[targetSlug] || '/imgs/egyothero.webp';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <span className="text-gold-500 uppercase tracking-widest text-caption mb-2">
                      {destTours.length || destination.toursCount || 0} {t('destinations.tours', 'Tours')}
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <h2 className="text-display-xl text-ivory-50 m-0 leading-none">
                        {destination.name}
                      </h2>
                      <Link to={`/destinations/${destination.slug}`} className="text-ivory-300 hover:text-gold-500 transition-colors uppercase tracking-widest text-sm font-semibold flex items-center gap-2">
                        {t('destinations.viewGuide', 'View Destination Guide')}
                        <span className="rtl-flip">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Destination Brief */}
                <div className="mb-10 px-4 md:px-8">
                  <p className="text-obsidian-600 max-w-4xl text-body-lg">
                    {destination.brief || destination.description || t('destinations.descriptionPending', 'Explore our curated journeys for this destination.')}
                  </p>
                </div>

                {/* Tours Grid */}
                {destTours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destTours.map((tour) => (
                      <TourCard 
                        key={tour.id} 
                        tour={{
                          ...tour,
                          destination: tour.destination || tour.country || targetSlug || destination.slug || destination.name
                        }} 
                      />
                    ))}
                  </div>
                ) : isFetchingTours && (destination.toursCount > 0 || targetSlug !== 'holy-land') ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, skelIdx) => (
                      <div
                        key={`dest-tour-skel-${destination.id}-${skelIdx}`}
                        className="rounded-2xl overflow-hidden bg-white border border-obsidian-100 shadow-sm h-[430px] animate-pulse flex flex-col"
                      >
                        <div className="h-56 bg-obsidian-200/70 w-full" />
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="h-5 w-4/5 bg-obsidian-200 rounded" />
                            <div className="h-4 w-full bg-obsidian-100 rounded" />
                            <div className="h-4 w-2/3 bg-obsidian-100 rounded" />
                          </div>
                          <div className="pt-4 border-t border-obsidian-100 flex items-center justify-between">
                            <div className="h-5 w-24 bg-gold-500/30 rounded" />
                            <div className="h-9 w-28 bg-obsidian-200 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-ivory-50 rounded-2xl border border-obsidian-900/5 shadow-sm">
                    <p className="text-obsidian-500 text-body-md font-medium">
                      {t('destinations.toursComingSoon', 'Bespoke itineraries for {{destination}} are currently being curated by our concierges. Contact us to design a custom journey.', { destination: destination.name })}
                    </p>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  </main>;
};

export default Destinations;
