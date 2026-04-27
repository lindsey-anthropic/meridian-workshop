# Executive Summary

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Your Firm Name]
**Date:** May 8, 2026

---

Meridian Components has a working inventory system held back by three compounding problems: a Reports module with known defects that your team works around daily, no automated test coverage that has effectively frozen your IT team's ability to approve changes, and missing capabilities — most notably the Restocking view your operations team has been waiting for.

We have reviewed the source code and the previous vendor's handoff notes. The codebase is in reasonable shape: Vue 3 + Composition API on the frontend, Python FastAPI on the backend, data served from in-memory JSON files. The gaps are well-defined and scopeable. The challenge is not technical — it is sequencing and discipline.

**Our approach addresses the requirements in the order that unlocks the most value fastest:**

1. **Architecture review and documentation (R4, week 1).** Before touching any code, we produce a current-state overview for Meridian IT. This is our starting point and the prerequisite for accurate scoping of the Reports defects.

2. **Automated test coverage (R3, weeks 1–2).** Before modifying any existing behavior, we instrument the five critical user flows: inventory view, warehouse filtering, report generation, restocking recommendation, and cross-module navigation. This gives IT a safety net and gives us a verified baseline for every subsequent change.

3. **Reports remediation (R1, weeks 2–4).** Working from Meridian's logged defect list — unwired filters, i18n gaps, inconsistent data patterns — we resolve all known issues and verify against the test suite we just built.

4. **Restocking feature (R2, weeks 4–7).** We build the new view with purchase order recommendations driven by current stock levels, demand forecast, and an operator-supplied budget ceiling. We work on the existing JSON file layer with no additional database infrastructure, preserving the current operational footprint.

Where budget and timeline allow, we will address the desired items — UI modernization (D1), extended i18n for Tokyo staff (D2), and dark mode for low-light floor stations (D3) — in that priority order.

**Our working assumptions, stated explicitly:**
- Fixed-fee engagement with milestone-based payments; indicative budget $80–120K depending on D1–D3 scope
- "Current UI standards" interpreted as an incremental update on the existing palette (slate/gray), not a full rebrand
- "Critical flows" for R3: the five flows listed above, confirmed with Meridian IT at kick-off
- Reports defects will be audited in week 1 — the precise R1 scope is validated with Meridian before remediation begins
- No database migration in scope for this engagement

**Our commitment:** no scope surprises, no creep without a change order, and a working system your team can operate and your IT team can maintain.

---

*Full technical approach, timeline, and pricing follow in the sections below.*
