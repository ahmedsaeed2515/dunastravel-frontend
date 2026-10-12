import { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { JaiderChatProvider } from '../../context/JaiderChatContext';

const Footer = lazy(() => import('./Footer'));
const FloatingContact = lazy(() => import('./FloatingContact'));
const BackgroundMusic = lazy(() => import('../ui/BackgroundMusic'));
const FloatingGuideR = lazy(() => import('../ui/FloatingGuideR'));
const JaiderChatWindow = lazy(() => import('../ui/JaiderChatWindow'));

const Layout = () => {
  const [loadWidgets, setLoadWidgets] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timer;
    const enableWidgets = () => {
      setLoadWidgets(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', enableWidgets);
      window.removeEventListener('scroll', enableWidgets);
      window.removeEventListener('keydown', enableWidgets);
      window.removeEventListener('touchstart', enableWidgets);
      if (timer) clearTimeout(timer);
    };

    window.addEventListener('pointerdown', enableWidgets, { passive: true });
    window.addEventListener('scroll', enableWidgets, { passive: true });
    window.addEventListener('keydown', enableWidgets, { passive: true });
    window.addEventListener('touchstart', enableWidgets, { passive: true });

    timer = setTimeout(enableWidgets, 3500);

    return cleanup;
  }, []);

  // Global Scroll Reveal Observer for all pages
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px -20px 0px' }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll(
        '.reveal, .reveal-on-scroll, section:not(.no-reveal), .section-head, .grid-card-reveal'
      );

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          (rect.top < window.innerHeight && rect.bottom > 0) ||
          rect.height > window.innerHeight * 1.1
        ) {
          el.classList.add('in');
        } else {
          el.classList.add('reveal-on-scroll');
          observer.observe(el);
        }
      });
    };

    const timeoutId = setTimeout(observeElements, 120);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <JaiderChatProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold-300 border-t-gold-500 rounded-full animate-spin" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        {loadWidgets && (
          <Suspense fallback={null}>
            <FloatingContact />
            <BackgroundMusic />
            <FloatingGuideR />
            <JaiderChatWindow />
          </Suspense>
        )}
      </div>
    </JaiderChatProvider>
  );
};

export default Layout;
