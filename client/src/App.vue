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
          <router-link to="/restocking" :class="{ active: $route.path === '/restocking' }">
            {{ t('nav.restocking') }}
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
        </nav>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
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
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import { useTheme } from './composables/useTheme'
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
    const { isDark, toggleTheme } = useTheme()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
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
      isDark,
      toggleTheme,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-muted: #f8fafc;
  --bg-hover: #f1f5f9;
  --bg-active: #eff6ff;
  --text-primary: #0f172a;
  --text-body: #1e293b;
  --text-muted: #64748b;
  --text-cell: #334155;
  --text-th: #475569;
  --border: #e2e8f0;
  --border-subtle: #f1f5f9;
  --border-strong: #cbd5e1;
  --accent: #2563eb;
  --accent-bg: #eff6ff;
  --c-success: #059669;
  --c-warning: #ea580c;
  --c-danger: #dc2626;
  --c-info: #2563eb;
  --shadow-nav: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.06);
  /* Badge semantic tokens */
  --badge-success-bg: #d1fae5; --badge-success-text: #065f46;
  --badge-warning-bg: #fed7aa; --badge-warning-text: #92400e;
  --badge-danger-bg: #fecaca;  --badge-danger-text: #991b1b;
  --badge-info-bg: #dbeafe;    --badge-info-text: #1e40af;
  --badge-neutral-bg: #f1f5f9; --badge-neutral-text: #475569;
  --badge-stable-bg: #e0e7ff;  --badge-stable-text: #3730a3;
}

[data-theme="dark"] {
  --bg-app: #0f172a;
  --bg-surface: #1e293b;
  --bg-muted: #162032;
  --bg-hover: #253450;
  --bg-active: #1e3358;
  --text-primary: #f1f5f9;
  --text-body: #e2e8f0;
  --text-muted: #94a3b8;
  --text-cell: #cbd5e1;
  --text-th: #94a3b8;
  --border: #334155;
  --border-subtle: #253450;
  --border-strong: #475569;
  --accent: #60a5fa;
  --accent-bg: #1e3358;
  --c-success: #34d399;
  --c-warning: #fb923c;
  --c-danger: #f87171;
  --c-info: #60a5fa;
  --shadow-nav: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.4);
  /* Badge semantic tokens — dark */
  --badge-success-bg: #064e3b; --badge-success-text: #6ee7b7;
  --badge-warning-bg: #431407; --badge-warning-text: #fdba74;
  --badge-danger-bg: #450a0a;  --badge-danger-text: #fca5a5;
  --badge-info-bg: #1e3a5f;    --badge-info-text: #93c5fd;
  --badge-neutral-bg: #1e293b; --badge-neutral-text: #94a3b8;
  --badge-stable-bg: #1e1b4b;  --badge-stable-text: #a5b4fc;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-app);
  color: var(--text-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-nav {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
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
  height: 70px;
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
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.813rem;
  color: var(--text-muted);
  font-weight: 400;
  padding-left: 0.75rem;
  border-left: 1px solid var(--border);
}

.nav-tabs {
  display: flex;
  gap: 0.25rem;
}

.nav-tabs a {
  padding: 0.625rem 1.25rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.938rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-tabs a:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-tabs a.active {
  color: var(--accent);
  background: var(--accent-bg);
}

.nav-tabs a.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 0.75rem;
  line-height: 1;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.theme-toggle:hover {
  background: var(--bg-hover);
  border-color: var(--border-strong);
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
  color: var(--text-primary);
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-surface);
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-card);
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value { color: var(--c-warning); }
.stat-card.success .stat-value { color: var(--c-success); }
.stat-card.danger .stat-value  { color: var(--c-danger); }
.stat-card.info .stat-value    { color: var(--c-info); }

.card {
  background: var(--bg-surface);
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid var(--border);
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
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
  background: var(--bg-muted);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: var(--text-th);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-cell);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: var(--bg-hover);
}

.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success    { background: var(--badge-success-bg); color: var(--badge-success-text); }
.badge.warning    { background: var(--badge-warning-bg); color: var(--badge-warning-text); }
.badge.danger     { background: var(--badge-danger-bg);  color: var(--badge-danger-text); }
.badge.info       { background: var(--badge-info-bg);    color: var(--badge-info-text); }
.badge.increasing { background: var(--badge-success-bg); color: var(--badge-success-text); }
.badge.decreasing { background: var(--badge-danger-bg);  color: var(--badge-danger-text); }
.badge.stable     { background: var(--badge-stable-bg);  color: var(--badge-stable-text); }
.badge.high       { background: var(--badge-danger-bg);  color: var(--badge-danger-text); }
.badge.medium     { background: var(--badge-warning-bg); color: var(--badge-warning-text); }
.badge.low        { background: var(--badge-info-bg);    color: var(--badge-info-text); }
.badge.critical   { background: var(--badge-danger-bg);  color: var(--badge-danger-text); }

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.938rem;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}

[data-theme="dark"] .error {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}
</style>
