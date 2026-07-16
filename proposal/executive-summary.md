# Executive Summary

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

Meridian Components' inventory dashboard is a capable foundation that has been left unfinished. The Reports module has known defects that were never resolved, the operations team lacks a restocking tool it has explicitly asked for, and the absence of automated tests has left IT unwilling to approve further changes — effectively freezing the system in its current state. The result is a tool that Meridian's operations team relies on daily but can no longer improve safely.

We propose an engagement that unblocks the system first, then builds on top of it. Concretely:

- **We will fix what's broken.** The Reports module's logged defects — filter behavior, internationalization gaps, inconsistent data handling — will be audited and resolved as the first phase of work, restoring trust in a tool operations already depends on.
- **We will build what's missing.** A new Restocking view will recommend purchase orders from current stock levels, demand forecasts, and an operator-defined budget ceiling — directly addressing the capability R. Tanaka's operations team has requested.
- **We will unblock IT.** Automated browser test coverage for the Reports and Restocking flows — the highest-risk, highest-change areas of the system — gives IT the confidence to approve future changes without a full manual regression pass each time.
- **We will document what exists.** A current-state architecture review, delivered in a format suitable for direct handoff to Meridian IT, closes the knowledge gap left by the previous vendor's minimal documentation.
- **We will strengthen the foundation.** The current system stores all data in flat JSON files with no persistence layer. We will migrate this to a proper database as part of this engagement — a foundational change that reduces risk across every other requirement in this scope, since Reports, Restocking, and all future features depend on it.

Where the RFP leaves room for judgment, we have made scoping assumptions explicit rather than guessing silently — including a lighter-touch UI refresh (rather than a full redesign) and a testing scope focused on the Reports and Restocking flows. These are detailed in our technical approach and remain open to Meridian's input.

Our approach favors phased delivery: stabilize and unblock first, then extend. This gives Meridian visibility into progress and cost at each phase rather than a single all-or-nothing delivery date, and lets the operations team start using fixes and new capabilities incrementally rather than waiting for the full scope to land at once.

We understand this system is the daily operating tool for a 12-person Tokyo team and the broader operations organization across three warehouses. Our goal is not just to satisfy the RFP's checklist, but to hand Meridian a system its own IT team can maintain and extend with confidence long after our engagement ends.
