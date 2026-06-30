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

```
Week:   1    2    3    4    5    6    7    8    9   10   11   12
        ████ ████ ████ ████ ████ ████ ████ ████
Phase1: [== Foundation ==]
Phase2:           [== Reports Remediation ==]
Phase3:                     [======== Restocking Feature ========]
Phase4:                                         [== Modernization (optional) ==]
```

---

## Phase 1 — Foundation (Weeks 1–2)

**Deliverables:** R3 (Automated Tests — skeleton), R4 (Architecture Documentation)

**Goal:** Establish the safety net before touching a single line of production code. Give IT their confidence layer. Give Meridian a clear picture of what they actually have.

### Week 1

| Day | Activity | Owner | Output |
|---|---|---|---|
| Mon | Kickoff call with Meridian (Okafor + IT rep) | Lead | Confirmed scope assumptions, approved questions list |
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
| Tue | Backend: new endpoint `/api/restocking/recommendations` with ranking algorithm | Lead | API endpoint + unit tests (pytest) |
| Wed | Backend: purchase order creation endpoint (if not already present) | Lead | Full backend API ready |
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
- ✅ Recommendations ranked by urgency × demand trend
- ✅ Purchase order creation works
- ✅ CSV export works
- ✅ Full Playwright coverage
- ✅ Tanaka sign-off

---

## Phase 4 — Modernization (Weeks 9–12, Optional)

**Deliverables:** D1 (UI refresh), D2 (Full i18n / Japanese), D3 (Dark mode)

This phase is **modular** — Meridian may elect any combination of D1, D2, D3. Pricing and timeline below assumes all three.

| Week | Focus | Deliverables |
|---|---|---|
| 9 | D1 — Design system refresh | New CSS token file, updated typography, color palette, spacing applied to all views |
| 10 | D2 — i18n audit + Japanese locale | All hardcoded strings extracted, `ja.json` locale file, Tokyo team verification |
| 11 | D3 — Dark mode prototype on feature branch | `data-theme` toggle, CSS overrides, localStorage persistence |
| 12 | Integration + regression | All D1–D3 merged, full test suite green, final delivery |

---

## Key Milestones Summary

| Milestone | Date (from contract start) | What's Delivered |
|---|---|---|
| Phase 1 Kickoff | Day 1 | Team onboarded, codebase access confirmed |
| Architecture Doc v0.1 | End of Week 1 | Early IT review |
| **Phase 1 Complete** | End of Week 2 | Tests running, architecture doc final, defect register |
| **Phase 2 Complete** | End of Week 4 | Reports module fully remediated, all tests green |
| Restocking Mid-Point Demo | End of Week 6 | Tanaka validates ranking logic |
| **Phase 3 Complete** | End of Week 8 | R1–R4 all delivered, full test coverage |
| **Phase 4 Complete** (optional) | End of Week 12 | D1–D3 delivered |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Defect count in Reports exceeds 8 | Medium | Low | Fixed price covers all defects found — no change order needed |
| Restocking algorithm doesn't match operational intuition | Medium | High | Week 6 mid-point demo with Tanaka before any polish; algorithm confirmed in Week 5 planning session |
| IT delays access or approval | Low | High | Clarifying question sent before contract start; access confirmed in Phase 1 kickoff |
| Tokyo team unavailable for i18n validation (D2) | Low | Medium | Provide Japanese locale file for async review; video walkthrough if sync call not possible |
| Scope creep during Phase 3 | Medium | Medium | Any change beyond agreed Restocking spec is logged as a new ticket; no scope added without written approval |
