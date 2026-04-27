# Executive Summary

**RFP:** MC-2026-0417 — Inventory Dashboard Modernization
**Prepared for:** J. Okafor, Director of Procurement, Meridian Components, Inc.
**Date:** April 27, 2026

---

## Our understanding

Meridian's inventory dashboard is the operational backbone for a distribution business spanning three continents. It works — but it has been stalled. The previous engagement ended with a Reports module half-finished, no automated tests, and documentation thin enough that any future change carries unknown risk. That risk is why IT has paused new work, and why the operations team in San Francisco, London, and Tokyo is waiting on capabilities they have already asked for.

The work in this RFP is not a rebuild. It is a stabilization-and-extension engagement, prioritized in the order that unblocks the people using the system every day:

- **Reports needs to become trustworthy** before anyone uses it for decisions (R1).
- **Restocking is the capability VP Operations has asked for** and the highest-leverage addition to the dashboard (R2).
- **Automated tests are the precondition** that lets IT approve everything else, now and going forward (R3).
- **Architecture documentation closes the knowledge gap** the previous vendor left behind (R4).

The desired items (UI cleanup, broader i18n, dark mode) are quality-of-life improvements that we believe are achievable within the same engagement when sequenced correctly behind the required scope.

## Our proposed approach

We propose a **four-phase, twelve-week engagement** delivered by a small senior team:

1. **Discovery & test harness (Weeks 1–2).** Architecture review (R4) and a Playwright-based test scaffold (R3 foundation) come first. These two deliverables protect every change that follows and give Meridian IT visibility into the engagement from day one.
2. **Reports remediation (Weeks 3–5).** Audit, itemize, and fix the defects in the Reports module (R1). Each fix lands behind a regression test.
3. **Restocking capability (Weeks 5–9).** Build the Restocking view (R2) as a first-class module — recommendations driven by stock levels, demand forecast, and operator-supplied budget ceiling.
4. **Hardening & desired items (Weeks 9–12).** Complete browser test coverage of critical flows (R3), plus the desired items in priority order: i18n extension for Tokyo (D2), UI cleanup (D1), and dark mode (D3).

We will work in short, reviewable increments against `main`, with each requirement closing on a demo to R. Tanaka's team and a documentation update for IT.

## Engagement model

**Time-and-materials with a not-to-exceed cap**, structured to give Meridian price predictability without forcing premature estimation on a codebase whose defect surface is partly unknown. A discovery checkpoint at the end of Week 2 is the moment to confirm or adjust scope before Phase 2 begins.

## Why us

Our team has delivered comparable Vue/Python remediations and greenfield operations modules on similar timelines. We are deliberately small and senior — no offshore handoff, no junior pyramid. References available on request.

We look forward to discussing this proposal with the buying committee.
