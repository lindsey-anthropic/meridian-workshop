# Proposed Timeline

**RFP #MC-2026-0417 — Meridian Components**

Assumed start: two weeks after contract award (onboarding, access provisioning).
No hard delivery deadline specified by Meridian; timeline below targets a quality-first delivery.

---

## Phase 1 — Foundation (Weeks 1–2)

**Goal:** Understand what we have, establish safety net, unblock IT.

| Week | Work |
|---|---|
| 1 | Discovery: codebase audit, defect inventory for Reports, architecture mapping |
| 2 | R3: Playwright test harness setup; baseline tests for working views; share defect list with Meridian IT |

**Milestone:** IT approves test framework; defect list signed off by Meridian.

---

## Phase 2 — Remediation (Weeks 3–4)

**Goal:** Reports module is production-ready.

| Week | Work |
|---|---|
| 3 | R1: Fix all identified Reports defects (filter wiring, i18n gaps, data inconsistencies) |
| 4 | R1 verification tests added to suite; R4 architecture document drafted and shared |

**Milestone:** Reports remediation complete and covered by automated tests. Architecture doc delivered to IT.

---

## Phase 3 — New Feature (Weeks 5–7)

**Goal:** Restocking view live and tested.

| Week | Work |
|---|---|
| 5 | R2: Align recommendation logic with R. Tanaka's team; build backend endpoint |
| 6 | R2: Frontend view, budget ceiling input, filter integration |
| 7 | R2: End-to-end tests; review session with ops team; revisions |

**Milestone:** Restocking view accepted by operations team.

---

## Phase 4 — Desired Items & Closeout (Weeks 8–10)

**Goal:** Deliver prioritized desired items; hand off cleanly.

| Week | Work |
|---|---|
| 8 | D2: i18n expansion to remaining views (Tokyo team priority) |
| 9 | D3: Dark mode implementation; D1 UI refresh (scope confirmed with Meridian) |
| 10 | Final QA pass; R4 architecture doc finalized; handoff session with IT |

**Milestone:** Full delivery. Meridian IT holds passing test suite, architecture documentation, and all source code.

---

## Summary

| Phase | Weeks | Key deliverable |
|---|---|---|
| Foundation | 1–2 | Test harness, defect inventory |
| Remediation | 3–4 | Fixed Reports module, architecture doc |
| New feature | 5–7 | Restocking view |
| Closeout | 8–10 | i18n, dark mode, handoff |

**Total:** 10 weeks from start.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Discovery reveals more defects than anticipated | Medium | Week 1 is scoped for this; additional defects added to list before remediation begins, not discovered mid-fix |
| Restocking logic requires business rule clarification | Medium | Logic review scheduled in Week 5 before build starts — not a blocker to Phase 1–2 |
| IT approval of test framework delayed | Low | Test harness is self-contained; we document it clearly; IT can review async |
