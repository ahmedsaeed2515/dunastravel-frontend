import { describe, it, expect } from 'vitest';
import api, { resolveFullUrl, BASE_URL } from '../utils/api';
import ar from '../i18n/locales/ar.json';
import en from '../i18n/locales/en.json';
import es from '../i18n/locales/es.json';
import pt from '../i18n/locales/pt.json';
import itLocale from '../i18n/locales/it.json';

describe('GuideR Architecture & Resilience Tests', () => {
  it('exposes api.defaults.baseURL matching BASE_URL', () => {
    expect(api.defaults).toBeDefined();
    expect(api.defaults.baseURL).toBe(BASE_URL);
  });

  it('correctly resolves stream endpoint with resolveFullUrl', () => {
    const streamUrl = resolveFullUrl('/ai/chat/stream');
    expect(streamUrl).toBeDefined();
    expect(streamUrl).toContain('/ai/chat/stream');
    expect(streamUrl.startsWith('http://') || streamUrl.startsWith('https://') || streamUrl.startsWith('/api')).toBe(true);
  });

  it('guarantees 5-locale parity for VIP Concierge keys', () => {
    const requiredKeys = [
      'jaider.browseTours',
      'jaider.chatOnWhatsApp',
      'jaider.conciergeSubtitle',
      'jaider.conciergeTitle',
      'jaider.connecting',
      'jaider.retry',
    ];

    const locales = { ar, en, es, pt, it: itLocale };

    for (const [lang, dict] of Object.entries(locales)) {
      for (const key of requiredKeys) {
        expect(dict[key], `Missing translation for key "${key}" in locale "${lang}"`).toBeDefined();
        expect(dict[key].trim().length).toBeGreaterThan(0);
      }
    }
  });
});
