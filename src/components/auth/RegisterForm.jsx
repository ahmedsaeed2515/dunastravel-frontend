import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthFormField from './AuthFormField';
import PasswordStrengthMeter, { calculatePasswordStrength } from './PasswordStrengthMeter';

const RegisterForm = ({ onSuccess, onSwitchToLogin, onTermsClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const passwordMetrics = calculatePasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isFormValid =
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    passwordMetrics.isValid &&
    passwordsMatch &&
    termsAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError(t('auth.allFieldsRequired', 'All fields are required'));
      return;
    }

    if (!passwordMetrics.isValid) {
      setError(
        t(
          'auth.passwordComplexityError',
          'Password must have at least 12 characters and meet the security requirements below.'
        )
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch', 'Passwords do not match'));
      return;
    }

    if (!termsAccepted) {
      setError(t('auth.acceptTermsError', 'You must accept the Terms and Conditions'));
      return;
    }

    setIsLoading(true);

    try {
      const account = await register(name.trim(), email.trim(), phone.trim(), password);
      const verificationRequired = account?.isVerified === false;

      setSuccessMsg(
        verificationRequired
          ? t('auth.accountCreatedVerification', 'Account created! Please check your email to verify.')
          : t('auth.accountCreatedSuccess', 'Account created successfully! Redirecting...')
      );

      setTimeout(() => {
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        if (verificationRequired) {
          navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        } else if (typeof onSwitchToLogin === 'function') {
          onSwitchToLogin();
        }
      }, 1600);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')) {
        setError(t('auth.emailInUse', 'This email address is already registered. Please sign in instead.'));
      } else {
        setError(msg || t('common.errorOccurred', 'An error occurred during registration.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-start" noValidate={false}>
      {/* Error banner */}
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

      {/* Success banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs text-center font-medium"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Name */}
      <AuthFormField
        id="reg-name"
        name="name"
        label={t('auth.fullName', 'Full Name')}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('auth.fullNamePlaceholder', 'John Doe')}
        icon={FaUser}
        required
        autoComplete="name"
        disabled={isLoading}
      />

      {/* Email */}
      <AuthFormField
        id="reg-email"
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

      {/* Phone Number */}
      <AuthFormField
        id="reg-phone"
        name="phone"
        label={t('auth.phoneNumber', 'Phone Number')}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={t('auth.phonePlaceholder', '+1 234 567 8900')}
        icon={FaPhone}
        required
        autoComplete="tel"
        disabled={isLoading}
      />

      {/* Password */}
      <AuthFormField
        id="reg-password"
        name="password"
        label={t('auth.password', 'Password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••••••"
        icon={FaLock}
        required
        autoComplete="new-password"
        disabled={isLoading}
      />

      {/* Password Strength Meter */}
      <PasswordStrengthMeter password={password} showRules={true} />

      {/* Confirm Password */}
      <AuthFormField
        id="reg-confirm-password"
        name="confirmPassword"
        label={t('auth.confirmPassword', 'Confirm Password')}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••••••"
        icon={FaLock}
        required
        autoComplete="new-password"
        disabled={isLoading}
        error={
          confirmPassword && password !== confirmPassword
            ? t('auth.passwordsDoNotMatch', 'Passwords do not match')
            : undefined
        }
      />

      {/* Terms & Conditions Checkbox */}
      <div className="mb-4 mt-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-ivory-300 select-none">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500 accent-gold-500 cursor-pointer"
          />
          <span>
            {t('auth.iAgreeTo', 'I agree to the')}{' '}
            <Link
              to="/terms"
              onClick={onTermsClick}
              className="text-gold-400 underline hover:text-gold-300 transition-colors"
            >
              {t('auth.termsAndConditions', 'Terms and Conditions')}
            </Link>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold uppercase tracking-[1.5px] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #F5A623 0%, #C07D0A 100%)',
          color: '#0C1C48',
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#0C1C48] border-t-transparent rounded-full animate-spin" />
            <span>{t('common.loading', 'Creating Account...')}</span>
          </div>
        ) : (
          <span>{t('auth.registerButton', 'Create Account')}</span>
        )}
      </button>

      {/* Prominent Log In Section */}
      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-xs text-ivory-300/80 mb-2.5">
          {t('auth.alreadyHaveAccount', 'Already have an account?')}
        </p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-ivory-100 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{t('auth.loginButton', 'Sign In to Your Account')}</span>
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
