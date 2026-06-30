# Pricing

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
*Submitted by: adesso SE | Date: April 28, 2026*

---

We are proposing a **fixed-fee engagement** for all required items (R1–R4). Optional extensions (D1–D3) are priced separately and can be added at any milestone gate without re-scoping the core engagement.

All fees are in USD. Payment is milestone-based — no payment is due until the corresponding gate deliverable is accepted.

---

## Core Engagement (R1–R4)

| Phase | Scope | Fixed Fee |
|---|---|---|
| Phase 1 — Stabilize | Reports module audit and full defect remediation (R1) | $18,000 |
| Phase 2 — Document | Architecture overview and IT handoff documentation (R4) | $9,000 |
| Phase 3 — Build | Restocking recommendations view, frontend and backend (R2) | $42,000 |
| Phase 4 — Test | Playwright end-to-end test suite, full coverage (R3) | $18,000 |
| **Total — Core Engagement** | | **$87,000** |

---

## Optional Extensions (D1–D3)

| Item | Scope | Fixed Fee |
|---|---|---|
| D1 — UI Modernization | Component-level refresh aligned to approved design reference | $22,000 |
| D2 — Internationalization | i18n extension to remaining modules; Japanese (ja) locale | $9,000 |
| D3 — Dark Mode | Operator-selectable theme, CSS custom properties, localStorage persistence | $9,000 |
| **All three extensions** | D1 + D2 + D3 (bundled) | **$36,000** |

Extensions bundled together receive a $4,000 discount versus individual pricing ($40,000 → $36,000), reflecting the efficiency of parallel delivery in the same engagement.

---

## Pricing Assumptions

The fixed fee is based on the following assumptions. Material changes to these assumptions may require a scope adjustment before work begins.

| # | Assumption |
|---|---|
| A1 | Codebase state matches the previous vendor's handoff notes. No undisclosed third-party systems or integrations. |
| A2 | R1 defect count does not exceed 20 discrete issues. If the audit reveals a substantially larger or more complex defect set, we will notify Meridian before proceeding and agree a revised scope in writing. |
| A3 | `/api/demand` data provides per-SKU, per-warehouse granularity sufficient for R2. If additional backend data work is required, it will be scoped separately. |
| A4 | Meridian provides timely feedback (within two business days) at each milestone gate. Delays beyond five business days may affect the delivery schedule. |
| A5 | D2 (i18n) requires translation of strings into Japanese only. Additional locales are out of scope. |

---

## Payment Schedule

| Milestone | Amount Due |
|---|---|
| Contract execution | 25% of core fee ($21,750) |
| Phase 1 gate accepted | 25% of core fee ($21,750) |
| Phase 3 gate accepted | 25% of core fee ($21,750) |
| Phase 4 gate accepted | 25% of core fee ($21,750) |

Optional extension fees are invoiced 50% at activation and 50% at delivery.

---

## Why Fixed Fee

Meridian's RFP notes that Director Okafor evaluates on price predictability. A fixed-fee structure transfers schedule and scope risk to adesso — Meridian pays for outcomes, not hours. Our ability to offer fixed fees on this engagement reflects our familiarity with this class of project: we have done this before, we know where the risk lives, and we have priced it accordingly.
