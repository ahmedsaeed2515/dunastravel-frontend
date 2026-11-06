import React from 'react';

/**
 * SVG country flag that renders consistently on mobile, laptop and desktop
 * browsers (including Windows, where emoji flags are not displayed).
 */
const CountryFlagIcon = ({
  code,
  className = 'w-5 h-3.5',
  title,
}) => {
  const isoCode = String(code || '').trim().toLowerCase();
  if (!isoCode) return null;

  return (
    <span
      className={`fi fi-${isoCode} inline-block shrink-0 rounded-[2px] shadow-sm ${className}`}
      role="img"
      aria-label={title || `Flag of ${isoCode.toUpperCase()}`}
      title={title || isoCode.toUpperCase()}
    />
  );
};

export default CountryFlagIcon;
