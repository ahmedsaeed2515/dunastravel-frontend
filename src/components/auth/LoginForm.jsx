import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthFormField from './AuthFormField';

const LoginForm = ({ onSuccess, onSwitchToRegister, onForgotPassword }) => {
  const { t } = useTranslation();
  const { login, resendVerification } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(t('auth.allFieldsRequired', 'All fields are required'));
      return;
    }

    setError('');
    setResendSuccess('');
    setShowResendBtn(false);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      const msg = err?.message || '';
      const status = err?.status;
      if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('verification')) {
        setError(t('auth.unverifiedEmailError', 'Please verify your email before logging in.'));
        setShowResendBtn(true);
      } else if (status === 401 || msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password')) {
        setError(t('auth.invalidCredentials', 'Invalid email or password. Please try again.'));
      } else {
        setError(msg || t('common.errorOccurred', 'An error occurred. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) return;
    setIsResending(true);
    setError('');
    try {
      await resendVerification(email.trim());
      setResendSuccess(t('auth.verificationResent', 'Verification email sent! Please check your inbox.'));
      setShowResendBtn(false);
    } catch (err) {
      setError(err?.message || t('auth.resendFailed', 'Failed to resend verification email'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-start" noValidate={false}>
      {/* Error / Alert banner */}
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
            <div className="flex-1">
              <p>{error}</p>
              {showResendBtn && (
                <div className="mt-2 pt-2 border-t border-red-500/30">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-bold rounded-lg text-xs transition"
                  >
                    {isResending ? t('common.loading', 'Sending...') : t('auth.resendCode', 'Resend Code')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resend Success banner */}
      <AnimatePresence>
        {resendSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs text-center font-medium"
          >
            {resendSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <AuthFormField
        id="login-email"
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

      {/* Password Field */}
      <AuthFormField
        id="login-password"
        name="password"
        label={t('auth.password', 'Password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••••••"
        icon={FaLock}
        required
        autoComplete="current-password"
        disabled={isLoading}
      />

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between text-xs my-3 text-ivory-300">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500 accent-gold-500 cursor-pointer"
          />
          <span>{t('auth.rememberMe', 'Remember me')}</span>
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-gold-400 hover:text-gold-300 hover:underline font-medium transition-colors"
        >
          {t('auth.forgotPassword', 'Forgot Password?')}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email.trim() || !password}
        className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold uppercase tracking-[1.5px] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #F5A623 0%, #C07D0A 100%)',
          color: '#0C1C48',
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#0C1C48] border-t-transparent rounded-full animate-spin" />
            <span>{t('auth.authenticating', 'Authenticating...')}</span>
          </div>
        ) : (
          <span>{t('auth.loginButton', 'Sign In')}</span>
        )}
      </button>

      {/* Prominent Create Account Section */}
      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-xs text-ivory-300/80 mb-2.5">
          {t('auth.noAccountYet', "Don't have an account yet?")}
        </p>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="w-full py-3 px-4 rounded-xl border border-gold-500/50 bg-gradient-to-r from-gold-500/10 via-gold-500/15 to-gold-500/10 hover:from-gold-500/20 hover:to-gold-500/25 font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-gold-500/20 hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
          style={{ color: '#FFFFFF' }}
        >
          <span style={{ color: '#FFFFFF' }}>✦</span>
          <span style={{ color: '#FFFFFF' }}>{t('auth.createAccountHighlight', 'Create a New Account')}</span>
          <span style={{ color: '#FFFFFF' }}>✦</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
