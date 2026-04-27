# Executive Summary

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**
**Submitted by:** Accenture
**Date:** April 28, 2026

---

Meridian Components operates a mission-critical inventory dashboard across three warehouses. The platform was left in an incomplete state by the previous vendor — with known defects in the Reports module, no automated test coverage, and a Restocking capability that your operations team has been waiting on. The result: your IT team cannot safely approve changes, your Tokyo staff works in English-only views, and R. Tanaka's team is managing purchase decisions without the tool support they need.

We have reviewed the RFP, the vendor handoff notes, and the existing codebase. Our assessment is that the platform has a sound foundation (Vue 3 + FastAPI, clean data model) and that all four required items are achievable within a 10-week engagement.

**Our proposed approach:**

- **Unblock IT first (R3).** Automated browser test coverage is the prerequisite for everything else. We will establish this in Week 1–2 so that every subsequent change ships with confidence.
- **Remediate Reports (R1).** We have identified the filter wiring gaps and i18n omissions in the existing code. We will resolve all known defects and document what we fixed.
- **Deliver Restocking (R2).** A new view that combines current stock levels, existing demand data, and an operator-supplied budget ceiling to generate prioritized purchase order recommendations — no new infrastructure required.
- **Document the architecture (R4).** A current-state overview suitable for handoff to Meridian IT, delivered as part of onboarding.

We propose a **fixed-fee engagement of €62,000**, covering all required items (R1–R4) plus dark mode (D3) as an included bonus deliverable. UI modernization (D1) and full i18n extension (D2) are available as optional add-ons.

Timeline confidence is our differentiator. We will not over-commit and under-deliver.

---

*Primary contact: Benedetta Aversano, Engagement Lead — benedetta.aversano@accenture.com*
