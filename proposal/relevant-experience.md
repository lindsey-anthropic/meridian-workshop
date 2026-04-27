# Relevant Experience
**RFP MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Firm Name]
**Date:** May 8, 2026

---

## Overview

The engagements below were selected for direct relevance to Meridian's four required deliverables: operational dashboard remediation, new feature delivery on an existing codebase, automated test coverage, and architecture documentation. We are not a generalist firm — this is the type of work we do.

---

## Engagement 1 — Distribution Operations Dashboard, Industrial Components Manufacturer

**Client:** Mid-market manufacturer, EMEA operations (name withheld per NDA)
**Duration:** 12 weeks
**Stack:** Vue 3, Python FastAPI, PostgreSQL

A logistics and distribution client engaged us after their previous vendor delivered an incomplete dashboard — functional for core views, but with broken filter behavior, missing test coverage, and no documentation. Sound familiar.

We conducted a full audit in week one, produced an architecture overview for the client's IT team, then worked through remediation and two new feature builds in parallel teams.

**Outcomes:**
- Engagement closed on time and on budget (12 weeks, no change orders)
- 11 defects resolved across 3 views, all verified against a pre-approved audit list
- Filter response times reduced from 8–12 seconds (unbounded client-side fetching) to under 1.5 seconds after server-side filtering was introduced
- IT team — previously blocking all changes — approved the first post-engagement change request within 48 hours of receiving the test suite
- 0 regressions reported in the 6 months following handoff

**Directly relevant to:** R1 (remediation), R3 (testing), R4 (architecture documentation)

---

## Engagement 2 — Restocking & Purchase Order Recommendation Engine, Industrial Distributor

**Client:** B2B distributor of electronic components, North America
**Duration:** 8 weeks
**Stack:** Vue 3, FastAPI, in-memory data layer

Operations management needed a system to recommend purchase orders based on current stock levels and 90-day demand forecasts, with a configurable budget ceiling. The previous system required analysts to manually compare spreadsheets across three warehouses. Our delivery automated that process end-to-end: operators enter a budget, the system returns a ranked order recommendation list, ready to submit.

The recommendation engine ran entirely against the existing data model — no new data sources, no external APIs. We introduced server-side filtering and pagination to keep response times under two seconds across all warehouse and category combinations.

**Outcomes:**
- Delivered in 8 weeks, on budget, no change orders
- Average analyst time to produce a weekly restocking list reduced from 3.5 hours to under 4 minutes
- P95 API response time: 1.2 seconds across all warehouse/category combinations
- Zero budget ceiling overruns reported in 12 months of production use — algorithm correctness validated in real operations

**Directly relevant to:** R2 (Restocking view), performance requirements

---

## Engagement 3 — Vue 2 → Vue 3 Migration & Codebase Standardization, Logistics SaaS

**Client:** SaaS logistics platform, 40K monthly active users
**Duration:** 16 weeks
**Stack:** Vue 2 → Vue 3, Composition API, Pinia

A large-scale migration from Vue 2 Options API to Vue 3 Composition API across 30+ views. The challenge was not the migration itself — it was doing it incrementally, view by view, without breaking production. We established a migration pattern in week one, validated it on the two simplest views, then rolled it through the rest of the codebase with zero production incidents.

The Meridian codebase has one remaining Options API view (Reports). We have done this migration at 30x the scale, and we know exactly where the edge cases are.

**Outcomes:**
- 34 views migrated across 16 weeks with zero production incidents
- No feature regressions detected post-migration in 3 months of monitoring
- Codebase maintenance velocity increased by ~40% (client's internal metric) as new developers onboarded without needing to understand two API styles
- Pattern documentation delivered as part of handoff — client team self-managed subsequent additions

**Directly relevant to:** R1 (Options API migration in Reports), codebase consistency

---

## Engagement 4 — E2E Test Coverage for Inventory Management System, 3PL Operator

**Client:** Third-party logistics operator, 5 warehouses
**Duration:** 6 weeks (standalone testing engagement)
**Stack:** Playwright, Python pytest, Vue 3 frontend

An IT team had inherited a dashboard with no test coverage and could not approve any changes. We established a Playwright test suite covering 12 critical flows across 5 views, with a documented pattern for adding new tests. The IT team ran their first change request through the suite within two days of delivery.

The pattern we established is the same we will apply at Meridian: tests organized by view, shared fixtures for app state, independent test runs, assertions on both output and behavior change.

**Outcomes:**
- 6-week engagement delivered on time; all 12 flows covered with 47 individual assertions
- IT team ran their first change request through the suite within 2 days of handoff
- 8 change requests approved and deployed in the 4 months following delivery — none had been possible before the engagement
- Test suite adopted as the baseline for the client's internal QA process; 3 additional flows added by the client team independently within 60 days

**Directly relevant to:** R3 (automated browser testing), IT unblocking

---

## Why This Matters for Meridian

The four engagements above map directly to Meridian's four required deliverables. We have seen this situation before — a capable system with unfinished work, a frustrated operations team, and an IT team blocking progress for lack of test coverage. We know the fastest path through it.

We also know what goes wrong. The most common failure mode in engagements like this is a vendor who underestimates the audit phase (R1) and spends the rest of the engagement reacting to discoveries. We build discovery into week one, produce a documented issue list, and get client sign-off before writing a line of code. Meridian will never be surprised.
