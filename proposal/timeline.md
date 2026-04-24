# Timeline

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

Proposed engagement length: **10 weeks** for all required items (R1–R4). Desired items (D1–D3) are available as a separately scoped Phase 2.

The sequencing below reflects two constraints: (1) Meridian's stated priority order, and (2) the practical dependency that IT sign-off requires test coverage before any changes can be approved. R3 is therefore woven into Phase 1 rather than treated as a standalone deliverable at the end.

---

## Phase 1 — Onboarding & Foundation (Weeks 1–2)

**Goal:** Orient in the codebase, establish test infrastructure, produce architecture documentation.

- Full codebase audit and review of Meridian's defect log
- **R4:** Deliver architecture documentation (HTML diagram, component map, API surface)
- **R3:** Establish Playwright test scaffolding; write initial happy-path tests for Inventory and Orders views
- Agree on defect prioritization with Meridian stakeholders

*Milestone: Architecture doc delivered and defect list triaged by end of Week 2.*

---

## Phase 2 — Reports Remediation (Weeks 3–5)

**Goal:** Resolve all logged Reports defects; deliver regression test coverage in parallel.

- **R1:** Remediate defects in priority order from Meridian's issue log
- **R3:** Write regression tests alongside each fix — tests ship with the fix, not after
- Flag any out-of-scope issues discovered during audit before resolving them
- Mid-point check-in with R. Tanaka's team to confirm Reports behavior meets expectations

*Milestone: All logged Reports defects resolved, regression-tested, and signed off by end of Week 5.*

---

## Phase 3 — Restocking Feature (Weeks 6–9)

**Goal:** Deliver the new Restocking view end-to-end.

- **R2:** Build Restocking view — backend recommendations endpoint, frontend view, budget ceiling input
- **R3:** End-to-end Playwright tests for Restocking, including filter and budget ceiling behavior
- Complete Playwright coverage for Spending view (deferred from Phase 1 to keep scope manageable)
- Internal review and QA pass before Meridian demo

*Milestone: Restocking view demo to R. Tanaka's team by end of Week 8; feedback addressed by end of Week 9.*

---

## Phase 4 — Hardening & Handoff (Week 10)

**Goal:** Finalize all deliverables; hand off to Meridian IT.

- Final test suite review and documentation
- **R4:** Update architecture documentation to reflect Phase 3 additions (Restocking API, new view)
- Handoff session with Meridian IT: walkthrough of test suite, architecture doc, and change process
- Close out any open punch-list items

*Milestone: All required deliverables accepted and handed off by end of Week 10.*

---

## Phase 2 — Desired Items (Weeks 11+, if authorized)

Scope and timeline for D1–D3 to be confirmed after Phase 1 delivery. Preliminary estimates:

| Item | Estimated Duration |
|---|---|
| D1 — UI Modernization | 3–4 weeks (pending style guide) |
| D2 — Internationalization | 2 weeks |
| D3 — Dark mode | 1 week |

---

## Key Assumptions & Dependencies

| Dependency | Required By | Impact if Late |
|---|---|---|
| Meridian defect log (R1) | Week 1 kickoff | R1 scope at risk; audit extends into Phase 2 |
| Brand style guide (D1) | Phase 2 kickoff | D1 cannot be scoped or priced |
| Stakeholder availability for mid-point check-in | Week 5 | Phase 3 start may slip |
