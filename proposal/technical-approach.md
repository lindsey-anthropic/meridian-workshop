# Technical Approach

**RFP MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

Our approach is remediation-first, then extension. We begin by establishing a clear picture of what the previous vendor built — through our own architecture review — then work through the required items in Meridian's stated priority order. We do not extend a system we do not fully understand. Every deliverable is designed to leave the codebase in better shape than we found it: documented, tested, and maintainable without ongoing vendor involvement.

---

## R4 — Architecture Review

We will conduct an independent assessment of the existing Vue 3 + FastAPI codebase before any other work begins. The previous vendor's handoff documentation covers the stack at a high level but is missing detail on component structure, API contracts, data flow, and any divergence between documentation and actual implementation. We treat the code as the source of truth.

Our assessment will cover:
- **Frontend structure:** Vue 3 component hierarchy, routing, state management, API client patterns, and any inconsistencies between Composition API and Options API usage (the handoff notes indicate an incomplete migration)
- **Backend API design:** FastAPI endpoint inventory, filter parameter handling, Pydantic model definitions, and any undocumented endpoints or behaviors
- **Data layer:** Current JSON file structure, how data is loaded and filtered in memory, and capacity to support new features like restocking recommendations
- **Integration points:** How the frontend and backend communicate, including any hardcoded assumptions or fragile patterns

The output will be a current-state architecture overview delivered as an HTML diagram, suitable for handoff to Meridian IT. It will be produced at the start of the engagement and updated if our later work changes anything material.

*Assumption: the previous vendor's handoff notes are a starting point, not a complete picture. Our assessment may surface gaps or undocumented behaviors.*

---

## R1 — Reports Module Remediation

No defect log was provided, so we will conduct our own structured audit of the Reports module before writing any fix code. We will document every issue we find — including filter wiring gaps (filters not correctly applying to API queries), i18n coverage holes (untranslated strings, locale-specific formatting), data inconsistencies (mismatched field names or types between frontend and API), console noise (unhandled errors or warnings), and API pattern deviations (endpoints called differently from the rest of the application). That list becomes our R1 baseline, shared with Meridian before we begin fixing.

Our remediation process:
1. Reproduce each defect in the live application and document the expected vs. actual behavior
2. Trace the root cause through the data flow: Vue component → API client → FastAPI endpoint → in-memory filter → response
3. Implement the fix at the correct layer (not just masking symptoms at the component level)
4. Verify the fix in-browser against the original reproduction case
5. Check for regressions in adjacent views that share the same API endpoints or filter logic

We will not close an issue until it is verified in-browser. Code review alone is not sufficient for user-facing defects.

*Assumption: our audit findings become the authoritative defect list. If Meridian's team identifies additional issues after we share our baseline, we will assess them — items clearly within the Reports module scope will be included; anything broader will be handled via change request.*

---

## R2 — Restocking Recommendations

This is the largest net-new capability in the engagement. We will deliver a new Restocking view within the existing Vue 3 frontend, integrated with new backend logic that combines three inputs to generate purchase order recommendations: current stock levels, historical demand data, and an operator-supplied budget ceiling. The restocking logic will work against the existing JSON data layer; a full database migration is available as a separate optional item (D4) if Meridian wants to invest in that foundation.

**Backend — new API endpoints.** We will add the following to the FastAPI backend:
- `GET /api/restocking` — returns ranked purchase order recommendations given current stock, demand history, and a budget ceiling passed as a query parameter
- The restocking logic will calculate reorder quantity based on demand rate, current stock deficit, and unit cost, then rank recommendations by priority (most critical shortfalls first) within the budget ceiling

**Frontend — Restocking view.** The new view will follow the patterns established in the existing dashboard:
- A budget ceiling input (operator-supplied, persists for the session)
- A ranked list of recommended purchase orders: item, warehouse, recommended quantity, estimated cost, and demand trend
- Warehouse and category filters consistent with the rest of the application
- Clear indication when the total recommended spend approaches or exceeds the budget ceiling

We will propose the view layout to Meridian's operations team before building the frontend, to ensure it matches how R. Tanaka's team actually thinks about restocking decisions.

*Assumption: historical demand data exists in the current JSON files and is sufficient to calculate meaningful demand rates. If the data is sparse or incomplete, we will flag this during the architecture review and agree on a fallback approach (e.g., operator-supplied demand estimates) before building.*

---

## R3 — Automated Browser Testing

We will establish end-to-end browser test coverage using Playwright, a modern testing framework that drives a real browser and produces results Meridian IT can run and interpret without vendor involvement. Tests will be written in a way that is readable and maintainable — not just passing green on day one.

Test scope will focus on the two highest-risk areas:

**Reports module** — given the known defects and our remediation work, we will write tests that cover:
- Each filter (Time Period, Warehouse, Category, Order Status) applied individually and in combination
- Correct data displayed for each warehouse
- i18n rendering (correct locale applied)
- No console errors under normal operation

**Restocking view** — as a net-new feature with no prior coverage:
- Budget ceiling input accepted and applied correctly
- Recommendations rendered and ranked correctly
- Warehouse and category filters working
- Behavior at edge cases (zero budget, all items in stock, single warehouse selected)

We will document the test setup and run instructions as part of the R4 architecture handoff, so Meridian IT can run the suite independently as part of their change approval process.

*Assumption: "critical flows" as referenced in the RFP maps to the Reports module and Restocking view. If Meridian IT identifies additional flows after delivery, we will assess and handle via change request.*

---

## D1–D4 — Optional Enhancements

The following items are separately priced and do not affect the R1–R4 delivery timeline. Meridian may choose to include any or all of them without impacting core delivery.

**D1 — UI Modernization.** A visual refresh of the dashboard aligned to a clean, modern design direction. No brand guide was provided; we will propose a direction consistent with the existing slate/gray palette and share mockups for Meridian's review before any implementation. The refresh will focus on typography, spacing, component consistency, and chart readability — not a full redesign.

**D2 — Internationalization.** Extended i18n support for the Tokyo warehouse team, who currently work in English-only views. We will audit existing i18n coverage across all modules, identify untranslated strings and locale-specific gaps (date formats, number formats, currency), and extend coverage to remaining views. Japanese translations will be provided by Meridian or sourced via a translation service — we will flag any strings that require client input.

**D3 — Dark Mode.** An operator-selectable theme for warehouse floor stations operating in low-light environments. Implemented as a toggle in the application header, with the selected theme persisting per user session via local storage. Dark mode will be built using CSS custom properties, making it maintainable without duplicating component logic.

**D4 — Database Migration.** Migration of the existing JSON data layer to a structured database (SQLite — no additional infrastructure required). The migration will be scripted and repeatable; existing data will not be lost. Recommended if Meridian anticipates growth in data volume or wants a more robust foundation for future reporting and analytics capabilities.

---

## What we leave behind

At engagement close, Meridian will have: a documented architecture they can hand to any future vendor or internal team; a test suite they can run themselves; and a codebase with consistent patterns throughout. Our measure of success is that Meridian does not need us to make the next change.
