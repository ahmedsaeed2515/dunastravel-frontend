import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import { useActiveLocales } from '../../hooks/useActiveLocales';
import { syncDocumentDirection } from '../../i18n';
import { useClickOutside } from '../../hooks/useClickOutside';
import CountryFlag from './CountryFlag';

const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.96,
    transition: { duration: 0.12, ease: 'easeIn' }
  }
};

const LanguageSelector = ({ light = false, className = '', showFullLabel = false }) => {
  const { t, i18n } = useTranslation();
  const { activeLanguages } = useActiveLocales();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listboxRef = useRef(null);

  const isRtl = i18n.dir() === 'rtl';
  const currentLang = activeLanguages.find((l) => l.code === i18n.language) ||
    activeLanguages.find((l) => l.code === (i18n.language || '').split('-')[0]) ||
    activeLanguages[0] ||
    { code: 'en', label: 'English', flag: '🇬🇧' };

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  useClickOutside(containerRef, closeDropdown, { enabled: isOpen, escapeKey: true });

  const handleSelectLanguage = useCallback((code) => {
    if (code !== i18n.language) {
      i18n.changeLanguage(code);
      try {
        localStorage.setItem('i18nextLng', code);
      } catch {
        // Safe fallback in restrictive privacy contexts
      }
      syncDocumentDirection(code);
    }
    closeDropdown();
    buttonRef.current?.focus();
  }, [i18n, closeDropdown]);

  // Keyboard navigation within the dropdown
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const currentIdx = activeLanguages.findIndex((l) => l.code === currentLang.code);
        setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % activeLanguages.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + activeLanguages.length) % activeLanguages.length);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(activeLanguages.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < activeLanguages.length) {
          handleSelectLanguage(activeLanguages[focusedIndex].code);
        }
        break;
      case 'Tab':
        closeDropdown();
        break;
      default:
        break;
    }
  };

  // Scroll focused option into view when navigating via keyboard
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const optionEl = listboxRef.current.children[focusedIndex];
      if (optionEl && typeof optionEl.scrollIntoView === 'function') {
        optionEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, focusedIndex]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-start ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('nav.selectLanguage', 'Select language')}
        className={`h-6 sm:h-7 rounded-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 transition-all duration-300 select-none outline-none ${
          light
            ? 'bg-obsidian-100/80 hover:bg-obsidian-200/80 text-obsidian-800 border border-obsidian-200'
            : 'bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-gold-500/50 text-white'
        } focus-visible:ring-2 focus-visible:ring-gold-500/70`}
      >
        <CountryFlag code={currentLang.code} fallbackEmoji={currentLang.flag} className="w-4.5 h-3 shadow-sm" />
        {showFullLabel ? (
          <span className="text-xs font-bold tracking-wide">
            {currentLang.label}
          </span>
        ) : (
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            {currentLang.code}
          </span>
        )}
        <FaChevronDown
          size={8}
          className={`text-gold-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listboxRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            aria-label={t('nav.languages', 'Languages')}
            aria-activedescendant={
              focusedIndex >= 0 ? `lang-opt-${activeLanguages[focusedIndex]?.code}` : undefined
            }
            tabIndex={-1}
            className={`absolute top-full mt-2 w-48 rounded-2xl p-1.5 backdrop-blur-xl shadow-2xl border transition-colors z-[10000] ${
              isRtl ? 'left-0' : 'right-0'
            } ${
              light
                ? 'bg-white/95 border-obsidian-200 text-obsidian-900 shadow-obsidian-900/10'
                : 'bg-[#0f172a]/95 dark:bg-[#0c1322]/95 border-gold-500/30 text-white shadow-black/60'
            }`}
          >
            {activeLanguages.map((lang, index) => {
              const isSelected = currentLang.code === lang.code;
              const isFocused = focusedIndex === index;

              return (
                <li
                  key={lang.code}
                  id={`lang-opt-${lang.code}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30'
                      : isFocused
                      ? light
                        ? 'bg-obsidian-100 text-obsidian-900'
                        : 'bg-white/10 text-white'
                      : light
                      ? 'text-obsidian-700 hover:text-obsidian-900'
                      : 'text-ivory-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CountryFlag code={lang.code} fallbackEmoji={lang.flag} className="w-5 h-3.5 shadow-sm" />
                    <div className="flex flex-col text-start">
                      <span className="leading-tight">{lang.label}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-60">
                        {lang.code}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <FaCheck size={10} className="text-gold-400 ms-2" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
