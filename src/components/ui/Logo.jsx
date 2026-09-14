const Logo = ({ height = 60, className = "" }) => {
  // Dunas Travel logo aspect ratio ~ 2:1
  const displayWidth = Math.round(height * 2.1);
  const fetchWidth = displayWidth * 2;
  const fetchHeight = height * 2;

  return (
    <img
      src={`https://res.cloudinary.com/degbrq3ck/image/upload/w_${fetchWidth},h_${fetchHeight},c_limit,q_auto:best,f_webp/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.webp`}
      alt="Dunas Travel"
      className={`flex-shrink-0 object-contain transition-all duration-300 ${className}`}
      width={displayWidth}
      height={height}
      fetchPriority="high"
      style={{
        height: `${height}px`,
        width: 'auto',
        maxHeight: `${height}px`,
        filter: 'contrast(108%) brightness(105%) drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
      }}
    />
  );
};

export default Logo;
