# Timeline

**Proposal in response to RFP #MC-2026-0417**

---

We propose a four-phase delivery over ten weeks from contract start. Phases are structured to front-load the work that unblocks everything else — architecture review and test harness first, then remediation and new features, then documentation and handoff.

---

## Phase 1 — Onboarding & Audit (Weeks 1–2)

The first two weeks are about understanding before building. We will conduct the codebase review that informs R4 (architecture documentation) and the defect audit that scopes R1 (Reports remediation). We will also establish the Playwright test harness so that automated tests can be written alongside each subsequent piece of work, rather than retrofitted at the end.

**Deliverables:**
- Complete defect catalogue for the Reports module (R1 input)
- Draft architecture overview shared with Meridian IT for review (R4 draft)
- Playwright test harness in place, running against the local environment

**Milestone:** Meridian IT signs off on the test harness setup. This is the gate that allows incremental approvals to begin.

---

## Phase 2 — Reports Remediation (Weeks 3–5)

With the defect catalogue from Phase 1, we resolve all identified issues in the Reports module. Work proceeds in triage order: broken filter behaviour first, data inconsistencies second, internationalisation gaps third, code pattern debt fourth.

Automated tests for each fixed flow are written as part of this phase, not after. By the end of Phase 2, Meridian IT will have a passing test suite against the Reports module they can run independently.

**Deliverables:**
- Fully remediated Reports module (R1 complete)
- Playwright tests covering all Reports flows (R3 partial)

**Milestone:** Reports module review with R. Tanaka's team. Sign-off before moving to new build work.

---

## Phase 3 — Restocking Feature (Weeks 6–8)

The Restocking view is built as new functionality within the existing application. We will begin this phase with a brief requirements conversation with Tanaka's team to confirm how the feature should behave — budget scope, demand weighting, output format — before writing code. Building to confirmed requirements avoids the kind of rework that extended the previous engagement.

Playwright tests for the Restocking flow are written in parallel with the feature build.

**Deliverables:**
- Restocking recommendations view, fully functional (R2 complete)
- Playwright tests covering the Restocking flow (R3 partial)

**Milestone:** Restocking feature demo with operations team. Functional sign-off.

---

## Phase 4 — Completion & Handoff (Weeks 9–10)

Final phase covers the remaining R3 scope (inventory and orders flow tests), finalises the R4 architecture documentation incorporating anything learned during the engagement, and delivers the complete handoff package to Meridian IT.

If D1–D3 items have been approved and scoped during the engagement, implementation slots into this phase. If not, they are documented as a candidate next phase.

**Deliverables:**
- Complete Playwright test suite across all major flows (R3 complete)
- Final architecture documentation, reviewed and accepted by Meridian IT (R4 complete)
- Handoff package: test suite, run instructions, architecture docs, notes on any deferred items
- D1/D2/D3 deliverables if in scope

**Milestone:** Final delivery review. IT and operations sign-off.

---

## Summary

| Phase | Weeks | Key Output |
|---|---|---|
| 1 — Onboarding & Audit | 1–2 | Defect catalogue, test harness, architecture draft |
| 2 — Reports Remediation | 3–5 | R1 complete, R3 (Reports) |
| 3 — Restocking Feature | 6–8 | R2 complete, R3 (Restocking) |
| 4 — Completion & Handoff | 9–10 | R3 complete, R4 complete, handoff |

---

## Notes on the desired items (D1–D3)

D1 (UI modernisation), D2 (internationalisation), and D3 (dark mode) are not included in the base timeline above. Each is a meaningful body of work — D1 in particular is dependent on receipt of Meridian's brand guide — and including them in a fixed-fee proposal without confirmed scope would not serve either party.

Our recommendation: treat D1–D3 as a defined follow-on phase, scoped and priced once the R1–R4 engagement is underway and brand assets are available. This keeps the base engagement predictable and gives Meridian the option to expand scope with confidence rather than committing to open-ended work upfront.
