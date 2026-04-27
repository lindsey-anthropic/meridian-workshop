# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

## Assumptions

Before describing our approach, we note the following assumptions based on our review of the provided source code and handoff notes. These will be confirmed with Meridian during the onboarding phase.

- The application stack (Vue 3 / FastAPI / JSON data files) will remain unchanged. No database migration is in scope.
- "At least eight" Reports defects (R1) will be fully inventoried during a dedicated audit sprint before remediation begins. Our estimate accounts for up to twelve issues; anything beyond that triggers a scope conversation.
- Automated test coverage (R3) will focus on the Reports and Restocking modules, per Meridian IT's guidance. Full-application coverage is available as a follow-on engagement.
- Internationalization (D2) will extend existing i18n patterns already present in the codebase to remaining untranslated modules. Japanese is the target language for Tokyo warehouse staff.
- The engagement is a fixed-fee model in the $65,000–$80,000 range. Final figure depends on onboarding audit findings.

---

## R1 — Reports Module Remediation

The previous vendor's handoff notes acknowledge the Reports module was left incomplete: filters are not fully wired up, internationalization coverage is partial, and data patterns are inconsistent with the rest of the application. We will begin with a structured audit of the module before writing a single line of fix code.

**Our approach:**

1. **Audit sprint (Week 1).** We will map every filter, data binding, API call, and i18n key in the Reports module against the behavior described in the RFP and any issue logs Meridian can share. The output is a numbered defect list with severity and estimated effort per item — visible to Meridian before any fix work begins.
2. **Remediation (Weeks 2–3).** We will resolve defects in severity order. Each fix will be accompanied by a regression note so the test suite (R3) can cover it.
3. **Consistency pass.** The previous vendor left some views on the older Options API pattern. We will migrate Reports to the Composition API pattern used elsewhere, reducing future maintenance surface.

**What "done" looks like:** All filters behave correctly and consistently. All displayed strings are covered by i18n keys. No console errors. API calls follow the same pattern as the rest of the application.

---

## R2 — Restocking Recommendations View

This is the primary new capability. The Restocking view will allow operations staff to input a budget ceiling and receive a prioritized list of recommended purchase orders based on current stock levels and demand forecasts already present in the system.

**Our approach:**

1. **Logic design (Week 4).** We will define the recommendation algorithm with Meridian's operations team before building. Key inputs: current stock per SKU/warehouse, demand forecast, reorder threshold, unit cost. Output: ranked list of recommended orders that fits within the budget ceiling. We will produce a one-page data flow diagram for sign-off before implementation.
2. **Backend endpoint (Week 5).** New FastAPI endpoint that accepts a budget ceiling parameter and returns structured recommendations. We will follow the existing API patterns in `server/main.py` for consistency.
3. **Frontend view (Weeks 5–6).** New Vue 3 view using Composition API. Budget input, filterable recommendations table, per-item detail (SKU, warehouse, recommended quantity, estimated cost, demand signal). Consistent with existing dashboard visual language.
4. **Test coverage.** The Restocking view will be included in the R3 browser test suite.

**What "done" looks like:** Operations staff can enter a budget, see prioritized recommendations, and understand why each item was recommended. The view works correctly across all three warehouse filters.

---

## R3 — Automated Browser Testing

No automated tests were delivered by the previous vendor. This is the item Meridian IT needs to approve any future changes — which means it is, in practice, a prerequisite for everything else being maintainable after we leave.

**Our approach:**

We will use **Playwright** for end-to-end browser testing. Tests will be written against localhost and structured to run in CI. Coverage will focus on the two modules being actively changed:

- **Reports module:** filter interactions, data rendering, i18n string display, error states
- **Restocking view:** budget input, recommendation generation, filter behavior, edge cases (zero budget, no recommendations)

Tests will be written alongside the feature work, not as an afterthought at the end. Each defect fixed in R1 will have a corresponding regression test.

**What "done" looks like:** A Playwright test suite that runs cleanly, covers the agreed flows, and is documented well enough that Meridian IT can run it themselves and extend it.

---

## R4 — Architecture Documentation

Meridian IT needs to understand what they are running. The previous vendor's handoff notes are too thin to serve as operational documentation.

**Our approach:**

During the onboarding audit (Week 1), we will produce a current-state architecture overview covering:

- Component map: frontend views, API endpoints, data files, and how they connect
- Data flow diagrams for the three primary operations (inventory lookup, order tracking, demand/restocking)
- Dependency inventory: frontend packages, Python packages, runtime requirements
- Operational notes: how to run, how to deploy, what breaks and why

We will deliver this as an HTML document suitable for internal IT wikis, with a diagram that can be exported. It will be reviewed with Meridian IT before finalization.

**What "done" looks like:** A new member of Meridian IT can read this document and understand what the system is, how it runs, and where to look when something goes wrong.

---

## D2 — Internationalization (included in base scope)

The Tokyo team (12 staff, variable English proficiency) currently works in English-only views. The previous vendor implemented i18n in some modules but not all. We will extend existing internationalization patterns to the remaining untranslated views as part of the base engagement, with Japanese as the target language.

This is included in base scope because it is low-effort given the existing i18n infrastructure and addresses a real daily friction point for your team.

---

## D1 / D3 — UI Modernization and Dark Mode (optional)

**UI modernization (D1)** is scoped as an optional add-on. The existing visual design is functional; a full refresh would require a design pass and additional frontend time. We will provide a separate line-item estimate if Meridian wishes to pursue it.

**Dark mode (D3)** will be delivered as a stretch item within the base engagement if timeline permits in Week 9–10. Several warehouse floor stations operate in low-light environments — dark mode is a practical need, not a cosmetic one. If it falls outside the timeline, it will be scoped for a follow-on phase.
