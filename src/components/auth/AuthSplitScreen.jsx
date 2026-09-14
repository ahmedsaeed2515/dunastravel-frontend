import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaHeadset,
  FaWhatsapp,
} from 'react-icons/fa';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LanguageSelector from '../ui/LanguageSelector';

/**
 * Split-screen Luxury Authentication Page for Dunas Travel.
 * Features:
 * - 50/50 responsive split: interactive form on one half, cinematic visual hero on the other.
 * - Dynamic RTL / LTR layout mirroring.
 * - Country Flag language switcher with instant locale change.
 * - Tab switching between Sign In and Register.
 * - Floating glassmorphism luxury accolades and social proof stats.
 */
const AuthSplitScreen = ({ initialTab = 'login' }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  const isRtl = i18n.dir() === 'rtl';
  const BackArrow = isRtl ? FaArrowRight : FaArrowLeft;

  const handleSuccess = () => {
    const destination = location.state?.from || '/dashboard';
    navigate(destination, { replace: true });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#060D23] text-white selection:bg-gold-500/30 selection:text-gold-200 overflow-x-hidden font-body">
      <Helmet>
        <title>
          {activeTab === 'login'
            ? t('auth.loginTitle', 'Login | Dunas Travel')
            : t('auth.registerTitle', 'Register | Dunas Travel')}
        </title>
      </Helmet>

      {/* ========================================================================= */}
      {/* HALF 1: AUTH FORM PANEL                                                   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[50%] xl:w-[48%] 2xl:w-[44%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-gradient-to-b from-[#081330] via-[#060F26] to-[#040A1A] border-e border-gold-500/20 relative z-20">
        {/* Ambient Top Glow */}
        <div
          className="absolute top-0 start-1/4 w-72 h-40 bg-gold-500/10 blur-[90px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Navigation Bar inside Form */}
        <header className="flex items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-30">
          {/* Brand Logo */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 group transition-transform hover:scale-[1.02]"
            aria-label="Dunas Travel Home"
          >
            <img
              src="/dunas-travel-logo.webp"
              alt="Dunas Travel"
              width="150"
              height="60"
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-md"
            />
          </Link>

          {/* Action Utilities (Language Selector + Back to Home) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector with Country Flags */}
            <div className="relative">
              <LanguageSelector showFullLabel={true} />
            </div>

            {/* Back to Home Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ivory-300 hover:text-gold-400 py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/40 transition-all duration-200 select-none"
              title={t('nav.home', 'Home')}
            >
              <BackArrow size={11} className="text-gold-400" />
              <span className="hidden sm:inline">{t('nav.home', 'Home')}</span>
            </Link>
          </div>
        </header>

        {/* Central Content Area */}
        <main className="my-auto py-8 sm:py-10 max-w-lg w-full mx-auto relative z-20">
          {/* Welcoming Header */}
          <div className="text-start mb-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-[2px] text-gold-400 mb-2">
                ✦ DUNAS LUXURY ODYSSEYS ✦
              </span>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-display font-extrabold text-ivory-50 tracking-tight leading-tight">
                {activeTab === 'login'
                  ? t('auth.welcomeBack', 'Welcome Back')
                  : t('auth.createAccount', 'Create Your Account')}
              </h1>
              <p className="text-xs sm:text-sm text-ivory-300/80 mt-2 font-normal leading-relaxed">
                {activeTab === 'login'
                  ? t(
                      'auth.signInDesc',
                      'Sign in to access your bespoke luxury itineraries and reservations across Egypt & beyond.'
                    )
                  : t(
                      'auth.registerDesc',
                      'Join Dunas Travel to curate and unlock exclusive, private journeys across ancient wonders.'
                    )}
              </p>
            </motion.div>

            {/* Segmented Tab Switcher */}
            <div
              role="tablist"
              aria-label={t('auth.authenticationTabs', 'Authentication options')}
              className="mt-6 flex p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md"
            >
              <button
                type="button"
                role="tab"
                id="tab-login"
                aria-selected={activeTab === 'login'}
                aria-controls="panel-login"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 relative cursor-pointer ${
                  activeTab === 'login'
                    ? 'text-obsidian-950 font-extrabold shadow-lg shadow-gold-500/20'
                    : 'text-ivory-300 hover:text-white'
                }`}
              >
                {activeTab === 'login' && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {t('auth.loginButton', 'Sign In')}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-register"
                aria-selected={activeTab === 'register'}
                aria-controls="panel-register"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 relative cursor-pointer ${
                  activeTab === 'register'
                    ? 'text-obsidian-950 font-extrabold shadow-lg shadow-gold-500/20'
                    : 'text-ivory-300 hover:text-white'
                }`}
              >
                {activeTab === 'register' && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {t('auth.createAccount', 'Register')}
                </span>
              </button>
            </div>
          </div>

          {/* Form Panes */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login-form-panel"
                  role="tabpanel"
                  id="panel-login"
                  aria-labelledby="tab-login"
                  initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? -15 : 15 }}
                  transition={{ duration: 0.25 }}
                >
                  <LoginForm
                    onSuccess={handleSuccess}
                    onSwitchToRegister={() => setActiveTab('register')}
                    onForgotPassword={handleForgotPassword}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register-form-panel"
                  role="tabpanel"
                  id="panel-register"
                  aria-labelledby="tab-register"
                  initial={{ opacity: 0, x: isRtl ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 15 : -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <RegisterForm
                    onSuccess={handleSuccess}
                    onSwitchToLogin={() => setActiveTab('login')}
                    onTermsClick={() => {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer Note & VIP Concierge Support */}
        <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ivory-400/80 relative z-20">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-gold-400" size={13} />
            <span>256-bit SSL Encrypted & Secure</span>
          </div>

          <a
            href="https://wa.me/201149401111"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
          >
            <FaWhatsapp size={13} className="text-[#25D366]" />
            <span>VIP Concierge Support</span>
          </a>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* HALF 2: CINEMATIC VISUAL HERO PANEL (Hidden on mobile, visible on desktop) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] 2xl:w-[56%] min-h-screen relative overflow-hidden flex-col justify-between p-12 xl:p-16 select-none bg-black">
        {/* Cinematic Background Image with Subtle Breathing Zoom Animation */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/Egypt_Pyramids_Images/pharaonic_elite_masterpiece_1_1789238725107.jpg')`,
          }}
        />

        {/* Luxury Obsidian Gradient Vignette Overlays */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: isRtl
              ? 'linear-gradient(270deg, rgba(6, 13, 35, 0.94) 0%, rgba(6, 13, 35, 0.4) 45%, rgba(6, 13, 35, 0.75) 100%)'
              : 'linear-gradient(90deg, rgba(6, 13, 35, 0.94) 0%, rgba(6, 13, 35, 0.4) 45%, rgba(6, 13, 35, 0.75) 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#040A1A] via-transparent to-[#040A1A]/70"
        />

        {/* Ambient Golden Dust Particles / Glow Orbs */}
        <div
          className="absolute top-1/4 end-10 w-96 h-96 bg-gold-500/15 rounded-full blur-[120px] pointer-events-none z-10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 start-10 w-72 h-72 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Top Eyebrow Tag */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-black/40 backdrop-blur-md border border-gold-500/30 text-[11px] font-bold text-gold-300 uppercase tracking-widest shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
            <span>Exclusive Access</span>
          </div>

          <div className="flex items-center gap-1 text-gold-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={13} className="fill-gold-400 drop-shadow" />
            ))}
            <span className="ms-1.5 font-bold text-white text-xs">5.0</span>
          </div>
        </div>

        {/* Center Brand Statement & Traveler Accolade Card */}
        <div className="relative z-20 my-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Inspiring Headline */}
            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              {isRtl ? (
                <>
                  رحلتك الاستثنائية إلى{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                    أرض الفراعنة
                  </span>{' '}
                  تبدأ هنا.
                </>
              ) : (
                <>
                  Your Timeless Odyssey Across{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                    Ancient Egypt
                  </span>{' '}
                  Begins Here.
                </>
              )}
            </h2>

            {/* Traveler Quote Glassmorphism Card */}
            <div className="p-6 rounded-3xl bg-black/45 backdrop-blur-xl border border-gold-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 start-0 w-1.5 h-full bg-gradient-to-b from-gold-400 to-amber-600" />
              <p className="text-sm xl:text-base text-ivory-100 font-medium italic leading-relaxed">
                {isRtl
                  ? '«تجربة لا تُضاهى بكل المقاييس. الدخول الخاص للأهرامات فجراً والاهتمام الدقيق بكل تفصيلة جعلت الرحلة سحراً حقيقياً لن ننساه.»'
                  : '"An extraordinary bespoke journey beyond imagination. Private sunrise access to the Pyramids and unmatched concierge attention made it truly unforgettable."'}
              </p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="font-bold text-gold-300">
                  {isRtl ? 'الليدي إليانور س. — رحلة القاهرة والأقصر' : 'Lady Eleanor S. — Cairo & Nile Private Odyssey'}
                </span>
                <span className="text-ivory-400/80">Verified Traveler</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Social Proof Stats Bar */}
        <div className="relative z-20 pt-6 border-t border-white/15">
          <div className="grid grid-cols-3 gap-4 text-start">
            <div className="space-y-1">
              <span className="block text-2xl xl:text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">
                50,000+
              </span>
              <span className="block text-[11px] text-ivory-300 font-medium">
                {isRtl ? 'مسافر نخبوي حول العالم' : 'Discerning Global Travelers'}
              </span>
            </div>

            <div className="space-y-1 border-s border-white/15 ps-4">
              <span className="block text-2xl xl:text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">
                99.4%
              </span>
              <span className="block text-[11px] text-ivory-300 font-medium">
                {isRtl ? 'معدل التميز والرضا' : 'Excellence Satisfaction'}
              </span>
            </div>

            <div className="space-y-1 border-s border-white/15 ps-4">
              <span className="block text-2xl xl:text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">
                24/7
              </span>
              <span className="block text-[11px] text-ivory-300 font-medium">
                {isRtl ? 'كونسيرج خاص VIP' : 'Bespoke VIP Concierge'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitScreen;
