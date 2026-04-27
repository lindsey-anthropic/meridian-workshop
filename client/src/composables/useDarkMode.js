import { ref, watchEffect } from 'vue'

const isDark = ref(localStorage.getItem('meridian-dark') === 'true')

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('meridian-dark', isDark.value)
})

export function useDarkMode() {
  const toggleDark = () => { isDark.value = !isDark.value }
  return { isDark, toggleDark }
}
