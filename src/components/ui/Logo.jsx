const Logo = ({ height = 60, className = "" }) => {
  return (
    <img
      src="/dunas-travel-logo.webp"
      alt="Dunas Travel"
      width="160"
      height={height}
      className={`flex-shrink-0 object-contain transition-all duration-300 ${className}`}
      fetchPriority="high"
      decoding="async"
      style={{
        height: `${height}px`,
        width: 'auto',
        maxHeight: `${height}px`,
        filter: 'contrast(112%) brightness(106%) drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
      }}
    />
  );
};

export default Logo;
