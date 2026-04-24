# Technical Approach

**RFP MC-2026-0417 — Inventory Dashboard Modernization**

---

Our sequencing is deliberate: automated testing comes first, not last. Without test coverage, every change to the existing system carries risk — and Meridian IT has already acted on that risk by blocking modifications. We will establish a Playwright test suite against the live application before we touch a line of production code. That decision unblocks your IT team early and gives us a safety net for everything that follows.

---

## R1 — Reports Module Remediation

We will conduct a full independent audit of the Reports module rather than work from a client-provided bug list. Our approach:

1. Review the Reports view and all connected API endpoints against the documented filter system (Time Period, Warehouse, Category, Order Status).
2. Catalogue every defect found — filter wiring gaps, internationalization omissions, API pattern inconsistencies, browser console errors.
3. Share the findings with Ms. Tanaka's team before beginning fixes. We will not start remediation until the operations team has confirmed our list is complete from their perspective.
4. Resolve defects in order of operational impact, with the highest-friction issues first.

**Assumption:** No client-provided bug list exists. We scope R1 as full discovery plus remediation, and budget accordingly.

---

## R2 — Restocking Recommendations

We will deliver a new Restocking view within the existing dashboard. The view will recommend purchase orders using data already present in the system:

- **Inputs:** Current stock levels (existing `/api/inventory` endpoint), demand forecast (existing `/api/demand` endpoint), and an operator-supplied budget ceiling entered via a UI field at the top of the view.
- **Output:** A ranked list of recommended purchase orders — item name, warehouse, suggested reorder quantity, and estimated cost — filtered to stay within the stated budget.
- **Logic:** Items are flagged when stock falls below a reorder threshold relative to demand. Recommendations are ranked by urgency (demand-to-stock ratio) and trimmed to the budget ceiling. No machine learning — the logic is transparent and auditable by your operations team.

**Assumption:** The budget ceiling is entered per session and is not persisted. If Meridian later wants per-warehouse budget settings stored server-side, that is a scope addition.

---

## R3 — Automated Browser Testing

We will use Playwright to establish end-to-end test coverage. Playwright is already configured in this project's tooling, which reduces setup overhead.

Test coverage will include:

- Inventory browsing: filter by warehouse, category; verify data updates correctly
- Orders view: filter by status and month; verify results match expectations
- Reports module: all four filters individually and in combination; verify no console errors
- Restocking view: budget ceiling input, recommendation list generation

Tests will run against the local development environment and be structured so they can be adapted to a CI pipeline if Meridian IT wants to integrate them into a deployment gate.

**Assumption:** Meridian IT approves Playwright as the testing framework. If a different tool is required, we will need to revisit scope.

---

## R4 — Architecture Documentation

We will produce a current-state architecture overview as a self-contained HTML file — viewable in any browser, no tooling required, suitable for handoff to Meridian IT.

The document will cover:

- Frontend structure: Vue 3 component hierarchy, routing, state management, API client
- Backend API: all endpoints, filter parameters, data flow from request to response
- Data layer: JSON file structure, mock data patterns, how filtering is applied server-side
- Key patterns: how the four-filter system propagates from the UI through to the API

We will treat the previous vendor's handoff notes as a starting point and verify everything against the actual codebase. Where the documentation is incomplete or incorrect, we will note the discrepancy.

---

## D1–D3 — Desired Items

These will be scoped and delivered as a separate phase, after all required items are complete.

**D1 — UI Modernization:** We will refresh the visual design within the existing component structure — updating typography, spacing, color usage, and interactive states. We will not propose a framework change. Before any implementation, we will share a direction (reference designs or a style tile) for your team's approval.

**D2 — Internationalization:** We will extend the existing i18n setup to the modules currently English-only. The primary beneficiary is the Tokyo warehouse team; we will prioritize the views they use most frequently.

**D3 — Dark Mode:** We will implement an operator-selectable dark theme using CSS custom properties. The feature will be prototyped on a separate branch and reviewed with your team before merging to the main codebase.

---

## Assumptions Summary

| # | Assumption |
|---|---|
| A1 | R1 scoped as full audit + remediation; no client bug list provided |
| A2 | Restocking budget ceiling is per-session, not persisted |
| A3 | Playwright is an acceptable testing framework for Meridian IT |
| A4 | D1–D3 delivered as a separate phase after R1–R4 are complete |
| A5 | Architecture review performed independently; previous handoff notes treated as unverified |

Any assumption that turns out to be incorrect will be raised immediately, with a proposed resolution, before it affects timeline or cost.
