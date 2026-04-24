# Timeline

**RFP MC-2026-0417 — Meridian Components**
**Proposed start:** Week of May 18, 2026 (assuming award by May 15)
**Target completion:** July 11, 2026 (8 weeks)

---

## Phased Delivery

### Phase 1 — Onboarding & Foundation (Weeks 1–2)

| Deliverable | Notes |
|---|---|
| Architecture review | Codebase audit; produces R4 draft |
| Test infrastructure setup | Playwright configured, first smoke tests passing |
| Defect inventory (R1) | Audit complete, findings shared with Meridian for sign-off |

**Milestone:** Architecture doc draft delivered to Meridian IT. Defect list approved by R. Tanaka's team. Test harness running in CI.

This phase unblocks everything that follows. IT has visibility before any changes land.

---

### Phase 2 — Reports Remediation (Weeks 3–4)

| Deliverable | Notes |
|---|---|
| R1 complete | All audited defects resolved and verified |
| R3 partial | Reports and Dashboard test coverage complete |

**Milestone:** Reports module signed off by operations team. Meridian IT unblocked for this module.

---

### Phase 3 — Restocking Feature (Weeks 5–7)

| Deliverable | Notes |
|---|---|
| R2 complete | `/api/restocking` endpoint + Restocking view |
| R3 complete | Inventory and Restocking test coverage added |

**Milestone:** Restocking view demo with R. Tanaka's team. Full R3 coverage in place.

---

### Phase 4 — Close & Stretch (Week 8)

| Deliverable | Notes |
|---|---|
| R4 final | Architecture doc updated to reflect delivered state |
| D1/D2/D3 | Stretch items as time allows, prioritized with Meridian |
| Handoff | Code review session with Meridian IT |

**Milestone:** Final delivery. All R1–R4 accepted. Stretch items documented if not fully delivered.

---

## Schedule Summary

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| R4 Architecture | ▓ | ▓ | | | | | | ▓ |
| R1 Reports | ▓ | ▓ | ▓ | ▓ | | | | |
| R3 Tests | | ▓ | ▓ | ▓ | ▓ | ▓ | ▓ | |
| R2 Restocking | | | | | ▓ | ▓ | ▓ | |
| D1–D3 Stretch | | | | | | | ▓ | ▓ |

---

**Note on sequencing:** Test coverage precedes each feature area, not follows it. This reflects Meridian IT's position as a gatekeeper and ensures changes are approvable as they land, not only at project close.

