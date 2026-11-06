import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import CountryDropdown from './CountryDropdown';
import CountryFlagIcon from './CountryFlagIcon';
import {
  COUNTRY_BY_CODE,
  buildPhoneValue,
  getDefaultCountry,
  parsePhoneValue,
} from '../../utils/countries';

const darkTriggerClass =
  'inline-flex items-center justify-center gap-1.5 shrink-0 rounded-xl border border-[rgba(201,162,39,0.18)] bg-[rgba(255,252,247,0.03)] px-3 py-3 text-ivory-50 hover:border-gold-500/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all [color-scheme:dark] cursor-pointer';

const lightTriggerClass =
  'inline-flex items-center justify-center gap-1.5 shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 hover:border-gold-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all cursor-pointer';

const darkInputClass =
  'flex-1 min-w-0 px-3.5 py-3 rounded-xl bg-[rgba(255,252,247,0.03)] text-ivory-50 placeholder:text-ivory-400/40 border border-[rgba(201,162,39,0.18)] focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none text-[13.5px] transition-all [color-scheme:dark]';

const lightInputClass =
  'flex-1 min-w-0 px-4 py-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none text-sm transition-all';

/**
 * International phone number field. The country calling code is always shown
 * first and is selected from a searchable list with SVG flags.
 */
const CountryPhoneInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  autoComplete = 'tel',
  className = '',
  inputClassName = '',
  triggerClassName = '',
  theme = 'dark',
  defaultCountry = 'EG',
  searchPlaceholder,
}) => {
  const { i18n } = useTranslation();
  const language = i18n?.language || 'en';
  const isLight = theme === 'light';
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  const parsedValue = useMemo(
    () => parsePhoneValue(value, defaultCountry),
    [value, defaultCountry]
  );

  const [selectedCode, setSelectedCode] = useState(
    () => parsedValue.country?.code || defaultCountry
  );

  useEffect(() => {
    if (String(value || '').trim().startsWith('+') && parsedValue.country?.code) {
      // Keep the flag in sync with programmatic form values (profile loading,
      // autofill, draft restoration) while preserving explicit local choices.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCode(parsedValue.country.code);
    }
  }, [value, parsedValue.country?.code]);

  const selectedCountry =
    COUNTRY_BY_CODE.get(selectedCode) || getDefaultCountry(defaultCountry);

  const nationalNumber = useMemo(() => {
    const rawValue = String(value || '').trim();
    if (!rawValue) return '';
    if (!rawValue.startsWith('+')) return rawValue;
    return parsePhoneValue(rawValue, selectedCountry.code).nationalNumber;
  }, [value, selectedCountry.code]);

  const openDropdown = () => {
    if (disabled) return;
    if (triggerRef.current) {
      setAnchorRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (wrapperRef.current?.contains(event.target)) return;
      if (event.target?.closest?.('[data-country-dropdown]')) return;
      setOpen(false);
    };
    const handleResize = () => setOpen(false);

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  const handleCountrySelect = (country) => {
    const nextValue = buildPhoneValue(country.dialCode, nationalNumber);
    setSelectedCode(country.code);
    setOpen(false);
    onChange?.(nextValue);
  };

  const handleInputChange = (event) => {
    const rawValue = event.target.value;

    // Preserve a pasted international number exactly. This also keeps
    // programmatic form values (e.g. tests or autofill) intact.
    if (rawValue.trim().startsWith('+')) {
      const parsedRaw = parsePhoneValue(rawValue, selectedCountry.code);
      if (parsedRaw.country?.code) setSelectedCode(parsedRaw.country.code);
      onChange?.(rawValue);
      return;
    }

    if (!rawValue) {
      onChange?.('');
      return;
    }

    onChange?.(buildPhoneValue(selectedCountry.dialCode, rawValue));
  };

  return (
    <div ref={wrapperRef} className={`flex items-stretch gap-2 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select country calling code. Current code ${selectedCountry.dialCode}`}
        className={`${isLight ? lightTriggerClass : darkTriggerClass} ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${triggerClassName}`}
      >
        <CountryFlagIcon code={selectedCountry.code} className="w-5 h-3.5" />
        <span className="text-[12px] font-semibold tabular-nums">
          {selectedCountry.dialCode}
        </span>
        <FaChevronDown size={9} className="opacity-70" />
      </button>

      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete={autoComplete}
        value={nationalNumber}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${isLight ? lightInputClass : darkInputClass} ${inputClassName}`}
      />

      {open && (
        <CountryDropdown
          anchorRect={anchorRect}
          selectedCode={selectedCountry.code}
          onSelect={handleCountrySelect}
          onClose={() => setOpen(false)}
          language={language}
          searchable
          showDialCode
          theme={isLight ? 'light' : 'dark'}
          searchPlaceholder={
            searchPlaceholder || (language.startsWith('ar') ? 'ابحث عن الدولة...' : 'Search country...')
          }
        />
      )}
    </div>
  );
};

export default CountryPhoneInput;
