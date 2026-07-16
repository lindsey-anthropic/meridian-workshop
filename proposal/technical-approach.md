# Technical Approach

**RFP #MC-2026-0417 — Meridian Components, Inc.**

This section addresses each item in RFP §3 (Scope of Work), in Meridian's stated priority order, along with the assumptions underlying our approach.

## R1 — Reports Module Remediation

We will begin with an independent audit of the Reports page against the current codebase, covering the defects your team has logged around filter behavior, internationalization, and data handling. Rather than patching each issue individually, we'll group them by root cause so the fixes hold up over time. Each resolved defect will be verified against the automated test suite delivered under R3, so the module stays fixed as future changes are made.

## R2 — Restocking Recommendations

This is a new capability and the most significant build in the engagement. The Restocking view will recommend purchase orders based on three inputs: current stock levels, demand forecast, and an operator-supplied budget ceiling. Before finalizing the recommendation logic, we will hold a short discovery session with your operations team to understand how restocking decisions are made today, so the tool reflects real operational judgment rather than a generic reorder-point formula.

## R3 — Automated Browser Testing

We will establish automated end-to-end test coverage so your IT team can approve future changes with confidence. Initial coverage will focus on the Reports module and the new Restocking view, along with the shared filter system both rely on — the areas of highest change and historical risk. This gives your team a solid, verifiable foundation to build on.

## R4 — Architecture Documentation

As part of our onboarding, we will perform a full architecture review of the current system and deliver a current-state overview suitable for your IT team's ongoing reference and any future vendor transitions.

## Desired Items (D1–D3)

Based on our discussion with your team, UI modernization (D1) is out of scope for this phase. Internationalization (D2) and dark mode (D3) are candidate additions we can pursue within the engagement's budget if time allows once the required items above are complete.

## Assumptions

- Pricing structure: time-and-materials with a not-to-exceed cap.
- Automated test coverage (R3) will focus on the Reports module, Restocking view, and shared filter system.
- D1 is deferred for this phase; D2 and D3 are considered only if capacity allows.
