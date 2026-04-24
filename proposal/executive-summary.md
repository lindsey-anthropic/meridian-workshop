# Executive Summary

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**
**Submitted by:** [Nazwa firmy]
**Date:** April 24, 2026

---

Meridian Components operates a mission-critical inventory dashboard across three continents. The system works — but it's not finished, and the previous vendor left without closing the loop. Your operations team is working around broken filters in the Reports module. Your Tokyo warehouse staff navigates an English-only interface. And your IT team has frozen further development because there's no test coverage to stand behind.

We understand the situation. The ask isn't to rebuild from scratch — it's to take what's there, make it right, and extend it responsibly.

Our approach is straightforward: we start by establishing a test baseline so every change we make is safe to ship. We audit and remediate the Reports module — all defects, not a subset. We build the Restocking feature your operations team has been waiting for. And we leave you with architecture documentation and automated coverage that makes future maintenance predictable.

**What sets our response apart:**

- We treat R3 (automated testing) as the prerequisite, not an afterthought. Without a test harness, any fix to Reports is just trading one risk for another. We build the safety net first.
- We scope conservatively and communicate early. The previous vendor over-committed. We will flag scope questions before they become schedule problems.
- We have read the handoff documentation. It's thin. We've accounted for the discovery work that implies — it's in our timeline, not a change order waiting to happen.

**Scope summary:**

| Item | Priority | Our commitment |
|---|---|---|
| R1 — Reports remediation | Required | Full audit + fix, all identified defects |
| R2 — Restocking view | Required | New module with budget-ceiling logic |
| R3 — Browser test coverage | Required | Playwright E2E tests for critical flows |
| R4 — Architecture documentation | Required | Current-state overview for IT handoff |
| D1–D3 — UI, i18n, dark mode | Desired | Scoped separately; D2 (i18n) prioritized given Tokyo team |

We are confident in this scope and ready to begin immediately upon award.
