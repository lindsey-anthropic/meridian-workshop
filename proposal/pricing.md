# Pricing
**RFP MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Firm Name]
**Date:** May 8, 2026

---

## Engagement Model

Fixed-fee. The total below covers the full scope of R1–R4 as described in the Technical Approach. No hourly billing, no end-of-project reconciliation. Scope changes requested by Meridian are assessed and agreed in writing before work proceeds — the base fee is protected in both directions.

---

## Pricing Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Daily rate | €500 / person-day | Average blended rate for the delivery team |
| CCI | 43% | Internal overhead coefficient (benefits, facilities, management) applied on direct labor |
| Technical contingency | 15% | Buffer for execution risk, scope uncertainty at audit, and technical unknowns |
| Commercial contingency | 20% | Commercial margin and residual risk coverage |
| **Effective daily sell rate** | **€986.70 / person-day** | €500 × 1.43 × 1.15 × 1.20 |

---

## Effort Breakdown

| Requirement | Activity | Days |
|-------------|----------|-----:|
| **R4 — Architecture** | Kickoff, environment setup | 2 |
| | Full codebase audit & defect catalogue | 4 |
| | Architecture document (4-layer HTML) | 4 |
| **R4 subtotal** | | **10** |
| | | |
| **R1 — Reports** | Filter wiring & server-side filtering | 4 |
| | Performance validation (2s ceiling) | 2 |
| | Options API → Composition API migration | 4 |
| | i18n coverage — Reports EN + JA | 3 |
| | Direct axios → api.js refactor + error handling | 2 |
| | PurchaseOrderModal component (audit finding) | 3 |
| | QA & remediation report | 2 |
| **R1 subtotal** | | **20** |
| | | |
| **R3 — Testing** | Playwright setup & shared fixtures | 2 |
| | Dashboard summary test suite | 3 |
| | Reports smoke tests (4 filter types) | 3 |
| | Restocking E2E tests (delivered with R2) | 2 |
| | Test documentation & CI integration guide | 2 |
| **R3 subtotal** | | **12** |
| | | |
| **R2 — Restocking** | Backend `/api/restocking` endpoint | 5 |
| | Ranking algorithm + budget ceiling logic | 5 |
| | Frontend Restocking view (full build) | 10 |
| | Pagination, debounce, performance validation | 5 |
| | Edge cases, QA, cross-warehouse testing | 4 |
| | Final review session & handoff package | 3 |
| **R2 subtotal** | | **32** |
| | | |
| **Project Management** | Milestone reviews (×5), status updates, change order mgmt | 8 |
| **PM subtotal** | | **8** |
| | | |
| **TOTAL** | | **82** |

---

## Cost Build-up

| Step | Calculation | Amount |
|------|-------------|-------:|
| Direct labor cost | 82 days × €500 | €41,000 |
| + CCI (43%) | €41,000 × 1.43 | €58,630 |
| + Technical contingency (15%) | €58,630 × 1.15 | €67,425 |
| + Commercial contingency (20%) | €67,425 × 1.20 | **€80,910** |

---

## Fee by Requirement

| Requirement | Person-days | Fee |
|-------------|------------:|----:|
| R4 — Architecture documentation | 10 | €9,867 |
| R1 — Reports remediation (incl. PurchaseOrderModal) | 20 | €19,734 |
| R3 — Automated browser testing | 12 | €11,840 |
| R2 — Restocking recommendations | 32 | €31,574 |
| Project management | 8 | €7,894 |
| **Total** | **82** | **€80,909** |

> **Note on the PurchaseOrderModal finding:** code analysis identified a missing component that the Dashboard references but does not exist — the "Create PO" button is non-functional. This defect was not listed in the RFP. We have included the 3-day fix in R1 rather than surface it as a mid-engagement change order. If Meridian wishes to exclude it, R1 reduces by 3 days (−€2,960) and the total becomes **€77,949**.

---

## Payment Schedule

| Milestone | Trigger | Amount |
|-----------|---------|-------:|
| Contract execution | Signature | €16,182 (20%) |
| R4 delivered & approved | Week 2 sign-off | €16,182 (20%) |
| R1 delivered & approved | Week 4 sign-off | €16,182 (20%) |
| R3 partial delivered & approved | Week 6 sign-off | €16,182 (20%) |
| R2 + full R3 delivered & approved | Week 10 sign-off | €16,181 (20%) |
| **Total** | | **€80,909** |

Payments due within 15 days of milestone sign-off. No payment is triggered by calendar date — only by approved delivery.

---

## Optional Scope — Desired Requirements (D1–D3)

The following items are not included in the base fee but are priced below as optional additions. Each can be added independently or together. Pricing uses the same parameters as the base engagement (€986.70 / person-day).

| Item | Description | Days | Indicative Fee |
|------|-------------|-----:|---------------:|
| D1 — UI modernization | Refresh visual design using Meridian's brand colours as baseline — spacing, typography, component consistency. No design system required; we work from the existing colour tokens. | 8 | €7,894 |
| D2 — i18n extension | Extend Japanese translation coverage to all remaining modules (Inventory, Orders, Demand, Spending, Backlog). Tokyo warehouse staff currently work in English-only views. | 6 | €5,920 |
| D3 — Dark mode | Operator-selectable theme toggle using CSS custom properties. Preserves all existing styles; dark palette applied as an overlay. Suitable for low-light warehouse floor stations. | 5 | €4,934 |
| **All three (D1 + D2 + D3)** | | **19** | **€18,748** |

> Adding all three desired items brings the total engagement to **€99,657** (82 + 19 = 101 person-days). This remains within a defensible budget range for a 12-week engagement covering the full RFP scope.

If Meridian wishes to include any desired items, we recommend confirming by the end of week 4 (after R1 sign-off) so they can be incorporated into the Phase 4 schedule without extending the overall timeline.

---

## Items Outside All Scope

- CI/CD pipeline configuration
- Hosting, infrastructure, or deployment changes
- Database migration (JSON files → persistent store)
- Ongoing support or maintenance after handoff (covered separately under warranty — see Governance document)

---

## Pricing Assumptions

Pricing is based on assumptions A1–A8 from the Technical Approach. Material scope changes — in particular a Reports defect list substantially larger than the audit produces, or a requirement to integrate Restocking with external data sources — will be handled via written change order assessed before work proceeds.
