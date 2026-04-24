# Technical Approach

**RFP MC-2026-0417 — Meridian Components**

---

## R1 — Reports Module Remediation

The previous vendor documented the Reports module as "in progress" at handoff, with filters not fully wired and no enumeration of outstanding defects. Our approach treats this as an open-ended audit: we will review all filter behavior, data patterns, internationalization gaps, and console output against the current codebase, document every defect found, and resolve them.

**Assumption:** Meridian has no formal bug tracker for these defects. Our audit findings become the authoritative list. We will share a defect inventory with R. Tanaka's team for sign-off before closing out remediation.

Specific areas of focus based on the vendor handoff notes:
- Filter wiring: Time Period, Warehouse, Category, and Order Status filters applied consistently to all Reports views
- API pattern consistency: Reports endpoints aligned with the established data flow (Vue filters → api.js → FastAPI → Pydantic)
- i18n gaps: any hardcoded strings in Reports views extracted to the localization layer
- Console noise: warnings and errors resolved, not suppressed

---

## R2 — Restocking Recommendations

The Restocking view will recommend purchase orders across active SKUs given three inputs: current stock levels, demand forecast, and an operator-supplied budget ceiling. The recommendation engine will maximize total units restocked within the budget — treating this as a constrained allocation problem, not a simple threshold trigger.

**Data sources:** The existing backend exposes `/api/inventory` (stock by warehouse and category) and `/api/demand` (demand forecast). Restocking recommendations will be computed server-side against these datasets and returned via a new `/api/restocking` endpoint.

**UI:** A dedicated Restocking view in the dashboard will allow operators to enter a budget ceiling, select warehouse scope, and receive a ranked recommendation table: SKU, current stock, projected demand, recommended order quantity, and estimated cost. The view will follow existing Vue 3 Composition API patterns.

**Assumption:** Recommendation logic operates on in-memory JSON data (no external ERP or supplier catalog integration). Optimization is per-warehouse-per-session; no persistence of generated orders is required unless Meridian specifies otherwise.

---

## R3 — Automated Browser Testing

Test coverage will be established using Playwright end-to-end tests against the live application. Coverage will include the four flows Meridian IT has identified as required for change approval:

1. **Dashboard summary** — page loads, KPI tiles render with data
2. **Inventory** — filter by warehouse and category, results update correctly
3. **Reports** — all filters apply, data renders without console errors
4. **Restocking** — budget input accepted, recommendations returned and displayed

Tests will be written to run against `localhost:3000` in CI and will be delivered as part of the repository alongside the application code.

**Assumption:** Meridian IT's approval gate is covered by these four flows. If additional flows are identified during the engagement, we will scope them with your team.

---

## R4 — Architecture Documentation

Architecture documentation will be produced during our onboarding phase — before any code changes — so it reflects what was actually delivered by the previous vendor, not what we subsequently modify. A final updated version will be delivered at engagement close.

The documentation will include: component diagram (frontend views, API layer, backend services, data layer), data flow for the primary filter/query pattern, API endpoint inventory, and a summary of known technical debt inherited from the previous vendor.

Format: interactive HTML diagram delivered to `proposal/architecture.html`, suitable for handoff to Meridian IT.

---

## Desired Items (D1–D3)

D1 (UI modernization), D2 (full i18n), and D3 (dark mode) are in scope as stretch objectives at no additional cost. We will prioritize them with R. Tanaka's team after R1–R4 are complete, in the order that delivers the most value given remaining timeline. We do not commit to all three but expect to deliver at least one.

