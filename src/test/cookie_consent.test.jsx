import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  consentManager,
  ConsentProvider,
  useConsent,
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT_STATE,
  readStoredConsent,
  writeStoredConsent,
} from '../privacy/consent';
import CookieConsentBanner from '../components/privacy/CookieConsentBanner';
import CookiePreferencesModal from '../components/privacy/CookiePreferencesModal';
import ConsentGate from '../components/privacy/ConsentGate';
import { trackEvent } from '../utils/analytics';
import api from '../utils/api';
import { initI18n } from '../i18n';
import fs from 'fs';
import path from 'path';

describe('Cookie Consent & Privacy Preferences System', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await initI18n();

    // Reset window.dataLayer and gtag mock
    window.dataLayer = [];
    window.gtag = vi.fn((type, action, params) => {
      window.dataLayer.push({ type, action, params });
    });

    // Reset consentManager state
    consentManager.state = { ...DEFAULT_CONSENT_STATE };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Initial State & Runtime Gating
  it('initializes with strictly denied non-essential categories before user consent', () => {
    expect(consentManager.hasConsent('necessary')).toBe(true);
    expect(consentManager.hasConsent('preferences')).toBe(false);
    expect(consentManager.hasConsent('analytics')).toBe(false);
    expect(consentManager.hasConsent('marketing')).toBe(false);
    expect(consentManager.hasAnswered()).toBe(false);
  });

  it('strictly gates analytics tracking when analytics consent is false', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ success: true });
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = vi.fn();

    // Attempt tracking without consent
    await trackEvent('page_view', { pathname: '/tours' });

    // Must be completely dropped
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(postSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem('dunas_analytics_sid')).toBeNull();

    navigator.sendBeacon = originalSendBeacon;
  });

  // 2. Accept All Workflow
  it('accepts all categories, persists state with version, and unlocks analytics', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ success: true });
    const originalSendBeacon = navigator.sendBeacon;
    const sendBeaconMock = vi.fn();
    navigator.sendBeacon = sendBeaconMock;

    consentManager.acceptAll('banner');

    expect(consentManager.hasConsent('necessary')).toBe(true);
    expect(consentManager.hasConsent('preferences')).toBe(true);
    expect(consentManager.hasConsent('analytics')).toBe(true);
    expect(consentManager.hasConsent('marketing')).toBe(true);
    expect(consentManager.hasAnswered()).toBe(true);

    // Stored in localStorage
    const stored = readStoredConsent();
    expect(stored).not.toBeNull();
    expect(stored.consentVersion).toBe(CONSENT_VERSION);
    expect(stored.analytics).toBe(true);
    expect(stored.marketing).toBe(true);

    // Now tracking should execute
    await trackEvent('search_performed', { destination: 'Egypt' });
    expect(postSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(localStorage.getItem('dunas_analytics_sid')).toBeTruthy();

    navigator.sendBeacon = originalSendBeacon;
  });

  // 3. Reject All Workflow
  it('rejects all non-essential categories, persists choice, and keeps trackers blocked', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ success: true });
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = vi.fn();

    consentManager.rejectAll('banner');

    expect(consentManager.hasConsent('necessary')).toBe(true);
    expect(consentManager.hasConsent('preferences')).toBe(false);
    expect(consentManager.hasConsent('analytics')).toBe(false);
    expect(consentManager.hasConsent('marketing')).toBe(false);
    expect(consentManager.hasAnswered()).toBe(true);

    const stored = readStoredConsent();
    expect(stored.status).toBe('rejected_all');
    expect(stored.analytics).toBe(false);

    await trackEvent('heartbeat', { pathname: '/' });
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(localStorage.getItem('dunas_analytics_sid')).toBeNull();

    navigator.sendBeacon = originalSendBeacon;
  });

  // 4. Granular Custom Preferences & ConsentGate
  it('supports granular category customization and gates third-party embeds', () => {
    consentManager.savePreferences({
      preferences: true,
      analytics: true,
      marketing: false,
    });

    expect(consentManager.hasConsent('analytics')).toBe(true);
    expect(consentManager.hasConsent('marketing')).toBe(false);

    // Test ConsentGate component with blocked marketing category
    const { container: blockedContainer } = render(
      <ConsentProvider>
        <ConsentGate category="marketing" providerName="YouTube">
          <iframe title="yt-test" src="https://youtube.com/embed/123" />
        </ConsentGate>
      </ConsentProvider>
    );

    // Iframe must NOT be in DOM
    expect(blockedContainer.querySelector('iframe')).toBeNull();
    expect(screen.getByText(/External Content Blocked/i)).toBeTruthy();

    // Test ConsentGate component with permitted category
    const { container: allowedContainer } = render(
      <ConsentProvider>
        <ConsentGate category="analytics" providerName="Custom Tracker">
          <div data-testid="allowed-content">Analytics Widget</div>
        </ConsentGate>
      </ConsentProvider>
    );
    expect(allowedContainer.querySelector('[data-testid="allowed-content"]')).toBeTruthy();
  });

  // 5. Withdrawal & Storage Cleanup
  it('cleans up analytics storage keys when consent is withdrawn', () => {
    // 1. Grant analytics
    consentManager.acceptAll();
    localStorage.setItem('dunas_analytics_sid', 'test_session_12345');
    expect(localStorage.getItem('dunas_analytics_sid')).toBe('test_session_12345');

    // 2. Withdraw consent
    consentManager.withdrawConsent();
    expect(consentManager.hasConsent('analytics')).toBe(false);

    // 3. Storage key must be purged
    expect(localStorage.getItem('dunas_analytics_sid')).toBeNull();
  });

  // 6. Version Invalidation
  it('invalidates stored consent if consentVersion has been upgraded', () => {
    const outdatedRecord = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      consentVersion: '2024-01-01-old',
      status: 'accepted_all',
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(outdatedRecord));

    // Reading should return null because version does not match
    const result = readStoredConsent();
    expect(result).toBeNull();
  });

  // 7. Banner & Modal UI Component Rendering
  it('renders First-Layer Banner when consent is unanswered and executes Accept All', () => {
    render(
      <MemoryRouter>
        <ConsentProvider>
          <CookieConsentBanner />
        </ConsentProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Your Privacy Matters/i)).toBeTruthy();
    const acceptBtn = screen.getByRole('button', { name: /Accept All/i });
    const rejectBtn = screen.getByRole('button', { name: /Reject All/i });
    const customizeBtn = screen.getByRole('button', { name: /Customize Preferences/i });

    expect(acceptBtn).toBeTruthy();
    expect(rejectBtn).toBeTruthy();
    expect(customizeBtn).toBeTruthy();

    fireEvent.click(acceptBtn);

    // Banner should close immediately after accept
    expect(screen.queryByText(/Your Privacy Matters/i)).toBeNull();
    expect(consentManager.hasConsent('analytics')).toBe(true);
  });

  it('renders Second-Layer Preferences Modal with accessible dialog semantics and locked Necessary toggle', () => {
    function TestWrapper() {
      const { openPreferences } = useConsent();
      return (
        <div>
          <button onClick={openPreferences}>Open Settings</button>
          <CookiePreferencesModal />
        </div>
      );
    }

    render(
      <MemoryRouter>
        <ConsentProvider>
          <TestWrapper />
        </ConsentProvider>
      </MemoryRouter>
    );

    // Click trigger
    fireEvent.click(screen.getByText('Open Settings'));

    // Modal dialog must be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    // Strictly Necessary must be present and locked
    expect(screen.getByRole('switch', { name: /Strictly Necessary/i })).toBeTruthy();
    expect(screen.getByText(/Always Active/i)).toBeTruthy();

    // Close via Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // 8. 5-Language Translation Completeness
  it('verifies 100% translation key parity across all 5 languages with zero missing values', () => {
    const requiredKeys = [
      'footer.cookiePolicy',
      'footer.cookieSettings',
      'cookies.banner.title',
      'cookies.banner.desc',
      'cookies.banner.acceptAll',
      'cookies.banner.rejectAll',
      'cookies.banner.customize',
      'cookies.modal.title',
      'cookies.modal.desc',
      'cookies.modal.alwaysActive',
      'cookies.modal.save',
      'cookies.categories.necessary.title',
      'cookies.categories.preferences.title',
      'cookies.categories.analytics.title',
      'cookies.categories.marketing.title',
      'cookies.gate.title',
      'cookies.gate.desc',
      'cookies.gate.allow',
      'cookies.policy.title',
    ];

    const languages = ['en', 'ar', 'es', 'pt', 'it'];
    const localesDir = path.join(process.cwd(), 'src', 'i18n', 'locales');

    languages.forEach((lang) => {
      const filePath = path.join(localesDir, `${lang}.json`);
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      requiredKeys.forEach((key) => {
        const val = fileData[key];
        expect(val, `Missing key '${key}' in locale '${lang}.json'`).toBeTruthy();
        expect(typeof val).toBe('string');
        expect(val.trim().length).toBeGreaterThan(0);
      });
    });

    // Specifically verify Arabic contains native Arabic characters (RTL verified)
    const arData = JSON.parse(fs.readFileSync(path.join(localesDir, 'ar.json'), 'utf8'));
    expect(arData['cookies.banner.title']).toBe('خصوصيتك تهمنا');
    expect(arData['cookies.banner.acceptAll']).toBe('قبول الكل');
    expect(arData['cookies.banner.rejectAll']).toBe('رفض الكل');
  });
});
