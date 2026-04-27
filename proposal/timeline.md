# Timeline
**RFP MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Firm Name]
**Date:** May 8, 2026

---

## Delivery Approach

We sequence deliverables to give Meridian value from the first two weeks and to respect internal dependencies: architecture documentation before development, Reports remediation before testing, testing infrastructure in place before the Restocking build is complete.

Each milestone ends with a structured review session with the Meridian team (R. Tanaka and IT representative). We do not proceed to the next phase without sign-off. If a review surfaces additional scope, we assess and communicate impact before continuing.

---

## Phased Plan

### Phase 1 — Onboarding & Architecture (Weeks 1–2)

| Week | Activity | Deliverable |
|------|----------|-------------|
| 1 | Project kickoff, environment setup, full codebase walkthrough, Reports audit | Audit issue list (shared with Meridian for review) |
| 2 | Architecture documentation | `architecture.html` — R4 complete |

**Milestone review:** Meridian IT reviews architecture document and approves the Reports defect list before Phase 2 begins.

---

### Phase 2 — Reports Remediation (Weeks 3–4)

| Week | Activity | Deliverable |
|------|----------|-------------|
| 3 | Fix filter wiring, server-side filtering, performance validation | Filters functional, response times within 2s |
| 4 | i18n gaps, Options→Composition API migration, final QA | R1 complete — remediation report delivered |

**Milestone review:** Meridian operations team (R. Tanaka) validates the fixed Reports module against the approved issue list.

---

### Phase 3 — Test Foundation (Weeks 5–6)

| Week | Activity | Deliverable |
|------|----------|-------------|
| 5 | Playwright setup, Dashboard summary tests, Reports smoke tests | Initial test suite running locally |
| 6 | Test hardening, documentation, CI integration guide | R3 partial — Dashboard + Reports coverage complete |

Note: Restocking tests are added at the end of Phase 4 once the view exists. R3 is considered fully delivered at the end of week 10.

---

### Phase 4 — Restocking View (Weeks 7–10)

| Week | Activity | Deliverable |
|------|----------|-------------|
| 7 | Backend `/api/restocking` endpoint, ranking logic, unit validation | API endpoint live |
| 8 | Frontend Restocking view — layout, filter integration, budget input | View navigable, data rendering |
| 9 | Pagination, debounce, performance validation (2s ceiling), edge cases | Performance-compliant view |
| 10 | Restocking E2E tests, full regression run, final review & handoff | R2 + R3 fully complete |

**Milestone review:** full demonstration with R. Tanaka and IT. All tests passing. Handoff package delivered.

---

## Summary

| Milestone | Requirement | Week |
|-----------|-------------|------|
| Architecture document | R4 | 2 |
| Reports remediation | R1 | 4 |
| Test suite (Dashboard + Reports) | R3 partial | 6 |
| Restocking view + full test suite | R2 + R3 final | 10 |

**Total engagement duration: 10 weeks.**
Start date contingent on contract execution; we can be available within one week of award.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Reports defect list larger than expected at audit | Medium | Severity triage in week 1; blocking issues fixed in Phase 2, cosmetic issues documented for future sprint |
| Restocking data model insufficient for ranking logic | Low | Architecture review in week 2 validates data availability before Phase 4 starts |
| Meridian review delays between phases | Medium | 3-business-day review window built into schedule; delays shift subsequent phases by equivalent time |
