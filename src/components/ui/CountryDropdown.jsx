import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheck, FaSearch } from 'react-icons/fa';
import CountryFlagIcon from './CountryFlagIcon';
import {
  COUNTRIES,
  getCountryName,
  matchesCountryQuery,
} from '../../utils/countries';

const CountryDropdown = ({
  anchorRect,
  countries = COUNTRIES,
  selectedCode = '',
  onSelect,
  onClose,
  language = 'en',
  searchable = false,
  query,
  onQueryChange,
  showDialCode = false,
  theme = 'dark',
  searchPlaceholder = 'Search country...',
  emptyLabel = 'No countries found',
}) => {
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const [internalQuery, setInternalQuery] = useState('');
  const effectiveQuery = query !== undefined ? query : internalQuery;
  const isLight = theme === 'light';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchable]);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      matchesCountryQuery(country, effectiveQuery, language)
    );
  }, [countries, effectiveQuery, language]);

  const handleQueryChange = (value) => {
    if (onQueryChange) onQueryChange(value);
    else setInternalQuery(value);
  };

  if (!anchorRect) return null;

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
  const width = Math.min(Math.max(anchorRect.width, 280), viewportWidth - 16);
  const left = Math.min(
    Math.max(8, anchorRect.left),
    Math.max(8, viewportWidth - width - 8)
  );
  const estimatedHeight = 360;
  const openAbove =
    anchorRect.bottom + estimatedHeight > viewportHeight &&
    anchorRect.top > estimatedHeight;

  const style = {
    position: 'fixed',
    left,
    width,
    zIndex: 100000,
    ...(openAbove
      ? { bottom: viewportHeight - anchorRect.top + 8 }
      : { top: anchorRect.bottom + 8 }),
  };

  return createPortal(
    <div
      ref={dropdownRef}
      data-country-dropdown="true"
      style={style}
      className={`rounded-xl border shadow-2xl overflow-hidden ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-[#0d1b35] border-gold-500/25 text-ivory-50'
      }`}
      role="dialog"
      aria-label="Country selector"
    >
      {searchable && (
        <div
          className={`flex items-center gap-2 border-b px-3 py-2.5 ${
            isLight ? 'border-slate-200' : 'border-gold-500/15'
          }`}
        >
          <FaSearch
            size={12}
            className={isLight ? 'text-slate-400' : 'text-ivory-400/70'}
          />
          <input
            ref={searchRef}
            type="text"
            value={effectiveQuery}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={`w-full bg-transparent outline-none text-sm ${
              isLight
                ? 'text-slate-900 placeholder:text-slate-400'
                : 'text-ivory-50 placeholder:text-ivory-400/50'
            }`}
            aria-label={searchPlaceholder}
          />
        </div>
      )}

      <div
        role="listbox"
        aria-label="Country list"
        className="max-h-[300px] overflow-y-auto overscroll-contain py-1 custom-scrollbar"
      >
        {filteredCountries.length === 0 ? (
          <p
            className={`px-3 py-4 text-xs text-center ${
              isLight ? 'text-slate-500' : 'text-ivory-400'
            }`}
          >
            {emptyLabel}
          </p>
        ) : (
          filteredCountries.map((country) => {
            const isSelected = country.code === selectedCode;
            const displayName = getCountryName(country.code, language);
            return (
              <button
                key={country.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect?.(country)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-start transition-colors cursor-pointer ${
                  isLight
                    ? isSelected
                      ? 'bg-amber-50 text-amber-900'
                      : 'hover:bg-slate-50'
                    : isSelected
                      ? 'bg-gold-500/15 text-gold-300'
                      : 'hover:bg-white/5'
                }`}
              >
                <CountryFlagIcon code={country.code} className="w-5 h-3.5" />
                <span className="flex-1 min-w-0 truncate text-sm">{displayName}</span>
                {showDialCode && (
                  <span
                    className={`text-[11px] font-mono ${
                      isLight ? 'text-slate-500' : 'text-ivory-400'
                    }`}
                  >
                    {country.dialCode}
                  </span>
                )}
                {isSelected && <FaCheck size={10} className="shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>,
    document.body
  );
};

export default CountryDropdown;
