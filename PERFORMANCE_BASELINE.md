# PERFORMANCE BASELINE — DUNAS TRAVEL FRONTEND
**Environment**: Production Build (`vite build` + `vite preview --port 4173`)  
**Audit Profile**: Headless Mobile Chrome (390×844 @ 3x DPR, 4x CPU Throttling, Slow 4G Network, Clean Incognito Profile)  
**Date**: September 16, 2026  

---

## 1. Core Web Vitals & Executive Scores

| Metric | Measured Baseline | Target Standard | Status |
| :--- | :---: | :---: | :---: |
| **Lighthouse Performance Score** | **33 / 100** | $\ge 90$ | **CRITICAL BOTTLENECK** |
| **First Contentful Paint (FCP)** | **2.9s** (0.78s SSR, 2.9s full interactive) | $< 1.8\text{s}$ | **POOR** |
| **Largest Contentful Paint (LCP)** | **10.9s** | $< 2.5\text{s}$ | **CRITICAL BOTTLENECK** |
| **Total Blocking Time (TBT)** | **3,490 ms** | $< 300\text{ ms}$ | **CRITICAL BOTTLENECK** |
| **Cumulative Layout Shift (CLS)** | **0.002** | $< 0.100$ | **PRISTINE** |
| **Speed Index** | **16.9s** | $< 3.5\text{s}$ | **CRITICAL BOTTLENECK** |
| **Time to First Byte (TTFB)** | **70–160 ms** | $< 800\text{ ms}$ | **EXCELLENT** |

---

## 2. Main-Thread Execution Profile

| Main Thread Subsystem | Measured Duration | Root Cause Classification |
| :--- | :---: | :--- |
| **Total Main-Thread Time** | **31.4 s** | Synchronous startup overload across initial React tree |
| **Script Evaluation** | **8.02 s** | Bulky vendor bundles (`react-dom`, `framer-motion`, `swiper`, `gsap`) |
| **Style & Layout** | **6.70 s** | Forced reflows from Swiper, GSAP queries, and multi-carousel mounting |
| **Rendering & Compositing** | **1.60 s** | SVG rotary textPaths in 6 hero slides, marquee transforms |
| **Garbage Collection** | **141 ms** | Temporary allocation spikes during hydration |
| **Script Parsing & Compilation**| **24 ms** | Modern V8 JIT compilation |

---

## 3. Script Bootup & CPU Duration (Top Heavy Modules)

| Script Asset | Total CPU Time | Scripting Time | Role / Component |
| :--- | :---: | :---: | :--- |
| `vendor-react-dom-Bm_w3Vi3.js` | **12,524 ms** | 2,587 ms | React 19 Reconciliation & Hydration of 2,881 elements |
| `vendor-react-CV_dSYr2.js` | **6,540 ms** | 3,781 ms | React Core scheduling & effect dispatch |
| `vendor-motion-z44fKBjP.js` | **4,933 ms** | 1,101 ms | Framer Motion tree traversal on 13 home sections |
| `vendor-swiper-Udd4vQ1m.js` | **906 ms** | 279 ms | Swiper hero slider initialization & layout measurement |
| `vendor-gsap-Bo2bUt8f.js` | **417 ms** | 201 ms | GSAP entrance tweens & opacity overrides |

---

## 4. Network Payload, Asset Footprint & DOM Size

| Resource Metric | Measured Baseline | Target Budget | Assessment |
| :--- | :---: | :---: | :--- |
| **Total Network Transfer** | **2,214 KiB** | $< 1,000\text{ KiB}$ | Heavy offscreen images & large vendor bundles |
| **DOM Size** | **2,881 elements** | $< 1,000\text{ elements}$ | Excessive monolithic section mounting |
| **Maximum DOM Depth** | **22 levels** | $< 15\text{ levels}$ | Nested flex & card wrappers |
| **Offscreen Wasted Images** | **400 KiB** | $0\text{ KiB}$ | Unsplash hotel image (165KB), Cloudinary bus (97KB) |
| **Unused CSS** | **22 KiB** | Minimal | Monolithic CSS loaded for all components |
| **Unused JavaScript** | **23 KiB** | Minimal | Code-splitting opportunities |

---

## 5. LCP Diagnostics

- **LCP Element**: `<h1>` `"LUXURY JOURNEYS"` and background hero image `/imgs/slider-abu-simbel.webp`.
- **LCP Resource**: Implemented as CSS `background-image` inside Swiper Slide 1.
- **Resource Load Delay**: ~70 ms (Preloaded in HTML).
- **Resource Load Duration**: ~120 ms.
- **Element Render Delay**: **~3,260 ms** (Waiting for Swiper DOM creation, GSAP opacity initialization, and React 19 hydration queue).
- **Total LCP**: **10.9s**.

---

## 6. Architectural Diagnostic Summary

The audit proves beyond doubt:
1. The backend server and network document transfer are **not** the problem (TTFB is $\le 160\text{ms}$).
2. The massive bottleneck is **Frontend Startup Concurrency**:
   - Above the fold: The Hero is locked behind `Swiper` and `GSAP` libraries, causing layout thrashing and deferred visibility.
   - Below the fold: All 13 sections (Search, About, Stats, Destinations, Packages, Photo Showcase, Video Showcase, Testimonials, FAQ, Footer, Floating AI, Floating Music, Floating Contact) mount synchronously in a single 2,660-line component.
   - 2,881 DOM nodes and 400KB of offscreen images are fetched and hydrated during the critical initial window.
