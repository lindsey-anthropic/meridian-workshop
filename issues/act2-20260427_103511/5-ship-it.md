# 5 — Ship it
> Commit + Push + PR on personal fork

## Prerequisites checklist

- [ ] R4 `proposal/architecture.html` generated and opened in browser
- [ ] R3 test baseline written (red on Reports = expected, documents bug)
- [ ] R1 all 8+ bugs fixed with tests
- [ ] R2 Restocking view working end-to-end
- [ ] App manually verified on localhost:3000

## Commands

```bash
# Check state
git status
git diff

# Stage specific files
git add proposal/architecture.html
git add tests/e2e/
git add server/main.py
git add client/src/views/Reports.vue
git add client/src/views/Restocking.vue
git add client/src/api.js

git commit -m "feat: deliver R1-R4 for Meridian Components engagement

- R4: add interactive architecture documentation (proposal/architecture.html)
- R3: add Playwright e2e tests for 5 critical flows
- R1: fix Reports module - wire filters, migrate to Composition API, remove console noise
- R2: add Restocking view with budget ceiling and PO recommendations"

# Push to fork
git push origin main

# Open PR
gh pr create \
  --title "Meridian engagement: R1 Reports fix, R2 Restocking, R3 Tests, R4 Architecture" \
  --body "..."
```

## Suggested prompt

```
Create a commit with all Act 2 changes and open a PR on my fork.
Title should cover R1, R2, R3 and R4.
Include in the body: change summary, test plan, and any screenshots if available.
```

## Optional — GitHub App for automated review

```
/install-github-app
```
Follow the OAuth flow in the browser — Claude cannot do this step for you.
