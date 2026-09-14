import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { FaPlay, FaTimes } from "react-icons/fa";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/effect-fade";
import "./HomeHeroSection.css";

const SLIDE_DATA = [
  {
    bgClass: "slider-bg one",
    bgImage: "/imgs/slider-abu-simbel.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
  {
    bgClass: "slider-bg two",
    bgImage: "/imgs/slider-pyramids.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
  {
    bgClass: "slider-bg three",
    bgImage: "/imgs/slider-karnak.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
];

// Static 6-slide buffer (repeating 1, 2, 3, 1, 2, 3) prevents Swiper loop boundary pauses
const SLIDES = [
  { id: "hero-s1", ...SLIDE_DATA[0] },
  { id: "hero-s2", ...SLIDE_DATA[1] },
  { id: "hero-s3", ...SLIDE_DATA[2] },
  { id: "hero-s4", ...SLIDE_DATA[0] },
  { id: "hero-s5", ...SLIDE_DATA[1] },
  { id: "hero-s6", ...SLIDE_DATA[2] },
];

const SWIPER_MODULES = [EffectFade, Autoplay];
const SWIPER_AUTOPLAY_CONFIG = {
  delay: 4500,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
  stopOnLastSlide: false,
  waitForTransition: false,
};
const SWIPER_FADE_EFFECT = { crossFade: true };

export default function HomeHeroSection() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const swiperRef = useRef(null);
  const containerRef = useRef(null);

  const isRtl = i18n.language === 'ar' || (i18n.dir && i18n.dir() === 'rtl');

  const isInitialMount = useRef(true);

  // Bulletproof autoplay watchdog: ensures autoplay is always active and advancing continuously
  useEffect(() => {
    const watchdogTimer = setInterval(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        const swiper = swiperRef.current.swiper;
        if (swiper.autoplay && !swiper.autoplay.running) {
          swiper.autoplay.start();
        }
      }
    }, 3000);

    return () => clearInterval(watchdogTimer);
  }, []);

  // Run silky-smooth fluid element entrance & restart background zoom animation on active slide
  useEffect(() => {
    if (!containerRef.current) return;

    const isFirst = isInitialMount.current;
    if (isFirst) {
      isInitialMount.current = false;
    }

    const activeSlideEl = containerRef.current.querySelector(".swiper-slide-active");

    // Reset non-active slides
    const allSlides = containerRef.current.querySelectorAll(".swiper-slide");
    allSlides.forEach((slideEl) => {
      if (slideEl !== activeSlideEl) {
        const elsToReset = slideEl.querySelectorAll(".hero-heading-1, .hero-heading-2, .dunas-logo, .slider-contect-des, .defult-btn a");
        if (elsToReset.length > 0) {
          gsap.set(elsToReset, { opacity: 0, y: 0 });
        }
        const bg = slideEl.querySelector(".slider-bg");
        if (bg) {
          bg.style.animation = "none";
        }
      }
    });

    if (!activeSlideEl) return;

    // Force re-trigger CSS zoom animation on active slide background without forced reflow
    const activeBg = activeSlideEl.querySelector(".slider-bg");
    if (activeBg) {
      activeBg.style.animation = "none";
      requestAnimationFrame(() => {
        if (activeBg) {
          activeBg.style.animation = "heroZoomSequence 6.5s cubic-bezier(0.37, 0, 0.63, 1) forwards";
        }
      });
    }

    const heading1 = activeSlideEl.querySelector(".hero-heading-1");
    const heading2 = activeSlideEl.querySelector(".hero-heading-2");
    const logo = activeSlideEl.querySelector(".dunas-logo");
    const desc = activeSlideEl.querySelector(".slider-contect-des");
    const btn = activeSlideEl.querySelector(".defult-btn a");

    const allActiveElements = [heading1, heading2, logo, desc, btn].filter(Boolean);
    gsap.killTweensOf(allActiveElements);

    // On initial mount, ensure immediate full opacity for LCP score, then run slide transition animations on subsequent changes
    if (isFirst) {
      gsap.set(allActiveElements, { opacity: 1, y: 0 });
      return;
    }

    // 1. First Heading line ("LUXURY"): Smoothly glides down from top (-65px)
    if (heading1) {
      gsap.fromTo(
        heading1,
        { opacity: 0, y: -65 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          ease: "power2.out",
        }
      );
    }

    // 2. Second Heading line ("JOURNEY"): Smoothly glides down from top (-65px)
    if (heading2) {
      gsap.fromTo(
        heading2,
        { opacity: 0, y: -65 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          delay: 0.15,
          ease: "power2.out",
        }
      );
    }

    // 3. Dunas Logo Image: Smoothly rises up from bottom (+65px)
    if (logo) {
      gsap.fromTo(
        logo,
        { opacity: 0, y: 65 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          delay: 0.25,
          ease: "power2.out",
        }
      );
    }

    // 4. Paragraph description: Smoothly rises up from bottom (+65px)
    if (desc) {
      gsap.fromTo(
        desc,
        { opacity: 0, y: 65 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          delay: 0.38,
          ease: "power2.out",
        }
      );
    }

    // 5. Action button: Smoothly rises up from bottom (+65px)
    if (btn) {
      gsap.fromTo(
        btn,
        { opacity: 0, y: 65 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          delay: 0.52,
          ease: "power2.out",
        }
      );
    }
  }, [activeIndex]);

  const handleSlideTo = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideToLoop(index);
      if (swiperRef.current.swiper.autoplay) {
        swiperRef.current.swiper.autoplay.start();
      }
    }
  };

  // Helper to split word into animated character spans
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
      ref={containerRef}
    >
      <div className="main-slider-wrpper">
        <Swiper
          ref={swiperRef}
          modules={SWIPER_MODULES}
          effect="fade"
          fadeEffect={SWIPER_FADE_EFFECT}
          loop={true}
          speed={1200}
          observer={false}
          observeParents={false}
          resizeObserver={false}
          autoplay={SWIPER_AUTOPLAY_CONFIG}
          onSwiper={(swiper) => {
            if (swiper && swiper.autoplay) {
              swiper.autoplay.start();
            }
          }}
          onSlideChangeTransitionEnd={(swiper) => {
            setActiveIndex(swiper.realIndex);
            if (swiper && swiper.autoplay && !swiper.autoplay.running) {
              swiper.autoplay.start();
            }
          }}
          onAutoplayStop={(swiper) => {
            if (swiper && swiper.autoplay) {
              swiper.autoplay.start();
            }
          }}
          className="swiper slider__active"
        >
          {SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="slider-section d-flex align-items-center">
                <div
                  className={slide.bgClass}
                  style={{ backgroundImage: `url('${slide.bgImage}')` }}
                ></div>
                <div className="auto-container">
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
              </div>
            </SwiperSlide>
          ))}

          {/* Dots Navigation Bar */}
          <div className="travel-slider-dots">
            {SLIDE_DATA.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSlideTo(idx)}
                className={`dot-slide ${(activeIndex % 3) === idx ? "active" : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </Swiper>
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
