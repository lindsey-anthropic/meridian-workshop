great# Technical Approach

**RFP #:** MC-2026-0417
**Prepared by:** [Your Firm Name]
**Date:** April 24, 2026

---

Our approach to this engagement is straightforward: inherit responsibly, fix what is broken, build what is missing, and leave the system in a state that Meridian's own team can confidently maintain and evolve. We have reviewed the previous vendor's handoff notes and the source code; we know what we are stepping into, and we are ready to own the outcome.

---

## R1 — Reports Module Remediation

The previous vendor acknowledged at handoff that the Reports module was unfinished. Because no formal defect list was provided with the RFP package, we are treating the full audit as in-scope: we will discover, document, and remediate every defect in the module before considering this item closed.

Our process:

1. **Audit** — Systematically exercise every filter, data view, and user interaction in the Reports module. Document each defect with steps to reproduce, expected behavior, and actual behavior.
2. **Root cause** — Trace each defect to its source: unwired filters, missing i18n keys, inconsistent API response handling, or frontend rendering issues.
3. **Remediate** — Fix each defect in line with the existing codebase patterns. We will not introduce new architectural complexity to fix Reports issues.
4. **Verify** — Confirm each fix against the documented expected behavior and regression-test adjacent functionality.

**Deliverable:** A fully functional Reports module and a written defect log (issue, root cause, resolution) delivered to Meridian IT.

---

## R2 — Restocking Recommendations

This is the capability Meridian's operations team has been waiting for. The Restocking view will give operators a clear, data-driven answer to the question: *given what we have in stock, what we expect to sell, and what we can spend — what should we order, and how much?*

We will build the Restocking view as a new module within the existing Vue/FastAPI application, consistent with the current architecture. No database migration is required; the feature works within the existing data layer.

**How it works:**

- The operator enters a budget ceiling for the purchase cycle
- The system pulls current stock levels and demand forecast data already present in the application
- A recommendation engine ranks purchase order candidates by need (stock vs. forecast gap) and fits as many as possible within the budget ceiling
- Results are presented as a prioritized list: item, recommended order quantity, estimated cost, and supplier

**Design principles:**

- Operator control first — the budget ceiling is always visible and adjustable; results update accordingly
- No black box — the reasoning behind each recommendation (why this item, why this quantity) is surfaced in the UI
- Fits existing patterns — data flow follows the same Vue → API → FastAPI → Pydantic path the rest of the application uses

**Deliverable:** A working Restocking view integrated into the application navigation, accessible to all warehouse operators.

---

## R3 — Automated Browser Testing

The absence of test coverage is the single biggest risk to Meridian's ability to evolve this system safely — and your IT team is right to treat it as a blocker. We will establish a Playwright-based end-to-end test suite that covers the critical user flows and is structured so your team can extend it as the application grows.

We will propose the coverage scope based on our architecture review, but our starting point for critical flows is:

- Dashboard summary (load, filter by warehouse and time period)
- Inventory browse (filter by category and warehouse, stock level display)
- Orders view (filter by status and month)
- Reports module (all filters, data table rendering — this doubles as regression coverage for R1)
- Restocking view (budget input, recommendation generation, list display)

**Deliverable:** A documented test suite, structured for CI integration, with a coverage summary suitable for IT sign-off.

---

## R4 — Architecture Documentation

We will conduct the architecture review as part of our onboarding — not as a final deliverable bolted on at the end. Understanding the system deeply at the start makes everything else go faster and reduces surprises mid-engagement.

The documentation will include:

- A visual component diagram showing the relationship between frontend views, the API client, FastAPI endpoints, and the data layer
- A data flow narrative explaining how filters and user actions translate into API calls and rendered data
- A brief assessment of the current state: what is consistent, what is not, and what we addressed during the engagement

**Audience:** Meridian IT — written for a technical reader who did not build the system and needs to support it going forward.

**Deliverable:** Architecture overview document (visual + written narrative), delivered at engagement close.

---

## Desired Items (D1–D3)

We are prepared to deliver the desired items as optional extensions within the same engagement. Each is scoped and priced separately so Meridian can choose what to prioritize.

**D1 — UI Modernization:** A visual refresh within the existing component structure. If Meridian has brand guidelines or a preferred reference, we will align to them; otherwise we will propose a direction for sign-off before implementation begins.

**D2 — Internationalization:** Japanese locale for Tokyo warehouse staff, covering all existing modules and the new Restocking view. We will assess London's needs during onboarding and flag if additional locales are warranted.

**D3 — Dark mode:** An operator-selectable theme implemented via CSS custom properties — a low-friction approach that does not require restructuring the component library. Suitable for the low-light warehouse floor environments described in the RFP.

---

## Assumptions & Exclusions

- The JSON data layer is retained as-is; no database migration is in scope
- No infrastructure changes are included
- Defects discovered outside the Reports module during engagement are subject to a formal change-order process
- UI direction for D1 requires either client-supplied brand guidelines or written sign-off on a vendor-proposed direction before work begins
