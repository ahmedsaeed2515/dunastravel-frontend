import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShieldAlt, FaStar, FaUserCheck, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function ReviewAuthModal({ isOpen, onClose, returnUrl }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const targetReturnUrl = returnUrl || (typeof window !== 'undefined' ? (window.location.pathname + window.location.search + '#reviews') : '/');
  const encodedReturnUrl = encodeURIComponent(targetReturnUrl);

  const handleSignIn = () => {
    onClose();
    navigate(`/login?returnUrl=${encodedReturnUrl}`);
  };

  const handleRegister = () => {
    onClose();
    navigate(`/register?returnUrl=${encodedReturnUrl}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-auth-title"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-3xl border border-amber-400/30 bg-[#070E22]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-white z-10 overflow-hidden"
          >
            {/* Ambient Gold Glow */}
            <div
              className="absolute -top-16 -right-16 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-16 -left-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 end-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Header Icon & Title */}
            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-300/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                <FaStar className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 id="review-auth-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t('reviews.authModalTitle', 'Share Your Luxury Experience')}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                {t(
                  'reviews.authModalDesc',
                  'To ensure the authenticity and integrity of our traveler community, please sign in or create an account to submit your review.'
                )}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80">
              <div className="flex items-center gap-2.5">
                <FaShieldAlt className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('reviews.verifiedTraveler', 'Verified Traveler')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaUserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('reviews.oneReviewPerTraveler', 'One verified review per traveler')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-200 cursor-pointer"
              >
                <FaSignInAlt className="w-3.5 h-3.5" />
                <span>{t('reviews.authModalSignIn', 'Sign In to Review')}</span>
              </button>

              <button
                type="button"
                onClick={handleRegister}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-amber-400/40 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                <FaUserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('reviews.authModalCreateAccount', 'Create an Account')}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer"
              >
                {t('reviews.authModalCancel', 'Continue Browsing')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
