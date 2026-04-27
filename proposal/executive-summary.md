# Executive Summary
**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted to:** J. Okafor, Director of Procurement, Meridian Components, Inc.
**Submitted by:** [Your Firm Name]
**Date:** May 8, 2026

---

Meridian Components has a working inventory dashboard and a team that depends on it daily. The necessity is not to replace the foundation — it is to complete the unfinished work the previous vendor left behind: a Reports module with known defects, no automated test coverage blocking IT from approving changes, a Tokyo warehouse team working in English-only views, and no documentation of what was actually built.

We have reviewed the source code and the previous vendor's handoff notes as part of preparing this response. That review confirmed the RFP's characterization: the Reports module has multiple concrete defects including disconnected filters, hardcoded English strings, and API patterns inconsistent with the rest of the application. We have identified eight specific issues. None are architectural — all are remediable.

Our proposed engagement addresses Meridian's requirements in priority order:

- **Reports remediation (R1):** Audit and resolve all defects in the Reports module, including filter wiring, internationalization, and code consistency with the rest of the application.
- **Restocking recommendations (R2):** Deliver a new Restocking view that gives R. Tanaka's operations team purchase order recommendations based on current stock, demand forecasts, and an operator-supplied budget ceiling.
- **Automated browser testing (R3):** Establish end-to-end test coverage for the critical user flow — from dashboard through inventory, orders, and reports — so IT has a repeatable baseline for approving future changes.
- **Architecture documentation (R4):** Deliver a current-state architecture overview suitable for handoff to Meridian IT, based on direct code review rather than the previous vendor's incomplete notes.

We propose a phased fixed-fee structure, with each phase scoped and priced independently so Meridian can approve work incrementally. Desired items (UI modernization, full i18n, dark mode) are included as optional phases, with D1 contingent on receipt of Meridian's brand guidelines by the start of that phase.

R. Tanaka's team should not have to work around a broken Reports page. Meridian IT should not have to block changes for lack of test coverage. Our goal for this engagement is to address both client requests and the codebase in a state the next team — internal or external — can actually maintain.

We are ready to begin upon contract execution.
