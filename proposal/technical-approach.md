# Technical Approach

Our approach is incremental and additive: we work within the existing Vue 3 / FastAPI application rather than rewriting it, and we sequence delivery to match Meridian's stated priorities. Required items (R1–R4) are committed scope; desired items (D1–D3) are priced as options so they never put required delivery at risk.

## Onboarding: Architecture Review (R4)

Before fixing or building anything, we perform a current-state architecture review — not because R4 ranks last in the RFP, but because R1–R3 all depend on us actually understanding the system we inherited. This happens in week one. The output is a current-state architecture overview suitable for handoff to Meridian IT; format is at our discretion per the RFP, and we propose a single self-contained document Meridian's team can open without special tooling.

**Assumption:** no specific documentation format has been requested by IT beyond "suitable for handoff," so we choose the format.

## Reports Module Remediation (R1)

We audit the Reports module against the roughly eight issues Meridian's team has already logged — filter behavior, internationalization gaps, and inconsistent data patterns — plus whatever else surfaces during our architecture review. Fixes are made in place, following the application's existing filter → API → computed-property pattern already used successfully elsewhere in the dashboard, rather than introducing a new pattern just for Reports.

**Assumption:** fixes stay within the current architecture and data layer; no schema or infrastructure changes are required to resolve these defects.

## Restocking Recommendations (R2)

This is the largest build. We add a new Restocking view that takes three existing/near-existing inputs — current stock levels, demand forecast, and an operator-supplied budget ceiling — and surfaces recommended purchase orders. It's built additively: new API endpoint(s) alongside the existing ones, and a new view following the application's established patterns, rather than introducing a new framework or library to the stack.

**Assumption:** recommendation logic is rule/threshold-based (stock vs. demand vs. budget headroom), not a predictive or machine-learning model. We call this out explicitly so expectations are set correctly — this is a decision-support tool, not a forecasting engine.

## Automated Browser Testing (R3)

We establish end-to-end browser test coverage for the three flows where change is happening and where operations depend on correctness most: the core dashboard, the Reports module (post-remediation), and the new Restocking view. This is scoped intentionally, not as a silent cut — full-application coverage is not included in this phase. The goal is to give Meridian IT enough confidence in these specific flows to start approving changes again, which today they are not doing at all.

**Assumption:** "critical user flows" per RFP §3.1 means these three areas; broader coverage can be scoped as future work once this foundation is in place.

## UI Modernization (D1 — priced as option)

If selected, we refresh the visual design to a modern, clean SaaS baseline — no specific existing brand guide is assumed, so this is our design judgment applied consistently across the dashboard.

**Assumption:** "current standards" (RFP §3.2) means general modern dashboard conventions, not a specific Meridian brand kit.

## Internationalization (D2 — priced as option)

If selected, we extend the i18n pattern already partially present in the application (per the previous vendor's notes) to the remaining modules — directly addressing the English-only gap affecting the Tokyo warehouse team.

## Dark Mode (D3 — priced as option)

If selected, we add an operator-selectable theme toggle. The existing design token structure (documented by the previous vendor) makes this comparatively low-effort, and it directly serves the warehouse floor stations operating in low-light conditions.

---

Across all of this, our philosophy is the same: extend what works, fix what's broken, and don't rebuild what doesn't need rebuilding. Required scope is delivered as committed, fixed-fee work; desired scope is available if time and budget allow, priced separately so it's never a trade-off against the requirements Meridian has called mandatory.
