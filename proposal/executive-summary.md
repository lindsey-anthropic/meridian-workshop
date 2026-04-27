# Executive Summary

**Proposal in response to RFP #MC-2026-0417**
**Submitted to:** J. Okafor, Director of Procurement, Meridian Components, Inc.
**Date:** April 28, 2026

---

Meridian Components has a functioning inventory dashboard and a team that depends on it daily — but the previous engagement ended before the work was finished, and the consequences are visible in the code.

Before writing this proposal, we reviewed the provided codebase directly. What we found in the Reports module is not a list of minor defects: it bypasses the application's own API abstraction layer entirely, using hardcoded URLs rather than the shared patterns every other view follows. It was written in an older component style that the rest of the codebase has already moved away from. The global filters — time period, warehouse, category — have no effect on it whatsoever. And development artifacts including over a dozen debug log statements were left in place at handoff. This is a module that was started and then abandoned, not one that was delivered incomplete.

The downstream consequence is a blocked team. Meridian's IT department has correctly identified that there is no automated test coverage for the frontend, and has blocked changes as a result. That means the operations team cannot get the Restocking capability they need, cannot get the Reports module fixed, and cannot get anything else — until the test gap is closed. Every requirement in this RFP flows through that bottleneck.

**Phase 1** exists to break the deadlock. It delivers an architecture review so Meridian has a current, accurate picture of what it owns, and it establishes the test foundation that allows IT to approve further work. Without Phase 1, Phases 2 and 3 cannot proceed safely. **Phase 2** then delivers the core scope: Reports fully remediated to match the application's established patterns, the Restocking view built, and browser test coverage for the flows IT has identified as critical. **Phase 3**, conditional on remaining budget, addresses UI modernization, extended internationalization for the Tokyo team, and dark mode for warehouse floor stations.

The goal is not just to finish what the previous vendor started. It is to leave the system in a state where Meridian's own team can maintain and extend it without needing another engagement to clean up after this one.

We propose a fixed-fee engagement with a not-to-exceed of **$80,000**, structured so Meridian bears no cost overrun risk. Timeline to Phase 2 completion is eight weeks from kickoff.

---

*This proposal was prepared based on review of RFP #MC-2026-0417, the provided codebase, and vendor handoff notes. Clarifying assumptions are documented in the Technical Approach section.*
