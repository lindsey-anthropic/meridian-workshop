# Pricing and Payment Terms

**RFP #MC-2026-0417 — Inventory Dashboard Modernization**
**Submitted by:** [Your Firm Name]
**Date:** May 8, 2026

---

## Engagement Model

We propose a **fixed-fee engagement with milestone-based payments**. Fixed-fee protects Meridian from budget overruns on well-defined scope; milestone payments align our incentives with delivery, not time spent.

All prices below are in USD. Work is performed remotely. Expenses (travel, third-party licenses) are billed at cost with prior written approval and are not included in the figures below.

---

## Fee Schedule — Required Items (R1–R4)

| Phase | Scope | Fixed Fee |
|-------|-------|-----------|
| Phase 1 — Foundation | Architecture doc (R4) + defect register + test scaffolding (R3 partial) | $18,000 |
| Phase 2 — Stabilization | Reports remediation (R1) + test suite extension (R3 partial) | $24,000 |
| Phase 3 — New Capability | Restocking view (R2) + test suite complete (R3) | $32,000 |
| **Total — Required** | **R1 + R2 + R3 + R4** | **$74,000** |

---

## Fee Schedule — Desired Items (D1–D3)

Desired items are priced as optional add-ons. Each can be added or removed independently after Phase 3 sign-off.

| Item | Scope | Fixed Fee |
|------|-------|-----------|
| D1 — UI modernization | Updated stylesheet + component library | $12,000 |
| D2 — i18n extension | Full key coverage + Japanese locale | $10,000 |
| D3 — Dark mode | Theme toggle + persistent preference | $6,000 |
| **Total — Desired (all three)** | | **$28,000** |

---

## Engagement Ceiling

| Scenario | Total |
|----------|-------|
| Required items only (R1–R4) | $74,000 |
| Required + all desired (R1–R4, D1–D3) | $102,000 |

**Not-to-exceed: $102,000.** Any work beyond this ceiling requires a written change order signed by both parties.

---

## Payment Milestones

| Milestone | Trigger | Amount |
|-----------|---------|--------|
| Kick-off | Contract execution | 20% ($14,800) |
| Phase 1 complete | Architecture doc + defect register accepted | 15% ($11,100) |
| Phase 2 complete | Reports remediation demo accepted by Meridian | 25% ($18,500) |
| Phase 3 complete | Restocking demo + full test suite accepted | 25% ($18,500) |
| Phase 4 complete (if in scope) | Desired items accepted | 15% ($11,100) |
| **Total** | | **$74,000–$102,000** |

*If desired items are not in scope, the final 15% is triggered at Phase 3 acceptance.*

---

## Assumptions Affecting Price

The following assumptions underpin this pricing. A material change to any of them may require a revised estimate, handled via written change order before additional work begins.

| # | Assumption | Impact if wrong |
|---|---|---|
| A1 | No database migration; existing JSON layer retained | Adding a database (schema design, migration, ORM) would add $8,000–$15,000 |
| A2 | Reports defect count is 8–12 after audit | >15 defects would trigger a scope review before Phase 2 begins |
| A3 | Demand forecast data at `/api/demand` is sufficient for Restocking logic | A custom forecast model would add $6,000–$10,000 |
| A4 | No new third-party UI framework or design system introduced | Adopting a new component library (e.g. full Tailwind UI migration) would add $8,000–$12,000 |
| A5 | Single Japanese locale for D2; additional locales priced separately | Each additional locale beyond Japanese is $2,500 |

---

## What Is Not Included

- Hosting, infrastructure, or cloud services of any kind
- Training or documentation beyond the architecture overview (R4)
- Ongoing support or maintenance after final delivery acceptance
- Any work not explicitly listed in RFP §3 or this proposal

Post-delivery support is available under a separate retainer agreement at $180/hour, minimum 10 hours/month.

---

*Questions on pricing: contact [Your Firm Name] at [contact email] before May 8, 2026.*
