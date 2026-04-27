# RFP Analysis — MC-2026-0417
> Work-in-progress Act 1 / Step 1–2. Feeds: executive-summary, technical-approach, clarifying-questions.

---

## Mandatory requirements (R)

| # | Title | Detail | Strategic weight |
|---|---|---|---|
| R1 | Reports remediation | At least 8 known bugs: unwired filters, i18n gaps, console noise, inconsistent API patterns | High — the client has already counted them |
| R2 | Restocking view | New screen: current stock + demand forecast + budget ceiling → PO recommendations | High — direct request from R. Tanaka (VP Ops) |
| R3 | Browser testing | E2E coverage on critical flows with Playwright | **Non-negotiable** — IT uses it as a gatekeeper to block any change |
| R4 | Architecture docs | Current-state overview for handoff to Meridian IT | Low effort, high perceived value |

## Desired requirements (D)

| # | Title | Notes |
|---|---|---|
| D1 | UI modernization | "Current standards" undefined — clarification or assumption needed |
| D2 | i18n | Driver: Tokyo team ~12 people, non-fluent in English. Target languages unspecified (presumably JA) |
| D3 | Dark mode | Use case: stations in low-light warehouse environments |

---

## Ambiguities and gaps in the RFP

| Ambiguity | Impact | Fallback assumption |
|---|---|---|
| "Current standards" for UI (D1) | Unknown modernization target | Assume minor visual refresh (colors, spacing) without full redesign |
| No indicative budget | Cannot calibrate the estimate | T&M proposal with not-to-exceed; ask in clarifying questions |
| "Critical flows" for R3 not defined | Unknown number/which tests to write | Cover: inventory view, orders filter, reports filter, restocking workflow |
| "At least eight issues" on Reports (R1) | The number is a floor, not a ceiling — there may be more | Conduct full audit before estimating; add buffer |
| Languages for D2 | Only Tokyo mentioned, but other future languages possible | Assume JA as first language + extensible i18n architecture |
| Deployment infrastructure | Not mentioned — currently local only | Assume deploy on existing Meridian infrastructure, out of scope |

---

## Client analysis (from meridian-background.md)

**Buying committee — who really matters:**

- **J. Okafor** (Director Procurement) — signs the contract, wants predictability on timeline and price
- **R. Tanaka** (VP Operations) — real champion, uses the dashboard every day, personally requested R2 (Restocking). **Frustrated with previous vendor** → differentiation opportunity
- **IT (unnamed)** — gatekeeper: has blocked changes because there are no tests. R3 unblocks everything else → treat it as a priority even if it's "just" R3

**How to use this in the proposal:**
- Executive summary: address Tanaka's pain points (operational), not just the technical list
- Technical approach: make explicit that R3 is the prerequisite that unblocks the rest
- Timeline: R3 in phase 1 alongside R4, so IT can approve immediately

---

## Vendor handoff analysis (from vendor-handoff.md)

**What they left:**
- Stack: Vue 3 + FastAPI + JSON mock data (no DB)
- Documentation: **minimal** — file map and API list, no diagrams, no design decisions
- Admitted known issues: Reports filters not wired, zero tests, incomplete Options API migration

**Critical finding:** The scarcity of handoff documentation is itself a risk the client should be aware of. It should be cited in the Technical Approach as part of the onboarding plan (R4).

**Technical implications:**
- No database: all data is JSON in memory → R2 (Restocking) is purely front/back logic, no migration needed
- Options API mixed with Composition API → regression risk during R1 Reports fix
- No tests → any change is at risk until R3 is delivered

---

## Questions for procurement (deadline Apr 28)

1. **Budget**: Is there a reference range or an overall not-to-exceed figure?
2. **Critical flows R3**: What are the 3–5 user flows your IT team considers critical to cover with automated tests?
3. **UI standards D1**: Do you have an existing design system or brand guidelines to follow, or is the refresh at the vendor's discretion?
4. **i18n D2**: Beyond Japanese for the Tokyo team, are there other target languages? Does an existing localization system already exist (`.json` files, i18n library) or does it need to be built from scratch?
5. **Deployment**: Is the system currently hosted on Meridian infrastructure or is it still local? Is deployment in scope?

---

## Notes for the proposal

- **Key differentiator**: demonstrate that we have already read the code and identified the problems — the previous vendor did not
- **Tone**: speak to Tanaka (operations), not just to Okafor (procurement)
- **R3 as prerequisite**: make explicit that tests are what unblocks the rest, not just a deliverable
- **Honesty about risks**: thin handoff docs = contingency buffer in the estimate
