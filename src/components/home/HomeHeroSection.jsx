import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaPlay, FaTimes } from "react-icons/fa";
import "./HomeHeroSection.css";

const SLIDE_DATA = [
  {
    id: "hero-s1",
    bgClass: "slider-bg one",
    bgImage: "/imgs/slider-abu-simbel.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
  {
    id: "hero-s2",
    bgClass: "slider-bg two",
    bgImage: "/imgs/slider-pyramids.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
  {
    id: "hero-s3",
    bgClass: "slider-bg three",
    bgImage: "/imgs/slider-karnak.webp",
    titlePart1: "luxury",
    titlePart2: "journey",
    desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
    btnText: "SEE DESTINATION",
    btnLink: "/destinations",
  },
];

function HeroSlideItem({ slide, isActive, isRtl, setIsVideoOpen, t }) {
  const renderAnimatedWord = (text, startCharIdx = 0) => {
    if (!text) return null;
    if (isRtl) {
      return text.split(" ").map((w, idx) => (
        <span
          key={idx}
          className="char ar-word"
          style={{ display: 'inline-block', marginLeft: '0.3em', '--char-index': startCharIdx + idx }}
        >
          {w}
        </span>
      ));
    }

    let globalCharIndex = startCharIdx;
    const words = text.split(" ");

    return words.map((wordStr, wordIdx) => {
      const chars = wordStr.split("").map((char) => {
        const charElement = (
          <span
            key={globalCharIndex}
            className="char"
            style={{ display: 'inline-block', '--char-index': globalCharIndex }}
          >
            {char}
          </span>
        );
        globalCharIndex++;
        return charElement;
      });

      return (
        <span
          key={wordIdx}
          className="word-wrapper"
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            marginRight: wordIdx < words.length - 1 ? '0.3em' : '0'
          }}
        >
          {chars}
        </span>
      );
    });
  };

  return (
    <div
      className={`hero-slide ${isActive ? "active" : ""}`}
    >
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

          {/* Rotating Circular Video Badge positioned at bottom-right (bottom-left in RTL) */}
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
      </div>
  );
}

export default function HomeHeroSection() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const isRtl = i18n.language === 'ar' || (i18n.dir && i18n.dir() === 'rtl');

  // Infinite non-stop loop across all 3 slides (0 ➔ 1 ➔ 2 ➔ 0 ➔ 1 ➔ 2...)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % SLIDE_DATA.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSlideTo = (index) => {
    setActiveIndex(index);
  };

  return (
    <div
      className={`boxed ${isRtl ? "rtl" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
      style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}
    >
      <div className="main-slider-wrpper">
        <div className="slider__active_container">
          {SLIDE_DATA.map((slide, idx) => (
            <HeroSlideItem
              key={slide.id}
              slide={slide}
              isActive={activeIndex === idx}
              isRtl={isRtl}
              setIsVideoOpen={setIsVideoOpen}
              t={t}
            />
          ))}

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
