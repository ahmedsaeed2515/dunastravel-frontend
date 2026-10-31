import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getOrCreateGuestToken, clearCsrfToken, apiRequest } from '../utils/api';

describe('Guest Token Storage Security & Zero-LocalStorage Enforcement', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearCsrfToken();
    vi.restoreAllMocks();
  });

  it('stores new guest tokens in sessionStorage and never in localStorage', () => {
    const token = getOrCreateGuestToken();
    expect(token).toBeTruthy();
    expect(sessionStorage.getItem('dunas_guest_token')).toBe(token);
    expect(localStorage.getItem('dunas_guest_token')).toBeNull();
  });

  it('migrates legacy localStorage guest token to sessionStorage and wipes it from localStorage', () => {
    localStorage.setItem('dunas_guest_token', 'legacy_token_123');
    const token = getOrCreateGuestToken();
    expect(token).toBe('legacy_token_123');
    expect(sessionStorage.getItem('dunas_guest_token')).toBe('legacy_token_123');
    expect(localStorage.getItem('dunas_guest_token')).toBeNull();
  });

  it('clears guest token on clearCsrfToken() call', () => {
    getOrCreateGuestToken();
    expect(sessionStorage.getItem('dunas_guest_token')).toBeTruthy();

    clearCsrfToken();
    expect(sessionStorage.getItem('dunas_guest_token')).toBeNull();
    expect(localStorage.getItem('dunas_guest_token')).toBeNull();
  });

  it('does not attach x-guest-token header to third-party external origins', async () => {
    const token = getOrCreateGuestToken();
    let capturedHeaders = null;
    global.fetch = vi.fn().mockImplementation((url, init) => {
      capturedHeaders = init?.headers;
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, data: { ok: true } }),
      });
    });

    // Request to third-party external domain
    await apiRequest('https://external-service.com/api/data');
    expect(capturedHeaders?.['x-guest-token']).toBeUndefined();

    // Request to internal API path
    await apiRequest('/tours');
    expect(capturedHeaders?.['x-guest-token']).toBe(token);
  });
});
