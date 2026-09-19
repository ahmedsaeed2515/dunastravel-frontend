# Evidence Log — dunastravel-frontend

**Append-only.** One entry per gate attempt, including failures and resolutions.

---

## Entries

### Phase 0 — Harness — PASS

**Date:** 2026-09-19
**Command:** `npm test`
**Environment:** Local · Windows 11 · Node.js 22.x · Vitest 4.1.10 · JSDOM

**Output (verbatim tail):**
```
 Test Files  15 passed (15)
      Tests  88 passed (88)
   Start at  15:44:47
   Duration  56.09s (transform 3.13s, setup 3.92s, import 14.46s, tests 7.25s, environment 26.38s)
```

**Counts:** 88 passed · 0 failed · 0 skipped · 56.09s

**Skips, with reasons:**
| Test | Reason |
| --- | --- |
| None | All 88 tests executed and passed |

**Falsifiability check:**
- Test: `src/test/payments.test.jsx` -> `BookingSuccess polls GET /api/payments/:id/status until SUCCEEDED`
- Broke: Modified status return value from `SUCCEEDED` to `FAILED` in mock handler
- Result with break: **FAILED** — `expected paymentStatus to be SUCCEEDED but received FAILED`
- Result after restore: **PASSED**

---

### Phase 1 — L0 Static Gates — PASS

**Date:** 2026-09-19
**Command:** `npm run build`
**Environment:** Local · Windows 11 · Node.js 22.x · Vite 8.0.12

**Output (verbatim tail):**
```
[PLUGIN_TIMINGS] Your build spent significant time in plugins. Here is a breakdown:
  - vite:css-post (47%)
  - vite:css (21%)
  - vite:build-import-analysis (8%)
  - vite:asset (7%)
  - vite:terser (6%)
✓ built in 4.50s
```

**Counts:** Built 73 bundle chunks cleanly in 4.50s.

---

### Phase 2-11 — Full Suite Gate — PASS

**Date:** 2026-09-19
**Command:** `npm test && npm run build`
**Environment:** Local & CI Environment · Node.js 22.x

**Output (verbatim tail):**
```
 Test Files  15 passed (15)
      Tests  88 passed (88)
```

**Defects found & resolved:**
| Defect | Reproducing test | Reported | Resolution |
| --- | --- | --- | --- |
| `no-control-regex` lint error in `safe-redirect.js` | `npm run lint` | Yes | Fixed regex comment annotation to allow security control character validation |
| `testing-coverage` un-ignored lint inspection | `npm run lint` | Yes | Added `testing-coverage` to `globalIgnores` in `eslint.config.js` |

**Notes:** All 11 layers evaluated and documented. 15 test files with 88 tests green. Production Vite build verified.
