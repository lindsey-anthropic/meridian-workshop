# 1 — R4 Architecture Documentation
> Output: `proposal/architecture.html`

## Current stack

```
Browser (localhost:3000)
  └── Vue 3 + Vite
        └── client/src/App.vue           → router + nav
        └── client/src/views/*.vue       → 6 views
        └── client/src/components/*.vue  → modals and FilterBar
        └── client/src/composables/      → useFilters, useAuth, useI18n
        └── client/src/api.js            → all axios fetches (centralized)

HTTP (axios → localhost:8001)

FastAPI (localhost:8001)
  └── server/main.py       → 15+ endpoints
  └── server/mock_data.py  → loads JSON into memory at startup
  └── server/data/*.json   → static data files (no database)
```

## Views and corresponding endpoints

| View | File | API endpoint |
|---|---|---|
| Dashboard | `Dashboard.vue` | `GET /api/dashboard/summary` |
| Inventory | `Inventory.vue` | `GET /api/inventory`, `GET /api/inventory/{id}` |
| Orders | `Orders.vue` | `GET /api/orders`, `GET /api/orders/{id}` |
| Reports | `Reports.vue` | `GET /api/reports/quarterly`, `GET /api/reports/monthly-trends` |
| Spending | `Spending.vue` | `GET /api/spending/summary`, `/monthly`, `/categories`, `/transactions` |
| Backlog | `Backlog.vue` | `GET /api/backlog`, `POST /api/purchase-orders` |
| Demand | `Demand.vue` | `GET /api/demand` |

## Filter support matrix

| Endpoint | warehouse | category | status | month |
|---|---|---|---|---|
| `/api/inventory` | ✅ | ✅ | — | — |
| `/api/orders` | ✅ | ✅ | ✅ | ✅ |
| `/api/dashboard/summary` | ✅ | ✅ | ✅ | ✅ |
| `/api/reports/quarterly` | ❌ | ❌ | ❌ | ❌ |
| `/api/reports/monthly-trends` | ❌ | ❌ | ❌ | — |
| `/api/demand` | — | — | — | — |
| `/api/backlog` | — | — | — | — |
| `/api/spending/*` | — | — | — | — |

**→ Report endpoints are the only ones missing filters. This is the root cause of R1.**

## Standard data flow

```
useFilters.js (singleton)
  selectedPeriod / selectedLocation / selectedCategory / selectedStatus
    ↓ getCurrentFilters()
  api.js
    ↓ axios.get(endpoint + query params)
  FastAPI main.py
    ↓ apply_filters() + filter_by_month()
  mock_data.py (in-memory list)
    ↓ Pydantic model validation
  JSON response
    ↓
  Vue ref() → computed() → template render
```

## Technical debt identified

| # | Issue | File | Impact |
|---|---|---|---|
| TD1 | `Reports.vue` uses Options API instead of Composition API | `client/src/views/Reports.vue` | Inconsistency, regression risk |
| TD2 | `Reports.vue` calls axios directly instead of using `api.js` | `client/src/views/Reports.vue` | Bypasses centralized API pattern |
| TD3 | `Reports.vue` does not use `useFilters()` | `client/src/views/Reports.vue` | Global filters are ignored |
| TD4 | 7+ `console.log` calls in `Reports.vue` | `client/src/views/Reports.vue` | Console noise in production |
| TD5 | `calculateSummaryStats` uses `var` and ES5-style `for` loops | `client/src/views/Reports.vue` | Code quality |
| TD6 | Report endpoints missing `apply_filters()` | `server/main.py` L231–305 | Backend filters not working |
| TD7 | `api.js` has no `getReports*` functions | `client/src/api.js` | Reports bypasses the pattern |

## Output to produce

```bash
# Prompt in Claude Code
Read the codebase (client/src and server/main.py) and generate proposal/architecture.html
including: stack diagram, endpoint/filter matrix, component map per view, tech debt list.
Open it in the browser when done.
```
