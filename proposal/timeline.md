# Timeline
**RFP MC-2026-0417 — Meridian Components**

Proposed start: week of May 12, 2026 (assuming selection by May 8 per RFP deadline).
Total duration: 6 weeks across 3 phases.

---

## Phase 1 — Foundation (Weeks 1–2, May 12–23)

**Goal:** Establish test baseline and architecture understanding before touching any defects.

| Deliverable | Detail |
|---|---|
| R4 Architecture overview | `architecture.html` — diagram, API catalogue, component map, tech debt log |
| R3 Browser tests | Playwright coverage on 5 critical flows against current codebase |
| R1 Defect audit | Full enumeration of Reports defects; prioritized list shared with Meridian IT |
| Environment setup | Verified local dev environment; CI baseline for test runs |

**Phase 1 gate:** Meridian IT reviews and accepts architecture doc and test baseline before Phase 2 begins. Written sign-off required.

---

## Phase 2 — Remediation & Build (Weeks 3–4, May 26 — June 6)

**Goal:** Fix all R1 defects and deliver R2 Restocking view.

| Deliverable | Detail |
|---|---|
| R1 Reports — filter wiring | `/api/reports/*` endpoints get warehouse, category, status filters |
| R1 Reports — API consistency | Patterns aligned with rest of codebase |
| R1 Reports — Composition API migration | Options API remnants removed |
| R1 Reports — i18n + console fixes | Remaining defects resolved |
| R2 Restocking view | Backend endpoint + frontend view, full Playwright coverage added |

**Phase 2 gate:** Demo to R. Tanaka (VP Operations) and Meridian IT. Acceptance checklist for R1 and R2 reviewed and signed off.

---

## Phase 3 — Polish & Handoff (Weeks 5–6, June 9–20)

**Goal:** Optional items, final QA, and handoff package.

| Deliverable | Condition |
|---|---|
| D1 UI modernization | If in scope |
| D2 Internationalization (EN + JA) | If in scope |
| D3 Dark mode | If in scope (requires D1) |
| Full regression test run | All 5 flows + new R2 flow green |
| Final architecture doc update | Reflects all changes made during engagement |
| IT handoff package | Runbook, env setup guide, test execution instructions |

**Phase 3 gate:** Final QA sign-off by Meridian IT. Project closure meeting with J. Okafor and R. Tanaka.

---

## Milestone Summary

| Date | Milestone |
|---|---|
| May 8 | RFP response due |
| May 12 | Engagement kickoff (if selected) |
| May 23 | Phase 1 complete — IT sign-off on tests + architecture |
| June 6 | Phase 2 complete — R1 + R2 accepted by IT and Operations |
| June 20 | Phase 3 complete — final handoff |

---

## Risks & Contingencies

| Risk | Mitigation |
|---|---|
| R1 defect count higher than 8 (previous vendor's estimate) | 20% hour buffer on R1; Phase 2 gate allows scope adjustment before Phase 3 |
| Meridian IT sign-off delays at phase gates | Gates are asynchronous — Phase 2 work can begin in parallel with IT review if low-risk |
| D1–D3 scope expansion | Treated as change requests with separate estimates; do not affect R1–R4 delivery |
| Tokyo translations for D2 | Meridian provides JA strings or approves additional budget for translation; does not block EN extraction |
