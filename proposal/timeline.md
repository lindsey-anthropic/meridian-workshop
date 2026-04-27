# Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

We propose a **10-week fixed engagement** beginning approximately June 2, 2026 (allowing for contract execution in May). Delivery is phased so that the highest-risk and highest-dependency work happens first.

---

## Phase 1 — Foundation (Weeks 1–3)

The first phase establishes the safety net that makes everything else possible.

| Week | Deliverable |
|------|-------------|
| 1 | Onboarding audit: Reports defect inventory, architecture documentation draft (R4), test scope confirmation with IT |
| 2 | Reports remediation begins — high-severity defects (R1) |
| 3 | Reports remediation complete; Playwright test suite for Reports in place (R3 partial) |

**Milestone:** End of Week 3 — Reports module is clean, tested, and reviewed by Meridian IT. Architecture doc delivered for IT review.

---

## Phase 2 — New Capability (Weeks 4–7)

With the codebase stable and tested, we build the Restocking feature.

| Week | Deliverable |
|------|-------------|
| 4 | Restocking algorithm design + data flow sign-off with operations team |
| 5 | Backend endpoint (`/api/restocking`) + initial frontend scaffold |
| 6 | Restocking view feature-complete (frontend) |
| 7 | Playwright test suite for Restocking (R3 complete); i18n extension to remaining modules (D2) |

**Milestone:** End of Week 7 — Restocking view live, full R3 test suite running, D2 complete.

---

## Phase 3 — Polish & Handoff (Weeks 8–10)

| Week | Deliverable |
|------|-------------|
| 8 | Integration testing, cross-warehouse filter validation, edge case hardening |
| 9 | Dark mode implementation if timeline permits (D3 stretch) |
| 10 | Final architecture documentation (R4 finalized), handoff session with Meridian IT, engagement close |

**Milestone:** End of Week 10 — All required deliverables (R1–R4) complete. D2 complete. D3 delivered if Week 9 permits. Full handoff package to Meridian IT.

---

## Key Dependencies

- **Meridian provides:** Issue log for Reports defects (or confirms we build our own from audit); access to operations team in Week 4 for Restocking algorithm review; IT availability in Week 1 for test scope confirmation and Week 10 for handoff session.
- **Scope assumption:** If the Reports audit (Week 1) uncovers significantly more than 12 defects, we will flag immediately and agree a revised scope before proceeding to remediation.

---

## Payment Schedule (indicative)

| Milestone | % of Fixed Fee |
|-----------|---------------|
| Contract execution | 25% |
| Phase 1 complete (end Week 3) | 25% |
| Phase 2 complete (end Week 7) | 35% |
| Final handoff (end Week 10) | 15% |
