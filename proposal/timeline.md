# Phased Delivery Timeline & Resource Plan

**RFP #MC-2026-0417 — Meridian Components, Inc.**

---

## Team Composition

| Role | Responsibility | Allocation |
|---|---|---|
| **Lead Consultant / Tech Lead** | Architecture, backend API, test strategy, stakeholder communication | 100% (full engagement) |
| **Frontend Engineer** | Vue component work, Reports remediation, Restocking UI, i18n | 100% Phases 1–3, 50% Phase 4 |
| **QA / Automation Engineer** | Playwright test suite authoring, CI setup, defect register | 100% Phase 1, 50% Phases 2–3 |
| **Technical Writer** | Architecture documentation (R4), runbook | 50% Phase 1 |

---

## Phase Overview

| Phase | Weeks | Duration | Notes |
|---|---|---|---|
| Phase 1 — Foundation | 1–2 | 2 weeks | R3 skeleton, R4 architecture docs |
| Phase 2 — Reports Remediation | 3–4 | 2 weeks | R1 |
| Phase 3 — Restocking Feature | 5–8 | 4 weeks | R2 |
| Phase 4 — Modernization (optional) | 9–12 | 4 weeks | D1, D2, D3 |

---

## Phase 1 — Foundation (Weeks 1–2)

**Deliverables:** R3 (Automated Tests — skeleton), R4 (Architecture Documentation)

**Goal:** Establish the safety net before touching a single line of production code. Give IT their confidence layer. Give Meridian a clear picture of what they actually have.

### Week 1

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Kickoff call with Meridian (Okafor + Tanaka + IT rep) | Lead | Confirmed scope assumptions, approved questions list, Tanaka confirms Restocking algorithm priorities |
| Mon–Tue | Full codebase audit — map every component, endpoint, data flow | Lead + Frontend | Internal architecture notes |
| Wed | Draft architecture document (R4) — diagram, component map, API reference | Lead + Writer | `proposal/architecture.html` v0.1 |
| Wed–Thu | Set up Playwright test environment, write first 5 smoke tests (dashboard, inventory, orders) | QA | `tests/` with passing smoke suite |
| Fri | Internal review of architecture doc; send v0.1 to Meridian IT for early feedback | Lead | IT feedback captured |

### Week 2

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon–Tue | Write remaining browser tests (Reports, Demand, spending views) | QA | Full test suite for existing views |
| Wed | Finalize architecture doc incorporating IT feedback | Lead + Writer | `proposal/architecture.html` FINAL |
| Thu | Reports defect audit — enumerate all issues, build defect register | Lead + Frontend | Defect register (severity-ranked) |
| Fri | **Phase 1 delivery call** — present architecture doc, demo test suite running green | Lead | Sign-off from IT and Okafor |

**Phase 1 Success Criteria:**
- ✅ `tests/` suite runs with `npm run test:e2e` in under 3 minutes
- ✅ All existing views have at least one smoke test
- ✅ Architecture document accepted by Meridian IT
- ✅ Defect register for R1 delivered and reviewed

---

## Phase 2 — Reports Remediation (Weeks 3–4)

**Deliverables:** R1 (Reports module — all defects resolved)

**Goal:** Give Tanaka's team a Reports page that works as expected. Every fix shipped with a corresponding test.

### Week 3

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Defect triage meeting with Tanaka's team — confirm priority order | Lead + Frontend | Agreed defect priority |
| Mon–Tue | Fix defects 1–4 (highest severity: filter wiring, API mismatches) | Frontend | Fixes committed to feature branch |
| Wed–Thu | Fix defects 5–8+ (i18n gaps, loading states, console errors) | Frontend | All defects resolved on branch |
| Fri | QA writes Playwright tests for all fixed defect scenarios | QA | Defect regression tests committed |

### Week 4

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Full regression run — all existing tests + new defect tests | QA | Green test run |
| Tue | Demo to Tanaka's team — walk through every fixed issue | Lead + Frontend | Tanaka sign-off |
| Wed | Address any feedback from Tanaka demo | Frontend | Revised fixes if needed |
| Thu | Final test run, merge to main | Lead | Production-ready Reports module |
| Fri | **Phase 2 delivery** — merge PR, share test results with IT and Okafor | Lead | R1 complete, signed off |

**Phase 2 Success Criteria:**
- ✅ All items in defect register resolved
- ✅ Each fix has a corresponding Playwright regression test
- ✅ Full test suite green
- ✅ Tanaka's team demo sign-off
- ✅ No new console errors in Reports view

---

## Phase 3 — Restocking Recommendations (Weeks 5–8)

**Deliverables:** R2 (Restocking view — full feature)

**Goal:** Deliver the feature Tanaka has been waiting for. This is the highest-value deliverable of the engagement.

### Week 5 — Design & Backend

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Planning session — review restocking algorithm with Tanaka to validate ranking logic | Lead | Confirmed algorithm parameters |
| Tue | Backend: new endpoint `GET /api/restocking/recommendations` with ranking algorithm | Lead | API endpoint + unit tests (pytest) |
| Wed | Backend: purchase order creation endpoint `POST /api/purchase-orders` (new endpoint — not present in current codebase per audit; API design confirmed in Phase 1 defect audit) | Lead | Full backend API ready |
| Thu–Fri | Frontend: new route `/restocking`, basic table scaffold, API wired | Frontend | Working skeleton at localhost:3000/restocking |

### Week 6 — Core Feature

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon–Tue | Budget ceiling input + real-time filtering of recommendations | Frontend | Budget filter working |
| Wed | Urgency badge system, color-coded tier display | Frontend | Visual urgency indicators |
| Thu | Warehouse filter integration (reuse FilterBar) | Frontend | Per-warehouse view working |
| Fri | Mid-point demo to Tanaka — confirm ranking makes operational sense | Lead | Feedback captured |

### Week 7 — Polish & Edge Cases

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Address Tanaka feedback from Week 6 demo | Frontend | Revised UI |
| Tue | "Create Purchase Order" action per row | Frontend | PO creation flow |
| Wed | CSV export of recommendation table | Frontend | Export working |
| Thu | Loading/error states, empty state (no items below reorder point) | Frontend | Robust UX |
| Fri | QA writes Playwright tests for Restocking flows | QA | Full test coverage |

### Week 8 — Stabilization & Delivery

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Full regression suite run (all views, all new tests) | QA | Green run |
| Tue | Final Tanaka demo and sign-off | Lead | Business sign-off |
| Wed | Documentation update — architecture doc addendum for Restocking | Lead + Writer | Updated architecture.html |
| Thu | Merge to main, final test run | Lead | Production-ready |
| Fri | **Phase 3 delivery** — demo to full buying committee (Okafor + Tanaka + IT) | Lead | R1–R4 complete |

**Phase 3 Success Criteria:**
- ✅ Restocking view accessible at `/restocking`
- ✅ Budget ceiling filters recommendations correctly
- ✅ Recommendations ranked by composite urgency score (critical/warning/watch tier × demand trend multiplier) — scoring logic confirmed with Tanaka in Week 5 planning session
- ✅ Purchase order creation works
- ✅ CSV export works
- ✅ Full Playwright coverage
- ✅ Tanaka sign-off

---

## Phase 4 — Modernization (Weeks 9–12, Optional)

**Deliverables:** D1 (UI refresh), D2 (Full i18n / Japanese), D3 (Dark mode)

This phase is **modular** — Meridian may elect any combination of D1, D2, D3. Individual items can be contracted separately; the package price applies when all three are included together. When contracted as a package, D1, D2, and D3 each run in a dedicated week (Weeks 9–11), with Week 12 reserved for integration and regression across all three — accounting for the full four-week duration.

| Week | Focus | Deliverables |
|---|---|---|
| 9 | D1 — Design system refresh | New CSS token file, updated typography, color palette, spacing applied to all views |
| 10 | D2 — i18n audit + Japanese locale | All hardcoded strings extracted, `ja.json` locale file, Tokyo team verification |
| 11 | D3 — Dark mode prototype on feature branch | `data-theme` toggle, CSS overrides, localStorage persistence |
| 12 | Integration + regression | All D1–D3 merged, full test suite green, final delivery |

**Phase 4 package (D1+D2+D3): 4 weeks (Weeks 9–12)**

---

## Key Milestones Summary

| Milestone | Date (from contract start) | What's Delivered |
|---|---|---|
| Phase 1 Kickoff | Day 1 (Week 1, Monday) | Team onboarded, codebase access confirmed |
| Architecture Doc v0.1 | Day 5 (End of Week 1) | Early IT review |
| **Phase 1 Complete** | Day 10 (End of Week 2) | Tests running, architecture doc final, defect register |
| **Phase 2 Complete** | Day 20 (End of Week 4) | Reports module fully remediated, all tests green |
| Restocking Mid-Point Demo | Day 30 (End of Week 6) | Tanaka validates ranking logic |
| **Phase 3 Complete** | Day 40 (End of Week 8) | R1–R4 all delivered, full test coverage |
| **Phase 4 Complete** (optional) | Day 60 (End of Week 12) | D1–D3 delivered |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Defect count in Reports exceeds 8 | Medium | Low | Fixed price covers all defects found — no change order needed |
| Codebase complexity exceeds Phase 1 audit estimate (hidden coupling, undocumented state) | Medium | Medium | Phase 1 audit is specifically scoped to surface this before Phase 2–3 work begins. If audit reveals material scope increase, we present findings before proceeding — no surprises mid-engagement |
| Restocking algorithm doesn't match operational intuition | Medium | High | Week 5 planning session with Tanaka validates ranking logic before any UI is built; Week 6 mid-point demo provides a second checkpoint before polish week |
| Stakeholder unavailability delays phase sign-off (Okafor or Tanaka) | Low | Medium | Pricing assumptions (§5 of pricing doc) require written approval within 3 business days of demo; if delayed, timeline shifts by equivalent days at no additional cost — this is documented in contract terms |
| IT delays codebase access or environment approval | Low | High | Access requirements confirmed in Phase 1 kickoff; codebase access is a contract precondition (Day 1) |
| Tokyo team unavailable for i18n validation (D2) | Low | Medium | Japanese locale file provided for async review; 5-business-day review window; video walkthrough available if synchronous call not possible |
