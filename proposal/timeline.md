# Timeline

**Proposal in response to RFP #MC-2026-0417**

---

## Overview

The engagement is structured in three phases. Phases 1 and 2 cover all required items (R1–R4) and are committed scope. Phase 3 covers desired items (D1–D3) and is conditional on budget remaining after Phase 2 delivery.

| Phase | Weeks | Deliverables |
|---|---|---|
| Phase 1 — Foundation | Weeks 1–2 | Architecture documentation (R4), Reports defect log, test infrastructure setup |
| Phase 2 — Core delivery | Weeks 3–7 | Reports remediation (R1), Restocking view (R2), browser test suite (R3) |
| Phase 3 — Modernization | Weeks 8–9 | UI refresh (D1), i18n completion (D2), dark mode (D3) |

Total timeline to Phase 2 completion: **7 weeks from kickoff.**
Total timeline including Phase 3: **9 weeks from kickoff.**

---

## Phase 1 — Foundation (Weeks 1–2)

The purpose of Phase 1 is to give every team — operations, IT, and the development team — a shared, accurate picture of the system before any changes are made.

**Week 1**
- Kickoff meeting with Meridian stakeholders; confirm critical test flows with IT, confirm brand guide availability
- Architecture review: map all frontend views, API endpoints, data layer, and component patterns
- Deliver architecture documentation (R4) as HTML artifact by end of week

**Week 2**
- Full Reports module audit: enumerate every defect, categorize by type (pattern inconsistency, filter gap, i18n gap, data formatting, test coverage)
- Deliver written defect log to Meridian for review and sign-off
- Set up Playwright test infrastructure in the repository; establish baseline test run in CI

**Phase 1 exit criteria:**
- Architecture documentation delivered and accepted
- Defect log reviewed and signed off by Meridian
- Test infrastructure running with at least one passing smoke test

---

## Phase 2 — Core delivery (Weeks 3–6)

Phase 2 executes against the signed-off defect log and the agreed requirements. No scope surprises — everything being built in this phase was enumerated in Phase 1.

**Weeks 3–4 — Reports remediation (R1)**
- Migrate Reports component to Composition API, consistent with all other views
- Wire to `api.js` abstraction layer; remove hardcoded URLs
- Integrate global filters (Time Period, Warehouse, Category, Order Status)
- Localize number and currency formatting via existing i18n infrastructure
- Remove development artifacts (console statements, dead code)
- Add backend test coverage for Reports API endpoints

**Weeks 4–5 — Restocking view (R2)**
- Implement `GET /api/restocking/recommendations` endpoint
- Build RestockingView.vue: budget input, recommendations list, SKU/quantity/cost display
- Wire into navigation and existing filter/API patterns

**Weeks 5–6 — Browser test suite (R3)**
- Write Playwright tests for all agreed critical flows: inventory view, orders view, Reports view (post-remediation), restocking workflow
- Deliver test documentation: how to run, what each test covers, how to add new tests

**Week 7 — Buffer and Phase 2 close**
- Integration testing across all delivered items; regression check on existing views
- IT team review of test suite and sign-off
- Address any defects surfaced during review

**Phase 2 exit criteria:**
- All R1 defects resolved and verified against the Phase 1 defect log
- Restocking view functional with accurate recommendations
- Full browser test suite passing; IT team has reviewed and approved coverage
- Application deployable with no regressions in existing views

---

## Phase 3 — Modernization (Weeks 8–9, conditional)

Phase 3 proceeds if budget remains after Phase 2 delivery. Each item is independently sequenceable; if budget covers two of three, we will sequence based on Meridian's priority order.

**D1 — UI modernization**
- Requires brand guide delivered by start of Phase 3
- Apply design tokens (color, typography) globally; update component styling
- Review session with Meridian before final delivery

**D2 — Internationalization**
- Audit all views for untranslated strings
- Extend Japanese locale file; validate with Meridian's Tokyo team contact
- Verify Reports view is fully locale-aware (currency, month names, labels)

**D3 — Dark mode**
- Implement light/dark token sets with WCAG 2.1 AA contrast compliance
- Theme toggle with localStorage persistence
- Full UI validation in dark mode before delivery; contrast ratios documented

---

## Milestones

| Milestone | Target date (from kickoff) |
|---|---|
| Architecture documentation delivered | End of week 1 |
| Reports defect log signed off | End of week 2 |
| Reports remediation complete | End of week 4 |
| Restocking view delivered | End of week 5 |
| Browser test suite complete | End of week 6 |
| Phase 2 close and IT sign-off | End of week 7 |
| Phase 3 items (if in scope) | End of week 9 |

---

## Assumptions

- Kickoff meeting can be scheduled within one week of contract award
- Meridian will review and sign off on the defect log **within 3 business days** of delivery; delays push Phase 2 start accordingly
- Brand guide for D1 will be provided before Phase 3 begins; if not available, D1 proceeds with a proposed default design pending Meridian approval
- Meridian will provide a Tokyo team contact for D2 translation review; **translation review turnaround is assumed at 5 business days**. Delays beyond this do not extend the Phase 3 fee but may extend the calendar delivery date
