import { ref, watch } from 'vue'

const isDark = ref(localStorage.getItem('darkMode') === 'true')

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark)
}

applyTheme(isDark.value)

watch(isDark, (val) => {
  applyTheme(val)
  localStorage.setItem('darkMode', val)
})

export function useDarkMode() {
  const toggle = () => { isDark.value = !isDark.value }
  return { isDark, toggle }
}
