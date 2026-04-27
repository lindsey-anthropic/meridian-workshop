# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**
**Submitted by:** Accenture&CT Consulting

---

## Delivery Sequence

The RFP lists requirements in Meridian's priority order: R1, R2, R3, R4. We are proposing a different sequence — and we want to be transparent about why.

Your IT team cannot safely approve changes to the current system because there are no automated tests. That means any defect fixes or new features we deliver without first establishing test coverage land in the same uncertain state the system is in today. The risk doesn't go away; it compounds.

Our proposed sequence is: **R3 → R4 → R1 → R2**, with D1–D3 as optional extensions.

We establish test coverage first. Then we audit the architecture (R4), which runs in parallel during onboarding and informs how we scope the subsequent work. Then we fix the Reports module (R1) — with every fix verified by a test before it merges. Then we build the Restocking view (R2) — on a foundation that is stable and covered.

This sequence costs nothing in timeline. It earns the trust of your IT team on day one, and it means every deliverable that follows is demonstrably correct.

---

## R3 — Automated Browser Testing

**Tool:** Playwright. It is the current standard for end-to-end testing of Vue applications, with first-class support for component interaction, navigation, and network interception.

**Coverage scope:** We will write tests covering all primary user journeys across every view: Inventory, Orders, Reports, Spending, and Demand. Coverage includes:
- All filter combinations (Time Period, Warehouse, Category, Order Status)
- Full read flows for each view
- Edge cases: empty states, no-data conditions, error responses
- Navigation and routing between views

Tests will run against a local development server and will be structured for CI integration so your IT team can run them on any proposed change going forward.

**Assumption:** "Critical flows" means all primary user journeys, not a subset. If Meridian has a narrower definition, we can adjust — but full coverage is what gives IT unconditional approval authority over future changes.

---

## R4 — Architecture Documentation

**Deliverable:** An HTML architecture overview (interactive diagram + narrative) suitable for handoff to Meridian IT, plus a written summary of gaps and risks identified during onboarding.

**Scope:** We will document the current-state architecture from first principles — not from the previous vendor's notes, which we have reviewed and found incomplete. This will include:
- Frontend component map: views, shared components, composables, i18n layer
- Backend API routes and their filter/response contracts
- Data flow from Vue filters through the API client to FastAPI and back
- Known technical debt: partial Options API migration, unwired filters, missing test coverage

**Audience:** This document is written for Meridian IT, not for us. The goal is that your internal team can pick up the system, understand it, and make changes without needing to call us.

---

## R1 — Reports Module Remediation

We will conduct a systematic audit of the Reports module against all logged issues (RFP cites at least eight). Based on our initial review of the handoff notes, the known problem areas are:

- **Filter wiring:** Not all filters (Time Period, Warehouse, Category, Order Status) are correctly applied to Reports data fetches
- **Internationalization gaps:** Some labels, date formats, or numeric formats in Reports are not routed through the i18n layer
- **Console noise:** Error or warning output visible in browser developer tools indicating unhandled states
- **API pattern inconsistencies:** Some Reports components use the older Options API pattern rather than the Composition API used in newer views — a likely source of reactivity issues

Every fix will be accompanied by a Playwright test that verifies the corrected behavior before the fix merges. We will not deliver a fix we cannot verify.

---

## R2 — Restocking Recommendations

The Restocking view is a new capability. It will allow operations staff to:
1. Set a budget ceiling for a given purchase cycle
2. See ranked purchase order recommendations across warehouses and product categories
3. Understand the basis for each recommendation (current stock, demand forecast, reorder threshold)

**Data sources:** Current stock levels from `/api/inventory`, demand forecasts from `/api/demand`, budget ceiling as operator input. No external supplier API is required — recommendations are generated from existing data using reorder logic (stock vs. demand vs. budget priority).

**Implementation approach:** New Vue view following the Composition API patterns established in the existing codebase. New FastAPI endpoint aggregating inventory and demand data with budget-constrained ranking logic. Fully covered by Playwright tests.

**Assumption:** The initial delivery is advisory — the view suggests purchase orders; it does not submit them. We have delivered transactional procurement integrations in prior engagements and are prepared to scope that capability if Meridian wants to pursue it. We recommend confirming whether that is in scope before the engagement starts, as it would affect timeline and pricing.

---

## Desired Items (D1–D3)

We are including the desired items in our scope as optional extensions. They can be added within this engagement or deferred to a follow-on — Meridian's call based on budget and timeline.

**D1 — UI Modernization:** Refresh the visual design to a clean, modern SaaS aesthetic: improved typography, consistent spacing, polished component states. We will not introduce a new component library — we will refine the existing design token system for maximum compatibility with minimal risk.

**D2 — Internationalization:** Extend i18n coverage to all remaining views. The existing i18n framework (locale files in `client/src/locales/`) is the right foundation. Priority is Tokyo-facing content. Japanese translations will require Meridian's review for accuracy — we will deliver the framework wiring; content sign-off is a Meridian responsibility.

**D3 — Dark Mode:** Operator-selectable theme using CSS custom properties. This is the right approach for the existing codebase — low implementation risk, easily reversible, and compatible with the design token system.

---

## Assumptions

The following assumptions underpin this technical approach. We ask Meridian to flag any that do not match your understanding.

1. "Critical flows" for R3 = all primary user journeys across all views, including filters and edge cases.
2. The initial Restocking delivery is advisory. Transactional procurement integration is available as an extension — to be confirmed before engagement start.
3. No external supplier API integration is in scope unless confirmed under assumption 2.
4. D2 Japanese translations require Meridian content review — we wire the framework, Meridian approves the copy.
5. The existing Vue 3 / FastAPI / JSON-file stack is retained. No database migration is in scope.
6. "Current standards" for D1 means a clean modern SaaS aesthetic, not a specific Meridian brand guide.
