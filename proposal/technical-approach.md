# Technical Approach
**RFP MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Firm Name]
**Date:** May 8, 2026

---

## Overview

Our approach starts from the existing system — not a rebuild. The codebase left by the previous vendor is structurally sound (Vue 3, FastAPI, well-organized data layer), but carries unfinished work in critical areas. We will complete that work incrementally, delivering each requirement as a verified milestone with a Meridian review checkpoint before proceeding.

Every requirement below is scoped, sequenced, and paired with explicit assumptions so there are no surprises mid-engagement.

A note on performance: across all filter-driven views — Reports and Restocking — we treat responsiveness as a hard constraint, not a nice-to-have. Any filter interaction must return results in under 2 seconds on the existing infrastructure. Where necessary, we will apply result pagination, query-level limits, or server-side pre-aggregation to enforce this ceiling. Operators should never be left waiting.

---

## R1 — Reports Module Remediation

**Approach.** Before writing a single line of code, we will conduct a full audit of the Reports module: `client/src/views/Reports.vue`, the API client (`client/src/api.js`), and the relevant FastAPI endpoints. The audit produces a structured issue list — every defect categorized by type (filter behavior, i18n gap, API inconsistency, performance) and severity (blocking / degraded / cosmetic). Meridian reviews and approves the list before we begin fixes. This gives your team full visibility into what is being addressed and a clear record against the eight-plus issues referenced in the RFP.

**Areas we expect to find defects in:**

- **Filter wiring:** the four filters (Time Period, Warehouse, Category, Order Status) are not consistently connected across the Reports view. We will verify that every filter combination produces a correctly scoped API call and that the UI state stays in sync with the response — no stale data, no silent failures.
- **Filter performance:** any filter change must return a response within 2 seconds. Where the current implementation fetches unbounded datasets and filters client-side, we will move filtering to the FastAPI layer with appropriate query parameters and result limits, so the network payload scales with the filtered result, not the full dataset.
- **Internationalization:** untranslated strings remain in the Reports UI. We will audit against the existing i18n locale files (`client/src/locales/en.js`, `ja.js`) and ensure all strings in the Reports module are covered. Missing translations will be added; hardcoded strings will be moved to the locale system.
- **Options API migration:** parts of the Reports module still use the Vue Options API rather than the Composition API pattern used in the rest of the codebase. We will complete the migration for the Reports view to remove this inconsistency, reduce maintenance risk, and align with the pattern future developers will expect.

**Deliverable:** updated Reports module with all identified defects resolved, plus a remediation report in table format (issue / type / severity / fix applied) for Meridian IT records.

**Assumption:** we treat the source code as the authoritative defect record. Any issues tracked internally by Meridian should be shared at project kickoff so we can incorporate them into the audit list.

---

## R2 — Restocking Recommendations

**Approach.** We will build a new Restocking view within the existing Vue 3 application, consistent with the patterns and visual language of the current dashboard. The view works as follows:

1. The operator selects a Warehouse and Category using the existing filter system, then enters a budget ceiling
2. The backend computes recommended purchase orders by ranking items on two criteria: **restock urgency** (how far current stock sits below the demand forecast for the next period) and **cost efficiency** (estimated restock cost relative to that urgency gap)
3. The system selects the highest-priority items whose combined estimated cost fits within the budget ceiling — no partial orders, no rounding surprises
4. Results are displayed as an ordered list: item, warehouse, current stock, recommended order quantity, unit cost, line total, and cumulative spend toward the ceiling

**Ranking logic in plain terms:** items closest to running out, relative to how much they cost to restock, rise to the top. The budget ceiling is applied as a hard cap — the list stops when adding the next item would exceed it. This is deterministic and explainable to operators.

**Performance constraint:** the `/api/restocking` endpoint must respond in under 2 seconds regardless of filter selection. The recommendation algorithm runs server-side against the in-memory dataset; result sets will be paginated (default: 50 items per page) with client-side controls to load more. Filter changes trigger a debounced re-fetch — no response will be triggered while the operator is still typing or adjusting inputs.

**Deliverable:** fully functional Restocking view accessible from the main navigation, with `/api/restocking` backend endpoint, wired through the Warehouse and Category filters, with pagination and debounced filter behavior.

**Assumption:** recommendation logic uses only data already present in the system (current stock, demand forecasts). Supplier lead times, external pricing feeds, or procurement system integration would be scoped separately.

---

## R3 — Automated Browser Testing

**Approach.** We will establish end-to-end test coverage using Playwright, targeting the two flows Meridian IT identified as critical:

- **Dashboard summary:** verifies the application loads, KPI tiles render with non-empty values, and the Warehouse/Category filters produce a visible change in the displayed data without errors in the console
- **Restocking flow:** enters a budget ceiling, applies a Warehouse filter, verifies recommendations appear within the 2-second performance threshold, and confirms the cumulative spend displayed does not exceed the stated ceiling

We will also add smoke-level tests on the Reports module — covering at least the four filter types — so regressions from future changes are caught automatically.

**Test structure:** tests are organized by view (dashboard, restocking, reports), with shared fixtures for app startup and filter state. Each test is independent — no shared state between runs. Assertions cover both UI output (elements visible, values non-empty) and behavior (filter change produces a different result, not just a re-render).

**Deliverable:** Playwright test suite committed to the repository, with a README covering local execution and CI integration guidance. All tests passing on delivery against the local dev server.

**Assumption:** no CI/CD pipeline currently exists at Meridian. We deliver runnable scripts; pipeline configuration is out of scope but documented as an optional next step.

---

## R4 — Architecture Documentation

**Approach.** In week 2 of the engagement — before the bulk of development begins — we will map the live codebase and produce a current-state architecture overview. The document is structured in four layers:

1. **Frontend views:** inventory of all views in `client/src/views/`, their purpose, and which API endpoints they consume
2. **API client:** how `client/src/api.js` constructs requests, passes filter parameters, and handles responses — including the filter system's four query parameters and how they flow from the Vue composables to the network call
3. **Backend routes:** all FastAPI endpoints in `server/main.py`, their input parameters, filtering logic, and the Pydantic models they return
4. **Data layer:** the JSON files in `server/data/` that back the system, their schema, and how `server/mock_data.py` loads and filters them at runtime

The document also includes a note on the Options/Composition API split — which views have been migrated and which have not — so Meridian IT has an accurate picture of the codebase's consistency at handoff.

Delivered as a standalone HTML file with an embedded component diagram, viewable in any browser without external dependencies. Written for a reader who has never seen the codebase.

**Deliverable:** `architecture.html` delivered at the end of week 2, before development on R1 begins.

**Assumption:** format is standalone HTML. If Meridian IT requires a specific platform (Confluence, Notion, etc.), this should be communicated at kickoff; migration can be accommodated within the same milestone.

---

## Quality Assurance Methodology

Quality is enforced at three levels throughout the engagement, not only at milestone sign-off.

**During development — peer review.** Every code change is reviewed by a second team member before merging. Reviews cover correctness, consistency with existing patterns (Composition API, api.js usage, i18n coverage), and performance (no unbounded fetches introduced). No code reaches the milestone review without passing peer review first.

**During development — local test run.** The QA Engineer runs the Playwright suite against each view as it is modified. Any regression introduced during R1 or R2 work is caught before milestone delivery, not after.

**At milestone delivery — acceptance criteria.** Each milestone has explicit acceptance criteria defined in the Governance document. The Lead Consultant and QA Engineer conduct a structured walkthrough against each criterion before presenting the milestone to Meridian. Meridian receives a delivery that has already been verified internally — the milestone review is confirmation, not discovery.

**Post-delivery — warranty.** A 45-day warranty period covers any defect attributable to delivered work. See the Governance document for full terms.

---

## Compliance Considerations

**UK GDPR (London warehouse).** Meridian's London operations fall under UK GDPR. The data layer handled by this engagement — inventory, orders, demand forecasts, spending — contains product and transactional data, not personal data. The `transactions.json` file contains vendor names (business entities, not individuals). We do not anticipate GDPR implications for the scope of this engagement. Meridian's legal counsel should confirm this assessment prior to contract execution.

**CORS configuration.** The current FastAPI backend is configured with `allow_origins=["*"]` — appropriate for local development, not for any network-exposed deployment. This is flagged as a production readiness item outside the scope of this engagement; Meridian IT should restrict allowed origins before any non-local deployment.

**Data persistence.** All application data is held in JSON files loaded into memory at startup. This is suitable for the current development/internal context but is not appropriate for production-scale or business-critical use. A migration to a persistent data store is outside this engagement's scope and should be planned as a follow-on initiative.

---

## Consolidated Assumptions

| # | Assumption |
|---|---|
| A1 | Engagement is fixed-fee, scope limited to R1–R4, budget ceiling ≤ €80K |
| A2 | UI work uses the existing codebase color palette as baseline; no external brand guidelines apply |
| A3 | E2E test coverage prioritizes Dashboard summary and Restocking flow; Reports smoke tests included |
| A4 | Restocking recommendation logic uses only data already in the system (stock + demand forecasts) |
| A5 | Architecture documentation delivered as standalone HTML; platform migration on request at kickoff |
| A6 | No CI/CD pipeline currently exists; test scripts delivered as runnable files, not pipeline config |
| A7 | Any internal defect backlog Meridian holds for Reports will be shared at project kickoff |
| A8 | All filter interactions across Reports and Restocking must return results within 2 seconds; pagination and server-side filtering will be applied where needed to enforce this |
