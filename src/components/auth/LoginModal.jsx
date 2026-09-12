import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import {
  getPasswordValidationErrors,
} from '../../utils/passwordPolicy';

// Custom Dunas Styles
import '../../pages/auth/dunas-auth.css';

const LoginModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Active Tab Mode: 'login' | 'register'
  const [activeTab, setActiveTab] = useState(initialTab);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [showResendBtn, setShowResendBtn] = useState(false);

  const { login, register, resendVerification } = useAuth();

  // Password Policy Checks for Register Form
  const passwordErrors = getPasswordValidationErrors(regPassword);
  const isPasswordValid = passwordErrors.length === 0;

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setShowResendBtn(false);
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('verification')) {
        setError(t('auth.unverifiedEmailError', 'Please verify your email before logging in.'));
        setShowResendBtn(true);
      } else if (msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password') || err.status === 401) {
        setError(t('auth.invalidCredentials', 'Invalid email or password'));
      } else {
        setError(msg || t('common.errorOccurred', 'An error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName || !regEmail || !regPhone || !regPassword || !regConfirmPassword) {
      return setError(t('auth.allFieldsRequired', 'All fields are required'));
    }
    if (!isPasswordValid) {
      return setError(t('auth.passwordComplexityError', 'Use 12–128 characters, at least three character types, and avoid predictable words.'));
    }
    if (regPassword !== regConfirmPassword) {
      return setError(t('auth.passwordsDoNotMatch', 'Passwords do not match'));
    }
    if (!termsAccepted) {
      return setError(t('auth.acceptTermsError', 'You must accept the Terms and Conditions'));
    }

    setIsLoading(true);
    try {
      const account = await register(regName, regEmail, regPhone, regPassword);
      const verificationRequired = account?.isVerified === false;
      setSuccessMsg(verificationRequired
        ? t('auth.accountCreatedVerification', 'Account created! Please check your email to verify.')
        : t('auth.accountCreatedSuccess', 'Account created successfully! Redirecting...'));

      if (verificationRequired) {
        setTimeout(() => {
          onClose();
          navigate(`/verify-email?email=${encodeURIComponent(regEmail)}`);
        }, 1500);
      } else {
        setTimeout(() => {
          setActiveTab('login');
          setEmail(regEmail);
          setPassword(regPassword);
        }, 1500);
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes('already exists') || err.message?.toLowerCase().includes('duplicate')) {
        setError(t('auth.emailInUse', 'This email is already registered'));
      } else {
        setError(err.message || t('common.errorOccurred', 'An error occurred'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Verification Email
  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError('');
    try {
      await resendVerification(email);
      setSuccessMsg(t('auth.verificationResent', 'Verification email sent! Please check your inbox.'));
    } catch (err) {
      setError(err.message || t('auth.resendFailed', 'Failed to resend verification email'));
    } finally {
      setIsResending(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 999999, position: 'fixed', inset: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg my-auto relative cursor-default"
          >
            {/* Dunas Travel Logo Outside Card Header */}
            <div className="text-center mb-5 relative">
              <img
                src="/dunas-travel-logo.png"
                alt="Dunas Travel Logo"
                className="mx-auto max-w-[170px] sm:max-w-[200px] h-auto drop-shadow-xl"
              />
            </div>            {/* Dunas Login Card Modal Container */}
            <div className="dunas-login-card relative shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-gold-500/40">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-ivory-300 hover:text-gold-400 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
                aria-label="Close dialog"
              >
                <FaTimes size={18} />
              </button>

              {/* Dynamic Title & Subtitle */}
              <h2 id="title" className="text-2xl font-serif font-bold text-white mb-1">
                {activeTab === 'login'
                  ? t('auth.welcomeTitle', 'Welcome')
                  : t('auth.createAccountTitle', 'Create Account')}
              </h2>
              <p className="dunas-subtitle text-xs text-gold-300 mb-5" id="subtitle">
                {activeTab === 'login'
                  ? t('auth.signInSubtitle', 'Sign In Your Account')
                  : t('auth.registerSubtitle', 'Register New Account')}
              </p>

              {/* Dunas Tabs Switcher */}
              <div className="dunas-tabs mb-5 flex gap-2 border-b border-gold-500/20 pb-3">
                <button
                  type="button"
                  className={activeTab === 'login' ? 'active' : ''}
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                >
                  {t('auth.logInTab', 'Log In')}
                </button>
                <button
                  type="button"
                  className={activeTab === 'register' ? 'active' : ''}
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                >
                  {t('auth.registerTab', 'Register')}
                </button>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs space-y-2 text-center"
                  >
                    <p>{error}</p>
                    {showResendBtn && (
                      <div className="pt-2 border-t border-red-500/30 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={isResending}
                          className="px-3 py-1 bg-gold-500 text-black text-xs font-bold rounded hover:bg-gold-400 transition"
                        >
                          {isResending ? t('common.loading', 'Sending...') : t('auth.resendCode', 'Resend Code')}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Banner */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs text-center font-medium"
                  >
                    {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── FORM 1: LOGIN FORM ── */}
              {activeTab === 'login' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleLoginSubmit}
                >
                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.yourEmail', 'Your Email')}
                    />
                  </div>

                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder', 'Password')}
                    />
                    <span
                      className="dunas-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="dunas-options flex items-center justify-between text-xs my-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-white">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500 accent-gold-500"
                      />
                      <span>{t('auth.rememberMe', 'Remember me')}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/forgot-password');
                      }}
                      className="text-gold-300 hover:text-gold-400 hover:underline"
                    >
                      {t('auth.forgotPassword', 'Forgot Password?')}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="dunas-login-btn mt-4"
                  >
                    {isLoading ? (
                      <span>{t('auth.authenticating', 'Authenticating...')}</span>
                    ) : (
                      <span>{t('auth.loginButton', 'LOGIN')}</span>
                    )}
                  </button>

                  <div className="dunas-bottom-text mt-5 text-xs text-center">
                    <span>{t('auth.noAccount', "Don't have an account?")} </span>
                    <a
                      href="#register"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('register');
                      }}
                    >
                      {t('auth.registerTab', 'Register')}
                    </a>
                  </div>
                </motion.form>
              )}

              {/* ── FORM 2: REGISTER FORM ── */}
              {activeTab === 'register' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleRegisterSubmit}
                >
                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={t('auth.fullName', 'Full Name')}
                    />
                  </div>

                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={t('auth.emailAddress', 'Email Address')}
                    />
                  </div>

                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={t('auth.phoneNumber', 'Phone Number')}
                    />
                  </div>

                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaLock />
                    </span>
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t('auth.password', 'Password')}
                    />
                    <span
                      className="dunas-eye"
                      onClick={() => setRegShowPassword(!regShowPassword)}
                    >
                      {regShowPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <div className="dunas-input-box mb-3">
                    <span>
                      <FaLock />
                    </span>
                    <input
                      type={regShowConfirmPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder={t('auth.confirmPassword', 'Confirm Password')}
                    />
                    <span
                      className="dunas-eye"
                      onClick={() =>
                        setRegShowConfirmPassword(!regShowConfirmPassword)
                      }
                    >
                      {regShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500 accent-gold-500"
                      />
                      <span>
                        {t('auth.iAgreeTo', 'I agree to the')}{' '}
                        <Link
                          to="/terms"
                          onClick={onClose}
                          className="text-gold-400 underline"
                        >
                          {t('auth.termsAndConditions', 'Terms and Conditions')}
                        </Link>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="dunas-login-btn"
                  >
                    {isLoading ? (
                      <span>{t('common.loading', 'Creating Account...')}</span>
                    ) : (
                      <span>{t('auth.registerButton', 'REGISTER')}</span>
                    )}
                  </button>

                  <div className="dunas-bottom-text mt-5 text-xs text-center">
                    <span>{t('auth.alreadyHaveAccount', 'Already have an account?')} </span>
                    <a
                      href="#login"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('login');
                      }}
                    >
                      {t('auth.logInTab', 'Log In')}
                    </a>
                  </div>
                </motion.form>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LoginModal;
