# Technical Approach

**RE: RFP MC-2026-0417 — Inventory Dashboard Modernization**

This section describes how we will address each item in RFP §3, in the sequence we propose, along with the assumptions underlying that sequence.

## Sequencing

We propose five phases:

1. **Discovery & Architecture Review** — independently verify the current system before pricing or building against it
2. **Stabilize** — Reports remediation (R1), built alongside the first automated test coverage (R3)
3. **Build** — Restocking recommendations (R2)
4. **Document & Handoff** — finalize architecture documentation (R4) for Meridian IT
5. **Enhance** *(contingent, Phase 5)* — UI redesign (D1), extended i18n (D2), dark mode (D3)

R3 is listed third in the RFP's priority order, but we treat automated testing as groundwork rather than a late-stage deliverable. IT has stated that the lack of test coverage is why changes haven't been approved — so the first tests we write should validate the Reports fixes in Phase 2, giving Meridian a working example of the safety net before we build the larger Restocking feature on top of it in Phase 3.

## R4 — Architecture Review & Documentation

We start here deliberately. The previous vendor's handoff notes are limited — they describe the stack and API surface but not why the Options-API migration stalled, which Reports filters are actually broken, or how the current system behaves under real data volumes. Rather than plan Phases 2–4 against those notes at face value, we will trace the system directly: how data moves from `client/src/api.js` through the FastAPI backend to the JSON-backed data layer, which views still use older patterns, and where the Reports module's wiring actually breaks.

The current-state architecture document (format at our discretion, per RFP) is a byproduct of this review, not a separate effort scheduled at the end. Producing it early also means our Phase 2–3 estimates are built on verified fact rather than the previous vendor's account of their own work.

## R1 — Reports Module Remediation

Meridian's team has logged eight or more distinct issues — filter behavior, internationalization gaps, inconsistent data patterns. We will triage and root-cause each individually rather than patch symptoms. The handoff notes indicate Reports was mid-migration from the Options API to the Composition API when the previous engagement ended; where that incomplete migration is the underlying cause of a defect, we'll finish the migration rather than work around it, so the fix holds up rather than recurring in a different form later.

Each resolved defect gets a corresponding automated test as part of Phase 2 — this is where R1 and R3 begin to overlap by design.

## R3 — Automated Browser Testing

The RFP doesn't specify which user flows count as "critical." We propose to define that list ourselves, risk-ranked, following the architecture review — most likely starting with Reports and Restocking as the highest-change, highest-consequence surfaces, then expanding coverage outward. We'll share this list with Meridian before Phase 2 begins so it can be adjusted if operations or IT sees it differently.

Our coverage philosophy: tests should validate real behavior at the edges — filter combinations, empty states, locale switching — not just confirm that a page loads. That distinction matters here specifically because IT's actual concern is regression risk, not test count.

## R2 — Restocking Recommendations

This is the engagement's centerpiece and the feature R. Tanaka's operations team asked for directly. The view will take three inputs — current stock levels, demand forecast, and an operator-supplied budget ceiling — and produce purchase order recommendations the team can act on, rather than raw numbers they have to interpret themselves.

We will design explicitly for the conditions that break naive implementations, not just the happy path:

- Zero or negative available stock for a given SKU
- A budget ceiling too small to cover any supplier's minimum order quantity
- Conflicting demand signals across San Francisco, London, and Tokyo, each with different lead times
- Supplier minimum order quantities that don't divide evenly into the available budget

The RFP does not state expected data volume (SKU count, order throughput), and we're not assuming one — see Open Questions, below. The recommendation logic will be built to scale gracefully rather than hard-coded against a guessed catalog size, and we'll confirm actual volume during Discovery.

## D1–D3 — Desired Items (Phase 5, contingent on confirmed scope)

- **D1 (UI modernization):** We're scoping this as a full visual redesign — new component treatment, layout, and styling — rather than a light cleanup, and treating it as its own phase rather than folding it into R1's fixes.
- **D2 (Internationalization):** Extends the i18n patterns established while resolving R1's i18n defects to the remaining modules, directly addressing the Tokyo team's English-only views.
- **D3 (Dark mode):** Operator-selectable theme for low-light warehouse floor stations.

These are priced and scheduled after required scope (R1–R4) is delivered and confirmed, consistent with our phased fixed-fee structure — Meridian isn't committing budget to Phase 5 before seeing Phases 1–4 land.

## Assumptions

For transparency, this proposal is built on the following assumptions, made in the absence of explicit direction in the RFP:

1. **D1 scope** — a full UI redesign, not a minimal refresh
2. **Pricing structure** — phased fixed-fee, priced phase by phase rather than as one lump sum
3. **R3 critical flows** — proposed by us post-discovery, subject to Meridian's confirmation
4. **R2 data scale** — not assumed; flagged as an open question (below) and resolved during Discovery

## Open Questions for Meridian

- Expected SKU count and order volume across the three warehouses, to right-size the Restocking engine's design
- Confirmation (or adjustment) of the critical-flow list once we propose it after the architecture review
