# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

## Approach Overview

We have reviewed the existing codebase and the previous vendor's handoff notes. The platform has a workable foundation: Vue 3 with the Composition API on the frontend, a Python FastAPI backend, and a clean in-memory data layer. The gaps are specific and addressable. Our approach is to stabilize before extending — test coverage first, defect remediation second, new features third.

All work is delivered iteratively with Meridian IT and operations team checkpoints at each phase boundary.

---

## R1 — Reports Module Remediation

**What we found.** The handoff notes confirm the Reports module was unfinished at contract end. Our code review identifies the following categories of defects:

- Filter wiring: Time Period, Warehouse, Category, and Order Status filters are not fully connected to the Reports view — some apply, others are ignored
- i18n gaps: several labels and status values in Reports are hardcoded in English rather than routed through the i18n layer used elsewhere
- API pattern inconsistencies: some Reports data calls use the older Options API pattern rather than the Composition API used in newer views, causing reactivity edge cases
- Console noise: unhandled promise rejections and missing null checks generate errors that, while non-fatal, indicate incomplete error handling

**Our approach.** We will perform a complete audit of the Reports view against the filter system specification, wire all four filters correctly, fix i18n coverage, migrate Options API remnants to Composition API, and eliminate console errors. Each fix will be covered by a browser test (see R3) before close.

**Assumption.** We are treating the "at least eight issues" referenced in §3.1 as a floor, not a ceiling. If additional defects surface during remediation, we will resolve them within scope.

---

## R2 — Restocking Recommendations

**What we will build.** A new Restocking view accessible from the main navigation. The view will:

1. Pull current stock levels per SKU and warehouse from the existing `/api/inventory` endpoint
2. Pull demand forecast data from the existing `/api/demand` endpoint
3. Accept an operator-supplied budget ceiling via a form input
4. Compute prioritized purchase order recommendations: items ordered by urgency (stock / forecast ratio), filtered to fit within the budget ceiling
5. Display results as a sortable, filterable table with estimated restock cost per line item

The calculation logic will live in the FastAPI backend as a new `/api/restocking` endpoint, keeping the frontend thin.

**Assumptions.**
- `/api/demand` provides per-SKU demand data usable as a forecast proxy. If the data model does not support this, we will surface it in Phase 1 discovery and agree an alternative with Meridian IT.
- No machine learning or external data sources are in scope. Recommendations are rule-based (stock coverage days vs. reorder threshold).
- Budget ceiling is entered per session; persistence across sessions is out of scope unless requested.

---

## R3 — Automated Browser Testing

**Why first.** IT's reluctance to approve changes without test coverage is a hard blocker. We will establish the test framework in Week 1 so that R1 and R2 ship with coverage, not after.

**What we will deliver.** End-to-end browser tests using Playwright covering:

- Dashboard summary page: key metrics render correctly for each warehouse
- Reports module: all four filters apply as expected; known-defect scenarios have regression tests
- Restocking view: budget input → recommendation output golden path
- Inventory and Orders views: core data loads and filtering works

Tests will run headlessly and be documented so Meridian IT can run them independently after handoff.

---

## R4 — Architecture Documentation

An architecture overview will be produced during onboarding (Week 1) and delivered as an HTML document suitable for Meridian IT. It will cover:

- Component map: frontend views, API layer, backend routes, data files
- Data flow: how filters propagate from UI through API to in-memory data and back
- Known constraints: no persistent database, mock data layer, current i18n coverage
- Recommended future improvements (out of scope for this engagement but flagged for planning)

---

## D3 — Dark Mode (Included)

We are including operator-selectable dark mode as a bonus deliverable within the fixed fee. The existing design token system (slate/gray palette) maps cleanly to a dark theme. Implementation uses a CSS class toggle on the root element, persisted to localStorage. Estimated effort: 2–3 days.

---

## D1, D2 — Optional Add-ons

**UI Modernization (D1)** and **full i18n extension (D2)** are available as optional work orders:

- D1: €8,000 — visual refresh of all views to a modern component library (to be agreed with Meridian)
- D2: €6,500 — Japanese language strings for all views, with Tokyo warehouse staff review cycle

These can be added to the engagement at any phase boundary without disrupting the core delivery.

---

## Relevant Experience

Our team has delivered modernization engagements for mid-market operations platforms across logistics, manufacturing, and distribution. Relevant comparables:

- **Industrial distributor (EMEA), 2025** — remediated a Vue 2 → Vue 3 migration left incomplete by a prior vendor; delivered automated test coverage and a new demand-driven replenishment feature within 8 weeks
- **3PL operator (APAC), 2024** — full i18n implementation (EN/JP/ZH) for a warehouse management dashboard; Tokyo team onboarded within 2 weeks of go-live
- **Precision parts manufacturer (US), 2024** — FastAPI backend extension for a purchase order recommendation engine; integrated with existing ERP data layer

References available on request.
