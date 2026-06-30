# Timeline

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
*Submitted by: adesso SE | Date: April 28, 2026*

---

We propose an **eight-week fixed engagement** with four phased milestones. Each milestone closes with a working deliverable — not a status report. Meridian can review and provide feedback at each gate before the next phase begins.

---

## Phase 1 — Stabilize (Weeks 1–2)

**Deliverable: Remediated Reports module**

- Week 1: Code audit across all four defect areas (filter wiring, i18n gaps, API patterns, console noise). All findings documented and shared with Meridian before any changes are made.
- Week 2: Defects resolved in blast-radius order. Each fix committed separately with a clear description. Reports module passes manual review across all filter combinations.

**Gate:** Meridian operations team confirms Reports module behaves as expected.

---

## Phase 2 — Document (Week 3)

**Deliverable: Architecture overview (R4)**

- Interactive HTML diagram covering all major components (Vue views, `api.js`, FastAPI routes, data layer, filter/reactivity patterns)
- Written narrative for IT handoff
- Internal kickoff for R2 design based on documented architecture

**Gate:** Meridian IT accepts architecture documentation as sufficient for handoff purposes.

---

## Phase 3 — Build (Weeks 4–6)

**Deliverable: Restocking recommendations view (R2)**

- Week 4: Backend endpoint `/api/restocking` — stock + demand data combined, budget constraint logic, ranked output. Confirmed with VP Operations Tanaka that `/api/demand` data is sufficient before build begins.
- Week 5: Frontend `RestockingView.vue` — budget ceiling input, recommendations table, warehouse/category filtering.
- Week 6: Integration, edge case handling, internal review. Meridian operations team access for early feedback.

**Gate:** VP Operations confirms Restocking view meets her team's daily workflow needs.

---

## Phase 4 — Test (Weeks 7–8)

**Deliverable: Playwright end-to-end test suite (R3)**

- Week 7: Test suite covering Inventory, Orders, Spending, and Reports flows. Filter interactions and edge cases from R1 remediation receive dedicated coverage.
- Week 8: Restocking view test coverage added. Full suite passes green. Documentation for IT on how to run the suite and interpret results.

**Gate:** Meridian IT runs the test suite independently and confirms it meets their approval criteria for future changes.

---

## Optional Extensions (D1–D3)

If Meridian activates any of the desired items, they are scoped as follows:

| Item | Estimated Additional Duration |
|---|---|
| D1 — UI Modernization | +2 weeks (component mockup approval + implementation) |
| D2 — Internationalization | +1 week (dependent on i18n coverage found in Phase 1) |
| D3 — Dark Mode | +1 week |

D1–D3 can run in parallel with Phase 4 testing if activated during Phase 3, avoiding sequential delay.

---

## Summary

| Week | Phase | Key Output |
|---|---|---|
| 1–2 | Stabilize | Remediated Reports module |
| 3 | Document | Architecture overview for IT |
| 4–6 | Build | Restocking recommendations view |
| 7–8 | Test | Full Playwright test suite |
| +1–2 | Optional | D1/D2/D3 extensions (if activated) |

Contract start assumed within two weeks of award. All milestone gates include a two-day feedback window before the next phase begins.
