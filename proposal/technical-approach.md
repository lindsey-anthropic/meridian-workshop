# Technical Approach

**RFP #MC-2026-0417 — Meridian Components**

---

## Onboarding & Discovery

Before touching a line of code, we conduct a structured review of the existing codebase. Given the limited handoff documentation, we treat discovery as a deliverable — not overhead. We will:

- Map the current architecture (Vue 3 frontend, FastAPI backend, JSON data layer)
- Identify all deviations from documented patterns (e.g. Options API vs Composition API inconsistencies noted in handoff)
- Audit the Reports module independently to produce a complete defect list

Findings from discovery inform the R4 architecture document and sharpen the scope of R1 remediation.

---

## R1 — Reports Module Remediation

**Approach:** Full audit before any fixes. We do not patch symptoms — we identify root causes.

The handoff notes acknowledge that "not all filters were wired up" in Reports. Our experience suggests that incomplete filter wiring typically cascades: a filter that doesn't apply on the frontend may also not be passed correctly to the API, which may mean server-side filtering logic is also incomplete or untested. We will trace each defect end-to-end (UI → API client → backend → response).

Known defect categories based on the RFP description:
- Filter behavior (selection not applied, wrong data returned)
- Internationalization gaps (likely date/number formatting, label coverage)
- Inconsistent data patterns (probable Options API remnants vs Composition API)

We will document each defect with root cause, fix applied, and verification method before closing it.

**Assumption:** Meridian does not have a formal ticket list for the 8+ issues. We will produce one as part of the audit and share it with IT before beginning remediation.

---

## R2 — Restocking View

**Approach:** New module built to the same patterns as the working parts of the existing codebase — Composition API, reactive filters, consistent API structure.

The Restocking view will:
- Pull current stock levels per warehouse and category
- Cross-reference against demand forecast data (already available at `/api/demand`)
- Accept an operator-supplied budget ceiling as a filter input
- Produce a ranked list of recommended purchase orders: what to buy, how much, estimated cost
- Support the same warehouse/category filter structure as other views for consistency

We will confirm the recommendation algorithm logic (e.g. reorder point calculation, how to handle items with no forecast data) with R. Tanaka's team before building — the logic should reflect how Meridian's ops team actually thinks about restocking, not a generic formula.

**Assumption:** The budget ceiling is a session input (not persisted), and recommendations are advisory — no write-back to an ordering system is in scope.

---

## R3 — Automated Browser Testing

**Approach:** Playwright end-to-end tests covering critical user flows.

We will establish test coverage for:
- Dashboard summary view (filters apply, data loads)
- Orders view (filter combinations, status changes)
- Reports view (all remediated filters verified by test)
- Restocking view (budget input, recommendation output)

Tests run against the local dev server and are structured to be CI-ready. We will document the test setup so Meridian IT can run them independently.

**Why this is first in our build sequence:** IT's freeze on changes exists because there's no safety net. By establishing the test harness early, we unblock our own subsequent work — every fix to R1 and every addition in R2 can be verified before it ships.

---

## R4 — Architecture Documentation

**Approach:** A current-state overview written for Meridian IT, not for developers.

We will produce a document covering:
- System components and how they connect (frontend, backend, data layer)
- Data flow for the main user workflows
- Known technical decisions and their rationale where discoverable
- Outstanding technical debt (Options API migration, no database layer, etc.)

Format: an HTML diagram with accompanying written narrative, delivered to `proposal/architecture.html`. Easy to open, no tooling required.

---

## Desired Items (D1–D3)

We have scoped the desired items and can include them within the same engagement:

| Item | Our approach | Condition |
|---|---|---|
| D2 — i18n expansion | Extend existing i18n framework to all views; prioritize Tokyo-facing labels and date/number formatting | Recommended for inclusion — directly addresses a known operational pain |
| D3 — Dark mode | Operator-selectable theme via CSS custom properties; no structural changes required | Can be prototyped in parallel without risk to main delivery |
| D1 — UI modernization | Refresh of spacing, typography, and color system; scoped after discovery | Scope TBD pending design direction from Meridian |

**Assumption:** No external design system or brand guidelines exist. D1 scope will be defined collaboratively after award.

---

## What We Are Not Proposing

- Database migration (out of scope; JSON data layer is sufficient for current scale)
- Mobile / responsive redesign (not mentioned in RFP)
- Integration with external ordering or ERP systems (R2 is advisory only)

If any of these become relevant during the engagement, we will raise them as change requests with cost and timeline impact before proceeding.
