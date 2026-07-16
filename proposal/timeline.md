# Timeline

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

We propose four phases, sequenced to match the dependencies in our technical approach: the data layer comes first because everything else builds on it, Reports and testing come next because they unblock IT and restore a tool operations already relies on, Restocking follows as the largest new build, and the desired items round out the engagement once the required scope is stable.

## Phase 0 — Foundation (Weeks 1–3)
- Migrate existing JSON data to a proper database, 1:1, with no behavior change.
- Begin architecture documentation (R4) alongside this work, since it's documenting the foundation as it's built.
- **Milestone:** application running unchanged against the new data layer; architecture doc in draft.

## Phase 1 — Stabilize & unblock (Weeks 4–7)
- Audit and resolve Reports module defects (R1): filters, i18n, formatting/data-pattern inconsistencies.
- Stand up automated browser test coverage (R3) for the Reports flow as it's fixed, so regressions are caught immediately rather than retrofitted later.
- **Milestone:** Reports module fully functional and covered by automated tests; IT has a working example of the new test infrastructure.

## Phase 2 — Build (Weeks 8–13)
- Design and build the Restocking view (R2): stock + demand + budget ceiling → recommended purchase orders.
- Extend browser test coverage (R3) to the Restocking flow.
- Finalize architecture documentation (R4) to reflect the new feature and data model.
- **Milestone:** Restocking live and tested; architecture docs finalized and handed to IT.

## Phase 3 — Polish (Weeks 14–16, desired items)
- D1 — UI refresh (light-touch, per scoping assumption).
- D2 — i18n expansion to remaining modules, building on R1's locale work.
- D3 — Dark mode.
- **Milestone:** desired-item scope delivered to the extent time/budget allow; engagement closeout and handoff.

## Notes
- Phases 0–2 map directly to the required items (R1–R4) and are the priority; Phase 3 (D1–D3) is scoped to fit remaining time and budget without displacing required work.
- Each phase ends with working, demonstrable output — Meridian doesn't wait until Week 16 to see value.
- This is a planning-level estimate (~16 weeks total for full scope including desired items); we'd firm up per-phase estimates once the budget conversation (see Pricing) is resolved.
