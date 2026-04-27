<template>
  <div class="app">
    <header class="top-nav">
      <div class="nav-container">
        <div class="logo">
          <h1>{{ t('nav.companyName') }}</h1>
          <span class="subtitle">{{ t('nav.subtitle') }}</span>
        </div>
        <nav class="nav-tabs">
          <router-link to="/" :class="{ active: $route.path === '/' }">
            {{ t('nav.overview') }}
          </router-link>
          <router-link to="/inventory" :class="{ active: $route.path === '/inventory' }">
            {{ t('nav.inventory') }}
          </router-link>
          <router-link to="/orders" :class="{ active: $route.path === '/orders' }">
            {{ t('nav.orders') }}
          </router-link>
          <router-link to="/spending" :class="{ active: $route.path === '/spending' }">
            {{ t('nav.finance') }}
          </router-link>
          <router-link to="/demand" :class="{ active: $route.path === '/demand' }">
            {{ t('nav.demandForecast') }}
          </router-link>
          <router-link to="/reports" :class="{ active: $route.path === '/reports' }">
            {{ t('nav.reports') }}
          </router-link>
          <router-link to="/restocking" :class="{ active: $route.path === '/restocking' }">
            {{ t('nav.restocking') }}
          </router-link>
          <router-link to="/backlog" :class="{ active: $route.path === '/backlog' }">
            {{ t('nav.backlog') }}
          </router-link>
        </nav>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </header>
    <FilterBar />
    <main class="main-content">
      <router-view />
    </main>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)

    const isDark = ref(localStorage.getItem('theme') === 'dark')

    const applyTheme = (dark) => {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }

    const toggleTheme = () => {
      isDark.value = !isDark.value
    }

    watch(isDark, applyTheme, { immediate: true })
    const apiTasks = ref([])

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask,
      isDark,
      toggleTheme
    }
  }
}
</script>

<style>
:root {
  /* Brand */
  --color-brand: #2563eb;
  --color-brand-light: #eff6ff;
  --color-brand-muted: #dbeafe;

  /* Semantic */
  --color-danger: #dc2626;
  --color-danger-light: #fef2f2;
  --color-danger-border: #fecaca;
  --color-warning: #ea580c;
  --color-warning-light: #fed7aa;
  --color-success: #059669;
  --color-success-light: #d1fae5;
  --color-info: #2563eb;
  --color-info-light: #dbeafe;

  /* Neutrals */
  --color-text-primary: #0f172a;
  --color-text-secondary: #1e293b;
  --color-text-muted: #64748b;
  --color-text-subtle: #475569;
  --color-text-body: #334155;

  /* Surfaces */
  --color-surface: #ffffff;
  --color-surface-raised: #fafbff;
  --color-bg: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%);

  /* Borders */
  --color-border: rgba(226, 232, 240, 0.6);
  --color-border-solid: #e2e8f0;
  --color-border-light: #f1f5f9;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06);
  --shadow-nav: 0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 2px 8px rgba(37, 99, 235, 0.06);

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-pill: 999px;
}

[data-theme="dark"] {
  /* Brand */
  --color-brand: #3b82f6;
  --color-brand-light: #1e3a5f;
  --color-brand-muted: #1e3a5f;

  /* Semantic */
  --color-danger: #f87171;
  --color-danger-light: #2d1515;
  --color-danger-border: #7f1d1d;
  --color-warning: #fb923c;
  --color-warning-light: #2d1a0a;
  --color-success: #34d399;
  --color-success-light: #052e16;
  --color-info: #60a5fa;
  --color-info-light: #1e3a5f;

  /* Neutrals */
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-text-subtle: #64748b;
  --color-text-body: #cbd5e1;

  /* Surfaces */
  --color-surface: #1e2330;
  --color-surface-raised: #252b3b;
  --color-bg: linear-gradient(135deg, #0f1117 0%, #141824 50%, #0f1a17 100%);

  /* Borders */
  --color-border: rgba(55, 65, 81, 0.8);
  --color-border-solid: #374151;
  --color-border-light: #1f2937;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3);
  --shadow-nav: 0 1px 3px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(59, 130, 246, 0.15);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-nav {
  background: linear-gradient(to right, var(--color-surface), var(--color-surface-raised));
  border-bottom: 2px solid var(--color-brand);
  box-shadow: var(--shadow-nav);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  height: 72px;
}

.nav-container > .nav-tabs {
  margin-left: auto;
  margin-right: 1rem;
}

.nav-container > .language-switcher {
  margin-right: 1rem;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.logo h1 {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.813rem;
  color: var(--color-text-muted);
  font-weight: 400;
  padding-left: 0.75rem;
  border-left: 1px solid var(--color-border-solid);
}

.nav-tabs {
  display: flex;
  gap: 0.25rem;
}

.nav-tabs a {
  padding: 0.5rem 1rem;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  position: relative;
}

.nav-tabs a:hover {
  color: var(--color-text-primary);
  background: #f1f5f9;
}

.nav-tabs a.active {
  color: var(--color-brand);
  background: var(--color-brand-light);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px var(--color-brand-muted);
}

.nav-tabs a.active::after {
  content: none;
}

.main-content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: var(--color-text-muted);
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--color-surface);
  padding: 1.25rem 1.25rem 1.25rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  border-left: 3px solid var(--color-border-solid);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.stat-card.danger {
  border-left: 3px solid var(--color-danger);
}

.stat-card.warning {
  border-left: 3px solid var(--color-warning);
}

.stat-card.info {
  border-left: 3px solid var(--color-info);
}

.stat-card.success {
  border-left: 3px solid var(--color-success);
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: var(--color-warning);
}

.stat-card.success .stat-value {
  color: var(--color-success);
}

.stat-card.danger .stat-value {
  color: var(--color-danger);
}

.stat-card.info .stat-value {
  color: var(--color-info);
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--color-border-solid);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
  border-top: 1px solid var(--color-border-solid);
  border-bottom: 1px solid var(--color-border-solid);
}

th {
  text-align: left;
  padding: 0.625rem 0.75rem;
  font-weight: 600;
  color: var(--color-text-subtle);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-body);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: #f8fafc;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: var(--color-success-light);
  color: #065f46;
}

.badge.warning {
  background: var(--color-warning-light);
  color: #92400e;
}

.badge.danger {
  background: var(--color-danger-border);
  color: #991b1b;
}

.badge.info {
  background: var(--color-info-light);
  color: #1e40af;
}

.badge.increasing {
  background: var(--color-success-light);
  color: #065f46;
}

.badge.decreasing {
  background: var(--color-danger-border);
  color: #991b1b;
}

.badge.stable {
  background: #e0e7ff;
  color: #3730a3;
}

.badge.high {
  background: var(--color-danger-border);
  color: #991b1b;
}

.badge.medium {
  background: var(--color-warning-light);
  color: #92400e;
}

.badge.low {
  background: var(--color-info-light);
  color: #1e40af;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 0.938rem;
}

.error {
  background: var(--color-danger-light);
  border: 1px solid var(--color-danger-border);
  color: #991b1b;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin: 1rem 0;
  font-size: 0.938rem;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--color-border-solid);
  border-radius: var(--radius-pill);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: var(--color-brand-light);
  border-color: var(--color-brand);
}
</style>
