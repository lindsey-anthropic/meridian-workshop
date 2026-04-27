# Timeline

**RFP MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

We propose an 8-week engagement for the four required deliverables (R1–R4), structured in three phases. Optional enhancements (D1–D3) can be appended as a fourth phase without affecting the core delivery schedule.

Assumed start date: two weeks after contract execution.

---

## Phase 1 — Understand (Weeks 1–2)

Before writing any code, we establish a shared understanding of the system.

| Week | Activity |
|------|----------|
| 1 | Codebase walkthrough and architecture assessment |
| 1 | Draft and share architecture overview (R4 — first deliverable) |
| 2 | Reports module audit — reproduce all defects, document findings |
| 2 | Share defect baseline with Meridian for review and sign-off |
| 2 | Data layer assessment — inventory JSON structure and capacity for restocking feature |

**Milestone:** Architecture document delivered and defect list agreed with Meridian by end of Week 2.

---

## Phase 2 — Stabilise (Weeks 3–5)

Fix what's broken before building what's new.

| Week | Activity |
|------|----------|
| 3 | Reports defect remediation — filter wiring, API pattern fixes |
| 4 | Reports defect remediation — i18n gaps, data inconsistencies, console noise |
| 4 | Restocking view design — layout proposal shared with operations team |
| 5 | Reports verification — all fixes confirmed in-browser |

**Milestone:** Reports module fully remediated and verified (R1 complete) by end of Week 5.

---

## Phase 3 — Build & Test (Weeks 6–8)

Deliver the new capability and establish test coverage across everything.

| Week | Activity |
|------|----------|
| 6 | Restocking backend — new API endpoints, restocking logic |
| 6 | Restocking frontend — view implementation |
| 7 | Restocking integration — connect frontend to backend, end-to-end testing |
| 7 | Playwright test suite — Reports module coverage |
| 8 | Playwright test suite — Restocking view coverage |
| 8 | Handoff package — updated architecture docs, test run instructions, deployment notes |

**Milestone:** All R1–R4 deliverables complete and handed off by end of Week 8.

---

## Phase 4 — Optional Enhancements (Weeks 9–12)

If Meridian elects to include any D-items, they are delivered in a separate phase that does not touch the core delivery timeline.

| Weeks | Activity |
|-------|----------|
| 9–10 | D1 — UI modernization (mockup review in Week 9, implementation in Week 10) |
| 10–11 | D2 — Internationalization audit and extension |
| 11–12 | D3 — Dark mode implementation |
| 12 | D4 — Database migration (scripted, repeatable, no data loss) |

Each item can be selected individually — Meridian does not need to take all four.

---

## Key assumptions

- Contract executed and codebase access confirmed before start date
- Meridian's operations team available for one review touchpoint per phase (approximately 30 minutes)
- Japanese translations for D2 provided by Meridian or a translation service of their choosing — we will flag strings requiring client input
- No significant undiscovered infrastructure constraints (e.g., deployment environment restrictions) that would affect scope

---

## Summary

| Phase | Weeks | Key deliverable |
|-------|-------|-----------------|
| 1 — Understand | 1–2 | Architecture docs (R4), defect baseline |
| 2 — Stabilise | 3–5 | Reports remediation (R1) |
| 3 — Build & Test | 6–8 | Restocking view (R2), browser tests (R3) |
| 4 — Optional | 9–12 | D1, D2, D3, D4 (as elected) |
