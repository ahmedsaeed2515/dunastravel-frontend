/**
 * CookieConsentBanner.jsx — First-Layer Privacy & Cookie Consent Banner
 * DUNAS TRAVEL Luxury Production Consent Architecture
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useConsent } from '../../privacy/consent';

export function CookieConsentBanner() {
  const { t, i18n } = useTranslation();
  const { isBannerOpen, acceptAll, rejectAll, openPreferences } = useConsent();
  const isRtl = i18n.dir() === 'rtl';

  if (!isBannerOpen) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-label={t('cookies.banner.ariaLabel', 'Cookie and privacy consent banner')}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed bottom-0 inset-x-0 z-[9998] p-4 sm:p-6 transition-all duration-300 ease-out"
    >
      <div className="max-w-6xl mx-auto rounded-2xl bg-[#071330]/95 backdrop-blur-xl border border-[#C9A227]/40 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-5 sm:p-7 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
        
        {/* Left Side: Shield Icon + Text */}
        <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-[#E8CB72] tracking-wide font-display">
              {t('cookies.banner.title', 'Your Privacy Matters')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {t(
                'cookies.banner.desc',
                'We use essential cookies to keep our website secure and operational. With your consent, we also use functional, analytics, and marketing cookies to enhance your journey, remember preferences, and deliver personalized travel experiences.'
              )}{' '}
              <Link
                to="/cookie-policy"
                className="text-[#E8CB72] underline hover:text-[#C9A227] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A227] rounded-sm"
              >
                {t('cookies.banner.learnMore', 'Cookie Policy')}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: 3 Action Buttons (Equal Visual Prominence) */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={acceptAll}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#d8b135] text-[#071330] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-[0_4px_15px_rgba(201,162,39,0.4)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#071330] text-center"
          >
            {t('cookies.banner.acceptAll', 'Accept All')}
          </button>

          <button
            type="button"
            onClick={rejectAll}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#C9A227]/70 hover:border-[#C9A227] bg-[#071330] hover:bg-white/5 text-[#E8CB72] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#071330] text-center"
          >
            {t('cookies.banner.rejectAll', 'Reject All')}
          </button>

          <button
            type="button"
            onClick={openPreferences}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/40 text-center"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            <span>{t('cookies.banner.customize', 'Customize Preferences')}</span>
          </button>
        </div>

      </div>
    </aside>
  );
}

export default CookieConsentBanner;
