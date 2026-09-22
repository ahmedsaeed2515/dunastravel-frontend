import { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { JaiderChatProvider } from '../../context/JaiderChatContext';

const Footer = lazy(() => import('./Footer'));
const FloatingContact = lazy(() => import('./FloatingContact'));
const BackgroundMusic = lazy(() => import('../ui/BackgroundMusic'));
const FloatingGuideR = lazy(() => import('../ui/FloatingGuideR'));
const JaiderChatWindow = lazy(() => import('../ui/JaiderChatWindow'));

const Layout = () => {
  const [loadWidgets, setLoadWidgets] = useState(false);

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

  return (
    <JaiderChatProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
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
