const Logo = ({ height = 60, className = "" }) => {
  return (
    <img
      src="https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_100/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.png"
      alt="Dunas Travel"
      className={`flex-shrink-0 object-contain transition-all duration-300 ${className}`}
      fetchPriority="high"
      style={{
        height: `${height}px`,
        width: 'auto',
        maxHeight: `${height}px`,
        filter: 'contrast(112%) brightness(106%) drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
        imageRendering: '-webkit-optimize-contrast',
      }}
    />
  );
};

export default Logo;
