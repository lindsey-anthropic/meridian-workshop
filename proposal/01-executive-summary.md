# Executive Summary

**Submitted by:** Accenture
**RFP Reference:** MC-2026-0417
**Date:** April 28, 2026

---

Meridian Components has built a capable foundation — a Vue/Python inventory dashboard that covers core operations across three warehouses. What's missing is the final mile: a Reports module left incomplete at the previous vendor's contract end, no automated test coverage that would let your IT team safely approve changes, and a Restocking capability your operations team has been waiting for.

We've reviewed the RFP, the previous vendor's handoff notes, and the source code. Our read: this is a focused, well-scoped engagement with clear priorities and a team that knows exactly what it needs. The previous relationship ended on a note of unfinished work and thin documentation. We intend to close differently — with a codebase that's cleaner than we found it, tests that let your IT team move without fear, and documentation your team can actually hand off.

**Our proposed approach addresses the four required items in Meridian's stated priority order:**

- **R1 — Reports remediation:** We will audit the Reports module systematically, resolve all known defects (filter wiring, i18n gaps, data pattern inconsistencies), and document findings.
- **R2 — Restocking view:** We will design and deliver a new Restocking feature that surfaces purchase order recommendations against current stock, demand forecasts, and an operator-supplied budget ceiling.
- **R3 — Automated browser testing:** We will establish end-to-end test coverage for the Reports module and Restocking view — the two flows most critical to operations — so your IT team has a safety net for future changes.
- **R4 — Architecture documentation:** We will produce a current-state architecture overview in the first week, giving Meridian IT a reliable reference that the previous handoff did not provide.

We scope this engagement at **12 weeks** with delivery milestones at the end of each phase, to absorb findings from the architecture review and any scope that emerges during the Reports audit. Pricing assumptions and a phased timeline follow in subsequent sections.

One note on sequencing: R3 (testing) is the capability that unblocks your IT team's approval process for all future changes. We treat it not as a standalone deliverable but as something we build *alongside* R1 and R2 — tests for each feature as we go, not bolted on at the end.
