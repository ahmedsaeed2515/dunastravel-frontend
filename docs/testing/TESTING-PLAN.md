# Testing Plan — dunastravel-frontend

**Created:** 2026-09-19
**Strategy:** `docs/testing/TESTING-STRATEGY.md` (Agreed)
**Produced by:** `/testing-plan`
**Next step:** `/testing-implement`

---

## 1. Goal

Establish a comprehensive, multi-layered test suite for Dunas Travel Frontend that guarantees application compilation, UI component rendering, API contract integrity, payment workflow reliability, and resilience against network failures across all supported languages (ES, EN, PT, IT, AR).

## 2. Layers in scope

| Layer | Phase | Command | Live env? | Est. tests |
| --- | --- | --- | --- | --- |
| L0 Static Gates | 1 | `npm run lint && npm run build` | No | n/a |
| L1 Unit | 2 | `npm test` | No | 88+ |
| L2 Component | 3 | `npx vitest run src/test/tour_details_card.test.jsx src/test/hotel_details.test.jsx src/test/auth_ui_and_language.test.jsx` | No | 25+ |
| L3 Contract | 4 | `npx vitest run src/test/api.test.js` | No | 7+ |
| L4 Integration | 5 | `npx vitest run src/test/booking.test.jsx src/test/payments.test.jsx` | No (mocked API) | 12+ |
| L5 Authorization | 6 | `npx vitest run src/test/auth.test.jsx` | No | 7+ |
| L6 End-to-end | 7 | `npx vitest run src/test/app_render.test.jsx src/test/routes.test.jsx` | No | 6+ |
| L7 Non-functional UI | 8 | `npx vitest run src/test/cookie_consent.test.jsx` | No | 10+ |
| L8 Resilience | 9 | `npx vitest run src/test/jaider_resilience.test.jsx` | No | 3+ |
| L10 Guardrails + CI | 10 | `npm run build && git diff --exit-code` | No | n/a |

Out of scope, per the strategy: L9 Load testing (handled by backend performance infrastructure).

## 3. Directory and naming conventions

```
src/
  test/
    api.test.js                      # L3 Contract & REST API helpers test
    app_render.test.jsx              # L6 App entrypoint render test
    auth.test.jsx                    # L5 Authorization context test
    auth_ui_and_language.test.jsx    # L2 Component / L7 i18n language UI test
    booking.test.jsx                 # L4 Booking calculation & inquiry integration test
    cookie_consent.test.jsx          # L7 Cookie consent & tracking compliance test
    destination_and_error_handling.test.jsx # L6 Router fallback & 404 test
    formatted_chat.test.jsx          # L2 Markdown chat renderer test
    hotel_details.test.jsx           # L2 Hotel detail card test
    jaider_resilience.test.jsx       # L8 AI chatbot failure resilience test
    payments.test.jsx                # L4 Stripe payment status polling test
    routes.test.jsx                  # L6 Navigation & page route test
    setup.js                         # Global setup, JSDOM polyfills, storage mocks
    tour_details_card.test.jsx       # L2 Tour card rendering test
    tours.test.jsx                   # L4 Tour filter & details integration test
    wishlist.test.jsx                # L2 LocalStorage wishlist state test
```

| Convention | Value |
| --- | --- |
| Test file naming | `*.test.js` / `*.test.jsx` |
| Layer selection mechanism | Vitest file patterns & npm script targets |
| Shared helper location | `src/test/setup.js` & `src/utils/api.js` |
| Fixture/factory location | Inline test mock fixtures & `src/data/blogs.js` |

## 4. Harness build-out

1. **Layer command skeletons:** `npm test`, `npm run lint`, `npm run build` all pre-configured and operational.
2. **Disposable datastore simulation:** In-memory `localStorage` and `sessionStorage` mocks initialized in `src/test/setup.js`.
3. **Seed profiles:** Standardized test payloads for tours, bookings (`pay_123456`, `SUCCEEDED`), auth tokens, and i18n strings.
4. **Auth helper:** `renderWithAuthContext` helper provided in test suite for testing protected routes and permissions.
5. **Determinism setup:** Vitest fake timers enabled for interval polling tests in `payments.test.jsx`.

**Phase 0 exit criteria:** From a cold start, `npm test` runs 15 test files with 88 tests passing cleanly in ~56s.

## 5. Phases

| # | Phase | Layer | Depends on | Exit criteria |
| --- | --- | --- | --- | --- |
| 0 | Harness | — | — | `npm test` passes all 88 tests cleanly |
| 1 | Static Gates | L0 | 0 | `npm run lint` and `npm run build` exit code 0 |
| 2 | Unit | L1 | 0 | All unit tests in `src/test/*.js` pass cleanly |
| 3 | Component | L2 | 0 | Component tests (`tour_details_card`, `hotel_details`, `auth_ui_and_language`) pass |
| 4 | Contract | L3 | 0 | `api.test.js` passes with zero schema errors |
| 5 | Integration | L4 | 0 | `booking.test.jsx` and `payments.test.jsx` pass status polling checks |
| 6 | Authorization | L5 | 0 | `auth.test.jsx` passes session restoration and route protection tests |
| 7 | End-to-end | L6 | 0 | `app_render.test.jsx` and `routes.test.jsx` pass navigation checks |
| 8 | Non-functional UI | L7 | 0 | `cookie_consent.test.jsx` passes consent storage and analytics block checks |
| 9 | Resilience | L8 | 0 | `jaider_resilience.test.jsx` passes stream drop retry and fallback checks |
| 10 | Guardrails + CI | L10 | all | GitHub Actions workflow passes `lint`, `test`, and `build` |

## 6. Coverage targets by area

| Area / module | Layers | Specific cases that must exist |
| --- | --- | --- |
| Auth (`src/context/AuthContext.jsx`) | L1, L5 | User login, signup, token storage, logout, token expiration handling |
| Booking Engine (`src/pages/TailorTour.jsx`, `src/pages/programs/*`) | L4, L8 | Booking price calculation, payload validation, inquiry submission, API failure recovery |
| Payment Status (`src/pages/BookingSuccess.jsx`) | L4, L8 | Polling GET `/api/payments/:id/status` until `SUCCEEDED`, timeout fallback on `FAILED` |
| AI Chatbot Jaider (`src/context/JaiderChatContext.jsx`) | L2, L8 | Stream response formatting, error boundary fallback, network disconnect recovery |
| Cookie Consent (`src/privacy/consent/`) | L7 | Consent banner state, local consent persistence, analytics script gating |
| Multilingual Support (`src/i18n/`) | L2, L7 | Dynamic language switching across ES, EN, PT, IT, AR without UI crash |

## 7. CI design

| Job | Layers | Trigger | Services | Artifacts on failure |
| --- | --- | --- | --- | --- |
| `build-and-test` | L0, L1-L8, L10 | Push / PR to `main`, `dev` | Node 22 environment | Workflow run logs |

Blocking: `build-and-test` job blocks pull request merge.
Target runtime: < 2 minutes on GitHub Actions runner.

## 8. Risks to this plan

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| JSDOM environment missing browser APIs | Low | Polyfilled in `src/test/setup.js` (`TextEncoder`, `fetch`, `matchMedia`, `scrollTo`) |
| Unhandled promise rejections in async tests | Low | Explicit error boundary wrappers and cleanup hooks in Vitest |

## 9. Defects expected to surface

Policy:
- Application code defect → stop, fix code, re-verify with test suite.
- Test assertion defect → update test mock to reflect true application contract.

## 10. Effort

| Phase | Estimate | Notes |
| --- | --- | --- |
| Phase 0 - Phase 10 | Completed | Suite is fully constructed, verified, and operational |

**Total:** 15 test files / 88 tests active.
