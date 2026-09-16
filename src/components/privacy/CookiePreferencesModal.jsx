/**
 * CookiePreferencesModal.jsx — Second-Layer Granular Privacy Preferences Modal
 * DUNAS TRAVEL Luxury Production Consent Architecture
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../privacy/consent';
import { CATEGORY_METADATA, CONSENT_CATEGORIES } from '../../privacy/consent/consent.constants';

export function CookiePreferencesModal() {
  const { t, i18n } = useTranslation();
  const { isPreferencesOpen, closePreferences, consent, savePreferences, acceptAll, rejectAll } = useConsent();
  const isRtl = i18n.dir() === 'rtl';

  // Local draft state for toggle switches
  const [draftPreferences, setDraftPreferences] = useState({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  // Track expanded category details accordion
  const [expandedCategory, setExpandedCategory] = useState(null);

  const modalRef = useRef(null);
  const triggerElementRef = useRef(null);

  // Sync draft state whenever modal opens
  useEffect(() => {
    if (isPreferencesOpen) {
      // Save previously focused element to restore upon close
      triggerElementRef.current = document.activeElement;

      setDraftPreferences({
        preferences: Boolean(consent.preferences),
        analytics: Boolean(consent.analytics),
        marketing: Boolean(consent.marketing),
      });

      // Prevent body scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first interactive element inside modal
      const focusTimer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = originalOverflow;
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isPreferencesOpen, consent]);

  // Handle Escape key and focus trapping
  useEffect(() => {
    if (!isPreferencesOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePreferences();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreferencesOpen, closePreferences]);

  const handleToggle = useCallback((category) => {
    if (category === CONSENT_CATEGORIES.NECESSARY) return; // Locked
    setDraftPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const handleSaveCustom = useCallback(() => {
    savePreferences(draftPreferences);
  }, [savePreferences, draftPreferences]);

  const toggleAccordion = useCallback((catId) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  }, []);

  if (!isPreferencesOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="presentation"
      onClick={closePreferences}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        aria-describedby="cookie-preferences-desc"
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#071330] border border-[#C9A227]/40 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-[#071330] via-[#0A1969] to-[#071330]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h2 id="cookie-preferences-title" className="text-lg sm:text-xl font-bold text-[#E8CB72] font-display">
              {t('cookies.modal.title', 'Privacy & Cookie Preferences')}
            </h2>
          </div>

          <button
            type="button"
            onClick={closePreferences}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            aria-label={t('cookies.modal.close', 'Close dialog')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <p id="cookie-preferences-desc" className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t(
              'cookies.modal.desc',
              'Customize your privacy choices below. Strictly necessary cookies cannot be disabled as they are required for security, authentication, and core functionality. You can withdraw or adjust your consent anytime.'
            )}
          </p>

          <div className="space-y-3.5">
            {/* 1. Necessary (Always Active) */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {t('cookies.categories.necessary.title', 'Strictly Necessary')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C9A227]/20 text-[#E8CB72] border border-[#C9A227]/30">
                      {t('cookies.modal.alwaysActive', 'Always Active')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t(
                      'cookies.categories.necessary.desc',
                      'Essential for security, user authentication, anti-CSRF protection, and preserving your privacy decisions. These cannot be switched off.'
                    )}
                  </p>
                </div>

                {/* Locked Switch */}
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    disabled
                    aria-checked="true"
                    role="switch"
                    aria-label={t('cookies.categories.necessary.title', 'Strictly Necessary')}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full bg-[#C9A227] opacity-80 transition-colors"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-[#071330] transition duration-200 mt-1 ${isRtl ? '-translate-x-6' : 'translate-x-6'}`} />
                  </button>
                </div>
              </div>

              {/* Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleAccordion(CONSENT_CATEGORIES.NECESSARY)}
                className="mt-3 text-[11px] font-semibold text-[#E8CB72] hover:text-[#C9A227] flex items-center gap-1 transition-colors focus:outline-none"
              >
                <span>{expandedCategory === CONSENT_CATEGORIES.NECESSARY ? t('cookies.modal.hideDetails', 'Hide Technologies') : t('cookies.modal.viewDetails', 'View Technologies')}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${expandedCategory === CONSENT_CATEGORIES.NECESSARY ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Technologies Table */}
              {expandedCategory === CONSENT_CATEGORIES.NECESSARY && (
                <div className="mt-3 pt-3 border-t border-white/10 overflow-x-auto text-[11px]">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-1.5 font-semibold">Key / Cookie</th>
                        <th className="pb-1.5 font-semibold">Provider</th>
                        <th className="pb-1.5 font-semibold">Purpose</th>
                        <th className="pb-1.5 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.NECESSARY].technologies.map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-1.5 font-mono text-[#E8CB72]">{t.name}</td>
                          <td className="py-1.5">{t.provider}</td>
                          <td className="py-1.5">{t.purpose}</td>
                          <td className="py-1.5">{t.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. Preferences / Functional */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-sm text-white">
                    {t('cookies.categories.preferences.title', 'Functional & Preferences')}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t(
                      'cookies.categories.preferences.desc',
                      'Enables personalized website features such as remembering your selected currency, language, dark/light theme, and saved tour wishlist.'
                    )}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draftPreferences.preferences}
                    onClick={() => handleToggle(CONSENT_CATEGORIES.PREFERENCES)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#071330] ${
                      draftPreferences.preferences ? 'bg-[#C9A227]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ${
                        draftPreferences.preferences
                          ? (isRtl ? '-translate-x-6' : 'translate-x-6')
                          : (isRtl ? '-translate-x-1' : 'translate-x-1')
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleAccordion(CONSENT_CATEGORIES.PREFERENCES)}
                className="mt-3 text-[11px] font-semibold text-[#E8CB72] hover:text-[#C9A227] flex items-center gap-1 transition-colors focus:outline-none"
              >
                <span>{expandedCategory === CONSENT_CATEGORIES.PREFERENCES ? t('cookies.modal.hideDetails', 'Hide Technologies') : t('cookies.modal.viewDetails', 'View Technologies')}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${expandedCategory === CONSENT_CATEGORIES.PREFERENCES ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Technologies Table */}
              {expandedCategory === CONSENT_CATEGORIES.PREFERENCES && (
                <div className="mt-3 pt-3 border-t border-white/10 overflow-x-auto text-[11px]">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-1.5 font-semibold">Key</th>
                        <th className="pb-1.5 font-semibold">Provider</th>
                        <th className="pb-1.5 font-semibold">Purpose</th>
                        <th className="pb-1.5 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.PREFERENCES].technologies.map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-1.5 font-mono text-[#E8CB72]">{t.name}</td>
                          <td className="py-1.5">{t.provider}</td>
                          <td className="py-1.5">{t.purpose}</td>
                          <td className="py-1.5">{t.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 3. Analytics / Performance */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-sm text-white">
                    {t('cookies.categories.analytics.title', 'Analytics & Measurement')}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t(
                      'cookies.categories.analytics.desc',
                      'Allows us to aggregate anonymous visitor traffic and interaction telemetry to measure website performance, route transition speed, and improve user navigation.'
                    )}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draftPreferences.analytics}
                    onClick={() => handleToggle(CONSENT_CATEGORIES.ANALYTICS)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#071330] ${
                      draftPreferences.analytics ? 'bg-[#C9A227]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ${
                        draftPreferences.analytics
                          ? (isRtl ? '-translate-x-6' : 'translate-x-6')
                          : (isRtl ? '-translate-x-1' : 'translate-x-1')
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleAccordion(CONSENT_CATEGORIES.ANALYTICS)}
                className="mt-3 text-[11px] font-semibold text-[#E8CB72] hover:text-[#C9A227] flex items-center gap-1 transition-colors focus:outline-none"
              >
                <span>{expandedCategory === CONSENT_CATEGORIES.ANALYTICS ? t('cookies.modal.hideDetails', 'Hide Technologies') : t('cookies.modal.viewDetails', 'View Technologies')}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${expandedCategory === CONSENT_CATEGORIES.ANALYTICS ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Technologies Table */}
              {expandedCategory === CONSENT_CATEGORIES.ANALYTICS && (
                <div className="mt-3 pt-3 border-t border-white/10 overflow-x-auto text-[11px]">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-1.5 font-semibold">Technology / Signal</th>
                        <th className="pb-1.5 font-semibold">Provider</th>
                        <th className="pb-1.5 font-semibold">Purpose</th>
                        <th className="pb-1.5 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.ANALYTICS].technologies.map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-1.5 font-mono text-[#E8CB72]">{t.name}</td>
                          <td className="py-1.5">{t.provider}</td>
                          <td className="py-1.5">{t.purpose}</td>
                          <td className="py-1.5">{t.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 4. Marketing / Third-Party */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-sm text-white">
                    {t('cookies.categories.marketing.title', 'Marketing & Media Embeds')}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t(
                      'cookies.categories.marketing.desc',
                      'Enables external interactive media such as YouTube video tours, interactive Google Maps, and advertising attribution tags where applicable.'
                    )}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draftPreferences.marketing}
                    onClick={() => handleToggle(CONSENT_CATEGORIES.MARKETING)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#071330] ${
                      draftPreferences.marketing ? 'bg-[#C9A227]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ${
                        draftPreferences.marketing
                          ? (isRtl ? '-translate-x-6' : 'translate-x-6')
                          : (isRtl ? '-translate-x-1' : 'translate-x-1')
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleAccordion(CONSENT_CATEGORIES.MARKETING)}
                className="mt-3 text-[11px] font-semibold text-[#E8CB72] hover:text-[#C9A227] flex items-center gap-1 transition-colors focus:outline-none"
              >
                <span>{expandedCategory === CONSENT_CATEGORIES.MARKETING ? t('cookies.modal.hideDetails', 'Hide Technologies') : t('cookies.modal.viewDetails', 'View Technologies')}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${expandedCategory === CONSENT_CATEGORIES.MARKETING ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Technologies Table */}
              {expandedCategory === CONSENT_CATEGORIES.MARKETING && (
                <div className="mt-3 pt-3 border-t border-white/10 overflow-x-auto text-[11px]">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-1.5 font-semibold">Embed / Signal</th>
                        <th className="pb-1.5 font-semibold">Provider</th>
                        <th className="pb-1.5 font-semibold">Purpose</th>
                        <th className="pb-1.5 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.MARKETING].technologies.map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-1.5 font-mono text-[#E8CB72]">{t.name}</td>
                          <td className="py-1.5">{t.provider}</td>
                          <td className="py-1.5">{t.purpose}</td>
                          <td className="py-1.5">{t.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#071330]/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={rejectAll}
            className="px-4 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold text-xs transition-colors text-center order-3 sm:order-1"
          >
            {t('cookies.modal.rejectAll', 'Reject Non-Essential')}
          </button>

          <div className="flex flex-col sm:flex-row gap-2.5 order-1 sm:order-2">
            <button
              type="button"
              onClick={handleSaveCustom}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center"
            >
              {t('cookies.modal.save', 'Save Preferences')}
            </button>

            <button
              type="button"
              onClick={acceptAll}
              className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#d8b135] text-[#071330] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.02] text-center"
            >
              {t('cookies.modal.acceptAll', 'Accept All')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookiePreferencesModal;
