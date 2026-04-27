# Pricing

## Response to RFP #MC-2026-0417 — Commercial Model

The RFP (§4.5) allows both a fixed-fee model and a T&M-with-not-to-exceed model. We propose a **fixed-fee per phase**, with the reference scope made explicit for each phase. This approach:

- gives Meridian full visibility on the cost of each milestone before go-ahead;
- holds the vendor accountable for respecting the agreed scope;
- allows a stop to be evaluated after each phase (in particular before the desired items D1–D3).

Alternatively, the engagement can be structured as **T&M with overall NTE**, aligned to the person-day count indicated below. The choice rests with Meridian.

---

## Team Composition

| Role | Allocation | Notes |
|---|---|---|
| Senior Full-stack Lead | 100% (18 weeks) | Technical point of contact, architectural ownership |
| Full-stack Engineer | 100% (18 weeks) | R1, R2 development, support for desired items |
| QA / Test Automation Engineer | ~50% (focus weeks 4–12) | R3 E2E suite, R1 and R2 validation |
| UX Designer | ~30% (focus weeks 8–14) | R2 mockups, D1 refresh |
| Engagement Manager | ~20% (entire engagement) | Governance, risks, communication with the Meridian sponsor |

---

## Effort and Cost per Phase

> **Reference blended daily rate: €*[to be inserted]* / day.**
> The Euro values below are calculated on a placeholder rate and must be recalculated with the firm's rate card before submission.

### Phase 1 — Stabilization (R1 + R3 + R4)

| Activity | Person-days |
|---|---|
| Discovery, Reports audit, R2 kickoff | 12 |
| R1 — Reports remediation | 28 |
| R3 — Playwright setup + E2E suite | 24 |
| R4 — Architecture documentation | 8 |
| QA, code review, demos, governance | 14 |
| **Phase 1 total** | **86 person-days** |

**Phase 1 fixed-fee:** *[86 × rate]* — *placeholder: €86,000 at €1,000/day*

### Phase 2 — Evolution (R2)

| Activity | Person-days |
|---|---|
| Rules workshop + UX (Restocking) | 12 |
| Backend recommendation logic development | 16 |
| Frontend Restocking view development | 18 |
| Restocking E2E tests, Operations validation | 8 |
| Governance, demos, staging deployment | 6 |
| **Phase 2 total** | **60 person-days** |

**Phase 2 fixed-fee:** *[60 × rate]* — *placeholder: €60,000 at €1,000/day*

### Phase 3 — Modernization (D1 + D2 + D3)

| Activity | Person-days |
|---|---|
| D1 — UI refresh | 18 |
| D2 — Complete i18n | 16 |
| D3 — Dark mode | 14 |
| Final handoff, knowledge transfer, operational documentation | 10 |
| **Phase 3 total** | **58 person-days** |

**Phase 3 fixed-fee:** *[58 × rate]* — *placeholder: €58,000 at €1,000/day*

---

## Commercial Summary

| Phase | Person-days | Cost (placeholder €1,000/day) |
|---|---|---|
| Phase 1 — Stabilization | 86 | €86,000 |
| Phase 2 — Evolution | 60 | €60,000 |
| Phase 3 — Modernization (desired items) | 58 | €58,000 |
| **Total engagement (R1–R4 + D1–D3)** | **204** | **€204,000** |
| Mandatory requirements only (Phases 1+2) | 146 | €146,000 |

> All Euro values are exclusive of VAT. The reference rate is purely illustrative: the final price will follow the agreed rate card.

---

## What Is Included

- Development, code review, automated and manual tests for all the agreed scope
- Architecture documentation (R4) and operational documentation for the deliverables
- Bi-weekly demos, governance, and reporting as per the Timeline section
- Post go-live support of **15 working days** from the closure of each phase, for fixes of defects emerging in production

## What Is Not Included

- Cloud infrastructure, software licenses, or hosting costs
- Data layer migration (JSON → database)
- End-user training beyond knowledge transfer to the IT team
- New functionality not included in the RFP (handled via change request, see below)

---

## Payment Terms

- **20%** at contract signing (team mobilization)
- **30%** upon achievement of Milestone M1 (end of Phase 1)
- **30%** upon achievement of Milestone M2 (end of Phase 2)
- **20%** upon achievement of Milestone M3 (engagement closure)

Monthly invoicing in case of T&M model.

---

## Change Requests

Scope variations (new functionality, significant deviations from assumptions, integration of third-party systems not foreseen) are handled through a formal process:

1. Estimate of impact in person-days and timeline (within 3 working days of the request);
2. Formal approval by the Meridian sponsor before start;
3. Update of the fixed-fee or consumption against the T&M day count.

Minor variations (within 1 person-day) are absorbed without a CR.

---

## Offer Validity

This commercial offer is valid **60 days** from the date of proposal delivery. After that term, rates are subject to reconfirmation.
