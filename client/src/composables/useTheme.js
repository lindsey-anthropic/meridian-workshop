import { ref } from 'vue'

const savedTheme = localStorage.getItem('app-theme') || 'light'
const currentTheme = ref(savedTheme)

document.documentElement.dataset.theme = savedTheme

export function useTheme() {
  const setTheme = (theme) => {
    currentTheme.value = theme
    document.documentElement.dataset.theme = theme
    localStorage.setItem('app-theme', theme)
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  return { currentTheme, setTheme, toggleTheme }
}
