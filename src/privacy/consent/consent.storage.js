/**
 * consent.storage.js — Secure, Deterministic Storage for Cookie Consent
 * DUNAS TRAVEL Production Consent Architecture
 */

import { CONSENT_STORAGE_KEY, CONSENT_VERSION, DEFAULT_CONSENT_STATE } from './consent.constants';

// In-memory fallback for environments with blocked/failing localStorage (private mode, sandboxed iframes)
let memoryStore = null;

/**
 * Checks if window.localStorage is accessible and functional
 */
function isLocalStorageAvailable() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__dunas_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates whether a parsed object conforms to the expected ConsentState schema
 */
export function isValidConsentRecord(record) {
  if (!record || typeof record !== 'object') return false;
  if (record.consentVersion !== CONSENT_VERSION) return false;
  if (typeof record.necessary !== 'boolean' || !record.necessary) return false;
  if (typeof record.preferences !== 'boolean') return false;
  if (typeof record.analytics !== 'boolean') return false;
  if (typeof record.marketing !== 'boolean') return false;
  return true;
}

/**
 * Reads persistent consent from localStorage or in-memory fallback
 * @returns {object|null} valid consent object or null if unconsented or version-outdated
 */
export function readStoredConsent() {
  try {
    let raw = null;
    if (isLocalStorageAvailable()) {
      raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    } else {
      raw = memoryStore;
    }

    if (!raw) return null;

    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (isValidConsentRecord(parsed)) {
      return parsed;
    }

    // Invalid schema or outdated version -> user must re-consent
    return null;
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[ConsentStorage] Failed to read stored consent:', err);
    }
    return null;
  }
}

/**
 * Writes consent record persistently
 * @param {object} consentData 
 * @returns {boolean} true if write succeeded
 */
export function writeStoredConsent(consentData) {
  const payload = {
    necessary: true, // Always true
    preferences: Boolean(consentData.preferences),
    analytics: Boolean(consentData.analytics),
    marketing: Boolean(consentData.marketing),
    consentVersion: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    status: consentData.status || 'custom',
    source: consentData.source || 'banner',
  };

  try {
    const serialized = JSON.stringify(payload);
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
    } else {
      memoryStore = serialized;
    }
    return true;
  } catch (err) {
    memoryStore = payload;
    if (import.meta.env?.DEV) {
      console.warn('[ConsentStorage] Failed to write consent to localStorage (using memory fallback):', err);
    }
    return false;
  }
}

/**
 * Clears stored consent (for testing or complete reset)
 */
export function clearStoredConsent() {
  try {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
    memoryStore = null;
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[ConsentStorage] Failed to clear consent:', err);
    }
  }
}

/**
 * Sets up multi-tab synchronization via standard window 'storage' events
 * @param {function} onSyncCallback 
 * @returns {function} cleanup unbind function
 */
export function subscribeToCrossTabSync(onSyncCallback) {
  if (typeof window === 'undefined') return () => {};

  const handleStorageEvent = (event) => {
    if (event.key === CONSENT_STORAGE_KEY) {
      try {
        if (!event.newValue) {
          onSyncCallback(DEFAULT_CONSENT_STATE);
          return;
        }
        const parsed = JSON.parse(event.newValue);
        if (isValidConsentRecord(parsed)) {
          onSyncCallback(parsed);
        }
      } catch (err) {
        if (import.meta.env?.DEV) {
          console.warn('[ConsentStorage] Error processing cross-tab consent event:', err);
        }
      }
    }
  };

  window.addEventListener('storage', handleStorageEvent);
  return () => window.removeEventListener('storage', handleStorageEvent);
}
