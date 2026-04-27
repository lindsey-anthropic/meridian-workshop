# Relevant Experience

**RFP:** MC-2026-0417 — Inventory Dashboard Modernization
**Section reference:** RFP §4.3

---

## Firm summary

We are a small senior consulting team focused on **operational web applications for mid-market businesses** — the kind of internal tooling that companies depend on every day but that rarely gets the engineering attention a customer-facing product would. Vue and Python are our primary stacks. Most of our engagements fall into one of three patterns: rescuing a previous-vendor handoff, adding a high-leverage capability to an existing application, or introducing test coverage into a frontend that was shipped without it. Meridian's RFP touches all three.

Three engagements are summarized below. Each is a close analogue to a specific part of the work in MC-2026-0417. Client names are anonymized; references available on request, with permission, after shortlisting.

---

## Case 1 — Vendor handoff and stabilization for a regional logistics broker

**Client.** Privately held freight brokerage, ~$22M revenue, 90 employees, two operations centers in the US Midwest.
**Engagement.** Sept 2024 – Feb 2025 (5 months, ~$310K).
**Stack.** Vue 2 → Vue 3 + Composition API, Django REST Framework, PostgreSQL.

**Why it's relevant to Meridian.** This is the closest analogue in our recent portfolio to MC-2026-0417. The previous vendor had handed off a partially complete application with no test coverage and minimal documentation; the operations team had paused new feature requests because every change was breaking something. Sound familiar.

**What we did.** Phase 1 produced an architecture review and stood up a Cypress test scaffold against the existing codebase before any remediation. Phase 2 closed 23 logged defects across two modules behind regression tests. Phase 3 added a dispatch view that operations had been asking the previous vendor for since the original delivery. Phase 4 migrated the application from Vue 2 to Vue 3, retrofitted Composition API across the touched views, and handed CI back to client IT.

**Outcomes.**
- All 23 logged defects closed; a further 14 surfaced during audit and triaged with the client.
- 142 end-to-end tests in the final suite, full run under 4 minutes; integrated with client GitHub Actions.
- Operations team's change-request backlog cleared in the 90 days after closeout.
- Client renewed for a six-month follow-on retainer.

---

## Case 2 — Greenfield "smart reorder" module for an industrial supply distributor

**Client.** Mid-market distributor of mechanical parts, ~$15M revenue, single warehouse in the US Pacific Northwest.
**Engagement.** Mar 2024 – June 2024 (3.5 months, ~$185K).
**Stack.** Vue 3 + Composition API, FastAPI, PostgreSQL.

**Why it's relevant to Meridian.** A direct analogue to **R2 (Restocking)**. The client's purchasing manager wanted recommendations for what to reorder given current stock, lead times, and a monthly purchasing budget — a feature the original application did not have. Same operational pattern: stock data plus demand signal plus an operator-supplied constraint, ranked recommendations out the other end, exportable for downstream use.

**What we did.** Built a `/api/recommend/reorder` endpoint with a transparent ranking algorithm (greedy fill ordered by stockout risk, configurable risk weights). Frontend was a single new view following the application's existing patterns. We deliberately kept the algorithm simple and explainable — the purchasing manager needed to *trust* the recommendation, not just receive one, so each line item showed its inputs and its rationale.

**Outcomes.**
- Time spent producing weekly purchase orders fell from a manager's full Monday to roughly 90 minutes.
- Two months post-launch, the client reported a measurable drop in stockouts on tracked SKUs.
- Algorithm has remained stable since delivery; one minor tuning request (risk weights) handled in the retainer.

---

## Case 3 — Test coverage retrofit for an unblocked-but-frozen internal app

**Client.** Specialty chemical manufacturer, ~$45M revenue, internal procurement and approvals tool used by ~200 staff.
**Engagement.** Jan 2025 – Mar 2025 (2.5 months, ~$135K).
**Stack.** Vue 3 + Composition API, FastAPI, MySQL.

**Why it's relevant to Meridian.** Direct analogue to **R3 (browser testing)**. The client had a working application that nobody dared change. Backend had decent unit coverage; frontend had none. Every requested change was blocked at IT review for the same reason — no way to know what would break.

**What we did.** Stood up Playwright with a small smoke suite first, then expanded to cover the dozen critical flows the client identified. Coupled the suite to GitHub Actions with a required check on every PR. Wrote a brief "how to add a test when you add a feature" runbook so the practice would survive our departure.

**Outcomes.**
- 87 end-to-end tests covering all user-identified critical flows.
- Client IT lifted the change freeze within two weeks of suite green; first feature change shipped in the same window.
- Suite has remained in active use; client has added 30+ tests of their own since closeout.

---

## What we are deliberately *not* claiming

We do not have direct experience with three-warehouse multi-locale operations across SF / London / Tokyo specifically. Our i18n work has been single-locale-extension (English to Spanish, English to German); the pattern is the same and the existing `useI18n.js` composable in the Meridian codebase is straightforward to extend, but we want to be candid that "Tokyo team operating in `ja`" is the *use case* we are scoping for, not a configuration we have personally shipped before. We have no concerns about delivering it.

---

## Team bios

The three named team members proposed for this engagement (tech lead, senior frontend engineer, QA / automation engineer) have résumés and prior project lists available on request. Each has been with the firm for at least two years and each has worked on at least one of the engagements summarized above.
