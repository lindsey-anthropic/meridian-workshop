# Delivery Timeline
**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

We propose a phased delivery structure. Each phase has a defined scope and a fixed fee, allowing Meridian to approve work incrementally. Required items (R1–R4) are delivered in the first two phases. Desired items (D1–D3) are optional phases that can be contracted independently.

---

## Phase 1 — Stabilize (Weeks 1–2)

**Scope:** R4 Architecture Documentation + R1 Reports Remediation

We begin with architecture review because it gives us a verified baseline before touching any code. The eight Reports defects identified in our pre-bid review are addressed in the same phase — they are contained to a single component and do not require understanding the full system first.

| Week | Work |
|------|------|
| 1 | Codebase walkthrough, architecture document drafted, R1 audit against running environment |
| 2 | Reports remediation (all 8 defects + any additional found in audit), R4 document finalized |

**Deliverables:**
- `architecture.html` — current-state architecture overview for Meridian IT
- Reports module with all defects resolved, filters wired, i18n in place
- Phase 1 review call with Meridian stakeholders

---

## Phase 2 — Build (Weeks 3–5)

**Scope:** R2 Restocking Recommendations + R3 Automated Browser Testing

The Restocking feature is the largest build in the engagement. Browser tests are written after Phase 1 is complete so they cover the remediated Reports page, not the broken one.

| Week | Work |
|------|------|
| 3 | Backend endpoint for restocking recommendations, data model and budget logic |
| 4 | Frontend Restocking view, filter integration, operator budget input |
| 5 | Playwright browser tests — happy path + Reports filter coverage; end-to-end QA |

**Deliverables:**
- Restocking view live in the dashboard
- Playwright test suite covering agreed scope
- Phase 2 review call with Meridian stakeholders

---

## Phase 3 — UI Modernization (Weeks 6–7) *(optional — D1)*

**Dependency:** Meridian brand guidelines (colors, typography, logo assets) must be received by the start of Week 6. If not received, we will proceed with a neutral modernization and schedule a brand-application pass once assets are available.

| Week | Work |
|------|------|
| 6 | Design token system, brand guidelines applied globally |
| 7 | Component-level polish, cross-browser review, stakeholder sign-off |

---

## Phase 4 — Internationalization (Week 8) *(optional — D2)*

Reports i18n is already completed in Phase 1. This phase covers the remaining views.

| Week | Work |
|------|------|
| 8 | Audit remaining views against Japanese locale file, fill gaps, QA with Tokyo team representative |

---

## Phase 5 — Dark Mode (Week 9) *(optional — D3)*

| Week | Work |
|------|------|
| 9 | CSS token system for dark theme, toggle UI, localStorage persistence, QA across all views |

---

## Summary

| Phase | Scope | Duration | Type |
|-------|-------|----------|------|
| 1 | R4 + R1 | 2 weeks | Required |
| 2 | R2 + R3 | 3 weeks | Required |
| 3 | D1 | 2 weeks | Optional |
| 4 | D2 | 1 week | Optional |
| 5 | D3 | 1 week | Optional |

**Required phases total:** 5 weeks
**All phases total:** 9 weeks

---

## Assumptions

- Meridian provides a single point of contact for questions during each phase (expected response time ≤ 1 business day for blockers)
- Brand guidelines for D1 are provided by start of Week 6 if Phase 3 is contracted
- Scope changes within a phase are managed via a change order process; this timeline assumes agreed scope only
- Testing environment (`localhost:3000`) is accessible and stable during Phase 2
