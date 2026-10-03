import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSortAmountDown, FaSortAmountUp, FaFilter, FaClock } from 'react-icons/fa';

export function extractTourDays(tour) {
  if (!tour) return 0;
  if (typeof tour.durationDays === 'number' && tour.durationDays > 0) return tour.durationDays;
  if (typeof tour.days === 'number' && tour.days > 0) return tour.days;
  
  if (Array.isArray(tour.itinerary) && tour.itinerary.length > 0) {
    return tour.itinerary.length;
  }

  const rawVal = tour.days || tour.duration || tour.durationKey || tour.durationJsonb;
  let str = '';
  if (typeof rawVal === 'string') {
    str = rawVal;
  } else if (typeof rawVal === 'number') {
    return rawVal;
  } else if (rawVal && typeof rawVal === 'object') {
    str = rawVal.en || rawVal.ar || rawVal.es || rawVal.pt || rawVal.it || Object.values(rawVal)[0] || '';
  }

  const match = str.toString().match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }

  return 0;
}

export default function DurationSortFilter({ tours = [], onFilterChange, className = '' }) {
  const { t, i18n } = useTranslation();
  const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'duration-asc' | 'duration-desc'
  const [rangeFilter, setRangeFilter] = useState('all'); // 'all' | 'short' (1-5) | 'medium' (6-9) | 'long' (10+)

  const isRtl = i18n.dir() === 'rtl' || i18n.language === 'ar';

  const filteredAndSortedTours = useMemo(() => {
    if (!Array.isArray(tours)) return [];
    
    // 1. Filter by duration range
    let result = tours.filter((tour) => {
      const days = extractTourDays(tour);
      if (rangeFilter === 'short') return days > 0 && days <= 5;
      if (rangeFilter === 'medium') return days >= 6 && days <= 9;
      if (rangeFilter === 'long') return days >= 10;
      return true;
    });

    // 2. Sort by duration
    result = [...result].sort((a, b) => {
      const daysA = extractTourDays(a);
      const daysB = extractTourDays(b);

      if (sortOrder === 'duration-asc') {
        return daysA - daysB;
      }
      if (sortOrder === 'duration-desc') {
        return daysB - daysA;
      }
      return 0; // Default order
    });

    return result;
  }, [tours, sortOrder, rangeFilter]);

  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(filteredAndSortedTours);
    }
  }, [filteredAndSortedTours, onFilterChange]);

  return (
    <div className={`populer-single-box style-classic group relative overflow-hidden bg-white dark:bg-[#061d5d] border border-primary-500/20 dark:border-gold-500/30 shadow-[0_4px_20px_rgba(12,28,72,0.08)] hover:shadow-[0_20px_45px_rgba(245,166,35,0.2)] hover:border-gold-500 transition-all duration-500 rounded-2xl p-4 sm:p-5 ${className}`}>
      {/* Dunas Corner Accent Ornament (.about-sp) */}
      <div className="about-sp pointer-events-none">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="75" cy="75" r="55" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
          <circle cx="75" cy="75" r="32" fill="#F5A623" opacity="0.2" />
          <path d="M55 75 L75 55 L95 75" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Side: Filter Range Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gold-300 uppercase tracking-wider shrink-0">
            <FaClock className="text-[#F5A623]" size={14} />
            <span>{t('filter.duration', 'مدة الرحلة:')}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setRangeFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full border transition-all duration-300 cursor-pointer ${
                rangeFilter === 'all'
                  ? 'bg-gold-500 text-obsidian-950 border-gold-400 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-[#041446] text-gray-700 dark:text-ivory-200 border-gray-200 dark:border-gold-500/25 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400'
              }`}
            >
              {t('filter.allDurations', 'الكل')}
            </button>

            <button
              type="button"
              onClick={() => setRangeFilter('short')}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full border transition-all duration-300 cursor-pointer ${
                rangeFilter === 'short'
                  ? 'bg-gold-500 text-obsidian-950 border-gold-400 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-[#041446] text-gray-700 dark:text-ivory-200 border-gray-200 dark:border-gold-500/25 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400'
              }`}
            >
              ⚡ {t('filter.shortDurations', '1 - 5 أيام')}
            </button>

            <button
              type="button"
              onClick={() => setRangeFilter('medium')}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full border transition-all duration-300 cursor-pointer ${
                rangeFilter === 'medium'
                  ? 'bg-gold-500 text-obsidian-950 border-gold-400 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-[#041446] text-gray-700 dark:text-ivory-200 border-gray-200 dark:border-gold-500/25 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400'
              }`}
            >
              🌟 {t('filter.mediumDurations', '6 - 9 أيام')}
            </button>

            <button
              type="button"
              onClick={() => setRangeFilter('long')}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full border transition-all duration-300 cursor-pointer ${
                rangeFilter === 'long'
                  ? 'bg-gold-500 text-obsidian-950 border-gold-400 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-[#041446] text-gray-700 dark:text-ivory-200 border-gray-200 dark:border-gold-500/25 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400'
              }`}
            >
              👑 {t('filter.longDurations', '+10 أيام')}
            </button>
          </div>
        </div>

        {/* Right Side: Sorting Dropdown & Counter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-200 dark:border-gold-500/20">
          <div className="rounded-full bg-gold-500/15 px-3.5 py-1 text-xs font-bold text-gold-700 dark:text-gold-400 border border-gold-500/30">
            <span className="font-black me-1">{filteredAndSortedTours.length}</span>
            <span>{t('filter.toursFound', 'رحلة')}</span>
          </div>

          <div className="relative flex items-center gap-2">
            <label htmlFor="duration-sort-select" className="sr-only">
              {t('filter.sortBy', 'ترتيب حسب')}
            </label>
            <div className="relative">
              <select
                id="duration-sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-[#041446] border border-gray-300 dark:border-gold-500/40 text-gray-900 dark:text-white text-xs font-bold rounded-full py-2 px-4 pe-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm"
              >
                <option value="default">{t('filter.default', 'الترتيب الافتراضي')}</option>
                <option value="duration-asc">{t('filter.durationAsc', 'الأقصر مدة (أقل أيام)')}</option>
                <option value="duration-desc">{t('filter.durationDesc', 'الأطول مدة (أكثر أيام)')}</option>
              </select>
              <div className={`pointer-events-none absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center text-gray-500 dark:text-gold-400`}>
                {sortOrder === 'duration-asc' ? (
                  <FaSortAmountUp size={12} />
                ) : (
                  <FaSortAmountDown size={12} />
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
