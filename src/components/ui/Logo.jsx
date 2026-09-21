const Logo = ({ height = 60, className = "" }) => {
  const calcWidth = Math.round(height * 2.66);
  return (
    <img
      src="/dunas-travel-logo.webp"
      alt="Dunas Travel"
      width={calcWidth}
      height={height}
      className={`flex-shrink-0 object-contain transition-all duration-300 ${className}`}
      fetchPriority="high"
      decoding="async"
      style={{
        height: `${height}px`,
        width: `${calcWidth}px`,
        aspectRatio: '8 / 3',
        maxHeight: `${height}px`,
        filter: 'contrast(112%) brightness(106%) drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
      }}
    />
  );
};

export default Logo;
