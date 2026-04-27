import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'app-theme'
const THEMES = ['light', 'dark']

const detectInitialTheme = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && THEMES.includes(stored)) return stored
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

const currentTheme = ref(detectInitialTheme())
applyTheme(currentTheme.value)

watch(currentTheme, (theme) => {
  applyTheme(theme)
  window.localStorage.setItem(STORAGE_KEY, theme)
})

export function useTheme() {
  const setTheme = (theme) => {
    if (THEMES.includes(theme)) {
      currentTheme.value = theme
    }
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  return {
    currentTheme: computed(() => currentTheme.value),
    isDark: computed(() => currentTheme.value === 'dark'),
    setTheme,
    toggleTheme
  }
}
