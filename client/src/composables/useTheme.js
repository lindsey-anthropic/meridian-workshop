import { ref } from 'vue'

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const stored = localStorage.getItem('theme')
const isDark = ref(stored ? stored === 'dark' : systemPrefersDark)

// Apply on first load
document.documentElement.classList.toggle('dark', isDark.value)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggleTheme }
}
