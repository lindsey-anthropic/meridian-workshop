# Act 2 — Deliver the Engagement
> Scenario: Meridian chose us. Now we get our hands in the code.
> Stack: Vue 3 (port 3000) + FastAPI (port 8001) + JSON mock data

---

## 0. Get it running

**Goal:** Start the backend and frontend and verify the app runs before touching anything.

**Activities:**
- In the Claude Code terminal, type `/start` (project slash command)
- Alternatively: `./scripts/start.sh`
- Open `http://localhost:3000` in the browser
- Click through all pages — note what looks broken (Reports is the main candidate)

**Output:** App running locally. Visual list of obvious issues.

**Useful prompt:**
```
/start
```

---

## 1. R4 — Architecture Documentation

**Goal:** Understand the codebase before modifying it. Produce documentation useful to Meridian IT.

**Activities:**
- Explore the structure: `client/src/views/`, `client/src/api.js`, `server/main.py`, `server/mock_data.py`
- Map the flows: Vue component → api.js → FastAPI endpoint → JSON data
- Identify tech debt: residual Options API, endpoints without filters, zero tests
- Generate `proposal/architecture.html` — interactive diagram, endpoint catalogue, component map

**Output:** `proposal/architecture.html`

**Useful prompt:**
```
Explore the codebase and generate proposal/architecture.html with:
- architecture diagram (Vue → api.js → FastAPI → JSON)
- endpoint table with supported filters
- component map for each view
- list of tech debt found
Open it in the browser when done.
```

---

## 2. R3 — Automated Browser Testing

**Goal:** Establish the test baseline BEFORE fixing any bugs.
Delivered in Phase 1 — unblocks IT to approve all subsequent changes.

**Prerequisite:** MCP Playwright connected. Verify with `/mcp` in the Claude Code prompt.
If not connected: restart Claude Code in the folder and approve MCP servers when prompted.

**Activities:**
- Type `/mcp` to confirm `playwright` is connected
- Write tests for the 5 critical flows (using `mcp__playwright__*` tools):

| Flow | Test file | What to cover |
|---|---|---|
| Inventory | `tests/e2e/inventory.spec.js` | Load, warehouse filter, category filter, combined |
| Orders | `tests/e2e/orders.spec.js` | Status filter, month filter, combined |
| Reports | `tests/e2e/reports.spec.js` | Quarterly load, monthly trends, filters (even if broken — baseline) |
| Dashboard | `tests/e2e/dashboard.spec.js` | KPIs present, filters update values |
| Restocking | `tests/e2e/restocking.spec.js` | Written after R2, but planned now |

**Output:** `tests/e2e/*.spec.js` — green baseline (or red where bugs exist, documented)

**Useful prompt:**
```
Verify that playwright MCP is connected, then write Playwright tests for the critical flows
inventory and orders. Run them against localhost:3000 and report the results.
```

---

## 3. R1 — Reports Module Remediation

**Goal:** Fix all bugs on the Reports page. Every fix comes with a test.

**Known bugs to fix (from pre-engagement audit):**

| # | Bug | File | Fix |
|---|---|---|---|
| B1 | `/api/reports/quarterly` has no warehouse/category/status filters | `server/main.py` | Add parameters + `apply_filters()` |
| B2 | `/api/reports/monthly-trends` has no filters | `server/main.py` | Add parameters + `apply_filters()` |
| B3 | Frontend Reports does not pass filters to endpoints | `client/src/views/ReportsView.vue` | Wire global filters to API call |
| B4 | Residual Options API in Reports components | `client/src/views/ReportsView.vue` | Migrate to Composition API |
| B5 | Console errors on filter state change | to be identified during audit | Investigate + fix |
| B6–B8+ | To be identified during full audit | TBD | TBD |

**Activities:**
- Full audit of the Reports page — enumerate all bugs before fixing
- Fix in order of operational impact (filters first, then i18n, then console noise)
- Each fix → corresponding Playwright test
- Close with acceptance checklist

**Useful prompt:**
```
Do a full audit of the Reports page: read ReportsView.vue and the
/api/reports/* endpoints in main.py. List all bugs found before touching the code.
Then propose the fix order.
```

---

## 4. R2 — Restocking View

**Goal:** New view that recommends purchase orders given stock + demand + budget.

**Activities:**

### Backend — new endpoint
- File: `server/main.py`
- Endpoint: `GET /api/restocking?budget=&warehouse=&category=`
- Logic:
  1. Get items below reorder point from `/api/inventory`
  2. Cross-reference with demand forecast from `/api/demand`
  3. Calculate priority score: (reorder_point - quantity_on_hand) × demand_trend_weight
  4. Calculate PO quantity to cover projected demand
  5. Sort by priority score, cut to budget ceiling
- Pydantic model: `RestockingRecommendation`

### Frontend — new view
- File: `client/src/views/RestockingView.vue`
- Components: budget input, warehouse/category filters, recommendations table, budget tracker
- Pattern: Composition API, same style as existing views
- Add menu entry in `App.vue` or router

> Use **Plan Mode** (`Shift+Tab`) before starting the build — this is the right moment to align on the architecture before writing code.

**Useful prompt:**
```
[Shift+Tab for Plan Mode]
I want to build the Restocking view: FastAPI endpoint + Vue 3 view.
Input: budget ceiling + optional filters.
Output: list of recommended POs sorted by priority, budget tracker.
Propose the architecture before writing the code.
```

---

## 5. Ship it — Commit, Push, PR

**Goal:** Deliver the work as a real engagement would.

**Activities:**
- `git add` modified files
- `git commit` with a descriptive message
- `git push` to personal fork
- Open PR on GitHub with a summary of changes
- Optional: install GitHub App for automatic review (`/install-github-app`)

**Useful prompt:**
```
Create a commit with all Act 2 changes, open a PR on my fork with
a summary covering R1, R2, R3 and R4.
```

---

## Act 2 Completion Checklist

- [ ] App started with `/start` and verified in the browser
- [ ] `proposal/architecture.html` generated and opened
- [ ] MCP Playwright connected (`/mcp`)
- [ ] Baseline tests written for inventory and orders
- [ ] Reports audit completed — all bugs enumerated
- [ ] R1 Reports — all bugs fixed with tests
- [ ] R2 Restocking — backend endpoint working
- [ ] R2 Restocking — frontend view working
- [ ] R3 Restocking flow test added
- [ ] Commit + Push + PR opened

---

## Claude Code techniques to use in Act 2

| Moment | Technique |
|---|---|
| App startup | `/start` — project slash command |
| MCP check | `/mcp` — check connected servers |
| Before R2 build | `Shift+Tab` — Plan Mode to align on architecture |
| Heavy context | `/compact` — compact the conversation |
| Frontend subagent | `.claude/agents/vue-expert.md` — if Vue work becomes substantial |
| File reference | `@filename` — bring a file into context |
| Doc reference | `#` — search project files |
| End of work | `git commit` + `gh pr create` via Claude |
