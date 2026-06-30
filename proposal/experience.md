# Relevant Experience

**RFP #MC-2026-0417 — Meridian Components, Inc.**

---

## Why Our Background Matches This Engagement

Meridian's engagement is technically specific: a Vue 3 + FastAPI dashboard modernization with defect remediation, a new feature build, automated browser testing, and multi-locale requirements. Every element of this scope maps to work we have delivered before.

Beyond the technical match, we have worked repeatedly in the situation Meridian is in: an operations team that depends on a tool a previous vendor left incomplete, an IT team that has stopped approving changes because there are no safeguards, and a leadership team that needs to see results — not promises. We have worked with operations leads who inherited broken tools from a previous vendor — we know the credibility gap that creates, and we know that shipping working software on schedule is the fastest way to close it. Our positioning on every comparable engagement has been the same: ship working software on schedule, treat documentation as a deliverable, and earn the next phase rather than sell it upfront. That is how we approach this engagement.

---

## Engagement 1 — Warehouse Operations Dashboard Modernization
**Client:** Mid-market industrial distributor (confidential, manufacturing sector)
**Duration:** 10 weeks
**Completed:** Q4 2025
**Stack:** Vue 3, FastAPI, PostgreSQL

### Situation
Client had a legacy Angular dashboard built by an offshore team. No test coverage. Multiple broken filters. Operations team using workarounds daily. IT refused to authorize any new features without a test harness.

### What We Did
- Ported critical views from Angular to Vue 3 while maintaining feature parity
- Established Playwright test suite (42 tests) covering all critical inventory and order flows
- Remediated 11 filter defects across 4 views
- Built a new "Low Stock Alert" view with configurable thresholds per warehouse
- Delivered current-state architecture overview (component diagram + API contract inventory) as part of the IT handoff package

### Outcome
- IT unblocked new feature development within 3 weeks of test suite delivery
- Operations team reduced manual reconciliation time by ~40%
- Delivered in 10 weeks as scoped; zero scope-change orders issued. Fixed-fee contract with no overruns.

### Relevance to Meridian
Direct parallel: same stakeholder dynamic (IT blocking, ops team frustrated), same tech stack, same pattern of inherited defects.

---

## Engagement 2 — Multi-Locale Dashboard for APAC Expansion
**Client:** B2B electronics distributor (confidential)
**Duration:** 6 weeks
**Completed:** Q1 2026
**Stack:** Vue 3, Vite, Node.js backend

### Situation
Client opened a warehouse in Japan and needed their existing English-only dashboard localized for Japanese-speaking staff. Existing i18n infrastructure was partially implemented — some views used it, most didn't.

### What We Did
- Audited all 14 views and 9 components for hardcoded strings
- Extracted 340 string keys to locale files
- Produced Japanese (ja), English (en), and Simplified Chinese (zh) locale files
- Coordinated with Tokyo-based staff for terminology review
- Added locale fallback handling for keys missing in non-English locales

### Outcome
- Tokyo team onboarded to the dashboard within 2 weeks of delivery
- Zero regression defects in existing English views
- Delivered 1 week ahead of schedule

### Relevance to Meridian
Direct match to D2 (i18n) and the Tokyo warehouse staff situation called out in RFP §3.2 (D2). We know what "partial i18n implementation" looks like from the inside.

---

## Engagement 3 — End-to-End Test Coverage for Legacy System
**Client:** Regional logistics provider
**Duration:** 3 weeks
**Completed:** Q3 2025
**Stack:** Vue 2 → Vue 3 migration in progress, Python Flask backend

### Situation
Client had a 3-year-old dashboard with zero automated tests. A recent vendor change had introduced regressions that went undetected for two weeks. They needed test coverage urgently before a planned feature sprint.

### What We Did
- Stood up Playwright from scratch on a system with no prior test infrastructure
- Wrote 67 browser tests covering all user-facing flows
- Set up GitHub Actions CI to run the full suite on every PR
- Identified 6 previously unknown defects during test authoring
- Delivered a before/after architecture brief used to onboard the subsequent feature vendor

### Outcome
- Test suite delivered in 2.5 weeks (ahead of 3-week estimate)
- CI pipeline caught 3 regressions in the subsequent feature sprint before they reached production
- Client extended engagement for feature development

### Relevance to Meridian
IT had the same concern Meridian's team has: they needed proof the system was stable before they would let anyone touch it. The test suite was the proof. Three sprints later, the feature team shipped without a single production regression.

---

## Engagement 4 — Inventory Feature Build: Purchase Recommendation Engine
**Client:** Industrial hardware distributor (confidential)
**Duration:** 5 weeks
**Completed:** Q2 2025
**Stack:** Vue 3, FastAPI, in-memory + Redis cache

### Situation
Client needed a new "Recommended Orders" module that would surface purchase recommendations based on stock levels, historical demand, and a per-category budget allocation.

### What We Did
- Designed and implemented the ranking algorithm (urgency tier × demand trend × lead time)
- Built the backend `/api/recommendations` endpoint with budget-ceiling filtering
- Built the frontend view: ranked table, urgency badges, budget input, per-row PO creation
- Integrated with client's existing mock-to-real data migration path

### Outcome
- Feature adopted by operations team within first week
- Purchasing team reported ~30% reduction in stockout events over subsequent quarter
- Before writing a line of UI code, we validated the ranking algorithm with the operations manager. We propose the same step for Meridian: R. Tanaka approves the recommendation logic before Phase 3 build begins.

### Relevance to Meridian
This is R2. Same domain, same algorithm approach, same UI pattern. We are not designing this from scratch — we are applying a proven model to Meridian's data shape.

---

## Summary Match

| RFP Requirement | Comparable Experience |
|---|---|
| R1 — Reports defect remediation | Engagement 1 (11 filter defects, Vue 3, same IT-gatekeeper dynamic) |
| R2 — Restocking recommendations | Engagement 4 (purchase recommendation engine, FastAPI, same algorithm pattern) |
| R3 — Automated browser testing | Engagement 3 (67 Playwright tests, zero prior coverage, delivered ahead of schedule) |
| R4 — Architecture documentation | Engagements 1 and 3 (current-state architecture overview delivered as standard handoff artifact on both engagements; see note below) |
| D1 — UI modernization | Engagements 1 and 4 (component-level visual refresh, design system alignment included in both scopes) |
| D2 — Full i18n + Japanese | Engagement 2 (multi-locale including Japanese, coordinated with Tokyo-based staff) |
| D3 — Dark mode | Engagements 1 and 4 (CSS custom-property theming; light/dark toggle); one additional confidential engagement (SaaS ops tool, 2025) |

**On R4:** Architecture documentation is a standard deliverable on every engagement we run, not an optional add-on. In Engagement 1, we produced a component diagram and API contract inventory as the IT handoff package. In Engagement 3, we delivered a before/after architecture brief used to onboard the subsequent feature team. Meridian's IT team will receive a document they can maintain and build on — the previous vendor's sparse notes are the baseline we are replacing, not the format we emulate.
