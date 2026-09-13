import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaEnvelope, FaShieldAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthFormField from '../../components/auth/AuthFormField';

const VerifyEmail = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRtl = i18n.dir() === 'rtl';
  const BackArrowIcon = isRtl ? FaArrowRight : FaArrowLeft;

  const codeFromUrl = searchParams.get('code') || searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [isVerifying, setIsVerifying] = useState(Boolean(codeFromUrl));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendEmail, setResendEmail] = useState(emailFromUrl);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');
  const [countdown, setCountdown] = useState(60);

  const canResend = countdown <= 0;

  const { verifyEmail, resendVerification, getMe } = useAuth();

  // If code is provided in URL, automatically attempt verification
  useEffect(() => {
    if (!codeFromUrl) return;

    let isMounted = true;
    const performVerification = async () => {
      setIsVerifying(true);
      setError('');
      try {
        await verifyEmail({ code: codeFromUrl, email: emailFromUrl });
        if (typeof getMe === 'function') {
          try {
            await getMe();
          } catch {
            // Non-critical session hydrate
          }
        }
        if (isMounted) {
          const rawPending =
            typeof window !== 'undefined'
              ? sessionStorage.getItem('dunas_pending_booking_intent')
              : null;
          let targetUrl = '/dashboard';
          let isResumingBooking = false;
          if (rawPending) {
            try {
              const parsed = JSON.parse(rawPending);
              const tourKey = parsed?.tourSlug || parsed?.tourId;
              if (tourKey) {
                targetUrl = `/tours/${tourKey}`;
                isResumingBooking = true;
              }
            } catch {
              // Ignore invalid storage
            }
          }

          setSuccess(
            isResumingBooking
              ? t('auth.verifyEmailSuccessBooking', 'Account activated! Resuming your tour reservation...')
              : t('auth.verifyEmailSuccess', 'Your account has been verified successfully! You can now proceed.')
          );
          setTimeout(() => {
            if (isMounted) navigate(targetUrl, { replace: true });
          }, 2000);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || t('auth.verifyEmailError', 'Verification code is invalid or has expired.'));
        }
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [codeFromUrl, emailFromUrl, verifyEmail, getMe, navigate, t]);

  // Handle countdown interval cleanly without effect setState anti-patterns
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setError('');

    if (digit && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const digits = pastedData.split('');
      const updated = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextFocusIndex = Math.min(digits.length, 5);
      inputRefs[nextFocusIndex].current?.focus();
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError(t('auth.otpRequired', 'Please enter all 6 digits of the verification code.'));
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyEmail({ code: fullCode, email: resendEmail.trim() });
      if (typeof getMe === 'function') {
        try {
          await getMe();
        } catch {
          // Non-critical session hydrate
        }
      }

      const rawPending =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('dunas_pending_booking_intent')
          : null;
      let targetUrl = '/dashboard';
      let isResumingBooking = false;
      if (rawPending) {
        try {
          const parsed = JSON.parse(rawPending);
          const tourKey = parsed?.tourSlug || parsed?.tourId;
          if (tourKey) {
            targetUrl = `/tours/${tourKey}`;
            isResumingBooking = true;
          }
        } catch {
          // Ignore invalid storage
        }
      }

      setSuccess(
        isResumingBooking
          ? t('auth.verifyEmailSuccessBooking', 'Account activated! Resuming your tour reservation...')
          : (result?.message || t('auth.verifyEmailSuccess', 'Your account has been verified successfully!'))
      );
      setTimeout(() => {
        navigate(targetUrl, { replace: true });
      }, 2000);
    } catch (err) {
      setError(err?.message || t('auth.verifyEmailError', 'Invalid or expired 6-digit verification code.'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    setResendError('');
    setResendSuccess('');

    try {
      const response = await resendVerification(resendEmail.trim());
      setResendSuccess(
        response?.message || t('auth.verificationResent', 'Verification code sent! Please check your inbox.')
      );
      setCountdown(60);
    } catch (err) {
      setResendError(err?.message || t('auth.resendFailed', 'Failed to resend verification code.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-[#060D23] via-[#0A183D] to-[#040917] flex items-center justify-center px-4 font-body">
      <Helmet>
        <title>{t('auth.verifyEmailTitle', 'Verify Account Code | Dunas Travel')}</title>
      </Helmet>

      <div className="w-full max-w-md bg-gradient-to-b from-[#091535] to-[#060D23] border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative text-white text-start">
        {/* Verification in progress */}
        {isVerifying && (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-display font-bold text-ivory-50">
              {t('auth.verifyingEmail', 'Verifying Code...')}
            </h2>
            <p className="text-xs text-ivory-300">
              {t('auth.verifyingEmailDesc', 'Please wait while we verify and activate your account.')}
            </p>
          </div>
        )}

        {/* Verification Succeeded */}
        {!isVerifying && success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,166,35,0.35)]">
              <FaCheckCircle size={30} className="text-[#0C1C48]" />
            </div>
            <h2 className="text-xl font-display font-bold text-ivory-50">
              {t('auth.emailVerified', 'Account Activated!')}
            </h2>
            <p className="text-xs text-ivory-300 leading-relaxed">{success}</p>
            <p className="text-xs text-gold-400 font-medium">
              {t('auth.redirectingToLogin', 'Redirecting shortly...')}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #F5A623 0%, #C07D0A 100%)',
                  color: '#0C1C48',
                }}
              >
                {t('auth.proceedToLogin', 'Proceed to Sign In')}
              </button>
            </div>
          </motion.div>
        )}

        {/* OTP Input State */}
        {!isVerifying && !success && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-500/20 to-gold-700/20 border border-gold-500/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(245,166,35,0.2)]">
                {error ? (
                  <FaExclamationTriangle size={22} className="text-red-400" />
                ) : (
                  <FaShieldAlt size={22} className="text-gold-400" />
                )}
              </div>
              <h1 className="text-xl font-display font-bold text-ivory-50 tracking-tight">
                {t('auth.enterOtpHeading', 'Enter Verification Code')}
              </h1>
              <p className="text-xs text-ivory-300 mt-1">
                {t('auth.otpSentDesc', 'We sent a 6-digit confirmation code to your email address')}
              </p>
              {emailFromUrl && (
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-medium">
                  {emailFromUrl}
                </div>
              )}
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs text-center font-medium"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 6-Digit OTP Form */}
            <form onSubmit={handleCodeSubmit} className="space-y-5 mb-5">
              <div
                className="flex justify-center items-center gap-2 sm:gap-2.5 dir-ltr"
                style={{ direction: 'ltr' }}
                onPaste={handlePaste}
              >
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    aria-label={`Digit ${idx + 1}`}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-white/5 text-gold-400 border border-gold-500/30 focus:border-gold-500 focus:bg-gold-500/10 focus:ring-2 focus:ring-gold-500/25 outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otpDigits.join('').length !== 6}
                className="w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-[1.5px] text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F5A623 0%, #C07D0A 100%)',
                  color: '#0C1C48',
                }}
              >
                {t('auth.submitVerificationCode', 'Confirm Code & Activate')}
              </button>
            </form>

            {/* Resend Section */}
            <div className="border-t border-white/10 pt-5 mt-5">
              <div className="flex items-center justify-between text-xs text-ivory-300">
                <span>{t('auth.didntReceiveCode', "Didn't receive the code?")}</span>
                {!canResend ? (
                  <span className="text-gold-400 font-mono font-medium">
                    {t('auth.resendIn', 'Resend in')} {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-gold-400 hover:text-gold-300 font-bold underline transition-colors cursor-pointer"
                  >
                    {isResending ? t('common.sending', 'Sending...') : t('auth.resendCodeNow', 'Resend Code')}
                  </button>
                )}
              </div>

              {resendSuccess && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs text-center">
                  {resendSuccess}
                </div>
              )}
              {resendError && (
                <div className="mt-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs text-center">
                  {resendError}
                </div>
              )}

              {/* Email update form if email was missing */}
              {!emailFromUrl && (
                <form onSubmit={handleResend} className="space-y-2.5 mt-3">
                  <AuthFormField
                    id="resend-email"
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', 'Enter account email')}
                    icon={FaEnvelope}
                    required
                    disabled={isResending}
                  />
                  <button
                    type="submit"
                    disabled={isResending || !resendEmail.trim()}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-ivory-200 text-xs font-semibold transition-colors disabled:opacity-60"
                  >
                    {isResending ? t('common.loading', 'Sending...') : t('auth.resendVerificationBtn', 'Send New Code')}
                  </button>
                </form>
              )}
            </div>

            {/* Back to sign in link */}
            <div className="mt-6 text-center border-t border-white/10 pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs font-bold transition-colors"
              >
                <BackArrowIcon size={11} />
                <span>{t('auth.backToSignIn', 'Back to Sign In')}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
