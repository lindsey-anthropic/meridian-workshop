# Technical Approach

**Proposal in response to RFP #MC-2026-0417**

---

Our approach to this engagement is audit-first. Before committing to fixed deliverable counts on any remediation work, we conduct a structured review of the existing codebase. This protects Meridian from underscoped proposals and protects us from committing to numbers that don't reflect reality. We will follow Meridian's stated priority order — R1 through R4 — with automated tests introduced early enough that Meridian IT can review and approve changes incrementally rather than waiting for a single final delivery.

---

## R1 — Reports Module Remediation

The RFP notes at least eight defects in the Reports module. The previous vendor's handoff documentation references three. That gap is itself a finding, and it shapes how we approach R1.

We will begin with a full audit of the Reports page — tracing each filter through the frontend, the API client, and the backend — and produce a complete defect catalogue before writing a line of remediation code. Defects will be triaged by severity (broken functionality, data inconsistency, missing internationalisation, code pattern debt) and resolved in that order.

The handoff notes indicate that not all filters were wired up at the time of contract end, and that parts of the codebase were left on an older Vue Options API pattern rather than the Composition API used elsewhere. Both of these will be addressed as part of R1. The deliverable is a Reports module where all filters behave correctly, data patterns are consistent with the rest of the application, and no console errors are present in normal operation.

---

## R2 — Restocking Recommendations

The Restocking view is new functionality, not a patch on existing work. It will be built as a first-class view within the existing application — a new backend endpoint and a new Vue page following the same data flow patterns used throughout the rest of the system.

The view will take three inputs: current stock levels (already available via the inventory API), demand forecast data (available via the existing demand endpoint), and an operator-supplied budget ceiling entered at runtime. From these it will generate a prioritised list of recommended purchase orders — which items to restock, in what quantity, and at what estimated cost — constrained to the supplied budget.

We expect to surface questions during this build about how Meridian's operations team actually wants to use the feature: how demand forecasts are weighted, whether budget applies per warehouse or globally, what the expected output format is. We will raise these early rather than building to assumptions.

---

## R3 — Automated Browser Testing

We will use Playwright for end-to-end test coverage. It is well-suited to Vue applications, integrates cleanly with standard CI pipelines, and produces readable test output that non-engineering stakeholders can follow.

Scope, per Meridian's clarification: all major user flows across inventory, orders, reports, and restocking. We will establish the test harness at the start of the engagement — not at the end — so that tests can be run against each piece of work as it is delivered. This allows Meridian IT to approve changes incrementally rather than as a single batch. The final deliverable will include the test suite and documentation for running it locally and in a CI environment.

---

## R4 — Architecture Documentation

The previous vendor's handoff notes are thin. We will produce a current-state architecture overview that reflects the actual codebase, not the documentation that was intended to describe it.

This review will cover: the component structure of the Vue frontend, the API surface and data flow between frontend and backend, the backend's data layer (currently flat JSON files), and the overall request lifecycle from user interaction to rendered output. The format will be a combination of written narrative and a visual diagram — clear enough for Meridian IT to use as a reference when evaluating future changes, without assuming deep familiarity with the stack.

This review also directly informs our R1 work. Understanding how data flows through the system is a prerequisite for reliably auditing the Reports module defects.

---

## D1 — UI Modernisation

We have noted that Meridian has brand guidelines that will be shared following vendor selection. We will scope and price D1 once those assets are received, as the appropriate level of effort depends on how far the current visual design diverges from the brand guide.

Our approach will be to apply brand changes at the component and design token layer — colours, typography, spacing — rather than redesigning layout or navigation. Structural changes to the interface would go beyond what the RFP describes and would require separate scoping.

---

## D2 — Internationalization

The Tokyo warehouse team is currently working in English-only views despite the application having a partial i18n framework in place. We will extend localisation coverage to all remaining views, prioritising those used most frequently by the Tokyo team.

We will build on whatever i18n scaffolding the existing codebase contains rather than introducing a new framework. String translations for Japanese will need to be supplied or reviewed by Meridian; we will identify all strings requiring translation and provide a structured file for Meridian to populate or verify.

---

## D3 — Dark Mode

We will implement dark mode as an operator-selectable theme toggle, stored in user preferences so the choice persists across sessions. The implementation will use CSS custom properties, which allows the light and dark themes to coexist cleanly without duplicating component logic.

The low-light warehouse floor context noted in the RFP will inform the design: contrast ratios and readability under low ambient light will be treated as constraints, not afterthoughts.

---

## Assumptions

The following assumptions underpin this technical approach. We will confirm these at engagement kickoff.

- Brand guidelines for D1 will be provided by Meridian following vendor selection.
- The application's JSON flat-file data layer is not changing in this engagement. No database migration is in scope.
- Deployment infrastructure and hosting are out of scope. We are delivering software, not managing the environment it runs in.
- Pricing is based on a budget range of approximately $40–60K fixed-fee. The pricing section details the breakdown.
