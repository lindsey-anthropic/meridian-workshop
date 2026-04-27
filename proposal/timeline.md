# Delivery Timeline

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Your Firm Name]
**Date:** May 8, 2026

---

## Phasing Principles

- Each phase ends with a testable, deployable artifact — no "big bang" delivery at the end
- Required items (R1–R4) are fully delivered before any desired items (D1–D3) begin
- Milestone sign-off by Meridian is required before the next phase starts; scope changes after sign-off are handled via change order
- Estimated start: June 2, 2026 (assuming contract execution by May 26)

---

## Phase 1 — Foundation (Weeks 1–2)

**Deliverables**
- Architecture documentation (R4): current-state diagram + written narrative, delivered as self-contained HTML
- Defect register for Reports module: root cause, fix approach, and effort per issue — reviewed and signed off by Meridian before remediation begins
- Playwright test suite skeleton: project scaffolding, CI integration, first two critical flows instrumented (inventory view + warehouse filtering)

**Milestone:** Architecture doc accepted by Meridian IT; Reports defect register reviewed and scoped

---

## Phase 2 — Stabilization (Weeks 2–4)

**Deliverables**
- Reports module fully remediated (R1): all defects in the signed-off register resolved
- Test suite extended to cover Reports flows and cross-module navigation (R3, flows 3 + 5)
- All fixes verified against the Playwright suite — no defect closed without a passing test

**Milestone:** Reports module demo to R. Tanaka's team; IT sign-off on test coverage for remediated flows

---

## Phase 3 — New Capability (Weeks 4–7)

**Deliverables**
- Restocking view live (R2): `/api/restocking` backend endpoint, budget ceiling input, recommendation table, summary panel
- Test suite completed (R3): Restocking flow instrumented (flow 4), full suite passing
- Final test suite documentation delivered alongside R3

**Milestone:** Restocking demo to operations team; full test suite accepted by Meridian IT

---

## Phase 4 — Desired Items (Weeks 7–10, conditional)

Scope and sequence confirmed after Phase 3 sign-off based on remaining budget and Meridian priorities.

| Week | Item | Deliverable |
|------|------|-------------|
| 7–8 | D1 — UI modernization | Updated global stylesheet + component library |
| 8–9 | D2 — i18n extension | Full i18n key coverage; Japanese locale for Tokyo team |
| 9–10 | D3 — Dark mode | Theme toggle with persistent per-workstation preference |

---

## Summary Schedule

| Phase | Weeks | Required items | Desired items |
|-------|-------|---------------|---------------|
| 1 — Foundation | 1–2 | R4, R3 (partial) | — |
| 2 — Stabilization | 2–4 | R1, R3 (partial) | — |
| 3 — New capability | 4–7 | R2, R3 (complete) | — |
| 4 — Desired items | 7–10 | — | D1, D2, D3 |

**Total: 7 weeks for all required items. Up to 10 weeks if all desired items are in scope.**

---

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Reports defect count higher than 8 after audit | Medium | Audit in week 1, scope validated before remediation starts — no surprise overruns |
| Demand forecast data insufficient for Restocking logic | Low | Flagged at architecture review; fallback to rolling average from order history |
| Meridian IT sign-off on test suite delayed | Medium | Involve IT from week 1 on flow definition; no waiting-at-the-end review |
| D1–D3 scope expands during Phase 4 | Medium | Fixed-fee per phase; any additions handled via written change order |

---

*Pricing and payment milestones follow in the next section.*
