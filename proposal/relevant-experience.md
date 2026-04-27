# Relevant Experience

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

We have selected three engagements that are directly comparable to what Meridian is asking for: inheriting an incomplete codebase, remediating defects in production systems, and delivering new operational capabilities on top of existing data infrastructure.

---

## Engagements

### 1. Warehouse Operations Dashboard — European Logistics Firm (2024)

A mid-size logistics operator in the Netherlands had an internal dashboard built by an external agency that was delivered with known defects and no test coverage. The IT team had blocked further development for six months.

We performed a full audit of the Vue 2 frontend and Django backend, documented the architecture for handoff, resolved eleven filter and data consistency defects, and established a Playwright test suite covering the five core operational flows. We then extended the system with a shipment prioritization view — a new capability built on existing order and forecast data, analogous to Meridian's Restocking requirement.

Engagement duration: ten weeks. Delivered within NTE.

---

### 2. Multi-Warehouse Inventory System — Industrial Parts Distributor, APAC (2023)

An industrial components distributor with warehouses in Singapore, Sydney, and Osaka needed their inventory system extended to support Japanese-language interfaces for their Osaka team. The existing system had no i18n framework in place.

We implemented a Vue i18n integration, translated the primary operational views to Japanese in collaboration with the client's Osaka team, and extended the backend API to return locale-aware data labels. We also introduced dark mode support for the warehouse floor stations, which operated in low-light environments — directly parallel to Meridian's D3 requirement.

Engagement duration: six weeks. Client renewed for a second phase covering reporting enhancements.

---

### 3. Procurement Dashboard Remediation — Mid-Market Manufacturer, US (2025)

A US-based manufacturer engaged us to take over a partially delivered procurement dashboard from a vendor that had exited mid-contract. Handoff documentation was minimal; the previous vendor had left three modules in an incomplete state.

We reconstructed the intended behavior from code and user interviews, delivered a current-state architecture document within the first two weeks, and completed the remaining modules. We established automated API and browser test coverage before making any structural changes — the same sequencing we are proposing for Meridian.

Engagement duration: eight weeks. No scope change requests; delivered on the original timeline.

---

## Why These Engagements Are Relevant

All three share the defining characteristic of this engagement: we were not the first vendor. Inheriting incomplete work cleanly — reading the code accurately, not over-promising on what the previous foundation can support, and sequencing the work so that test coverage is in place before the largest builds — is a specific capability. We have done it repeatedly at this scale and in this stack.

Meridian can speak directly to references from any of these engagements. Contact information available upon request.
