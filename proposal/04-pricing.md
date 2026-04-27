# Pricing

**RFP:** MC-2026-0417 — Inventory Dashboard Modernization
**Section reference:** RFP §4.5

---

## Model

**Time-and-materials with a not-to-exceed (NTE) cap**, structured in two parts to give Meridian price predictability without forcing premature estimation on a defect surface that nobody — including the previous vendor — has documented.

| Part | Weeks | Pricing | Why |
|---|---|---|---|
| **Phase 1 — Discovery & test harness** | Weeks 1–2 | **Firm fixed-fee** | The discovery work is well-defined: architecture review, Playwright scaffold, R1 defect audit. We can price it confidently today. |
| **Phases 2–4 — Delivery** | Weeks 3–12 | **T&M with NTE cap, confirmed at the Discovery Checkpoint** | The defect surface in Reports and the disposition of the orphaned endpoints are both unknowns until Week 2. We propose a *preliminary* cap below; the *confirmed* cap is signed at the end of Week 2 based on what the audit actually finds. |

This is what allows us to honor the "no ceiling, score on value" guidance from the RFP Q&A without padding the number to absorb unknowns. Meridian pays for what is built, capped at a number agreed once the unknowns are visible.

---

## Rate card

Blended rates for the proposed three-person team. All roles are senior; no offshore handoff.

| Role | Hourly rate | Allocation |
|---|---|---|
| Tech lead / principal engineer | **$245** | Full-time, all 12 weeks |
| Senior frontend engineer | **$195** | Full-time, Weeks 3–12 |
| QA / automation engineer | **$165** | Half-time, weighted toward Phases 1 and 4 |

Rates are inclusive of standard development tools, communication infrastructure, and CI compute during the engagement. Travel is not anticipated; if Meridian requests on-site time in San Francisco, it would be billed at cost with prior approval.

---

## Phase 1 — Firm fixed-fee

| Line item | Hours | Rate | Amount |
|---|---|---|---|
| Tech lead — architecture review, audit lead, checkpoint prep | 80 | $245 | $19,600 |
| QA engineer — Playwright scaffold and CI setup | 40 | $165 | $6,600 |
| Tooling & sundries | — | — | $800 |
| **Phase 1 total (fixed)** | | | **$27,000** |

Invoiced in two equal installments at start of Week 1 and end of Week 2.

---

## Phases 2–4 — Preliminary NTE cap

The numbers below are the **preliminary** cap as understood at proposal time. The confirmed cap is signed at the Discovery Checkpoint at the end of Week 2.

| Phase | Weeks | Tech lead | Frontend eng. | QA eng. | Phase subtotal |
|---|---|---|---|---|---|
| Phase 2 — R1 remediation | 3 | 120 hrs | 120 hrs | 30 hrs | $57,150 |
| Phase 3 — R2 build | 4 | 160 hrs | 160 hrs | 40 hrs | $76,800 |
| Phase 4 — Hardening + D1/D2/D3 | 3 | 120 hrs | 120 hrs | 60 hrs | $62,700 |
| **Subtotal** | | | | | **$196,650** |
| Contingency (≈12%) — reserved against R2 ranking complexity and D3 contrast regressions | | | | | $23,350 |
| **Phases 2–4 preliminary NTE cap** | | | | | **$220,000** |

---

## Engagement total

| | Amount |
|---|---|
| Phase 1 (firm fixed) | $27,000 |
| Phases 2–4 (preliminary NTE cap) | $220,000 |
| **Engagement preliminary NTE total** | **$247,000** |

Confirmed at the Discovery Checkpoint, end of Week 2.

---

## How invoicing works

- **Phase 1**: two fixed installments (Week 1 start, Week 2 end).
- **Phases 2–4**: invoiced **bi-weekly in arrears** against actual hours, accompanied by a one-page status report showing hours by role, work completed, work in progress, and remaining cap headroom.
- Net 30 terms.
- A monthly burn-rate review with Okafor flags any trajectory toward the cap with at least four weeks of warning, never as a surprise.

## How change requests work

If Meridian requests scope additions during the engagement (a new desired item, an expanded R2 feature, a fourth locale), we estimate the change in writing, Meridian approves or declines in writing, and the cap is adjusted accordingly. **No work outside the agreed scope is performed without written approval.** This is how we keep the NTE meaningful.

## What is *not* included

To avoid surprises:

- Production hosting infrastructure and licensing (Meridian's existing environment is assumed).
- Third-party services or data sources beyond what exists in the current codebase.
- A migration from the JSON-file data layer to a relational database, if Meridian wants one. Scoped separately on request.
- On-going support after engagement closeout. We are happy to propose a follow-on retainer if useful.

## Why this model serves Meridian

The previous vendor's engagement ended with work unfinished and limited handover. A fixed-fee model in that environment incentivizes the vendor to under-deliver scope; a pure T&M model gives the client no ceiling. The hybrid here — fixed Phase 1, capped T&M after — aligns both sides: we are paid only for hours actually worked, Meridian sees a hard ceiling, and the ceiling is confirmed *after* both sides understand what the work actually involves.
