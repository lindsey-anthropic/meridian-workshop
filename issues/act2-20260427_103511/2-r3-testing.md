# 2 — R3 Automated Browser Testing
> Output: `tests/e2e/*.spec.js` — Playwright baseline on 5 critical flows
> Prerequisite: MCP Playwright connected (run `/mcp` in Claude Code)

## Verify MCP connection

```
/mcp
```
Must show `playwright` as connected. If not: restart Claude Code in this folder
and approve MCP servers when prompted on startup.

## 5 Critical flows

### Flow 1 — Inventory
**File:** `tests/e2e/inventory.spec.js`

```
- Open localhost:3000
- Navigate to Inventory
- Verify table loads (at least 1 row)
- Apply warehouse filter → verify results change
- Apply category filter → verify results change
- Apply both → verify combined filter
- Reset filters → verify full list returns
```

### Flow 2 — Orders
**File:** `tests/e2e/orders.spec.js`

```
- Navigate to Orders
- Verify table loads
- Filter by status "Delivered" → only delivered visible
- Filter by month → results reduced
- Filter status + month together
```

### Flow 3 — Reports (baseline — some tests will be red)
**File:** `tests/e2e/reports.spec.js`

```
- Navigate to Reports
- Verify Quarterly Performance table loads
- Verify Monthly Revenue chart loads
- Apply warehouse filter → [EXPECTED FAILURE — R1 bug]
- Verify data does NOT change (documents the bug)
```
> Red tests here are the baseline that proves the bugs exist. They are not test errors.

### Flow 4 — Dashboard
**File:** `tests/e2e/dashboard.spec.js`

```
- Navigate to Dashboard
- Verify KPIs present (total inventory value, low stock, pending orders)
- Apply warehouse filter → KPIs update
- Apply category filter → KPIs update
- Verify values are > 0
```

### Flow 5 — Restocking (write after R2 is built)
**File:** `tests/e2e/restocking.spec.js`

```
- Navigate to Restocking
- Enter budget ceiling (e.g. $50,000)
- Verify recommendations appear
- Verify total cost does not exceed budget
- Apply warehouse filter → recommendations update
```

## File structure

```
tests/
└── e2e/
    ├── inventory.spec.js
    ├── orders.spec.js
    ├── reports.spec.js      ← some red tests = R1 bug documentation
    ├── dashboard.spec.js
    └── restocking.spec.js   ← after R2
```

## Suggested prompt

```
Verify playwright MCP is connected with /mcp.
Then write tests/e2e/inventory.spec.js and tests/e2e/orders.spec.js
using mcp__playwright__* tools against localhost:3000.
Run them and report results.
```
