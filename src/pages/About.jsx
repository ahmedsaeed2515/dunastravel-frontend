import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaCalendarAlt, FaSuitcase, FaUsers, FaMapMarkedAlt, FaGlobe, FaBuilding, FaNetworkWired, FaLanguage, FaGlobeAmericas, FaStoreAlt, FaComments, FaCertificate, FaHandshake, FaAward, FaClock, FaHeadset, FaUserTie, FaGlobeEurope, FaPlaneDeparture, FaPlaneArrival, FaBriefcase, FaUmbrellaBeach, FaQuoteRight, FaArrowRight, FaArrowLeft, FaCheckCircle, FaStar, FaRoute, FaCompass, FaShip, FaGem, FaTrophy, FaFutbol, FaNewspaper, FaUserMd, FaBullseye, FaLandmark, FaCrown, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { useCmsBlock } from '../hooks/useCmsBlock';
import AnimatedCounter from '../components/common/AnimatedCounter';
import TeamSection from '../components/about/TeamSection';
import CountryFlag from '../components/ui/CountryFlag';

const styles = `
  :root {
    --navy-deep: #081830;
    --navy: #0E2A52;
    --navy-mid: #16386B;
    --royal: #1C4587;
    --gold: #C9A227;
    --gold-light: #E8CB72;
    --gold-pale: #F4E6B8;
    --cream: #F8F3E6;
    --ivory: #FBF8F1;
    --ink: #0E1B2E;
    --ink-soft: #3C4A5E;
    --line: rgba(201, 162, 39, 0.28);
    --display: 'Cormorant Garamond', serif;
    --body: 'Jost', sans-serif;
    --mono: 'Space Grotesk', sans-serif;
  }
  .about-page ::selection { background: var(--gold-light); color: var(--navy-deep); }
  .about-page .eyebrow {
    font-family: var(--mono);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-size: 11px;
    color: var(--gold);
    font-weight: 600;
  }
  .about-page .hero {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%) !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 140px 6% 100px;
    overflow: hidden;
  }
  .about-page .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 12% 22%, rgba(232, 203, 114, .5) 0, transparent 60%),
      radial-gradient(1px 1px at 82% 18%, rgba(232, 203, 114, .4) 0, transparent 60%),
      radial-gradient(1.5px 1.5px at 64% 70%, rgba(232, 203, 114, .35) 0, transparent 60%),
      radial-gradient(1px 1px at 30% 80%, rgba(232, 203, 114, .4) 0, transparent 60%),
      radial-gradient(1px 1px at 92% 60%, rgba(232, 203, 114, .3) 0, transparent 60%);
    pointer-events: none;
  }
  .about-page .routes-wrap { width: min(860px, 90vw); margin: 12px auto 18px; position: relative; z-index: 2; }
  .about-page .hero-eyebrow { margin-bottom: 22px; position: relative; z-index: 2; }
  .about-page .hero h1 {
    font-family: var(--display);
    font-weight: 500;
    font-size: clamp(40px, 6vw, 78px);
    line-height: 1.06;
    color: var(--ivory);
    max-width: 920px;
    position: relative;
    z-index: 2;
  }
  .about-page .hero h1 em { font-style: italic; color: var(--gold-light); }
  .about-page .hero p.sub {
    margin-top: 24px;
    font-size: 16px;
    letter-spacing: 0.04em;
    color: rgba(248, 243, 230, 0.68);
    max-width: 560px;
    font-weight: 300;
    position: relative;
    z-index: 2;
  }
  .about-page .hero-stats {
    margin-top: 60px;
    display: flex;
    gap: 0;
    position: relative;
    z-index: 2;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .about-page .hero-stats div {
    padding: 22px 34px;
    text-align: center;
    border-right: 1px solid var(--line);
  }
  .about-page .hero-stats div:last-child { border-right: none; }
  .about-page .hero-stats .num {
    font-family: var(--mono);
    font-weight: 600;
    font-size: clamp(22px, 3vw, 32px);
    color: #ffffff;
  }
  .about-page .hero-stats .lbl {
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ffffff;
    margin-top: 6px;
  }
  .about-page .hero-stats .stat-icon {
    font-size: 22px;
    color: var(--gold);
    margin-bottom: 8px;
    display: block;
  }
  @media(max-width:700px) {
    .about-page .hero-stats { flex-wrap: wrap; }
    .about-page .hero-stats div { width: 50%; border-right: 1px solid var(--line); }
  }
  .about-page .hero-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -46%);
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(220px, 34vw, 560px);
    color: rgba(232, 203, 114, 0.045);
    letter-spacing: 0.02em;
    z-index: 1;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
  .about-page .scroll-cue {
    position: absolute;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(248, 243, 230, 0.5);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    z-index: 2;
  }
  .about-page .scroll-cue .line {
    width: 1px;
    height: 36px;
    background: linear-gradient(var(--gold), transparent);
    animation: cuemove 1.8s ease-in-out infinite;
  }
  @keyframes cuemove {
    0%, 100% { opacity: .2; }
    50% { opacity: 1; }
  }
  .about-page section { padding: 120px 8%; position: relative; }
  .about-page .section-light { background: var(--ivory); }
  .about-page .section-dark {
    background: linear-gradient(180deg, var(--navy-deep), var(--navy) 60%, var(--navy-deep));
    color: var(--ivory);
  }
  .about-page .section-head { max-width: 680px; margin-bottom: 64px; }
  .about-page .section-head h2 {
    font-family: var(--display);
    font-weight: 500;
    font-size: clamp(32px, 4vw, 50px);
    margin-top: 10px;
    line-height: 1.1;
  }
  .about-page .section-dark .section-head h2 { color: var(--ivory); }
  .about-page .section-light .section-head h2 { color: var(--navy-deep); }
  .about-page .rule {
    width: 64px;
    height: 2px;
    background: var(--gold);
    margin-top: 22px;
    position: relative;
  }
  .about-page .rule::after {
    content: '';
    position: absolute;
    left: 78px;
    top: -3px;
    width: 8px;
    height: 8px;
    background: var(--gold);
    transform: rotate(45deg);
  }
  .about-page .section-dark { position: relative; }
  .about-page #growth {
    background: linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%) !important;
    color: #FFFFFF !important;
  }
  .about-page #growth .eyebrow,
  .about-page #growth h2,
  .about-page #growth h2 *,
  .about-page #growth p,
  .about-page #growth .val,
  .about-page #growth .bar-yr {
    color: #FFFFFF !important;
  }
  .about-page .section-dark::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(1px 1px at 16% 28%, rgba(232, 203, 114, .20) 0, transparent 60%),
      radial-gradient(1px 1px at 76% 62%, rgba(232, 203, 114, .16) 0, transparent 60%),
      radial-gradient(1px 1px at 42% 85%, rgba(232, 203, 114, .14) 0, transparent 60%),
      radial-gradient(1px 1px at 90% 20%, rgba(232, 203, 114, .12) 0, transparent 60%);
  }
  .about-page .section-dark>* { position: relative; z-index: 1; }
  .about-page .who-grid {
    display: grid;
    grid-template-columns: 1.1fr .9fr;
    gap: 80px;
    align-items: start;
  }
  .about-page .who-lead-box {
    border-left: 4px solid var(--gold);
    padding-left: 20px;
    margin-bottom: 24px;
  }
  html[dir="rtl"] .about-page .who-lead-box,
  [dir="rtl"] .about-page .who-lead-box {
    border-left: none;
    border-right: 4px solid var(--gold);
    padding-left: 0;
    padding-right: 20px;
  }
  html:not(.dark) .about-page .who-grid p {
    font-size: 17.5px !important;
    line-height: 1.85 !important;
    color: #0E1B2E !important;
    font-weight: 500 !important;
    margin-bottom: 20px !important;
    letter-spacing: 0.01em !important;
  }
  html:not(.dark) .about-page .who-grid p b {
    color: #1E40AF !important;
    font-weight: 800 !important;
  }
  .dark .about-page .who-grid p {
    font-size: 17.5px !important;
    line-height: 1.85 !important;
    color: #F8FAFC !important;
    font-weight: 500 !important;
    margin-bottom: 20px !important;
    letter-spacing: 0.01em !important;
  }
  .dark .about-page .who-grid p b {
    color: #E8CB72 !important;
    font-weight: 800 !important;
  }
  .about-page .feature-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 14px;
  }
  /* Feature Cards & Grid in Section WHO */
  .about-page .features-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 28px;
  }
  .about-page .feature-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
  .about-page .feature-card-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  
  /* Light Mode Feature Cards */
  html:not(.dark) .about-page .feature-card {
    background: #FFFFFF !important;
    border: 1.5px solid rgba(28, 69, 135, 0.16) !important;
    padding: 22px 24px !important;
    border-radius: 14px !important;
    box-shadow: 0 6px 20px rgba(28, 69, 135, 0.06) !important;
    transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease !important;
    position: relative;
    overflow: hidden;
  }
  html:not(.dark) .about-page .feature-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 14px 32px rgba(201, 162, 39, 0.18) !important;
    border-color: var(--gold) !important;
  }
  html:not(.dark) .about-page .ft-icon-badge {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(28, 69, 135, 0.10) 0%, rgba(201, 162, 39, 0.12) 100%);
    border: 1px solid rgba(28, 69, 135, 0.22);
    color: #1E40AF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    transition: all .35s ease;
  }
  html:not(.dark) .about-page .feature-card:hover .ft-icon-badge {
    background: linear-gradient(135deg, #1E40AF 0%, #0E2A52 100%);
    color: #FFFFFF;
    border-color: var(--gold);
    transform: scale(1.08) rotate(3deg);
  }
  html:not(.dark) .about-page .feature-card .ftitle {
    font-family: var(--mono) !important;
    font-weight: 800 !important;
    font-size: 15.5px !important;
    letter-spacing: .05em !important;
    color: #1E40AF !important;
    text-transform: uppercase !important;
    margin: 0 !important;
  }
  html:not(.dark) .about-page .feature-card p {
    font-size: 15.5px !important;
    color: #0F172A !important;
    margin: 0 !important;
    line-height: 1.7 !important;
    font-weight: 600 !important;
  }

  /* Dark Mode Feature Cards */
  .dark .about-page .feature-card {
    background: linear-gradient(145deg, #142238 0%, #0E1B2E 100%) !important;
    border: 1.5px solid rgba(232, 203, 114, 0.3) !important;
    padding: 22px 24px !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
    transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease !important;
    position: relative;
    overflow: hidden;
  }
  .dark .about-page .feature-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 14px 32px rgba(232, 203, 114, 0.22) !important;
    border-color: #E8CB72 !important;
  }
  .dark .about-page .ft-icon-badge {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(232, 203, 114, 0.16) 0%, rgba(201, 162, 39, 0.06) 100%);
    border: 1px solid rgba(232, 203, 114, 0.35);
    color: #E8CB72;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    transition: all .35s ease;
  }
  .dark .about-page .feature-card:hover .ft-icon-badge {
    background: linear-gradient(135deg, #E8CB72 0%, #C9A227 100%);
    color: #081830;
    border-color: #E8CB72;
    transform: scale(1.08) rotate(3deg);
  }
  .dark .about-page .feature-card .ftitle {
    font-family: var(--mono) !important;
    font-weight: 800 !important;
    font-size: 15.5px !important;
    letter-spacing: .05em !important;
    color: #E8CB72 !important;
    text-transform: uppercase !important;
    margin: 0 !important;
  }
  .dark .about-page .feature-card p {
    font-size: 15.5px !important;
    color: #F8FAFC !important;
    margin: 0 !important;
    line-height: 1.7 !important;
    font-weight: 600 !important;
  }

  /* 24/7 Special Card Highlights */
  html:not(.dark) .about-page .service-247-card {
    background: linear-gradient(135deg, #FFFDF5 0%, #F4F7FC 100%) !important;
    border: 1.5px solid rgba(201, 162, 39, 0.45) !important;
  }
  .dark .about-page .service-247-card {
    background: linear-gradient(135deg, #182B46 0%, #0D192B 100%) !important;
    border: 1.5px solid rgba(232, 203, 114, 0.5) !important;
  }

  .about-page .live-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(34, 197, 94, 0.12);
    border: 1px solid rgba(34, 197, 94, 0.35);
    color: #15803D;
    letter-spacing: 0.05em;
  }
  .dark .about-page .live-status-pill {
    background: rgba(34, 197, 94, 0.18);
    border-color: rgba(34, 197, 94, 0.45);
    color: #4ADE80;
  }
  .about-page .pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22C55E;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    animation: pulseGlow 1.8s infinite;
  }
  @keyframes pulseGlow {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }

  /* Trade Shows & Executive Quote Showcase in Section WHO */
  .about-page .tradeshows-section {
    margin-top: 56px;
    border-top: 1px solid var(--line);
    padding-top: 48px;
  }
  .about-page .tradeshows-header {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .about-page .tradeshows-grid {
    display: grid !important;
    grid-template-columns: repeat(6, 1fr) !important;
    gap: 16px !important;
  }

  /* Light Mode Trade Show Cards */
  html:not(.dark) .about-page .ts-card {
    background: #FFFFFF !important;
    border: 1.5px solid rgba(28, 69, 135, 0.15) !important;
    border-radius: 14px !important;
    padding: 20px 18px !important;
    box-shadow: 0 6px 20px rgba(28, 69, 135, 0.06) !important;
    transition: all 0.35s ease !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    position: relative;
    overflow: hidden;
  }
  html:not(.dark) .about-page .ts-card:hover {
    transform: translateY(-5px) !important;
    border-color: var(--gold) !important;
    box-shadow: 0 14px 32px rgba(201, 162, 39, 0.22) !important;
  }
  html:not(.dark) .about-page .ts-flag-badge {
    display: flex;
    align-items: center;
  }
  html:not(.dark) .about-page .ts-icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(30, 64, 175, 0.08);
    border: 1px solid rgba(30, 64, 175, 0.2);
    color: #1E40AF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.35s ease;
  }
  html:not(.dark) .about-page .ts-card:hover .ts-icon-badge {
    background: linear-gradient(135deg, #1E40AF 0%, #0E2A52 100%);
    color: #FFFFFF;
    border-color: var(--gold);
    transform: scale(1.1) rotate(4deg);
  }
  html:not(.dark) .about-page .ts-card .ts-title {
    font-family: var(--mono) !important;
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #0E2A52 !important;
    margin-top: 16px !important;
    letter-spacing: 0.04em !important;
  }
  html:not(.dark) .about-page .ts-card .ts-location {
    font-size: 13.5px !important;
    color: #1E40AF !important;
    font-weight: 700 !important;
    margin-top: 4px !important;
  }

  /* Dark Mode Trade Show Cards */
  .dark .about-page .ts-card {
    background: linear-gradient(145deg, #142238 0%, #0E1B2E 100%) !important;
    border: 1.5px solid rgba(232, 203, 114, 0.3) !important;
    border-radius: 14px !important;
    padding: 20px 18px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
    transition: all 0.35s ease !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    position: relative;
    overflow: hidden;
  }
  .dark .about-page .ts-card:hover {
    transform: translateY(-5px) !important;
    border-color: #E8CB72 !important;
    box-shadow: 0 14px 32px rgba(232, 203, 114, 0.25) !important;
  }
  .dark .about-page .ts-icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(232, 203, 114, 0.12);
    border: 1px solid rgba(232, 203, 114, 0.3);
    color: #E8CB72;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.35s ease;
  }
  .dark .about-page .ts-card:hover .ts-icon-badge {
    background: linear-gradient(135deg, #E8CB72 0%, #C9A227 100%);
    color: #081830;
    border-color: #E8CB72;
    transform: scale(1.1) rotate(4deg);
  }
  .dark .about-page .ts-card .ts-title {
    font-family: var(--mono) !important;
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
    margin-top: 16px !important;
    letter-spacing: 0.04em !important;
  }
  .dark .about-page .ts-card .ts-location {
    font-size: 13.5px !important;
    color: #E8CB72 !important;
    font-weight: 700 !important;
    margin-top: 4px !important;
  }

  /* Section 05 — Why Choose Dunas Travel / Ultra Services Grid Styling */
  .about-page .ultra-services-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 28px !important;
    margin-top: 52px !important;
    position: relative;
    z-index: 2;
  }

  @media (max-width: 1200px) {
    .about-page .ultra-services-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 24px !important;
    }
  }

  @media (max-width: 640px) {
    .about-page .ultra-services-grid {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }
  }

  /* Ultra Service Card Base */
  .about-page .ultra-svc-card {
    position: relative !important;
    border-radius: 24px !important;
    padding: 36px 30px 32px 30px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    min-height: 380px !important;
    overflow: hidden !important;
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  /* Top Shimmering Beam on Hover */
  .about-page .ultra-svc-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 4px;
    background: linear-gradient(90deg, transparent, #F8C630, #FFC857, transparent);
    transition: transform 0.8s ease;
    transform: translateX(0);
    z-index: 10;
  }

  .about-page .ultra-svc-card:hover::before {
    transform: translateX(50%);
  }

  /* Large Background Watermark Number */
  .about-page .ultra-svc-card .watermark-num {
    position: absolute;
    top: -15px;
    right: 15px;
    font-family: var(--display) !important;
    font-size: 140px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    pointer-events: none;
    user-select: none;
    transition: all 0.5s ease !important;
    z-index: 0;
  }

  html[dir="rtl"] .about-page .ultra-svc-card .watermark-num,
  [dir="rtl"] .about-page .ultra-svc-card .watermark-num {
    right: auto;
    left: 15px;
  }

  /* Light Mode Ultra Card Styling */
  html:not(.dark) .about-page .ultra-svc-card {
    background: linear-gradient(165deg, #FFFFFF 0%, #F8FAFC 100%) !important;
    border: 1.5px solid rgba(28, 69, 135, 0.14) !important;
    box-shadow: 0 12px 36px rgba(28, 69, 135, 0.07) !important;
  }

  html:not(.dark) .about-page .ultra-svc-card .watermark-num {
    color: rgba(28, 69, 135, 0.05) !important;
  }

  html:not(.dark) .about-page .ultra-svc-card:hover {
    transform: translateY(-10px) scale(1.02) !important;
    border-color: rgba(201, 162, 39, 0.7) !important;
    box-shadow: 0 24px 54px rgba(201, 162, 39, 0.22) !important;
  }

  html:not(.dark) .about-page .ultra-svc-card:hover .watermark-num {
    color: rgba(201, 162, 39, 0.12) !important;
    transform: scale(1.08) translateY(-5px);
  }

  /* Dark Mode Ultra Card Styling */
  .dark .about-page .ultra-svc-card,
  html.dark .about-page .ultra-svc-card {
    background: linear-gradient(155deg, #13233C 0%, #081426 100%) !important;
    border: 1.5px solid rgba(248, 198, 48, 0.28) !important;
    box-shadow: 0 14px 42px rgba(0, 0, 0, 0.5) !important;
  }

  .dark .about-page .ultra-svc-card .watermark-num,
  html.dark .about-page .ultra-svc-card .watermark-num {
    color: rgba(248, 198, 48, 0.06) !important;
  }

  .dark .about-page .ultra-svc-card:hover,
  html.dark .about-page .ultra-svc-card:hover {
    transform: translateY(-10px) scale(1.02) !important;
    border-color: #F8C630 !important;
    box-shadow: 0 26px 60px rgba(248, 198, 48, 0.25) !important;
  }

  .dark .about-page .ultra-svc-card:hover .watermark-num,
  html.dark .about-page .ultra-svc-card:hover .watermark-num {
    color: rgba(248, 198, 48, 0.15) !important;
    transform: scale(1.08) translateY(-5px);
  }

  /* Header inside Card */
  .about-page .ultra-svc-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    position: relative;
    z-index: 2;
    margin-bottom: 24px !important;
  }

  .about-page .ultra-svc-num-tag {
    font-family: var(--mono) !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    letter-spacing: 0.12em !important;
    padding: 6px 14px !important;
    border-radius: 30px !important;
    transition: all 0.35s ease !important;
  }

  html:not(.dark) .about-page .ultra-svc-num-tag {
    background: rgba(28, 69, 135, 0.08) !important;
    color: #1E40AF !important;
    border: 1px solid rgba(28, 69, 135, 0.2) !important;
  }

  .dark .about-page .ultra-svc-num-tag,
  html.dark .about-page .ultra-svc-num-tag {
    background: rgba(248, 198, 48, 0.12) !important;
    color: #F8C630 !important;
    border: 1px solid rgba(248, 198, 48, 0.35) !important;
  }

  /* Glowing Expressive Icon Badge */
  .about-page .ultra-svc-icon-box {
    width: 48px !important;
    height: 48px !important;
    border-radius: 14px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 20px !important;
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative;
    z-index: 2;
  }

  html:not(.dark) .about-page .ultra-svc-icon-box {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(201, 162, 39, 0.15) 100%) !important;
    border: 1.5px solid rgba(30, 64, 175, 0.3) !important;
    color: #1E40AF !important;
  }

  html:not(.dark) .about-page .ultra-svc-card:hover .ultra-svc-icon-box {
    background: linear-gradient(135deg, #1E40AF 0%, #0E2A52 100%) !important;
    color: #FFFFFF !important;
    border-color: #C9A227 !important;
    transform: scale(1.15) rotate(8deg) !important;
    box-shadow: 0 10px 25px rgba(30, 64, 175, 0.35) !important;
  }

  .dark .about-page .ultra-svc-icon-box,
  html.dark .about-page .ultra-svc-icon-box {
    background: linear-gradient(135deg, rgba(248, 198, 48, 0.18) 0%, rgba(201, 162, 39, 0.1) 100%) !important;
    border: 1.5px solid rgba(248, 198, 48, 0.45) !important;
    color: #F8C630 !important;
  }

  .dark .about-page .ultra-svc-card:hover .ultra-svc-icon-box,
  html.dark .about-page .ultra-svc-card:hover .ultra-svc-icon-box {
    background: linear-gradient(135deg, #F8C630 0%, #C9A227 100%) !important;
    color: #081830 !important;
    border-color: #F8C630 !important;
    transform: scale(1.15) rotate(8deg) !important;
    box-shadow: 0 10px 30px rgba(248, 198, 48, 0.5) !important;
  }

  /* Title & Sub-Pill */
  .about-page .ultra-svc-content {
    position: relative;
    z-index: 2;
  }

  html:not(.dark) .about-page .ultra-svc-card .ultra-svc-title {
    font-family: var(--display) !important;
    font-size: 24px !important;
    font-weight: 700 !important;
    color: #0E2A52 !important;
    margin-bottom: 6px !important;
    line-height: 1.25 !important;
    transition: color 0.3s ease !important;
  }

  html:not(.dark) .about-page .ultra-svc-card:hover .ultra-svc-title {
    color: #1E40AF !important;
  }

  .dark .about-page .ultra-svc-card .ultra-svc-title,
  html.dark .about-page .ultra-svc-card .ultra-svc-title {
    font-family: var(--display) !important;
    font-size: 24px !important;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    margin-bottom: 6px !important;
    line-height: 1.25 !important;
    transition: color 0.3s ease !important;
  }

  .dark .about-page .ultra-svc-card:hover .ultra-svc-title,
  html.dark .about-page .ultra-svc-card:hover .ultra-svc-title {
    color: #F8C630 !important;
  }

  .about-page .ultra-svc-tag-pill {
    display: inline-block !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    padding: 3px 10px !important;
    border-radius: 6px !important;
    margin-bottom: 12px !important;
  }

  html:not(.dark) .about-page .ultra-svc-tag-pill {
    background: rgba(30, 64, 175, 0.07) !important;
    color: #1E40AF !important;
  }

  .dark .about-page .ultra-svc-tag-pill,
  html.dark .about-page .ultra-svc-tag-pill {
    background: rgba(248, 198, 48, 0.1) !important;
    color: #F8C630 !important;
  }

  html:not(.dark) .about-page .ultra-svc-card p {
    font-size: 14.5px !important;
    line-height: 1.65 !important;
    color: #475569 !important;
    margin-bottom: 20px !important;
    font-weight: 500 !important;
  }

  .dark .about-page .ultra-svc-card p,
  html.dark .about-page .ultra-svc-card p {
    font-size: 14.5px !important;
    line-height: 1.65 !important;
    color: #94A3B8 !important;
    margin-bottom: 20px !important;
    font-weight: 400 !important;
  }

  /* Card Bottom Footer: Stats & Explore Button */
  .about-page .ultra-svc-footer {
    position: relative;
    z-index: 2;
    border-top: 1px solid rgba(200, 200, 200, 0.15);
    padding-top: 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .dark .about-page .ultra-svc-footer,
  html.dark .about-page .ultra-svc-footer {
    border-top-color: rgba(248, 198, 48, 0.2) !important;
  }

  .about-page .ultra-svc-stats-pill {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
  }

  html:not(.dark) .about-page .ultra-svc-stats-pill {
    color: #1E40AF !important;
  }

  .dark .about-page .ultra-svc-stats-pill,
  html.dark .about-page .ultra-svc-stats-pill {
    color: #F8C630 !important;
  }

  .about-page .ultra-svc-link {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    transition: all 0.3s ease !important;
    text-decoration: none !important;
  }

  html:not(.dark) .about-page .ultra-svc-link {
    color: #0E2A52 !important;
  }

  html:not(.dark) .about-page .ultra-svc-card:hover .ultra-svc-link {
    color: #1E40AF !important;
    transform: translateX(4px);
  }

  html[dir="rtl"]:not(.dark) .about-page .ultra-svc-card:hover .ultra-svc-link,
  [dir="rtl"]:not(.dark) .about-page .ultra-svc-card:hover .ultra-svc-link {
    transform: translateX(-4px);
  }

  .dark .about-page .ultra-svc-link,
  html.dark .about-page .ultra-svc-link {
    color: #F8C630 !important;
  }

  .dark .about-page .ultra-svc-card:hover .ultra-svc-link,
  html.dark .about-page .ultra-svc-card:hover .ultra-svc-link {
    color: #FFE082 !important;
    transform: translateX(4px);
  }

  html[dir="rtl"].dark .about-page .ultra-svc-card:hover .ultra-svc-link,
  html[dir="rtl"] .dark .about-page .ultra-svc-card:hover .ultra-svc-link,
  [dir="rtl"] .dark .about-page .ultra-svc-card:hover .ultra-svc-link {
    transform: translateX(-4px);
  }

  .about-page .ts-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Executive Quote Block Styling */
  .about-page .executive-quote-card {
    margin-top: 46px;
    position: relative;
    padding: 38px 44px;
    border-radius: 18px;
    overflow: hidden;
    transition: all 0.35s ease;
    z-index: 1;
  }
  html:not(.dark) .about-page .executive-quote-card {
    background: linear-gradient(135deg, #0A1C38 0%, #0E2A52 60%, #16386B 100%) !important;
    color: #F8F3E6 !important;
    border: 1.5px solid rgba(201, 162, 39, 0.4) !important;
    box-shadow: 0 16px 40px rgba(14, 42, 82, 0.25) !important;
  }
  .dark .about-page .executive-quote-card,
  html.dark .about-page .executive-quote-card {
    background: linear-gradient(135deg, #0A1C38 0%, #142238 60%, #081830 100%) !important;
    color: #F8F3E6 !important;
    border: 1.5px solid rgba(232, 203, 114, 0.45) !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5) !important;
  }
  .about-page .quote-icon-watermark {
    position: absolute;
    top: -15px;
    right: 25px;
    font-size: 130px;
    color: rgba(248, 198, 48, 0.22) !important;
    pointer-events: none;
    line-height: 1;
    z-index: 0 !important;
    filter: drop-shadow(0 0 15px rgba(248, 198, 48, 0.35));
  }
  .dark .about-page .quote-icon-watermark,
  html.dark .about-page .quote-icon-watermark {
    color: rgba(248, 198, 48, 0.28) !important;
    z-index: 0 !important;
    filter: drop-shadow(0 0 18px rgba(248, 198, 48, 0.45));
  }
  .about-page .quote-mark-gold {
    color: #F8C630 !important;
    font-size: 1.35em !important;
    font-weight: 800 !important;
    font-family: Georgia, serif !important;
    display: inline-block !important;
    margin: 0 4px !important;
    text-shadow: 0 0 12px rgba(248, 198, 48, 0.6) !important;
    vertical-align: middle !important;
  }
  html[dir="rtl"] .about-page .quote-icon-watermark,
  [dir="rtl"] .about-page .quote-icon-watermark {
    right: auto;
    left: 25px;
  }
  .about-page .executive-quote-card p {
    font-family: var(--display) !important;
    font-style: italic !important;
    font-size: clamp(20px, 2.4vw, 28px) !important;
    line-height: 1.55 !important;
    color: #FFFFFF !important;
    font-weight: 500 !important;
    margin: 0 0 20px 0 !important;
    position: relative !important;
    z-index: 10 !important;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7) !important;
  }
  .dark .about-page .executive-quote-card p,
  html.dark .about-page .executive-quote-card p {
    color: #FFFFFF !important;
    position: relative !important;
    z-index: 10 !important;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8) !important;
  }
  .about-page .quote-author-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    border-top: 1px solid rgba(232, 203, 114, 0.25);
    padding-top: 16px;
    position: relative !important;
    z-index: 10 !important;
  }
  .about-page .quote-author-name {
    font-family: var(--mono) !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    color: var(--gold-light) !important;
  }
  .about-page .quote-author-tag {
    font-size: 12px !important;
    color: rgba(248, 243, 230, 0.65) !important;
    font-weight: 400 !important;
  }

  @media (max-width: 1200px) {
    .about-page .tradeshows-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .about-page .tradeshows-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .about-page .executive-quote-card { padding: 28px 24px !important; }
  }
  @media (max-width: 480px) {
    .about-page .tradeshows-grid { grid-template-columns: 1fr !important; }
  }
  .about-page .presence-box {
    background: linear-gradient(145deg, #0A1C38 0%, #0E2A52 100%);
    color: var(--ivory);
    padding: 34px 28px;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(232, 203, 114, 0.25);
    box-shadow: 0 12px 36px rgba(10, 28, 56, 0.4);
  }
  .about-page .presence-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
    border-bottom: 1px solid rgba(232, 203, 114, 0.2);
    padding-bottom: 14px;
  }
  .about-page .presence-main-icon {
    font-size: 24px;
    color: var(--gold-light);
  }
  .about-page .presence-box h3 {
    font-family: var(--display);
    font-size: 24px;
    font-weight: 600;
    color: var(--gold-light);
    margin: 0;
    letter-spacing: 0.02em;
  }
  .about-page .presence-cards-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    z-index: 1;
  }
  .about-page .presence-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(232, 203, 114, 0.15);
    border-radius: 12px;
    padding: 16px 18px;
    transition: all 0.3s ease;
  }
  .about-page .presence-card:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }
  .about-page .presence-card-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }
  .about-page .card-icon-badge {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    color: var(--gold-light);
    background: linear-gradient(135deg, rgba(232, 203, 114, 0.22) 0%, rgba(201, 162, 39, 0.08) 100%);
    border: 1px solid rgba(232, 203, 114, 0.35);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  .about-page .presence-card:hover .card-icon-badge {
    transform: scale(1.1) rotate(4deg);
    border-color: var(--gold-light);
    background: linear-gradient(135deg, rgba(232, 203, 114, 0.35) 0%, rgba(201, 162, 39, 0.18) 100%);
    box-shadow: 0 6px 16px rgba(232, 203, 114, 0.3);
  }
  .about-page .presence-card-head h4 {
    font-family: var(--mono);
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ivory);
    margin: 0;
  }
  .about-page .presence-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .about-page .p-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(232, 203, 114, 0.09);
    border: 1px solid rgba(232, 203, 114, 0.22);
    color: #F8F3E6;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.25s ease;
    cursor: default;
  }
  .about-page .p-badge:hover {
    background: rgba(232, 203, 114, 0.22);
    border-color: var(--gold-light);
    transform: scale(1.04);
    color: #FFFFFF;
  }
  .about-page .flag-emoji {
    font-size: 15px;
    line-height: 1;
  }
  /* Stats Strip Card Styling - Light & Dark Mode */
  .about-page .stats-strip {
    display: grid !important;
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 16px !important;
    margin-top: 60px !important;
    border: none !important;
  }
  
  /* Light Mode Stat Cards */
  html:not(.dark) .about-page .stats-strip .stat-cell {
    background: #FFFFFF !important;
    border: 1.5px solid rgba(28, 69, 135, 0.15) !important;
    border-radius: 12px !important;
    padding: 30px 16px !important;
    box-shadow: 0 8px 24px rgba(28, 69, 135, 0.08) !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
  }
  html:not(.dark) .about-page .stats-strip .stat-cell:hover {
    transform: translateY(-6px) !important;
    border-color: var(--gold) !important;
    box-shadow: 0 14px 32px rgba(201, 162, 39, 0.22) !important;
  }
  html:not(.dark) .about-page .stats-strip .stat-cell .stat-icon {
    color: #1E40AF !important;
    font-size: 28px !important;
  }
  html:not(.dark) .about-page .stats-strip .stat-cell .n {
    color: #0E2A52 !important;
    font-weight: 800 !important;
    font-size: clamp(26px, 2.5vw, 36px) !important;
  }
  html:not(.dark) .about-page .stats-strip .stat-cell .l {
    color: #1E40AF !important;
    font-weight: 700 !important;
    font-size: 11px !important;
    letter-spacing: 0.08em !important;
  }

  /* Stats Strip Card Base & Perfect Centering */
  .about-page .stats-strip .stat-cell {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }
  .about-page .stats-strip .stat-cell .stat-icon {
    display: block !important;
    margin: 0 auto 10px auto !important;
    text-align: center !important;
  }
  .about-page .stats-strip .stat-cell .n {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    width: 100% !important;
    margin: 0 auto !important;
    line-height: 1.1 !important;
  }
  .about-page .stats-strip .stat-cell .l {
    display: block !important;
    text-align: center !important;
    margin: 8px auto 0 auto !important;
    width: 100% !important;
  }

  /* Dark Mode Stat Cards */
  .dark .about-page .stats-strip .stat-cell {
    background: #142238 !important;
    border: 1.5px solid rgba(232, 203, 114, 0.3) !important;
    border-radius: 12px !important;
    padding: 30px 16px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
  }
  .dark .about-page .stats-strip .stat-cell:hover {
    transform: translateY(-6px) !important;
    border-color: #E8CB72 !important;
    box-shadow: 0 14px 32px rgba(232, 203, 114, 0.25) !important;
  }
  .dark .about-page .stats-strip .stat-cell .stat-icon {
    color: #E8CB72 !important;
    font-size: 28px !important;
  }
  .dark .about-page .stats-strip .stat-cell .n {
    color: #FFFFFF !important;
    font-weight: 800 !important;
    font-size: clamp(26px, 2.5vw, 36px) !important;
  }
  .dark .about-page .stats-strip .stat-cell .l {
    color: #E8CB72 !important;
    font-weight: 700 !important;
    font-size: 11px !important;
    letter-spacing: 0.08em !important;
  }

  @media(max-width:900px) {
    .about-page .stats-strip { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
  }
  @media(max-width:480px) {
    .about-page .stats-strip { grid-template-columns: 1fr !important; }
  }
  .about-page .chart-wrap {
    display: grid;
    grid-template-columns: .85fr 1.15fr;
    gap: 70px;
    align-items: center;
  }
  .about-page .chart {
    display: flex;
    align-items: flex-end;
    gap: 22px;
    height: 300px;
    padding: 0 6px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  .about-page .bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
    justify-content: flex-end;
  }
  .about-page .bar {
    width: 100%;
    max-width: 46px;
    background: linear-gradient(180deg, var(--gold-light), var(--gold));
    border-radius: 3px 3px 0 0;
    position: relative;
    box-shadow: 0 0 0 1px rgba(201, 162, 39, .25);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 1.1s cubic-bezier(.2, .9, .25, 1);
  }
  .about-page .bar .val {
    position: absolute;
    top: -26px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--gold-light);
    white-space: nowrap;
  }
  .about-page .route{stroke-dasharray:260;stroke-dashoffset:260;animation:drawRoute 2.4s ease forwards;}
  .about-page #r2{animation-delay:.15s;} .about-page #r3{animation-delay:.3s;} .about-page #r4{animation-delay:.45s;} .about-page #r5{animation-delay:.6s;} .about-page #r6{animation-delay:.75s;}
  @keyframes drawRoute{to{stroke-dashoffset:0;}}
  .about-page .bar-yr {
    margin-top: 12px;
    font-size: 11px;
    letter-spacing: .06em;
    color: rgba(248, 243, 230, .55);
    font-family: var(--mono);
  }
  .about-page .inst-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 20px !important;
    background: transparent !important;
    border: none !important;
  }
  html:not(.dark) .about-page .inst-cell {
    background: #FFFFFF !important;
    border: 1.5px solid rgba(28, 69, 135, 0.16) !important;
    border-radius: 14px !important;
    padding: 30px 22px !important;
    box-shadow: 0 8px 24px rgba(28, 69, 135, 0.07) !important;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease !important;
    display: flex !important;
    flex-direction: column !important;
  }
  html:not(.dark) .about-page .inst-cell:hover {
    transform: translateY(-6px) !important;
    border-color: var(--gold) !important;
    box-shadow: 0 16px 36px rgba(201, 162, 39, 0.2) !important;
  }
  .about-page .inst-icon-badge {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 18px;
    transition: all 0.3s ease;
  }
  html:not(.dark) .about-page .inst-icon-badge {
    background: rgba(30, 64, 175, 0.08);
    color: #1E40AF;
    border: 1px solid rgba(30, 64, 175, 0.2);
  }
  .dark .about-page .inst-icon-badge {
    background: rgba(232, 203, 114, 0.12);
    color: #E8CB72;
    border: 1px solid rgba(232, 203, 114, 0.3);
  }
  .about-page .inst-cell:hover .inst-icon-badge {
    transform: scale(1.1) rotate(4deg);
  }
  html:not(.dark) .about-page .inst-cell:hover .inst-icon-badge {
    background: rgba(201, 162, 39, 0.15);
    color: #C9A227;
    border-color: #C9A227;
  }
  .dark .about-page .inst-cell:hover .inst-icon-badge {
    background: rgba(232, 203, 114, 0.25);
    color: #FFFFFF;
    border-color: #E8CB72;
  }
  .about-page .inst-cell .ic-label {
    font-family: var(--mono);
    font-size: 12px !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase;
    color: #1E40AF;
    font-weight: 800 !important;
    margin-bottom: 8px !important;
  }
  .about-page .inst-cell h4 {
    font-family: var(--display);
    font-size: 22px !important;
    color: #0E2A52;
    font-weight: 800 !important;
    line-height: 1.25 !important;
    margin-bottom: 10px !important;
  }
  .about-page .inst-cell p {
    font-size: 14.5px !important;
    color: #1E293B !important;
    line-height: 1.65 !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  .about-page .quote-block {
    margin-top: 60px;
    border-left: 3px solid var(--gold);
    padding: 6px 0 6px 36px;
    position: relative;
  }
  .about-page .quote-block::before {
    content: '\\201C';
    position: absolute;
    left: 18px;
    top: -58px;
    font-family: var(--display);
    font-size: 140px;
    font-weight: 600;
    color: var(--gold-pale);
    line-height: 1;
    z-index: 0;
  }
  .about-page .quote-block p {
    font-family: var(--display);
    font-style: italic;
    font-size: clamp(22px, 2.6vw, 30px);
    color: var(--navy-deep);
    line-height: 1.5;
    font-weight: 500;
    max-width: 740px;
    position: relative;
    z-index: 1;
  }
  .about-page .quote-block span {
    display: block;
    margin-top: 16px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  /* Section 03 #institutional Royal Blue text rules in Light Mode - Ultra Clear & Bold */
  html:not(.dark) .about-page #institutional .section-head .eyebrow,
  html:not(.dark) .about-page #institutional .ic-label.eyebrow {
    color: #1E40AF !important;
    font-weight: 800 !important;
    letter-spacing: 0.22em !important;
  }
  html:not(.dark) .about-page #institutional .inst-cell .ic-label {
    color: #1E40AF !important;
    font-weight: 800 !important;
  }
  html:not(.dark) .about-page #institutional .inst-cell h4 {
    color: #0E2A52 !important;
    font-weight: 800 !important;
  }
  html:not(.dark) .about-page #institutional .inst-cell p {
    color: #1E293B !important;
    font-weight: 600 !important;
  }
  html:not(.dark) .about-page #institutional .tradeshow-chip {
    color: #1E40AF !important;
    font-weight: 700 !important;
    border: 1.5px solid rgba(30, 64, 175, 0.4) !important;
    background: #F0F5FF !important;
    box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08) !important;
  }
  html:not(.dark) .about-page #institutional .quote-block {
    border-left: 4px solid #1E40AF !important;
  }
  html:not(.dark) .about-page #institutional .quote-block p {
    color: #1E40AF !important;
    font-weight: 600 !important;
  }
  html:not(.dark) .about-page #institutional .quote-block span {
    color: #1E40AF !important;
    font-weight: 700 !important;
    letter-spacing: 0.15em !important;
  }

  /* Team Section (#team) Background Light & Dark Mode */
  html:not(.dark) #team {
    background: linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%) !important;
  }
  .dark #team {
    background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #0F172A 100%) !important;
  }

  /* Section 03 #institutional Dark Mode Card & Text Clarity */
  .dark .about-page #institutional .inst-grid {
    background: transparent !important;
    border: none !important;
    gap: 20px !important;
  }
  .dark .about-page #institutional .inst-cell {
    background: #142238 !important;
    border: 1.5px solid rgba(232, 203, 114, 0.35) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    padding: 30px 22px !important;
    transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease !important;
    display: flex !important;
    flex-direction: column !important;
  }
  .dark .about-page #institutional .inst-cell:hover {
    transform: translateY(-6px) !important;
    border-color: #E8CB72 !important;
    box-shadow: 0 16px 36px rgba(232, 203, 114, 0.25) !important;
  }
  .dark .about-page #institutional .inst-cell .ic-label {
    color: #E8CB72 !important;
    font-weight: 800 !important;
  }
  .dark .about-page #institutional .inst-cell h4 {
    color: #FFFFFF !important;
    font-weight: 800 !important;
  }
  .dark .about-page #institutional .inst-cell p {
    color: #F8FAFC !important;
    font-weight: 500 !important;
  }

  .dark .about-page #institutional .tradeshow-chip {
    background: #182842 !important;
    color: #93C5FD !important;
    border: 1.5px solid rgba(147, 197, 253, 0.35) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3) !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
  }
  .dark .about-page #institutional .tradeshow-chip:hover {
    background: #1E3A8A !important;
    color: #FFFFFF !important;
    border-color: #60A5FA !important;
    transform: translateY(-2px) !important;
  }

  .dark .about-page #institutional .quote-block {
    border-left: 4px solid var(--gold) !important;
    background: rgba(20, 34, 56, 0.6) !important;
    padding: 24px 28px 24px 36px !important;
    border-radius: 0 8px 8px 0 !important;
  }
  .dark .about-page #institutional .quote-block p {
    color: #FFFFFF !important;
    font-weight: 500 !important;
  }
  .dark .about-page #institutional .quote-block span {
    color: var(--gold-light) !important;
    font-weight: 700 !important;
  }
  /* High-Impact Events & Congresses Section (#events) */
  .high-impact-events-section {
    position: relative;
    padding: 100px 6%;
    background: linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%) !important;
    overflow: hidden;
    color: #FFFFFF;
  }

  /* Ambient Glow Spheres */
  .about-page .events-bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 1;
    opacity: 0.45;
  }
  .about-page .events-bg-glow-1 {
    top: -10%;
    left: 20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(201, 162, 39, 0.25) 0%, transparent 70%);
  }
  .about-page .events-bg-glow-2 {
    bottom: -10%;
    right: 15%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(30, 64, 175, 0.3) 0%, transparent 70%);
  }

  /* Watermark Typography */
  .about-page .events-watermark {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--mono);
    font-size: clamp(40px, 8vw, 120px);
    font-weight: 900;
    color: rgba(255, 255, 255, 0.02);
    letter-spacing: 0.2em;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
    z-index: 0;
  }

  /* Badge Pill */
  .about-page .events-badge-pill {
    background: rgba(248, 198, 48, 0.12);
    border: 1px solid rgba(248, 198, 48, 0.35);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(248, 198, 48, 0.15);
  }

  /* Metrics Cards */
  .about-page .events-metric-card {
    background: rgba(14, 42, 82, 0.45);
    border: 1px solid rgba(201, 162, 39, 0.25);
    border-radius: 16px;
    padding: 20px 16px;
    text-align: center;
    backdrop-filter: blur(12px);
    transition: all 0.35s ease;
  }
  .about-page .events-metric-card:hover {
    transform: translateY(-5px);
    border-color: rgba(248, 198, 48, 0.6);
    background: rgba(22, 56, 107, 0.65);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(248, 198, 48, 0.2);
  }
  .about-page .events-metric-card .metric-icon {
    font-size: 20px;
    color: #F8C630;
    margin-bottom: 8px;
    display: inline-block;
  }
  .about-page .events-metric-card .metric-val {
    font-family: var(--display);
    font-size: 28px;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.1;
  }
  .about-page .events-metric-card .metric-lbl {
    font-size: 12px;
    color: #94A3B8;
    margin-top: 4px;
    font-weight: 500;
  }

  /* Flagship Event Card */
  .about-page .flagship-event-card {
    background: linear-gradient(135deg, rgba(22, 56, 107, 0.75) 0%, rgba(14, 42, 82, 0.85) 100%);
    border: 1.5px solid rgba(248, 198, 48, 0.45);
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(248, 198, 48, 0.15);
  }
  .about-page .flagship-glow-accent {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(248, 198, 48, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .about-page .flagship-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(8, 24, 48, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 12.5px;
    color: #E2E8F0;
    font-weight: 500;
  }

  /* Event Lux Cards (Grid) */
  .about-page .event-lux-card {
    background: rgba(14, 42, 82, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
  .about-page .event-lux-card:hover {
    border-color: rgba(248, 198, 48, 0.4);
    background: rgba(22, 56, 107, 0.6);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), 0 0 25px rgba(248, 198, 48, 0.12);
  }
  .about-page .card-ambient-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }
  .about-page .event-lux-card:hover .card-ambient-glow {
    opacity: 1;
  }
  .about-page .event-year-badge {
    border: 1px solid;
    backdrop-filter: blur(4px);
  }

  /* Footer Banner */
  .about-page .events-footer-banner {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.25) 0%, rgba(14, 42, 82, 0.6) 100%);
    border: 1px solid rgba(201, 162, 39, 0.35);
    backdrop-filter: blur(12px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }

  /* Section 02 — Sustained Growth Styling (#growth) */
  .growth-ultra-section {
    position: relative;
    padding: 100px 6%;
    background: linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%) !important;
    overflow: hidden;
    color: #FFFFFF;
  }
  .about-page .growth-bg-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(130px);
    pointer-events: none;
    z-index: 1;
    opacity: 0.35;
  }
  .about-page .growth-glow-1 {
    top: 10%;
    left: -10%;
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(30, 64, 175, 0.35) 0%, transparent 70%);
  }
  .about-page .growth-glow-2 {
    bottom: 5%;
    right: -5%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(248, 198, 48, 0.22) 0%, transparent 70%);
  }
  .about-page .growth-badge-pill {
    background: rgba(248, 198, 48, 0.12);
    border: 1px solid rgba(248, 198, 48, 0.35);
    backdrop-filter: blur(8px);
  }
  .about-page .growth-summary-card {
    background: rgba(14, 42, 82, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    transition: all 0.35s ease;
  }
  .about-page .growth-summary-card:hover {
    transform: translateY(-5px);
    border-color: rgba(248, 198, 48, 0.5);
    background: rgba(22, 56, 107, 0.6);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35), 0 0 20px rgba(248, 198, 48, 0.15);
  }
  .about-page .featured-surge-card {
    background: linear-gradient(135deg, rgba(22, 56, 107, 0.75) 0%, rgba(14, 42, 82, 0.85) 100%);
    border: 1.5px solid rgba(248, 198, 48, 0.45);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35), 0 0 25px rgba(248, 198, 48, 0.2);
  }
  .about-page .growth-chart-showcase {
    background-image: url('https://res.cloudinary.com/tibx70zb/image/upload/v1791335276/e3d1daae-4fd9-4e1b-bf30-a7098dfeb6f6_compressed_gcnchj.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px solid rgba(201, 162, 39, 0.35);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  }
  .about-page .chart-grid-backdrop {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 100% 40px;
    pointer-events: none;
  }
  .about-page .bar-cap-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 4px 4px 0 0;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
  .about-page .bar-peak-glowing {
    animation: barPulseGlow 3s infinite alternate;
  }
  @keyframes barPulseGlow {
    0% { box-shadow: 0 0 15px rgba(248, 198, 48, 0.4); }
    100% { box-shadow: 0 0 35px rgba(248, 198, 48, 0.8); }
  }

  /* High Contrast Chart Text & Numbers Backdrops */
  .about-page .bar-val-chip span {
    background: rgba(8, 24, 48, 0.92) !important;
    color: #F8C630 !important;
    border: 1px solid rgba(248, 198, 48, 0.5) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  }
  .about-page .bar-surge-tag {
    background: rgba(8, 24, 48, 0.9) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  }
  .about-page .bar-year-lbl {
    background: rgba(8, 24, 48, 0.9) !important;
    color: #FFFFFF !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 3px 10px !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
  }


  /* Services Grid (.svc-card) Light & Dark Mode */
  .about-page .services-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 20px !important;
    background: transparent !important;
    border: none !important;
    margin-bottom: 90px !important;
  }

  /* Light Mode Services Cards */
  html:not(.dark) .about-page .svc-card {
    background: #FFFFFF !important;
    border: 1.5px solid rgba(28, 69, 135, 0.16) !important;
    border-radius: 12px !important;
    padding: 36px 28px !important;
    min-height: 220px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    box-shadow: 0 8px 24px rgba(28, 69, 135, 0.08) !important;
    transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease, background .35s ease !important;
  }
  html:not(.dark) .about-page .svc-card:hover {
    transform: translateY(-6px) !important;
    border-color: #C9A227 !important;
    box-shadow: 0 16px 36px rgba(201, 162, 39, 0.22) !important;
  }
  html:not(.dark) .about-page .svc-num {
    font-family: var(--mono) !important;
    font-size: 14px !important;
    color: #C9A227 !important;
    font-weight: 800 !important;
  }
  html:not(.dark) .about-page .svc-title {
    font-family: var(--display) !important;
    font-size: 24px !important;
    color: #1E40AF !important;
    margin-top: 24px !important;
    font-weight: 700 !important;
  }
  html:not(.dark) .about-page .svc-card p {
    font-size: 14px !important;
    color: #1E40AF !important;
    margin-top: 10px !important;
    font-weight: 600 !important;
    line-height: 1.65 !important;
  }

  /* Dark Mode Services Cards */
  .dark .about-page .svc-card {
    background: #142238 !important;
    border: 1.5px solid rgba(232, 203, 114, 0.35) !important;
    border-radius: 12px !important;
    padding: 36px 28px !important;
    min-height: 220px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease, background .35s ease !important;
  }
  .dark .about-page .svc-card:hover {
    transform: translateY(-6px) !important;
    border-color: #E8CB72 !important;
    box-shadow: 0 16px 36px rgba(232, 203, 114, 0.25) !important;
    background: #1A2E4C !important;
  }
  .dark .about-page .svc-num {
    font-family: var(--mono) !important;
    font-size: 14px !important;
    color: #E8CB72 !important;
    font-weight: 800 !important;
  }
  .dark .about-page .svc-title {
    font-family: var(--display) !important;
    font-size: 24px !important;
    color: #FFFFFF !important;
    margin-top: 24px !important;
    font-weight: 700 !important;
  }
  .dark .about-page .svc-card p {
    font-size: 14px !important;
    color: #CBD5E1 !important;
    margin-top: 10px !important;
    font-weight: 500 !important;
    line-height: 1.65 !important;
  }
  .about-page .values-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
  }
  .about-page .value-item {
    text-align: left;
    border-top: 2px solid var(--gold);
    padding-top: 16px;
  }
  html:not(.dark) .about-page .value-item .vt {
    font-family: var(--display) !important;
    font-size: 19px !important;
    color: #1E40AF !important;
    font-weight: 700 !important;
  }
  html:not(.dark) .about-page .value-item .vd {
    font-size: 13px !important;
    color: #1E40AF !important;
    margin-top: 6px !important;
    font-weight: 600 !important;
  }
  .dark .about-page .value-item .vt {
    font-family: var(--display) !important;
    font-size: 19px !important;
    color: #F8F3E6 !important;
    font-weight: 700 !important;
  }
  .dark .about-page .value-item .vd {
    font-size: 13px !important;
    color: #CBD5E1 !important;
    margin-top: 6px !important;
    font-weight: 500 !important;
  }
  /* Responsive Layout for Section #services (05 — WHY CHOOSE DUNAS TRAVEL) */
  @media (max-width: 1024px) {
    .about-page .services-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 16px !important;
      margin-bottom: 60px !important;
    }
    .about-page .values-row {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
  }

  @media (max-width: 640px) {
    .about-page #services {
      padding-top: 40px !important;
      padding-bottom: 40px !important;
    }
    .about-page #services .section-head h2 {
      font-size: 22px !important;
      line-height: 1.3 !important;
    }
    .about-page #services .eyebrow {
      font-size: 11px !important;
      letter-spacing: 0.1em !important;
    }
    .about-page .services-grid {
      grid-template-columns: 1fr !important;
      gap: 14px !important;
      margin-bottom: 36px !important;
    }
    .about-page .svc-card {
      padding: 24px 20px !important;
      min-height: auto !important;
      border-radius: 12px !important;
    }
    .about-page .svc-title {
      font-size: 19px !important;
      margin-top: 14px !important;
    }
    .about-page .svc-card p {
      font-size: 13.5px !important;
      margin-top: 8px !important;
    }
    .about-page .values-row {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    .about-page .value-item {
      padding-top: 12px !important;
    }
    .about-page .value-item .vt {
      font-size: 17px !important;
    }
    .about-page .value-item .vd {
      font-size: 12.5px !important;
      margin-top: 4px !important;
    }
  }

  .about-page .tradeshow-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .about-page .tradeshow-chip {
    border: 1px solid rgba(14, 42, 82, .18);
    padding: 14px 24px;
    border-radius: 30px;
    font-family: var(--mono);
    font-size: 12.5px;
    letter-spacing: .04em;
    color: var(--navy);
    background: var(--cream);
    transition: border-color .3s ease, transform .3s ease;
  }
  .about-page .tradeshow-chip:hover {
    border-color: var(--gold);
    transform: translateY(-2px);
  }

  /* Page Entrance Fade-In Animation */
  .about-page {
    animation: aboutPageFadeIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes aboutPageFadeIn {
    0% {
      opacity: 0;
      transform: translateY(14px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Hero Section Staggered Entrance */
  .about-page .hero-eyebrow {
    animation: heroItemFadeIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
  }
  .about-page .hero h1 {
    animation: heroItemFadeIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
  }
  .about-page .hero p.sub {
    animation: heroItemFadeIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
  }
  .about-page .routes-wrap {
    animation: heroItemFadeIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.48s both;
  }
  .about-page .hero-stats {
    animation: heroItemFadeIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
  }

  @keyframes heroItemFadeIn {
    0% {
      opacity: 0;
      transform: translateY(22px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scroll Reveal & Staggered Elements */
  .about-page .reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
  }
  .about-page .reveal.in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Staggered card entrance inside revealed containers */
  .about-page .reveal.in .ultra-svc-card:nth-child(1),
  .about-page .reveal.in .inst-cell:nth-child(1),
  .about-page .reveal.in .ts-card:nth-child(1),
  .about-page .reveal.in .feature-card:nth-child(1) {
    animation: cardStaggerFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
  }
  .about-page .reveal.in .ultra-svc-card:nth-child(2),
  .about-page .reveal.in .inst-cell:nth-child(2),
  .about-page .reveal.in .ts-card:nth-child(2),
  .about-page .reveal.in .feature-card:nth-child(2) {
    animation: cardStaggerFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
  }
  .about-page .reveal.in .ultra-svc-card:nth-child(3),
  .about-page .reveal.in .inst-cell:nth-child(3),
  .about-page .reveal.in .ts-card:nth-child(3),
  .about-page .reveal.in .feature-card:nth-child(3) {
    animation: cardStaggerFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
  }
  .about-page .reveal.in .ultra-svc-card:nth-child(4),
  .about-page .reveal.in .inst-cell:nth-child(4),
  .about-page .reveal.in .ts-card:nth-child(4) {
    animation: cardStaggerFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
  }

  @keyframes cardStaggerFade {
    0% {
      opacity: 0;
      transform: translateY(18px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Growth Chart Bar & Counter Entrance Animations */
  .about-page .growth-chart-showcase .bar-pillar {
    height: 0% !important;
    transition: height 1.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .about-page .growth-chart-showcase.in .bar-pillar {
    height: var(--bar-h) !important;
  }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(1) .bar-pillar { transition-delay: 0.1s !important; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(2) .bar-pillar { transition-delay: 0.25s !important; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(3) .bar-pillar { transition-delay: 0.4s !important; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(4) .bar-pillar { transition-delay: 0.55s !important; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(5) .bar-pillar { transition-delay: 0.7s !important; }

  .about-page .growth-chart-showcase .bar-val-chip,
  .about-page .growth-chart-showcase .bar-surge-tag {
    opacity: 0;
    transform: translateY(12px) scale(0.9);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(1) .bar-val-chip,
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(1) .bar-surge-tag { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.15s; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(2) .bar-val-chip,
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(2) .bar-surge-tag { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.3s; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(3) .bar-val-chip,
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(3) .bar-surge-tag { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.45s; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(4) .bar-val-chip,
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(4) .bar-surge-tag { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.6s; }
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(5) .bar-val-chip,
  .about-page .growth-chart-showcase.in .bar-column-lux:nth-child(5) .bar-surge-tag { opacity: 1; transform: translateY(0) scale(1); transition-delay: 0.75s; }

  @media(max-width:1024px) {
    .about-page .inst-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
  }
  @media(max-width:760px) {
    .about-page section { padding: 80px 6%; }
    .about-page .who-grid,
    .about-page .chart-wrap { grid-template-columns: 1fr; gap: 40px; }
    .about-page .inst-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
  }
`;

const chartData = [
  { year: '2018', value: '24,000', pct: 25 },
  { year: '2019', value: '32,993', pct: 34 },
  { year: '2022', value: '66,793', pct: 70 },
  { year: '2023', value: '90,202', pct: 94 },
  { year: '2024', value: '95,654', pct: 100 },
];

const tradeShowItems = [
  { key: 'about.tradeShow1', title: 'FITUR', city: 'Madrid', countryCode: 'spain', fallbackEmoji: '🇪🇸', icon: FaGlobeEurope },
  { key: 'about.tradeShow2', title: 'B-TRAVEL', city: 'Barcelona', countryCode: 'spain', fallbackEmoji: '🇪🇸', icon: FaStoreAlt },
  { key: 'about.tradeShow3', title: 'EXPO MÉXICO', city: 'Mexico City', countryCode: 'mexico', fallbackEmoji: '🇲🇽', icon: FaGlobeAmericas },
  { key: 'about.tradeShow4', title: 'WTM LATAM', city: 'Brazil', countryCode: 'brazil', fallbackEmoji: '🇧🇷', icon: FaGlobeAmericas },
  { key: 'about.tradeShow5', title: 'FIT', city: 'Buenos Aires', countryCode: 'argentina', fallbackEmoji: '🇦🇷', icon: FaBuilding },
  { key: 'about.tradeShow6', title: 'BTL', city: 'Lisbon', countryCode: 'portugal', fallbackEmoji: '🇵🇹', icon: FaPlaneDeparture },
];

const About = () => {
  const { t } = useTranslation();
  const { data: cmsData } = useCmsBlock('about');
  const pageRef = useRef(null);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const revealEls = el.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(r => {
      const rect = r.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        r.classList.add('in');
      } else {
        io.observe(r);
      }
    });

    const chartIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bars = e.target.querySelectorAll('.bar');
          bars.forEach((bar, i) => {
            const h = bar.dataset.h;
            setTimeout(() => {
              bar.style.height = h + '%';
              bar.style.transform = 'scaleY(1)';
            }, i * 120);
          });
          chartIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    const chart = el.querySelector('.chart');
    if (chart) chartIo.observe(chart);

    return () => {
      io.disconnect();
      chartIo.disconnect();
    };
  }, []);

  return (
    <div className="about-page" ref={pageRef}>
      <Helmet>
        <title>{t('about.seoTitle', 'About Us | Dunas Travel')}</title>
        <meta name="description" content={t('about.seoDescNew', 'Discover our story. Dunas Travel Group — 17+ years designing and operating travel experiences for tour operators and agencies across Europe and Latin America.')} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Jost:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{styles}</style>

      <header className="hero" id="about-hero">
        <div className="hero-watermark">DT</div>
        <div className="hero-eyebrow eyebrow">{cmsData?.heroEyebrow || t('about.heroEyebrow')}</div>
        <h1 dangerouslySetInnerHTML={{ __html: cmsData?.heroTitle || t('about.heroTitle') }} />
        <p className="sub">{cmsData?.heroSub || t('about.heroSub')}</p>

        <div className="routes-wrap" id="routesWrap">
          <svg viewBox="0 0 980 260" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A227" stopOpacity="0" />
                <stop offset="50%" stopColor="#E8CB72" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="rgba(232,203,114,0.10)" strokeWidth="1">
              <line x1="0" y1="40" x2="980" y2="40" />
              <line x1="0" y1="110" x2="980" y2="110" />
              <line x1="0" y1="180" x2="980" y2="180" />
            </g>
            <g fill="none" stroke="url(#lineGrad)" strokeWidth="2">
              <path id="r1" className="route" d="M490,140 C 430,70 360,50 210,65" />
              <path id="r2" className="route" d="M490,140 C 470,80 460,50 470,28" />
              <path id="r3" className="route" d="M490,140 C 540,170 600,190 700,175" />
              <path id="r4" className="route" d="M490,140 C 430,170 330,190 150,185" />
              <path id="r5" className="route" d="M490,140 C 440,180 360,210 230,225" />
              <path id="r6" className="route" d="M490,140 C 520,195 560,225 640,230" />
            </g>
            <g fontFamily="Space Grotesk, sans-serif" fontSize="14" fill="#F8F3E6" letterSpacing="0.5">
              <circle cx="490" cy="140" r="8" fill="#E8CB72" />
              <circle cx="490" cy="140" r="14" fill="none" stroke="#E8CB72" strokeOpacity="0.5" strokeWidth="1.5" />
              <text x="490" y="168" textAnchor="middle" fill="#E8CB72" fontWeight="600" fontSize="15">{t('about.mapCairo')}</text>
              <circle cx="210" cy="65" r="5" fill="#F8F3E6" />
              <text x="210" y="50" textAnchor="middle" fontSize="14">{t('about.mapMadrid')}</text>
              <circle cx="470" cy="28" r="5" fill="#F8F3E6" />
              <text x="470" y="14" textAnchor="middle" fontSize="14">{t('about.mapItaly')}</text>
              <circle cx="700" cy="175" r="5" fill="#F8F3E6" />
              <text x="700" y="200" textAnchor="middle" fontSize="14">{t('about.mapBrazil')}</text>
              <circle cx="150" cy="185" r="4" fill="rgba(248,243,230,0.7)" />
              <text x="150" y="208" textAnchor="middle" fill="rgba(248,243,230,0.6)" fontSize="12">{t('about.mapColombia')}</text>
              <circle cx="230" cy="225" r="4" fill="rgba(248,243,230,0.7)" />
              <text x="230" y="245" textAnchor="middle" fill="rgba(248,243,230,0.6)" fontSize="12">{t('about.mapArgentina')}</text>
              <circle cx="640" cy="230" r="4" fill="rgba(248,243,230,0.7)" />
              <text x="640" y="250" textAnchor="middle" fill="rgba(248,243,230,0.6)" fontSize="12">{t('about.mapMexico')}</text>
            </g>
          </svg>
        </div>


        <div className="scroll-cue"><span>{t('about.heroScroll')}</span><div className="line"></div></div>
      </header>

      <section className="section-light" id="who">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.whoEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.whoTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="who-grid">
          <div className="reveal">
            <div className="who-lead-box">
              <p dangerouslySetInnerHTML={{ __html: t('about.whoP1') }} />
            </div>
            <p>{t('about.whoP2')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('about.whoP3') }} />
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-header">
                  <div className="feature-card-left">
                    <div className="ft-icon-badge">
                      <FaUserTie />
                    </div>
                    <div className="ftitle">{t('about.specialistsTitle')}</div>
                  </div>
                </div>
                <p>{t('about.specialistsDesc')}</p>
              </div>

              <div className="feature-card">
                <div className="feature-card-header">
                  <div className="feature-card-left">
                    <div className="ft-icon-badge">
                      <FaBuilding />
                    </div>
                    <div className="ftitle">{t('about.ownOpsTitle')}</div>
                  </div>
                </div>
                <p>{t('about.ownOpsDesc')}</p>
              </div>

              <div className="feature-card service-247-card">
                <div className="feature-card-header">
                  <div className="feature-card-left">
                    <div className="ft-icon-badge">
                      <FaHeadset />
                    </div>
                    <div className="ftitle">{cmsData?.service247Title || t('about.service247Title')}</div>
                  </div>
                  <span className="live-status-pill">
                    <span className="pulse-dot"></span> 24/7
                  </span>
                </div>
                <p>{cmsData?.service247Desc || t('about.service247Desc')}</p>
              </div>
            </div>
          </div>
          <div className="presence-box reveal">
            <div className="presence-header">
              <FaGlobeAmericas className="presence-main-icon" />
              <h3>{t('about.presenceTitle')}</h3>
            </div>
            <div className="presence-cards-grid">
              <div className="presence-card">
                <div className="presence-card-head">
                  <div className="card-icon-badge">
                    <FaStoreAlt />
                  </div>
                  <h4>{t('about.presenceSales')}</h4>
                </div>
                <div className="presence-badges">
                  <span className="p-badge"><CountryFlag code="egypt" fallbackEmoji="🇪🇬" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.egypt', 'Egypt')}</span>
                  <span className="p-badge"><CountryFlag code="spain" fallbackEmoji="🇪🇸" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.spain', 'Spain')}</span>
                  <span className="p-badge"><CountryFlag code="italy" fallbackEmoji="🇮🇹" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.italy', 'Italy')}</span>
                  <span className="p-badge"><CountryFlag code="brazil" fallbackEmoji="🇧🇷" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.brazil', 'Brazil')}</span>
                </div>
              </div>

              <div className="presence-card">
                <div className="presence-card-head">
                  <div className="card-icon-badge">
                    <FaNetworkWired />
                  </div>
                  <h4>{t('about.presenceNetwork')}</h4>
                </div>
                <div className="presence-badges">
                  <span className="p-badge"><CountryFlag code="argentina" fallbackEmoji="🇦🇷" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.argentina', 'Argentina')}</span>
                  <span className="p-badge"><CountryFlag code="colombia" fallbackEmoji="🇨🇴" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.colombia', 'Colombia')}</span>
                  <span className="p-badge"><CountryFlag code="mexico" fallbackEmoji="🇲🇽" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.mexico', 'Mexico')}</span>
                  <span className="p-badge"><CountryFlag code="peru" fallbackEmoji="🇵🇪" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.peru', 'Peru')}</span>
                  <span className="p-badge"><CountryFlag code="ecuador" fallbackEmoji="🇪🇨" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.ecuador', 'Ecuador')}</span>
                  <span className="p-badge"><CountryFlag code="chile" fallbackEmoji="🇨🇱" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.chile', 'Chile')}</span>
                  <span className="p-badge"><CountryFlag code="panama" fallbackEmoji="🇵🇦" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.panama', 'Panama')}</span>
                  <span className="p-badge"><CountryFlag code="costa_rica" fallbackEmoji="🇨🇷" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.country.costaRica', 'Costa Rica')}</span>
                </div>
              </div>

              <div className="presence-card">
                <div className="presence-card-head">
                  <div className="card-icon-badge">
                    <FaComments />
                  </div>
                  <h4>{t('about.presenceLanguages')}</h4>
                </div>
                <div className="presence-badges">
                  <span className="p-badge"><CountryFlag code="spain" fallbackEmoji="🇪🇸" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.lang.spanish', 'Spanish')}</span>
                  <span className="p-badge"><CountryFlag code="portugal" fallbackEmoji="🇵🇹" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.lang.portuguese', 'Portuguese')}</span>
                  <span className="p-badge"><CountryFlag code="en" fallbackEmoji="🇬🇧" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.lang.english', 'English')}</span>
                  <span className="p-badge"><CountryFlag code="italy" fallbackEmoji="🇮🇹" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.lang.italian', 'Italian')}</span>
                  <span className="p-badge"><CountryFlag code="france" fallbackEmoji="🇫🇷" className="w-4.5 h-3 rounded-[2px] shadow-sm" /> {t('about.lang.french', 'French')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="stats-strip reveal">
          {[
            { count: 17, suffix: '+', icon: FaCalendarAlt, labelKey: 'about.statYears' },
            { count: 95654, suffix: '+', icon: FaSuitcase, labelKey: 'about.statTravelers' },
            { count: 438, suffix: '+', icon: FaUsers, labelKey: 'about.statEmployees' },
            { count: 182, suffix: '+', icon: FaMapMarkedAlt, labelKey: 'about.statGuides' },
            { count: 5, suffix: '', icon: FaGlobe, labelKey: 'about.statOffices' },
          ].map((s, i) => (
            <div className="stat-cell" key={i}>
              <s.icon className="stat-icon" />
              <div className="n">
                <AnimatedCounter value={s.count} suffix={s.suffix} />
              </div>
              <div className="l">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>

        {/* International Trade Shows Showcase */}
        <div className="tradeshows-section reveal">
          <div className="tradeshows-header">
            <div className="eyebrow" style={{ color: 'var(--royal)' }}>
              {t('about.instTradeShows', 'ANNUAL PRESENCE IN INTERNATIONAL TRADE SHOWS')}
            </div>
          </div>
          <div className="tradeshows-grid">
            {tradeShowItems.map((ts, idx) => (
              <div className="ts-card" key={idx}>
                <div className="ts-card-top">
                  <div className="ts-flag-badge">
                    <CountryFlag code={ts.countryCode} fallbackEmoji={ts.fallbackEmoji} className="w-5 h-3.5 rounded-[3px] shadow-sm" />
                  </div>
                  <div className="ts-icon-badge">
                    <ts.icon />
                  </div>
                </div>
                <div className="ts-title">{t(ts.key).split(/\s*—\s*|\s*–\s*/)[0]?.trim() || ts.title}</div>
                <div className="ts-location">
                  {t(ts.key).split(/\s*—\s*|\s*–\s*/)[1]?.trim() || ts.city}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Quote Card */}
        <div className="executive-quote-card reveal">
          <div className="quote-icon-watermark">
            <FaQuoteRight />
          </div>
          <p>
            <span className="quote-mark-gold">«</span>
            {t('about.instQuote', 'في دوناس ترافل جروب، نبني علاقات دائمة على أساس الثقة والتميز التشغيلي والمعرفة العميقة بالوجهة.')}
            <span className="quote-mark-gold">»</span>
          </p>
          <div className="quote-author-meta">
            <div className="quote-author-name">{t('about.instQuoteAuthor', 'دوناس ترافل جروب')}</div>
            <div className="quote-author-tag">• Destination Management Company (DMC)</div>
          </div>
        </div>
      </section>

      {/* Section 02 — Sustained Growth Showcase */}
      <section className="section-dark growth-ultra-section" id="growth">
        <div className="growth-bg-glow growth-glow-1"></div>
        <div className="growth-bg-glow growth-glow-2"></div>

        <div className="growth-container max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="section-head reveal text-center max-w-3xl mx-auto mb-12">
            <div className="growth-badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4">
              <FaChartLine className="text-amber-400 text-sm animate-pulse" />
              <span className="eyebrow tracking-widest text-amber-300 font-bold text-xs uppercase">{t('about.growthEyebrow')}</span>
            </div>
            <h2 
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: t('about.growthTitle') }} 
            />
            <div className="rule mx-auto my-4 w-24 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full"></div>
            <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mt-4">
              {t('about.growthDesc')}
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div className="growth-summary-grid reveal grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <div className="growth-summary-card p-6 rounded-2xl relative overflow-hidden text-left rtl:text-right">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{t('about.growthMilestoneBase', 'Baseline Year')}</span>
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">2018</span>
              </div>
              <div className="text-3xl font-bold font-serif text-white mb-1">
                <AnimatedCounter value={24000} duration={2000} />
              </div>
              <div className="text-xs text-slate-400 font-medium">{t('about.statTravelers', 'Travelers Served')}</div>
            </div>

            <div className="growth-summary-card p-6 rounded-2xl relative overflow-hidden featured-surge-card text-left rtl:text-right">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{t('about.growthTotalSurge', '+298% Surge')}</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm"><FaChartLine /></span>
              </div>
              <div className="text-3xl font-bold font-serif text-white mb-1">
                <AnimatedCounter value={95654} suffix="+" duration={2200} />
              </div>
              <div className="text-xs text-slate-300 font-medium">{t('about.growthMilestonePeak', 'Record Peak (2024–2025)')}</div>
            </div>

            <div className="growth-summary-card p-6 rounded-2xl relative overflow-hidden text-left rtl:text-right">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">17+ {t('about.heroStatsYears', 'Years')}</span>
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm"><FaShieldAlt /></span>
              </div>
              <div className="text-3xl font-bold font-serif text-white mb-1">
                <AnimatedCounter value={100} suffix="%" duration={1800} />
              </div>
              <div className="text-xs text-slate-400 font-medium">{t('about.metricExcellence', 'Operational Leadership')}</div>
            </div>
          </div>

          {/* Interactive Modern Growth Bar Chart */}
          <div className="growth-chart-showcase reveal p-6 sm:p-8 md:p-12 rounded-3xl relative overflow-hidden mb-12">
            <div className="chart-grid-backdrop"></div>
            
            <div className="chart-bars-flex flex items-end justify-between gap-3 sm:gap-4 md:gap-8 h-80 pt-10 pb-4 relative z-10">
              {[
                { year: '2018', num: 24000, suffix: '', pct: 28, badge: t('about.growthMilestoneBase', 'Baseline Year'), color: '#94A3B8' },
                { year: '2019', num: 32993, suffix: '', pct: 38, badge: '+37%', color: '#60A5FA' },
                { year: '2022', num: 66793, suffix: '', pct: 72, badge: '+102%', color: '#34D399' },
                { year: '2023', num: 90202, suffix: '', pct: 93, badge: '+35%', color: '#FBBF24' },
                { year: '2024–25', num: 95654, suffix: '+', pct: 100, badge: t('about.growthMilestonePeak', 'Record Peak'), color: '#F8C630', isPeak: true },
              ].map((barItem, idx) => (
                <div className="bar-column-lux group flex-1 flex flex-col items-center h-full justify-end relative" key={idx}>
                  {/* Top Value Pill with Animated Counter */}
                  <div className="bar-val-chip mb-3 opacity-95 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-white px-2 sm:px-2.5 py-1 rounded-md bg-navy-deep/80 border border-amber-400/30 shadow-lg whitespace-nowrap">
                      <AnimatedCounter value={barItem.num} suffix={barItem.suffix} duration={1800 + idx * 150} />
                    </span>
                  </div>

                  {/* Growth Pill Badge */}
                  <span className="bar-surge-tag text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full mb-2" style={{ color: barItem.color, backgroundColor: `${barItem.color}20`, border: `1px solid ${barItem.color}40` }}>
                    {barItem.badge}
                  </span>

                  {/* Animated Growth Bar */}
                  <div className="bar-track-wrap w-full max-w-[64px] bg-slate-800/40 rounded-2xl p-1.5 relative overflow-hidden flex items-end h-full">
                    <div 
                      className={`bar-pillar w-full rounded-xl ease-out relative ${barItem.isPeak ? 'bar-peak-glowing' : ''}`}
                      style={{ 
                        '--bar-h': `${barItem.pct}%`, 
                        background: barItem.isPeak 
                          ? 'linear-gradient(180deg, #F8C630 0%, #C9A227 50%, #1E40AF 100%)' 
                          : `linear-gradient(180deg, ${barItem.color} 0%, rgba(14, 42, 82, 0.8) 100%)`,
                        boxShadow: `0 0 20px ${barItem.color}40`
                      }}
                    >
                      <div className="bar-cap-shine"></div>
                    </div>
                  </div>

                  {/* Year Label */}
                  <div className="bar-year-lbl mt-4 font-mono font-bold text-xs sm:text-sm text-slate-300 group-hover:text-amber-400 transition-colors">
                    {barItem.year}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="growth-footer-note reveal p-5 rounded-2xl bg-navy-mid/40 border border-amber-400/20 text-center flex items-center justify-center gap-3">
            <FaCheckCircle className="text-amber-400 text-lg shrink-0" />
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              {t('about.growthFleetDrivers')}
            </p>
          </div>

        </div>
      </section>

      <section className="section-light" id="institutional">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.instEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.instTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="inst-grid reveal">
          <div className="inst-cell">
            <div className="inst-icon-badge">
              <FaAward />
            </div>
            <div className="ic-label">{t('about.instFoundation')}</div>
            <h4>{t('about.instFoundationDate')}</h4>
            <p>{t('about.instFoundationDesc')}</p>
          </div>
          <div className="inst-cell">
            <div className="inst-icon-badge">
              <FaCertificate />
            </div>
            <div className="ic-label">{t('about.instLicense')}</div>
            <h4>{t('about.instLicenseNo')}</h4>
            <p>{t('about.instLicenseDesc')}</p>
          </div>
          <div className="inst-cell">
            <div className="inst-icon-badge">
              <FaUsers />
            </div>
            <div className="ic-label">{t('about.instInfra')}</div>
            <h4>{t('about.instInfraVal')}</h4>
            <p>{t('about.instInfraDesc')}</p>
          </div>
          <div className="inst-cell">
            <div className="inst-icon-badge">
              <FaHandshake />
            </div>
            <div className="ic-label">{t('about.instPartnerships')}</div>
            <h4>{t('about.instPartnershipsVal')}</h4>
            <p>{t('about.instPartnershipsDesc')}</p>
          </div>
        </div>
      </section>

      {/* Section 04 — High-Impact Events & Congresses */}
      <section className="section-dark high-impact-events-section" id="events">
        {/* Background Decorative Lighting & Glow Gradients */}
        <div className="events-bg-glow events-bg-glow-1"></div>
        <div className="events-bg-glow events-bg-glow-2"></div>

        <div className="events-container relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-head reveal text-center max-w-3xl mx-auto mb-12">
            <div className="events-badge-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4">
              <FaCrown className="text-amber-400 text-sm animate-pulse" />
              <span className="eyebrow tracking-widest text-amber-300 font-bold text-xs uppercase">{t('about.eventsEyebrow')}</span>
            </div>
            <h2 
              className="events-main-heading font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: t('about.eventsTitle') }} 
            />
            <div className="rule mx-auto my-4 w-24 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full"></div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="events-metrics-grid reveal grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <div className="events-metric-card">
              <div className="metric-icon"><FaGlobeAmericas /></div>
              <div className="metric-val">12+</div>
              <div className="metric-lbl">{t('about.metricCountries')}</div>
            </div>
            <div className="events-metric-card">
              <div className="metric-icon"><FaUsers /></div>
              <div className="metric-val">150+</div>
              <div className="metric-lbl">{t('about.metricGuests')}</div>
            </div>
            <div className="events-metric-card">
              <div className="metric-icon"><FaChartLine /></div>
              <div className="metric-val">48+</div>
              <div className="metric-lbl">{t('about.metricCompanies')}</div>
            </div>
            <div className="events-metric-card">
              <div className="metric-icon"><FaShieldAlt /></div>
              <div className="metric-val">100%</div>
              <div className="metric-lbl">{t('about.metricExcellence')}</div>
            </div>
          </div>

          {/* Flagship Event Spotlight Box (Event 1) */}
          <div className="flagship-event-card reveal mb-14 p-6 sm:p-8 md:p-10 rounded-2xl relative overflow-hidden">
            <div className="flagship-glow-accent"></div>
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
              <div className="flagship-content max-w-3xl text-left rtl:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <FaTrophy className="text-amber-400" />
                  <span>{t('about.flagshipBadge')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-serif leading-snug">
                  {t('about.event1Title')}
                </h3>
                <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light mb-6">
                  {t('about.event1')}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flagship-chip"><FaCheckCircle className="text-emerald-400" /> {t('about.chipMinistry')}</span>
                  <span className="flagship-chip"><FaGlobe className="text-amber-400" /> {t('about.chipDelegations')}</span>
                  <span className="flagship-chip"><FaUsers className="text-blue-400" /> {t('about.chipGuests')}</span>
                </div>
              </div>
              <div className="flagship-icon-box shrink-0 hidden lg:flex items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-700/10 border border-amber-400/40 text-amber-400 text-5xl shadow-2xl shadow-amber-500/20">
                <FaTrophy />
              </div>
            </div>
          </div>

          {/* Chronological Grid Showcase */}
          <div className="events-grid-showcase reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {[
              {
                year: '2013',
                icon: FaFutbol,
                category: t('about.catSports'),
                textKey: 'about.event2',
                accentColor: '#F8C630',
                badgeText: t('about.badgeEvent2')
              },
              {
                year: '2014–15',
                icon: FaGlobeAmericas,
                category: t('about.catBusiness'),
                textKey: 'about.event3',
                accentColor: '#60A5FA',
                badgeText: t('about.badgeEvent3')
              },
              {
                year: '2015',
                icon: FaNewspaper,
                category: t('about.catMedia'),
                textKey: 'about.event4',
                accentColor: '#C084FC',
                badgeText: t('about.badgeEvent4')
              },
              {
                year: '2016',
                icon: FaPlaneDeparture,
                category: t('about.catDelegation'),
                textKey: 'about.event5',
                accentColor: '#34D399',
                badgeText: t('about.badgeEvent5')
              },
              {
                year: '2016–17',
                icon: FaUserMd,
                category: t('about.catMedical'),
                textKey: 'about.event6',
                accentColor: '#22D3EE',
                badgeText: t('about.badgeEvent6')
              },
              {
                year: '2018',
                icon: FaBullseye,
                category: t('about.catChampionship'),
                textKey: 'about.event7',
                accentColor: '#F87171',
                badgeText: t('about.badgeEvent7')
              },
              {
                year: '2019',
                icon: FaLandmark,
                category: t('about.catEconomic'),
                textKey: 'about.event8',
                accentColor: '#FBBF24',
                badgeText: t('about.badgeEvent8')
              },
            ].map((ev, i) => {
              const EventIcon = ev.icon;
              return (
                <div className="event-lux-card group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 text-left rtl:text-right" key={i}>
                  <div className="card-ambient-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${ev.accentColor}25, transparent 70%)` }}></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="event-year-badge font-mono text-sm font-bold px-3 py-1 rounded-full" style={{ color: ev.accentColor, backgroundColor: `${ev.accentColor}18`, borderColor: `${ev.accentColor}40` }}>
                      {ev.year}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                      {ev.badgeText}
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-3">
                    <div className="event-icon-avatar shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ color: ev.accentColor, backgroundColor: `${ev.accentColor}15`, border: `1px solid ${ev.accentColor}35` }}>
                      <EventIcon />
                    </div>
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">{ev.category}</span>
                      <p className="text-slate-200 text-sm font-normal leading-relaxed group-hover:text-white transition-colors">
                        {t(ev.textKey)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Global Impact Banner */}
          <div className="events-footer-banner reveal p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left rtl:text-right">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                  <FaGlobeEurope />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-serif">{t('about.eventsGlobalTitle', 'Global Event Operations & Expertise')}</h4>
                  <p className="text-slate-300 text-sm font-light leading-relaxed max-w-2xl">
                    {t('about.eventsMore')}
                  </p>
                </div>
              </div>
              <Link 
                to="/contact" 
                className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-navy-deep font-bold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span>{t('about.hostEventCTA', 'Organize Your Event')}</span>
                <span className="rtl:hidden"><FaArrowRight /></span>
                <span className="hidden rtl:inline"><FaArrowLeft /></span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Section 05 — Why Choose Dunas Travel / Ultra Services */}
      <section className="section-light" id="services">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.servicesEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.servicesTitle') }} />
          <div className="rule"></div>
        </div>
        
        <div className="ultra-services-grid reveal">
          {[
            {
              icon: FaPlaneArrival,
              titleKey: 'about.svc01.title',
              descKey: 'about.svc01.desc',
              tagKey: 'about.svc01.tag',
              link: '/services',
              badgeKey: 'about.svc01.badge',
              statKey: 'about.svc01.stat'
            },
            {
              icon: FaPlaneDeparture,
              titleKey: 'about.svc02.title',
              descKey: 'about.svc02.desc',
              tagKey: 'about.svc02.tag',
              link: '/destinations',
              badgeKey: 'about.svc02.badge',
              statKey: 'about.svc02.stat'
            },
            {
              icon: FaBriefcase,
              titleKey: 'about.svc03.title',
              descKey: 'about.svc03.desc',
              tagKey: 'about.svc03.tag',
              link: '/contact',
              badgeKey: 'about.svc03.badge',
              statKey: 'about.svc03.stat'
            },
            {
              icon: FaUmbrellaBeach,
              titleKey: 'about.svc04.title',
              descKey: 'about.svc04.desc',
              tagKey: 'about.svc04.tag',
              link: '/tours',
              badgeKey: 'about.svc04.badge',
              statKey: 'about.svc04.stat'
            },
          ].map((svc, i) => {
            const IconComponent = svc.icon;
            return (
              <div className="ultra-svc-card" key={i}>
                <div>
                  <div className="ultra-svc-header">
                    <span className="ultra-svc-num-tag">{t(svc.badgeKey)}</span>
                    <div className="ultra-svc-icon-box">
                      <IconComponent />
                    </div>
                  </div>

                  <div className="ultra-svc-content">
                    <div className="ultra-svc-title">{t(svc.titleKey)}</div>
                    <span className="ultra-svc-tag-pill">{t(svc.tagKey)}</span>
                    <p>{t(svc.descKey)}</p>
                  </div>
                </div>

                <div className="ultra-svc-footer">
                  <div className="ultra-svc-stats-pill">
                    <FaCheckCircle className="text-amber-500" />
                    <span>{t(svc.statKey)}</span>
                  </div>
                  <Link to={svc.link} className="ultra-svc-link">
                    <span>{t('home.explore', 'Explore')}</span>
                    <span className="rtl:hidden"><FaArrowRight /></span>
                    <span className="hidden rtl:inline"><FaArrowLeft /></span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />
    </div>
  );
};

export default About;
