# Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

## Phase 1 — Required Items (R1–R4)

Estimated duration: **6 weeks** from contract start.

| Week | Activity | Deliverable |
|---|---|---|
| 1 | Codebase audit: Reports module, data model, architecture | Defect inventory (shared with Meridian before any fixes begin) |
| 2 | R4: Architecture documentation; R1: Begin defect remediation | Architecture overview (HTML) |
| 3 | R1: Complete defect remediation; R2: Restocking design | Verified Reports module; Restocking data model and UI mockup (shared with Meridian) |
| 4–5 | R2: Restocking view build | Restocking feature (backend endpoint + frontend view) |
| 6 | R3: Automated browser tests; final QA pass | Playwright test suite covering R1 and R2 flows; Phase 1 delivery |

**Phase 1 milestone:** All four required items delivered, tested, and documented. IT-ready test suite in place.

---

## Phase 2 — Desired Items (D1–D3)

Conditional on Meridian electing to proceed. Estimated duration: **3–4 weeks** following Phase 1 acceptance.

| Week | Activity |
|---|---|
| 7 | D1: UI modernization (visual alignment to Meridian website) |
| 8 | D2: i18n extension (remaining modules; Japanese locale first) |
| 9 | D3: Dark mode (branch-isolated prototype → merge after review) |
| 9–10 | Phase 2 QA, test coverage extension, final delivery |

---

## Notes

- Week 1 is non-negotiable — we will not skip the audit phase to accelerate delivery. The defect inventory protects both parties.
- The Restocking mockup review (end of Week 3) is a required checkpoint. We will not begin development until Meridian has signed off on the data model and UI approach.
- Phase 2 timeline is contingent on Phase 1 scope being unchanged. If R1 audit reveals significantly more defects than the RFP indicates, we will flag it at the Week 1 checkpoint before any schedule impact.
- All timelines assume reasonable access to a Meridian stakeholder (R. Tanaka or delegate) for the Week 3 checkpoint. We need one working session of ~1 hour.
