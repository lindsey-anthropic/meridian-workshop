# Technical Approach

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

Our work is sequenced to match Meridian's stated priorities — and to respect the real dependency in the system: automated test coverage (R3) is the unlock that lets your IT team approve everything else. We address that first, then move through remediation, new features, and documentation in order.

---

## R1 — Reports Module Remediation

We have reviewed the existing codebase and the previous vendor's handoff notes. The Reports module was acknowledged as incomplete at contract end; filter wiring was partial, internationalization gaps exist, and some views still use older API patterns inconsistent with the rest of the application.

Our approach:
- Conduct an independent audit of the Reports module against Meridian's logged issue list
- Categorize defects by type: filter behavior, i18n coverage, API pattern inconsistencies, and any additional issues discovered during audit
- Resolve all logged defects and any critical issues surfaced by audit
- Write regression tests alongside each fix (see R3) so resolved issues stay resolved

**Assumption:** Meridian's defect log is provided by May 16. Our audit may surface additional issues; we will flag those to Meridian before resolving anything outside the logged list.

**Outcome:** A fully functional Reports module with documented resolution for every logged defect and regression test coverage.

---

## R2 — Restocking Recommendations

This is a new view, not a patch to an existing one. The Restocking feature gives operations staff a recommended purchase order list based on three inputs: current stock levels (already tracked in the system), demand forecast (sourced from the existing `/api/demand` endpoint), and an operator-supplied budget ceiling entered at the time of use.

The view will:
- Display ranked purchase order recommendations per warehouse
- Allow the operator to set a budget ceiling and see recommendations adjust in real time
- Filter by warehouse and category consistent with the rest of the dashboard
- Surface items at risk of stockout first, with supporting demand data visible

**Assumptions:**
- Demand forecast data is sourced from the existing `/api/demand` endpoint
- Budget ceiling is a session-level input — it is not persisted to the backend
- Recommendations are advisory; no procurement workflow or approvals are in scope

**Outcome:** A production-ready Restocking view integrated into the existing dashboard navigation, consistent with current UI patterns.

---

## R3 — Automated Browser Testing

We will establish end-to-end test coverage across all dashboard views using Playwright. Tests will be written alongside R1 remediation — not after — so that defect fixes are verified as they land and regressions are caught before they ship.

Coverage will include:
- Happy-path flows for every major view: Inventory, Orders, Reports, Spending, and the new Restocking view
- Filter behavior across warehouses, categories, time periods, and order statuses
- Known-defect flows from the R1 issue list, to prevent recurrence

The resulting test suite will be CI-ready: runnable with a single command, with clear output your IT team can review before approving changes.

**Outcome:** A documented, maintainable Playwright test suite covering all critical user flows, checked into the repository alongside the application code.

---

## R4 — Architecture Documentation

The previous vendor's handoff notes are thin — they describe the stack but not the design decisions, data flow, or known gaps. That's not enough for a handoff to your IT team.

We will conduct a full architecture review after winning the engagement and produce a self-contained HTML document covering:
- Component map (frontend views, backend routes, data layer)
- Data flow from user interaction through API to storage
- Full API surface with filter parameters and response shapes
- Design patterns in use and where they are inconsistently applied
- Known gaps and risks identified during our audit

Delivered as a self-contained HTML file — no special tooling required for IT to open and share it.

**Outcome:** Architecture documentation that reflects the actual system state, not the previous vendor's notes.

---

## Desired Items — Phase 2

The following items are available as a Phase 2 engagement, contingent on Meridian's direction after Phase 1 delivery.

**D1 — UI Modernization**
Visual refresh aligned to Meridian's brand style guide. Scope will be confirmed once the style guide is received (assumption: by May 16). We will propose a component-level approach — updating design tokens and shared components first so changes propagate consistently across all views.

**D2 — Internationalization**
Extend i18n support to all remaining views, prioritizing workflows used by the Tokyo warehouse team. We will audit current i18n coverage, identify untranslated strings, and implement a consistent translation approach across the application.

**D3 — Dark Mode**
Operator-selectable theme toggle. No backend changes required. Implemented via CSS custom properties so the theme switch is instant and persistent across sessions. Well-suited for low-light warehouse floor environments.

---

## Assumptions

- Meridian's Reports defect log provided by May 16, 2026
- Meridian's brand style guide provided by May 16, 2026 (required for D1 only)
- Demand forecast data sourced from existing `/api/demand` endpoint — no new data pipeline required
- Budget ceiling for Restocking is session-level input, not persisted
- System continues on JSON flat files — no database migration in scope
- No procurement workflow or approval integrations in scope for R2
