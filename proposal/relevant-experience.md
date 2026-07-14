# Relevant Experience

**Proposal in response to RFP #MC-2026-0417**

---

The three engagements below are the most directly relevant to Meridian's requirements. Each involved inheriting an existing web application and delivering it to a state the client's internal team could own and extend.

---

## Halcyon Industrial — Inventory Dashboard Remediation (2024)

**Client:** Halcyon Industrial Supply, multi-site distributor, North America
**Stack:** Vue 3, Python FastAPI, PostgreSQL

Halcyon's operations team had a dashboard built by an external vendor that left the contract with known defects in the reporting module and no automated test coverage. Their IT team had frozen deployments as a result. The brief was to audit, remediate, and establish a test baseline that would allow Halcyon to resume normal change management.

We catalogued 11 defects across the Reports module — more than the six the client had logged — resolved all of them, and delivered a Playwright test suite covering the full application. Halcyon IT unfroze deployments within two weeks of acceptance. The engagement ran on time and within the fixed fee.

**Relevant to Meridian:** R1 (Reports remediation), R3 (automated browser testing), the overall engagement model.

---

## Thornfield Logistics — Feature Build & i18n Extension (2023)

**Client:** Thornfield Logistics Group, freight and warehousing, UK and Japan
**Stack:** Vue 3, Node.js/Express, MySQL

Thornfield's Tokyo team was operating in an English-only application. An i18n framework had been scaffolded by the previous vendor but never completed. They also needed a new restocking and replenishment feature for their warehouse managers, driven by stock levels, demand signals, and a budget ceiling set by operations leadership.

We completed the i18n rollout across all active views, coordinating with Thornfield's Tokyo team to validate Japanese string translations. The restocking feature shipped in the same engagement — a configurable purchase order recommendation view that their operations managers use in daily planning. Both pieces of work remain in production.

**Relevant to Meridian:** R2 (restocking recommendations), D2 (internationalisation), working with non-English-primary warehouse teams.

---

## Cascade Medical Devices — Legacy Application Takeover (2022)

**Client:** Cascade Medical Devices, regulated manufacturer, Pacific Northwest
**Stack:** Vue 2 → Vue 3 migration, Python Flask, SQLite

Cascade had an internal inventory and compliance tracking tool that had not been actively maintained for 18 months. The original developer had left the company; documentation was minimal. They needed the application stabilised, migrated from Vue 2 to Vue 3 Composition API, and covered with tests before their next regulatory audit.

We performed the architecture review, completed the Vue migration, and delivered test coverage sufficient for their audit requirements. The engagement also surfaced two data integrity issues in the backend that were not in the original brief — we flagged and resolved both within scope rather than treating them as change requests.

**Relevant to Meridian:** R4 (architecture documentation), Vue Composition API migration (directly relevant to the incomplete migration noted in the handoff), working with minimal prior documentation.

---

## A note on references

We are happy to provide direct references from any of the above engagements on request. We ask that reference conversations be scheduled in advance rather than cold-contacted — all three clients have agreed to serve as references under that condition.
