# Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**
**Submitted by:** Accenture&CT Consulting

---

## Phased Delivery Plan

Total duration: **10 weeks** for all required items (R1–R4). Desired items (D1–D3) are a separate optional extension in weeks 11–13, confirmed at kickoff.

---

### Phase 1 — Onboarding & Test Foundation (Weeks 1–2)

**Deliverables:**
- Environment setup and access confirmed
- Initial architecture review completed (R4 draft)
- Playwright test suite established: scaffolding, CI integration, first coverage pass across all views

**Milestone:** IT team has a running test suite they can execute against the current codebase. R4 draft circulated for Meridian IT review.

**Why this first:** IT unblocked from day one. Every subsequent change lands with test coverage already in place.

---

### Phase 2 — Reports Remediation (Weeks 3–5)

**Deliverables:**
- Full audit of Reports module against all logged issues (including any undocumented defects surfaced during audit)
- All defects resolved and verified by Playwright tests
- R4 architecture documentation finalized based on findings from audit

**Milestone:** Reports module fully functional. Architecture doc delivered to Meridian IT.

*Buffer note: Three weeks (vs. a tighter two) accounts for defect count exceeding the eight logged issues. Any unused buffer rolls into Phase 3.*

---

### Phase 3 — Restocking View (Weeks 6–9)

**Deliverables:**
- New Restocking view: budget input, ranked recommendations by warehouse/category
- FastAPI endpoint for aggregated stock + demand + budget logic
- Full Playwright test coverage for the new view
- If transactional procurement integration is confirmed at kickoff: API integration delivered within this phase

**Milestone:** Restocking view live and usable by operations team. R. Tanaka sign-off requested at end of week 9.

*Buffer note: Four weeks allows for a transactional integration option if confirmed at kickoff, without requiring a timeline revision.*

---

### Phase 4 — Hardening & Handoff (Week 10)

**Deliverables:**
- Full regression pass across all views
- Test suite updated to cover any edge cases surfaced in Phase 3
- Final architecture documentation updated to reflect delivered state
- Handoff package: architecture doc, test run report, deployment notes

**Milestone:** Engagement complete. All R1–R4 deliverables accepted.

---

### Optional Extension — Desired Items (Weeks 11–13)

If Meridian elects to include D1–D3, scope and sequencing confirmed at kickoff:

| Week | Deliverable |
|------|-------------|
| 11 | D3 Dark mode — CSS custom properties implementation, theme toggle |
| 12 | D1 UI modernization — design token refresh, component polish across all views |
| 13 | D2 i18n extension — framework wiring for remaining views; Japanese content review with Meridian |

These can be sequenced differently based on Meridian's priorities. D2 has the longest dependency (content review) and benefits from starting early if possible.

---

## Key Assumptions

- Meridian provides environment access and data access within 3 business days of contract signature.
- Meridian IT nominates a point of contact for test suite review in Week 1.
- R. Tanaka or delegate is available for a Restocking view walkthrough in Week 7.
- D1–D3 scope and prioritization confirmed at kickoff if elected.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Reports defect count exceeds 8 (undocumented issues) | Phase 2 includes a full audit, not just the logged issues. Buffer built into 2-week window. |
| Transactional procurement integration added to R2 scope | Confirm at kickoff. If included, Phase 3 extends by 1–2 weeks and pricing adjusts accordingly. |
| Japanese translation review delays D2 | Start D2 content review in parallel with D3/D1 to absorb review turnaround time. |
