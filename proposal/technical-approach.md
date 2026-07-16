# Technical Approach

We spent time in the actual codebase before writing this section — not just the RFP and handoff notes — so what follows reflects what we found, not generic assumptions about a typical inventory app.

## Required Items

### R1 — Reports Module Remediation

The Reports page is the clear outlier in this codebase. Every other view (Dashboard, Inventory, Orders, Demand, Spending, Backlog) shares a common filter pattern and a common API client. Reports does neither: it doesn't use the shared filter bar or filter state, it calls the backend directly instead of going through the shared API layer, it has no translated strings where every other view does, and it logs debug output to the console on every load. This matches Meridian's own account — the previous vendor left it mid-migration.

Our approach is to bring Reports back in line with the rest of the application rather than treat it as a special case: wire it into the same filtering pattern the other views already use, route its API calls through the shared client, add the missing translated strings, and remove the debug logging. This is deliberately not a rewrite — the goal is consistency with patterns that already work elsewhere in the app.

### R2 — Restocking Recommendations

This is new functionality, not a fix. The underlying data — current stock levels, reorder thresholds, and demand forecasts — already exists in the system; what's missing is the view that combines them into a recommendation, and the purchase-order output structure to hold the result (currently defined but unpopulated).

One explicit assumption: the RFP describes an "operator-supplied budget ceiling," and there's no budget field anywhere in the current data model. We're treating this as a per-use input the operator enters when running a recommendation, not a stored historical value. If Meridian's ops team wants budget ceilings tracked over time (by warehouse, by period), that's a reasonable extension but a scope addition — flagging it now rather than assuming it silently.

The new view and endpoint will follow the same structural conventions as the existing views (own file, own route, own API methods) so it reads as part of the application rather than a bolt-on.

### R3 — Automated Browser Testing

We're building on what's already in place rather than introducing new tooling: browser-automation support is already configured in this project. Backend test coverage also already exists (over 50 tests) — there's currently no equivalent on the frontend/browser side, which is the gap R3 is meant to close.

Per your team's input, we're scoping first-pass coverage to the Reports and Restocking flows specifically — the page with the most defects and the page that's brand new — rather than attempting exhaustive coverage of the entire application in this phase. That's a deliberate scope decision, not an oversight: broader coverage is a reasonable follow-on phase once these two flows are proven out, and we'd rather commit to depth on the highest-risk areas than breadth everywhere.

### R4 — Architecture Documentation

The previous vendor's handoff notes were thin — a stack list and a short file map, with no explanation of data flow or design rationale. Our deliverable will go further: a current-state overview covering the actual request path (frontend view → shared API client → backend route → in-memory data), the shape of the data layer, and the same file-map style reference the previous vendor left, but complete. The goal is a document Meridian's IT team can actually hand to the next engineer without a walkthrough call.

## Desired Items

### D1 — UI Modernization

Per Meridian's input, we're scoping this as an alignment to Meridian's existing brand rather than a generic visual refresh. If brand guidelines or design tokens are available, we'll work from those; absent that, we'd extend the color and status conventions already established in the current application rather than introducing a new visual language. Scoped as a stretch item behind the required work.

### D2 — Internationalization

The application already has a working translation mechanism in place, used across most views — Reports being the notable exception (tied directly to R1 above). Our approach is to extend the existing pattern to the modules that lack it, rather than introduce a different i18n approach. This directly serves the Tokyo warehouse team's day-to-day use of the dashboard.

### D3 — Dark Mode

An operator-selectable theme, scoped as a stretch item. Low-risk to build and preview independently (e.g., on a separate branch) without putting the required-item timeline at risk.

## Approach & Sequencing

We're sequencing R3 (testing) early in the engagement, even though it's formally one of four equally-weighted required items. In practice, it's the item your IT team has said is blocking approval of everything else — so establishing it first means every subsequent change (Reports fixes, the new Restocking view) ships with safety net already in place, rather than testing being a final phase that risks getting compressed under deadline pressure.
