# Technical Approach

**RFP #MC-2026-0417 — Meridian Components, Inc.**

---

## Guiding Principles

Our technical approach is governed by four rules derived directly from Meridian's situation:

1. **Test before you touch.** IT has blocked changes because there's no safety net. We establish automated coverage first — before any production code changes.
2. **Scope from the actual codebase, not the docs.** The previous vendor's handoff documentation is thin and may be incomplete or stale. We have reviewed the actual source code and base our estimates on what is there.
3. **Deliver incrementally.** Each phase produces working, testable, demonstrable software — not a big-bang release at the end.
4. **Respect cultural context.** We treat Japanese localization as a cultural adaptation, not a string-swap — details in the D2 section.

---

## R1 — Reports Module Remediation

### The Problem
The Reports page (client/src/views/Reports.vue) was left in an incomplete state at contract end. Known issues include:
- Filter parameters not fully wired to API calls (Time Period, Warehouse, Category filters are inconsistently applied)
- Internationalization (i18n) gaps — some labels hardcoded in English, not run through the i18n composable
- Console errors on load due to API pattern inconsistencies (some views call endpoints that don't exist or return unexpected shapes)
- Missing loading/error state handling in several data fetches
- Data shape mismatches between the API response and the component's display logic

### Our Approach

The audit and remediation are split across two phases — intentionally:

- **Phase 1, Week 2 — Defect audit:** Systematically enumerate every defect using browser DevTools and source review. Produce a defect register with severity ratings. This happens before any code changes.
- **Phase 2, Weeks 3–4 — Remediation:** Address all defects in order of severity. Each fix is covered by a corresponding Playwright test before it is merged.

This sequence is intentional — we do not fix defects we cannot verify. IT has already approved the test harness by the time the first production code change is made.

### Assumptions
- All known defects are contained within the frontend Reports view and the existing backend `/api/reports/*` endpoints. If new backend endpoints are required, we will flag this before building.
- "At least eight issues" (RFP §3.1) may be more upon audit — our fixed price covers all defects found, not just eight.

### Stakeholder Relevance
- **Tanaka:** Her team gets a Reports page that actually works. Filters behave predictably. No console noise.
- **IT:** Every fix ships with a test. The green pipeline is the handoff artefact.

---

## R2 — Restocking Recommendations View

### The Problem
No restocking view exists in the current system. Operations currently perform stock-level analysis manually or using spreadsheets outside the dashboard. This is the feature VP Operations has been requesting.

### Our Approach

**Data inputs:**
- Current stock levels (`/api/inventory` — quantity_on_hand, reorder_point per SKU per warehouse)
- Demand forecasts (`/api/demand` — forecasted_demand, trend per SKU)
- Budget ceiling (operator-supplied, stored in component state — no backend schema change needed for MVP)

**Algorithm (Restocking Ranking):**
1. Identify SKUs where `quantity_on_hand ≤ reorder_point` (already at or below threshold)
2. Prioritize by: urgency tier (critical = 0 stock, warning = ≤ reorder_point, watch = within 20% of reorder_point) × demand trend (increasing demand = higher priority)
3. Estimate required purchase quantity: `max(reorder_point × 2 - quantity_on_hand, forecasted_demand × 4 weeks)`
4. Calculate estimated purchase cost: `quantity × unit_cost`
5. Filter to fit operator-supplied budget ceiling, largest-impact items first
6. Surface as a ranked table: SKU, warehouse, current qty, reorder point, recommended order qty, estimated cost, supplier (from existing data if available)

**UI:**
- New route `/restocking` in Vue Router
- Budget ceiling input (numeric, currency-formatted)
- Warehouse filter (reuse existing FilterBar)
- Ranked table with color-coded urgency badges
- "Create Purchase Order" action per row (wires to existing `/api/purchase-orders` or new endpoint if needed)
- Export to CSV

**Backend additions:**
- New endpoint `GET /api/restocking/recommendations?budget=&warehouse=` that performs the ranking server-side
- Returns: `[{sku, name, warehouse, current_qty, reorder_point, recommended_qty, estimated_cost, urgency, demand_trend}]`

### Assumptions
- Budget ceiling is per-session (not persisted to database) for MVP
- Supplier data from existing mock data; full supplier management is out of scope
- Purchase order creation writes to in-memory store (consistent with existing backend architecture)

### Stakeholder Relevance
- **Tanaka:** This is her feature. We will schedule a 30-min walkthrough with her team before final delivery to confirm the ranking logic matches operational intuition.
- **IT:** Full Playwright test coverage. The `/api/restocking/recommendations` endpoint is covered by pytest.

---

## R3 — Automated Browser Testing

### The Problem
There is no test coverage of any kind in the current codebase — no unit tests, no integration tests, no browser tests. IT has explicitly stated this is blocking their ability to approve changes.

### Our Approach

**Tool:** Playwright.

**Test scope — critical user flows:**

| Flow | Test Coverage |
|---|---|
| Dashboard loads, summary stats displayed | ✅ |
| Warehouse filter changes data across all views | ✅ |
| Category filter changes data | ✅ |
| Inventory list loads, search works | ✅ |
| Order list loads, status filter works | ✅ |
| Reports — quarterly data loads and displays | ✅ |
| Reports — monthly trend chart renders | ✅ |
| Reports — all filters produce correct server calls | ✅ |
| Restocking — recommendations load for given budget | ✅ |
| Restocking — budget ceiling filters results | ✅ |
| Language switcher — switches locale | ✅ |

**Test file locations:** `tests/` directory (already present in repo).

**CI integration:** We will provide a `package.json` test script (`npm run test:e2e`) so IT can run the full suite locally and in CI without additional tooling.

### Assumptions
- Tests run against the existing dev server (localhost:3000 or the equivalent staging URL). If Meridian IT requires execution against a dedicated staging environment, we will configure that as part of Phase 1 CI setup — no additional cost.

### Stakeholder Relevance
- **IT:** This is their requirement. We deliver a `tests/` directory with a clear README, a single command to run all tests, and a green result before handoff.
- **Okafor:** Every phase deliverable includes test results as proof of completion. Each phase delivery package includes a test results summary (pass count, run time, zero failures) formatted for non-technical review. Phase sign-off is a written approval against a checklist we provide at kickoff. No ambiguity about what constitutes completion — the checklist is the contract.

---

## R4 — Architecture Documentation

### The Problem
The previous vendor's technical documentation is minimal — a single `vendor-handoff.md` file that describes the stack but not the architecture. Meridian IT needs documentation suitable for onboarding future maintainers.

### Our Approach

Delivered as a standalone HTML file — opens in any browser with no tooling required. Path to be agreed with Meridian IT at kickoff (suggested: `docs/architecture/current-state.html` in Meridian's repository).

The document includes:

1. **System overview diagram** — frontend → API → data layer, with ports, protocols, and data flow
2. **Component map** — every Vue view and component, what API endpoints it calls, what state it manages
3. **API reference** — all endpoints, parameters, response shapes, filter behavior
4. **Data model** — key entities (InventoryItem, Order, DemandForecast, BacklogItem, PurchaseOrder) with field descriptions
5. **Known limitations** — in-memory data store, no auth, no database persistence
6. **Runbook** — how to start the system, where logs are, how to stop it
7. **Change log** — what we changed vs. what we found (our additions clearly marked)

### Assumptions
- Architecture doc is generated from the actual codebase — not from the previous vendor's notes.
- Format is HTML (opens in any browser, no tooling required for Meridian IT).

---

## D1 — UI Modernization (Desired)

### The Problem
The current dashboard uses an ad-hoc visual style with inconsistent spacing, no defined typography scale, and a color system that was not designed for multi-hour warehouse floor use. No brand alignment with Meridian's corporate identity is present.

### Our Approach

**Step 1 — Design token audit (Day 1–2 of D1 week)**
The codebase already has CSS custom properties in place — we will audit what exists, identify what is missing, and produce a proposed token set: color palette, typography scale (font family, size, weight, line height), spacing scale, border radius, and shadow levels. This is the only file that changes; every component inherits from it automatically.

**Step 2 — Brand alignment**
If Meridian can provide a brand guide (logo, primary colors, typeface) by contract start, we will align the token set to it. If no brand guide is available, we will propose a modern, accessible palette for approval before implementation begins.

**Step 3 — Accessibility baseline (WCAG 2.1 AA)**
All color combinations in the new token set will be verified against WCAG 2.1 AA contrast ratios (4.5:1 for body text, 3:1 for large text). This is required for the D3 dark mode work to function correctly — the same token system supports both themes.

**Step 4 — Application and regression**
Token file applied to all views. We run the full Playwright suite after application to confirm no layout regressions. Browser tests for visual breakpoints are not included — functional test coverage is.

### Deliverables
- Updated CSS token file (single source of truth for all visual properties)
- Before/after screenshots of each view for Meridian approval
- WCAG contrast ratio audit results

### Assumptions
- Brand guide provided by Day 1 of D1 week, or approval of our proposed palette by end of Day 2
- No Figma or design tool deliverable required — HTML/CSS is the final output

### Stakeholder Relevance
- **Tanaka:** Her team uses this dashboard all day. A visually consistent, comfortable UI reduces fatigue and errors.
- **IT:** Token-based system is easier to maintain than ad-hoc CSS — future visual changes are one-file edits, not hunts through component files.
- **Okafor:** Purely additive change — zero risk to existing functionality; Playwright suite confirms it before merge.

---

## D2 — Internationalization & Japanese Cultural Adaptation (Desired)

### The Tokyo Context

The Tokyo warehouse team (~12 people) has been operating in an English-only or partially-English interface since opening in 2023. This is not simply a language gap — it creates measurable operational risk:

- **Data entry errors** increase when staff enter values in a non-native language under time pressure
- **Training new staff** is harder when the UI doesn't match the language of instruction
- **Trust in the system** is lower when the interface feels foreign
- **APAC OEM customer relationships** are managed by this team — precision matters

Japanese business culture places high value on **quality (品質, hinshitsu)** and **precision (正確さ, seikakusa)**. A dashboard with awkward or incorrect Japanese is not a minor inconvenience — it signals disrespect and carelessness to the team using it daily.

### Technical Approach

**Step 1 — Full string audit**
- Scan all `.vue` files and `api.js` for hardcoded strings not routed through `useI18n`
- Build a complete string inventory (estimated 300–400 keys across all views)
- Categorize by: UI labels, status values, error messages, date/number formats, empty states

**Step 2 — Locale file structure**
```
client/src/locales/
  en.json        ← master (already partially exists)
  ja.json        ← NEW: Japanese
  [existing]     ← preserve any other locales already in place
```

**Step 3 — Japanese locale (ja.json) — cultural specifics**

Translation alone is insufficient. Japanese localization requires:

| Issue | Our Approach |
|---|---|
| **Formal register (敬語, keigo)** | Business software uses 丁寧語 (teineigo) — polite but not overly formal. We avoid casual 普通体. |
| **Numeric formatting** | Japanese uses 万 (10,000) as a unit separator — `¥1,234,500` is written `123万4,500円`. We will apply locale-aware number formatting (Intl.NumberFormat with `ja-JP`). |
| **Date formatting** | Japanese date order is Year-Month-Day (令和7年6月30日 or 2025年6月30日). We will apply locale-aware date formatting. |
| **Status labels** | Terms like "Backordered", "Processing", "Delivered" have precise Japanese equivalents — バックオーダー, 処理中, 納品済. We will use industry-standard warehouse/logistics terminology, not literal translations. |
| **UI text length** | Japanese characters are denser than English — UI elements that show "Add to Order" in English may need layout adjustment in Japanese to prevent truncation. We will test all table columns and button labels at Japanese locale. |
| **Honorifics in error messages** | Japanese error messages should not be abrupt. "Error" (エラー) must be accompanied by polite phrasing (「申し訳ありません」など) where appropriate. |
| **Reading direction** | Japanese is rendered left-to-right in digital interfaces (横書き). No RTL changes required — but vertical text (縦書き) patterns must be explicitly avoided in chart labels. |

**Step 4 — Tokyo team validation (nemawashi / 根回し)**

Before final delivery, we will share the Japanese locale file with the Tokyo team for review. This is not a formality — it is essential. In Japanese work culture, involving the team in the review process (根回し — building consensus before formal sign-off) creates ownership and dramatically reduces post-delivery correction requests. Unlike translation-only approaches, we include a Tokyo team review cycle before final merge — corrections are part of the budget, not a change order.

We will:
- Provide a Japanese-locale staging build for the Tokyo team to review
- The Tokyo review window is built into Week 10: locale file delivered to Tokyo team by Wednesday; feedback due by end of Week 11 (5 business days). Any corrections are applied during Week 12 integration. If Tokyo feedback arrives late, D2 may slip to the Week 12 integration buffer — this is the only schedule risk for Phase 4.
- Conduct a video walkthrough if the team prefers (in Japanese if a Japanese-speaking team member can join from our side)
- Document any corrections and apply them before final merge

**Step 5 — Language switcher UX**

The existing `LanguageSwitcher` component will be updated to:
- Display locale names in their native script: `English`, `日本語`
- Persist locale preference per-user in `localStorage`
- Default to browser locale detection (`navigator.language`) on first visit

**Step 6 — Regression testing**
- Playwright tests for locale switching (EN ↔ JA)
- Verify all numeric and date formats render correctly in Japanese locale
- Verify no layout overflow in Japanese locale on all views

### Deliverable
`client/src/locales/ja.json` — reviewed by Tokyo team, using correct keigo register, industry-standard logistics terminology, and locale-aware numeric/date formatting.

---

## D3 — Dark Mode (Desired)

Operator-selectable light/dark theme via a toggle in the nav bar.

**Approach:** CSS `prefers-color-scheme` media query + manual override using a `data-theme` attribute on `<html>`. Theme preference persisted in `localStorage`. No component changes required — only CSS variable overrides.

**Prototype approach:** We will branch from main, prototype dark mode on a feature branch, and present it for approval before merging. This ensures main is never in an unstable visual state during prototyping.
