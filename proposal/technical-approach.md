# 3. Technical Approach

*Accenture response to RFP MC-2026-0417 — Meridian Components, Inc.*

---

## 3.1 Engagement Model

We deliver this engagement in two beats: a one-week discovery sprint followed by parallel delivery of the four required items. Both sit inside a single fixed-fee envelope.

Discovery week is included in the fee. It produces three confirmed artifacts: a categorized defect list for Reports (R1), an IT-validated critical-flow list for testing (R3), and a calibrated R2 algorithm specification with VP Operations. These artifacts become the locked Statement of Work. From week 2, the fixed fee is committed and we deliver against a known scope rather than an estimated one.

The Discovery Calibration Clause governs the fee: if discovery materially diverges from the algorithm and scope laid out in §3.2 — specifically if Meridian elects cross-warehouse rebalancing or other phase-2 capabilities — one change order follows. Not a series of revisions, not weekly scope adjustments. One.

This structure is our structural answer to the previous-vendor pattern of unfinished work delivered against optimistic estimates. We size for delivery, not for the bid.

---

## 3.2 Restocking Capability (R2)

Our Restocking view recommends purchase orders against current stock levels, demand forecasts, and an operator-supplied budget ceiling. The recommendation engine uses a reorder-point model.

For each SKU, the reorder threshold is calculated as `demand-forecast × lead-time + safety-stock`, where the safety-stock buffer is configurable per SKU. SKUs below threshold become candidates for the recommendation list. The operator's budget ceiling allocates across candidates in priority order: service-level criticality (cost-of-stockout) first, with unit margin and order volume as tiebreakers. Recommendations beyond the budget ceiling are listed but flagged as deferred, so the operator sees what has been left out, not only what fits.

Version 1 evaluates each warehouse independently. **Cross-warehouse rebalancing** — deciding which SKUs to ship between San Francisco, London, and Tokyo rather than reorder fresh — is explicitly a phase-2 candidate, not v1 scope. This is the boundary that triggers the Discovery Calibration Clause: if Meridian elects cross-warehouse logic in v1, one change order follows. We name it here so the boundary is unambiguous to both parties.

The implementation adds a new `/api/recommendations` endpoint to the existing FastAPI service, following the codebase's established pattern (`?warehouse=X&category=Y`). The endpoint reads from inventory, demand-forecast, and backlog data already exposed by the API. The frontend adds a Restocking view that consumes the endpoint, renders the recommendation list with budget visualization, and allows operators to flag recommendations as PO-issued (state transition).

Three operational parameters are required and will be calibrated with VP Operations in week 1: per-SKU lead times, supplier preferences (where multiple suppliers exist), and per-SKU stockout tolerance. We do not assume defaults for these — they are inputs we capture from the operations team, not from us.

We expect the v1 algorithm to handle the bulk of restocking decisions today. We do not expect it to replace operator judgment on edge cases — one-off promotions, supplier changes, seasonal correction. The view is built to support overrides, not to suppress them.

---

## 3.3 Test Coverage (R3)

Backend test coverage already exists. The previous vendor delivered 55 passing pytest tests in `tests/backend/`, covering inventory, dashboard, demand, orders, and spending endpoints. We treat that suite as a foundation and extend it where new R2 endpoints land. We do not propose to rewrite or replace it.

The frontend has no automated test coverage. R3 addresses that, in order of value to IT change-confidence:

**End-to-end (Playwright)** on the critical user flows listed below. This is the layer that gives IT the strongest confidence to approve future changes — flows pass or fail in a real browser against a real backend.

**Frontend unit and component tests** (Vitest) on shared composables (`useFilters`, `useI18n`) and the new R2 recommendation logic. Selective, not blanket. We add coverage where it hardens the gates that downstream changes most often touch.

The flow list below is the IT-validated scope of E2E coverage. Discovery week 1 includes a written exchange with IT, routed through procurement, to confirm or amend this list before remediation work commits to fixed-fee.

**Proposed critical flows** (subject to IT calibration in week 1):

1. Dashboard load with default filters across all three warehouses.
2. Inventory filter and sort by warehouse, category, and stock level.
3. Order list filter by status and month, plus order detail view.
4. Demand forecast view, including time-period switching.
5. Spending summary view, drilling into monthly transactions.
6. Reports module — quarterly and monthly trend rendering with filters applied.
7. Restocking — generate recommendations against a budget ceiling.
8. Restocking — adjust the budget and observe recommendations recalculate.
9. Restocking — flag a recommendation as PO-issued (state transition).
10. Locale switching — verify Tokyo-locale strings render across views (per D2).

Test execution is integrated into CI on every commit. A failing critical-flow test blocks merge by default.

---

## 3.4 Reports Module Remediation (R1)

Our review of `client/src/views/Reports.vue` confirms the RFP's account of "at least eight" defects and the previous vendor's note that filter wiring was "in progress, not all wired up." Observable patterns include thirteen `console.log` statements left in shipping code (lines 145–256), absent filter UI controls despite the backend exposing filter parameters, hardcoded API URLs that bypass the codebase's abstracted API client (lines 156, 162), missing internationalization integration unique to this view, and an inline growth-rate calculation that diverges from the backend-computed-summary pattern used elsewhere in the application.

We do not enumerate the remediation list in this proposal. Instead we propose the audit-then-fix structure described in §3.1: discovery week produces a categorized defect list — genuine bugs vs unfinished feature work — and a locked-in remediation scope inside the fixed fee. The audit deliverable is itself shareable with Meridian IT and operations as a record of what was found.

Remediation brings the Reports view into pattern alignment with the rest of the codebase: shared composables for filters and i18n, abstracted API client usage, backend-computed summary stats. Pattern alignment matters because it is what lets future change land predictably — the inverse of what made the previous engagement difficult to wind down.

---

## 3.5 Architecture Documentation (R4)

We deliver a self-contained HTML overview of the system architecture at handoff. It covers data flow (Vue → `api.js` → FastAPI → JSON files), API endpoint patterns, frontend composables and their consumers, the JSON-as-data-store choice and its scaling implications, and the locations of test coverage by layer. The document is generated from the codebase rather than written separately, so it stays accurate to what is deployed.

The document is a living artifact. We update it through the engagement as scope evolves, and Meridian IT receives the final version at handoff alongside the source.

---

## 3.6 Desired Capabilities (D1–D3)

**D1 — UI modernization.** A light visual refresh is in scope: typographic hierarchy, spacing rhythm, status-color consistency, and chart styling. A full design-system rebuild is deferred — that work properly belongs with a design partner and a separate scope of work, not as a side-effect of this engagement. We state this directly because under-promising on D1 protects the timeline of R1–R4.

**D2 — Internationalization extension.** In scope. The existing `useI18n` composable is the correct extension point; we bring the Reports view into i18n compliance during R1 remediation, audit remaining views for missing strings, and extend translation coverage to Tokyo-locale where it is currently English-only. The Tokyo team's variable English proficiency is the operational driver here, and the work is bounded by the views that are not already covered.

**D3 — Dark mode.** In scope as an operator-selectable preference. The existing slate/gray palette and CSS variable structure make this a theming layer rather than a redesign. Modest effort, high warehouse-floor value given low-light station environments.

---

## 3.7 Stated Assumptions

**A1 — Reports scope.** Based on the previous vendor's handoff and our review of the Reports view, we have assumed the eight-plus logged Reports issues include both unresolved defects and incomplete feature work. Discovery week 1 produces a categorized defect list before remediation work commits to fixed-fee.

**A2 — Operations partnership.** Our timeline includes a one-hour working session with the VP of Operations in week 1 to calibrate the restocking recommendation algorithm — specifically lead times, supplier preferences, and per-SKU stockout tolerance. This is built into discovery, not treated as a separate dependency.

**A3 — IT alignment.** Per procurement's confirmation that pre-submission IT contact is routed through procurement, we publish our critical-flow list and coverage layers in §3.3 and propose week-1 calibration with IT. Any deltas to the flow list are reflected in the locked Statement of Work at the end of discovery.

**A4 — Commercial structure.** Per procurement's confirmation that a single fixed-fee envelope is required, the engagement is priced as a single fixed fee with a Discovery Calibration Clause: if R2 scope materially diverges from the v1 algorithm in §3.2 — specifically the election of cross-warehouse rebalancing — one change order follows.
