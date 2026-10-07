import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCompass } from 'react-icons/fa';
import TourCard from './TourCard';
import { useTours } from '../../hooks/useTours';
import { useCurrency } from '../../context/CurrencyContext';
import {
  resolveTourTitle,
  resolveTourOverview,
  resolveTourDuration,
  resolveLocalizedText,
  resolveTourHeroImage
} from '../../utils/titleHelper';
import { getTourDestinationSlug } from '../../utils/destinationHelper';

function resolveTourImage(tour) {
  return resolveTourHeroImage(tour);
}

export default function SuggestedTours({ currentDestination = 'egypt', currentSlug = '' }) {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const lang = i18n.language || 'en';
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { tours } = useTours({ limit: 16 });

  const destLower = (currentDestination || 'egypt').toLowerCase();

  const allItems = [];

  if (Array.isArray(tours)) {
    tours.forEach((tour) => {
      if (!tour || !tour.slug) return;
      const image = resolveTourImage(tour);
      allItems.push({
        ...tour,
        id: tour.id || tour.slug,
        slug: tour.slug,
        destination: getTourDestinationSlug(tour),
        price: tour.price ?? (tour.basePriceUsd != null ? Number(tour.basePriceUsd) : 0),
        rating: tour.rating || 4.9,
        image,
        link: `/tours/${tour.slug}`
      });
    });
  }

  // Filter out current active tour
  const availableItems = allItems.filter(
    (item) => item.slug !== currentSlug && item.id !== currentSlug
  );

  // Match destination items
  let matchingItems = availableItems.filter((item) => {
    const itemDest = (item.destination || '').toLowerCase();
    return (
      itemDest.includes(destLower) ||
      destLower.includes(itemDest) ||
      (destLower === 'egypt' && (itemDest.includes('cairo') || itemDest.includes('luxor') || itemDest.includes('nile') || itemDest.includes('hurghada') || itemDest.includes('sharm') || itemDest.includes('siwa'))) ||
      (destLower === 'jordan' && (itemDest.includes('amman') || itemDest.includes('petra') || itemDest.includes('jordan'))) ||
      (destLower === 'turkey' && (itemDest.includes('istanbul') || itemDest.includes('cappadocia') || itemDest.includes('turquia') || itemDest.includes('turkey'))) ||
      (destLower === 'dubai' && (itemDest.includes('dubai') || itemDest.includes('uae')))
    );
  });

  if (matchingItems.length < 4) {
    const otherItems = availableItems.filter((item) => !matchingItems.includes(item));
    matchingItems = [...matchingItems, ...otherItems];
  }

  const suggestedTours = Array.from(new Set(matchingItems.map((i) => i.slug)))
    .map((slug) => matchingItems.find((i) => i.slug === slug))
    .slice(0, 8);

  const isRtl = lang === 'ar';

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (Math.abs(scrollLeft) >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: isRtl ? -360 : 360, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, isRtl]);

  if (suggestedTours.length === 0) return null;

  return (
    <section className="w-full bg-obsidian-50 dark:bg-[#0c0d19] py-16 relative overflow-hidden border-t border-gold-500/10">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 dark:bg-gold-500/25 border border-amber-300/70 dark:border-gold-400/50 mb-3 shadow-sm">
              <FaCompass className="text-amber-800 dark:text-gold-300 text-xs" />
              <span className="text-amber-900 dark:text-gold-300 uppercase tracking-[3px] font-black text-xs">
                {t('suggested.badge', 'Handpicked Recommendations')}
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white dark:drop-shadow-[0_2px_15px_rgba(255,255,255,0.35)] font-display tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Cairo', serif" }}
            >
              {t('suggested.title', 'Suggested Experiences')}
            </h2>
            <p className="text-body-sm text-slate-700 dark:text-slate-100 font-semibold mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
              {t(
                'suggested.subtitle',
                'Discover tailored journeys and exclusive add-ons curated to complement your travel adventure.'
              )}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => scroll(isRtl ? 'right' : 'left')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a30] border border-obsidian-200 dark:border-gray-700 text-obsidian-900 dark:text-ivory-50 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all shadow-sm"
              aria-label="Previous"
            >
              <FaChevronLeft className="rtl-flip text-xs" />
            </button>
            <button
              onClick={() => scroll(isRtl ? 'left' : 'right')}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a30] border border-obsidian-200 dark:border-gray-700 text-obsidian-900 dark:text-ivory-50 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center transition-all shadow-sm"
              aria-label="Next"
            >
              <FaChevronRight className="rtl-flip text-xs" />
            </button>
          </div>
        </div>

        {/* Auto-scrolling Carousel Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-6 pt-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {suggestedTours.map((item) => (
            <div key={item.id} className="snap-start shrink-0 w-[310px] sm:w-[350px] flex flex-col">
              <TourCard tour={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
