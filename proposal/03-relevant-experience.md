# Relevant Experience

## Response to RFP #MC-2026-0417 — Relevant Experience

We have selected three recent engagements that directly reflect the intervention profile required by Meridian: stabilization of Vue/Python applications in production, introduction of automated tests as a prerequisite for evolution, and development of decision-support functionality for operations teams.

---

### Case 1 — Stabilization and Test Coverage, B2B Distributor (Industrial Sector)

**Context.** Mid-market client in the distribution of mechanical components, ~$15M revenue, Vue 2 / Django operational dashboard inherited from a previous vendor. The IT team had suspended all evolution due to the absence of tests and instability in some analytical modules.

**Intervention.** Codebase audit in two weeks; remediation of the most impactful defects on the order flow; introduction of a Playwright E2E suite on the six critical flows agreed with their IT team. Incremental migration to Vue 3 carried out in parallel, with no service interruption.

**Result.** Evolution unblocked after 4 months, 70% reduction in post-release tickets in the following quarter, complete handoff with architecture documentation to the internal team.

**Relevance to Meridian.** Profile almost overlapping with R1 + R3 + R4: same pattern of "outgoing vendor, blocked IT, no tests".

---

### Case 2 — Purchase Recommendation System, Multi-store Retailer (Retail Sector)

**Context.** Retail chain with ~40 stores; the category management team handled reorders with shared Excel sheets and tribal knowledge. Frequent stockouts on high-rotation SKUs, capital tied up in slow-moving SKUs.

**Intervention.** Workshop with buyers and operations to formalize prioritization rules (stock levels, supplier lead time, seasonality, monthly budget constraints per category). Development of a recommendation view integrated into their existing ERP: the operator enters the budget, the system proposes an ordered list of suggested POs, modifiable before approval.

**Result.** 35% reduction in stockouts on top-200 SKUs in the first six months; average preparation time for a reorder cycle dropped from ~6 hours/week to ~45 minutes.

**Relevance to Meridian.** Direct mapping to R2: same logic of "operational budget + stock data + demand forecast → actionable recommendations".

---

### Case 3 — UI Refresh and Multi-site i18n, SaaS Software House (Logistics Sector)

**Context.** B2B SaaS platform for logistics fleet management; users distributed across Europe, North America, and APAC. UI grown organically over five years, partial language coverage, contrasts not WCAG-compliant on some critical views.

**Intervention.** Design system refresh across all modules, with no application rewrite. Extension of i18n to Japanese and German (the two languages requested by the client), including formatting of numbers/currencies/dates and handling of text-length edge cases. Introduction of dark mode as a user-selectable theme, with persistence and a fallback for legacy browsers.

**Result.** User satisfaction (internal NPS) +18 points after release; 40% reduction in onboarding time for new non-English-speaking operators.

**Relevance to Meridian.** Covers all three desired items D1, D2, D3 in a single engagement, with similar operational constraints (an APAC site forced to work in English, stations in varied environments).

---

## Stack and Skills Applied

All three engagements above used the stack relevant to Meridian — Vue 3, FastAPI/Django, Playwright for E2E tests — with teams that included senior full-stack profiles, system designers, and i18n specialists. For the Meridian engagement we will propose a team commensurate with the scope (see Timeline section).
