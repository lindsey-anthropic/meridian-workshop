# Technical Approach

**RFP MC-2026-0417 — Inventory Dashboard Modernization**

This section describes how we will address each item in the Scope of Work (§3), the assumptions behind our plan, and the risks we have identified with their mitigations. Our approach is grounded in a review of the actual codebase, not a generic methodology.

---

## 1. Guiding principle

The dashboard's underlying problem is **inconsistency and the inability to change safely**. Different parts of the application were built to different standards, and with no automated tests, no change can be made with confidence. Our sequencing follows from this:

> **Document → Test → Remediate → Build → Enhance**

We establish a current-state baseline (R4), put a safety net under the system (R3), restore the Reports module to the application's own standard (R1), then build the Restocking capability (R2) on a foundation both teams trust. Desired items (D1–D3) follow as opt-in enhancements.

---

## 2. Requirement traceability

| # | Requirement | Our approach (summary) | Primary deliverable | Acceptance criteria |
|---|---|---|---|---|
| **R4** | Architecture documentation | Code-grounded current-state review produced during onboarding | Architecture overview (interactive HTML diagram + written notes) | Meridian IT confirms the document reflects the running system and is sufficient for handoff |
| **R3** | Automated browser testing | End-to-end coverage of all critical flows, runnable by IT in CI | Playwright test suite + run instructions | All defined critical flows have passing automated coverage; suite runs green on demand |
| **R1** | Reports remediation | Bring Reports to full parity with the rest of the dashboard and resolve all defects | Remediated Reports module | All logged defects closed; Reports uses the shared data layer, shared filters, and localized formatting; no console output in production |
| **R2** | Restocking recommendations | New view recommending purchase orders from stock, demand, and a budget ceiling | Restocking view + supporting API | Operator can enter a budget ceiling and receive a ranked, budget-bounded set of recommended purchase orders that can be actioned |
| **D1** | UI modernization | Apply our design system as a ready-made, accessible baseline | Refreshed UI (opt-in) | Consistent visual system across modernized views; meets modern accessibility baseline |
| **D2** | Internationalization | Extend i18n to remaining modules, prioritizing Tokyo-facing views | i18n coverage (opt-in) | Targeted modules render in supported locales; no hard-coded display strings remain in those modules |
| **D3** | Dark mode | Operator-selectable theme via design-system tokens | Theme toggle (opt-in) | Operator can switch themes; selection persists; legible in low-light stations |

---

## 3. Required scope — detailed approach

### R4 — Architecture documentation (delivered first)

We treat the architecture review as onboarding rather than a closing deliverable, because the existing handoff documentation is limited and the rest of our plan depends on an accurate baseline.

- **What we will produce:** a current-state overview covering the Vue 3 / Vite frontend, the FastAPI backend, the JSON-file data layer, the request/response flow (Vue → `api.js` → FastAPI → in-memory filtering → Pydantic → computed properties), the API surface, and the points where the codebase deviates from its own stated patterns.
- **Format:** an interactive, self-contained HTML diagram plus concise written notes — readable by IT without special tooling, and durable as a handoff artifact.
- **Why first:** it surfaces unknowns (e.g. incomplete Options-API → Composition-API migration) before they affect estimates, and it doubles as the reference the test suite and remediation work are written against.

### R3 — Automated browser testing (foundation, sequenced early)

Testing is the requirement that unblocks every other change, so we establish it before remediating or building. We will use **Playwright** for end-to-end browser coverage, runnable by Meridian IT on demand and suitable for CI.

Per our clarifying-question alignment, coverage is **comprehensive**, including at minimum:

- **Core navigation** — application loads; every primary view is reachable and renders its data.
- **Filtering** — Warehouse / Category / Time Period / Order Status filters apply correctly and update the underlying data across views.
- **Reports** — the remediated Reports page loads and renders quarterly, monthly-trend, and summary figures without error.
- **Restocking (R2)** — the new flow produces recommendations and respects the operator's budget ceiling.
- **Spending & Orders** — data loads correctly and key figures render, with error and empty states covered.

We will deliver the suite with clear run instructions so IT can adopt it as the gate for approving future changes — directly addressing the reason the system is currently frozen.

### R1 — Reports module remediation

Our code review confirmed the Reports module was built to a different standard than the rest of the application. The backend endpoints (`/api/reports/quarterly`, `/api/reports/monthly-trends`) are sound; **the defects are concentrated in the frontend.** We will:

- **Restore filter parity.** Reports currently has no filter bar, while every other view shares Time Period / Warehouse / Category / Order Status filtering. We will wire Reports into the shared filter system so it behaves consistently with the rest of the dashboard (full parity, per our agreed scope).
- **Adopt the shared data layer.** Reports bypasses the central `api.js` client and calls the backend directly with hard-coded URLs. We will route it through the shared client so it follows one consistent data pattern.
- **Remove diagnostic noise.** The module emits console logging on mount and on every render (formatting, chart sizing). We will remove all such output so nothing leaks to production.
- **Fix formatting and internationalization gaps.** Hand-rolled number/currency formatting will be replaced with locale-aware formatting, removing both the correctness risk and the i18n gap.
- **Align to the project standard.** Where the module diverges from the application's Composition-API standard, we will bring it into line so future maintenance is consistent.

The result is a Reports page indistinguishable in quality and behavior from the best parts of the existing dashboard — restoring trust in the figures the team reports upward.

### R2 — Restocking recommendations

This is the capability operations leadership most wants, and the data ingredients already exist in the system:

- **Inventory** provides `quantity_on_hand`, `reorder_point`, and `unit_cost` per SKU.
- **Demand forecasts** provide `current_demand`, `forecasted_demand`, and `trend` per SKU.
- A **purchase-order** model and a `createPurchaseOrder` path already exist (the data store is currently empty), so recommendations can flow into actionable POs.

**Proposed behavior:**

1. The operator enters a **budget ceiling**.
2. For each SKU, the view computes a recommended reorder quantity from the gap between forecasted demand / reorder point and quantity on hand, factoring trend.
3. Candidate purchase orders are **ranked by urgency** (e.g. how far below reorder point, demand trend, days of cover) and costed using `unit_cost`.
4. The view selects the set of recommended POs that **maximizes coverage of the most urgent needs without exceeding the budget ceiling**, and clearly shows what is included, what is deferred, and the remaining budget.
5. The operator can review and create the recommended purchase orders directly.

We will confirm the exact ranking and reorder formula with R. Tanaka's team early in the build so the recommendations match how operations actually prioritizes. The recommendation logic will be covered by the R3 test suite.

---

## 4. Desired scope — approach (opt-in)

- **D1 — UI modernization.** We bring our own design system and tooling at no additional cost: a library of production-ready, accessible, reusable components. This turns the RFP's open-ended "current standards" into a concrete, ready-made baseline and lets the refresh start from a mature foundation rather than a blank page.
- **D2 — Internationalization.** We will extend i18n to the remaining modules, prioritizing the views the Tokyo team depends on, building on the locale-aware formatting introduced during R1.
- **D3 — Dark mode.** Implemented as a theme layer over our design-system tokens, with an operator-selectable, persistent toggle suited to low-light warehouse stations.

These are scoped as opt-in. Where laying groundwork for them during required work costs little (e.g. locale-aware formatting in R1, tokenized styling that eases D1/D3), we will do so at no extra charge.

---

## 5. Assumptions

These follow from the RFP and our clarifying questions. We state them explicitly so scope is unambiguous; we will confirm any that procurement's responses revise.

1. **R1 scope is full parity** — Reports will gain the shared filter bar and match the rest of the dashboard, not merely have visible defects patched.
2. **R3 coverage is comprehensive** — all critical flows above, plus any additional flows identified during the architecture review, will be covered.
3. **Pricing structure** — fixed fee for required scope (R1–R4); time-and-materials with a not-to-exceed ceiling for any desired items (D1–D3) Meridian elects to proceed with.
4. **D1 design standard** — our design system serves as the target standard for UI modernization unless Meridian specifies otherwise.
5. **Environment** — the application remains a Vue 3 / FastAPI stack with a JSON-file data layer; no migration to a database is in required scope (we will note it as a future recommendation in R4 if warranted).
6. **Access** — Meridian provides timely access to R. Tanaka's team for R2 prioritization input and to IT for R3/CI adoption.

---

## 6. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Incomplete Options-API → Composition-API migration means defects are broader than the eight logged | Medium | Medium | R4 architecture review maps inconsistencies up front; R3 tests catch regressions during remediation |
| "Critical flows" for R3 prove broader than assumed | Medium | Low | Comprehensive coverage agreed; architecture review confirms the full flow inventory before tests are written |
| R2 recommendation logic doesn't match how operations prioritizes | Medium | Medium | Early validation session with R. Tanaka's team; ranking/formula confirmed before build completes |
| Thin existing documentation hides undocumented behavior | Medium | Medium | R4 produced first, against the running system; assumptions logged and confirmed with the client |
| Scope creep from desired items pulling focus off required work | Low | Medium | D1–D3 ring-fenced as opt-in T&M with a not-to-exceed ceiling; required work delivered fixed-fee on its own schedule |

This register is itself part of our value: it directly serves Meridian's priority on **timeline confidence**, by naming the unknowns and showing how each is contained before it can affect delivery.
