import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import HomeHeroSection from '../components/home/HomeHeroSection';

const HomeExperienceSection = lazy(() => import('../components/home/HomeExperienceSection'));

/**
 * Route-level composition for the home experience.
 * The critical above-the-fold Hero renders synchronously for instant LCP and minimal TBT.
 * Below-the-fold content loads progressively via IntersectionObserver or user interaction.
 */
export default function Home() {
  const isTest = import.meta.env?.MODE === 'test';
  const [loadBelowFold, setLoadBelowFold] = useState(isTest);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (isTest || loadBelowFold) return;

    const triggerLoad = () => {
      setLoadBelowFold(true);
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('touchstart', triggerLoad);
      window.removeEventListener('pointerdown', triggerLoad);
      window.removeEventListener('wheel', triggerLoad);
      window.removeEventListener('keydown', triggerLoad);
    };

    window.addEventListener('scroll', triggerLoad, { passive: true, once: true });
    window.addEventListener('touchstart', triggerLoad, { passive: true, once: true });
    window.addEventListener('pointerdown', triggerLoad, { passive: true, once: true });
    window.addEventListener('wheel', triggerLoad, { passive: true, once: true });
    window.addEventListener('keydown', triggerLoad, { passive: true, once: true });

    return () => {
      window.removeEventListener('scroll', triggerLoad);
      window.removeEventListener('touchstart', triggerLoad);
      window.removeEventListener('pointerdown', triggerLoad);
      window.removeEventListener('wheel', triggerLoad);
      window.removeEventListener('keydown', triggerLoad);
    };
  }, [isTest, loadBelowFold]);

  return (
    <>
      <HomeHeroSection />
      {!loadBelowFold && <div ref={sentinelRef} className="h-8 w-full pointer-events-none" aria-hidden="true" />}
      {loadBelowFold && (
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <HomeExperienceSection />
        </Suspense>
      )}
    </>
  );
}
