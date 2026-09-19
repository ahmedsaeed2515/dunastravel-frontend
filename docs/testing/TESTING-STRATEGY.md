# Testing Strategy — dunastravel-frontend

**Created:** 2026-09-19
**Author:** Antigravity AI & Engineering Team
**Status:** Agreed
**Produced by:** `/testing-assess`
**Next step:** `/testing-plan`

---

## 1. What this project is

| Property | Value |
| --- | --- |
| Purpose | Next-gen web platform for Dunas Travel agency offering multilingual tour packages, customized itinerary booking, hotel reservations, payment status tracking, and AI chatbot support (Jaider). |
| Languages | JavaScript (ESNext, React 19) |
| Frameworks | React 19, Vite 8, React Router DOM 7, Tailwind CSS, i18next, Framer Motion, GSAP, Leaflet |
| Package manager / build | npm, Vite 8, Rollup/ESBuild |
| Datastores | Client-side Storage (LocalStorage, SessionStorage, Cookie Storage) + NestJS Backend REST API (`/api`) |
| External services | Backend API (Vercel / Local NestJS), Stripe Payment Gateway via API status polling, Google Analytics |
| Deployment target | Vercel (Frontend Static & SPA edge delivery) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |
| Repo shape | Single package frontend repository |
| Developer OS mix | Windows 11 (PowerShell / Git Bash), Linux (Ubuntu CI) |

## 2. Risk profile

**Highest-risk area:** Tour booking calculations, multi-step booking submission, Stripe payment status verification & authorization state persistence across page navigation.

**Irreversible or sensitive operations:**

| Operation | Why it matters | Layer that must cover it |
| --- | --- | --- |
| Booking Inquiry & Payment Submission | Financial transactions & customer booking state; wrong calculations or lost status disrupt business | L8 + L4 |
| User Authentication & CSRF Token Handshake | Security of user dashboard, profile data, and session persistence | L5 + L1 |
| Cookie Consent Compliance (GDPR/ePrivacy) | Legal compliance for analytics scripts and cookie tracking consent | L7 + L1 |

**Actors and isolation:**

| Actor | Can see | Must never see |
| --- | --- | --- |
| Anonymous Visitor | Public destination pages, tour catalog, hotel details, blog articles, basic pricing preview | User dashboard, active booking payment tokens, saved payment credentials |
| Authenticated User | Personal bookings, invoices, wishlist items, profile settings | Other users' bookings, invoices, or personal identity details |

**Recent escaped bugs:**

| Bug | Layer that would have caught it |
| --- | --- |
| CSRF token header missing on cookie consent API calls | L3 (Contract) + L4 (Integration) |
| Jaider AI chatbot crashing UI when stream network drops | L8 (Resilience) |

## 3. Existing coverage — honest assessment

| Layer | Files found | Trustworthy? | Notes |
| --- | --- | --- | --- |
| L0 Static | 2 (`eslint.config.js`, `vite.config.js`) | Yes | Linting rules with ESLint 10 + Vite build checks. |
| L1 Unit | 15 test files (88 tests in `src/test/`) | Yes | Vitest 4 + `@testing-library/react` + `jsdom`. All 88 tests pass cleanly. |
| L2 Component | 6 (`auth_ui_and_language.test.jsx`, `tour_details_card.test.jsx`, `hotel_details.test.jsx`, `formatted_chat.test.jsx`, `cookie_consent.test.jsx`, `wishlist.test.jsx`) | Yes | Tests UI component states, localized rendering, and interactive state triggers. |
| L3 Contract | 1 (`api.test.js`) | Yes | Validates API utility response shapes, error handling, and authorization header injection. |
| L4 Integration | 3 (`booking.test.jsx`, `payments.test.jsx`, `tours.test.jsx`) | Yes | Verifies end-to-end API client integration with simulated backend endpoints. |
| L5 Authorization | 1 (`auth.test.jsx`) | Yes | Verifies AuthContext, session storage restoration, and protected route access. |
| L6 E2E | 2 (`app_render.test.jsx`, `routes.test.jsx`) | Partial | Covers router navigation, fallback rendering, and error boundary safety. |
| L7 Non-functional UI | 1 (`cookie_consent.test.jsx`) | Yes | Tests Cookie Consent banner, consent storage, and analytics tracking block. |
| L8 Resilience | 1 (`jaider_resilience.test.jsx`) | Yes | Tests AI Chatbot network failure, timeout retry, and error fallback UI. |
| L9 Load | 0 | No | Deferred to backend staging environment suite. |
| L10 Guardrails | 1 (`vite.config.js`) | Yes | Chunk size warnings, locale split checks, and asset bundling limits. |

**Triage needed before adding tests:** No — all 88 existing tests across 15 test files pass cleanly without flaky workarounds.

## 4. Layer decisions

| Layer | Verdict | Rationale | Trigger to revisit |
| --- | --- | --- | --- |
| L0 Static gates | ADOPT | ESLint + Vite build guarantees compilation integrity and secret exclusion. | Any PR to main |
| L1 Unit | ADOPT | Core utility logic (pricing, date formatting, redirect safety, i18n) needs fast unit verification. | Daily dev |
| L2 Component | ADOPT | High-density UI components (Tour cards, Hotel details, Auth split screen, Chatbot) require isolated UI state tests. | UI changes |
| L3 Contract | ADOPT | Ensures frontend API payloads conform to NestJS backend REST schemas (`/api`). | Backend schema changes |
| L4 Integration | ADOPT | Validates complex multi-step booking flows and Stripe payment status polling (`SUCCEEDED`, `FAILED`, `PENDING`). | Payment API changes |
| L5 Authorization | ADOPT | Verifies JWT session restoration, AuthContext state changes, and protected route guards. | Auth flow changes |
| L6 End-to-end | PARTIAL | Client-side routing and user journey navigation tested in JSDOM environment. | Full E2E suite request |
| L7 Non-functional UI | PARTIAL | Validates A11y, RTL language support (Arabic), and Cookie Consent storage compliance. | Design system update |
| L8 Resilience | ADOPT | Validates AI Chatbot stream failure recovery, API retry logic, and network drop boundaries. | New external integration |
| L9 Load | DEFER | SPA frontend bundle load testing done via Vite build stats; API load testing belongs to backend repository. | Staging environment setup |
| L10 Guardrails | ADOPT | Guarantees locale JSON completeness, bundle chunk size control, and clean console logging in production. | CI pipeline execution |

## 5. Tooling per adopted layer

| Layer | Tool | Command | Needs a live environment? |
| --- | --- | --- | --- |
| L0 Static | ESLint + Vite | `npm run lint && npm run build` | No |
| L1 Unit | Vitest | `npm test` | No |
| L2 Component | Vitest + React Testing Library | `npx vitest run src/test/*_ui*.test.jsx src/test/tour_details_card.test.jsx src/test/hotel_details.test.jsx` | No |
| L3 Contract | Vitest | `npx vitest run src/test/api.test.js` | No |
| L4 Integration | Vitest + Mock Service Worker | `npx vitest run src/test/booking.test.jsx src/test/payments.test.jsx` | No (mocked REST API) |
| L5 Authorization | Vitest + RTL | `npx vitest run src/test/auth.test.jsx` | No |
| L6 E2E | Vitest | `npx vitest run src/test/app_render.test.jsx src/test/routes.test.jsx` | No |
| L7 Non-functional | Vitest + RTL | `npx vitest run src/test/cookie_consent.test.jsx src/test/auth_ui_and_language.test.jsx` | No |
| L8 Resilience | Vitest | `npx vitest run src/test/jaider_resilience.test.jsx` | No |
| L10 Guardrails | Vite + Custom Scripts | `npm run build` | No |

**Aggregate command:** `npm run lint && npm test && npm run build`

**Incumbent tooling respected:** Existing Vitest 4 + `@testing-library/react` setup with JSDOM environment in `vite.config.js`.

## 6. Harness design

| Concern | Decision |
| --- | --- |
| Target indirection variables | `VITE_API_URL` (default: `http://localhost:5000/api` dev, `https://dunastravel-backend-seven.vercel.app/api` prod) |
| Disposable datastore | LocalStorage & SessionStorage memory mock setup in `src/test/setup.js` |
| Readiness signal | Vite dev server listener (`http://localhost:5173`) |
| Seed profiles | Mock booking data, mock tour catalog (`blogs.js`, `tours.js`), mock user profiles in test files |
| Deterministic fixed IDs | Fixed UUIDs & slugs (e.g., `egipto-clasico`, `pay_123456`, `usr_7890`) |
| Isolation strategy | `afterEach(() => vi.clearAllMocks())` + storage purge in `src/test/setup.js` |
| Auth-in-test strategy | Mock AuthContext state with synthetic JWT token injection |
| Clock, RNG, timezone, locale | Vitest `vi.useFakeTimers()` for status polling tests & i18next fixed locale (`es`, `en`, `ar`) |
| Rate limits / bot defenses | Mock fetch interceptors handling `429 Too Many Requests` |
| External services | Stripe status polling mocked; Google Analytics calls stubbed via `window.gtag` mock |
| Orchestration script language | npm scripts + Node.js ESM |

## 7. Explicitly out of scope

- Direct database connection testing (handled by NestJS backend test suite).
- Staging server load testing (frontend is a static Single Page Application served by Vercel CDN).
- Physical browser automation (Playwright/Cypress deferred to dedicated E2E repository).

## 8. Assumptions

| # | Assumption | Impact if wrong |
| --- | --- | --- |
| 1 | Backend REST endpoints match `/api/bookings`, `/api/payments`, `/api/auth` contract | Integration tests would fail against real backend |
| 2 | Client execution runs in modern ESNext browsers supporting LocalStorage & Fetch API | Legacy polyfills would be required |

## 9. Success criteria

- [x] Every `ADOPT` layer has a green command recorded in `EVIDENCE-LOG.md`
- [x] All 15 test files with 88 tests pass cleanly without errors
- [x] `npm run lint` and `npm run build` pass cleanly in L0 Static Gate
- [x] Frontend CI job runs `npm run lint`, `npm test`, and `npm run build` on every push/PR
