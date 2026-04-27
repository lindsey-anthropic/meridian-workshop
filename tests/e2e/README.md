# End-to-End Browser Tests

Automated browser tests for the Meridian Components Inventory Dashboard, covering critical user flows required per RFP R3.

## Overview

These tests verify:
- Navigation between dashboard views
- Filter application and data updates
- Reports page functionality (post-remediation)
- Data accuracy across views
- Language switching and internationalization

## Test Structure

**`test_critical_flows.py`** — Test scenario definitions organized by flow:
- `TestNavigation` — Navigation between Overview, Inventory, Orders, Finance, Reports
- `TestFilters` — Filter application (Time Period, Warehouse, Category, Order Status)
- `TestReportsPage` — Reports module specific tests (addressing R1 defects)
- `TestDataAccuracy` — Data display validation (KPIs, tables, charts)
- `TestLanguageSwitching` — i18n support for Tokyo warehouse staff

**`TEST_RESULTS.md`** — Latest test execution results with pass/fail status

## Running Tests

### Prerequisites

1. **Application running locally:**
   ```bash
   ./scripts/start.sh
   # or use /start slash command in Claude Code
   ```
   Frontend: http://localhost:3000  
   Backend: http://localhost:8001

2. **Playwright MCP server connected** (if using Claude Code):
   - The `.mcp.json` configuration includes Playwright
   - Approve the MCP server when prompted
   - Verify with `/mcp` command

### Execution

#### Option 1: Via Claude Code (Recommended)

With the Playwright MCP server connected, ask Claude to execute specific test scenarios:

```
Run the navigation tests from test_critical_flows.py
```

Claude will use the `mcp__playwright__*` tools to:
- Navigate pages (`browser_navigate`)
- Inspect page structure (`browser_snapshot`)
- Interact with elements (`browser_click`, `browser_fill_form`, `browser_select_option`)
- Take screenshots (`browser_take_screenshot`)
- Check console errors (`browser_console_messages`)

#### Option 2: Manual Execution

The test file documents scenarios as Python test methods. To execute manually:

1. Read a test method (e.g., `test_warehouse_filter_application`)
2. Follow the steps in comments
3. Use browser dev tools or Playwright directly to verify expected vs actual behavior

#### Option 3: Traditional Playwright (Future)

To run these as standard Playwright tests, you would need to:
1. Install Playwright: `npm install -D @playwright/test`
2. Convert test methods to actual Playwright test code with assertions
3. Run via: `npx playwright test`

*Currently, these are scenario definitions executed via Claude Code's Playwright MCP integration.*

## Test Coverage

### Completed ✅
- Navigation to Reports page
- Navigation to Inventory page
- Warehouse filter on Reports page
- Data accuracy on Reports and Inventory pages

### Remaining Scenarios (Defined, Not Yet Executed)
- Navigation to Orders, Finance, Demand Forecast
- Category, Time Period, Order Status filters
- Multiple filters combined
- Reset filters button
- Language switching (English ↔ Japanese)
- Overview page KPIs and charts
- Inventory Shortages table
- Top Products table

## Known Issues

### Non-Blocking
- `/api/tasks` endpoint returns 404 — does not impact core functionality
- Console errors logged but do not prevent page loads or user actions

## Adding New Tests

To add a new test scenario to `test_critical_flows.py`:

1. Choose the appropriate test class (or create a new one)
2. Add a method starting with `test_`
3. Document the scenario in the docstring
4. Write step-by-step comments describing:
   - What to navigate to
   - What to click/fill/select
   - What to verify (expected outcome)
5. Use `pass` as placeholder or implement using Playwright MCP patterns

### Example Test Method

```python
def test_orders_page_loads(self):
    """Verify Orders page displays order data"""
    # Navigate to http://localhost:3000
    # Click "Orders" navigation link
    # Verify URL is /orders
    # Take snapshot
    # Verify orders table exists
    # Verify table has columns: Order ID, Date, Customer, Amount, Status
    # Verify at least one order row is present
    pass
```

## CI Integration (Future)

To integrate these tests into a CI/CD pipeline:

1. Convert to standard Playwright tests with assertions
2. Add `playwright.config.ts` configuration
3. Set up GitHub Actions or similar to:
   - Start the application (`./scripts/start.sh`)
   - Wait for http://localhost:3000 to be ready
   - Run `npx playwright test`
   - Upload test results and screenshots as artifacts

## Resources

- **RFP Requirement R3:** `docs/rfp/MC-2026-0417.md` (section 3.1)
- **Vendor Handoff Notes:** `docs/rfp/vendor-handoff.md`
- **Playwright MCP Docs:** https://github.com/modelcontextprotocol/servers/tree/main/src/playwright
- **Latest Results:** `TEST_RESULTS.md`

---

*Tests created for Meridian Components engagement — RFP #MC-2026-0417*
