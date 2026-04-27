import { ref, watch } from 'vue'

const savedTheme = localStorage.getItem('app-theme') || 'light'
const isDark = ref(savedTheme === 'dark')

// Apply theme to document on init
document.documentElement.setAttribute('data-theme', savedTheme)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, (dark) => {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  })

  return { isDark, toggleTheme }
}
