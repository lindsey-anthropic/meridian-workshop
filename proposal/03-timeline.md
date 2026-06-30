# Timeline

**In response to:** RFP #MC-2026-0417, §4.4 (Timeline)

---

We propose a phased delivery plan that follows our **stabilize → finish → extend** approach. Each phase ends in a concrete, demonstrable deliverable, so Meridian sees value early and can confirm direction before the next phase begins.

The team is one senior full-stack engineer leading delivery, supported part-time by a Vue/frontend specialist during the UI-heavy phases (R1 and R2). The 8–9 week calendar is longer than the ~42–45 person-days of hands-on effort alone because it includes client review and sign-off gates at each phase boundary — so the person-day estimates, the calendar duration, and the phase ceilings in our pricing all reconcile to the same plan.

## Phased plan

| Phase | Focus | Key deliverables | Duration |
|-------|-------|------------------|----------|
| **0 — Onboarding & scoping** | Get oriented, agree scope | Confirmed assumptions (R1–R3, D1); catalogued Reports defect list agreed with your team; environment access | ~1 week |
| **1 — Stabilize** | R3 + R4 | Playwright E2E suite across the critical path; current-state architecture overview for IT | ~2 weeks |
| **2 — Finish** | R1 | Reports module fully remediated against the agreed defect list; every fix covered by a regression test | ~2–3 weeks |
| **3 — Extend** | R2 | Restocking recommendations view (lead-time aware, budget-constrained); early demo mid-phase, then hardened to done | ~3 weeks |
| **4 — Desired (optional)** | D1 / D2 / D3 | UI design-system modernization, extended i18n, dark mode — scoped and priced separately | TBD |

**Required scope (Phases 0–3): approximately 8–9 weeks.** Phase 4 is shown for planning only and would be scheduled after the required work is underway.

## Sequencing notes

- **Phase 1 before Phase 2 is deliberate.** The test net and architecture picture are what let us remediate Reports safely and what unblock IT for everything after — consistent with our technical approach.
- **The R2 mid-phase demo is a fixed checkpoint**, not a courtesy. Operations sees a working Restocking view early enough to redirect it before it hardens.
- **Phases can overlap modestly.** For example, the architecture review (Phase 1) informs the Reports audit agreed in Phase 0, and some R4 documentation continues as we work. The durations above assume light overlap, not a strict serial chain.
- **Critical path dependency:** the single largest schedule risk is the true size of the Reports defect set (Phase 2). Our Phase 0 audit exists to retire that risk before remediation starts, and our pricing absorbs the overrun (see Pricing).

## Assumptions affecting schedule

- Timely client availability for the Phase 0 scoping decisions and the Phase 3 demo feedback.
- Environment and data access provisioned within Phase 0.
- Desired-scope items (Phase 4) do not displace required work unless Meridian re-prioritizes.
