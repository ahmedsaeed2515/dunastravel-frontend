import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaKey, FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthFormField from '../../components/auth/AuthFormField';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const BackArrowIcon = isRtl ? FaArrowRight : FaArrowLeft;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t('auth.allFieldsRequired', 'All fields are required'));
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await forgotPassword(email.trim());
      setSuccess(
        t(
          'auth.forgotPasswordSuccess',
          "If an account exists with this email address, we've sent password reset instructions to your inbox."
        )
      );
    } catch (err) {
      setError(err?.message || t('common.errorOccurred', 'Failed to request password reset'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-[#060D23] via-[#0A183D] to-[#040917] flex items-center justify-center px-4 font-body">
      <Helmet>
        <title>{t('auth.forgotPasswordTitle', 'Forgot Password | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-gradient-to-b from-[#091535] to-[#060D23] border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative text-white text-start">
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(245,166,35,0.35)]">
            <FaKey size={22} className="text-[#0C1C48]" />
          </div>
          <h1 className="text-2xl font-display font-bold text-ivory-50 tracking-tight">
            {t('auth.forgotPassword', 'Forgot Password?')}
          </h1>
          <p className="text-xs text-ivory-300 mt-1">
            {t('auth.forgotPasswordDesc', 'Enter your email address and we will send you instructions to reset your password.')}
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5"
              role="alert"
            >
              <FaExclamationCircle className="text-red-400 mt-0.5 shrink-0" size={14} />
              <p className="flex-1">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Alert */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs text-center space-y-2"
            >
              <div className="flex justify-center mb-1">
                <FaCheckCircle className="text-emerald-400" size={24} />
              </div>
              <p className="font-semibold text-sm text-emerald-300">
                {t('auth.checkYourEmail', 'Check Your Email')}
              </p>
              <p className="text-ivory-300 leading-relaxed">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthFormField
              id="forgot-email"
              name="email"
              label={t('auth.emailAddress', 'Email Address')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.yourEmail', 'name@example.com')}
              icon={FaEnvelope}
              required
              autoComplete="email"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-[1.5px] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #F5A623 0%, #C07D0A 100%)',
                color: '#0C1C48',
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0C1C48] border-t-transparent rounded-full animate-spin" />
                  <span>{t('common.loading', 'Sending Link...')}</span>
                </div>
              ) : (
                <span>{t('auth.sendResetLink', 'Send Reset Link')}</span>
              )}
            </button>
          </form>
        ) : (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSuccess('');
                setEmail('');
              }}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-ivory-200 text-xs font-semibold transition-colors"
            >
              {t('auth.tryAnotherEmail', 'Try another email address')}
            </button>
          </div>
        )}

        {/* Back to sign in link */}
        <div className="mt-7 text-center border-t border-white/10 pt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs font-bold transition-colors"
          >
            <BackArrowIcon size={11} />
            <span>{t('auth.backToSignIn', 'Back to Sign In')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
