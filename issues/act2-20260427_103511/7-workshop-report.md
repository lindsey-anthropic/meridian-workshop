# Workshop Report — Using Claude in Real Work

A post-exercise analysis of what the workshop taught about effective Claude usage.
Date: 2026-04-27

---

## 1. Categories of Work — Where Claude Is Strong

During the exercise, eight distinct task types emerged. These map directly to real daily work categories:

| Category | Exercise example | Rating |
|----------|-----------------|--------|
| **Document reading & synthesis** | RFP analysis, Act 1 proposal | Excellent. Extracts structure, gaps, open questions |
| **Code archaeology** | Understanding an unknown codebase | Excellent. Reads everything in parallel |
| **Static bug detection** | 8 bugs in Reports.vue found without running it | Very good. Pattern matching on code |
| **Refactoring to a known pattern** | Options API → Composition API | Excellent. Existing template = high quality output |
| **Feature build from scratch** | Restocking.vue + `/api/restocking` | Good, with risk on CSS class assumptions |
| **Technical documentation** | `architecture.html`, audit.md | Excellent. Zero cognitive cost for Claude |
| **Test writing** | 23 Playwright tests | Good, requires 1–2 iterations on real selectors |
| **Runtime debugging** | Vite alias, tasks 404, wrong selectors | Fair. Requires feedback loop with output |

**The key distinction:** everything solvable by reading code Claude handles well on the first attempt. Everything requiring *running* code and observing behavior needs iteration.

---

## 2. The Work Pattern That Emerged

The work was not linear. The actual pattern was:

```
Read everything in parallel
→ Form hypotheses about bugs
→ Write fixes
→ Run (tests / Playwright)
→ Read output / screenshots
→ Immediate diagnosis
→ Targeted fix
→ Re-run
```

The debug cycle took 3 iterations for the e2e tests. This is **normal and expected** — not a model failure, it is the correct software development cycle. The difference from a human: each iteration is much faster because there is no cognitive overhead reading stack traces, searching documentation, or recalling syntax.

---

## 3. What Made the Exercise Work (Workshop Design)

The workshop is well-built for three specific reasons:

**a) CLAUDE.md does all the briefing work**
Every time the project is opened, Claude automatically reads the narrative context, roles, and expectations. This is the most important pattern to take home: **a good CLAUDE.md is worth hours of conversation**. In your work: every company repository should have an equivalent file explaining the business context, not just the technical structure.

**b) The bugs are realistic, not artificial**
The filter that does nothing, the missing Vite alias, the console.log left in production — these are exactly the defects found in real codebases left by external vendors or teams under pressure. The skills demonstrated are directly transferable.

**c) The R1→R2→R3→R4 progression is a real engagement structure**
Fix → Feature → Test → Documentation is the sequence of any modernization project. The workshop simulates real work, not an academic exercise.

---

## 4. Where the Model Needed Human Judgment

These are the areas where human intervention was or would have been necessary:

**Scope decisions**
When the missing tasks endpoints were found, an in-memory implementation was added. An alternative was "ignore the 404, it is out of scope for R1." That is a business decision, not a technical one — and it was made autonomously. In a real context, it should be agreed upon with the team.

**What is a planted trap vs what we broke**
Distinguishing the 2 pre-existing pytest failures (by design) from tests that would fail due to our changes requires workshop context knowledge. Claude made the correct inference ("these are traps") but it is an inference — not a certainty.

**Playwright selectors**
Tests were written assuming `.stat-card` from App.vue, but Dashboard uses `.kpi-card`. This error is avoidable with two approaches: (a) read the specific component before writing the test, (b) use semantic selectors (`getByRole`) instead of CSS classes. CSS classes were used because they were faster to write — a wrong choice for robustness.

---

## 5. Practical Implications for Real Work

**What to hand to Claude immediately, without hesitation:**
- First analysis of an RFP or requirements document
- Code review of PRs (finds problematic patterns, style inconsistencies)
- Migration of code from one pattern to another (e.g. class component → functional, REST → GraphQL)
- First draft of technical documentation from an existing codebase
- Unit and integration tests on code you have already written
- Refactoring of legacy code with clear patterns to follow

**Where it pays to structure context well beforehand:**
- Projects with many files → invest 30 minutes in a solid CLAUDE.md
- Legacy codebase with no documentation → run a "code archaeology" session first, then fixes
- New features → use Plan Mode (Shift+Tab in Claude Code) to agree on approach before generating code

**Where to keep human control:**
- Architectural decisions with non-obvious trade-offs
- Anything touching production data or shared infrastructure
- Scope decisions ("fix this bug or refactor the whole module?")
- Final code review before merge — Claude is fast but not infallible on edge cases

---

## 6. The Honest Metric

The full exercise (Act 1 + Act 2 + tests + audit) in a workshop context with interleaved conversation took approximately **3–4 hours of session time**.

Comparative estimate for a mid-level developer without AI:
- Act 1 (proposal): 4–6 hours
- R1 (fix Reports): 2–3 hours (read, understand, debug, test)
- R2 (Restocking feature): 3–4 hours
- R3 (Playwright setup + 23 tests): 2–3 hours
- R4 (architecture): 1–2 hours
- **Total: 12–18 hours**

The real acceleration factor is approximately **4–5x** on this type of work. Not 10x, not 100x — but consistent across the entire value chain (analysis, code, tests, docs), not just on writing code.

---

## 7. Planted Traps — Reference List

The workshop deliberately embedded defects to test detection capability:

**In application code (intentional):**
- `Reports.vue`: 8 bugs — no `useFilters()`, Options API, index-based `v-for` keys, `loading` never reset on error, `console.log` in production, no null guard on date parsing
- `/api/reports/quarterly` and `/api/reports/monthly-trends`: accepted filter query params but silently ignored them — the classic "filter that does nothing"
- `Restocking.vue`: did not exist, had to be built from scratch
- `vite.config.js`: no `@` alias — app compiled but crashed at runtime when new files used `@/` imports

**In pre-existing backend tests (intentional):**
- `test_stable_demand_items_have_small_changes`: asserts ≥5 `stable` items, mock data has 4
- `test_demand_forecast_has_new_items`: looks for SKU `SNR-420` which does not exist in mock data

These last two simulate the real-world case where tests were written ahead of backend implementation — a common pattern in TDD or when specs and code are written by different people.
