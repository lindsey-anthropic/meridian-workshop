# Timeline

**RFP MC-2026-0417 — Inventory Dashboard Modernization**

---

We are proposing an eight-week engagement across three phases. The phasing reflects our technical approach: testing first to unblock Meridian IT, remediation second, new capability third. Each phase ends with a working deliverable — nothing is held until final handoff.

---

## Phase 1 — Foundation (Weeks 1–2)

**Goal:** Establish test coverage and complete the architecture review. Meridian IT can approve changes by end of this phase.

| Activity | Output |
|---|---|
| Codebase orientation and architecture review | `architecture.html` delivered to Meridian IT |
| Playwright test suite — inventory and orders flows | Tests passing in local dev environment |
| Reports module audit | Defect list shared with Ms. Tanaka's team for sign-off |

---

## Phase 2 — Remediation (Weeks 3–4)

**Goal:** Resolve all confirmed Reports defects. Extend test coverage to the Reports module.

| Activity | Output |
|---|---|
| Fix all defects from signed-off audit list | Reports module fully functional |
| Playwright tests for Reports module (all filters) | Test suite extended |
| Mid-engagement check-in with operations team | Confirmed no additional issues surfaced |

---

## Phase 3 — New Capability (Weeks 5–8)

**Goal:** Deliver the Restocking view. Complete test coverage. Hand off.

| Activity | Output |
|---|---|
| Restocking view — build and integration | Restocking page live in dashboard |
| Playwright tests for Restocking flow | Full test suite complete |
| Final documentation review | All deliverables confirmed complete |
| Handoff session with Meridian IT | Team able to run tests and deploy independently |

---

## Desired Items (D1–D3)

If Meridian wishes to include UI modernization, i18n, or dark mode, we recommend scoping these as a follow-on engagement after the four-week required scope is complete. Attempting to run D1–D3 in parallel with R1–R4 would compress the timeline and introduce unnecessary risk during remediation.

We are happy to provide a separate estimate for desired items once the required scope is delivered and both teams have a clearer picture of the codebase.

---

## Timeline Summary

| Week | Phase | Key Milestone |
|---|---|---|
| 1–2 | Foundation | Architecture docs delivered; IT unblocked |
| 3–4 | Remediation | Reports module fixed and tested |
| 5–8 | New Capability | Restocking view live; full test suite complete |

---

**Start date assumption:** Engagement begins within one week of contract execution. Timeline is contingent on access to the codebase and a 48-hour turnaround from Meridian on the defect list sign-off in Phase 1.
