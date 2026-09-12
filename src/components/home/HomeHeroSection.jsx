import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaPlay, FaTimes } from "react-icons/fa";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./HomeHeroSection.css";

export default function HomeHeroSection() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const swiperRef = useRef(null);
  const containerRef = useRef(null);

  const slides = [
    {
      id: 1,
      bgClass: "slider-bg",
      bgImage: "/imgs/slider-bg.png",
      titlePart1: "luxury",
      titlePart2: "journey",
      desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
      btnText: "SEE DESTINATION",
      btnLink: "#search-section",
    },
    {
      id: 2,
      bgClass: "slider-bg two",
      bgImage: "/imgs/slider-two.png",
      titlePart1: "luxury",
      titlePart2: "journey",
      desc: "Discover the magic of Egypt and its historical monuments with the help of Experts",
      btnText: "SEE DESTINATION",
      btnLink: "#search-section",
    },
  ];

  // Run distinct GSAP character animation on active slide (runs every slide change)
  useEffect(() => {
    if (!containerRef.current) return;

    // Reset all non-active slides text/logo/desc/btn to hidden
    const allSlides = containerRef.current.querySelectorAll(".swiper-slide");
    allSlides.forEach((slideEl) => {
      if (!slideEl.classList.contains("swiper-slide-active")) {
        const chars = slideEl.querySelectorAll(".char");
        const logo = slideEl.querySelector(".dunas-logo");
        const desc = slideEl.querySelector(".slider-contect-des");
        const btn = slideEl.querySelector(".defult-btn a");
        const elsToReset = [...chars, logo, desc, btn].filter(Boolean);
        if (elsToReset.length > 0) {
          gsap.set(elsToReset, { opacity: 0, y: 0 });
        }
      }
    });

    const activeSlideEl = containerRef.current.querySelector(".swiper-slide-active");
    if (!activeSlideEl) return;

    const chars1 = activeSlideEl.querySelectorAll(".hero-heading-1 .char");
    const chars2 = activeSlideEl.querySelectorAll(".hero-heading-2 .char");
    const logo = activeSlideEl.querySelector(".dunas-logo");
    const desc = activeSlideEl.querySelector(".slider-contect-des");
    const btn = activeSlideEl.querySelector(".defult-btn a");

    const allActiveElements = [...chars1, ...chars2, logo, desc, btn].filter(Boolean);
    gsap.killTweensOf(allActiveElements);

    // 1. First Heading line characters drop DOWN from top (-100px) with stagger
    if (chars1.length > 0) {
      gsap.fromTo(
        chars1,
        { opacity: 0, y: -100, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.035,
          ease: "power3.out",
        }
      );
    }

    // 2. Second Heading line characters drop DOWN from top (-100px) with stagger
    if (chars2.length > 0) {
      gsap.fromTo(
        chars2,
        { opacity: 0, y: -100, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.035,
          delay: 0.15,
          ease: "power3.out",
        }
      );
    }

    // 3. Dunas Logo Image: Comes UP from bottom (+100px)
    if (logo) {
      gsap.fromTo(
        logo,
        { opacity: 0, y: 100, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: 0.25,
          ease: "power3.out",
        }
      );
    }

    // 4. Paragraph description: Comes UP from bottom (+100px)
    if (desc) {
      gsap.fromTo(
        desc,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.4,
          ease: "power3.out",
        }
      );
    }

    // 5. Action button: Comes UP from bottom (+100px)
    if (btn) {
      gsap.fromTo(
        btn,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: 0.55,
          ease: "power3.out",
        }
      );
    }
  }, [activeIndex]);

  const handleSlideTo = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Helper to split word into animated character spans
  const renderAnimatedWord = (word) => {
    return word.split("").map((char, index) => (
      <span key={index} className="char">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div className="boxed ltr" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }} ref={containerRef}>
      <div className="main-slider-wrpper">
        <Swiper
          ref={swiperRef}
          modules={[EffectFade, Autoplay, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={1200}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          onSlideChangeTransitionStart={(swiper) => setActiveIndex(swiper.realIndex)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="swiper slider__active"
        >
          {slides.map((slide) => (
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
                          {renderAnimatedWord(slide.titlePart1)}
                        </h1>
                        <h1 className="text-anime-3 hero-heading-2">
                          <img
                            src="/dunas-travel-logo.png"
                            alt="Dunas Travel"
                            className="dunas-logo"
                          />
                          {renderAnimatedWord(slide.titlePart2)}
                        </h1>
                        <p className="slider-contect-des">{slide.desc}</p>
                        <div className="hero-btn defult-btn">
                          <a href={slide.btnLink}>
                            {slide.btnText}
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
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="circle__video">
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
                          WATCH VIDEO &nbsp; WATCH VIDEO &nbsp; WATCH VIDEO &nbsp;
                        </textPath>
                      </text>
                    </g>
                  </svg>

                  <button
                    type="button"
                    className="circle-vide_btn popup-video"
                    onClick={() => setIsVideoOpen(true)}
                    aria-label="Play Video"
                  >
                    <span className="play-now">
                      <FaPlay style={{ fontSize: "11px", marginLeft: "2px" }} />
                    </span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Dots Navigation Thumbnail Bar */}
          <div className="travel-slider-dots">
            {slides.map((s, idx) => (
              <span
                key={s.id}
                onClick={() => handleSlideTo(idx)}
                className={`dot-slide ${activeIndex === idx ? "active" : ""}`}
                style={{ backgroundImage: `url('${s.bgImage}')` }}
              ></span>
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
            <iframe
              src="https://www.youtube.com/embed/COLrJumJeK0?autoplay=1"
              title="Dunas Travel Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
