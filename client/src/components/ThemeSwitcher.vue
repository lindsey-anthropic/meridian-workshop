<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :title="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
    :aria-label="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
  >
    <!-- Sun (shown in dark mode → click for light) -->
    <svg v-if="isDark" class="theme-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
      <path stroke="currentColor" stroke-width="2" stroke-linecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
    <!-- Moon (shown in light mode → click for dark) -->
    <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path stroke="currentColor" stroke-width="2" stroke-linejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
    </svg>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.theme-toggle:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
  background: var(--color-surface);
}

.theme-icon {
  width: 18px;
  height: 18px;
}
</style>
