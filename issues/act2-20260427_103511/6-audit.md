# Act 2 — Delivery Audit

All changes made to the Meridian Components codebase during the engagement.
Date: 2026-04-27

---

## 1. server/main.py

### 1a. Import fix
Added `Query` to the FastAPI import line (required for the `/api/restocking` budget parameter with validation).

**Before:**
```python
from fastapi import FastAPI, HTTPException
```
**After:**
```python
from fastapi import FastAPI, HTTPException, Query
```

---

### 1b. BUG-01/02 — Report endpoints ignored filters

`get_quarterly_reports()` and `get_monthly_trends()` accepted no filter parameters, so the global FilterBar had zero effect on the Reports page. Both endpoints always returned the full 250-order dataset regardless of warehouse/category selection.

**Fix — `get_quarterly_reports()`:** added `warehouse`, `category`, `status` query params + `apply_filters()` call.

```python
# Before
@app.get("/api/reports/quarterly")
def get_quarterly_reports():
    filtered_orders = orders
    ...

# After
@app.get("/api/reports/quarterly")
def get_quarterly_reports(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
):
    filtered_orders = apply_filters(orders, warehouse, category, status)
    ...
```

**Fix — `get_monthly_trends()`:** same treatment.

**Verified:** `curl "http://localhost:8001/api/reports/quarterly?warehouse=San+Francisco"` returned 72 orders vs 250 unfiltered (–71%).

---

### 1c. R2 — New `/api/restocking` endpoint

New Pydantic model + endpoint that ranks understocked items by priority and trims to a budget ceiling.

**`RestockingRecommendation` model:**
```python
class RestockingRecommendation(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    warehouse: str
    current_stock: int
    reorder_point: int
    qty_to_order: int
    unit_cost: float
    total_cost: float
    priority_score: float
    demand_trend: str
```

**Trend weight constant:**
```python
TREND_WEIGHT = {"increasing": 1.5, "stable": 1.0, "decreasing": 0.5}
```

**Algorithm (per item):**
```
stock_gap        = reorder_point − quantity_on_hand
qty_to_order     = max(stock_gap, forecasted_demand)
total_cost       = qty_to_order × unit_cost
priority_score   = stock_gap × trend_weight × unit_cost
```

Items are sorted by `priority_score` descending, then trimmed greedily to stay within the `budget` ceiling.

**Endpoint signature:**
```python
@app.get("/api/restocking", response_model=List[RestockingRecommendation])
def get_restocking_recommendations(
    budget: float = Query(..., gt=0),
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
):
```

---

## 2. client/src/api.js

Added three new API client methods:

| Method | Endpoint | Used by |
|--------|----------|---------|
| `getQuarterlyReports(filters)` | `GET /api/reports/quarterly` | Reports.vue |
| `getMonthlyTrends(filters)` | `GET /api/reports/monthly-trends` | Reports.vue |
| `getRestockingRecommendations(budget, filters)` | `GET /api/restocking` | Restocking.vue |

All three pass warehouse/category filter params via `URLSearchParams`, consistent with existing patterns in the file.

---

## 3. client/src/views/Reports.vue — full rewrite

The original file used Options API and had at least 8 bugs. Rewritten in Composition API.

### Bugs fixed

| # | Bug | Root cause | Fix |
|---|-----|-----------|-----|
| 1 | Filters had no effect | No `useFilters()` integration; hardcoded empty params | Added `getCurrentFilters()` + `watch(getCurrentFilters, loadData, { deep:true, immediate:true })` |
| 2 | Quarterly data never re-fetched on filter change | No watcher on filter state | Same watcher above |
| 3 | Monthly trends API not called | `getMonthlyTrends()` didn't exist in api.js | Added method + `Promise.all()` in `loadData` |
| 4 | `v-for` used array index as `:key` | `key="index"` throughout | Changed to `key="q.quarter"` and `key="month.month"` |
| 5 | `console.log` left in production code | Debugging artifact | All removed |
| 6 | Options API `data()` / `methods` pattern | Architecture mismatch with rest of codebase | Migrated to `setup()` with `ref`, `computed`, `watch` |
| 7 | `loading` never set to `false` on error | Missing `finally` block | Added `try/catch/finally` |
| 8 | Date parsing with no validation | `new Date(str)` called on potentially null values | `formatMonth()` guards on null/undefined |

### New computed properties
- `totalRevenue` — sum of all monthly revenue
- `avgMonthlyRevenue` — total / count
- `totalOrders` — sum of monthly order counts
- `bestQuarter` — quarter with highest `total_revenue`
- `maxRevenue` — used to scale bar chart heights

---

## 4. client/src/views/Restocking.vue — new file

Entirely new view for R2. Key features:

- **Budget input** with `$` prefix, step 1000, Enter key triggers load
- **Apply button** calls `api.getRestockingRecommendations(budget, { warehouse, category })`
- **Budget tracker bar**: color-coded green/amber/red at 0–70% / 70–90% / 90–100% usage
- **Recommendations table**: SKU, Item, Category, Warehouse, In stock, Reorder at, Qty to order, Unit cost, Total cost, Trend badge, Priority score
- **Trend badges**: `increasing` = red (urgent), `stable` = gray, `decreasing` = green (deprioritized)
- **Watchers**: `[selectedLocation, selectedCategory]` re-trigger `loadRecommendations` on filter change
- **Empty state**: message shown when budget is too low or no understocked items match filters

---

## 5. client/src/App.vue

Added Restocking nav link:
```html
<router-link to="/restocking" :class="{ active: $route.path === '/restocking' }">
  Restocking
</router-link>
```

---

## 6. client/src/main.js

Registered `/restocking` route:
```javascript
import Restocking from './views/Restocking.vue'

// in routes array:
{ path: '/restocking', component: Restocking }
```

---

## 7. proposal/architecture.html

New interactive HTML document with:
- **Stack diagram**: Vue 3 (port 3000) → FastAPI (port 8001) → in-memory mock data
- **Filter matrix**: table mapping each API endpoint to supported query parameters, with BUG markers on the two report endpoints (pre-fix)
- **Component map**: views and composables dependency graph
- **Tech debt register**: 8 items from vendor handoff (no auth, no DB, no pagination, etc.)

---

## 8. tests/e2e/ — new Playwright test suite

5 spec files covering all major flows:

| File | Tests | Key assertions |
|------|-------|---------------|
| `dashboard.spec.js` | 3 | Stat cards load, nav links visible, filter doesn't error |
| `inventory.spec.js` | 4 | Table rows, column data, low-stock badges, category filter |
| `orders.spec.js` | 3 | Table renders, status filter narrows results, badges present |
| `reports.spec.js` | 6 | Quarterly table, bar chart, MoM table, YTD stats, **R1 filter fix**, zero console errors |
| `restocking.spec.js` | 6 | Budget input, apply loads data, tracker bar, budget reduction reduces rows, columns, trend badge classes |

Runner: `cd tests/e2e && npm install && npm test`
Requires: frontend on `localhost:3000`, backend on `localhost:8001`.

---

## Summary

| Requirement | Status | Files changed |
|-------------|--------|--------------|
| R1 — Reports filter fix | ✅ Done | `server/main.py`, `client/src/views/Reports.vue`, `client/src/api.js` |
| R2 — Restocking feature | ✅ Done | `server/main.py`, `client/src/views/Restocking.vue`, `client/src/api.js`, `client/src/App.vue`, `client/src/main.js` |
| R3 — Playwright e2e tests | ✅ Done | `tests/e2e/*.spec.js` |
| R4 — Architecture doc | ✅ Done | `proposal/architecture.html` |
