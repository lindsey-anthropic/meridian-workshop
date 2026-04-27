# Research Notes — Meridian Components
> Work-in-progress Act 1 / Step 2. Sources: meridian-background.md + vendor-handoff.md + code.
> Feeds: executive-summary, technical-approach, clarifying-questions.

---

## Client profile

| Field | Detail |
|---|---|
| Company | Meridian Components, Inc. — private, founded 2009, HQ San Francisco |
| Sector | Distribution of parts for industrial automation (sensors, actuators, controllers, circuit boards, power supplies) |
| Revenue | ~$9.6M (FY25) |
| Employees | ~180 |
| Warehouse | San Francisco (HQ + primary distribution), London (EMEA), Tokyo (opened 2023, APAC OEM) |
| Tokyo team | ~12 people, variable English → real driver of the i18n ask |

---

## Buying committee — who decides and what they want

| Person | Role | Priority | How to speak to them |
|---|---|---|---|
| **J. Okafor** | Director of Procurement | Timeline and price predictability | RFP criteria, clear milestones, no surprises |
| **R. Tanaka** | VP Operations | Wants the Restocking (R2). Frustrated with previous vendor | Speak to daily operational pain points, not the tech stack |
| **IT (anonymous)** | Technical gatekeeper | Has blocked changes because there are no tests | R3 testing is the prerequisite — must be delivered first |

**Strategic insight:** Tanaka is the internal champion. If the proposal only speaks to Okafor's technical list, we lose the ally who can push internally. The executive summary must reflect the pain of someone who uses the dashboard every day.

---

## Previous vendor analysis (vendor-handoff.md)

### What they delivered
- Working stack: Vue 3 + FastAPI + JSON mock data
- Documentation: file map + API endpoint list — **nothing else**
- No tests, no diagrams, no decision log

### What they did NOT deliver (explicit findings in their own handoff)
- Reports: filters not wired
- Tests: zero coverage
- Composition API migration: incomplete — some views still in Options API

### Implicit findings (from reading the code)
- `/api/reports/quarterly` and `/api/reports/monthly-trends` do not support the warehouse/category/status filters that all other endpoints have → API inconsistency
- `vendor-handoff.md` is 57 lines for a system with 6+ views and 15+ endpoints → documentation inadequate for a professional handoff

### How to use this in the proposal
- **Do not attack the previous vendor** — say that "the documentation received is limited, as is common in these handoffs, and our onboarding plan includes a full audit before estimating the remediation"
- The implicit contrast ("we do it differently") emerges naturally from our structured approach

---

## Technical analysis of the codebase (from code inspection)

### Current architecture

```
Browser (Vue 3 / Vite / port 3000)
    ↓ axios → client/src/api.js
FastAPI (Python / port 8001)
    ↓ import
mock_data.py → server/data/*.json  (no database)
```

### Existing views
- Dashboard (summary + KPI)
- Inventory (filters: warehouse, category)
- Orders (filters: warehouse, category, status, month)
- Reports (known issues)
- Spending (summary, monthly, categories, transactions)
- Backlog + Purchase Orders

### Identified technical risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Options API mixed with Composition API | High | Regressions during R1 fix | Full audit before touching Reports |
| No database → mock data | Low (for now) | R2 Restocking only in memory | Acceptable for current scope; note in proposal |
| Zero tests | Certain | Any fix can break something else | R3 in phase 1 before R1 |
| Thin handoff docs | Certain | Underestimation of hours | 20% buffer on R1 estimate |

---

## Differentiation opportunities

1. **We have already read the code** — no other bidder has done this (or states it). Cite it in the executive summary.
2. **R3 as the unlocker** — IT is a gatekeeper. Whoever understands this wins the buying committee's trust.
3. **Proposal speaking to Tanaka** — if our exec summary talks about "the operations team that cannot trust the Reports data" instead of "remediation of module defects," we are the only ones speaking their language.
4. **Honesty about risks** — Meridian was burned by a vendor who under-delivered. Transparency about risks and assumptions is worth more than the lowest price.
