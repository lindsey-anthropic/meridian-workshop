# Act 1 — Completed
> Date: 2026-04-27 | Session: VS Code + Claude Code

---

## Final status: ✅ Completed

All deliverables required by RFP §4 have been produced in `proposal/`.

---

## Produced deliverables

| File | Description | Status |
|---|---|---|
| `proposal/executive-summary.md` | 1 page, problem + approach + differentiators | ✅ |
| `proposal/technical-approach.md` | R1–R4 with technical detail + assumptions A1–A5 | ✅ |
| `proposal/timeline.md` | 3 phases, 6 weeks, milestones + risks | ✅ |
| `proposal/pricing.md` | T&M not-to-exceed, $90K required / $122K with optional | ✅ |
| `proposal/capabilities-deck.html` | 10-slide self-contained HTML, navigable with ←→ | ✅ |

---

## Work-in-progress files used (this folder)

| File | Feeds |
|---|---|
| `rfp-analysis.md` | executive-summary, technical-approach |
| `research-notes.md` | executive-summary, technical-approach, pricing |
| `clarifying-questions.md` | technical-approach (Assumptions section A1–A5) |

---

## Work summary by step

**Step 1 — Read & Analyze RFP**
- 4 mandatory requirements (R1–R4), 3 desired (D1–D3)
- 5 ambiguities identified: budget, critical flows R3, UI standards D1, i18n languages D2, deployment
- Key insight: R3 testing is the IT gatekeeper — must be delivered in Phase 1

**Step 2 — Research the Client**
- Buying committee: Okafor (procurement), Tanaka (VP Ops, champion), anonymous IT (gatekeeper)
- Previous vendor: 57-line handoff, zero tests, incomplete Composition API migration
- Differentiator: we read the code before writing the proposal

**Step 3 — Clarifying Questions**
- 5 questions to procurement (deadline Apr 28): budget, critical flows, UI standards, i18n languages, deployment
- For each: fallback assumption used in the technical approach

**Step 4 — Write the Proposal**
- Executive summary: operational tone (speaks to Tanaka, not just Okafor)
- Technical approach: R1 audit-first + 20% buffer, R2 restocking logic, R3 in Phase 1, R4 at onboarding
- Timeline: 3 phases with gate and written sign-off at each milestone
- Pricing: T&M NTE, $90K required, $122K with D1–D3, payment in 3 tranches

**Step 5 — Capabilities Deck**
- 10-slide HTML, dark/light style, serif, orange accent
- Navigable with arrow keys and anchor `#N`
- Opened in browser, ready for iteration

---

## Implicit lesson of Act 1

Each step demonstrated a concrete collaboration technique with Claude Code:

| Step | Demonstrated technique |
|---|---|
| 1 | Claude as research partner on documents |
| 2 | Multi-document synthesis → strategic insights |
| 3 | Claude generating questions + fallback assumptions |
| 4 | Collaboration loop: Brief → Draft → Review → Refine, one section at a time |
| 5 | Claude generating visual artifacts (HTML deck) from text work-in-progress |

---

## Next step: Act 2

*"We submitted. Two weeks later Meridian picked us. Everything up to now has been documents — from here it's hands on keyboard in the actual codebase."*

Open Claude Code in the terminal:
```bash
cd meridian-workshop
claude
```
Then type `/start` to launch the backend and frontend, and begin from R4 (architecture) or R1 (reports audit).
