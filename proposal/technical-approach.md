# Technical Approach

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Your Firm Name]
**Date:** May 8, 2026

---

## Overview

Our technical approach follows the sequencing described in the Executive Summary: architecture first, tests second, then remediation and new features built on a verified foundation. Each section below addresses a specific RFP requirement, including our methodology, key decisions, and any assumptions that affect scope or timeline.

The existing stack — Vue 3 + Composition API (Vite, port 3000), Python FastAPI (port 8001), JSON-based mock data layer — is sound. We will not introduce new infrastructure unless jointly agreed with Meridian IT. All work is delivered incrementally with each milestone producing a testable, deployable artifact.

---

## R4 — Architecture Documentation

**Approach.** We treat architecture review as our first deliverable, not our last. In week 1, we explore the full codebase: Vue component hierarchy, API surface (eight known endpoints across inventory, orders, dashboard, demand, backlog, and spending), data flow from filters through `api.js` to FastAPI to Pydantic models, and the in-memory filtering layer in `mock_data.py`.

**Deliverable.** A current-state architecture document — visual diagram plus written narrative — suitable for handoff to Meridian IT. Format: self-contained HTML (no external dependencies, printable). Content: component map, API inventory, data flow, known gaps, and a short list of areas requiring attention before any future vendor takes over.

**Why this first.** The previous vendor's handoff notes are thin. We cannot give Meridian an accurate defect count for R1 or an honest effort estimate for R2 without reading the code ourselves. The architecture review is also the moment we confirm whether any of our working assumptions need revision before remediation begins.

---

## R3 — Automated Browser Testing

**Approach.** We use Playwright for end-to-end browser testing against the running application (localhost:3000). Tests are written in the project repository alongside the source code, runnable in CI. We instrument five critical flows confirmed with Meridian IT at kick-off:

1. Inventory view — load, filter by warehouse and category, verify row counts
2. Warehouse filtering — cross-module filter state consistency
3. Report generation — apply all four filters (Time Period, Warehouse, Category, Order Status), verify output
4. Restocking recommendation — enter budget ceiling, verify recommendation output and totals
5. Cross-module navigation — verify no regressions when switching between views

**Coverage philosophy.** We prioritize flow-level tests over unit tests: we test what users do, not internal implementation details. This gives Meridian IT confidence in deployments without locking the codebase to a specific implementation. Each test is annotated with the RFP requirement it covers.

**Assumption.** The five flows above are our working definition of "critical." We will review and adjust this list with Meridian IT during kick-off before writing a single test.

---

## R1 — Reports Module Remediation

**Approach.** We begin with a structured audit of the Reports module, producing a defect register within the first week. Meridian has logged at least eight issues; our audit may surface additional items. For each defect we document: symptom, root cause, affected component, fix approach, and estimated effort. We share the register with Meridian before beginning remediation — no surprises on scope.

**Known defect categories (from RFP and handoff notes):**

- *Filter behavior:* The previous vendor left filters unwired in the Reports view. We will identify which of the four standard filters (Time Period, Warehouse, Category, Order Status) are not connected to the API call and wire them correctly, consistent with the pattern used in other views.
- *Internationalization gaps:* Some Reports labels or data values are not passing through the i18n layer. We will audit and align with the existing i18n setup.
- *Inconsistent data patterns:* Some views still use the Options API rather than the Composition API established as the project standard. We will migrate any Reports-specific components to match.
- *Console noise:* Any runtime warnings or errors surfaced during audit will be resolved.

**Verification.** Every fix is verified against the Playwright test suite (R3). We do not close a defect until the corresponding test passes.

---

## R2 — Restocking Recommendations

**Approach.** We build a new Restocking view accessible from the main navigation. The view presents purchase order recommendations calculated from three inputs: current stock levels (from the inventory API), demand forecast (from the `/api/demand` endpoint), and a budget ceiling entered by the operator.

**Recommendation logic.** For each SKU, we compare current stock against the demand forecast to identify items at risk of stockout within a configurable horizon (default: 30 days). We rank candidates by urgency (days-of-stock remaining) and allocate the operator's budget ceiling greedily from highest-urgency to lowest, stopping when the budget is exhausted. The view displays the recommended order quantity, estimated cost, and remaining budget per line item.

**UI.** The view follows the existing design language — slate/gray palette, CSS Grid layout, custom SVG charts where appropriate. It includes:
- A budget ceiling input with real-time recalculation
- A filterable/sortable recommendation table (by warehouse, category, urgency)
- A summary panel showing total recommended spend vs. budget and number of at-risk SKUs not covered

**Data layer.** We work within the existing JSON + FastAPI layer. The recommendation logic lives in a new `/api/restocking` endpoint on the backend, keeping the frontend thin. No new database infrastructure is introduced.

**Assumption.** "Demand forecast" is the data available at `/api/demand`. If the dataset turns out to be insufficient for useful recommendations, we will flag this at architecture review and propose a lightweight alternative (e.g., a rolling average from order history) before implementation begins.

---

## D1 — UI Modernization *(Desired)*

If in scope, we modernize the visual design incrementally: tighten spacing and typography, update the component library to current Vue 3 idioms, and refine the color system while preserving the existing slate/gray palette. We do not introduce a new design system or external UI framework unless Meridian provides a brand guide. Deliverable: updated global stylesheet and component library, verified for cross-browser consistency.

---

## D2 — Internationalization *(Desired)*

The existing i18n layer covers some modules. We extend it to all remaining views, with Tokyo warehouse staff as the primary audience. Deliverable: complete i18n key coverage across all views, with Japanese locale as the first non-English target. We will confirm the target locale list with Meridian at kick-off.

---

## D3 — Dark Mode *(Desired)*

We implement an operator-selectable theme toggle (light/dark) using CSS custom properties, stored in browser local storage so the preference persists per workstation. This is particularly relevant for the floor stations R. Tanaka's team mentioned. Deliverable: fully themed dark mode with no hardcoded colors remaining in component stylesheets.

---

## Assumptions and Exclusions

| # | Assumption |
|---|---|
| A1 | No database migration in scope; existing JSON file layer is retained |
| A2 | "Current UI standards" = incremental refinement of existing palette, not a rebrand |
| A3 | "Critical flows" for R3 confirmed with Meridian IT at kick-off; working definition is the five flows above |
| A4 | Reports defect count confirmed via audit in week 1; R1 scope validated before remediation begins |
| A5 | Demand forecast data at `/api/demand` is sufficient for Restocking logic; alternative approached if not |

Any item not listed in §3 of the RFP is out of scope. Changes to scope after kick-off are handled via written change order.

---

*Timeline and pricing follow in the next sections.*
