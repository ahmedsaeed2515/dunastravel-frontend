/**
 * ConsentGate.jsx — Privacy-Preserving Third-Party Embed Gating Component
 * Prevents non-essential third-party iframes/scripts (YouTube, Google Maps) from setting cookies until permitted.
 * DUNAS TRAVEL Production Consent Architecture
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../privacy/consent';

export function ConsentGate({
  category = 'marketing',
  providerName = 'Third Party',
  children,
  fallbackThumbnail,
  height = '100%',
  className = '',
}) {
  const { t, i18n } = useTranslation();
  const { consent, hasConsent, savePreferences, openPreferences } = useConsent();
  const isRtl = i18n.dir() === 'rtl';

  if (hasConsent(category)) {
    return <>{children}</>;
  }

  const handleAllowCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    savePreferences({
      preferences: consent.preferences,
      analytics: consent.analytics,
      marketing: true,
    });
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[#071330] text-white flex flex-col items-center justify-center p-6 text-center shadow-xl ${className}`}
      style={{ minHeight: height === '100%' ? '240px' : height }}
      role="region"
      aria-label={t('cookies.gate.regionLabel', 'Privacy Protected Content')}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Blurred background preview if thumbnail provided */}
      {fallbackThumbnail && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${fallbackThumbnail})` }}
          aria-hidden="true"
        />
      )}

      {/* Decorative dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071330]/90 via-[#0A1969]/80 to-[#071330]/95 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] mb-3 shadow-inner">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>

        <h4 className="text-lg font-bold text-[#E8CB72] mb-1 font-display tracking-wide">
          {t('cookies.gate.title', 'External Content Blocked')} ({providerName})
        </h4>

        <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed max-w-sm">
          {t(
            'cookies.gate.desc',
            'To protect your privacy, external content from {{provider}} will not load until you allow marketing cookies.',
            { provider: providerName }
          )}
        </p>

        <div className="flex flex-wrap gap-2.5 justify-center items-center">
          <button
            type="button"
            onClick={handleAllowCategory}
            className="px-5 py-2 rounded-full bg-[#C9A227] hover:bg-[#d8b135] text-[#071330] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#071330]"
          >
            {t('cookies.gate.allow', 'Allow & Show')}
          </button>

          <button
            type="button"
            onClick={openPreferences}
            className="px-4 py-2 rounded-full border border-white/20 hover:border-[#C9A227]/50 text-white/90 hover:text-white text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            {t('cookies.gate.settings', 'Cookie Settings')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsentGate;
