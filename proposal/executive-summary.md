# Executive Summary

**Proposal in Response to RFP #MC-2026-0417**
**Submitted to:** Meridian Components, Inc. — J. Okafor, Director of Procurement
**Submitted by:** [Your Firm Name]
**Date:** May 7, 2026

---

## Our Understanding of Your Situation

Meridian Components operates a business-critical inventory dashboard that your operations team depends on daily across three warehouses — San Francisco, London, and Tokyo. The system was delivered by a previous vendor in 2024 and left in an incomplete state: the Reports module has known defects, there is no automated test coverage, and two years of requested capabilities remain undelivered.

The consequences are real and ongoing:

- **R. Tanaka's operations team** is working around a broken Reports module and lacks the Restocking view they've been waiting for. Every day without that feature is a day of manual workarounds.
- **Meridian IT** cannot approve changes to the system because there is no safety net — no tests, no confidence that a fix won't break something else.
- **The Tokyo warehouse team** continues to work in a partially English-only interface, creating friction for a team that opened in 2023.

These are not abstract technical debts. They are operational bottlenecks with a compounding cost.

---

## Our Proposed Approach

We propose a **phased engagement** structured to deliver value early and de-risk every subsequent change:

**Phase 1 — Foundation (Weeks 1–2):** Establish automated test coverage (R3) and deliver the architecture documentation (R4). No production features change hands yet — only the safety net goes in first. This immediately unblocks IT and gives Meridian confidence in what comes next.

**Phase 2 — Remediation (Weeks 3–4):** Audit and fully remediate the Reports module (R1). With tests in place, every fix is verified. Tanaka's team gets a working Reports page by end of Week 4.

**Phase 3 — New Capability (Weeks 5–8):** Build and deliver the Restocking Recommendations view (R2) — the feature Tanaka has been waiting for. Budget-ceiling parameterization, demand-weighted ranking, and purchase order workflow included.

**Phase 4 — Modernization (Weeks 9–12, optional):** UI refresh, full i18n for Tokyo (D1–D2), and dark mode for floor stations (D3). Scope and pricing for this phase are modular — Meridian can elect any combination.

---

## Why Us

- We have reviewed the previous vendor's handoff notes and the actual codebase — our scope is based on what is *actually* there, not on what documentation claims.
- We work fixed-fee per phase. You know exactly what you're paying before each phase begins.
- We don't start touching production code until a test harness is in place. This is not a nice-to-have — it is how we operate.
- Our team has delivered comparable Vue + Python dashboard modernizations with multi-warehouse, multi-locale requirements.
- We understand that Japanese localization is not a translation exercise — it is a matter of precision, trust, and cultural fit for the Tokyo team.

---

## A Note on the Tokyo Warehouse

The Tokyo office opened in 2023 to serve APAC OEM customers. Twelve people depend on this dashboard — in a professional culture where quality (品質, *hinshitsu*) and precision (正確さ, *seikakusa*) are not aspirations but baseline expectations.

Most vendors will run the UI strings through a translation tool and call it done. We won't. Our i18n approach for the Tokyo team includes:

- **Proper keigo register** — Japanese business software uses polite-formal language (丁寧語, *teineigo*); casual or machine-translated copy is immediately visible and erodes trust
- **Logistics-specific terminology** — "Backordered," "Reorder Point," "Purchase Order" have precise Japanese equivalents used by warehouse staff; we use those terms, not literal translations
- **Nemawashi (根回し) review process** — we share draft locale files with Tokyo team members informally before formal review, so sign-off is a confirmation, not a discovery
- **Locale-aware formatting** — Japanese numeric (万) and date (年月日) conventions built in via `Intl.NumberFormat` and `Intl.DateTimeFormat` with `ja-JP`

The Tokyo team has been waiting since 2023 for a system that speaks their language — literally and professionally. We will deliver that.

---

## Summary

| Item | Our Commitment |
|---|---|
| **Delivery model** | Fixed-fee, phased |
| **Phase 1 delivery** | End of Week 2 |
| **Full R1–R4 delivery** | End of Week 8 |
| **Optional D1–D3** | Weeks 9–12 |
| **Test coverage** | In place before any production change |
| **Japanese locale** | Human-reviewed, Tokyo team validated, keigo-correct |
| **Point of contact** | [Lead Consultant Name, email, phone] |

We are confident in this scope because we did the homework before writing this proposal — both in the codebase and in understanding the cultural context of the team that uses it. We look forward to discussing it with Okafor, Tanaka, and the IT team.
