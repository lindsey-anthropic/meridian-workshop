# Delivery Timeline

**Proposal in response to RFP #MC-2026-0417**

---

## Overview

We propose a 9-week phased delivery structured to deliver risk-reduction value early — automated test coverage and architecture documentation are prioritized ahead of feature development, ensuring Meridian IT can review and approve each subsequent phase without delay.

Contract start date assumed: **May 19, 2026** (two weeks post-proposal deadline).
Projected completion: **July 17, 2026** — one full week ahead of the early-completion bonus deadline of July 24, 2026.

---

## Phase Structure

### Phase 1 — Foundation (Weeks 1–2)
*May 19 – May 29*

Establish the conditions for safe, approvable delivery.

- Onboarding and environment setup
- Full codebase audit and defect cataloguing (R1 findings validation)
- Architecture documentation produced and delivered (R4)
- Initial Playwright test scaffold established against existing application (R3 — baseline)

**Milestone 1:** Architecture documentation accepted by Meridian IT. Test scaffold running in CI.

---

### Phase 2 — Reports Remediation (Weeks 3–4)
*June 1 – June 12*

Resolve all confirmed defects in the Reports module.

- Refactor Reports.vue to Composition API
- Migrate API calls to centralized `api.js` pattern
- Implement global filter integration
- Remove diagnostic instrumentation
- Standardize numeric and currency formatting
- Synchronize English/Japanese locale files

**Milestone 2:** All six defects resolved. Reports module accepted by Meridian operations team. Playwright test coverage extended to Reports flows.

---

### Phase 3 — Restocking Recommendations (Weeks 5–7)
*June 15 – July 3*

Design, build, and validate the net-new Restocking capability. Phase compressed to three weeks by running backend and frontend development in parallel workstreams.

- Week 5: Backend endpoint (`GET /api/restocking`) — filtering, ranking, budget-cap logic; frontend scaffolding begins in parallel
- Week 6: Frontend view (`Restocking.vue`) — budget input, recommendations table, budget utilization indicator; backend integration complete
- Week 7: Integration testing, edge case validation, and stakeholder review with Meridian operations team

**Milestone 3:** Restocking view accepted by R. Tanaka / operations team by **July 3, 2026**. Playwright test coverage extended to Restocking flows.

---

### Phase 4 — Hardening & Handoff (Weeks 8–9)
*July 6 – July 17*

Finalize test suite, documentation, and knowledge transfer.

- Full Playwright test suite review and gap closure
- Final architecture documentation update to reflect delivered state
- Code review and cleanup pass
- Handoff session with Meridian IT
- Delivery of all source assets and documentation

**Milestone 4 (Final):** All deliverables accepted by **July 17, 2026** — seven days ahead of the early-completion bonus deadline.

---

### Stretch Items (Parallel / Post-Handoff)
*D1–D3 — subject to scope confirmation*

The one-week buffer between our projected completion (July 17) and the bonus deadline (July 24) may be applied to desired items if Meridian elects to authorize them:

| Item | Estimated Effort | Suggested Window |
|---|---|---|
| D2 — Internationalization expansion | 2–3 business days | Week 7 (parallel to R2 iteration) |
| D1 — UI modernization | 3–5 business days | Post-Phase 4 extension |
| D3 — Dark mode | 2–3 business days | Post-Phase 4 extension |

---

## Summary

| Phase | Weeks | Key Deliverable | Target Date |
|---|---|---|---|
| 1 — Foundation | 1–2 | Architecture docs, test scaffold | May 29 |
| 2 — Reports Remediation | 3–4 | Fully remediated Reports module | June 12 |
| 3 — Restocking Feature | 5–7 | Restocking recommendations view | July 3 |
| 4 — Hardening & Handoff | 8–9 | Complete test suite, IT handoff | **July 17** |
| Stretch (D1–D3) | As authorized | UI, i18n, dark mode | July 17–24 |

All required deliverables (R1–R4) are targeted for acceptance by **July 17, 2026** — one full week ahead of the early-completion bonus deadline of July 24, 2026.
