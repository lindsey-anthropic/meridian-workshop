# Technical Approach

**In response to:** RFP #MC-2026-0417, §3 (Scope of Work) and §4.2 (Technical Approach)

---

Our technical method follows the **stabilize → finish → extend** spine introduced in our executive summary. We address every item in §3 below. Because Reports remediation (R1) is your top priority but depends on a safety net that does not yet exist, we establish that net first — automated tests (R3) and a current-state architecture picture (R4) — then finish Reports (R1) and build Restocking (R2) on top of it. Assumptions are stated inline and consolidated at the end.

---

## Foundation

### R3 — Automated browser testing

We will establish end-to-end browser test coverage using **Playwright**, exercising the full critical path through the application — dashboard load, filtering across all four filter dimensions (time period, warehouse, category, order status), the inventory, orders, and spending views, the remediated Reports page, and the new Restocking workflow. We assume "critical user flows" means this full operator path; we will confirm the exact list with IT during onboarding and adjust coverage accordingly. We deliver the suite as headless tests ready to run in continuous integration; where Meridian does not yet have a CI pipeline, we can help stand one up so the tests run automatically on every change.

This is the deliverable that unblocks everything else. Today your IT team withholds approval because there is no way to know whether a change breaks something — so nothing moves. A reliable regression suite removes that objection: changes can be verified automatically before they reach production. We deliver this first precisely so that every Reports fix and every new Restocking change that follows lands against a green test run, not a hope. This mirrors how we have unblocked prior inherited-codebase engagements: a regression net is the fastest way to convert a change-averse IT function into one that can approve confidently.

### R4 — Architecture documentation

We will perform our own architecture review of the delivered system — frontend (Vue 3), backend (FastAPI), the data layer, and the API contract between them — rather than relying on the previous vendor's handoff notes, which the RFP itself acknowledges are limited. The output is a current-state architecture overview suitable for handoff to Meridian IT: component map, data flow, API surface, and the known rough edges (for example, views still on older patterns that are mid-migration).

We treat this as live onboarding documentation, not a one-time artifact. Producing it early forces us to understand the system before we change it, surfaces risks before they become surprises, and leaves IT with something they can actually maintain against — directly addressing the documentation gap that contributed to the current situation. Reconstructing an accurate architecture picture from sparse or stale handoff notes is a routine first step in the rescue engagements we take on; we expect to do it efficiently here.

---

## Finish

### R1 — Reports module remediation

This is your top-priority item, and we approach it in two passes: **audit, then remediate.** In the audit pass we catalogue every defect in the Reports module — the eight-plus issues your team has already logged, plus anything our own review surfaces during scoping — and classify each by type (filter behavior, internationalization gaps, data/pattern inconsistencies) and severity. The previous vendor's own notes admit Reports was "in progress" with filters "not all wired up," so we expect the real defect set to be a superset of what is currently logged. We will share the catalogued list with your team before remediation begins, so there is a shared, agreed definition of "done" rather than a moving target.

In the remediation pass we fix each defect against the test net from R3 — every fix lands with a regression test that proves it stays fixed. We address the categories the RFP calls out directly: **filter behavior** (ensuring all filters are wired and apply consistently with the rest of the dashboard), **internationalization** (closing the i18n gaps so Reports renders correctly for all locales, which also de-risks the D2 desired item), and **data/pattern inconsistencies** (aligning Reports with the established API and reactivity patterns used elsewhere in the app, rather than leaving it as a divergent module). We commit to resolving the full set of defects our audit identifies — not a capped subset — and we hold that commitment under a not-to-exceed ceiling. The buyer benefit is explicit: **Meridian carries zero overrun risk on Reports remediation.** If the defect set turns out larger than the logged eight-plus, that is our cost to absorb, not a change order we send you. A complete fix at a price you can count on is precisely the outcome the previous vendor failed to deliver.

### R2 — Restocking recommendations

The Restocking view is the new capability your VP of Operations has asked for, and the highest-value piece of net-new work in this engagement. The feature answers a single operational question: *given what we have, what we expect to sell, and how much we can spend, what should we order?* Concretely, for each item it compares **current stock level** against **demand forecast over the supplier's lead time** — the window between placing a PO and stock actually arriving — and recommends an order quantity sized to cover projected demand across that window, not merely to top up to a static threshold. Critically, the view does more than flag items that are low: it flags items that will **stock out before a replenishment PO can realistically arrive**, surfacing the genuinely urgent shortfalls a simple reorder-point list would miss. It then fits those recommendations within an **operator-supplied budget ceiling**, prioritizing by urgency so that when the budget cannot cover everything, it is spent on the items closest to stocking out. The operator enters a budget, reviews a ranked list of suggested purchase orders with quantities and costs, and can see at a glance what the budget covers, what it leaves exposed, and which items are at imminent risk.

Our assumptions here, to be confirmed with operations during scoping: recommendations are advisory (the operator decides; we are not auto-placing orders), the budget ceiling is a single total rather than per-category, demand input comes from the existing demand/backlog data already in the system, and supplier lead time is sourced per supplier/item where that data exists, falling back to an operator-supplied value or a configurable default so the feature degrades gracefully when lead-time data is absent. We will build the view to the same Vue 3 + Composition API patterns as the rest of the modernized app, back it with a clear API endpoint, and cover the full workflow with the R3 test suite. Because this is the feature Operations will judge the whole engagement by, we will demo an early working version for feedback before considering it complete.

---

## Extend (Desired — §3.2)

We are ready to take on the desired-scope items and have structured the required work so they can be added without rework, scoped and priced separately once the required engagement is underway:

- **D1 — UI modernization.** We read "align with current standards" as adopting a maintainable **design system / component library** rather than a surface re-skin, giving Meridian a consistent, future-proof interface. We would confirm the target (brand alignment vs. a neutral modern system) with your team before committing.
- **D2 — Internationalization.** Extending i18n to the remaining modules so Tokyo staff are no longer English-only. Our R1 i18n work establishes the pattern this would follow.
- **D3 — Dark mode.** An operator-selectable theme for low-light warehouse stations, built cleanly on the design-system foundation from D1.

---

## Assumptions summary

The reasoning behind each assumption is given inline above; this table pins down the commitment and how it is managed.

| # | Commitment | How managed |
|---|------------|-------------|
| R1 | Resolve the full audited defect set, not a capped subset. | NTE ceiling; defect list agreed before remediation. |
| R2 | Advisory recommendations; single total budget; existing demand data; lead time per supplier/item where present, else operator-supplied or default. | Confirm with Operations during scoping. |
| R3 | Coverage = full operator critical path + Restocking. | Confirm exact flow list with IT at onboarding. |
| D1 | "Current standards" = maintainable design system, not a re-skin. | Confirm brand vs. neutral target with client. |
| — | T&M with not-to-exceed ceiling. | Buyer carries no overrun risk. |
