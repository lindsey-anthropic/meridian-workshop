<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
    :title="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
    @click="toggleTheme"
  >
    <svg v-if="isDark" class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="2"  x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2"  y1="12" x2="5"  y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.5"  y1="4.5"  x2="6.5"  y2="6.5"/>
        <line x1="17.5" y1="17.5" x2="19.5" y2="19.5"/>
        <line x1="4.5"  y1="19.5" x2="6.5"  y2="17.5"/>
        <line x1="17.5" y1="6.5"  x2="19.5" y2="4.5"/>
      </g>
    </svg>
    <svg v-else class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
      />
    </svg>
  </button>
</template>

<script>
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'ThemeToggle',
  setup() {
    const { isDark, toggleTheme } = useTheme()
    const { t } = useI18n()
    return { isDark, toggleTheme, t }
  }
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-rule);
  background: var(--color-paper);
  color: var(--color-ink-soft);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.theme-toggle:hover {
  background: var(--color-surface-muted);
  color: var(--color-ink);
  border-color: var(--color-rule-strong);
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
