# Technical Approach

**Submitted by:** Accenture
**RFP Reference:** MC-2026-0417

---

## Overview

Our approach follows Meridian's stated priority order: stabilize the existing system first, then extend it. We do not begin feature work until we understand what we inherited. The architecture review (R4) and Reports audit (R1) both happen in week one — before a line of new code is written.

Testing (R3) is not a phase. It runs alongside every delivery. By the time each requirement is marked complete, its tests are already committed.

---

## R1 — Reports Module Remediation

We will begin with a structured audit of the Reports module against the four filter dimensions described in the previous vendor's handoff: Time Period, Warehouse, Category, and Order Status. Our audit will classify each defect by type — filter wiring, i18n gap, data pattern inconsistency, or other — and produce a written findings document before remediation begins.

Fixes will be addressed by category rather than ad-hoc, which reduces regression risk and makes the change set reviewable. Each fix will reference the finding it resolves.

**Assumption:** Meridian has not provided a formal defect list. Our audit will establish the authoritative list. We expect to surface at least the eight issues referenced in the RFP, and will flag any additional findings for Meridian's review before acting on them.

---

## R2 — Restocking View

We will design and deliver a new Restocking view that surfaces purchase order recommendations for each SKU across Meridian's three warehouses.

**Inputs:**
- Current stock levels (existing inventory data)
- Demand forecast (existing forecast data)
- Operator-supplied budget ceiling (entered at runtime)

**Recommendation logic:** For each SKU, we calculate the gap between current stock and a reorder threshold derived from demand. Recommendations are ranked by urgency and filtered to fit within the supplied budget. The operator can accept, adjust, or dismiss individual recommendations.

**Implementation:** New FastAPI endpoint(s) on the backend; new Vue 3 view on the frontend using Composition API, consistent with the codebase's modern patterns. The existing filter system (Warehouse, Category) will apply to the Restocking view so operators can scope recommendations to a specific warehouse or product category.

**Assumption:** Recommendation logic is rules-based (threshold × demand forecast), not machine-learning-based. If Meridian wishes to incorporate a forecasting model in the future, the endpoint contract will be designed to accommodate that extension.

---

## R3 — Automated Browser Testing

We will establish end-to-end test coverage using Playwright, targeting the two flows Meridian's IT team most needs protected: the Reports module and the Restocking view.

Tests will be written alongside each feature — not at the end of the engagement. When R1 remediation is complete, its tests are committed. When R2 ships, its tests ship with it.

**Coverage scope:**
- Reports: filter combinations, data display accuracy, i18n rendering
- Restocking: budget input, recommendation generation, accept/dismiss interactions

**Deliverable:** A test suite that Meridian IT can run independently via a single command, with documentation on how to extend coverage for future changes.

**Assumption:** "Critical flows" means the Reports module and Restocking view, per R1 and R2. We will confirm this interpretation with Meridian IT during onboarding.

---

## R4 — Architecture Documentation

We will produce a current-state architecture overview in week one, before substantive changes begin. This document will serve as both an onboarding artifact for our team and a handoff reference for Meridian IT.

**Contents:**
- Component map: frontend views, backend routes, data files
- Data flow: how filters propagate from the UI through the API to in-memory filtering
- API surface: all endpoints, parameters, and response shapes
- Known technical debt: incomplete Options→Composition API migration, absence of a database layer, areas where the previous vendor's documentation diverges from the actual code

**Format:** HTML diagram with written narrative, suitable for display in a browser and printing.

---

## Desired Items — Optional Extensions

The following items are outside the base engagement scope and are priced separately. Meridian may elect to add any or all of them after core delivery.

**D1 — UI Modernization**
Refresh of design tokens, typography, and component styling. Scope depends on Meridian's target standard (to be confirmed); we have estimated based on a moderate refresh of the existing slate/gray palette and layout system.

**D2 — Internationalization**
Extension of i18n support to all remaining modules, with priority on views used by the Tokyo warehouse team. Builds on existing i18n infrastructure in the codebase.

**D3 — Dark Mode**
Operator-selectable theme implemented via CSS custom properties. Low-light station compatibility is the primary driver. Can be prototyped independently without disrupting the main codebase.

---

## Assumptions Summary

| #  | Assumption                                                                 |
|----|----------------------------------------------------------------------------|
| A1 | No formal defect list exists for R1; Accenture will establish it via audit |
| A2 | "Critical flows" (R3) = Reports module + Restocking view                   |
| A3 | Restocking recommendation logic is rules-based, not ML                     |
| A4 | No database migration is in scope; flat JSON files remain the data layer   |
| A5 | D1–D3 are out of base scope; priced as optional extensions                 |
