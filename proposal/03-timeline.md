# Timeline

**RFP:** MC-2026-0417 — Inventory Dashboard Modernization
**Section reference:** RFP §4.4

---

## Engagement shape

A **twelve-week engagement, four phases**, sequenced to unblock IT first and operations next. The shape is dictated by risk, not by the RFP's R1–R4 ordering: the test harness and architecture review come before any remediation because they are what make the rest of the engagement safe to ship.

Engagement assumed to start **Monday, May 18, 2026** (one week after award notification). Adjustable to Meridian's preferred kickoff date.

```
Week:    1   2 │ 3   4   5 │ 6   7   8   9 │10  11  12
Phase 1: ███ ███│            │                │
Phase 2:        │███ ███ ███│                │
Phase 3:        │            │███ ███ ███ ███│
Phase 4:        │            │                │███ ███ ███
                │            │                │
Gate:        ▲              ▲              ▲              ▲
        Discovery        R1 demo        R2 demo        Final acceptance
        checkpoint                                     + handover
```

---

## Phase 1 — Discovery & test harness (Weeks 1–2)

**Goals.** Deliver the architecture review (R4 first draft), stand up the Playwright scaffold and CI integration (R3 foundation), and produce the itemized defect list for Reports (R1 audit). Confirm the engagement's not-to-exceed cap.

**Activities.**
- Codebase walk-through with Meridian IT.
- Architecture document drafted; reviewed with IT mid-Week 2.
- Playwright installed; CI pipeline runs an empty suite green; smoke test of top-level navigation in place.
- Reports defect audit completed and triaged with Tanaka's team.
- Investigation of orphaned client endpoints (`/api/purchase-orders/*`); decision logged.

**Gate at end of Week 2 — Discovery Checkpoint.** Meridian sees the audit, the architecture draft, and a green CI build. We finalize the not-to-exceed cap based on the actual defect surface and confirm or adjust the remaining scope.

**Deliverables.** Architecture document v1; Playwright scaffold in `main`; itemized R1 defect list; orphan-endpoint disposition; signed scope confirmation.

## Phase 2 — Reports remediation (Weeks 3–5)

**Goals.** Close every defect on the R1 list. Bring Reports onto the application's standard patterns where doing so is cheap.

**Activities.**
- Defects closed in priority order, each behind a regression test.
- Console errors and `console.log` statements removed.
- Direct `axios` calls migrated to the `api.js` client.
- Hardcoded English strings extracted to i18n keys (this overlaps with D2 — work done once).

**Gate at end of Week 5 — R1 Demo.** Tanaka's team walks through Reports end-to-end. Acceptance criteria from the audit list signed off.

**Deliverables.** Reports module remediated; regression tests in place; updated architecture document section.

## Phase 3 — Restocking capability (Weeks 6–9)

**Goals.** Build the Restocking view (R2). The largest single piece of work in the engagement.

**Activities.**
- Week 6: backend `/api/restocking/recommend` endpoint and ranking logic; backend tests.
- Weeks 7–8: frontend view, operator inputs, rationale display, CSV export.
- Week 9: integration testing, Playwright coverage, polish.

**Gate at end of Week 9 — R2 Demo.** Tanaka's team uses Restocking against representative data. Sign-off against the R2 definition of done.

**Deliverables.** Restocking endpoint and view in production; Playwright coverage of the flow; documentation.

## Phase 4 — Hardening & desired items (Weeks 10–12)

**Goals.** Complete browser test coverage of critical flows (R3 final). Deliver the desired items in dependency order. Hand the engagement over.

**Activities.**
- Week 10: Playwright suite extended to cover the remaining critical flows; D2 (i18n extension) finalized.
- Week 11: D1 (UI cleanup, token extraction) completed.
- Week 12: D3 (dark mode) implemented on top of the D1 token foundation; final architecture document; CI handover to Meridian-hosted infrastructure; final demo.

**Gate at end of Week 12 — Final Acceptance.** Full suite green. Operator-toggleable theme working. Architecture document reflects the delivered system. Handover meeting with IT.

**Deliverables.** Complete Playwright suite; D1, D2, D3 delivered; CI running in Meridian's environment; final architecture document; engagement closeout package.

---

## Critical path

The longest dependency chain is **R1 audit → R1 fixes → R2 build → R3 coverage of R2 → D1 tokens → D3 dark mode**. Slip in the R1 audit propagates the furthest, which is why the discovery checkpoint sits at the end of Week 2 and the not-to-exceed cap is confirmed only after the audit is real.

## Built-in contingency

The schedule contains roughly **one week of slack** distributed across Phase 3 and Phase 4 — held against the two highest-risk items (R2 ranking logic complexity, D3 contrast regressions). If contingency is unused, the desired items finish early; if needed, it absorbs typical estimation drift without renegotiating scope.

## What slips first if reality bites

If discovery surfaces a defect surface that is materially larger than expected, or the orphan-endpoint investigation expands meaningfully, the order of de-scope is: **D3 → D1 → D2**. The required scope (R1–R4) is held; desired items are deprioritized in inverse order of dependency. This is communicated explicitly at the Discovery Checkpoint, not after the fact.

## Team structure assumed

A small, senior team of three: a tech lead (full-time, all phases), a frontend engineer (full-time from Week 3), and a QA/automation engineer (half-time, weighted toward Phases 1 and 4). No offshore handoff.
