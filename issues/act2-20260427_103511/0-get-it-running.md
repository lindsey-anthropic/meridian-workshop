# 0 — Get it running
> Prerequisite for all of Act 2. Verify the stack starts before touching any code.

## Commands

```bash
# Option A — slash command (from Claude Code in terminal)
/start

# Option B — direct script
./scripts/start.sh

# Option C — manual
cd server && uv run python main.py        # port 8001
cd client && npm install && npm run dev   # port 3000
```

## Verification

| URL | Expected |
|---|---|
| `http://localhost:3000` | Vue dashboard — KPIs, sidebar nav |
| `http://localhost:8001/docs` | FastAPI Swagger — endpoint list |
| `http://localhost:8001/api/inventory` | JSON array of inventory items |

## What to look for in the browser

Click every nav item and note:
- Dashboard → should work
- Inventory → should work
- Orders → should work
- **Reports → visible issues** (filters don't respond)
- Spending → should work
- Backlog → should work

## Status: to be done in terminal
