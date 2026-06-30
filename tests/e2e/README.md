# End-to-End Browser Tests (R3)

Automated Playwright coverage of the inventory dashboard's critical user flows,
so changes can be verified before they reach production.

## What's covered

| Spec | Area | Flows |
|------|------|-------|
| `tests/smoke.spec.js` | Operator path | App shell + navigation across Overview, Inventory, Orders, Finance, Demand, Reports, Restocking; filter bar present |
| `tests/reports.spec.js` | R1 remediation | Global filter updates Reports tables; en↔ja i18n of headers; no leftover debug console noise |
| `tests/restocking.spec.js` | R2 feature | Budget returns prioritized recommendations; longer lead time surfaces critical items; funded-first ordering; raising budget removes deferrals; healthy-stock empty state |

## Prerequisites

The app must be running (frontend on :3000, backend on :8001):

```bash
./scripts/start.sh          # from the repo root
```

## Install & run

```bash
cd tests/e2e
npm install
npx playwright install chromium   # one-time browser download
npm test                          # headless
```

Other modes:

```bash
npm run test:headed   # watch it run in a browser
npm run test:ui       # interactive Playwright UI
npm run report        # open the last HTML report
```

Point at a different environment with `BASE_URL`:

```bash
BASE_URL=https://staging.example.com npm test
```

## Conventions & deliberate scope

- **Resilient selectors.** Role/text selectors are preferred over brittle DOM
  paths; the global filter `<select>`s are located by an option unique to each.
- **Relative assertions for Restocking.** Tests assert *behavior* (more budget →
  more funded; longer lead time → more critical), never exact recommended
  quantities — the demand model (forecast / 30-day window) is an unconfirmed
  assumption, so values may change without indicating a regression.
- **No write-path tests.** PO creation (`POST /purchase-orders`) and the task
  write endpoints are not implemented yet (they 404). Restocking is read-only
  recommendations; these tests never exercise persistence.
- **Console-noise check is scoped.** The Reports console test asserts only that
  the removed debug logs are gone — it does not assert zero console output,
  because unrelated app-level errors (the unimplemented `/tasks` endpoint) are
  out of scope for R1.

## CI

`playwright.config.js` runs headless with retries and the GitHub reporter when
`CI` is set. A typical job: start the servers, then `cd tests/e2e && npm ci &&
npx playwright install --with-deps chromium && npm test`.
