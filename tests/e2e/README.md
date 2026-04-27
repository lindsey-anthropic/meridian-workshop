# E2E Tests

Browser-driven end-to-end tests for the Meridian inventory dashboard. Built with [Playwright](https://playwright.dev). Mirrors the layout of the existing `tests/backend/` pytest suite.

## What's covered

Six spec files matching the critical user flows declared in the engagement Technical Approach:

| Spec | Flow | What it locks down |
|---|---|---|
| `inventory.spec.ts` | Inventory | Table renders, search narrows results, warehouse filter scopes the list |
| `orders.spec.ts` | Orders | List renders, status and warehouse filters narrow the order set |
| `spending.spec.ts` | Finance | Page sections render, transactions table populated |
| `demand.spec.ts` | Demand Forecast | Forecast rows render with trend indicators |
| `reports.spec.ts` | Reports (R1 regression) | Filters drive the totals — explicit guard against the pre-fix bug where filters were inert |
| `restocking.spec.ts` | Restocking (R2 regression) | Recommendations render, budget changes recalculate the list, selection enables the action button |

## Running the tests

The dev servers must be running first.

```bash
# from the repo root, in another terminal
./scripts/start.sh
# or in Claude Code:  /start
```

Then:

```bash
cd tests/e2e
npm install                    # first time only
npx playwright install chromium  # downloads the browser binary, first time only
npm test                       # run the suite (headless)
```

### Useful variants

```bash
npm run test:ui       # interactive Playwright UI for debugging
npm run test:headed   # see the browser
npm run report        # open the HTML report from the last run
npx playwright test reports.spec.ts   # run a single spec
npx playwright test -g "filters drive" # run tests matching a name
```

## CI integration

The config respects the `CI` environment variable: tests retry twice and run with one worker for deterministic output. Reporters output both `list` (terminal) and `html` (browsable report at `playwright-report/`).

A minimal GitHub Actions step:

```yaml
- name: Install E2E deps
  working-directory: tests/e2e
  run: |
    npm ci
    npx playwright install --with-deps chromium

- name: Start dev servers
  run: ./scripts/start.sh &

- name: Run E2E tests
  working-directory: tests/e2e
  run: npm test
```

## Design notes

- **Locale is forced to English** in `beforeEach` via `localStorage` — tests are deterministic regardless of which locale the previous interactive session left behind.
- **Selectors prefer roles and visible text** over CSS classes (which can change with refactors). Where structural locators are needed, the tests use `tbody tr` rather than scoped class names.
- **Assertions are lenient on counts** but strict on direction of change — e.g., "Tokyo filter reduces the row count" rather than "exactly 5 rows". This keeps tests robust to future data updates while still catching real regressions.
- **No mutating actions in tests.** The Restocking spec verifies the action button is enabled when items are selected, but does not click "Create Purchase Orders" — that would pollute the in-memory backend state across tests. A separate flow test with proper setup/teardown can be added later.

## Known limitations

- Single browser project (`chromium`). Adding `firefox` and `webkit` is one config change but slows CI; defer until Meridian's IT team requests cross-browser coverage.
- Backend mock data is fixed in JSON. If those files change, the assertions about specific quarter labels (`Q1-2025`) may need updating — see `reports.spec.ts`.
- The dev servers must be started externally. Adding a `webServer` block to `playwright.config.ts` to auto-spawn them is a good follow-up for headless CI.
