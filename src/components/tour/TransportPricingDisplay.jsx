import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const CategoryOptions = [
  { value: 'transportation', label: 'General Transportation', ar: 'نقل عام', en: 'General Transportation' },
  { value: 'transfer', label: 'Airport Transfer', ar: 'توصيل واستقبال', en: 'Airport Transfer' },
  { value: 'private', label: 'Private Vehicle', ar: 'سيارة خاصة', en: 'Private Vehicle' },
];

export default function TransportPricingDisplay({
  tour,
  t,
  lang = 'en',
  formatPrice,
}) {
  const [pricings, setPricings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('transportation');

  const [searchParams] = useSearchParams();
  const tourId = searchParams ? searchParams.get('tourId') : null;

  useEffect(() => {
    const id = tourId || tour?.id;
    if (id) {
      fetchPricings(id);
    }
  }, [tourId, tour?.id, category]);

  const fetchPricings = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transportation/pricing?tourId=${encodeURIComponent(id)}&category=${encodeURIComponent(category)}`);
      if (res.ok) {
        const data = await res.json();
        setPricings(Array.isArray(data) ? data : (data?.data || []));
      } else {
        setPricings([]);
      }
    } catch (err) {
      setPricings([]);
    } finally {
      setLoading(false);
    }
  };

  if (!pricings || pricings.length === 0) {
    return null;
  }

  return (
    <div className="p-6 mb-8 border border-amber-500/30 rounded-2xl bg-amber-500/5">
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
        <span>{t ? t('transportation.transportPricing', 'Transport Pricing') : 'Transport Pricing'}</span>
      </h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          {CategoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
              <th className="p-3 align-top">
                {t ? t('transportation.passengerRange', 'Passenger Range') : 'Passenger Range'}
              </th>
              <th className="p-3 align-top">
                {t ? t('transportation.price', 'Price (USD)') : 'Price (USD)'}
              </th>
              <th className="p-3 align-top">
                {t ? t('transportation.category', 'Category') : 'Category'}
              </th>
              <th className="p-3 align-top">
                {t ? t('transportation.status', 'Status') : 'Status'}
              </th>
            </tr>
          </thead>
          <tbody>
            {pricings.map((item) => (
              <tr key={item.id} className="border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-3 align-top font-medium">
                  {item.passengerRange}
                </td>
                <td className="p-3">
                  {typeof formatPrice === 'function' ? formatPrice(item.priceUsd) : `$${item.priceUsd}`}
                </td>
                <td className="p-3">
                  {item.category}
                </td>
                <td className="p-3">
                  <span
                    className={item.isActive
                      ? 'bg-emerald-500/80 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded'
                      : 'bg-slate-950/80 text-amber-400 border border-amber-400/20 font-black text-[10px] px-2 py-0.5 rounded'}
                  >
                    {item.isActive ? (t ? t('common.active', 'Active') : 'Active') : (t ? t('common.inactive', 'Archived') : 'Archived')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
