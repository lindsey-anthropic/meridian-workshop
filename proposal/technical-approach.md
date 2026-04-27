# Technical Approach
**RFP #MC-2026-0417 — Inventory Dashboard Modernization**

---

We reviewed the source code and previous vendor's handoff notes prior to submitting this response. The technical approach below is based on direct inspection of the codebase, not on the vendor's documentation. Where the documentation and the code disagreed, we relied on the code.

---

## R1 — Reports Module Remediation

Our code review identified eight concrete defects in the Reports module. These are the issues we will resolve:

1. **Outdated component pattern.** The Reports view is written in the Options API while the rest of the application has been migrated to Vue 3 Composition API. We will rewrite Reports to match the project standard, eliminating the inconsistency.

2. **Filters not connected.** The global filter bar (warehouse, category, time period) has no effect on the Reports page. Users setting a warehouse filter see no change in the Reports data. We will wire Reports into the shared filter system used by every other view.

3. **Hardcoded API URL.** Reports makes direct HTTP calls to `http://localhost:8001` instead of using the shared API module (`api.js`) that all other views use. This means Reports would silently break in any environment other than a developer's local machine. We will consolidate to the shared module.

4. **Debug logging in production code.** Every method in the Reports component logs to the browser console, including a log call that fires on every number formatted in every table cell. On a typical page load this produces dozens of console entries. We will remove all debug logging.

5. **No internationalization.** Every visible string in Reports — page titles, table headers, summary labels — is hardcoded in English. The existing locale system (used by all other views) has English and Japanese translation files already in place. We will add a Reports section to both and wire up the component.

6. **Broken number formatter.** The `formatNumber` function is a manual character-by-character implementation that has edge cases with decimal values. The browser's native `Intl.NumberFormat` (or `toLocaleString`) handles this correctly and is already the recommended pattern in the project's own documentation. We will replace the custom implementation.

7. **Duplicate variable declarations.** The summary statistics function declares the same loop variable three times in the same scope. This passes in browsers due to legacy `var` hoisting behavior but would fail under any linting or strict-mode enforcement. We will rewrite these loops using `const`/`let` as the rest of the project does.

8. **Inefficient chart rendering.** The bar chart height calculation loops through all monthly data on every render call. With twelve months, this means 144 iterations per render cycle. We will move the calculation to a computed property so it runs once and is cached until the data changes.

We will conduct a full audit of the Reports module against a running environment before closing R1. The eight issues above are what we found from static review — we treat them as a floor, not a ceiling.

---

## R2 — Restocking Recommendations

We will deliver a new Restocking view that gives R. Tanaka's operations team purchase order recommendations within a budget ceiling they supply.

**How it works.** The view takes three inputs: current stock levels (from the existing `/api/inventory` endpoint), demand forecasts (from the existing `/api/demand` endpoint), and an operator-supplied budget ceiling entered directly in the UI. The backend calculates which items are below their reorder threshold relative to forecast, ranks them by urgency, and returns a recommended purchase order list that fits within the stated budget. The operator reviews the recommendations and confirms manually — there is no automatic purchasing integration.

**What the operator sees.** A table of recommended orders showing SKU, item name, warehouse, recommended quantity, unit cost, and line total. A running total shows how much of the budget ceiling the selected orders consume. The operator can adjust quantities or deselect items before confirming.

**Implementation approach.** We will add a new endpoint to the FastAPI backend that accepts a budget parameter and returns ranked recommendations. The frontend view will follow the same Composition API and filter patterns used throughout the rest of the application. No new dependencies are required.

**Assumption.** This feature produces recommendations only. Confirming a recommendation creates a record but does not integrate with any external purchasing or ERP system. If Meridian requires external integration, that should be scoped separately.

---

## R3 — Automated Browser Testing

We will establish end-to-end browser test coverage using Playwright, which is already configured in the project repository.

**Scope.** Based on our discussion with procurement, the agreed scope is the critical user happy path: application load → dashboard → filter by warehouse → inventory view → orders view → reports view. We will additionally write filter interaction tests for the Reports module specifically, as that is the highest-risk area following remediation.

**What the tests cover.**
- Application loads and displays dashboard summary data
- Warehouse filter applies correctly across views
- Inventory table renders and responds to filters
- Orders table renders and responds to filters
- Reports page loads, displays data, and filters function correctly after remediation

**Delivery.** Tests will be written to run against `localhost:3000`. Meridian IT can integrate them into a CI pipeline as a gate on future changes — which is the outcome IT has requested before approving further development.

**Assumption.** Test scope is defined above. If Meridian identifies additional flows that must be covered, those can be added within this phase subject to timeline review.

---

## R4 — Architecture Documentation

We will deliver a current-state architecture overview suitable for handoff to Meridian IT.

**Format.** An HTML document with a visual diagram of the system and a written narrative explaining each layer. Chosen for readability without requiring any additional tooling to open.

**Content.**
- Stack overview: Vue 3 frontend (port 3000), FastAPI backend (port 8001), JSON flat-file data store
- Data flow: how a user action in the UI becomes a filtered API call, reaches the backend, is processed against in-memory data, and returns a typed response
- Routing and view structure: how the seven views are organized and which API endpoints each depends on
- Filter system: how the shared filter composable works and which views use it (and which currently do not)
- Known inconsistencies: Options API remnants, mixed patterns, areas of incomplete migration from the previous vendor

**Basis.** This documentation is based on direct code review, not on the previous vendor's handoff notes. Where the two differ, the code takes precedence. We will note discrepancies explicitly so Meridian IT has an accurate picture of the current state.

---

## D1 — UI Modernization *(optional phase)*

We will refresh the visual design of the dashboard to align with Meridian's brand.

**Approach.** All color and typography values will be moved to CSS custom properties (design tokens) at the application root. Updating the brand means changing those tokens — not editing individual components. We will then apply Meridian's brand guidelines across spacing, typography, and component styling without changing the underlying view structure or layout.

**Dependency.** This phase requires Meridian to provide brand guidelines — colors, typography, logo assets — by the start of week 2 of the D1 phase. If guidelines are not received by that date, we propose proceeding with a neutral modernization aligned to an established open-source design system, with a brand-application pass once guidelines are available.

---

## D2 — Internationalization *(optional phase)*

We will extend Japanese-language support to all modules that currently display English-only content.

**Approach.** The existing internationalization system (`useI18n` composable, `en.js` and `ja.js` locale files) is already in place and covers most of the application. The primary gap is the Reports module, which has no locale entries and hardcoded English strings throughout. We will address Reports as part of R1, pairing the fix and the translation in a single pass. The remaining i18n work will audit all other views against the existing Japanese locale file, identify missing keys, and fill them.

**No new tooling required.** We will use the locale system already present in the codebase. No new i18n library or framework is needed.

---

## D3 — Dark Mode *(optional phase)*

We will add an operator-selectable dark theme suitable for warehouse floor stations running in low-light environments.

**Approach.** Dark mode will be implemented via CSS custom properties, the same token system established in D1. A theme toggle in the application header will switch the active token set. The selected theme will be persisted in `localStorage` so the operator's preference is remembered across sessions. No backend changes are required.

**Development approach.** We will prototype dark mode on a dedicated feature branch so the main codebase is not affected during development. The branch is merged only when the theme is complete and tested.
