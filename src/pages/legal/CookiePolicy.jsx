/**
 * CookiePolicy.jsx — Comprehensive, Transparent Cookie Policy Page
 * DUNAS TRAVEL Luxury Production Architecture
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useConsent } from '../../privacy/consent';
import { CATEGORY_METADATA, CONSENT_CATEGORIES, CONSENT_VERSION } from '../../privacy/consent/consent.constants';

export function CookiePolicy() {
  const { t, i18n } = useTranslation();
  const { openPreferences, consent } = useConsent();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <>
      <Helmet>
        <title>{t('cookies.policy.metaTitle', 'Cookie Policy | DUNAS TRAVEL')}</title>
        <meta
          name="description"
          content={t('cookies.policy.metaDesc', 'Learn how DUNAS TRAVEL uses cookies and similar technologies to provide luxury travel services, protect security, and respect your privacy choices.')}
        />
      </Helmet>

      <main className="min-h-screen bg-[#071330] text-white py-16 px-4 sm:px-8 lg:px-16" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <header className="border-b border-[#C9A227]/30 pb-8 space-y-4">
            <span className="text-[#C9A227] text-xs uppercase tracking-widest font-bold block">
              {t('cookies.policy.badge', 'Privacy Transparency')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-display text-[#E8CB72] tracking-wide">
              {t('cookies.policy.title', 'Cookie Policy & Privacy Preferences')}
            </h1>
            <p className="text-sm text-slate-400">
              {t('cookies.policy.lastUpdated', 'Policy Version: {{version}} | Effective Date: September 2026', { version: CONSENT_VERSION })}
            </p>
          </header>

          {/* Interactive Consent Status Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A1969] via-[#071330] to-[#0A1969] border border-[#C9A227]/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#E8CB72]">
                {t('cookies.policy.statusTitle', 'Your Current Preferences')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('cookies.policy.statusDesc', 'Necessary: Active | Preferences: {{pref}} | Analytics: {{ana}} | Marketing: {{mkt}}', {
                  pref: consent.preferences ? t('cookies.policy.enabled', 'Enabled') : t('cookies.policy.disabled', 'Disabled'),
                  ana: consent.analytics ? t('cookies.policy.enabled', 'Enabled') : t('cookies.policy.disabled', 'Disabled'),
                  mkt: consent.marketing ? t('cookies.policy.enabled', 'Enabled') : t('cookies.policy.disabled', 'Disabled'),
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={openPreferences}
              className="px-6 py-3 rounded-full bg-[#C9A227] hover:bg-[#d8b135] text-[#071330] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 shrink-0"
            >
              {t('cookies.policy.changeBtn', 'Change My Cookie Preferences')}
            </button>
          </div>

          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#E8CB72] font-display">
              {t('cookies.policy.sec1Title', '1. What Are Cookies and Storage Technologies?')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('cookies.policy.sec1Text', 'Cookies are small text files placed on your browser or device by websites you visit. Similar technologies include HTML5 localStorage, sessionStorage, and tracking pixels. They allow websites to remember your device, keep you securely authenticated during bookings, remember your language and currency preferences, and measure website performance.')}
            </p>
          </section>

          {/* Section 2: How DUNAS TRAVEL Uses Cookies */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[#E8CB72] font-display">
              {t('cookies.policy.sec2Title', '2. Categories of Technologies We Use')}
            </h2>

            <div className="space-y-6">
              {/* Category A: Necessary */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">
                    {t('cookies.categories.necessary.title', 'Strictly Necessary')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C9A227]/20 text-[#E8CB72] border border-[#C9A227]/30">
                    {t('cookies.modal.alwaysActive', 'Always Active')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies.categories.necessary.desc', 'Essential for security, user authentication, anti-CSRF protection, and preserving your privacy decisions. These cannot be switched off.')}
                </p>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-2 font-semibold">Key / Cookie</th>
                        <th className="pb-2 font-semibold">Provider</th>
                        <th className="pb-2 font-semibold">Purpose</th>
                        <th className="pb-2 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.NECESSARY].technologies.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-mono text-[#E8CB72]">{item.name}</td>
                          <td className="py-2">{item.provider}</td>
                          <td className="py-2">{item.purpose}</td>
                          <td className="py-2">{item.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category B: Preferences */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <h3 className="font-bold text-base text-white">
                  {t('cookies.categories.preferences.title', 'Functional & Preferences')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies.categories.preferences.desc', 'Enables personalized website features such as remembering your selected currency, language, dark/light theme, and saved tour wishlist.')}
                </p>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-2 font-semibold">Key</th>
                        <th className="pb-2 font-semibold">Provider</th>
                        <th className="pb-2 font-semibold">Purpose</th>
                        <th className="pb-2 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.PREFERENCES].technologies.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-mono text-[#E8CB72]">{item.name}</td>
                          <td className="py-2">{item.provider}</td>
                          <td className="py-2">{item.purpose}</td>
                          <td className="py-2">{item.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category C: Analytics */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <h3 className="font-bold text-base text-white">
                  {t('cookies.categories.analytics.title', 'Analytics & Measurement')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies.categories.analytics.desc', 'Allows us to aggregate anonymous visitor traffic and interaction telemetry to measure website performance, route transition speed, and improve user navigation.')}
                </p>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-2 font-semibold">Signal / Technology</th>
                        <th className="pb-2 font-semibold">Provider</th>
                        <th className="pb-2 font-semibold">Purpose</th>
                        <th className="pb-2 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.ANALYTICS].technologies.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-mono text-[#E8CB72]">{item.name}</td>
                          <td className="py-2">{item.provider}</td>
                          <td className="py-2">{item.purpose}</td>
                          <td className="py-2">{item.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category D: Marketing */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <h3 className="font-bold text-base text-white">
                  {t('cookies.categories.marketing.title', 'Marketing & Media Embeds')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('cookies.categories.marketing.desc', 'Enables external interactive media such as YouTube video tours, interactive Google Maps, and advertising attribution tags where applicable.')}
                </p>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left" dir="ltr">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10">
                        <th className="pb-2 font-semibold">Embed / Signal</th>
                        <th className="pb-2 font-semibold">Provider</th>
                        <th className="pb-2 font-semibold">Purpose</th>
                        <th className="pb-2 font-semibold">Lifetime</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {CATEGORY_METADATA[CONSENT_CATEGORIES.MARKETING].technologies.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-mono text-[#E8CB72]">{item.name}</td>
                          <td className="py-2">{item.provider}</td>
                          <td className="py-2">{item.purpose}</td>
                          <td className="py-2">{item.lifetime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Changing and Withdrawing Consent */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#E8CB72] font-display">
              {t('cookies.policy.sec3Title', '3. How to Withdraw or Change Your Preferences')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('cookies.policy.sec3Text', 'You retain complete control over your privacy. You can open the Cookie Preferences panel at any time by clicking "Cookie Settings" in our website footer or by clicking the button at the top of this policy. When you revoke consent for a category, our system immediately halts future tracking events and cleans up relevant storage keys on your device.')}
            </p>
          </section>

          {/* Section 4: Contact Information */}
          <section className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-[#E8CB72] font-display">
              {t('cookies.policy.sec4Title', '4. Contact Privacy Team')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('cookies.policy.sec4Text', 'If you have any questions regarding this Cookie Policy or how your personal information is handled, please contact our Data Protection Office at: info@dunas-travel.com or via WhatsApp at +20 114 940 1111.')}
            </p>
          </section>

        </div>
      </main>
    </>
  );
}

export default CookiePolicy;
