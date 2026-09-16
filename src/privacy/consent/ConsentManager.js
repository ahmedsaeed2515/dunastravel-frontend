/**
 * ConsentManager.js — Centralized Consent Coordinator & Runtime Gating Engine
 * DUNAS TRAVEL Production Consent Architecture
 */

import {
  CONSENT_CATEGORIES,
  CONSENT_VERSION,
  DEFAULT_CONSENT_STATE,
} from './consent.constants';
import {
  readStoredConsent,
  writeStoredConsent,
  clearStoredConsent,
  subscribeToCrossTabSync,
} from './consent.storage';

class ConsentManager {
  constructor() {
    this.listeners = new Set();
    this.state = DEFAULT_CONSENT_STATE;

    if (typeof window !== 'undefined') {
      // 1. Initialize Google Consent Mode v2 defaults (Deny all non-essential until consent)
      this.initGoogleConsentModeDefault();

      // 2. Hydrate from persistent storage if valid choice exists
      const stored = readStoredConsent();
      if (stored) {
        this.state = Object.freeze({ ...stored });
        // Immediately notify Google tags if user already granted consent in a prior session
        this.updateGoogleConsentMode(this.state);
      }

      // 3. Listen for cross-tab synchronization
      subscribeToCrossTabSync((syncedState) => {
        this.syncState(syncedState);
      });
    }
  }

  /**
   * Initializes Google Consent Mode v2 with strictly denied defaults
   */
  initGoogleConsentModeDefault() {
    try {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
      }

      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      });
    } catch (err) {
      if (import.meta.env?.DEV) {
        console.warn('[ConsentManager] GCM default error:', err);
      }
    }
  }

  /**
   * Updates Google Consent Mode v2 with current user granted/denied categories
   */
  updateGoogleConsentMode(state) {
    try {
      if (typeof window === 'undefined') return;
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };
      }

      window.gtag('consent', 'update', {
        analytics_storage: state.analytics ? 'granted' : 'denied',
        ad_storage: state.marketing ? 'granted' : 'denied',
        ad_user_data: state.marketing ? 'granted' : 'denied',
        ad_personalization: state.marketing ? 'granted' : 'denied',
      });
    } catch (err) {
      if (import.meta.env?.DEV) {
        console.warn('[ConsentManager] GCM update error:', err);
      }
    }
  }

  /**
   * Returns an immutable copy of the current consent state
   */
  getConsent() {
    return this.state;
  }

  /**
   * Instant boolean check: Is the requested category permitted?
   * Necessary is ALWAYS true.
   */
  hasConsent(category) {
    if (!category || category === CONSENT_CATEGORIES.NECESSARY) return true;
    return Boolean(this.state[category]);
  }

  /**
   * Checks if user has made an explicit choice
   */
  hasAnswered() {
    return this.state.status !== 'unanswered' && Boolean(this.state.timestamp);
  }

  /**
   * Subscribes a listener to consent state changes
   * @param {function(state): void} callback 
   * @returns {function(): void} unsubscribe
   */
  subscribe(callback) {
    if (typeof callback !== 'function') return () => {};
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notifies all registered listeners of a state change
   */
  notify(previousState) {
    const currentState = this.state;
    this.listeners.forEach((callback) => {
      try {
        callback(currentState, previousState);
      } catch (err) {
        console.error('[ConsentManager] Listener error:', err);
      }
    });
  }

  /**
   * Cleans up storage/cookies when categories are revoked or rejected
   */
  cleanupRevokedTechnologies(currentState, previousState) {
    if (typeof window === 'undefined') return;

    // If analytics was revoked: clean up first-party analytics session
    if (previousState && previousState.analytics && !currentState.analytics) {
      try {
        window.localStorage.removeItem('dunas_analytics_sid');
      } catch {}
    }
  }

  /**
   * Commits and broadcasts a new consent state
   */
  commitState(newState, source = 'banner') {
    const previousState = this.state;
    const resolved = Object.freeze({
      necessary: true,
      preferences: Boolean(newState.preferences),
      analytics: Boolean(newState.analytics),
      marketing: Boolean(newState.marketing),
      consentVersion: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      status: newState.status || 'custom',
      source,
    });

    this.state = resolved;
    writeStoredConsent(resolved);
    this.updateGoogleConsentMode(resolved);
    this.cleanupRevokedTechnologies(resolved, previousState);
    this.notify(previousState);
    return resolved;
  }

  /**
   * Accept all categories
   */
  acceptAll(source = 'banner') {
    return this.commitState(
      {
        necessary: true,
        preferences: true,
        analytics: true,
        marketing: true,
        status: 'accepted_all',
      },
      source
    );
  }

  /**
   * Reject all non-essential categories
   */
  rejectAll(source = 'banner') {
    return this.commitState(
      {
        necessary: true,
        preferences: false,
        analytics: false,
        marketing: false,
        status: 'rejected_all',
      },
      source
    );
  }

  /**
   * Save customized granular preferences
   */
  savePreferences(prefs, source = 'preferences') {
    return this.commitState(
      {
        necessary: true,
        preferences: Boolean(prefs.preferences),
        analytics: Boolean(prefs.analytics),
        marketing: Boolean(prefs.marketing),
        status: 'custom',
      },
      source
    );
  }

  /**
   * Complete withdrawal of non-essential consent
   */
  withdrawConsent() {
    return this.rejectAll('preferences');
  }

  /**
   * Synchronizes state from an external tab without re-writing to storage
   */
  syncState(syncedState) {
    const previousState = this.state;
    this.state = Object.freeze({ ...syncedState });
    this.updateGoogleConsentMode(this.state);
    this.cleanupRevokedTechnologies(this.state, previousState);
    this.notify(previousState);
  }
}

// Export singleton instance
export const consentManager = new ConsentManager();
export default consentManager;
