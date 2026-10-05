import React from 'react';

/**
 * High-definition SVG country flag component.
 * Renders crisp, color-accurate vector flags on all platforms (including Windows desktop browsers).
 */
export const CountryFlag = ({
  code = 'en',
  className = 'w-5 h-3.5',
  fallbackEmoji = '',
}) => {
  const normCode = (code || '').toLowerCase().trim();

  switch (normCode) {
    case 'ar':
    case 'eg':
    case 'egypt':
      // Flag of Egypt 🇪🇬
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Egypt"
          role="img"
        >
          <rect width="900" height="200" fill="#C8102E" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#000000" />
          {/* Golden Eagle of Saladin */}
          <g transform="translate(450, 300) scale(0.65)">
            <path
              d="M-40,-50 C-20,-70 20,-70 40,-50 C60,-30 80,10 70,50 C60,90 20,110 0,115 C-20,110 -60,90 -70,50 C-80,10 -60,-30 -40,-50 Z"
              fill="#C9A227"
              stroke="#A37B12"
              strokeWidth="3"
            />
            <path
              d="M-20,-20 L0,-40 L20,-20 L15,30 L0,45 L-15,30 Z"
              fill="#FFFFFF"
              stroke="#A37B12"
              strokeWidth="2"
            />
            <circle cx="0" cy="-25" r="8" fill="#C9A227" />
          </g>
        </svg>
      );

    case 'en':
    case 'gb':
    case 'uk':
      // Flag of United Kingdom 🇬🇧
      return (
        <svg
          viewBox="0 0 60 30"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of United Kingdom"
          role="img"
        >
          <clipPath id="uk-clip-s">
            <path d="M0,0 v30 h60 v-30 z" />
          </clipPath>
          <clipPath id="uk-clip-t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
          </clipPath>
          <g clipPath="url(#uk-clip-s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path
              d="M0,0 L60,30 M60,0 L0,30"
              clipPath="url(#uk-clip-t)"
              stroke="#C8102E"
              strokeWidth="4"
            />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      );

    case 'es':
    case 'spain':
      // Flag of Spain 🇪🇸
      return (
        <svg
          viewBox="0 0 750 500"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Spain"
          role="img"
        >
          <rect width="750" height="500" fill="#AA151B" />
          <rect y="125" width="750" height="250" fill="#F1BF00" />
          <circle cx="250" cy="250" r="45" fill="#AA151B" opacity="0.85" />
          <rect x="235" y="225" width="30" height="50" rx="6" fill="#F1BF00" />
        </svg>
      );

    case 'portugal':
    case 'pt':
      // Flag of Portugal 🇵🇹
      return (
        <svg
          viewBox="0 0 600 400"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Portugal"
          role="img"
        >
          <rect width="240" height="400" fill="#046A38" />
          <rect x="240" width="360" height="400" fill="#DA291C" />
          <g transform="translate(240, 200)">
            <circle r="65" fill="#FFE900" stroke="#000000" strokeWidth="4" />
            <rect x="-25" y="-30" width="50" height="60" rx="8" fill="#DA291C" stroke="#FFFFFF" strokeWidth="5" />
            <rect x="-12" y="-18" width="24" height="28" rx="4" fill="#002B7F" />
          </g>
        </svg>
      );

    case 'br':
    case 'brazil':
      // Flag of Brazil 🇧🇷
      return (
        <svg
          viewBox="0 0 720 504"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Brazil"
          role="img"
        >
          <rect width="720" height="504" fill="#009739" />
          <polygon points="360,40 670,252 360,464 50,252" fill="#FEDD00" />
          <circle cx="360" cy="252" r="110" fill="#012169" />
          <path
            d="M260,270 Q360,200 460,270"
            stroke="#FFFFFF"
            strokeWidth="14"
            fill="none"
          />
        </svg>
      );

    case 'it':
    case 'italy':
      // Flag of Italy 🇮🇹
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Italy"
          role="img"
        >
          <rect width="300" height="600" fill="#009246" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#CE2B37" />
        </svg>
      );

    case 'fr':
    case 'france':
      // Flag of France 🇫🇷
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of France"
          role="img"
        >
          <rect width="300" height="600" fill="#002395" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#ED2939" />
        </svg>
      );

    case 'argentina':
    case 'ar_country':
      // Flag of Argentina 🇦🇷
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Argentina"
          role="img"
        >
          <rect width="900" height="200" fill="#74ACDF" />
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          <rect y="400" width="900" height="200" fill="#74ACDF" />
          <circle cx="450" cy="300" r="40" fill="#F6B40E" stroke="#855B17" strokeWidth="2" />
        </svg>
      );

    case 'colombia':
    case 'co':
      // Flag of Colombia 🇨🇴
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Colombia"
          role="img"
        >
          <rect width="900" height="300" fill="#FCD116" />
          <rect y="300" width="900" height="150" fill="#003893" />
          <rect y="450" width="900" height="150" fill="#CE1126" />
        </svg>
      );

    case 'mexico':
    case 'mx':
      // Flag of Mexico 🇲🇽
      return (
        <svg
          viewBox="0 0 900 514"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Mexico"
          role="img"
        >
          <rect width="300" height="514" fill="#006847" />
          <rect x="300" width="300" height="514" fill="#FFFFFF" />
          <rect x="600" width="300" height="514" fill="#CE1126" />
          <circle cx="450" cy="257" r="35" fill="#8B5A2B" />
        </svg>
      );

    case 'peru':
    case 'pe':
      // Flag of Peru 🇵🇪
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Peru"
          role="img"
        >
          <rect width="300" height="600" fill="#D91023" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#D91023" />
        </svg>
      );

    case 'ecuador':
    case 'ec':
      // Flag of Ecuador 🇪🇨
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Ecuador"
          role="img"
        >
          <rect width="900" height="300" fill="#FFD100" />
          <rect y="300" width="900" height="150" fill="#0033A0" />
          <rect y="450" width="900" height="150" fill="#DA291C" />
          <circle cx="450" cy="300" r="30" fill="#0033A0" stroke="#FFD100" strokeWidth="2" />
        </svg>
      );

    case 'chile':
    case 'cl':
      // Flag of Chile 🇨🇱
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Chile"
          role="img"
        >
          <rect width="900" height="300" fill="#FFFFFF" />
          <rect y="300" width="900" height="300" fill="#D62718" />
          <rect width="300" height="300" fill="#0039A6" />
          <polygon points="150,75 170,135 230,135 180,170 200,230 150,190 100,230 120,170 70,135 130,135" fill="#FFFFFF" />
        </svg>
      );

    case 'panama':
    case 'pa':
      // Flag of Panama 🇵🇦
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Panama"
          role="img"
        >
          <rect width="450" height="300" fill="#FFFFFF" />
          <rect x="450" width="450" height="300" fill="#DA121A" />
          <rect y="300" width="450" height="300" fill="#072357" />
          <rect x="450" y="300" width="450" height="300" fill="#FFFFFF" />
          <polygon points="225,90 235,120 265,120 240,140 250,170 225,150 200,170 210,140 185,120 215,120" fill="#072357" />
          <polygon points="675,390 685,420 715,420 690,440 700,470 675,450 650,470 660,440 635,420 665,420" fill="#DA121A" />
        </svg>
      );

    case 'costa_rica':
    case 'costarica':
    case 'cr':
      // Flag of Costa Rica 🇨🇷
      return (
        <svg
          viewBox="0 0 900 600"
          className={`inline-block rounded-[2px] shadow-sm shrink-0 object-cover ${className}`}
          aria-label="Flag of Costa Rica"
          role="img"
        >
          <rect width="900" height="100" fill="#002B7F" />
          <rect y="100" width="900" height="100" fill="#FFFFFF" />
          <rect y="200" width="900" height="200" fill="#CE1126" />
          <rect y="400" width="900" height="100" fill="#FFFFFF" />
          <rect y="500" width="900" height="100" fill="#002B7F" />
        </svg>
      );

    default:
      if (fallbackEmoji) {
        return (
          <span className="text-base leading-none select-none" aria-hidden="true">
            {fallbackEmoji}
          </span>
        );
      }
      return null;
  }
};

export default CountryFlag;
