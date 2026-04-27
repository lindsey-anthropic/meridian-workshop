# Technical Approach

**Proposal in response to RFP #MC-2026-0417**

---

## Approach overview

Our technical approach is audit-before-fix: we establish a clear picture of the current system before modifying it, then work through requirements in the priority order Meridian has set. Each phase builds on the previous one. Phase 1 produces the artifacts that make Phase 2 safe to execute.

The codebase we reviewed is a Vue 3 + FastAPI application with a well-structured backend and an inconsistently delivered frontend. The foundation is sound — we are not recommending a rewrite. We are recommending targeted remediation of the modules that were left incomplete, extension with new capabilities, and the test coverage that makes all of it maintainable.

---

## Required items

### R1 — Reports module remediation

**What we found.** Prior to writing this proposal, we reviewed the Reports module directly. Our findings:

- The component bypasses `api.js`, the application's shared API abstraction layer, and calls backend endpoints via hardcoded `localhost:8001` URLs
- It was written using Vue's Options API (`data()`, `mounted()`, `methods()`) while every other view in the application uses Composition API — the pattern the rest of the codebase has standardized on
- The four global filters (Time Period, Warehouse, Category, Order Status) have no effect on the Reports view; it always returns all data regardless of filter state
- Number and currency formatting uses a custom implementation instead of the browser-native `toLocaleString()`, making it fragile and locale-unaware
- Over a dozen `console.log()` statements remain in the component, indicating the module was not brought to a production-ready state before handoff
- The two Reports API endpoints (`/api/reports/quarterly`, `/api/reports/monthly-trends`) are not covered by any automated tests

**Our approach.** We will begin with a complete defect audit, producing a written log of every issue found — not just the ones listed above. That log becomes a shared artifact with Meridian before we write a line of remediation code, so there are no surprises about scope.

Remediation will bring Reports in line with how the rest of the application works: Composition API, `api.js` abstraction, filter integration via the `useFilters` composable, and locale-aware formatting via the existing `useI18n` infrastructure. The result is a Reports view that behaves consistently with Inventory, Orders, and Spending — not a special case requiring its own maintenance rules.

**Assumption:** Meridian will review and sign off on the defect log before remediation begins.

---

### R2 — Restocking recommendations

**What we will build.** A new Restocking view accessible from the main navigation. The view accepts an operator-supplied budget ceiling as input and returns a ranked list of recommended purchase orders based on current stock levels and demand forecast data already present in the system.

**Technical design:**
- New FastAPI endpoint `GET /api/restocking/recommendations` — accepts `budget` parameter, reads from existing inventory and demand data, returns ranked PO recommendations with SKU, quantity, estimated cost, and justification (days-of-stock remaining, demand trend)
- New Vue view `RestockingView.vue` using Composition API and `useFilters` consistent with existing views
- Budget input as a reactive form field; recommendations recalculate on submit
- Integrates with existing `api.js` pattern — new `getRestockingRecommendations(budget)` method

**Assumption:** Demand forecast data currently in the system (`/api/demand`) is the authoritative source for demand projections. If Meridian has a separate forecasting model or data source they want to incorporate, that would affect scope and should be discussed at kickoff.

---

### R3 — Automated browser testing

**What we will build.** End-to-end browser tests using Playwright covering the critical flows Meridian's IT team identified: the inventory and orders views, and the Restocking workflow end-to-end.

**Test coverage plan:**

| Flow | What we test |
|---|---|
| Inventory view | Page loads, filter by warehouse, filter by category, results update correctly |
| Orders view | Page loads, filter by status, filter by month, results update correctly |
| Reports view | Page loads, filters apply, data reflects filter state (post-remediation) |
| Restocking workflow | Budget input accepted, recommendations returned, ranked list displays |

Tests will be integrated into the existing repository. The backend already has ~50 test cases covering core API endpoints; our browser tests extend coverage to the UI layer. IT will be able to run the full suite before approving any future change.

**Assumption:** Meridian's IT team will define any additional flows they consider critical during Phase 1 kickoff. We will incorporate up to two additional flows without scope change.

---

### R4 — Architecture documentation

**What we will deliver.** A current-state architecture overview suitable for handoff to Meridian IT — produced at the start of Phase 1, not the end of Phase 2. The documentation exists to orient the team doing the work and to leave Meridian with an accurate picture of what they own.

**Contents:**
- Component diagram: frontend views, API client, backend endpoints, data layer
- Data flow narrative: how a filter selection in the UI becomes a filtered API response
- Deployment notes: what runs where, on which ports, how it starts
- Known patterns: conventions the codebase uses so future maintainers can follow them

**Format:** HTML document with an embedded diagram, deliverable as a single file. Readable in any browser without dependencies.

---

## Desired items

The following items are in scope conditional on budget remaining after Phase 2 delivery. Each is sized to be self-contained and can be sequenced independently.

### D1 — UI modernization

We will refresh the visual design to align with Meridian's brand guide.

**Assumption:** Meridian will provide the brand guide (colors, typography, logo usage) before Phase 3 begins. Without it, we cannot execute this item. If the brand guide is not available, we will propose a clean default design for Meridian's approval.

**Approach:** CSS custom properties (design tokens) for color and typography, applied globally. Component-level styling updated to use tokens. No framework changes — the existing CSS Grid layout is sound and will be preserved.

---

### D2 — Internationalization

The i18n infrastructure already exists in the codebase: locale files for English (`en.js`) and Japanese (`ja.js`), a `useI18n` composable, and automatic currency switching based on locale. The gap is that the Reports view does not use it, and some strings across other views may be missing translations.

**Approach:** Audit all views for untranslated strings, extend `ja.js` with missing entries, wire Reports into `useI18n`. The Tokyo team will see Japanese month names, localized currency, and translated labels in every view — not just the ones the previous vendor completed.

---

### D3 — Dark mode

**Approach:** CSS custom property theming. Light and dark palettes defined as token sets; a toggle in the UI writes a `data-theme` attribute to the document root. No component-level changes required — all views inherit from the token layer. Operator preference persisted in `localStorage` so the setting survives page reloads.

Both palettes will meet WCAG 2.1 AA contrast requirements. Color choices will follow Meridian's brand guide where one is provided; where the guide does not specify dark-mode values, we will derive compliant equivalents and present them for approval before finalizing.

This is well-suited to prototyping in an isolated branch before merging — we will validate the full UI in dark mode, including contrast ratios, before delivering.

---

## Stated assumptions

For reference, all assumptions from this section:

1. The Reports defect log will be reviewed and approved by Meridian before remediation begins
2. Demand forecast data from `/api/demand` is the authoritative source for restocking recommendations; any external data source would affect scope
3. Meridian will identify any additional critical test flows during Phase 1 kickoff (up to two additions included without change)
4. Meridian will provide a brand guide before Phase 3 begins; if unavailable, we proceed with a proposed default design
5. Desired items (D1–D3) are conditional on budget remaining after Phase 2; each is independently sequenceable
