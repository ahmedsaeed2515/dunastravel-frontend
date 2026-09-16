/**
 * ConsentContext.jsx — React Context & Hooks for Cookie Consent
 * DUNAS TRAVEL Production Consent Architecture
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import consentManager from './ConsentManager';
import { CONSENT_CATEGORIES } from './consent.constants';

const ConsentContext = createContext(null);

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(() => consentManager.getConsent());
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isBannerDismissedManually, setIsBannerDismissedManually] = useState(false);

  // Subscribe to ConsentManager updates (including cross-tab sync)
  useEffect(() => {
    const unsubscribe = consentManager.subscribe((newState) => {
      setConsent(newState);
    });
    return unsubscribe;
  }, []);

  // Banner should display only if user hasn't answered yet and hasn't dismissed it manually
  const isBannerOpen = useMemo(() => {
    return consent.status === 'unanswered' && !isBannerDismissedManually;
  }, [consent.status, isBannerDismissedManually]);

  const openBanner = useCallback(() => {
    setIsBannerDismissedManually(false);
  }, []);

  const closeBanner = useCallback(() => {
    setIsBannerDismissedManually(true);
  }, []);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    consentManager.acceptAll('banner');
    setIsPreferencesOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    consentManager.rejectAll('banner');
    setIsPreferencesOpen(false);
  }, []);

  const savePreferences = useCallback((prefs) => {
    consentManager.savePreferences(prefs, 'preferences');
    setIsPreferencesOpen(false);
  }, []);

  const withdrawConsent = useCallback(() => {
    consentManager.withdrawConsent();
    setIsPreferencesOpen(false);
  }, []);

  const hasConsent = useCallback((category) => {
    return consentManager.hasConsent(category);
  }, [consent]);

  const value = useMemo(() => ({
    consent,
    hasConsent,
    isBannerOpen,
    isPreferencesOpen,
    openBanner,
    closeBanner,
    openPreferences,
    closePreferences,
    acceptAll,
    rejectAll,
    savePreferences,
    withdrawConsent,
    categories: CONSENT_CATEGORIES,
  }), [
    consent,
    hasConsent,
    isBannerOpen,
    isPreferencesOpen,
    openBanner,
    closeBanner,
    openPreferences,
    closePreferences,
    acceptAll,
    rejectAll,
    savePreferences,
    withdrawConsent,
  ]);

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    // Graceful fallback for components or tests mounted outside ConsentProvider
    return {
      consent: consentManager.getConsent(),
      hasConsent: (cat) => consentManager.hasConsent(cat),
      isBannerOpen: false,
      isPreferencesOpen: false,
      openBanner: () => {},
      closeBanner: () => {},
      openPreferences: () => {},
      closePreferences: () => {},
      acceptAll: () => consentManager.acceptAll('banner'),
      rejectAll: () => consentManager.rejectAll('banner'),
      savePreferences: (prefs) => consentManager.savePreferences(prefs, 'preferences'),
      withdrawConsent: () => consentManager.withdrawConsent(),
      categories: CONSENT_CATEGORIES,
    };
  }
  return ctx;
}

export default ConsentContext;
