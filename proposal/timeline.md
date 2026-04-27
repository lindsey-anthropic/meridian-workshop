# Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

We are proposing an eight-week engagement from contract execution. Required items R1–R4 are delivered by end of week seven, with week eight reserved for hardening, final handoff, and desired items where budget permits.

All dates below assume contract execution by May 19, 2026 (two weeks after the RFP response deadline of May 8).

---

## Phase 1 — Orientation & Architecture (Weeks 1–2)

**Goal:** Understand the system, document it, and identify any surprises before touching production code.

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Codebase review, API mapping, gap analysis vs. vendor handoff notes | Internal findings document |
| 2 | Architecture diagram, IT handoff document | `architecture.html` — **R4 complete** |

No changes to the application in this phase. The architecture document is the first deliverable Meridian IT receives.

---

## Phase 2 — Reports Remediation (Weeks 2–3)

**Goal:** Close all known defects in the Reports module.

| Week | Activity | Deliverable |
|------|----------|-------------|
| 2–3 | Systematic audit of Reports module (filters, i18n, API patterns), fix and commit each defect | Defect log with resolution notes |
| 3 | Verification across SF / London / Tokyo warehouse contexts | **R1 complete** |

Overlaps with Phase 1 in week two — the architecture review informs the audit approach.

---

## Phase 3 — Automated Test Coverage (Weeks 3–4)

**Goal:** Establish Playwright test suite covering critical flows, unblocking IT approval of future changes.

| Week | Activity | Deliverable |
|------|----------|-------------|
| 3–4 | Write and validate tests: inventory browsing, Reports filters, Dashboard summary | Playwright suite, executable and documented |
| 4 | IT handoff of test suite with run instructions | **R3 partial complete** (Restocking tests added post-R2) |

---

## Phase 4 — Restocking Recommendations (Weeks 4–7)

**Goal:** Design, build, and test the new Restocking view end to end.

| Week | Activity | Deliverable |
|------|----------|-------------|
| 4–5 | Backend: recommendation logic, new FastAPI endpoint, unit validation | `/api/restocking` endpoint |
| 5–6 | Frontend: Restocking view (Vue 3), filter table, budget input, CSV export | View live in application |
| 6–7 | Integration, edge cases, Playwright test coverage for Restocking flow | **R2 + R3 complete** |

---

## Phase 5 — Hardening & Desired Items (Week 8)

**Goal:** Final QA, delivery documentation, and desired items (D1–D3) where budget allows.

| Week | Activity | Deliverable |
|------|----------|-------------|
| 8 | End-to-end QA, performance check, final documentation | Delivery package |
| 8 | D2 (i18n / Japanese), D3 (dark mode) — if budget permits | D2/D3 as available |
| 8 | D1 (UI refresh) — if remaining budget permits, scoped separately | D1 proposal or partial delivery |

D1 (UI modernization) is scoped separately from D2/D3 because it carries higher design risk and requires a Meridian approval step before implementation. If budget is tight, we recommend prioritizing D2 (Tokyo team impact) and D3 (low implementation cost) over D1.

---

## Summary

| Milestone | Target Date |
|-----------|-------------|
| Contract execution | May 19, 2026 |
| R4 — Architecture documentation | June 2, 2026 |
| R1 — Reports remediation | June 9, 2026 |
| R3 — Automated tests (core flows) | June 16, 2026 |
| R2 — Restocking view + R3 complete | July 7, 2026 |
| Final delivery | July 14, 2026 |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Reports defect count exceeds eight | Medium | Audit scope in week 1; escalate to Meridian if additional defects materially change effort |
| Demand data quality insufficient for R2 | Low | Validated in Phase 1; if data is unusable, we flag before Phase 4 begins |
| D1 design approval adds latency | Medium | D1 scoped as optional; does not block R1–R4 or other desired items |
