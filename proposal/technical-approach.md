# Technical Approach

**Proposal in response to RFP #MC-2026-0417**

---

## Engagement Methodology

Our team conducted a comprehensive pre-proposal assessment of the existing solution architecture, source code, and prior vendor handoff documentation prior to authoring this response. The findings presented herein reflect direct empirical analysis of the current system state — not assumptions derived from general knowledge of comparable technology stacks. This approach enables us to provide accurate scoping estimates, minimize engagement risk, and deliver against commitments with a high degree of confidence from day one.

---

## R1 — Reports Module Remediation

Our technical assessment identified six discrete, confirmed defects within the Reports module. Each item below represents a verified finding from our pre-proposal code review, not an estimated risk area:

1. **Non-standard API integration pattern.** The Reports module bypasses the application's centralized API abstraction layer (`api.js`), instead executing direct HTTP calls to hardcoded service URLs. This architectural inconsistency prevents global filter state from propagating to Reports data and introduces a maintenance liability. Remediation will align the module with the established integration pattern used across all other application views.

2. **Legacy component architecture.** The Reports component is implemented using the Vue 2-era Options API, while all other views in the application have been migrated to Vue 3 Composition API. Our team will refactor the component to align with the current architectural standard, improving long-term maintainability and developer experience.

3. **Non-functional filter integration.** The application's global filter controls — warehouse, category, time period, and order status — have no effect on Reports data. Our team will implement full reactive filter integration, consistent with the behavior of the Inventory, Orders, and Spending modules.

4. **Residual diagnostic instrumentation.** The component contains a significant volume of developer-facing diagnostic statements (`console.log`) that were not removed prior to delivery. These will be eliminated as part of remediation, consistent with production-readiness standards.

5. **Non-standardized data formatting.** Monetary and numeric values within the Reports module are formatted via bespoke string manipulation logic rather than the platform's native internationalization APIs. Our team will standardize formatting across the component using `Intl`-compliant methods.

6. **Internationalization parity gap.** A structural asymmetry exists between the English and Japanese locale configuration files: translation keys for product and customer nomenclature are present in the Japanese locale but absent from the English locale. Our team will synchronize both locale files to ensure consistent behavior across all supported languages.

**Deliverable:** A fully remediated Reports module with all identified defects resolved, filter integration implemented and verified, and locale files brought into parity.

---

## R2 — Restocking Recommendations

We propose the following implementation approach for the net-new Restocking Recommendations capability:

**Backend Services:** A new RESTful endpoint (`GET /api/restocking`) will be introduced, accepting an optional `budget` query parameter. Recommendation logic will leverage existing inventory and demand forecast data assets to identify items at or below their defined reorder thresholds, prioritize candidates by demand urgency, calculate recommended order quantities and associated costs, and apply the operator-supplied budget ceiling to constrain the total proposed spend.

**Frontend Application:** A new `Restocking.vue` view will be developed in alignment with the Composition API architectural standard observed across the existing application. The interface will provide: a budget ceiling input with currency formatting; a sortable, filterable recommendations table surfacing item name, warehouse location, current stock level, reorder point, recommended quantity, unit cost, and line-item total; and a real-time budget utilization indicator. The view will be surfaced via the primary application navigation.

**Pre-Proposal Validation:** Our assessment confirmed that the required data attributes — reorder point thresholds and unit cost values — are present within the existing inventory data assets, eliminating a key implementation risk.

**Deliverable:** A production-ready Restocking Recommendations view integrated into the primary navigation, backed by a new API endpoint implementing budget-constrained, demand-prioritized reorder logic.

---

## R3 — Automated Browser Testing

The absence of automated test coverage has materially impacted Meridian IT's ability to approve and release changes to the current system. Our team will establish a comprehensive end-to-end browser test suite using the **Playwright** framework, targeting the production-equivalent local application environment.

The following critical user flows will be covered at initial delivery:

| User Flow | Validation Criteria |
|---|---|
| Dashboard summary load | KPI metrics render with valid, non-zero values; no runtime errors present |
| Inventory filtering — by warehouse | Filter application updates the data table; record count reflects selection |
| Inventory filtering — by category | Filter application updates the data table; record count reflects selection |
| Reports module render | Quarterly and monthly data tables populate; filter controls function as expected |
| Restocking — budget input | Budget value entry produces a corresponding recommendations update |
| Restocking — zero-budget edge case | A $0 budget ceiling produces an empty recommendations result set |

The test suite will be version-controlled within the client repository and executable via a single command, enabling Meridian IT to incorporate test execution into future change approval workflows.

**Deliverable:** A Playwright end-to-end test suite covering the flows enumerated above, with a fully passing baseline established at the point of handoff.

---

## R4 — Architecture Documentation

The prior vendor's technical handoff materials were found to be incomplete and partially inaccurate relative to the current system state. Our team will produce a comprehensive current-state architecture overview (`proposal/architecture.html`) as a self-contained, browser-renderable artifact suitable for distribution to and retention by Meridian IT.

Documentation coverage will include:

- **Presentation layer:** Vue 3 single-page application structure, view component inventory, API abstraction layer, and internationalization framework
- **Application layer:** FastAPI service architecture, endpoint catalogue, request filtering logic, and response model definitions
- **Data layer:** JSON-based data asset structure, in-memory data access patterns, and mock data generation approach
- **Cross-layer:** Inter-layer data flow, key integration patterns, and architectural constraints

**Deliverable:** `proposal/architecture.html` — a standalone, dependency-free artifact providing a complete current-state architecture reference for Meridian IT.

---

## D1 — UI Modernization

The existing design token system — encompassing the slate/gray color palette and status indicator conventions — constitutes a viable foundation for a modernization initiative. Our recommended approach extends and refines the existing token set rather than replacing it, preserving operational familiarity for current users while achieving a materially improved visual standard. Specific design decisions would be validated with Meridian's operations stakeholders prior to implementation.

## D2 — Internationalization Expansion

The application's internationalization infrastructure is architecturally sound and well-structured. Extending coverage to remaining English-only modules is a bounded, well-defined effort: identification of untranslated string keys, addition of corresponding entries to all active locale files, and replacement of hardcoded string literals within affected views. Estimated level of effort is two to three business days following acceptance of all required deliverables.

## D3 — Dark Mode

Operator-selectable dark mode will be implemented via a CSS custom property toggle mechanism, enabling seamless theme transition without page reload. Given the warehouse floor operational context, we recommend developing and validating this capability on an isolated feature branch, allowing independent review and acceptance without introducing risk to the primary delivery stream.

---

## Key Assumptions

1. Existing inventory data assets contain the required fields (reorder point, unit cost) to support Restocking recommendation logic. Confirmed via pre-proposal assessment.
2. Playwright is the designated browser testing framework; no alternative tooling evaluation is required.
3. Critical user flows for R3 are as enumerated above; Meridian retains the option to specify additional flows prior to engagement commencement.
4. Desired items (D1–D3) will be scoped and delivered following formal acceptance of all required deliverables (R1–R4).
5. The existing mock data architecture will be retained for the duration of this engagement; no database provisioning or migration is in scope.
