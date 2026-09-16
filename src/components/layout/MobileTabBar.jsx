import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaCompass, FaBookmark, FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function MobileTabBar({ onNotificationClick }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const pathname = location.pathname;
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return undefined;
    }

    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/in-app-notifications?limit=1');
        if (isMounted && res && typeof res.unreadCount === 'number') {
          setUnreadCount(res.unreadCount);
        }
      } catch {
        // quiet error on mobile poll
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const tabs = [
    {
      id: 'home',
      label: t('nav.home', 'Home'),
      to: '/',
      icon: FaHome,
      isActive: pathname === '/',
    },
    {
      id: 'tours',
      label: t('nav.tours', 'Tours'),
      to: '/tours',
      icon: FaCompass,
      isActive:
        pathname.startsWith('/tours') ||
        pathname.startsWith('/destinations') ||
        pathname.startsWith('/programs'),
    },
    {
      id: 'bookings',
      label: t('nav.myBookings', 'Bookings'),
      to: user ? '/bookings' : '/login',
      state: user ? undefined : { from: '/bookings' },
      icon: FaBookmark,
      isActive: pathname.startsWith('/bookings'),
    },
    {
      id: 'notifications',
      label: t('nav.notifications', 'Alerts'),
      to: user ? '/notifications' : '/login',
      state: user ? undefined : { from: '/notifications' },
      icon: FaBell,
      badge: unreadCount,
      isActive: pathname.startsWith('/notifications'),
      onClick: onNotificationClick,
    },
    {
      id: 'profile',
      label: t('nav.profile', 'Profile'),
      to: user ? '/dashboard' : '/login',
      state: user ? undefined : { from: '/dashboard' },
      icon: FaUserCircle,
      isActive: pathname.startsWith('/dashboard') || pathname.startsWith('/profile'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[9990] bg-obsidian-950/95 dark:bg-obsidian-950/95 backdrop-blur-xl border-t border-gold-500/25 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-[58px] px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <Link
              key={tab.id}
              to={tab.to}
              state={tab.state}
              onClick={tab.onClick}
              aria-label={tab.label}
              className={`relative flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 px-1 transition-all duration-200 select-none group outline-none ${
                active ? 'text-gold-400 font-semibold' : 'text-ivory-400/80 hover:text-ivory-200'
              }`}
            >
              {active && (
                <span className="absolute top-0 w-8 h-[2.5px] bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 rounded-full shadow-[0_0_8px_rgba(245,166,35,0.7)]" />
              )}

              <div className="relative mt-0.5 mb-1 flex items-center justify-center">
                <Icon
                  size={19}
                  className={`transition-transform duration-200 ${
                    active ? 'scale-110 text-gold-400 drop-shadow-[0_0_6px_rgba(245,166,35,0.5)]' : 'group-hover:scale-105'
                  }`}
                />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-amber-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border border-obsidian-950 shadow-sm animate-pulse">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium tracking-tight truncate max-w-[64px] transition-colors ${
                  active ? 'text-gold-400 font-semibold' : 'text-ivory-400/80'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
