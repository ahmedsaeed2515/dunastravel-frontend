import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Luxury styled accessible form field for authentication.
 */
const AuthFormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  error,
  icon: Icon,
  disabled = false,
  helperText,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full text-start mb-3.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold uppercase tracking-wider text-gold-400 mb-1.5"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <span
            className="absolute start-3.5 text-ivory-400 pointer-events-none transition-colors"
            aria-hidden="true"
          >
            <Icon size={14} />
          </span>
        )}

        <input
          id={id}
          name={name || id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`w-full text-sm font-medium py-3 rounded-xl transition-all duration-200 outline-none ${
            Icon ? 'ps-10' : 'ps-4'
          } ${isPassword ? 'pe-11' : 'pe-4'} bg-[rgba(255,252,247,0.06)] dark:bg-[rgba(10,20,45,0.6)] border ${
            error
              ? 'border-red-500/80 text-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-white/15 dark:border-gold-500/25 text-white placeholder:text-ivory-400/50 hover:border-gold-500/40 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute end-3 text-ivory-400 hover:text-gold-400 p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
          >
            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-[11px] text-ivory-400 mt-1">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-[11px] text-red-400 mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthFormField;
