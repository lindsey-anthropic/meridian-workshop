# Technical Approach

**RFP:** MC-2026-0417 — Inventory Dashboard Modernization
**Section reference:** RFP §4.2

---

## Overview

This section describes how we will address each item in §3 of the RFP — first the four required items (R1–R4), then the desired items (D1–D3), and finally a consolidated list of the assumptions our approach depends on.

The sequencing principle running through the plan is simple: **every change Meridian's IT team will see lands behind a regression test, and every requirement closes on a demo to operations plus a documentation update for IT.** That principle drives the four-phase shape introduced in our executive summary: discovery and the test harness come *first*, before any remediation, because they are what make the rest of the engagement safe to ship.

A discovery checkpoint at the end of Week 2 is built into the engagement model. That is the moment to confirm scope, finalize the not-to-exceed cap, and surface any findings from the codebase that materially change the work — for example, an unexpectedly large defect surface in Reports, or the orphaned API calls discussed under R2 below. We would rather price honestly after a short look than guess pessimistically before one.

---

## Required scope

### R1 — Reports module remediation

**Approach.** Reports is the highest-risk surface in the existing application. A first pass through the code surfaced concrete signals: the view is roughly 488 lines using the older Options API while the rest of the app has moved to Composition; there are around a dozen `console.log` statements left in the rendered code path; user-facing strings are hardcoded English with no i18n keys; and the view fetches data through direct `axios` calls rather than the centralized `api.js` client used elsewhere. These are smells, not yet a defect inventory.

Our first move in Phase 2 is therefore a **two-day defect audit** producing an itemized list of the defects Meridian has logged, the smells our pass surfaces, and any additional issues we find by exercising the view against the existing data. We triage that list with R. Tanaka's team to confirm severity and ordering, then close each item behind a regression test. Where it is cheap to do so, we also bring the view onto the same patterns the rest of the application uses (Composition API, `api.js` client, scoped i18n) so future changes stay safe.

**Assumptions.** Meridian is not providing a pre-itemized list of the eight defects (per Q&A response); we treat the audit as part of the engagement scope. Reports' existing data dependencies on `/api/reports/*` remain stable — we are not refactoring the backend reports endpoints under R1.

**Definition of done.** Zero console errors or warnings on Reports load; every defect on the audited list closed and covered by a regression test; the view follows the same data-fetching and i18n patterns as the rest of the application.

### R2 — Restocking recommendations

**Approach.** Restocking is a greenfield capability — VP Operations' headline ask. The recommendation logic lives on the backend: a new `GET /api/restocking/recommend` endpoint that accepts a `budget` query parameter and returns a ranked list of suggested purchase orders, computed from current stock levels (the existing inventory dataset), the demand forecast (the existing demand endpoint), and the budget ceiling. The ranking explains itself — each recommendation includes the inputs it was based on so an operator understands *why* a line is suggested, not just *that* it is.

The frontend is a new top-level view following the same patterns established elsewhere in the application: Composition API, `api.js` client, scoped i18n keys from day one, and a layout consistent with the existing Inventory and Orders views so operators do not have to learn a new visual language.

One discovery item to flag upfront: the client codebase already calls `/api/purchase-orders/*` endpoints that **do not exist on the server**. Either dead code from the previous engagement or an unfinished feature. We will not build the new Restocking flow alongside that dead code; in Phase 1 we determine whether to remove it or wire it up, then proceed cleanly.

**Assumptions.** A simple ranking (e.g. greedy fill against budget, ordered by stockout risk) meets the operations team's first-version need; sophisticated optimization is not in scope. The existing JSON-file data layer is sufficient for the recommendation read path — we are not introducing a database under R2.

**Definition of done.** An operator can enter a budget, see a ranked recommendation set with rationale, adjust the budget and see the list update, and export the recommendations to CSV for downstream procurement use.

### R3 — Automated browser testing

**Approach.** A look at the current repository shows the picture is partially better and partially worse than the RFP suggests. The backend already has a pytest suite covering 46 test cases — that is real coverage we keep and extend, not replace. The frontend, however, has zero automated coverage. **The gap R3 is asking us to close is browser-level coverage of user flows**, not unit testing.

We use **Playwright** for that layer. The test scaffold and a CI integration go in during Phase 1, before any remediation work begins, so that every R1 fix and every R2 feature lands with a corresponding test in the same PR. Phase 4 extends the suite to cover the critical flows Meridian uses daily: top-level navigation, filter behavior on each main view, the Reports interactions remediated under R1, and the new Restocking flow built under R2.

**Assumptions.** Meridian's IT team accepts Playwright as the test framework. CI runs in a vendor-provided environment during the engagement; handover to a Meridian-hosted CI is in scope at the end. The existing backend pytest suite is maintained alongside, not replaced.

**Definition of done.** Every PR runs the suite green before merge. A "smoke" subset runs in under 60 seconds for fast feedback; the full suite runs in under five minutes. A developer with the repo and `npm install` can run the suite locally with a single command.

### R4 — Architecture documentation

**Approach.** The previous vendor's handoff document is a single short page; the institutional knowledge gap is real. R4 closes it. We deliver a **single-page HTML architecture document** plus a written narrative that together let a new engineer onboard using only the document and the codebase. Contents: the stack and its versions; the request flow from view to API to data file; the data layer's JSON-file pattern and its known limitations (concurrency, durability, scale); the shared filter pattern that runs through every view; and the deployment topology.

We treat this document as a living artifact, updated through the engagement as we touch the code. By the end of Phase 4, it reflects the system Meridian receives, not the system we inherited.

**Assumptions.** Meridian's IT team is the audience; the document is technical, not executive. A diagramming approach using inline SVG embedded in HTML is acceptable — we do not require a third-party diagram tool license.

**Definition of done.** A new engineer with general Vue and FastAPI experience can answer the questions "where does data live," "how does a filter become a query parameter," and "where would I add a new view" using the document alone.

---

## Desired scope

### D1 — UI cleanup

**Approach.** Per Meridian's clarification, D1 is **cleanup, not redesign**. We respect that. The work: extract the slate/gray palette already in use into a small CSS-variables token file; replace hardcoded color literals (the `#3b82f6`, `#0f172a`, and similar values currently scattered through component styles) with references to those tokens; tighten the spacing inconsistencies that have accumulated across views; and where the cost is low, migrate the remaining Options API views to Composition for consistency. The visual result should look familiar to current users — slightly more polished, not different.

**Definition of done.** Color literals removed from component code; a developer adding a new view picks colors from the token file by default; no visual regressions reported by Tanaka's team.

### D2 — Internationalization

**Approach.** The application already uses a hand-rolled `useI18n.js` composable with `en` and `ja` locale files. The Tokyo team can run most of the dashboard in Japanese today — but **Reports is fully untranslated**, and the audit under R1 will surface other gaps. We extend the existing pattern; we do not introduce `vue-i18n`. Adding a third locale later remains straightforward.

**Definition of done.** Tokyo team can complete every workflow they use today in `ja`, including the Reports module and the new Restocking view from R2.

### D3 — Dark mode

**Approach.** No theming scaffolding exists today, so D3 is real foundation work, not just a toggle. We introduce a `data-theme` attribute on the root element, define a light and a dark token set against it, and add a `useTheme` composable backed by `localStorage` with a `prefers-color-scheme` fallback for first visit. **D1 is a prerequisite** — once color literals are replaced with tokens, dark mode becomes one variable swap; without that work first, D3 turns into a code-wide hunt.

**Definition of done.** Operator-toggleable theme, persisted across sessions, with no contrast regressions in either mode against WCAG AA on the primary text and interactive surfaces.

---

## Assumptions

The approach above depends on the following assumptions. Meridian has confirmed several of these in response to our clarifying questions per RFP §6; the rest are surfaced explicitly so they can be accepted, adjusted, or replaced before the engagement begins.

- **D1 scope is cleanup, not full redesign** (per Meridian's response to our Q1).
- **No fixed budget ceiling**; engagement priced on **time-and-materials with a not-to-exceed cap** (per Q2 and Q3).
- The not-to-exceed cap is set after the **Week-2 discovery checkpoint**, not before. This is what allows us to price honestly given an unknown defect surface in Reports.
- **Meridian is not providing an itemized defect list** for R1 (per Q4); the audit is part of the engagement.
- The **existing backend pytest suite** is supported and extended, not replaced.
- The **orphaned client→server endpoints** (`/api/purchase-orders/*` and similar) will be investigated and either removed or implemented during R2 discovery, not left in place.
- The engagement uses `main` as the integration branch; each requirement lands behind a feature branch and a reviewed PR.
- Meridian provides a **single point of contact** (R. Tanaka or her designate) for demos and acceptance, and a counterpart on the IT side for the test infrastructure handover under R3.
- The application's **JSON-file data layer is in scope to read from**, not in scope to replace. A move to a real database, if Meridian wants one, is a separate engagement we are happy to scope.
