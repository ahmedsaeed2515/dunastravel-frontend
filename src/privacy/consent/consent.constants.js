/**
 * consent.constants.js — Centralized Cookie & Privacy Preferences Constants
 * DUNAS TRAVEL Production Consent Architecture
 */

export const CONSENT_VERSION = '2026-09-16-v1';
export const CONSENT_STORAGE_KEY = 'dunas_cookie_consent';

export const CONSENT_CATEGORIES = {
  NECESSARY: 'necessary',
  PREFERENCES: 'preferences',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
};

export const DEFAULT_CONSENT_STATE = Object.freeze({
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  consentVersion: CONSENT_VERSION,
  timestamp: null,
  status: 'unanswered', // 'unanswered' | 'accepted_all' | 'rejected_all' | 'custom'
  source: null,         // 'banner' | 'preferences' | 'sync'
});

export const CATEGORY_METADATA = Object.freeze({
  [CONSENT_CATEGORIES.NECESSARY]: {
    id: CONSENT_CATEGORIES.NECESSARY,
    locked: true,
    required: true,
    technologies: [
      { name: 'access_token', provider: 'DUNAS Backend', type: 'HttpOnly Cookie', purpose: 'Authentication & session security', lifetime: '15 minutes' },
      { name: 'refresh_token', provider: 'DUNAS Backend', type: 'HttpOnly Cookie', purpose: 'Secure token rotation', lifetime: '7 days' },
      { name: 'csrf_token', provider: 'DUNAS Backend', type: 'Cookie', purpose: 'Anti-CSRF request protection', lifetime: 'Session' },
      { name: 'dunas_guest_token', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Anonymous booking cart state', lifetime: 'Persistent' },
      { name: 'dunas_cookie_consent', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Stores privacy preferences', lifetime: '12 months' },
    ],
  },
  [CONSENT_CATEGORIES.PREFERENCES]: {
    id: CONSENT_CATEGORIES.PREFERENCES,
    locked: false,
    required: false,
    technologies: [
      { name: 'i18nextLng', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Remembers selected language', lifetime: 'Persistent' },
      { name: 'currency', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Remembers selected currency (USD, EUR, etc.)', lifetime: 'Persistent' },
      { name: 'theme', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Remembers dark/light theme preference', lifetime: 'Persistent' },
      { name: 'jaider_chat_session_id', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Remembers AI concierge conversation context', lifetime: 'Persistent' },
      { name: 'dunas_local_favorites', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'Remembers favorited tours for guest visitors', lifetime: 'Persistent' },
    ],
  },
  [CONSENT_CATEGORIES.ANALYTICS]: {
    id: CONSENT_CATEGORIES.ANALYTICS,
    locked: false,
    required: false,
    technologies: [
      { name: 'dunas_analytics_sid', provider: 'DUNAS Travel', type: 'localStorage', purpose: 'First-party visitor session analytics', lifetime: 'Persistent' },
      { name: '/api/analytics/events', provider: 'DUNAS Travel', type: 'Beacon / Fetch', purpose: 'Aggregated page view & interaction telemetry', lifetime: 'Per session' },
      { name: 'Google Consent Mode v2 (analytics_storage)', provider: 'Google', type: 'Signal', purpose: 'Governs Google tags analytics telemetry if loaded', lifetime: 'Per session' },
    ],
  },
  [CONSENT_CATEGORIES.MARKETING]: {
    id: CONSENT_CATEGORIES.MARKETING,
    locked: false,
    required: false,
    technologies: [
      { name: 'YouTube Iframe API', provider: 'Google / YouTube', type: 'External SDK', purpose: 'Background audio & video streaming playback', lifetime: 'Third-party cookies' },
      { name: 'YouTube Video Embeds', provider: 'Google / YouTube', type: 'Embedded Iframe', purpose: 'Cinematic tour previews & hotel walkthroughs', lifetime: 'Third-party cookies' },
      { name: 'Google Maps Embeds', provider: 'Google Maps', type: 'Embedded Iframe', purpose: 'Interactive hotel & office location maps', lifetime: 'Third-party cookies' },
      { name: 'Google Consent Mode v2 (ad_storage, ad_user_data, ad_personalization)', provider: 'Google', type: 'Signal', purpose: 'Governs advertising & conversion tracking tags if loaded', lifetime: 'Per session' },
    ],
  },
});
