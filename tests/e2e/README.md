# End-to-End Browser Tests (RFP R3)

Automated browser coverage of the inventory dashboard's critical user flows,
built with [Playwright](https://playwright.dev). This is the safety net that lets
Meridian IT approve future changes with confidence.

## What's covered

| Spec | Flow |
|------|------|
| `specs/navigation.spec.js` | Every primary view is reachable and renders its data (no error / no stuck loading) |
| `specs/reports.spec.js` | Reports loads, renders all sections, currency formatting, **clean console**, filter reactivity (Tokyo 250→88), reset — protects the R1 remediation |
| `specs/data-views.spec.js` | Orders rows + warehouse filtering; Inventory / Finance / Demand load cleanly |
| `specs/tasks.spec.js` | Tasks create → toggle → delete (exercises the `/api/tasks` backend) |

## One-time setup

```bash
cd tests/e2e
npm install
npx playwright install chromium
```

## Running

The suite targets the running app at http://localhost:3000.

- **If the servers are already running** (e.g. via `/start` or `./scripts/start.sh`),
  just run the tests — they reuse the running servers.
- **If nothing is running**, Playwright will start both servers automatically via
  `scripts/start.sh` (see `webServer` in `playwright.config.js`).

```bash
cd tests/e2e
npm test               # headless run
npm run test:headed    # watch it drive a real browser
npm run test:ui        # interactive UI mode
npm run report         # open the last HTML report
```

## CI

`reuseExistingServer` is disabled automatically when `CI=true`, so a CI job can
simply run `npm install && npx playwright install --with-deps chromium && npm test`
and Playwright will boot the app itself. Failures capture a trace and screenshot.
