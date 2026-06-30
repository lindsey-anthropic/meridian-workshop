# Pricing

**RFP #MC-2026-0417 — Meridian Components, Inc.**

---

## Pricing Philosophy

We price by phase with a fixed fee and a hard not-to-exceed (NTE) ceiling. You know what you're paying before each phase begins. There are no hourly billing surprises.

We do not offer the lowest bid in this market. We offer predictable delivery. The previous vendor's unfinished work cost Meridian more than a completed engagement would have. Our pricing reflects the cost of doing it right, not the cost of starting it.

---

## Phase Pricing

### Phase 1 — Foundation (Weeks 1–2)

**Fixed Fee: $18,500** (NTE: $18,500)

| Item | Included |
|---|---|
| Full codebase audit | ✅ |
| Playwright test suite — all existing views | ✅ |
| Architecture documentation (HTML) | ✅ |
| Reports defect register (severity-ranked) | ✅ |
| Phase 1 delivery call and sign-off | ✅ |

**Rationale:** This phase establishes the foundation that makes all subsequent work safe and verifiable. It is the most knowledge-intensive phase — requiring deep audit of an unfamiliar codebase with incomplete documentation.

---

### Phase 2 — Reports Remediation (Weeks 3–4)

**Fixed Fee: $14,000** (NTE: $14,000)

| Item | Included |
|---|---|
| All defects in defect register resolved | ✅ |
| Playwright regression tests per fix | ✅ |
| Tanaka team demo and sign-off session | ✅ |
| Full regression run before merge | ✅ |

**Rationale:** Price covers *all defects found* — not just eight. If the audit surfaces 12 issues, we fix 12. No change order.

---

### Phase 3 — Restocking Recommendations (Weeks 5–8)

**Fixed Fee: $38,500** (NTE: $38,500)

| Item | Included |
|---|---|
| Backend: `/api/restocking/recommendations` endpoint + ranking algorithm | ✅ |
| Backend: purchase order creation endpoint | ✅ |
| Frontend: `/restocking` view with budget ceiling, urgency tiers, warehouse filter | ✅ |
| Frontend: Purchase order creation flow | ✅ |
| Frontend: CSV export | ✅ |
| Full Playwright coverage for all Restocking flows | ✅ |
| Algorithm validation session with Tanaka (Week 5) | ✅ |
| Mid-point demo (Week 6) | ✅ |
| Final delivery demo to buying committee (Week 8) | ✅ |
| Architecture doc addendum | ✅ |

**Rationale:** This is the largest build — 4 weeks, full team, backend and frontend. The Week 5 algorithm validation session is included because getting the ranking logic right with Tanaka before building the UI is non-negotiable for a successful delivery.

---

### Phases 1–3 Combined (R1–R4 Complete)

**Total Fixed Fee: $71,000** (NTE: $71,000)

This covers full delivery of all four required items (R1–R4) with complete automated test coverage, architecture documentation, and stakeholder sign-off sessions.

---

### Phase 4 — Modernization (Weeks 9–12, Optional)

**Available as a package or individual items:**

| Item | Fixed Fee | Weeks |
|---|---|---|
| D1 — UI modernization (full design system refresh) | $12,000 | 1 week |
| D2 — Full i18n + Japanese locale | $9,500 | 1 week |
| D3 — Dark mode | $7,000 | 1 week |
| **D1 + D2 + D3 package** | **$24,000** | 2 weeks (integration) |

Phase 4 items may be contracted at the close of Phase 3 or deferred. They do not affect Phase 1–3 delivery.

---

## Payment Schedule

| Milestone | Amount Due |
|---|---|
| Contract signing | 25% of Phase 1–3 total ($17,750) |
| Phase 1 delivery and sign-off | Remaining Phase 1 balance ($750) |
| Phase 2 delivery and sign-off | Phase 2 full ($14,000) |
| Phase 3 delivery and sign-off | Phase 3 full ($38,500) |
| Phase 4 (if elected) | 50% at contract, 50% at delivery |

**Net-30 payment terms on all invoices.**

---

## What Is Not Included

- Database migration (system uses in-memory mock data; if Meridian elects to introduce a real database, that is a separate engagement)
- Deployment infrastructure (CI/CD pipeline setup, hosting changes, SSL)
- User authentication / access control
- Mobile native apps
- Any work outside the `client/` and `server/` directories (e.g., ERP integration, external APIs)

If any of these are needed, we will scope and price them as a separate statement of work.

---

## Assumptions

1. Meridian provides codebase access (git repository + localhost access) within 2 business days of contract signing.
2. Tanaka and one IT representative are available for a 1-hour kickoff call in Week 1.
3. Tanaka is available for 30-minute demos in Weeks 4, 6, and 8.
4. Okafor or delegate provides written approval for phase sign-off within 3 business days of demo.
5. No third-party API integrations are required for the Restocking feature.
6. Tokyo team (for D2 validation) is reachable by email or video call within 5 business days.
