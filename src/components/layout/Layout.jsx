import { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileTabBar from './MobileTabBar';
import { JaiderChatProvider, useJaiderChat } from '../../context/JaiderChatContext';

const FloatingContact = lazy(() => import('./FloatingContact'));
const BackgroundMusic = lazy(() => import('../ui/BackgroundMusic'));
const FloatingGuideR = lazy(() => import('../ui/FloatingGuideR'));
const JaiderChatWindow = lazy(() => import('../ui/JaiderChatWindow'));

const ChatWindowWrapper = () => {
  const { isOpen } = useJaiderChat();
  if (!isOpen) return null;
  return (
    <Suspense fallback={null}>
      <JaiderChatWindow />
    </Suspense>
  );
};

const LayoutContent = () => {
  const [loadWidgets, setLoadWidgets] = useState(false);

  useEffect(() => {
    const load = () => setLoadWidgets(true);
    const events = ['scroll', 'touchstart', 'mousemove'];
    const onInteract = () => {
      load();
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true, once: true }));

    let idleId;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1800 });
    } else {
      const timer = setTimeout(load, 1500);
      return () => {
        events.forEach((e) => window.removeEventListener(e, onInteract));
        clearTimeout(timer);
      };
    }
    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-[calc(72px+env(safe-area-inset-bottom))] lg:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileTabBar />
      {loadWidgets && (
        <Suspense fallback={null}>
          <FloatingContact />
          <BackgroundMusic />
          <FloatingGuideR />
        </Suspense>
      )}
      <ChatWindowWrapper />
    </div>
  );
};

const Layout = () => {
  return (
    <JaiderChatProvider>
      <LayoutContent />
    </JaiderChatProvider>
  );
};

export default Layout;

