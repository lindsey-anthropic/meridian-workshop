# 3 — R1 Reports Module Remediation
> Files to touch: `server/main.py`, `client/src/views/Reports.vue`, `client/src/api.js`
> Rule: every fix ships with a corresponding Playwright test

## Bug catalog (from pre-engagement code audit)

### BUG-01 — Quarterly endpoint missing filters [BACKEND]
**File:** `server/main.py` L231–274
**Problem:** `GET /api/reports/quarterly` accepts no warehouse/category/status/month params.
Every other data endpoint supports these filters — this is an API inconsistency.
**Fix:**
```python
@app.get("/api/reports/quarterly")
def get_quarterly_reports(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
):
    filtered_orders = apply_filters(orders, warehouse, category, status)
    # rest of logic unchanged but operating on filtered_orders
```

### BUG-02 — Monthly-trends endpoint missing filters [BACKEND]
**File:** `server/main.py` L276–305
**Problem:** `GET /api/reports/monthly-trends` accepts no filters. Same issue as BUG-01.
**Fix:** same pattern as BUG-01

### BUG-03 — Reports.vue ignores useFilters() [FRONTEND]
**File:** `client/src/views/Reports.vue` L127+
**Problem:** Component calls axios directly without reading the global filter state from `useFilters.js`.
Changing the FilterBar has zero effect on the Reports view.
**Fix:** import `useFilters`, read `getCurrentFilters()`, pass to API calls.
Add a `watch` on filter state to reload data on change.

### BUG-04 — Reports.vue bypasses api.js [FRONTEND]
**File:** `client/src/views/Reports.vue` L156, L162
**Problem:** Uses `axios.get('http://localhost:8001/api/reports/...')` directly
instead of the centralized `api.js` client used by every other view.
**Fix:**
1. Add `getQuarterlyReports(filters)` and `getMonthlyTrends(filters)` to `api.js`
2. Replace direct axios calls in `Reports.vue` with these functions

### BUG-05 — Options API instead of Composition API [FRONTEND]
**File:** `client/src/views/Reports.vue` entire `<script>` block
**Problem:** Uses `export default { data(), mounted(), methods: {} }` pattern.
Every other view uses `setup()` with Composition API. Inconsistency creates regression risk.
**Fix:** full rewrite using `ref`, `computed`, `onMounted`, `watch`

### BUG-06 — Console noise (7+ console.log calls) [FRONTEND]
**File:** `client/src/views/Reports.vue` L145, L153, L158, L163, L167, L214, L256, L262
**Problem:** Debug logs left in production code. `formatNumber` and `getBarHeight`
are called on every render cycle, flooding the console.
**Fix:** remove all debug `console.log` calls

### BUG-07 — ES5-style code in calculateSummaryStats [FRONTEND]
**File:** `client/src/views/Reports.vue` L181–211
**Problem:** Uses `var` with variable shadowing (three separate `var i` declarations
in the same function scope) and old-style `for` loops.
**Fix:** rewrite with `const`, `reduce()`, `Math.max()` — covered by BUG-05 migration

### BUG-08 — v-for using array index as key [FRONTEND]
**File:** `client/src/views/Reports.vue` L28, L51, L82
**Problem:** `:key="index"` on all v-for loops instead of stable unique identifiers.
Vue can reuse the wrong DOM elements when the list changes.
**Fix:** use `q.quarter` and `month.month` as keys (unique by definition)

## ⚠️ Trap warning
The CLAUDE.md says "at least eight issues" — the list above may not be complete.
Run a full visual audit in the browser with DevTools open before closing R1.
Watch for: i18n gaps in labels, number formatting edge cases, missing error states.

## Recommended fix order

```
1. BUG-01 + BUG-02  → backend filters (unblocks everything else)
2. BUG-04           → add getQuarterlyReports / getMonthlyTrends to api.js
3. BUG-03           → Reports.vue reads useFilters + watch for changes
4. BUG-05 + BUG-07  → full Composition API migration
5. BUG-06           → remove all console.log
6. BUG-08           → fix v-for keys
```

## Watch pattern to add after migration

```javascript
// In Reports.vue setup() after migration
const { getCurrentFilters } = useFilters()

watch(getCurrentFilters, async () => {
  await loadData()
}, { deep: true })
```

## Suggested prompt

```
Audit client/src/views/Reports.vue and the /api/reports/* endpoints in server/main.py.
List all bugs found before writing any code.
Then fix BUG-01 and BUG-02 (backend filters) and add getQuarterlyReports()
and getMonthlyTrends(filters) to api.js.
```
