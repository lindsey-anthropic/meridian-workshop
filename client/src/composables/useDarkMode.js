import { ref, watch } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

applyTheme(isDark.value)

export function useDarkMode() {
  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, applyTheme)

  return { isDark, toggleDark }
}
