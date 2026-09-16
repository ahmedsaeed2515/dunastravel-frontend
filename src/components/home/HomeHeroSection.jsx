import React, { useState, useRef, useEffect, useCallback, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaPlay, FaTimes } from "react-icons/fa";
import "./HomeHeroSection.css";

const SLIDE_DATA = [
  {
    id: "hero-s1",
    bgImage: "/imgs/slider-abu-simbel.webp",
    bgImageMobile: "/imgs/slider-abu-simbel-768w.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
  {
    id: "hero-s2",
    bgImage: "/imgs/slider-pyramids.webp",
    bgImageMobile: "/imgs/slider-pyramids-768w.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
  {
    id: "hero-s3",
    bgImage: "/imgs/slider-karnak.webp",
    bgImageMobile: "/imgs/slider-karnak-768w.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
];

export default function HomeHeroSection() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mountedSecondary, setMountedSecondary] = useState(false);
  const touchStartX = useRef(0);

  const isRtl = i18n.language === "ar" || (i18n.dir && i18n.dir() === "rtl");

  // Defer secondary slide image decode/loading until after critical paint
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMountedSecondary(true), { timeout: 3500 });
      return () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setMountedSecondary(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const ensureSecondaryMounted = useCallback(() => {
    setMountedSecondary(true);
  }, []);

  // Autoplay cycle with concurrent startTransition to protect main thread
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      ensureSecondaryMounted();
      startTransition(() => {
        setActiveIndex((prev) => (prev + 1) % SLIDE_DATA.length);
      });
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, ensureSecondaryMounted]);

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e) => {
    ensureSecondaryMounted();
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 45) {
      ensureSecondaryMounted();
      if (diffX > 0) {
        // Swipe left -> next
        setActiveIndex((prev) => (prev + 1) % SLIDE_DATA.length);
      } else {
        // Swipe right -> prev
        setActiveIndex((prev) => (prev - 1 + SLIDE_DATA.length) % SLIDE_DATA.length);
      }
    }
  };

  const handleSlideTo = useCallback((index) => {
    ensureSecondaryMounted();
    setActiveIndex(index);
  }, [ensureSecondaryMounted]);

  // Helper to split word into characters for styling
  const renderAnimatedWord = (word) => {
    if (!word) return null;
    if (isRtl) {
      return <span className="char ar-word">{word}</span>;
    }
    return word.split("").map((char, index) => (
      <span key={index} className="char">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div
      className={`boxed ${isRtl ? "rtl" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
      style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}
      onMouseEnter={() => {
        ensureSecondaryMounted();
        setIsPaused(true);
      }}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="main-slider-wrpper relative overflow-hidden">
        {SLIDE_DATA.map((slide, idx) => {
          const isActive = idx === activeIndex;
          const isFirst = idx === 0;
          const shouldRenderImage = isFirst || mountedSecondary || isActive;

          return (
            <div
              key={slide.id}
              className={`slider-section ${isActive ? "active-hero-slide" : "inactive-hero-slide"}`}
              style={{
                position: idx === 0 ? "relative" : "absolute",
                top: 0,
                left: 0,
                width: "100%",
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: isActive ? 2 : 1,
              }}
              aria-hidden={!isActive}
            >
              {/* Native Responsive High-Priority Eager Image for Instant LCP */}
              {shouldRenderImage ? (
                <img
                  src={slide.bgImage}
                  srcSet={`${slide.bgImageMobile} 768w, ${slide.bgImage} 1920w`}
                  sizes="100vw"
                  alt={t("home.heroTitle1", slide.titlePart1) + " " + t("home.heroTitle2", slide.titlePart2)}
                  width="1920"
                  height="850"
                  fetchPriority={isFirst ? "high" : "low"}
                  loading={isFirst ? "eager" : "lazy"}
                  decoding="async"
                  className={`slider-bg-img ${isActive ? "zoom-active" : ""}`}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: '#122327' }} />
              )}
              <div className="slider-overlay"></div>

              <div className="auto-container relative z-10 w-full">
                <div className="row align-items-center d-flex">
                  <div className="col-lg-12">
                    <div className="hero_content">
                      <h1 className="text-anime-3 hero-heading-1">
                        {renderAnimatedWord(t("home.heroTitle1", slide.titlePart1))}
                      </h1>
                      <h1 className="text-anime-3 hero-heading-2">
                        <img
                          src="/dunas-travel-logo.webp"
                          alt="Dunas Travel"
                          width="201"
                          height="100"
                          className="dunas-logo"
                          fetchPriority={isFirst ? "high" : "low"}
                        />
                        {renderAnimatedWord(t("home.heroTitle2", slide.titlePart2))}
                      </h1>
                      <p className="slider-contect-des">{t("home.heroDesc", slide.desc)}</p>
                      <div className="hero-btn defult-btn">
                        <Link to={slide.btnLink}>
                          {t("home.heroBtnText", slide.btnText)}
                          <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.96 4.9808C12.8146 4.9808 10.8592 3.0272 10.8592 0.88V0H9.0992V0.88C9.0992 2.44112 9.78384 3.90544 10.8583 4.9808H0V6.7408H10.8583C9.78384 7.81616 9.0992 9.28048 9.0992 10.8416V11.7216H10.8592V10.8416C10.8592 8.69528 12.8146 6.7408 14.96 6.7408H15.84V4.9808H14.96Z"
                              fill="white"
                            ></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Video Badge (Only in active slide to save DOM and SVG calculation) */}
              {isActive && (
                <div
                  className="circle__video"
                  onClick={() => setIsVideoOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <svg viewBox="0 0 200 200">
                    <defs>
                      <path
                        id={`circlePath-${slide.id}`}
                        d="M 100, 100 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                      ></path>
                    </defs>
                    <g className="rotate-text" style={{ transformOrigin: "100px 100px" }}>
                      <text>
                        <textPath href={`#circlePath-${slide.id}`} startOffset="0%">
                          {t("home.heroWatchVideo", "WATCH VIDEO")} &nbsp; {t("home.heroWatchVideo", "WATCH VIDEO")} &nbsp; {t("home.heroWatchVideo", "WATCH VIDEO")} &nbsp;
                        </textPath>
                      </text>
                    </g>
                  </svg>

                  <button
                    type="button"
                    className="circle-vide_btn popup-video"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVideoOpen(true);
                    }}
                    aria-label="Play Video"
                  >
                    <span className="play-now">
                      <FaPlay style={{ fontSize: "7px", marginLeft: "1px" }} />
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Dots Navigation Bar */}
        <div className="travel-slider-dots">
          {SLIDE_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSlideTo(idx)}
              className={`dot-slide ${activeIndex === idx ? "active" : ""}`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Video Popup Modal */}
      {isVideoOpen && (
        <div
          className="video-modal-backdrop"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="video-modal-close"
              onClick={() => setIsVideoOpen(false)}
            >
              <FaTimes />
            </button>
            <video
              src="https://res.cloudinary.com/degbrq3ck/video/upload/v1789316780/hero_jiyrsh.webm"
              controls
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
