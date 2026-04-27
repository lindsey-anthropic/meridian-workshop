# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

## What We're Walking Into

The previous vendor's handoff documentation is minimal — two pages covering stack, run instructions, API endpoints, and a short list of known issues. This is not enough to scope accurately, and we will not pretend otherwise.

Before writing a line of code, we will conduct our own audit of the codebase. The findings from that audit will be shared with Meridian before any remediation begins. Below we have called out, for each requirement, what is missing or unknown from the RFP package and what we are committing to do on our side to close the gap.

**Known gaps inherited from the previous engagement:**

| Gap | Impact | Our commitment |
|---|---|---|
| No formal defect list for Reports | We cannot quote a fixed bug count | We will audit and publish our own defect inventory before starting fixes |
| Incomplete Vue Options API → Composition API migration | Some views may have structural defects, not just surface bugs | We will address pattern inconsistencies where they are the root cause |
| No automated tests delivered | IT cannot safely approve changes; we cannot verify our own fixes cleanly | R3 is scoped to cover all flows we touch — not deferred |
| Thin architecture documentation | Meridian IT has no reliable reference for what's running | R4 is based on our own audit, not the handoff notes |
| No design reference provided | D1 scope is undefined without a reference | We will use Meridian's public website as the design baseline (per clarifying Q&A) |

The stack — Vue 3 / Python FastAPI / JSON flat files — is straightforward and well-suited to the scope. We do not propose a database migration or framework change. Our goal is to stabilize and extend what's there, not replace it.

---

## R1 — Reports Module Remediation

**What's missing:** No defect list was provided with the RFP package. The RFP references "at least eight issues" but the previous vendor left no formal log. Per our clarifying Q&A, issues are traceable in the codebase itself — meaning discovery is on us.

**What we're committing to:**

1. **Audit first, fix second.** We will read the Reports module end-to-end — frontend views, API calls, backend filtering logic — and produce a complete defect inventory before writing a line of fix code. We will share this inventory with Meridian before beginning remediation so there are no surprises about scope.

2. **Root cause, not symptoms.** The previous vendor's handoff confirms the codebase has an incomplete migration from Vue Options API to Composition API. Where defects trace to this structural inconsistency, we will address the pattern — not just patch over it.

3. **Filter completeness.** We will verify that all four filters (Time Period, Warehouse, Category, Order Status) apply correctly across all Reports views, including every valid combination.

4. **Internationalization gaps.** Any hardcoded strings or missing i18n keys in the Reports module will be resolved. This also sets the foundation for D2 (full i18n extension) if Meridian elects to pursue it.

5. **Done means done.** A defect is not closed until it passes a manual verification pass and a passing automated test (once R3 is in place). We will not ship a partial fix.

---

## R4 — Architecture Documentation

**What's missing:** The previous vendor's handoff is two pages. It covers ports and file paths but does not document data flow, API behavior under different filter combinations, or the known technical debt that exists in the codebase. Meridian IT currently has no reliable reference.

**What we're committing to:** We scope this early — before the new build work — because the audit we perform for R1 produces most of the raw material. The deliverable is based on what we observe in the code, not what the previous vendor documented.

**Deliverable:** A self-contained architecture document (HTML format for easy viewing without tooling) covering:

- System components and how they connect (frontend, backend, data layer)
- API surface: endpoints, filters, data shapes
- Data flow from warehouse operations through to dashboard views
- Known technical debt inherited from the previous engagement
- Recommendations for future maintainability

This document is written for Meridian IT, not for developers. We will avoid jargon where plain language works.

---

## R2 — Restocking Recommendations

**What's missing:** The previous vendor never built this feature; the existing data model may not fully support it. We don't yet know whether the current inventory and demand data has sufficient structure for meaningful recommendations — that requires the R1/R4 audit to confirm.

**What we're committing to:** We will assess the existing data during the audit phase and surface any gaps to Meridian before beginning development. If the data needs extension, we will propose the minimum change required — not a data model rewrite. If it's sufficient, we build directly.

This is the primary new capability. The Restocking view will recommend purchase orders based on three inputs: current stock levels (from existing inventory data), demand forecast (from existing forecast data), and an operator-supplied budget ceiling.

**Design principles:**

- **Operations-first.** The view is for R. Tanaka's team, not system administrators. Recommendations should be actionable — show what to order, how much, and why — not just raw numbers.
- **Budget ceiling is a hard constraint.** If the total recommended spend exceeds the operator's budget, the system should prioritize by demand urgency and stock criticality, not arbitrary ordering.
- **Warehouse-scoped.** Recommendations should be filterable by warehouse so London and Tokyo operators see their own picture, not a global rollup.
- **No new data sources.** We will work from the existing inventory and demand data already in the system. If gaps exist in that data, we will surface them to Meridian rather than silently work around them.

**Technical approach:**

The Restocking view will be a new Vue 3 view using the same Composition API patterns as the rest of the codebase. The recommendation logic will live in a new FastAPI endpoint (`GET /api/restocking`) that accepts warehouse, category, and budget parameters and returns a ranked list of recommended orders with supporting rationale (current stock, forecasted demand, estimated cost).

We will use Plan Mode to align on the data model and UI layout before beginning development, and we will share a mockup with Meridian before writing production code.

---

## R3 — Automated Browser Testing

**What's missing:** Zero automated test coverage was delivered by the previous vendor. There is no test infrastructure, no defined scope, and no CI integration. Everything here is greenfield.

**What we're committing to:** The goal is not coverage numbers — it's giving Meridian IT a reliable green signal so they can safely approve future changes. We scope tests to what we touch, write them to be meaningful, and document each one in plain language so IT can evaluate them without reading code.

The goal of R3 is not test coverage for its own sake — it's giving Meridian IT a reliable signal so they can safely approve future changes. That means tests that are meaningful, not tests that are numerous.

**Scope:** End-to-end browser tests covering all flows touched in this engagement:
- Reports module: filter combinations, data display, i18n rendering
- Restocking view: budget input, recommendation display, warehouse filtering

**Tooling:** We will use the Playwright testing framework, which is already configured in this project's toolchain. Tests will run against the local development server and will be structured so they can be integrated into a CI pipeline if Meridian IT chooses to do so in the future.

**Approach:** Tests are written after R1 and R2 are complete, so we are testing stable behavior, not work in progress. Each test maps to a specific user flow, is documented with a plain-language description of what it covers, and fails loudly with a clear message if something breaks.

---

## D1–D3 — Desired Items (Conditional)

If Meridian elects to include the desired items, we propose the following approach:

**D1 — UI Modernization.** We will use Meridian's public-facing website as the design reference and align the dashboard's visual language to match: typography, color palette, spacing conventions. We will not introduce a new component library or design system — the goal is visual coherence, not a rewrite.

**D2 — Internationalization.** The existing codebase has a partial i18n implementation. We will extend it to cover all remaining modules, with Japanese as the first additional locale (serving the Tokyo team). The work is additive — no existing functionality changes.

**D3 — Dark Mode.** An operator-selectable theme toggle. We will prototype this on an isolated branch to avoid any risk to the main codebase during development. Implementation uses CSS custom properties, which the current design token structure already supports.

---

## Assumptions

1. The existing JSON data files are sufficient for R1–R2 scope; no database or ETL work is required.
2. Meridian IT will provide access to a deployment environment for final acceptance testing if required.
3. The Playwright MCP integration already present in the project toolchain will be used for R3; no additional testing infrastructure is needed.
4. D1–D3 are treated as a separate phase and will not delay delivery of R1–R4.
5. Per our clarifying question response, no external integrations (ERP, WMS) are in scope.
