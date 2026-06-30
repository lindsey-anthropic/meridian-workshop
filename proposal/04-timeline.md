# Timeline

**RFP MC-2026-0417 — Inventory Dashboard Modernization**

We propose a **phased delivery plan that mirrors our technical sequencing** — document, test, remediate, build, then optional enhancements. Each phase ends in a concrete, acceptance-tested deliverable tied to a payment milestone, so Meridian always knows exactly what has been delivered and what remains.

Durations are expressed in **weeks from engagement kickoff** so the plan is independent of the exact award date. The required scope (R1–R4) completes in **8 weeks**.

---

## Phased plan (required scope)

| Phase | Weeks | Requirement | Key activities | Exit deliverable |
|---|---|---|---|---|
| **0 — Onboarding & Architecture** | 1–2 | **R4** | Code-grounded current-state review; map inconsistencies and confirm flow inventory; finalize assumptions with procurement and Tanaka's team | Architecture overview accepted by IT |
| **1 — Test Foundation** | 2–4 | **R3** | End-to-end coverage of all critical flows; IT-runnable suite with run instructions; baseline established before any change | Passing Playwright suite accepted by IT |
| **2 — Reports Remediation** | 4–6 | **R1** | Filter parity, shared data layer, removal of console noise, locale-aware formatting, standard alignment; all logged defects closed | Remediated Reports module, regression-tested |
| **3 — Restocking Build** | 6–8 | **R2** | Validate prioritization with operations; build budget-aware recommendation view and supporting API; cover with tests | Restocking view in operators' hands |
| **Close-out** | 8 | All | Final acceptance pass, documentation handoff, knowledge transfer to IT | Sign-off on required scope |

Phases 0 and 1 overlap slightly: test scaffolding begins as the architecture picture firms up. Remediation (R1) deliberately follows the test foundation (R3) so every fix is protected against regression from the moment it lands.

---

## Optional enhancements (desired scope, opt-in)

If Meridian elects to proceed with any desired items, they run **after** required scope on a time-and-materials basis with a not-to-exceed ceiling, and can be scheduled to suit operations' availability.

| Item | Indicative effort | Notes |
|---|---|---|
| **D1 — UI modernization** | 1.5–2.5 weeks | Accelerated by our design system; starts from a mature component baseline |
| **D2 — Internationalization** | 1–2 weeks | Builds on locale-aware formatting introduced in R1; Tokyo-facing views first |
| **D3 — Dark mode** | 0.5–1 week | Theme layer over design-system tokens; persistent operator toggle |

---

## Payment milestones

Each required-scope milestone is invoiced on client acceptance of that phase's deliverable — payment tracks delivered value, not elapsed time.

| Milestone | Trigger | % of fixed fee |
|---|---|---|
| M1 | Architecture overview accepted (R4) | 15% |
| M2 | Test suite accepted by IT (R3) | 25% |
| M3 | Reports remediation accepted (R1) | 25% |
| M4 | Restocking accepted + close-out sign-off (R2) | 35% |

Desired items (D1–D3) are billed monthly on a T&M basis against the agreed not-to-exceed ceiling, only if commissioned.

---

## Why this schedule is credible

- **Front-loaded de-risking.** R4 and R3 come first, so unknowns are surfaced and a safety net is in place before we change a line of production behavior — the single biggest driver of timeline confidence.
- **Acceptance-gated phases.** Nothing is "in progress forever"; each phase has a defined exit and a milestone, giving Procurement clear checkpoints.
- **Parallelizable but honestly sequenced.** We show the small overlaps we will actually use, rather than padding the plan or pretending everything is independent.
- **Optional work ring-fenced.** Desired items can't slip the required schedule, because they are scheduled and billed separately.
