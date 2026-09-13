import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } },
};

const modalCardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 26, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 12,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Lock body scroll with scrollbar width compensation & manage focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    // Compensate for scrollbar shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Keyboard handlers: Escape key and Focus trap
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus within modal
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const firstInput = modalRef.current.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;

      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleForgotPassword = useCallback(() => {
    onClose();
    navigate('/forgot-password');
  }, [onClose, navigate]);

  const handleTermsClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          {/* Card Container */}
          <motion.div
            ref={modalRef}
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg my-auto relative flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[min(90dvh,750px)] rounded-3xl overflow-hidden cursor-default border border-gold-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#0A183D] via-[#091535] to-[#060D23] text-white"
          >
            {/* Pinned Sticky Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close', 'Close')}
              className="absolute top-4 inset-inline-end-4 z-30 p-2 rounded-full text-ivory-300 hover:text-gold-400 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            {/* Pinned Header (Never scrolled out of view) */}
            <div className="pt-6 sm:pt-7 px-6 sm:px-8 pb-3 shrink-0 text-center border-b border-white/10 relative">
              {/* Gold light ambient glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-gold-500/15 blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Logo */}
              <div className="flex justify-center mb-3">
                <img
                  src="/dunas-travel-logo.webp"
                  alt="Dunas Travel"
                  width="160"
                  height="79"
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
                />
              </div>

              {/* Title & Subtitle */}
              <h2
                id="auth-modal-title"
                className="text-xl sm:text-2xl font-display font-bold text-ivory-50 tracking-tight"
              >
                {activeTab === 'login'
                  ? t('auth.welcomeTitle', 'Welcome Back')
                  : t('auth.createAccountTitle', 'Create Account')}
              </h2>
              <p className="text-xs text-gold-300/90 mt-1 font-medium">
                {activeTab === 'login'
                  ? t('auth.signInSubtitle', 'Sign in to access your bespoke journeys')
                  : t('auth.registerSubtitle', 'Join us to begin your journey across Egypt & beyond')}
              </p>

              {/* Segmented Tab Controls */}
              <div
                role="tablist"
                aria-label={t('auth.authenticationTabs', 'Authentication options')}
                className="mt-4 flex p-1 rounded-2xl bg-black/40 border border-white/10 max-w-xs mx-auto"
              >
                <button
                  type="button"
                  role="tab"
                  id="auth-tab-login"
                  aria-selected={activeTab === 'login'}
                  aria-controls="auth-panel-login"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md font-extrabold'
                      : 'text-ivory-300 hover:text-white'
                  }`}
                >
                  {t('auth.logInTab', 'Sign In')}
                </button>
                <button
                  type="button"
                  role="tab"
                  id="auth-tab-register"
                  aria-selected={activeTab === 'register'}
                  aria-controls="auth-panel-register"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md font-extrabold'
                      : 'text-ivory-300 hover:text-white'
                  }`}
                >
                  {t('auth.registerTab', 'Register')}
                </button>
              </div>
            </div>

            {/* Internal Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-5 text-start scroll-smooth">
              <div
                role="tabpanel"
                id={`auth-panel-${activeTab}`}
                aria-labelledby={`auth-tab-${activeTab}`}
              >
                {activeTab === 'login' ? (
                  <LoginForm
                    onSuccess={onClose}
                    onSwitchToRegister={() => setActiveTab('register')}
                    onForgotPassword={handleForgotPassword}
                  />
                ) : (
                  <RegisterForm
                    onSuccess={onClose}
                    onSwitchToLogin={() => setActiveTab('login')}
                    onTermsClick={handleTermsClick}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuthModal;
