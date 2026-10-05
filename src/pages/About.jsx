import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaSuitcase, FaUsers, FaMapMarkedAlt, FaGlobe, FaBuilding, FaNetworkWired, FaLanguage, FaGlobeAmericas, FaStoreAlt, FaComments, FaCertificate, FaHandshake, FaAward, FaClock, FaHeadset, FaUserTie, FaGlobeEurope, FaPlaneDeparture, FaQuoteRight } from 'react-icons/fa';
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
    background: radial-gradient(ellipse 120% 80% at 50% -10%, #11305E 0%, var(--navy) 42%, var(--navy-deep) 100%);
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
    background: url('/imgs/egyothero.webp') center / cover no-repeat;
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
  }
  html:not(.dark) .about-page .executive-quote-card {
    background: linear-gradient(135deg, #0A1C38 0%, #0E2A52 60%, #16386B 100%) !important;
    color: #F8F3E6 !important;
    border: 1.5px solid rgba(201, 162, 39, 0.4) !important;
    box-shadow: 0 16px 40px rgba(14, 42, 82, 0.25) !important;
  }
  .dark .about-page .executive-quote-card {
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
    color: rgba(232, 203, 114, 0.08);
    pointer-events: none;
    line-height: 1;
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
    position: relative;
    z-index: 1;
  }
  .about-page .quote-author-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    border-top: 1px solid rgba(232, 203, 114, 0.25);
    padding-top: 16px;
    position: relative;
    z-index: 1;
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
  .about-page .events-list { display: flex; flex-direction: column; }
  .about-page .event-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 30px;
    padding: 26px 0;
    border-bottom: 1px solid var(--line);
    align-items: baseline;
  }
  .about-page .event-row:first-child { border-top: 1px solid var(--line); }
  .about-page .event-row .eyr {
    font-family: var(--mono);
    color: var(--gold-light);
    font-size: 14px;
    font-weight: 600;
  }
  .about-page .event-row .etxt {
    font-size: 16px;
    font-weight: 300;
    color: rgba(248, 243, 230, .88);
    line-height: 1.55;
  }
  .about-page .event-row .etxt b { font-weight: 500; color: var(--ivory); }
  .about-page .events-more {
    margin-top: 26px;
    font-size: 13.5px;
    color: rgba(248, 243, 230, .6);
    font-weight: 300;
    line-height: 1.7;
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
  .about-page .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .8s ease, transform .8s ease;
  }
  .about-page .reveal.in {
    opacity: 1;
    transform: none;
  }
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
  { key: 'about.tradeShow4', title: 'WTM LATAM', city: 'São Paulo', countryCode: 'brazil', fallbackEmoji: '🇧🇷', icon: FaGlobeAmericas },
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
    }, { threshold: 0.15 });
    revealEls.forEach(r => io.observe(r));

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
                <div className="ts-title">{t(ts.key).split('—')[0]?.trim() || ts.title}</div>
                <div className="ts-location">
                  {t(ts.key).split('—')[1]?.trim() || ts.city}
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
          <p>«{t('about.instQuote', 'في دوناس ترافل جروب، نبني علاقات دائمة على أساس الثقة والتميز التشغيلي والمعرفة العميقة بالوجهة.')}»</p>
          <div className="quote-author-meta">
            <div className="quote-author-name">{t('about.instQuoteAuthor', 'دوناس ترافل جروب')}</div>
            <div className="quote-author-tag">• Destination Management Company (DMC)</div>
          </div>
        </div>
      </section>

      <section className="section-dark" id="growth">
        <div className="section-head reveal">
          <span className="eyebrow">{t('about.growthEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.growthTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="chart-wrap">
          <div className="reveal">
            <p style={{ fontSize: 16, lineHeight: 1.85, fontWeight: 400, color: '#ffffff' }}>{t('about.growthDesc')}</p>
          </div>
          <div className="chart reveal">
            {chartData.map((c, i) => (
              <div className="bar-col" key={i}>
                <div className="bar" data-h={c.pct}><span className="val">{c.value}</span></div>
                <div className="bar-yr">{c.year}</div>
              </div>
            ))}
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

      <section className="section-dark" id="events">
        <div className="section-head reveal">
          <span className="eyebrow">{t('about.eventsEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.eventsTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="events-list reveal">
          {[
            { year: '\u2014', textKey: 'about.event1' },
            { year: '2013', textKey: 'about.event2' },
            { year: '2014\u201315', textKey: 'about.event3' },
            { year: '2015', textKey: 'about.event4' },
            { year: '2016', textKey: 'about.event5' },
            { year: '2016\u201317', textKey: 'about.event6' },
            { year: '2018', textKey: 'about.event7' },
            { year: '2019', textKey: 'about.event8' },
          ].map((ev, i) => (
            <div className="event-row" key={i}>
              <div className="eyr">{ev.year}</div>
              <div className="etxt">{t(ev.textKey)}</div>
            </div>
          ))}
        </div>
        <p className="events-more reveal">{t('about.eventsMore')}</p>
      </section>

      <section className="section-light" id="services">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.servicesEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.servicesTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="services-grid reveal">
          {[
            { num: '01', titleKey: 'about.svc01.title', descKey: 'about.svc01.desc' },
            { num: '02', titleKey: 'about.svc02.title', descKey: 'about.svc02.desc' },
            { num: '03', titleKey: 'about.svc03.title', descKey: 'about.svc03.desc' },
            { num: '04', titleKey: 'about.svc04.title', descKey: 'about.svc04.desc' },
          ].map((svc, i) => (
            <div className="svc-card" key={i}>
              <span className="svc-num">{svc.num}</span>
              <div>
                <div className="svc-title">{t(svc.titleKey)}</div>
                <p>{t(svc.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="values-row reveal">
          {[
            { titleKey: 'about.val01.title', descKey: 'about.val01.desc' },
            { titleKey: 'about.val02.title', descKey: 'about.val02.desc' },
            { titleKey: 'about.val03.title', descKey: 'about.val03.desc' },
            { titleKey: 'about.val04.title', descKey: 'about.val04.desc' },
          ].map((v, i) => (
            <div className="value-item" key={i}>
              <div className="vt">{t(v.titleKey)}</div>
              <div className="vd">{t(v.descKey)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />
    </div>
  );
};

export default About;
