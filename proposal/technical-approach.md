# Technical Approach

**RFP #:** MC-2026-0417
**Prepared by:** Accenture
**Date:** April 27, 2026

---

We have reviewed the existing codebase, the vendor handoff notes, and the RFP requirements in full. Our approach is phased: required work (R1–R4) is completed and signed off before desired items (D1–D3) begin. No phase is marked complete without passing tests and Meridian's explicit sign-off.

---

## R4 — Architecture Documentation

We begin with architecture documentation — not as a formality, but because it is our own onboarding. In week one, we will conduct a full read of the codebase and produce a current-state architecture overview: a visual diagram of the system components and a written narrative describing data flow, API surface, and key design decisions. This document will be suitable for handoff to Meridian IT and will explicitly flag areas where the previous vendor's handoff notes were silent or incomplete.

*Deliverable:* Architecture overview (HTML diagram + written narrative), delivered end of week 1.

---

## R1 — Reports Module Remediation

Before touching a single line of code, we will audit the Reports module in full. We will request Meridian's internal issue log on day one. If that log is unavailable, we will derive the defect list from the code directly — the previous vendor's notes reference at least eight issues across filter behavior, internationalization gaps, and API pattern inconsistencies.

Our approach for each defect:
1. Reproduce the issue and document the expected vs. actual behavior
2. Identify root cause in the code
3. Implement the fix
4. Write a regression test to confirm the fix holds

We will not mark R1 complete until all identified defects are resolved and each has a corresponding test. "We think it's fixed" is not a standard we accept.

*Deliverable:* Fully remediated Reports module with per-defect regression tests. Defect log provided to Meridian on completion.

---

## R2 — Restocking Recommendations

The Restocking view is the highest-value new capability in this engagement. It will be built as a new page in the existing Vue 3 frontend, backed by a new FastAPI endpoint.

**Inputs:**
- Current stock levels per SKU and warehouse (existing `/api/inventory` endpoint)
- Demand forecast data (existing `/api/demand` endpoint)
- Operator-supplied budget ceiling (UI input on the Restocking page)

**Output:** A ranked list of recommended purchase orders — SKU, warehouse, recommended quantity, estimated cost — prioritized by urgency relative to demand forecast.

**Algorithm design principle:** The recommendation logic will be transparent and configurable. Operations staff should be able to read a recommendation and understand why it was generated. We will document the logic in plain language alongside the technical implementation.

*Assumption:* Demand forecast data is present in the system (`/api/demand` confirmed in handoff notes). If the data quality is insufficient to support useful recommendations, we will surface that finding before building and agree on a path forward with Meridian.

*Deliverable:* Restocking view with functional recommendations, documented algorithm logic, and full test coverage.

---

## R3 — Automated Browser Testing

Meridian IT has blocked changes to the current system due to the absence of test coverage. R3 is therefore foundational — it is what makes every future change safe to approve.

**Tool:** Playwright, already configured in the project.

**Scope:** All filter interactions across all core views — Time Period, Warehouse, Category, and Order Status filters on every page where they appear.

**Coverage standard:** Every filter combination on core views renders without error and returns a data payload of the expected shape. Tests will also cover the Restocking view delivered under R2.

**Handoff:** Test suite will be documented for Meridian IT, including how to run locally and how to integrate with a CI pipeline. We will not assume IT has prior Playwright experience.

*Deliverable:* Playwright test suite with documented setup instructions. All tests passing on delivery.

---

## D1 — UI Modernization *(desired, conditional)*

Scope and execution of D1 are contingent on receiving Meridian's brand guidelines, which we will request in week one. If guidelines are available, we will align the UI to them — updating color tokens, typography, and spacing — without restructuring the existing layout. This is a polish pass, not a redesign.

D1 begins only after R1–R4 are complete and signed off.

---

## D2 — Internationalization *(desired)*

The Tokyo team currently works in English-only views. We will extend the existing i18n system to remaining modules, with Japanese locale strings as the primary deliverable. Work will be prioritized by the views Tokyo staff use most frequently.

D2 begins only after R1–R4 are complete and signed off.

---

## D3 — Dark Mode *(desired)*

We will implement an operator-selectable theme toggle using CSS custom properties. This approach keeps the change isolated to design tokens and minimizes risk to existing layouts. Dark mode will be prototyped on a feature branch before merging.

D3 begins only after R1–R4 are complete and signed off.

---

## Assumptions

| # | Assumption |
|---|---|
| A1 | Meridian will provide an internal defect log for R1 on day one. If unavailable, we will derive from code audit. |
| A2 | Meridian will provide brand guidelines for D1 in week one. D1 is contingent on receipt. |
| A3 | Demand forecast data quality in `/api/demand` is sufficient for useful restocking recommendations. |
| A4 | Budget range is $50K–$150K. Desired items (D1–D3) are scoped as add-ons beyond the required baseline. |
