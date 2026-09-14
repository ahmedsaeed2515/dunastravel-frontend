import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaExclamationCircle, FaCheckCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthFormField from './AuthFormField';

const ForgotPasswordForm = ({ onSwitchToLogin, onSwitchToRegister }) => {
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
    <div className="w-full text-start">
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5"
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
            className="mb-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs text-center space-y-2"
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
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold uppercase tracking-[1.5px] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-ivory-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            {t('auth.tryAnotherEmail', 'Try another email address')}
          </button>
        </div>
      )}

      {/* Back to sign in link */}
      <div className="mt-6 text-center border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs font-bold transition-colors cursor-pointer"
        >
          <BackArrowIcon size={11} />
          <span>{t('auth.backToSignIn', 'Back to Sign In')}</span>
        </button>
      </div>

      {/* Prominent Create Account Highlight */}
      <div className="mt-4 pt-4 text-center">
        <p className="text-xs text-ivory-300/80 mb-2.5">
          {t('auth.noAccountYet', "Don't have an account yet?")}
        </p>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="w-full py-3 px-4 rounded-xl border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-500/15 hover:scale-[1.01] cursor-pointer"
        >
          ✦ {t('auth.createAccount', 'Create Account')} ✦
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
