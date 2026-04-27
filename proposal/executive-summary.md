# Executive Summary
**RFP MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**
Submitted by: Accenture | April 27, 2026

---

Meridian's operations team relies on a dashboard that was delivered incomplete. The Reports module has known defects that remain unresolved. There is no restocking intelligence — procurement decisions are made by manually cross-referencing multiple screens. And with zero automated test coverage, your IT team has effectively frozen the system against further change.

We have reviewed the codebase and the previous vendor's handoff documentation before writing this proposal. We know what is broken and why. This proposal is scoped against the actual state of the system, not against assumptions.

Our engagement addresses all four required items in Meridian's priority order:

- **R1 — Reports remediation:** Full audit followed by systematic defect resolution. Every fix ships with a corresponding test. We will not close R1 until Meridian IT has signed off on a written acceptance checklist.
- **R2 — Restocking recommendations:** A new view that takes a budget ceiling as input and returns ranked purchase order recommendations based on live stock levels and demand forecasts. One screen replaces a manual process.
- **R3 — Automated browser testing:** End-to-end Playwright coverage on five critical flows, delivered in Phase 1. This is sequenced first because it is the prerequisite that allows your IT team to approve all subsequent changes.
- **R4 — Architecture documentation:** An interactive current-state architecture overview delivered at onboarding — not at contract end — and used by our team to scope R1 accurately.

We propose a six-week engagement in three two-week phases, with milestone gates and written acceptance at each phase boundary. Pricing is T&M with a not-to-exceed cap, structured so Meridian has cost certainty from day one.

Meridian has been let down by a vendor who left work unfinished. We intend to be the last vendor you need for this system.
