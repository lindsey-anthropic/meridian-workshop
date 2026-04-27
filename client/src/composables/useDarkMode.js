import { ref } from 'vue'

const isDark = ref(localStorage.getItem('darkMode') === 'true')

const applyDarkMode = (dark) => {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('darkMode', dark)
}

applyDarkMode(isDark.value)

export function useDarkMode() {
  const toggleDark = () => {
    isDark.value = !isDark.value
    applyDarkMode(isDark.value)
  }

  return { isDark, toggleDark }
}
