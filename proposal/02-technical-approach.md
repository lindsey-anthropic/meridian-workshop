# Technical Approach

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
*Submitted by: adesso SE | Date: April 28, 2026*

---

## Delivery Philosophy

Our engagement follows a deliberate sequence: **stabilize → document → build → test**. This is not a convenience ordering — each phase depends on the one before it. A new feature built on top of unresolved defects inherits those defects. Test coverage written before the new capabilities exist cannot validate them. Architecture documentation produced before the code is understood produces documentation that is wrong.

Meridian's previous vendor built in the opposite direction — features first, foundations later. The result is a Reports module that was "in progress" at contract end and a codebase with no test coverage. We will not repeat that pattern.

By delivering R3 last, the browser test suite covers the complete application — both the remediated legacy flows and the new Restocking capability — giving Meridian IT a single, comprehensive green-gate check before approving any future change.

---

## R1 — Reports Module Remediation

**Approach:** We will begin with a structured code audit of the Reports module before touching a single line of code. The audit covers four areas:

- **Filter wiring:** The existing system uses four global filters (Time Period, Warehouse, Category, Order Status) that propagate as query parameters from Vue through `api.js` to the FastAPI backend. We will trace each filter end-to-end in the Reports view and verify that all combinations produce correct, consistent results.
- **Internationalization gaps:** We will inventory all user-facing strings in the Reports module and cross-reference them against the existing i18n key files. Any string rendered directly in the template (rather than via translation keys) is a defect.
- **API pattern consistency:** The codebase contains a mix of Composition API and Options API patterns — an acknowledged migration left incomplete by the previous vendor. We will identify any inconsistencies in how the Reports view handles reactivity and data fetching, and align it with the established Composition API pattern.
- **Console noise:** Any `console.error` or unhandled promise rejection in the Reports flow will be treated as a defect, not background noise.

Every finding will be documented before any fix is written. We treat Meridian's "at least eight issues" as a floor, not a ceiling — our audit is complete when no further defects are found, not when we reach eight.

Fixes are applied in order of blast radius: isolated, self-contained defects first; filter-wiring changes (which touch the data flow) last. Each fix is committed separately with a clear description so Meridian IT can trace every change.

**Assumption:** No pre-supplied issue list exists. We will discover and document all defects during the audit.

---

## R4 — Architecture Documentation

**Approach:** Architecture documentation is most accurate when produced immediately after a deep audit of the codebase — while findings are fresh and every edge case is understood. Accordingly, we produce R4 directly after R1 remediation.

The deliverable is a current-state architecture overview in two parts:

1. **Visual diagram (HTML):** An interactive diagram covering the major components — Vue views and their routing, the `api.js` client layer, FastAPI route handlers, the mock data layer (`server/data/*.json` loaded via `mock_data.py`), and the filter/reactivity patterns that connect them. Delivered as a self-contained HTML file, no tooling required to view it.

2. **Written narrative:** A companion document describing each layer's responsibility, the data flow from user interaction to API response, and any known constraints or design decisions inherited from the previous vendor. Written for Meridian IT staff — assumes familiarity with web applications but not with this specific codebase.

This document serves a dual purpose: it is the R4 deliverable to Meridian IT, and it is our own onboarding artifact for the R2 build that follows.

---

## R2 — Restocking Recommendations

**Approach:** With a stable, documented baseline in place, we build the Restocking view — the largest new capability in this engagement.

The Restocking view allows operations staff to specify a budget ceiling and receive a ranked list of recommended purchase orders based on current stock levels and demand forecast.

**Frontend (`RestockingView.vue`):**
- Budget ceiling input (numeric, currency-formatted)
- Recommended orders table: SKU, warehouse, current stock, forecasted demand, recommended order quantity, estimated cost
- Sort and filter by warehouse or category
- Consistent with the Composition API pattern used throughout the rest of the codebase after R1 remediation

**Backend (new endpoint `/api/restocking`):**
- Combines data from the existing `/api/inventory` (current stock) and `/api/demand` (demand forecast) endpoints
- Applies the budget ceiling as a constraint: recommend the highest-impact orders that fit within the specified budget
- Returns a ranked list ordered by demand urgency weighted against current stock coverage
- Implemented in FastAPI, consistent with existing route patterns

**Assumption:** The existing `/api/demand` endpoint provides sufficient forecast granularity (per SKU, per warehouse) to support purchase order recommendations. We flag this as a point for confirmation with VP Operations Tanaka before detailed design begins.

---

## R3 — Automated Browser Testing

**Approach:** Browser tests are written after both the remediation work and the Restocking feature are complete — so the test suite covers the full, final state of the application rather than a partial snapshot.

We will use **Playwright** to write end-to-end tests covering the critical user flows across all major views: Inventory, Orders, Spending, the remediated Reports module, and the new Restocking view. Test scope is determined by what Meridian IT needs to safely approve a change — meaning: if a test fails after a code change, that result should be sufficient to block the change without further manual review.

Each test is structured around a user action (apply a filter, navigate to a view, submit a budget and verify recommendations) rather than an implementation detail. This makes tests resilient to future refactoring.

The R1 filter interactions and the R2 budget/recommendation flow will each receive dedicated test coverage, as these are the highest-risk areas of the codebase.

**Goal:** After R3 is delivered, Meridian IT has a single green-gate check covering the complete application — legacy flows and new capabilities together — that they can run on any proposed future change.

---

## D1–D3 — Optional Extensions

These items are evaluated but not mandatory. We have scoped each as a discrete, additive extension that can be activated within the same engagement.

**D1 — UI Modernization:** As a design reference, we are using a modern inventory management dashboard (see `docs/dashboard-screenshot.png`) that exemplifies current standards for this class of application: a clean white/light-gray background, card-based KPI tiles with progress indicators, a persistent global filter bar, a consistent blue primary color with slate secondary tones, and clear typographic hierarchy throughout. This matches the visual language Meridian's operations team will already recognize from comparable tools.

The existing codebase uses a compatible design token set (slate/gray palette, status colors, custom SVG charts), so a refresh can be delivered by updating component-level styles without a full rewrite. We will propose a component-by-component mockup aligned to this reference direction for Meridian's approval before any implementation begins.

**D2 — Internationalization:** The application has an existing i18n infrastructure. Extension to remaining modules — the primary need being the Tokyo warehouse team — requires (a) identifying all untranslated strings during the R1 audit, (b) adding translation keys, and (c) providing locale files for Japanese (ja). Scope is dependent on the current i18n coverage, which we will quantify during R1. **Open question for Meridian:** Is there a preferred workflow for managing translation files (in-repo, external translation platform)? This affects the ongoing maintenance model.

**D3 — Dark Mode:** Operator-selectable theme via CSS custom properties and a theme toggle persisted to localStorage. Low implementation risk; naturally prototyped on a separate branch without affecting the main codebase.

---

## Assumptions Summary

| # | Assumption |
|---|---|
| A1 | R1 defects are discovered through code audit; no pre-supplied issue list from Meridian. |
| A2 | D1 design baseline is the existing design token set; brand guidelines or design system reference to be confirmed. |
| A3 | Fixed-fee pricing applies to R1–R4 and all D-items explicitly scoped in the commercial proposal. |
| A4 | `/api/demand` data is sufficient for R2 purchase order recommendations — to be confirmed with VP Operations before R2 design begins. |

**Open question for procurement (§6):** For D2, does Meridian have a preferred workflow for managing translation files (in-repo YAML/JSON vs. external platform)? This affects post-delivery maintenance.
