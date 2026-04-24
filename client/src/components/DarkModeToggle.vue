<template>
  <button class="dark-toggle" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggle">
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<script>
import { useDarkMode } from '../composables/useDarkMode'
export default {
  name: 'DarkModeToggle',
  setup() {
    return useDarkMode()
  }
}
</script>

<style scoped>
.dark-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  transition: background 0.15s;
  margin-right: 0.5rem;
}
.dark-toggle:hover {
  background: var(--bg-hover);
}
</style>
