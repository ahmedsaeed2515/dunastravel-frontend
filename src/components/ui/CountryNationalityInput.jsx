import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaGlobeAmericas } from 'react-icons/fa';
import CountryDropdown from './CountryDropdown';
import CountryFlagIcon from './CountryFlagIcon';
import { resolveCountry } from '../../utils/countries';

/**
 * Nationality picker with searchable country list and SVG flags.
 * The visible element intentionally remains an input so existing forms,
 * autofill and validation continue to work as expected.
 */
const CountryNationalityInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  theme = 'dark',
  language: languageProp,
  ariaInvalid = false,
  ariaDescribedBy,
  maxLength,
}) => {
  const { i18n } = useTranslation();
  const language = languageProp || i18n?.language || 'en';
  const isLight = theme === 'light';
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const [query, setQuery] = useState('');

  const selectedCountry = useMemo(() => resolveCountry(value), [value]);

  const openDropdown = () => {
    if (disabled) return;
    if (wrapperRef.current) {
      setAnchorRect(wrapperRef.current.getBoundingClientRect());
    }
    setQuery('');
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

  const handleInputChange = (event) => {
    const rawValue = event.target.value;
    setQuery(rawValue);
    setOpen(true);
    if (wrapperRef.current) {
      setAnchorRect(wrapperRef.current.getBoundingClientRect());
    }
    onChange?.(rawValue);
  };

  const handleCountrySelect = (country) => {
    onChange?.(country.nameEn);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <span className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
        {selectedCountry ? (
          <CountryFlagIcon code={selectedCountry.code} className="w-5 h-3.5" />
        ) : (
          <FaGlobeAmericas
            size={13}
            className={isLight ? 'text-slate-400' : 'text-gold-300/80'}
          />
        )}
      </span>

      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={openDropdown}
        onClick={openDropdown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="country-name"
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        maxLength={maxLength}
        style={{ paddingInlineStart: '2.75rem', paddingInlineEnd: '2.5rem' }}
        className={inputClassName}
      />

      <FaChevronDown
        size={9}
        className={`absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none ${
          isLight ? 'text-slate-400' : 'text-gold-300/80'
        }`}
      />

      {open && (
        <CountryDropdown
          anchorRect={anchorRect}
          selectedCode={selectedCountry?.code || ''}
          onSelect={handleCountrySelect}
          onClose={() => setOpen(false)}
          language={language}
          query={query}
          theme={isLight ? 'light' : 'dark'}
          emptyLabel={language.startsWith('ar') ? 'لا توجد نتائج' : 'No countries found'}
        />
      )}
    </div>
  );
};

export default CountryNationalityInput;
