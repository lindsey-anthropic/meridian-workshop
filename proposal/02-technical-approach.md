# Technical Approach

## Response to RFP #MC-2026-0417 — Technical Approach

This document describes how we will address each requirement listed in Section 3 of the RFP, divided into mandatory requirements (R1–R4) and desired items (D1–D3).

---

## Mandatory Requirements

### R1 — Reports Module Remediation

Today the Reports module operates in isolation from the rest of the dashboard: when an operator selects a warehouse or a category in the global filters, the reports do not update. This means the team cannot obtain reports targeted to a single site — a concrete limitation for a team managing three warehouses with different dynamics.

Our intervention will restore the Reports module to the same operational consistency as the other views: working filters, data contextual to the selected warehouse, and full readability for the Tokyo team thanks to integration with the existing multi-language system.

We will also align the module with the architectural conventions used in the rest of the application. This is not a cosmetic exercise: a codebase with uniform patterns is simpler to maintain, reduces the risk of regressions, and lowers the cost of every future intervention — both yours and that of any future vendor.

### R2 — Restocking View

Today the Operations team manually compares stock levels and demand forecasts to decide what to reorder — a process that takes time, is error-prone, and does not systematically account for budget constraints.

The new Restocking view will automate this process. The operator will indicate a spending ceiling and the system will generate optimized purchase recommendations based on:

- **Current stock** versus reorder thresholds
- **Demand forecasts** to anticipate needs
- **Available budget** to ensure proposals are immediately actionable

The result will be a list of suggested orders, sorted by priority, that the operator can approve, modify, or discard. Prioritization rules and thresholds will be agreed with the Operations team during kick-off, so the system reflects Meridian's actual operational logic — not generic assumptions.

The value is direct: faster purchasing decisions, fewer stockouts, and immediate visibility into how the budget is allocated.

### R3 — Automated Browser Testing

The absence of automated tests is today the main brake on the system's evolution: the IT team, understandably, will not approve modifications that cannot be reliably validated. Every intervention — even small — becomes a risk.

We will introduce an end-to-end test suite covering the priority operational flows: Inventory, Orders, Spending, and Demand Forecast. The tests will simulate what an operator does daily — navigating between views, applying filters, drilling into details — and verify that everything works as expected.

The value for Meridian is twofold. In the short term: the IT team will have the safety net required to unblock the interventions of this engagement. In the long term: every future modification, by anyone, can be automatically validated before going to production. It is an investment in the system's maintainability.

### R4 — Architecture Documentation

One of the issues that emerged from the closure with the previous vendor is the scarcity of handoff documentation. This made the system opaque to the IT team and increased dependency on external skills.

We will produce clear, navigable architecture documentation — including an interactive diagram — that allows Meridian's IT team to autonomously understand how the system is built: which components exist, how they communicate, where data resides, what conventions to follow.

The goal is not just to document the current state, but to ensure Meridian never again finds itself in a position of depending on a single supplier to understand its own system.

---

## Desired Items

### D1 — UI Modernization

The current interface is functional but not homogeneous across views. A coherent visual refresh will improve the daily experience of operators — who use the dashboard for hours — and reinforce the perception of the tool as reliable.

We will work on Meridian's existing visual identity, without disruption: greater coherence between views, better readability of tables and charts, adaptation to the different resolutions of workstations. The goal is a dashboard that operators perceive as a single professional tool, not a collection of pages assembled at different times.

### D2 — Complete Internationalization

The Tokyo team (~12 people) currently works entirely in English. The multi-language system already exists partially, but does not cover all modules.

We will extend coverage to every view — labels, messages, formatting of numbers, currencies, and dates — so the Japanese team can operate in their own language. It is an intervention with a direct impact on productivity and on the reduction of operational errors for a site that serves the entire APAC market.

### D3 — Dark Mode

Several warehouse-floor stations operate in low-light environments. A dark theme selectable by the operator reduces visual fatigue and improves readability in these conditions. The theme will be persistent and configurable per workstation, with contrast levels conformant to accessibility standards.

---

## Assumptions

1. Access to Meridian's staging/production environments and to operational contacts (Operations, IT, Tokyo site) will be available within the first week of the engagement.
2. Reorder thresholds and prioritization rules for R2 will be defined with the Operations team within the first week, before development starts.
3. In the absence of specific guidance in the RFP, we propose as critical flows for R3: Inventory, Orders, Spending, and Demand Forecast. The list will be reconfirmed with Meridian's IT team at kick-off.
4. Migration of the data layer (JSON → database) is not in scope for this engagement.
5. Desired items (D1–D3) will be executed sequentially after completion of the mandatory requirements.
