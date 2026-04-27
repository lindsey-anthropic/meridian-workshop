# Executive Summary

## Response to RFP #MC-2026-0417 — Inventory Dashboard Modernization

Meridian Components operates an inventory management system built on Vue 3 and Python FastAPI, covering three globally distributed warehouses. The system, delivered by a previous vendor in 2024, is functional but presents unresolved defects in the Reports module, lacks automated test coverage — a condition that has led the IT team to halt all evolution — and is missing key capabilities requested by the Operations team, in particular the ability to generate restocking recommendations grounded in real data.

**Our approach** starts from a simple premise: before building anything new, we must stabilize what exists. A preliminary review of the code suggests concrete areas of intervention in the Reports module — global filter coherence, i18n coverage, alignment with the architectural patterns of the rest of the application, and cleanup of residual diagnostic noise. These are solvable problems, but they require a systematic approach.

We propose a three-phase engagement:

1. **Stabilization** — Complete remediation of the Reports module, alignment with the architectural patterns of the rest of the application, and introduction of automated E2E tests on critical flows (Inventory, Orders, Spending, Demand Forecast). This unblocks the IT team and creates the safety net for all subsequent evolution.

2. **Evolution** — Development of the Restocking view with purchase recommendations based on stock levels, demand forecasts, and operational budget. Delivery of architecture documentation for handoff to Meridian's IT team.

3. **Modernization** — UI refresh respecting Meridian's brand identity, extension of i18n to all modules for the Tokyo team, and introduction of dark mode for stations operating in low-light environments.

This order is intentional: each phase produces autonomous value and reduces the risk of the next. Phase 1's test coverage protects Phase 2's interventions. Phase 2's documentation informs Phase 3's choices.

We have reviewed the material provided with the RFP — source code and the previous vendor's handoff notes — as part of preparing this proposal. We will not start from scratch: we begin with an initial understanding of the architecture, patterns, and areas of technical debt, to be deepened in the first days of the engagement.
