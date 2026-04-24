# Technical Approach

**RFP #MC-2026-0417 — Accenture Response**

---

## Assumptions

The following assumptions have been made in the absence of responses to clarifying questions submitted to procurement:

- **R1:** Meridian does not have a formal defect list — we will conduct a full audit of the Reports module independently.
- **R3:** "Critical flows" are defined as: viewing stock levels, filtering by warehouse and category, and generating a report. We will extend and validate this list with Tanaka in Week 1.
- **D1:** No design system or brand guidelines exist — the UI refresh will be an evolution of the current visual style (more polished, not a redesign from scratch).
- **Budget:** Fixed-fee with not-to-exceed (see Pricing section).
- **Deadline:** Hard delivery date: September 30, 2026.

---

## R1 — Reports Module Remediation

The previous vendor closed their contract with the Reports module in an incomplete state. Our approach:

1. **Audit** — full review of the Reports code, API layer, and data handling. We document every defect (expecting 8–12 based on RFP description).
2. **Prioritization** — together with Tanaka, we categorize defects as: blocking daily operations, affecting data integrity, or cosmetic.
3. **Remediation** — systematic, defect by defect, verified by tests (see R3) after each fix.

Particular attention: filter wiring inconsistencies and i18n gaps (relevant to the Tokyo warehouse team).

---

## R2 — Restocking Recommendations

A new purchase order recommendation module. Logic:

- **Inputs:** current stock levels, demand forecast, safety thresholds, operator-supplied budget ceiling
- **Recommendation logic:** for each SKU below safety threshold, calculate order quantity optimizing coverage within budget (demand-priority greedy)
- **Output:** recommended order list with supplier, quantity, estimated cost, and rationale

The view will be accessible from the main navigation. Operators can accept, reject, or edit individual line items before exporting.

Technology: Vue 3 Composition API (consistent with the rest of the application), new FastAPI endpoint `/api/restocking`.

---

## R3 — Automated Browser Testing

The absence of tests is why IT has blocked changes. We deliver tests first — not as a final add-on.

Approach:
- **End-to-end tests** (Playwright) covering critical flows identified with IT: viewing stock levels, filtering, report generation, Restocking view
- Tests run automatically on every change (CI integration)
- Documentation for IT on how to run and extend the test suite independently

Goal: IT can approve changes based on test results, not intuition.

---

## R4 — Architecture Documentation

The previous vendor left minimal notes. We deliver a complete current-state overview:

- Architecture diagram (frontend / backend / data / API)
- Component map and data flow
- Patterns and conventions documented for onboarding
- Format: HTML (interactive diagram) + PDF for IT archive

Documentation is based on a direct code audit — not the previous vendor's notes, which may be incomplete or stale.

---

## D1 — UI Modernization

Evolution of the current visual style: cleaner typography, more consistent use of status colors, better behavior on smaller screens (warehouse floor workstations). Not a redesign from scratch — we minimize risk and time.

## D2 — Internationalization

Extend the existing i18n structure to modules that currently lack localization. Priority: views used by the Tokyo warehouse team.

## D3 — Dark Mode

A theme toggle in user settings. Relevant for workstations operating in low-light environments.

D1–D3 are delivered in Phase 3. Exact ordering to be agreed with Meridian after Phase 2 completion.
