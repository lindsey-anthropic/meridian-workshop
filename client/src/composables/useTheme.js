import { ref } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

export function useTheme() {
  const applyTheme = (dark) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  const initTheme = () => {
    applyTheme(isDark.value)
  }

  return { isDark, toggleTheme, initTheme }
}
