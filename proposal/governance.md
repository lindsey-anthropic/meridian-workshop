# Governance & Engagement Model
**RFP MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Firm Name]
**Date:** May 8, 2026

---

## Communication Plan

### Regular Cadence

| Meeting | Frequency | Participants | Format | Duration |
|---------|-----------|--------------|--------|----------|
| Weekly status call | Every Monday | Lead Consultant + Meridian point of contact | Video call | 30 min |
| Milestone review | End of each phase | Lead Consultant + R. Tanaka + IT representative | Video call + screen share | 60 min |
| Ad hoc issue escalation | As needed | Lead Consultant + relevant Meridian stakeholder | Video call or email | As required |

### Weekly Status Report
Delivered every Friday by email to J. Okafor and R. Tanaka. Contents:
- Work completed in the current week
- Work planned for the following week
- Any open decisions or blockers requiring Meridian input
- Budget consumption (person-days spent vs. planned)
- RAG status per active workstream (Green / Amber / Red)

### Communication Channels
- **Primary:** Email (project mailing list, all parties)
- **Real-time:** Microsoft Teams or Slack — Meridian's preference at kickoff
- **Issue tracking:** Shared document or lightweight tool (Notion, Confluence, or equivalent) — Meridian's preference at kickoff

---

## Milestone Acceptance Criteria

Each milestone requires formal sign-off from the Meridian point of contact before the next phase begins and before the associated payment is triggered. The following criteria define "complete" for each deliverable.

### Milestone 1 — Architecture Document & Defect Catalogue (end of week 2)

| Criterion | Verification |
|-----------|--------------|
| `architecture.html` delivered and accessible without external dependencies | Open in browser, verify all four layers are documented |
| All discovered defects listed with type, severity, and proposed fix | Meridian IT reviews and confirms the list is complete against their internal records |
| Development environment confirmed running locally | Lead Consultant shares screen demonstrating frontend (port 3000) and backend (port 8001) running simultaneously |

**Review window:** 3 business days from delivery. Silence after 3 days constitutes approval.

---

### Milestone 2 — Reports Remediation (end of week 4)

| Criterion | Verification |
|-----------|--------------|
| All 4 filters (Period, Warehouse, Category, Status) produce correct, scoped API calls in the Reports view | Manual walkthrough with R. Tanaka: select each filter combination, verify results change correctly |
| Filter response time ≤ 2 seconds for any combination | Measured in browser DevTools Network panel; three consecutive tests per filter combination |
| All identified i18n gaps resolved — Reports strings render in Japanese when locale is set to 日本語 | Switch locale, verify all UI strings translate |
| Reports.vue fully migrated to Composition API with no direct axios calls | Code review by Meridian IT if requested |
| PurchaseOrderModal functional — "Create PO" button on Dashboard opens modal without errors | Manual test; browser console shows no errors |
| Remediation report delivered in table format | Document delivered by email |

**Review window:** 3 business days. Meridian IT may request a code review session; we will accommodate within the window.

---

### Milestone 3 — Test Foundation (end of week 6)

| Criterion | Verification |
|-----------|--------------|
| Playwright test suite committed to repository | Meridian IT clones the repo and runs `npx playwright test` locally — all tests pass |
| Dashboard summary tests cover: app load, KPI tiles non-empty, filter change produces different output | Tests observed running by IT representative |
| Reports smoke tests cover: all 4 filter types change displayed data, no console errors | Tests observed running by IT representative |
| README documents local execution and CI integration steps | IT representative confirms they can follow the README without vendor assistance |

**Review window:** 3 business days.

---

### Milestone 4 — Restocking View + Full Test Suite + Handoff (end of week 10)

| Criterion | Verification |
|-----------|--------------|
| Restocking view accessible from main navigation | R. Tanaka navigates to the view independently |
| Budget ceiling input functional — system returns recommendations within budget | Enter three different budget values; verify cumulative spend in results never exceeds input |
| Recommendations ranked by urgency and cost efficiency, as specified | R. Tanaka reviews output with knowledge of stock levels; ranking is explainable |
| Filter response time ≤ 2 seconds for any Warehouse + Category combination | Measured in browser DevTools; three tests per combination |
| Restocking E2E tests pass alongside full test suite | Full `npx playwright test` run; all tests green |
| Handoff package delivered: architecture document (updated if applicable), remediation report, test README, this governance document | Received by J. Okafor and Meridian IT |

**Review window:** 5 business days (extended for final milestone).

---

## Change Order Process

If Meridian requests work outside the scope defined in the Technical Approach, we follow this process:

1. **Request received** (email or meeting)
2. **Impact assessment** within 3 business days — scope, effort in person-days, fee impact, timeline impact
3. **Written change order** sent to J. Okafor for signature
4. **Work begins** only after countersigned change order is received

No scope changes will be executed on verbal instruction. The base fixed fee is protected against undocumented scope additions.

---

## Warranty Period

Following final sign-off at Milestone 4, we provide a **45-day warranty period** at no additional cost. During this period:

- Any defect directly attributable to work delivered in this engagement will be fixed within 5 business days of written notification
- The warranty covers functional regressions — it does not cover new feature requests, data model changes, or issues introduced by Meridian's own modifications to the codebase
- Warranty issues are reported to the Lead Consultant by email; we do not require a formal change order for warranty work

After the warranty period, ongoing support can be engaged under a separate maintenance agreement.

---

## Data & Compliance Considerations

**London warehouse — UK GDPR:** Meridian's London operations fall under UK GDPR. The current system stores no personal data in its data layer (inventory, orders, demand forecasts are product and order data, not personal data). The `transactions.json` file contains vendor names; these are business entities, not individuals. We do not anticipate GDPR implications for the work in scope, but Meridian's legal counsel should confirm this assessment prior to contract execution.

**CORS configuration:** The current backend runs with `allow_origins=["*"]` — appropriate for development, not for production. This is outside the scope of this engagement but is flagged as a production readiness item Meridian IT should address before any public or network-exposed deployment.

**Data persistence:** All data is held in JSON files loaded into memory at startup. Writes (e.g., purchase order creation) are lost on server restart. This is outside scope but should be addressed before the system handles live operational data at scale.
