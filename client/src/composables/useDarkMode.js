import { ref, watchEffect } from 'vue'

const isDark = ref(
  localStorage.getItem('meridian-theme') === 'dark' ||
  (!localStorage.getItem('meridian-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('meridian-theme', isDark.value ? 'dark' : 'light')
})

export function useDarkMode() {
  const toggle = () => { isDark.value = !isDark.value }
  return { isDark, toggle }
}
