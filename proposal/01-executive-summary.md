# Executive Summary

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
*Submitted by: adesso SE | Date: April 28, 2026*

---

Meridian Components has a working foundation — a Vue/Python dashboard that covers core inventory, orders, and spending views — but it carries forward unresolved defects, no test safety net, and missing capabilities that your operations team has been waiting for. The previous vendor left the Reports module incomplete, delivered no automated tests, and produced minimal documentation. Your IT team is right to be cautious about approving changes under those conditions.

We propose to close that gap in a structured, low-risk engagement:

1. **Stabilize first.** Before building anything new, we will audit and remediate all known and discovered defects in the Reports module (R1). A broken baseline makes every subsequent change riskier — this is our starting point, not a parallel workstream.

2. **Document what exists.** Immediately after stabilization, we will produce a current-state architecture overview (R4) suitable for handoff to Meridian IT. This locks in the knowledge gained during remediation and ensures institutional context does not leave with the vendor.

3. **Unlock change safely.** With a clean, documented baseline in place, we will establish end-to-end browser test coverage across the critical user flows (R3). This is the condition Meridian IT needs before they can approve ongoing changes, and it protects Meridian after we're gone.

4. **Deliver the capability your operations team needs.** The Restocking view (R2) is VP Operations R. Tanaka's primary ask. We will build it to surface purchase-order recommendations based on live stock levels, demand forecasts, and an operator-supplied budget ceiling — practical tooling for daily warehouse decisions.

We are proposing a **fixed-fee engagement** to give Director Okafor the price predictability this type of modernization work calls for. Our timeline targets an eight-week delivery with phased milestones so Meridian sees working software early, not just at the end.

The desired items (UI refresh, full i18n, dark mode) are scoped and priced as optional extensions that can be activated within the same engagement if priorities allow.

---

*adesso SE brings deep Vue 3 and Python FastAPI expertise and a track record of stabilizing and extending systems delivered by prior vendors. We have reviewed the existing codebase and the previous vendor's handoff notes as part of preparing this response.*
