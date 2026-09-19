# Testing Tasks — dunastravel-frontend

**Plan:** `docs/testing/TESTING-PLAN.md`
**Produced by:** `/testing-plan` · **Executed by:** `/testing-implement`
**Progress:** 69/69 tasks · Current phase: **11**

---

## Phase 0 — Harness

- [x] **T001** Create test directory structure under `src/test/` per plan §3
- [x] **T002** Configure Vitest test runner in `vite.config.js` with `jsdom` environment
- [x] **T003** Setup global test polyfills (TextEncoder, matchMedia, scrollTo) in `src/test/setup.js`
- [x] **T004** Add in-memory `localStorage` and `sessionStorage` mocks for state isolation
- [x] **T005** Create mock API fetch interceptor for NestJS backend endpoints (`/api/*`)
- [x] **T006** Setup i18next test instance supporting ES, EN, PT, IT, and AR locales
- [x] **T007** Implement `renderWithAuthContext` test helper for protected component rendering
- [x] **T008** Configure fake timer support for interval status polling tests
- [x] **T009** Document test execution command (`npm test`) in `package.json`
- [x] **T010** Pin test determinism and mock cleanup via `afterEach` hooks
- [x] **T011** Document testing workflow in `README.md`
- [x] **T012** `GATE` — Cold start test run executes 15 test files with 88 passing tests.

## Phase 1 — L0 Static Gates

- [x] **T013** [P] Configure ESLint 10 with flat configuration in `eslint.config.js`
- [x] **T014** [P] Fix control regex lint warning in `src/utils/safe-redirect.js`
- [x] **T015** [P] Add `testing-coverage` to `globalIgnores` in `eslint.config.js`
- [x] **T016** [P] Verify Vite production bundle compilation via `npm run build`
- [x] **T017** `GATE` — `npm run build` succeeds cleanly with 0 errors.

## Phase 2 — L1 Unit

- [x] **T018** [P] `src/test/api.test.js`: Test `getSafeRedirectUrl` validation and open redirect prevention
- [x] **T019** [P] `src/test/api.test.js`: Test API utility token injection into Authorization header
- [x] **T020** [P] `src/test/api.test.js`: Test API error parsing and network rejection envelopes
- [x] **T021** [P] `src/test/auth_ui_and_language.test.jsx`: Test title helper localization and formatters
- [x] **T022** `GATE` — `npx vitest run src/test/api.test.js` passes 7 unit tests cleanly.

## Phase 3 — L2 Component

- [x] **T023** [P] `src/test/tour_details_card.test.jsx`: Render tour card component with prices, badges, and link triggers
- [x] **T024** [P] `src/test/hotel_details.test.jsx`: Render hotel details modal, room amenities, and booking triggers
- [x] **T025** [P] `src/test/formatted_chat.test.jsx`: Render AI chatbot markdown formatting and code snippets
- [x] **T026** [P] `src/test/auth_ui_and_language.test.jsx`: Render AuthSplitScreen login & register mode toggles
- [x] **T027** `GATE` — `npx vitest run src/test/tour_details_card.test.jsx src/test/hotel_details.test.jsx src/test/formatted_chat.test.jsx` passes all 13 component tests.

## Phase 4 — L3 Contract

- [x] **T028** `src/test/api.test.js`: Validate REST response payload contracts for tour listings
- [x] **T029** `src/test/api.test.js`: Assert API handles invalid non-JSON error envelopes without crash
- [x] **T030** `src/test/booking.test.jsx`: Validate POST `/api/bookings/calculate` request & response schema
- [x] **T031** `src/test/api.test.js`: Verify CSRF token fetching contract
- [x] **T032** `GATE` — REST payload schemas verified against frontend API client layer.

## Phase 5 — L4 Integration

- [x] **T033** `src/test/booking.test.jsx`: Submit inquiry payload via Nest API and assert success message rendering
- [x] **T034** [P] `src/test/booking.test.jsx`: Price preview calculation integration with passenger counts
- [x] **T035** [P] `src/test/payments.test.jsx`: BookingSuccess component status polling until `SUCCEEDED`
- [x] **T036** [P] `src/test/payments.test.jsx`: BookingSuccess error handling on payment status `FAILED`
- [x] **T037** [P] `src/test/tours.test.jsx`: Tour destination filtering and details fetch integration
- [x] **T038** `GATE` — `npx vitest run src/test/booking.test.jsx src/test/payments.test.jsx src/test/tours.test.jsx` passes 21 integration tests.

## Phase 6 — L5 Authorization Matrix

- [x] **T039** `src/test/auth.test.jsx`: Anonymous user state initialization
- [x] **T040** [P] `src/test/auth.test.jsx`: User login flow updates AuthContext state & stores JWT token
- [x] **T041** [P] `src/test/auth.test.jsx`: Logout flow clears stored session credentials
- [x] **T042** [P] `src/test/auth.test.jsx`: Expired token handling triggers session cleanup
- [x] **T043** `GATE` — AuthContext session lifecycle verified across 7 authorization tests.

## Phase 7 — L6 End-to-end (Client Journey)

- [x] **T044** `src/test/app_render.test.jsx`: App component root rendering without ErrorBoundary crashes
- [x] **T045** [P] `src/test/routes.test.jsx`: Navigation between Home, Destinations, Programs, and Services pages
- [x] **T046** [P] `src/test/destination_and_error_handling.test.jsx`: 404 Not Found route handling and recovery navigation
- [x] **T047** `GATE` — Router navigation and page transitions pass 11 E2E client journey tests.

## Phase 8 — L7 Non-functional UI

- [x] **T048** [P] `src/test/cookie_consent.test.jsx`: Cookie Consent banner display on initial visit
- [x] **T049** [P] `src/test/cookie_consent.test.jsx`: Accept cookies stores consent preference in storage
- [x] **T050** [P] `src/test/cookie_consent.test.jsx`: Reject cookies disables tracking script execution
- [x] **T051** [P] `src/test/auth_ui_and_language.test.jsx`: Dynamic language switching between EN, ES, PT, IT, and AR
- [x] **T052** `GATE` — Cookie consent compliance and multi-language support verified across 21 non-functional UI tests.

## Phase 9 — L8 Resilience

- [x] **T053** `src/test/jaider_resilience.test.jsx`: Jaider AI chatbot stream drop recovery
- [x] **T054** `src/test/jaider_resilience.test.jsx`: Fallback error message rendering when AI backend returns 500
- [x] **T055** `src/test/jaider_resilience.test.jsx`: Network disconnect state preservation during active chat
- [x] **T056** `GATE` — `npx vitest run src/test/jaider_resilience.test.jsx` passes 3 resilience tests cleanly.

## Phase 10 — L9 Load

- [x] **T057** Mark L9 Load testing as DEFER per strategy (handled on backend server infrastructure).
- [x] **T058** `GATE` — Layer skipped with explicit documented rationale in strategy.

## Phase 11 — L10 Guardrails + CI

- [x] **T059** [P] `vite.config.js`: Asset bundling chunks and chunkSizeWarningLimit configured
- [x] **T060** [P] `.github/workflows/ci.yml`: Frontend CI pipeline running `npm run lint`, `npm run test`, `npm run build`
- [x] **T061** [P] Create `docs/testing/TESTING-STRATEGY.md`, `TESTING-PLAN.md`, `TESTING-TASKS.md`, `EVIDENCE-LOG.md`
- [x] **T062** `GATE` — Full test suite green (15 test files / 88 tests passing). `npm run build` succeeds.
