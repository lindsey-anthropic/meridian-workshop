# Technical Approach
**RFP MC-2026-0417 — Meridian Components**

---

## Assumptions

Before detailing our approach, we note the following assumptions, derived from our pre-engagement review and submitted as clarifying questions to procurement (deadline April 28):

| ID | Assumption |
|---|---|
| A1 | Pricing model: T&M with not-to-exceed. Team of 2 senior consultants, 6 weeks. D1–D3 optional add-ons. |
| A2 | R3 critical flows: inventory filtering, orders filtering, reports with filters, restocking workflow, dashboard summary. |
| A3 | D1 UI modernization: conservative visual refresh (spacing, typography, color consistency). No structural redesign. |
| A4 | D2 i18n: English + Japanese. vue-i18n built from scratch. All EN strings extracted from current views. |
| A5 | Deployment: out of scope. Handoff documentation for Meridian IT included. |

---

## R1 — Reports Module Remediation

**Finding from pre-engagement audit:**
The `/api/reports/quarterly` and `/api/reports/monthly-trends` endpoints do not support the warehouse, category, and status filters that every other endpoint in the system accepts. This is the root cause of most filter-related defects. Additionally, several views still use Vue Options API mixed with Composition API — creating a regression surface on every edit.

**Our approach:**
1. Enumerate all defects before writing code (audit-first). Share the full defect list with Meridian IT for prioritization.
2. Fix in order of operational impact. Filter wiring first, then i18n gaps, then console noise, then API pattern inconsistencies.
3. Complete Composition API migration as part of remediation — not as a separate task.
4. Each fix ships with a corresponding Playwright test (R1 and R3 are linked by design).
5. Close R1 with a written acceptance checklist reviewed by Meridian IT.

**Risk:** The previous vendor's handoff noted "at least" 8 issues — the actual count may be higher after full audit. We have budgeted a 20% contingency on R1 hours for this reason.

---

## R2 — Restocking Recommendations View

**Design:**

| Layer | Detail |
|---|---|
| Input | Budget ceiling (operator-supplied), optional warehouse and category filters |
| Data sources | `/api/inventory` (stock levels, reorder points) + `/api/demand` (forecasts and trends) |
| Logic | Priority score per SKU: items below reorder point, weighted by demand trend and days-to-stockout. PO quantity calculated to cover forecasted demand. Items ranked until budget ceiling is reached. |
| Output | Ranked PO recommendation list with item, quantity, unit cost, total cost, and one-click create action. Running budget tracker (used / remaining). |
| Backend | New endpoint `GET /api/restocking?budget=&warehouse=&category=` returning ranked recommendations. |
| Frontend | New Vue 3 view using Composition API. Consistent with existing filter and card patterns. |

**Key constraint:** No database — all data is JSON in-memory. Restocking logic runs server-side in Python; no persistence required for recommendations (they are recalculated on each request).

---

## R3 — Automated Browser Testing

**Framework:** Playwright. Already configured in the project's MCP setup. Readable and maintainable by Meridian IT post-handoff.

**Coverage — 5 critical flows:**

| Flow | What is tested |
|---|---|
| Inventory view | Page loads, warehouse filter, category filter, combined filter |
| Orders view | Status filter, month filter, combined filter |
| Reports view | Quarterly data loads, monthly trends load, filters apply correctly |
| Restocking view | Budget input, recommendations generated, budget tracker updates |
| Dashboard summary | KPI values present, combined filters update KPIs correctly |

**Delivery:** Phase 1, before R1 fixes begin. This is intentional — tests establish a baseline that catches regressions introduced during R1 remediation.

---

## R4 — Architecture Documentation

**Deliverable:** Single self-contained `architecture.html` file. Interactive, browser-viewable, suitable for handoff to Meridian IT.

**Contents:**
- Current-state architecture diagram (Vue → api.js → FastAPI → JSON data)
- API endpoint catalogue with filter parameter matrix
- Component map per view (which Vue components render which data)
- Data flow for each major user action
- Technical debt log (Options API remnants, missing filters, test gaps)
- Recommended remediation sequence (feeds directly into R1 plan)

**Delivery:** End of Phase 1 onboarding week — used by our team to scope R1 accurately, not produced as a closing formality.

---

## Desired Items (D1–D3)

These are priced as optional add-ons and can be added to any phase.

**D1 — UI modernization:** Conservative visual refresh — improved spacing, typographic hierarchy, and color consistency. No structural redesign. Existing slate/gray palette maintained as base. Estimated: 3 days.

**D2 — Internationalization:** English + Japanese using vue-i18n. All EN strings extracted and externalized. JA translations provided by Meridian or translated by us (cost TBD). Architecture designed for additional languages. Estimated: 4 days (excluding translation content).

**D3 — Dark mode:** Operator-selectable theme using CSS custom properties. Preference persisted in localStorage. Ideal for warehouse floor stations in low-light environments. Estimated: 2 days (after D1, shares CSS variable infrastructure).
