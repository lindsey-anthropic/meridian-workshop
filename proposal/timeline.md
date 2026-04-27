# 4. Timeline

*Accenture response to RFP MC-2026-0417 — Meridian Components, Inc.*

---

We propose an eight-week engagement. Week 1 is discovery; weeks 2–8 are parallel delivery and handover. The timeline assumes a Monday-start kickoff and excludes Meridian-side review windows, which we recommend booking for Friday afternoons each week.

---

## Phase 1 — Discovery (Week 1)

Three parallel tracks, each producing one of the artifacts that compose the locked Statement of Work.

- **R1 — Reports audit.** A categorized defect list for the Reports module: genuine bugs, unfinished feature work, and pattern inconsistencies. Delivered Friday of week 1.
- **R2 — Algorithm calibration.** One-hour working session with VP Operations, plus a follow-up specification document capturing lead times, supplier preferences, and per-SKU stockout tolerance. Algorithm specification updated and delivered Friday of week 1.
- **R3 — IT alignment.** Written exchange with IT, routed through procurement, to confirm or amend the §3.3 critical-flow list and coverage thresholds. Delivered Friday of week 1.

These three artifacts compose the locked Statement of Work. Any material divergence from §3.2 — specifically the election of cross-warehouse rebalancing — triggers a single change order before week 2 begins.

---

## Phase 2 — Parallel Delivery (Weeks 2–7)

Concurrent tracks, resourced and coordinated to remain parallel rather than serial.

| Track | Weeks | Deliverable |
|---|---|---|
| R1 — Reports remediation | 2–4 | Reports view in pattern alignment with the rest of the codebase; categorized defect list closed |
| R2 — Restocking capability | 2–6 | `/api/recommendations` endpoint, Restocking view, operator-facing budget visualization, PO-issued state transition |
| R3 — Test coverage | 2–7 | Playwright harness, ten critical-flow E2E tests, selective unit/component tests on shared composables and R2 logic, CI integration |
| D2 — i18n extension | 4–6 | Reports brought to i18n compliance during R1; remaining views audited and translation coverage extended for Tokyo locale |
| D1 — UI light refresh | 5–7 | Typographic hierarchy, spacing rhythm, status-color consistency, chart styling |
| D3 — Dark mode | 6–7 | Operator-selectable theme delivered as a CSS variable layer |

**Key milestones:**

- **End of week 4** — Reports remediation complete; R2 endpoint live in development environment; first three E2E tests (Dashboard, Inventory, Orders) passing in CI.
- **End of week 6** — R2 fully integrated end-to-end; D1 and D2 complete.
- **End of week 7** — Full critical-flow E2E suite passing in CI; D3 complete.

---

## Phase 3 — Handover (Week 8)

- Architecture documentation (R4) finalized and delivered as a self-contained HTML overview.
- Final test-suite verification with Meridian IT, including a walkthrough of the CI integration and how to interpret a failed run.
- Knowledge transfer session with Meridian IT (one half-day, on-site or remote at IT's preference).
- Engagement closeout document recording final scope, change orders (if any), and follow-on recommendations.

---

## Dependencies

The eight-week timeline assumes:

- Meridian-side reviewers respond to deliverables within two business days.
- VP Operations is available for the week-1 working session and remains available for ad-hoc clarifications during the R2 build (weeks 2–6).
- Meridian's IT contact responds to written queries within three business days, per the routing confirmed by procurement.
- No Meridian holiday falls inside the eight-week window beyond standard observance.

If any of these slip, the engagement extends in proportion. We do not propose to compress elsewhere to absorb client-side delays — that would compromise the delivery confidence the fixed-fee structure is built to protect.
