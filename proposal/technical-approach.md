# Technical Approach

**Proposal for:** Meridian Components, Inc. — RFP MC-2026-0417

---

## Approach Overview

Our engagement begins with verification, not assumptions. The previous vendor's handoff documentation is thin — one page of notes for a multi-module application. Rather than building on that foundation, we will conduct an independent audit of the running system before writing a line of new code. What the handoff says and what the application actually does may differ; we scope against reality.

The delivery sequence is intentional: remediate first (R1), establish the test foundation that makes future changes safe (R3), then build the new capability (R2), with architecture documentation produced as a byproduct of the audit we're already doing (R4). UI and i18n work follows if timeline permits.

---

## R1 — Reports Module Remediation

The previous vendor acknowledged the Reports module was unfinished at contract end. Meridian has logged at least eight issues spanning filter behavior, internationalization gaps, and inconsistent data patterns. We treat that list as a floor, not a ceiling — our audit may surface additional issues.

**How we'll approach it:**

We will run the application and systematically exercise every filter combination on the Reports page, logging deviations from expected behavior. We will also review the underlying Vue component and FastAPI endpoint for structural issues — the handoff notes indicate some views were left in the older Options API pattern, which we will normalize to Composition API as part of the remediation work.

Specific areas we expect to address based on the RFP description:
- Filter wiring: some filters may not be connected to the API query or may not trigger UI updates correctly
- i18n gaps: string literals that were never externalized, leaving some labels untranslatable
- API pattern inconsistencies: endpoint usage that deviates from the documented conventions in the rest of the app
- Console noise: errors or warnings logged at runtime that indicate unhandled states

**Deliverable:** All logged defects resolved, plus any additional issues found during audit. A brief written summary of findings accompanies the code changes.

---

## R3 — Automated Browser Testing

We are sequencing R3 before R2 deliberately. Automated tests are not a deliverable we bolt on at the end — they are the mechanism that makes it safe to build R2, and they are the condition under which Meridian IT will approve future changes. We build the safety net before we build the new feature.

**How we'll approach it:**

We will use Playwright for end-to-end browser testing against the running application. Playwright is well-suited to Vue single-page applications and supports the interaction patterns (filtering, navigation, form input) that are central to the Meridian dashboard.

At engagement start, we will align with Meridian IT on which flows they consider critical. Based on the application scope, we anticipate coverage of:
- Inventory view: warehouse and category filtering, stock level display
- Orders view: status and date filtering, order detail
- Reports page: all filter combinations, data output accuracy
- Restocking view: budget input, recommendation generation (written alongside R2)

**Deliverable:** A Playwright test suite covering agreed critical flows, structured to run against a local environment and extensible for CI integration.

---

## R2 — Restocking Recommendations

The Restocking view is the capability Meridian's operations team has been waiting on. It surfaces something the data already supports — the application has stock levels, demand forecasts, and order history — but has never assembled into a recommendation.

**How we'll approach it:**

We will build the Restocking view as a new page within the existing Vue/FastAPI application. No new infrastructure, no new dependencies — the same stack, the same patterns. The view will:

1. Pull current stock levels and demand forecast from the existing API endpoints (`/api/inventory`, `/api/demand`)
2. Accept an operator-supplied budget ceiling as a UI input
3. Compute recommended purchase order quantities by ranking SKUs against restock urgency (stock relative to demand) and allocating within the budget ceiling
4. Present the recommendations in a format the operations team can act on directly

The recommendation logic will live in the FastAPI backend, keeping the Vue component focused on presentation. We will write the Playwright tests for this view as part of the R3 suite.

**Deliverable:** Working Restocking view with API endpoint, covered by automated tests.

---

## R4 — Architecture Documentation

The RFP asks for a current-state architecture overview suitable for handoff to Meridian IT. This is work we would do anyway as part of onboarding — the difference is we will produce a formal output.

**How we'll approach it:**

On engagement start, we will walk the codebase independently of the vendor handoff notes — treating them as a rough guide rather than authoritative documentation. We will map the component structure, data flow from UI to API to data files, the filter system, and any patterns or deviations worth flagging for IT.

We will produce the overview as a self-contained HTML file with an architecture diagram. HTML requires no tooling to open, renders in any browser, and can be printed or shared without dependencies.

**Deliverable:** `architecture.html` — component map, data flow, API surface, and a brief notes section on gaps and inconsistencies found during audit. Suitable for handoff to Meridian IT as a living reference.

---

## Desired Items (D1–D3)

The following items are in scope as time-permitting work within the same engagement.

**D1 — UI Modernization.** We will refresh the visual design within the existing design token system (colors, typography, spacing). Absent a Meridian brand guide, visual direction is at vendor discretion — we will share a reference direction for approval before applying it broadly.

**D2 — Internationalization.** We will extend i18n support to the remaining modules, targeting Japanese as the locale for Tokyo warehouse staff (pending confirmation from procurement that Japanese is the correct target). The existing codebase has partial i18n infrastructure; we will extend it rather than replace it.

**D3 — Dark mode.** We will implement an operator-selectable theme using CSS custom properties, surfaced as a toggle in the application UI. Dark mode is a good candidate for branch-isolated development — we will prototype it without touching the main codebase until it's ready to integrate.

---

## Assumptions

The following assumptions underpin this approach. We have submitted clarifying questions to procurement (due April 28); responses will be incorporated before final proposal submission.

| # | Assumption |
|---|---|
| A1 | Budget is approximately $75,000 fixed fee. No range was published in the RFP; we have asked. |
| A2 | Japanese is the target locale for D2. We have asked procurement to confirm. |
| A3 | UI direction for D1 is at vendor discretion absent a Meridian brand guide. |
| A4 | "Critical flows" for R3 will be defined jointly with Meridian IT at engagement start. |
| A5 | Source code and a running environment are sufficient to independently audit R1 defects; no separate bug tracker access is required. |
