# Technical Approach

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

## Overview

We propose a phased delivery: stabilize the foundation, unblock IT's ability to approve changes, then build and extend. Each phase produces working, usable output rather than holding everything for one final delivery date. The sections below walk through our approach to each item in RFP §3, in the order we'd deliver them, followed by the desired (§3.2) items and a recap of the assumptions this approach relies on.

## Foundational work: Data layer migration

The current system stores all data in flat JSON files, read and written through a single in-memory data module with no persistence layer or database underneath it. Every requirement in this engagement — Reports, Restocking, and anything built afterward — ultimately depends on this layer.

Our approach is to migrate this to a proper database early, as a foundational first phase, before building new functionality on top of it. We will migrate existing data one-to-one with no behavior change first, validate against the current application, and only then proceed to the work below. Sequencing it this way avoids building new features (particularly Restocking, which needs clean relational data) against a data layer we'd otherwise have to rework mid-engagement.

## R1 — Reports module remediation

We will audit the Reports module against Meridian's logged defects (filter behavior, internationalization gaps, inconsistent data handling) and resolve each. Our own review confirms the categories Meridian has flagged: filtering is not currently wired up in this view, number and date formatting is handled inconsistently with the rest of the application, and the view has no internationalization support at all — it's fully hardcoded in English.

Meridian's application already has partial i18n infrastructure in place (a locale system and formatting composable) used elsewhere in the app; our fix will extend that existing infrastructure to Reports rather than introducing new tooling. This keeps the fix consistent with patterns already established in the codebase, and — as noted below — sets up D2 (i18n expansion) as a smaller follow-on rather than separate work.

This is the area Meridian's operations team encounters daily, so restoring it to full working order is both a functional fix and a trust-rebuilding step after the previous vendor left it incomplete.

## R2 — Restocking recommendations

This is net-new functionality: a Restocking view that recommends purchase orders based on current stock levels, demand forecasts, and an operator-supplied budget ceiling. The underlying stock and demand data already exists in the current system and gives us a real foundation to build the recommendation logic against. The budget ceiling, however, is a new concept — there is no equivalent input anywhere in the current data model — and the purchase order structure itself is currently only a placeholder with no data or schema behind it. In practice, this means R2 is the largest ground-up build in the engagement, not a modification of existing functionality, and its data model will be designed as part of (and after) the database migration phase above.

## R3 — Automated browser testing

The current system has backend test coverage but no browser-level (end-to-end) tests at all. We will introduce automated browser testing from scratch, scoped initially to the Reports and Restocking flows — the areas of highest change in this engagement, and, per our clarifying question, the flows Meridian considers most critical.

We want to be direct about why this matters beyond the checklist: Meridian's IT team has been unwilling to approve changes to this system because there's no safety net today. This test coverage is what gives them one — it is infrastructure that unblocks every future change to the system, not just a deliverable to satisfy §3.1.

## R4 — Architecture documentation

We will deliver a current-state architecture overview suitable for direct handoff to Meridian's IT team, covering the application's structure, data flow, and (post-migration) its new data layer. We'll produce this early — around the same time as the database migration work — since it documents the foundation the rest of the engagement builds on, and gives IT a reference point before the bulk of new development begins.

## Desired items (§3.2)

These are scored in Meridian's evaluation but are not required for the engagement to succeed, so we've scoped them to fit around the required work rather than compete with it.

- **D1 — UI modernization:** Based on our assumption (see below), we're scoping this as a lighter visual refresh — updated spacing, color, and component styling — rather than a full redesign. This keeps the existing page structure and navigation intact, reducing risk and retraining burden for the operations team.
- **D2 — Internationalization:** This extends the same locale infrastructure touched in R1, applying it to the remaining modules Tokyo staff use. Because the groundwork is shared with R1, this is a smaller follow-on effort rather than a separate build.
- **D3 — Dark mode:** An operator-selectable theme, scoped as a later, smaller addition once the UI refresh (D1) has established the visual system it would apply to.

## Assumptions

This approach relies on the scoping assumptions detailed in our clarifying questions (submitted separately, see `clarifying-questions.md`):

- D1 is scoped as a light refresh, not a full redesign.
- R3's "critical flows" are Reports and Restocking.
- The data layer migration is treated as in-scope, foundational work.
- Pricing model is pending Meridian's guidance on budget range.

We welcome correction on any of these before work begins.
