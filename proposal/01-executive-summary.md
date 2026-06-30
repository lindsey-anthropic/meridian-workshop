# Executive Summary

**RFP MC-2026-0417 — Inventory Dashboard Modernization**
Prepared for Meridian Components, Inc. · Director of Procurement, J. Okafor

---

Meridian's operations team relies on its inventory dashboard daily, and the current system has reached the limits of what it can support: the Reports module has unresolved defects, there is no automated test coverage to allow safe change, and the restocking guidance operations leadership needs does not yet exist. We have reviewed the RFP, the background materials, and the existing source code in detail. This proposal sets out how we will close that gap — and why we are confident we can deliver a materially better result than the current system provides.

**Our understanding of the problem.** Based on our review, we believe the core issue is not any single defect but a lack of consistency and verifiability across the application. The Reports module was built to a different standard than the rest of the dashboard: filtering is not wired up, it bypasses the application's shared data layer, and it carries diagnostic logging and non-localized formatting that the other views avoid. The absence of tests means no change can be made with confidence, which is why the system is effectively frozen. And the most-requested capability — restocking guidance tied to a real budget — was never started. We may not yet have every detail right, and we have submitted clarifying questions accordingly, but we are confident this is the right shape of the problem: restore consistency, make change safe, then extend.

We understand the priority behind each required item, not just the item itself:

- **R1 — Reports remediation.** This is about restoring trust in the numbers the team reports upward. We have confirmed the root causes in the code and will bring Reports to full parity with the rest of the dashboard — consistent filtering, the shared data layer, clean output — rather than patching only what is visible.
- **R2 — Restocking recommendations.** This is the capability operations leadership asked for. We will deliver a view that converts current stock levels, demand forecast, and an operator-supplied budget ceiling into a ranked set of recommended purchase orders the team can act on directly.
- **R3 — Automated testing.** This is what allows IT to approve change again. Today the lack of tests is the reason the system is frozen; we treat end-to-end coverage of critical flows as the foundation that unblocks everything else, and we sequence it early.
- **R4 — Architecture documentation.** This is both a deliverable and our own first step. The existing documentation is limited, so we will produce a current-state architecture overview during onboarding that de-risks the remaining work and gives IT a durable reference.

**Our approach in one line:** document first to remove unknowns, test early to make change safe, remediate Reports to restore trust, then build Restocking on a foundation both teams can rely on. The desired items — UI modernization, extended internationalization, dark mode — are scoped as opt-in enhancements, and where it costs little to lay groundwork for them during required work, we will.

**Commercially**, we propose a **fixed fee for the required scope (R1–R4)** so the budget is predictable, and **time-and-materials with a not-to-exceed ceiling for any desired items (D1–D3)** Meridian chooses to proceed with. A known number for what is needed; full control over what is optional.

We also bring our own **design system and supporting tooling at no additional cost** — a library of production-ready, reusable components and patterns that we maintain across engagements. For Meridian this has two direct effects. First, it lowers the cost and shortens the timeline of every UI-touching item, because we assemble from proven components rather than building each from scratch — the savings are passed through, not retained. Second, it gives the desired UI modernization (D1) a ready-made foundation that already meets modern accessibility and consistency standards, so should Meridian choose to proceed with it, the work starts from a mature baseline rather than a blank page. The same tooling underpins the automated testing (R3) and keeps the codebase consistent as it grows.

This proposal is scoped from Meridian's actual codebase rather than a generic template. We are confident in the plan, confident in the timeline, and confident we can deliver a dashboard the operations team relies on rather than works around.
