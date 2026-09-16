import React from 'react';
import HomeHeroSection from '../components/home/HomeHeroSection';
import HomeExperienceSection from '../components/home/HomeExperienceSection';

/**
 * Route-level composition for the home experience.
 * The critical above-the-fold Hero renders synchronously for instant LCP.
 * Below-the-fold experience renders with native CSS content-visibility,
 * keeping the entire DOM, anchors, and React component tree fully mounted, crawlable, and accessible.
 */
export default function Home() {
  return (
    <>
      <HomeHeroSection />
      <HomeExperienceSection />
    </>
  );
}
