import { ref, watch } from 'vue'

const isDark = ref(
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

applyTheme(isDark.value)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  watch(isDark, applyTheme)

  return { isDark, toggleTheme }
}
