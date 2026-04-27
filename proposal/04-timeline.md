# Timeline

## Response to RFP #MC-2026-0417 — Delivery Plan

The plan follows the three-phase structure outlined in the Executive Summary. Each phase produces autonomous deliverables and creates the preconditions for the next phase.

**Planning parameters**

- **Target kickoff:** June 1, 2026 (subject to contract finalization)
- **Total duration:** 18 weeks (~4.5 months)
- **Cadence:** 2-week sprints, bi-weekly demos to Meridian's Operations and IT teams
- **Built-in buffer:** one week at the end of Phase 1, half a week at the end of Phase 2

---

## Phase 1 — Stabilization (Weeks 1–7)

**Objective:** unblock the system by bringing it to a state in which every future modification can be automatically validated.

| Week | Activities |
|---|---|
| 1–2 | Discovery & setup: technical onboarding, environment access, complete audit of Reports defects, R2 kickoff with Operations to define rules |
| 3–5 | R1 — Reports remediation: progressive resolution of defects by priority, alignment with architectural patterns, completion of module i18n |
| 4–7 | R3 — E2E tests (in parallel): Playwright setup, CI integration, incremental coverage of Inventory → Orders → Spending → Demand Forecast |
| 7 | R4 — Architecture documentation finalized, Phase 1 demo, partial handoff to Meridian IT |

**Milestone M1 (end of week 7):** Reports module stable, E2E suite green on the four critical flows, architecture documentation delivered.

---

## Phase 2 — Evolution (Weeks 8–12)

**Objective:** deliver the Restocking view, the main new capability requested by the RFP.

| Week | Activities |
|---|---|
| 8–9 | Final definition of prioritization rules with Operations (based on the W1 kickoff), mockups and UX validation of the Restocking view |
| 10–11 | Development: backend recommendation logic, frontend view and interactions |
| 12 | E2E tests dedicated to the Restocking flow, validation with Operations, deployment to staging |

**Milestone M2 (end of week 12):** Restocking view operational in staging, validated by the Operations team, ready for rollout.

---

## Phase 3 — Modernization (Weeks 13–18)

**Objective:** deliver desired items D1–D3, in sequential order to minimize the risk of visual and translation interferences.

| Week | Activities |
|---|---|
| 13–14 | D1 — UI refresh: design system alignment, improved readability of tables/charts, brand finishes |
| 15–16 | D2 — Complete i18n: extension of Japanese coverage to all modules, locale formatting of numbers/currencies/dates |
| 17–18 | D3 — Dark mode: selectable theme, persistence, WCAG contrast compliance. Final handoff: knowledge transfer to the IT team, operational documentation |

**Milestone M3 (end of week 18):** desired items delivered, complete handoff to Meridian IT, engagement closure.

---

## Phase Summary

| Phase | Weeks | Target period | Deliverables |
|---|---|---|---|
| 1 — Stabilization | 7 | Jun 1 – Jul 19, 2026 | R1, R3, R4 |
| 2 — Evolution | 5 | Jul 20 – Aug 23, 2026 | R2 |
| 3 — Modernization | 6 | Aug 24 – Oct 4, 2026 | D1, D2, D3 |

---

## Governance and Cadence

- **Sprint review:** every 2 weeks, with live demo to the Operations and IT teams
- **Standup with the Meridian sponsor:** weekly (15 min)
- **Steering committee:** monthly, focused on milestones, risks, and change requests
- **Reporting:** weekly status update through an agreed channel (Slack / email / project portal)

---

## Main Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Delay in staging/production environment access | Phase 1 kickoff slip | Start activities offline (code audit, local test setup) during W1 even without the client environment |
| R2 prioritization rules not finalized in time | Phase 2 slip | Operations kickoff anticipated to W1, final decision by W4 |
| Significant defects emerging during E2E tests | Phase 1 overrun | 1-week buffer integrated at end of Phase 1; non-blocking defects moved to post-engagement backlog |
| Tokyo team availability for i18n validation | D2 slowdown | Asynchronous validation sessions, language test fixtures defined with the APAC site at W14 |
