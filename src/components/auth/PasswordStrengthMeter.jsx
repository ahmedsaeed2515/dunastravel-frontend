import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes } from 'react-icons/fa';

export function calculatePasswordStrength(password = '') {
  const str = typeof password === 'string' ? password : '';
  if (!str) {
    return {
      score: 0,
      isValid: false,
      hasMinLength: false,
      hasUpper: false,
      hasLower: false,
      hasDigitOrSymbol: false,
      isPredictable: false,
      hasRepeat: false,
    };
  }

  const hasMinLength = str.length >= 12;
  const hasUpper = /[A-Z]/.test(str);
  const hasLower = /[a-z]/.test(str);
  const hasDigit = /\d/.test(str);
  const hasSymbol = /[^A-Za-z0-9]/.test(str);
  const characterClassesCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
  const hasClasses = characterClassesCount >= 3;

  const blockedWords = ['password', 'passw0rd', 'qwerty', 'admin', 'dunas', 'letmein', 'welcome', '123456'];
  const isPredictable = blockedWords.some((w) => str.toLowerCase().includes(w));
  const hasRepeat = /(.)\1{4,}/.test(str);

  let score = 0;
  if (str.length >= 8) score += 1;
  if (hasMinLength) score += 1;
  if (hasClasses) score += 1;
  if (!isPredictable && !hasRepeat && hasMinLength && hasClasses) score += 1;

  const isValid = hasMinLength && hasClasses && !isPredictable && !hasRepeat;

  return {
    score,
    isValid,
    hasMinLength,
    hasUpper,
    hasLower,
    hasDigitOrSymbol: hasDigit || hasSymbol,
    hasClasses,
    isPredictable,
    hasRepeat,
  };
}

const PasswordStrengthMeter = ({ password = '', showRules = true }) => {
  const { t } = useTranslation();
  const metrics = calculatePasswordStrength(password);

  if (!password) return null;

  const getStrengthLabel = () => {
    switch (metrics.score) {
      case 1:
        return { label: t('auth.strengthWeak', 'Weak'), color: 'text-red-400' };
      case 2:
        return { label: t('auth.strengthFair', 'Fair'), color: 'text-amber-400' };
      case 3:
        return { label: t('auth.strengthGood', 'Good'), color: 'text-yellow-400' };
      case 4:
        return { label: t('auth.strengthStrong', 'Strong & Secure'), color: 'text-emerald-400' };
      default:
        return { label: '', color: '' };
    }
  };

  const strength = getStrengthLabel();

  return (
    <div className="w-full text-start mb-3 mt-1">
      {/* Visual meter bar & label */}
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-ivory-400 font-medium">
          {t('auth.passwordStrength', 'Password Strength')}
        </span>
        {strength.label && (
          <span className={`font-semibold tracking-wide ${strength.color}`}>
            {strength.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            metrics.score >= 1 ? 'bg-red-500' : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            metrics.score >= 2 ? 'bg-amber-500' : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            metrics.score >= 3 ? 'bg-yellow-400' : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            metrics.score >= 4 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-transparent'
          }`}
        />
      </div>

      {/* Rules checklist */}
      {showRules && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-2 text-ivory-400">
          <div
            className={`flex items-center gap-1.5 transition-colors ${
              metrics.hasMinLength ? 'text-emerald-400' : 'text-ivory-400/80'
            }`}
          >
            {metrics.hasMinLength ? <FaCheck size={9} /> : <FaTimes size={9} />}
            <span>{t('auth.reqLength', '12+ characters')}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              metrics.hasUpper && metrics.hasLower ? 'text-emerald-400' : 'text-ivory-400/80'
            }`}
          >
            {metrics.hasUpper && metrics.hasLower ? <FaCheck size={9} /> : <FaTimes size={9} />}
            <span>{t('auth.reqUpperLower', 'Upper & lowercase')}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              metrics.hasDigitOrSymbol ? 'text-emerald-400' : 'text-ivory-400/80'
            }`}
          >
            {metrics.hasDigitOrSymbol ? <FaCheck size={9} /> : <FaTimes size={9} />}
            <span>{t('auth.reqNumberSymbol', 'Numbers / symbols')}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              !metrics.isPredictable && !metrics.hasRepeat ? 'text-emerald-400' : 'text-ivory-400/80'
            }`}
          >
            {!metrics.isPredictable && !metrics.hasRepeat ? (
              <FaCheck size={9} />
            ) : (
              <FaTimes size={9} />
            )}
            <span>{t('auth.reqUnpredictable', 'Unpredictable')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
