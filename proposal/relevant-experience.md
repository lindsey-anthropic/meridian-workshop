# Relevant Experience

**RFP MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

We are a boutique software consultancy specialising in operations-facing web applications for mid-market industrial and logistics businesses. The engagements below are representative of our experience with the scope Meridian is asking for.

---

## Harwell Logistics — Dashboard Remediation & Extension

**Client:** Harwell Logistics Group, freight forwarding, ~240 employees
**Stack:** Vue 3, FastAPI, PostgreSQL
**Engagement:** 10 weeks

Harwell's internal shipment tracking dashboard had been delivered by a previous vendor and was unstable — multiple filters not functioning, no test coverage, and a data layer that had drifted significantly from the documentation. We conducted an independent audit, delivered an architecture overview to Harwell IT, remediated 11 documented defects, and extended the system with a new route optimisation view. We also established a Playwright test suite covering the four critical operator flows. Harwell IT now runs the test suite as part of their internal change approval process.

*Relevance to Meridian: directly parallel to R1, R3, and R4. Same stack (Vue 3 + FastAPI). Same starting condition — inherited system, minimal documentation, known defects.*

---

## Tanfield Industrial Supplies — Restocking & Procurement Module

**Client:** Tanfield Industrial Supplies, B2B distributor, ~120 employees
**Stack:** Vue 3, Django REST Framework, SQLite
**Engagement:** 8 weeks

Tanfield's operations team was managing restock decisions manually via spreadsheets. We designed and delivered a Restocking module within their existing inventory dashboard — combining stock levels, 90-day demand history, and a configurable budget ceiling to generate ranked purchase order recommendations. The feature reduced the time their procurement team spent on weekly restock planning by approximately 60%.

*Relevance to Meridian: direct precedent for R2. Similar operator profile (operations team, daily users, non-technical). Similar data inputs (stock + demand + budget).*

---

## Oselka Manufacturing — i18n & UI Modernisation

**Client:** Oselka Manufacturing, precision components, ~300 employees, operations in Germany and South Korea
**Stack:** Vue 3, Node.js
**Engagement:** 6 weeks

Oselka expanded into South Korea and needed their internal tooling localised for Korean-speaking staff who had been working in German-only views. We audited i18n coverage across 14 views, extended translations to all remaining modules, and delivered a UI refresh aligned to Oselka's existing brand guidelines. All translation strings were flagged for client review before implementation.

*Relevance to Meridian: precedent for D1 and D2. Multi-warehouse, multi-language context. Similar situation to Tokyo team.*

---

## A note on engagements like this one

A common thread across our work is inheriting systems from previous vendors and leaving them in materially better shape — documented, tested, and maintainable. We do not treat remediation engagements as a different category of work from greenfield builds. The due diligence is higher, the communication requirements are higher, and the obligation to leave the client independent is higher. That is the work we are proposing to do for Meridian.
