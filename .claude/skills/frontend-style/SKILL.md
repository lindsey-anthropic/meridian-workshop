---
name: frontend-style
description: Design tokens and base component classes for the Meridian inventory dashboard frontend. Use this skill when adding new Vue views or components, restyling existing ones, or making any visual change. Loads automatically when working on files under client/src/.
---

# Frontend Style Guide

This codebase has a small, deliberate design system. **Use it.** Every new view, every visual tweak, should consume the existing tokens and base classes rather than introducing new colors, spacings, or component patterns. Consistency across views is a primary product quality goal — the proposal R1 fixes specifically called out "inconsistent patterns" as a defect to remediate.

## Where the system lives

- [client/src/styles/tokens.css](../../../client/src/styles/tokens.css) — CSS custom properties: colors, spacing, typography, radii, shadows.
- [client/src/styles/base.css](../../../client/src/styles/base.css) — base component classes: `.card`, `.badge`, `.stats-grid`, `.stat-card`, `.page-header`, `.loading`, `.error`, table baseline.
- [client/src/main.js](../../../client/src/main.js) imports both globally — they reach inside scoped Vue components.

The two reference exemplar views — already migrated — are [Reports.vue](../../../client/src/views/Reports.vue) and [Restocking.vue](../../../client/src/views/Restocking.vue). Mirror their structure when writing new views.

## Tokens

Always prefer tokens over hardcoded values. The full set:

| Group | Tokens |
|---|---|
| Neutrals | `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-border-strong` |
| Text | `--color-text`, `--color-text-muted`, `--color-text-dim` |
| Brand | `--color-primary`, `--color-primary-dark`, `--color-primary-light`, `--color-primary-soft` |
| Semantic | `--color-success` / `-text` / `-soft`, `--color-warning` / `-text` / `-soft`, `--color-danger` / `-text` / `-soft` |
| Spacing | `--space-1` (4px) → `--space-7` (48px). 4/8/12/16/24/32/48 |
| Typography | `--font-sans`, `--font-mono`, `--text-xs` → `--text-3xl`, `--weight-{regular,medium,semibold,bold}`, `--leading-{tight,normal}` |
| Radii | `--radius-sm` (4) / `-md` (6) / `-lg` (8) / `-xl` (12) / `-pill` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |

If you find yourself wanting a value that's not in the list — pause. Either an existing token works, or the request is genuinely new (in which case extend tokens.css, don't inline the value).

## Base component classes (use these in templates)

```vue
<!-- Page header: title + subtitle -->
<div class="page-header">
  <h2>{{ t('xxx.title') }}</h2>
  <p>{{ t('xxx.description') }}</p>
</div>

<!-- A content card -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">{{ t('xxx.section') }}</h3>
  </div>
  <!-- ... -->
</div>

<!-- Stats grid (responsive auto-fit) -->
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">{{ t('xxx.label') }}</div>
    <div class="stat-value">{{ formattedValue }}</div>
  </div>
  <!-- repeat -->
</div>

<!-- Pill badges with semantic colors -->
<span class="badge success">OK</span>
<span class="badge warning">Watch</span>
<span class="badge danger">Critical</span>

<!-- Loading and error states (must always render alongside data) -->
<div v-if="loading" class="loading">{{ t('common.loading') }}</div>
<div v-else-if="error" class="error">{{ error }}</div>
<div v-else><!-- content --></div>

<!-- Tables: <table> elements pick up base styling automatically -->
<div class="table-container">
  <table>
    <thead><tr><th>...</th></tr></thead>
    <tbody><tr><td>...</td></tr></tbody>
  </table>
</div>
```

The base CSS already styles `<table>` headers (uppercase, slate, letter-spaced) and rows (hover background, subtle border) globally. View-specific tweaks go in scoped `<style>` and should consume tokens via `var(--xxx)`.

## Rules for view-level scoped CSS

When you write a new Vue view's `<style scoped>` block:

**DO**
- Use the global classes (`.card`, `.badge`, etc.) from your template — they'll style automatically.
- Add scoped styles only for view-specific elements (a unique chart, an in-page action bar, etc.).
- Reference tokens via `var(--space-4)`, `var(--color-primary)`, etc. — never hardcoded values.

**DON'T**
- Re-define `.card`, `.badge`, `.stat-card`, `.stats-grid`, `.loading`, `.error`, `.page-header` in scoped CSS. Those are global.
- Introduce hex colors. If a value isn't in tokens.css, the answer is to add a new token (or use an existing one), not to write `#3b82f6`.
- Override the base `table` styling in scoped CSS unless absolutely necessary.

If an old view (one of the unmigrated ones — `Inventory.vue`, `Orders.vue`, `Spending.vue`, `Demand.vue`, `Dashboard.vue`) still has duplicated styles in its scoped block, leave them alone unless you're explicitly asked to migrate that view. They're unmigrated by design — the migration is a separate piece of work.

## Adding a new view (recipe)

1. Create `client/src/views/MyView.vue` with `<script>` (Composition API), `<template>`, and `<style scoped>` blocks.
2. In `<template>`, use `.page-header`, `.card`, `.stats-grid`, `.badge`, `.loading`, `.error` as needed — no other styling required for the standard page chrome.
3. In `<script>`, follow the existing view pattern: `useI18n` for `t` and `currencySymbol`, `useFilters` for global filter state, `api.*` for HTTP calls, `loadData` triggered on mount and on filter watch.
4. In `<style scoped>`, only add what's specific. Use `var(--*)` tokens for all values.
5. Register the route in [main.js](../../../client/src/main.js) and add the nav link in [App.vue](../../../client/src/App.vue) using `t('nav.myView')`.
6. Add `nav.myView` and a `myView.*` namespace to both [en.js](../../../client/src/locales/en.js) and [ja.js](../../../client/src/locales/ja.js).

## Light reading: when to add to tokens vs. base.css

- **Add to `tokens.css`** if the value is reusable (a color, spacing unit, type size). Token names should describe role, not appearance (`--color-primary`, not `--color-blue-500`).
- **Add to `base.css`** if the pattern is reusable across multiple views (a new card variant, a new badge style, a new layout primitive). Base classes should compose tokens.
- **Add to view scoped CSS** if it's truly unique to that view (a specific chart layout, a one-off animation).

## What's intentionally *not* here

- **No CSS framework** (no Tailwind, no Bootstrap). The design system is small enough that hand-curated tokens are clearer than a utility-first approach. Don't introduce one without an explicit decision.
- **No theme switching mechanism** yet. When dark mode (D3) lands, the token names will gain a `[data-theme="dark"]` override — the views shouldn't need to change.
- **No animation tokens.** Transitions are inline in scoped CSS today (`transition: background 0.2s` etc.). When more motion is needed, that's the moment to add timing/easing tokens.
