# Executive Summary
**RFP MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Firm Name]
**Date:** May 8, 2026

---

Meridian Components has built a distributed operation across three continents. The dashboard system supporting that daily work — stock management, orders, demand forecasting — is functional, but it is not living up to what your team needs. The Reports module is incomplete, there is no automated test coverage to protect future changes, and there is no dedicated restocking view that would allow operations to act proactively rather than reactively.

We reviewed the source code and handoff notes left by the previous vendor. The underlying system is structurally sound — Vue 3, FastAPI, well-organized data — but leaves critical work unfinished. This is not a rebuild; it is a project to complete and harden.

**Our proposal** addresses the four mandatory requirements in the priority order Meridian has specified:

1. **Reports remediation (R1):** Full audit and resolution of all known defects, including filter behavior, i18n gaps, and API pattern inconsistencies.
2. **Restocking recommendations (R2):** A new view enabling operators to generate purchase order recommendations based on current stock, demand forecasts, and a configurable budget ceiling.
3. **Automated browser testing (R3):** E2E coverage of critical user flows, giving Meridian IT the confidence to approve future changes without risk.
4. **Architecture documentation (R4):** A current-state overview delivered as a standalone artifact, ready to onboard any future team or vendor.

We estimate full delivery in **10 weeks**, with incremental milestones: R4 in week 2, R1 in week 4, R3 in week 6, R2 in week 10. Each milestone includes a review with the Meridian team before we proceed.

Our pricing is fixed-fee, within the budget range reflected in our assumptions, with no end-of-project surprises.

We are ready to start.
