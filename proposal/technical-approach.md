# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

Our approach is grounded in what we found when we read the code: the previous vendor left a working foundation, not a broken one. The Vue 3 frontend, the FastAPI backend, the filter system, the data layer — these are sound. The work ahead is completion and hardening, not rebuilding. We will extend what exists using the same patterns it already follows, so the codebase Meridian's IT team inherits is coherent, not a patchwork of two vendors' habits.

We address requirements in the order that reduces risk fastest: architecture documentation first to orient the team, Reports remediation second to close the most visible gap, test coverage third to unblock IT approval of everything that follows, and Restocking last because it is the largest build and benefits from the confidence that test coverage provides.

---

## R4 — Architecture Documentation

**Why first.** Before touching a single line of production code, we produce a current-state architecture overview. This document serves two purposes: it gives Meridian IT a handoff artifact that the previous vendor did not deliver, and it gives our team a shared map before we make changes. Surprises found during review become findings, not incidents.

**What we will document.** Stack and runtime (Vue 3 + Vite frontend, Python FastAPI backend, JSON file-based data layer, no external database). Data flow from the Vue filter system through `api.js` to FastAPI endpoints through Pydantic models to computed properties in the UI. All API endpoints with their filter parameters, response shapes, and known gaps. Frontend view structure and component dependencies. Anything that diverges from the handoff notes — the previous vendor's documentation was minimal and may be incomplete.

**Deliverable.** An interactive HTML diagram suitable for screen presentation and PDF export, written to the project repository. Delivered at the end of week one.

---

## R1 — Reports Module Remediation

The Reports module is the most visible failure in the current system and the one Meridian's operations team encounters daily. The previous vendor acknowledged it was in progress at contract end; they did not document which defects remained or why.

**Our audit approach.** We will work through the module systematically: browser console output, network request inspection, side-by-side comparison of filter behavior against the other views, and code review of the wiring between the Vue filter components and the API calls. We expect to find filters that are rendered but not connected to query parameters, i18n keys that are missing or falling back to English silently, API response patterns that differ from the standard used in other views, and possibly computed property errors that surface only under specific filter combinations.

**How we will fix it.** Each defect gets its own commit with a description that references the symptom. This gives Meridian an audit trail: you can see what was wrong, what changed, and why. We do not batch unrelated fixes into single commits.

**Assumptions.** We have identified at least eight issues based on the RFP description and our initial code review. If the audit surfaces additional defects beyond what Meridian has logged, we will document them and address them within the same scope — the goal is a fully functional Reports module, not a checklist.

**Deliverable.** Reports module with all defects resolved, verified across the three warehouse contexts (San Francisco, London, Tokyo) and across all filter combinations. Delivered end of week three.

---

## R3 — Automated Browser Testing

The absence of test coverage is the structural problem that has made Meridian's IT team reluctant to approve any changes. R3 is not just a deliverable — it is what makes every subsequent change to this system safe to ship.

**Tool.** Playwright. It is already configured in the repository. We will write tests that run against the locally served application and that can be integrated into a CI pipeline when Meridian is ready to do so.

**Coverage scope.** We will cover the flows that represent the highest operational risk: inventory browsing and filtering by warehouse and category; the Reports module with its filter combinations (this is where the known defects live); the Dashboard summary view with KPI accuracy checks; and the Restocking recommendations flow once R2 is delivered. Tests will assert on both UI state and the network requests that drive it, so regressions in the data layer are caught as well as regressions in the interface.

**Deliverable.** An executable Playwright test suite committed to the repository, with a README section explaining how to run it and how to extend it. Delivered end of week four, with the Restocking tests added after R2.

---

## R2 — Restocking Recommendations

This is the capability Meridian's operations team has been waiting for. It is also the largest single build in this engagement, which is why we sequence it after R1 and R3: the team is oriented, the known defects are closed, and test coverage means we can build confidently.

**Data foundation.** The backend already exposes demand forecast data via `/api/demand`. We will use this as the primary input alongside current stock levels from `/api/inventory`. We are not building a forecast model — we are building a recommendation engine on top of data that already exists. This is our assumption A1; if Meridian's team has concerns about the quality of the existing demand data, we should discuss before this phase begins.

**Recommendation logic.** For each SKU and warehouse combination, we will compute a restock quantity based on the gap between current stock and a demand-adjusted target, subject to the operator-supplied budget ceiling. The logic will be implemented as a new FastAPI endpoint following the existing API patterns, returning structured recommendations that the frontend consumes. The budget ceiling is a required input, not a default — we will not silently override an operator's cost constraint.

**Frontend.** A new Restocking view in Vue 3, built with the Composition API consistent with the rest of the application. The view will present recommendations in a filterable table (by warehouse, by category, by recommendation urgency), display the budget remaining as the operator adjusts quantities, and support CSV export for use in Meridian's procurement workflow. Design follows the same layout patterns as the existing views for coherence.

**Deliverable.** Restocking view live in the application, backed by a documented API endpoint, with Playwright test coverage for the primary flow. Delivered end of week seven.

---

## D1–D3 — Desired Items

These items will be addressed in Meridian's stated priority order after R1–R4 are delivered, subject to remaining budget.

**D1 — UI Modernization.** We will propose a visual direction — updated typography, a refined color palette, consistent spacing — and validate it with Meridian before implementation. There is no existing brand guide, so we will treat this as a design decision that Meridian approves before we build. The implementation approach uses CSS custom properties (design tokens) so the refresh can be applied globally without touching component logic.

**D2 — Internationalization.** The i18n framework is partially in place. We will extend it to cover the remaining modules and add Japanese locale support for the Tokyo team. Our assumption is that Japanese is the only additional language required for this engagement; if there are other APAC locales in scope, we should align before this phase.

**D3 — Dark Mode.** Implemented as an operator-selectable theme via CSS custom properties. The approach is low-invasiveness: a theme class on the root element switches the token set, with no changes to component logic or layout. This is a good fit for the low-light warehouse floor stations Meridian described.

---

## Assumptions

The following assumptions underpin this proposal. If any of these are incorrect, we should discuss before contract execution.

- **A1** — The `/api/demand` endpoint contains current demand forecast data suitable for use as input to Restocking recommendations. No new forecast model needs to be built.
- **A2** — "Critical flows" for automated testing (R3) include inventory browsing, Reports module, Dashboard summary, and the Restocking flow. Additional flows can be added within scope if Meridian's IT team identifies gaps.
- **A3** — There is no existing Meridian brand guide or design system. We will propose a visual direction for D1 and obtain client approval before implementation.
- **A4** — Budget has not been declared. We are proposing a time-and-materials engagement with a not-to-exceed ceiling. Detailed estimates by phase are provided in the Pricing section.
