import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'app-theme'
const ATTRIBUTE = 'data-theme'

function readInitialTheme() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (stored === 'light' || stored === 'dark') return stored

  const prefersDark = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

const currentTheme = ref(readInitialTheme())

function applyTheme(theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute(ATTRIBUTE, theme)
  }
}

applyTheme(currentTheme.value)

watch(currentTheme, (theme) => {
  applyTheme(theme)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, theme)
  }
})

export function useTheme() {
  const isDark = computed(() => currentTheme.value === 'dark')

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (theme) => {
    if (theme === 'light' || theme === 'dark') {
      currentTheme.value = theme
    }
  }

  return {
    currentTheme: computed(() => currentTheme.value),
    isDark,
    toggleTheme,
    setTheme
  }
}
