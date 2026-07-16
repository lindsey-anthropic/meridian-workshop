# Technical Approach

**RFP #MC-2026-0417 — Meridian Components**
**Submitted by:** Capgemini

---

## Our Starting Point

Before writing this proposal, we reviewed the application source code and the previous vendor's handoff notes. The stack (Vue 3 + FastAPI + JSON data files) is appropriate for the current scale and requires no rearchitecting. The problems are specific: the Reports module was left in an incomplete state, no tests were delivered, and the Restocking feature was never started. Our approach addresses each requirement in Meridian's stated priority order.

---

## R1 — Reports Module Remediation

We will perform a full audit of the Reports page against the rest of the codebase to identify every defect. Based on our pre-proposal review, known issues include:

- **Filter wiring:** The Reports view does not respond to the global filter bar (warehouse, category, time period). Other views do. We will wire Reports to the shared filter composable so it behaves consistently.
- **API pattern inconsistency:** The Reports view makes direct HTTP calls with hardcoded URLs rather than using the centralized `api.js` layer. We will refactor to match the established pattern.
- **Code style inconsistency:** Reports uses the older Vue 2-style Options API while all other views use Vue 3 Composition API. We will migrate it to match.
- **Internationalization gaps:** String literals are hardcoded in English. We will extract all user-facing strings into the i18n system already in place, ensuring Tokyo-based staff see translated content.
- **Console noise:** Excessive debug logging fires on every render, including inside computed properties called repeatedly by the template. We will remove it.

We will fix all defects found, not only those listed above. The deliverable is a Reports module that behaves consistently with every other view in the application.

---

## R2 — Restocking Recommendations

We will deliver a new Restocking view that gives operations staff actionable purchase order recommendations based on current stock levels and demand.

**Logic:** Items at or below their reorder point are surfaced as candidates. For each, the system recommends a purchase quantity sufficient to bring stock to twice the reorder point — a standard safety-stock buffer. Items are ranked by urgency: how far below reorder point they are as a proportion of that threshold.

**Budget ceiling:** Operators can enter a budget limit. The system will include recommendations in urgency order until the budget is exhausted, giving staff a ready-to-act list within their spend authority.

**Filter integration:** The Restocking view will respond to the global warehouse and category filters, allowing London or Tokyo staff to see only their relevant items.

**Assumptions:** Demand data comes from the existing forecast model already in the system. Supplier pricing is the unit cost on record. We are not integrating with external procurement systems in this engagement — that is a natural next phase.

---

## R3 — Automated Browser Testing

The absence of test coverage is the single largest operational risk in the current codebase: it is why Meridian's IT team cannot safely approve changes. We will establish automated end-to-end test coverage using Playwright, targeting the critical user flows across all views.

**Coverage targets:**
- Dashboard loads and displays summary data
- Inventory filtering by warehouse and category returns correct results
- Orders list filters by status and time period
- Reports page renders quarterly and monthly data correctly
- Restocking recommendations appear and respond to budget input
- Global filter bar state propagates correctly across views

Tests will be written to run against the live application and will be committed alongside the code so any future change can be verified with a single command. We will also deliver the backend API test suite currently missing from the repository.

---

## R4 — Architecture Documentation

We will produce a current-state architecture overview in a format suitable for handoff to Meridian IT. The document will cover: system topology, technology stack and versions, API endpoint inventory with parameters, data flow from filter selection through to rendered output, known gaps and recommended next steps, and instructions for running and maintaining the system locally.

This document will be generated from the actual codebase — not written from memory — and will be verified for accuracy before delivery.

---

## Desired Items (D1–D3)

We have scoped the required items above as the core engagement. If timeline and budget allow, we are prepared to extend into:

- **D1 — UI modernization:** The current design system is coherent but dated. A visual refresh can be delivered as a parallel workstream without disrupting the functional work.
- **D2 — Internationalization:** The i18n infrastructure is already in place for English and Japanese. Extending coverage to remaining views is straightforward once string extraction is complete under R1.
- **D3 — Dark mode:** Operator-selectable theming using CSS custom properties. We recommend prototyping this on an isolated branch to avoid risk to the stable main codebase.

We will confirm scope for these items at project kickoff based on final budget and timeline agreement.

---

## Assumptions

1. The application runs locally; no cloud deployment is in scope.
2. The JSON data files are the source of record; no database migration is required.
3. Meridian IT will provide a single point of contact for test environment access.
4. The previous vendor's handoff notes are complete enough for our purposes — gaps discovered during the engagement will be escalated promptly.
5. Supplier pricing data for the Restocking feature uses unit costs already recorded in the inventory system.
