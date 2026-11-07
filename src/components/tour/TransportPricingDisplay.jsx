import React, { useMemo } from 'react';

export default function TransportPricingDisplay({ tour, t, lang = 'en' }) {
  const tr = (key, fallback) => (typeof t === 'function' ? t(key, fallback) : fallback);

  const rows = useMemo(() => {
    const list = Array.isArray(tour?.transportation?.pricing)
      ? tour.transportation.pricing
      : Array.isArray(tour?.transportPricing)
        ? tour.transportPricing
        : Array.isArray(tour?.transportation)
          ? tour.transportation
          : [];
    return list.filter((r) => r && r.isActive !== false);
  }, [tour]);

  if (!rows || rows.length === 0) {
    return null;
  }

  const getRouteText = (row) => {
    let text = '';
    if (row.routes && typeof row.routes === 'object') {
      text =
        row.routes[lang] ||
        row.routes.es ||
        row.routes.en ||
        row.routes.ar ||
        row.routes.pt ||
        row.routes.it ||
        Object.values(row.routes).find(Boolean) ||
        '';
    } else if (row.route && typeof row.route === 'object') {
      text =
        row.route[lang] ||
        row.route.es ||
        row.route.en ||
        row.route.ar ||
        row.route.pt ||
        row.route.it ||
        Object.values(row.route).find(Boolean) ||
        '';
    } else if (typeof row.route === 'string' && row.route.trim()) {
      text = row.route.trim();
    } else if (typeof row.transportType === 'string' && row.transportType.trim()) {
      text = row.transportType.trim();
    }

    if (!text) return '—';

    const orViceVersa = tr('transportPricing.orViceVersa', 'O Viceversa');
    const hasSuffix = /(viceversa|vice\s*versa|أو\s*العكس)/i.test(text);
    if (!hasSuffix) {
      return `${text} ... ${orViceVersa}`;
    }
    return text;
  };

  const formatPriceCell = (value) => {
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) {
      return '—';
    }
    return `$ ${num}`;
  };

  return (
    <section
      aria-label="Transport Pricing"
      className="w-full my-10 select-text"
    >
      {/* Title */}
      <h3 className="text-sm sm:text-base md:text-lg font-black uppercase text-amber-600 dark:text-amber-400 tracking-wide mb-3 text-center sm:text-start">
        {tr('transportPricing.title', 'PRECIOS NETOS DE TRASLADOS EXTRAS EN USD Y POR PERSONA:')}
      </h3>

      {/* Responsive scrollable table container */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#FFA000] dark:border-amber-500 shadow-sm bg-white dark:bg-slate-900">
        <table className="w-full min-w-[620px] text-center border-collapse">
          <thead>
            <tr className="bg-[#FFA000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider">
              <th
                scope="col"
                className="p-3 sm:p-4 text-center border border-[#FFA000] dark:border-amber-500 min-w-[280px] sm:min-w-[340px]"
              >
                {tr('transportPricing.traslados', 'Traslados')}
              </th>
              <th
                scope="col"
                className="p-3 sm:p-4 text-center border border-[#FFA000] dark:border-amber-500 w-28 sm:w-36 whitespace-nowrap"
              >
                {tr('transportPricing.base0204', 'Base 02 – 04')}
              </th>
              <th
                scope="col"
                className="p-3 sm:p-4 text-center border border-[#FFA000] dark:border-amber-500 w-28 sm:w-36 whitespace-nowrap"
              >
                {tr('transportPricing.base0507', 'Base 05 – 07')}
              </th>
              <th
                scope="col"
                className="p-3 sm:p-4 text-center border border-[#FFA000] dark:border-amber-500 w-28 sm:w-36 whitespace-nowrap"
              >
                {tr('transportPricing.base0814', 'Base 08 – 14')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFA000]/40 dark:divide-amber-500/40">
            {rows.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="bg-white dark:bg-slate-900 hover:bg-amber-500/5 dark:hover:bg-amber-400/5 transition-colors"
              >
                {/* Route - Centered & Wide */}
                <td className="p-3 sm:py-3.5 sm:px-4 text-center font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-[#FFA000] dark:border-amber-500 leading-relaxed">
                  {getRouteText(row)}
                </td>

                {/* Base 02 – 04 */}
                <td className="p-3 sm:py-3.5 sm:px-4 text-center font-black text-sm sm:text-base text-slate-900 dark:text-amber-300 font-mono border border-[#FFA000] dark:border-amber-500">
                  {formatPriceCell(row.priceBase0204)}
                </td>

                {/* Base 05 – 07 */}
                <td className="p-3 sm:py-3.5 sm:px-4 text-center font-black text-sm sm:text-base text-slate-900 dark:text-amber-300 font-mono border border-[#FFA000] dark:border-amber-500">
                  {formatPriceCell(row.priceBase0507)}
                </td>

                {/* Base 08 – 14 */}
                <td className="p-3 sm:py-3.5 sm:px-4 text-center font-black text-sm sm:text-base text-slate-900 dark:text-amber-300 font-mono border border-[#FFA000] dark:border-amber-500">
                  {formatPriceCell(row.priceBase0814)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
