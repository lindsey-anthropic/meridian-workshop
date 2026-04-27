# R1 — Reports Module Defect Audit

**Engagement:** MC-2026-0417 — Phase 2, Days 1–2
**Audit target:** `client/src/views/Reports.vue` (488 LoC), backend endpoints `/api/reports/quarterly` and `/api/reports/monthly-trends`
**Audit date:** April 2026

---

## Summary

The previous vendor's Reports module ships in a partial state. The audit surfaces **13 issues** across three severity tiers:

- **5 functional defects** an operator would experience
- **8 code-quality / consistency issues** that don't break functionality but make every future change unsafe

The headline finding is that Reports **does not participate in the global filter convention** — every other view in the app respects warehouse / category / status / month, but Reports ignores them entirely. Both client and server changes are needed to fix this.

---

## Severity A — Functional defects (operator-visible)

### A1. Reports ignores all global filters
- **What we see.** No `useFilters` integration in `Reports.vue`. The two report endpoints (`/api/reports/quarterly`, `/api/reports/monthly-trends`) accept zero query parameters.
- **Impact.** An operator filtering the dashboard to "London / Q3-2025" sees the global filter bar persist when navigating to Reports, but the Reports figures still aggregate across all warehouses for all time. Misleading.
- **Fix.** Add filter params to both endpoints (warehouse, category, status, month — same pattern as `/api/orders`). Wire `useFilters` in the Vue view; refetch on filter change.

### A2. Currency hardcoded to `$` regardless of locale
- **What we see.** `${{ formatNumber(...) }}` literally throughout the template (lines 31, 32, 85, 108, 112) and inside `getChangeValue()` (lines 286–290).
- **Impact.** When a Tokyo user switches to `ja`, the rest of the app shows ¥ values but Reports still shows `$`.
- **Fix.** Use `currentCurrency` from `useI18n` and format via `toLocaleString` with the right currency code.

### A3. Month names hardcoded in English
- **What we see.** `formatMonth()` uses a literal `['Jan', 'Feb', ...]` array (line 249).
- **Impact.** Bar chart labels and the month-over-month table show "Jan 2025" even in `ja` locale.
- **Fix.** Use `Date.prototype.toLocaleString('en'/'ja', { month: 'short', year: 'numeric' })`.

### A4. All UI text hardcoded English (D2 overlap)
- **What we see.** Every label, header, and message in the template is a literal English string (page heading, three card titles, two table header rows, four stat cards, "Loading reports...", "Failed to load reports").
- **Impact.** Tokyo team experiences the documented i18n gap.
- **Fix.** Add a `reports` namespace to `client/src/locales/en.js` and `ja.js`; replace literals with `t('reports.foo')`.

### A5. `formatNumber` crashes on missing data
- **What we see.** Line 217: `var str = num.toString()` — no guard. If a report row arrives with a missing field, `num` is `undefined` and the whole table fails to render with a TypeError.
- **Impact.** A single malformed row blanks the entire Reports page.
- **Fix.** Guard with a numeric default; or replace the whole function with `toLocaleString` (which handles null/undefined more gracefully via type coercion + a default).

---

## Severity B — Code-quality / consistency

### B1. Bypasses `api.js`; calls axios directly
- **What we see.** Lines 156, 162: `await axios.get('http://localhost:8001/api/reports/...')`. Hardcoded URL, no central client.
- **Why it matters.** Every other view uses `api.js`. When we move `API_BASE_URL` to env config (a sensible R3-time change), Reports will silently keep pointing at localhost.
- **Fix.** Add `getQuarterlyReports(filters)` and `getMonthlyTrends(filters)` to `api.js`; consume those.

### B2. Options API in a Composition-API codebase
- **What we see.** `data() { return { ... } }`, `methods: { ... }`, `mounted()` — classic Options API. The other six views all use `setup()`.
- **Why it matters.** Cognitive friction every time someone reads or touches this file. `client/CLAUDE.md` explicitly says "Stick to Composition API throughout project."
- **Fix.** Migrate to `setup()` with `ref` / `computed` / `onMounted`.

### B3. `v-for :key="index"` used in both tables
- **What we see.** Lines 28, 51, 82, 87, 93. Five places.
- **Why it matters.** Anti-pattern, documented in `client/CLAUDE.md`. If the data ever reorders, Vue reuses the wrong DOM nodes.
- **Fix.** Use `q.quarter` and `month.month` as keys.

### B4. ~13 `console.log` calls in the production code path
- **What we see.** Lines 145, 150, 155, 158, 161, 164, 167, 169, 172, 176, 215, 243, 256. Several inside hot paths (`formatNumber`, `formatMonth`, `getBarHeight`) which fire on every render.
- **Why it matters.** Console noise; minor performance cost; signals "left in mid-debug."
- **Fix.** Remove all of them.

### B5. `console.log` used for error logging
- **What we see.** Line 172: `console.log('Error loading reports:', err)`.
- **Fix.** `console.error`.

### B6. `getBarHeight()` recomputes max on every render
- **What we see.** Line 256: a full pass over `monthlyData` to find the max, called once per bar in the chart. O(n²).
- **Fix.** Compute `maxRevenue` once as a `computed`; pass into `getBarHeight` or close over it.

### B7. `var` keyword throughout
- **What we see.** Lines 182, 183, 184, 196, 197, 203, 204, 205, 217, 218, 219, 220, 222, 223, 245, 246, 247, 250, 258, 269, 284, 295, 310, 311. Pre-ES6 style.
- **Fix.** `const` / `let`.

### B8. Manual number formatting reinvents `toLocaleString`
- **What we see.** `formatNumber()` lines 214–240. Twenty-six lines to do what `(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' })` does in one line. Worse: the manual version doesn't respect locale (compounds with A2/A3).
- **Fix.** Replace with `toLocaleString` keyed on `currentLocale`.

---

## Recommended remediation order

The fixes are not independent; here's how I'd sequence them so each PR lands with a working app:

1. **Wave 1 — clean foundation** (B1, B2, B4, B5, B7). Mechanical refactor: api.js client + Composition API + remove console noise + var → const. No behavior change. Sets us up to make the functional fixes safely.
2. **Wave 2 — functional defects** (A1, A2, A3, A4, A5, B3, B8). The substantive work. Filter wiring (front + back), i18n, locale-aware formatting, key fixes, math safety.
3. **Wave 3 — polish** (B6). The performance fix; trivial after the rest.

Each wave gets a regression test under R3's Playwright scaffold before merging.

## Items that overlap other RFP requirements

- **A4 partially closes D2** for the Reports view. Doing it now means we don't pay twice.
- **B1 + B2 partially advance D1** (consistency cleanup). Same reasoning.
- **A1's server changes** (filter params on the reports endpoints) extend the `apply_filters()` pattern from `main.py` — small, fits the existing convention.
