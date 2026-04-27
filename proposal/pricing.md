# Pricing

**Proposal in response to RFP #MC-2026-0417**

---

## Pricing model

We propose a **fixed-fee engagement by phase** with a not-to-exceed total. Meridian bears no cost overrun risk — if a phase takes longer than estimated, the cost does not change. Invoicing is tied to phase completion and milestone acceptance, not to time spent.

---

## Team

This engagement is staffed as a small, dedicated team. Each role is present for the full engagement, not brought in ad hoc.

| Role | Responsibility |
|---|---|
| Technical Lead | Architecture review, backend development (R2, R4), code standards, client communication |
| Frontend Engineer | Reports remediation (R1), Restocking view (R2 frontend), i18n and dark mode (D2, D3) |
| QA / Automation Engineer | Browser test suite (R3), defect log (R1 audit), test infrastructure setup |

**Why this matters:** the previous engagement's issues — abandoned modules, inconsistent patterns, no test coverage — are symptoms of a team that was not fully staffed for the scope. A dedicated QA engineer on the team from day one means the defect audit is thorough, the test suite is written by someone whose job it is to break things, and the browser tests are a real deliverable, not an afterthought.

---

## Phase pricing

### Phase 1 — Foundation
*Weeks 1–2 | Architecture documentation (R4) + Reports defect log + test infrastructure*

| Item | Fee |
|---|---|
| Architecture review and documentation | $6,000 |
| Reports module audit and defect log | $4,000 |
| Test infrastructure setup and baseline | $2,000 |
| **Phase 1 total** | **$12,000** |

---

### Phase 2 — Core delivery
*Weeks 3–6 | Reports remediation (R1) + Restocking view (R2) + Browser tests (R3)*

| Item | Fee |
|---|---|
| Reports remediation (R1) | $16,000 |
| Restocking view — backend endpoint + frontend view (R2) | $20,000 |
| Browser test suite — all critical flows (R3) | $12,000 |
| **Phase 2 total** | **$48,000** |

---

### Phase 3 — Modernization *(conditional)*
*Weeks 7–8 | UI refresh (D1) + i18n completion (D2) + Dark mode (D3)*

| Item | Fee |
|---|---|
| UI modernization — design tokens, component styling (D1) | $9,000 |
| Internationalization — Japanese locale completion, up to 200 strings (D2) | $7,000 |
| Dark mode — WCAG AA compliant theming (D3) | $6,000 |
| **Phase 3 total** | **$22,000** |

D2 covers translation of up to 200 UI strings into Japanese. If the audit reveals significantly more untranslated content, additional strings are billed at $30/string. In practice we do not expect to exceed this ceiling given the scope of the application.

---

## Summary

| Phase | Fee | Cumulative |
|---|---|---|
| Phase 1 — Foundation | $12,000 | $12,000 |
| Phase 2 — Core delivery | $48,000 | $60,000 |
| Phase 3 — Modernization *(conditional)* | $22,000 | $82,000 |
| **Not-to-exceed total** | | **$82,000** |

---

## Payment terms

- **Phase 1:** 50% at contract signing, 50% on Phase 1 milestone acceptance
- **Phase 2:** 25% at Phase 2 kickoff, 75% on Phase 2 milestone acceptance
- **Phase 3:** 100% on Phase 3 completion (if in scope)

No invoices are issued for time and materials. Payment is tied to accepted deliverables.

---

## What is not included

- Hosting, infrastructure, or cloud costs
- Ongoing support or maintenance after engagement close (available under a separate retainer)
- Changes to scope not covered by the assumptions stated in the Technical Approach

Any change to scope will be discussed and agreed in writing before work begins. We do not proceed on verbal scope changes.

---

## Notes on value

The $60,000 Phase 1 + Phase 2 commitment delivers everything Meridian requires: a remediated Reports module, a working Restocking view, automated browser tests that satisfy IT's approval requirements, and architecture documentation for the handoff. The not-to-exceed structure means this is the number Meridian can budget against — there is no scenario in which required scope costs more.

Phase 3 at $22,000 covers all three desired items. If Meridian's priority is the Tokyo team (D2) and warehouse floor stations (D3), those two items together are $13,000 — well within a contingency budget. The D2 ceiling of 200 strings provides cost predictability; for context, the current codebase has significantly fewer than that, making overrun unlikely.
