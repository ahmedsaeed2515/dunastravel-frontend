import React, { useMemo } from 'react';

const resolveText = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || Object.values(value).find(Boolean) || '';
};

export default function TransportPricingDisplay({ tour, t, lang = 'en', formatPrice }) {
  const vehicleGroups = tour?.vehicleGroups;
  const transportPricing = tour?.transportPricing;

  const groups = useMemo(() => {
    if (Array.isArray(vehicleGroups) && vehicleGroups.length > 0) {
      return vehicleGroups;
    }
    const flat = Array.isArray(transportPricing) ? transportPricing : [];
    const map = new Map();
    flat.forEach((row) => {
      const key = row.transportType || '';
      if (!map.has(key)) map.set(key, { transportType: key, tiers: [] });
      map.get(key).tiers.push(row);
    });
    return Array.from(map.values());
  }, [vehicleGroups, transportPricing]);

  if (!groups.length) return null;

  const tr = (key, fallback) => (typeof t === 'function' ? t(key, fallback) : fallback);

  return (
    <div className="p-6 mb-8 border border-amber-500/30 rounded-2xl bg-amber-500/5">
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
        {tr('transportation.transportPricing', 'Transport Pricing')}
      </h3>

      <div className="flex flex-col gap-4">
        {groups.map((group, gi) => (
          <div
            key={`${group.transportType}-${gi}`}
            className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
          >
            <div className="px-4 py-2 bg-amber-500/10 font-black text-sm text-slate-900 dark:text-white">
              {resolveText(group.transportType, lang)}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="text-xs font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">{tr('transportation.passengerRange', 'Passengers')}</th>
                    <th className="p-3">{tr('transportation.pricePerPerson', 'Price per person')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(group.tiers || []).map((tier, ti) => (
                    <tr key={ti} className="border-b border-slate-200/50 dark:border-slate-800/50">
                      <td className="p-3 font-medium">{tier.passengerRange}</td>
                      <td className="p-3">
                        {typeof formatPrice === 'function'
                          ? formatPrice(tier.pricePerPerson)
                          : `${tier.currency || 'USD'} ${tier.pricePerPerson}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
