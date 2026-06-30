# Executive Summary

**Proposal in Response to RFP #MC-2026-0417**
**Submitted to:** Meridian Components, Inc. — J. Okafor, Director of Procurement
**Submitted by:** Thornfield Consulting
**Date:** May 7, 2026

---

## Our Understanding of Your Situation

Meridian Components operates a business-critical inventory dashboard that your operations team depends on daily across three warehouses — San Francisco, London, and Tokyo. The system was delivered by a previous vendor in 2024 and left in an incomplete state: the Reports module has known defects, there is no automated test coverage, and two years of requested capabilities remain undelivered.

The consequences are real and ongoing:

- **R. Tanaka's operations team** is working around a broken Reports module and lacks the Restocking view they've been waiting for. Every day without that feature is a day of manual workarounds.
- **Meridian IT** cannot approve changes to the system because there is no safety net — no tests, no confidence that a fix won't break something else.

Beyond the required items: the Tokyo warehouse team continues to work in a partially English-only interface — a persistent friction point the operations team has flagged.

These are not abstract technical debts. They are operational bottlenecks with a compounding cost.

---

## Our Proposed Approach

We propose a **phased engagement** structured to deliver value early and de-risk every subsequent change:

**Phase 1 — Foundation (Weeks 1–2):** Establish automated test coverage (R3), deliver architecture documentation (R4), and produce a severity-ranked defect register for R1. No production features change hands yet — only the safety net and the full scope picture of what needs fixing.

**Phase 2 — Reports Remediation (Weeks 3–4):** Audit and fully remediate the Reports module (R1). With tests in place, every fix is verified. Tanaka's team gets a working Reports page by end of Week 4.

**Phase 3 — Restocking Recommendations (Weeks 5–8):** Build and deliver the Restocking Recommendations view (R2) — the feature Tanaka has been waiting for. Budget-ceiling parameterization, demand-weighted ranking, and purchase order workflow included.

**Phase 4 — Modernization (Weeks 9–12, optional):** UI refresh, full i18n for Tokyo (D1–D2), and dark mode for floor stations (D3). Scope and pricing for this phase are modular — Meridian can elect any combination.

---

## Why Us

- We have reviewed the previous vendor's handoff notes and the actual codebase — our scope is based on what is *actually* there, not on what documentation claims.
- We work fixed-fee per phase. You know exactly what you're paying before each phase begins.
- We do not modify production code until a test harness is in place and running. This is the first deliverable of Phase 1 — not an afterthought.
- Our team has delivered comparable Vue + Python dashboard modernizations with multi-warehouse, multi-locale requirements.
- We understand that Japanese localization is not a translation exercise — it is a matter of precision, trust, and cultural fit for the Tokyo team.

Phases 1–3 (full R1–R4 delivery) are priced at a fixed fee of $71,000. Optional Phase 4 modernization (D1–D3) is available at $24,000 as a package or individually.

---

## A Note on the Tokyo Warehouse

The 12-person Tokyo team has been waiting since 2023 for a system that meets professional expectations. Our i18n approach is not a translation exercise — we use correct keigo register, logistics-specific terminology (not literal translations), and a nemawashi-style review with Tokyo team members before formal sign-off. Locale-aware formatting (Japanese numeric and date conventions) is built in from the start. Full detail on our Japanese localization approach is in the Technical Approach section.

---

## Summary

| Item | Our Commitment |
|---|---|
| **Delivery model** | Fixed-fee, phased |
| **Phase 1 delivery** | End of Week 2 |
| **Full R1–R4 delivery** | End of Week 8 |
| **Optional D1–D3** | Weeks 9–12 |
| **Total R1–R4 price** | $71,000 fixed fee |
| **Test coverage** | In place before any production change |
| **Japanese locale** | Human-reviewed, Tokyo team validated, keigo-correct |
| **Point of contact** | Alex Chen, Principal Consultant — alex.chen@thornfieldconsulting.com — (415) 882-0394 |

We are confident in this scope because we did the homework before writing this proposal — both in the codebase and in understanding the cultural context of the team that uses it. We look forward to discussing it with Okafor, Tanaka, and the IT team.
