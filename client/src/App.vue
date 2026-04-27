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
        </nav>
        <button class="theme-toggle" @click="toggleDark" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
        </button>
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </header>
    <FilterBar :hide-filters="$route.path === '/reports' ? ['status'] : []" />
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
import { useDarkMode } from './composables/useDarkMode'
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
    const { isDark, toggleDark } = useDarkMode()
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
      toggleDark,
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-subtle: #f8fafc;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --nav-bg: #ffffff;
  --filter-bg: #f8fafc;
  --input-bg: #ffffff;
  --input-border: #cbd5e1;
  --shadow: rgba(0,0,0,0.08);
}

html.dark {
  --bg-app: #0f172a;
  --bg-surface: #1e293b;
  --bg-subtle: #1e293b;
  --border: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --nav-bg: #1e293b;
  --filter-bg: #1e293b;
  --input-bg: #0f172a;
  --input-border: #334155;
  --shadow: rgba(0,0,0,0.3);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-app);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.2s, color 0.2s;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-nav {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
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
  color: #0f172a;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 400;
  padding-left: 0.75rem;
  border-left: 1px solid #e2e8f0;
}

.nav-tabs {
  display: flex;
  gap: 0.25rem;
}

.nav-tabs a {
  padding: 0.625rem 1.25rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.938rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-tabs a:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.nav-tabs a.active {
  color: #2563eb;
  background: #eff6ff;
}

.nav-tabs a.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
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
  color: #0f172a;
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: #64748b;
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: #ea580c;
}

.stat-card.success .stat-value {
  color: #059669;
}

.stat-card.danger .stat-value {
  color: #dc2626;
}

.stat-card.info .stat-value {
  color: #2563eb;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
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
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f1f5f9;
  color: #334155;
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
  padding: 0.313rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: #d1fae5;
  color: #065f46;
}

.badge.warning {
  background: #fed7aa;
  color: #92400e;
}

.badge.danger {
  background: #fecaca;
  color: #991b1b;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.badge.increasing {
  background: #d1fae5;
  color: #065f46;
}

.badge.decreasing {
  background: #fecaca;
  color: #991b1b;
}

.badge.stable {
  background: #e0e7ff;
  color: #3730a3;
}

.badge.high {
  background: #fecaca;
  color: #991b1b;
}

.badge.medium {
  background: #fed7aa;
  color: #92400e;
}

.badge.low {
  background: #dbeafe;
  color: #1e40af;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
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

/* ── Dark mode overrides ─────────────────────────────── */

/* Nav */
html.dark .top-nav        { background: var(--nav-bg); border-color: var(--border); }
html.dark .logo h1        { color: var(--text-primary); }
html.dark .subtitle       { color: var(--text-secondary); border-color: var(--border); }
html.dark .nav-tabs a     { color: var(--text-secondary); }
html.dark .nav-tabs a:hover { background: #334155; color: var(--text-primary); }
html.dark .nav-tabs a.active { background: #1e3a5f; color: #93c5fd; }
html.dark .nav-tabs a.active::after { background: #60a5fa; }

/* Filter bar */
html.dark .filters-bar    { background: var(--filter-bg); border-color: var(--border); }
html.dark .filter-select  { background: var(--input-bg); border-color: var(--input-border); color: var(--text-primary); }
html.dark .filter-group label { color: var(--text-secondary); }
html.dark .reset-filters-btn  { background: var(--bg-surface); border-color: var(--border); color: var(--text-secondary); }

/* Layout */
html.dark .main-content   { background: var(--bg-app); }
html.dark .page-header h2 { color: var(--text-primary); }
html.dark .page-header p  { color: var(--text-secondary); }

/* Cards — catch all white/light surfaces */
html.dark .card,
html.dark [class*="card"],
html.dark .chart-card     { background: var(--bg-surface) !important; border-color: var(--border) !important; }
html.dark .card-title,
html.dark [class*="card-title"] { color: var(--text-primary) !important; }
html.dark .card-header    { border-color: var(--border); }

/* Stat cards */
html.dark .stat-card      { background: var(--bg-surface) !important; }
html.dark .stat-label     { color: var(--text-secondary) !important; }
html.dark .stat-value     { color: var(--text-primary) !important; }

/* KPI cards (Dashboard) */
html.dark .kpi-card       { background: var(--bg-surface) !important; border-color: var(--border) !important; }
html.dark .kpi-label,
html.dark .kpi-subtitle   { color: var(--text-secondary) !important; }
html.dark .kpi-value      { color: var(--text-primary) !important; }

/* Trend cards (Demand) */
html.dark .trend-card     { background: var(--bg-surface) !important; border-color: var(--border) !important; }
html.dark .trend-card .item-name { color: var(--text-primary) !important; }
html.dark .trend-label    { color: var(--text-secondary) !important; }

/* Tables */
html.dark table           { background: var(--bg-surface); }
html.dark table thead th  { background: #0f172a !important; color: var(--text-secondary) !important; border-color: var(--border) !important; }
html.dark table tbody td  { border-color: var(--border) !important; color: var(--text-primary) !important; background: transparent; }
html.dark table tbody tr:hover td { background: #1e293b !important; }

/* Inputs / search */
html.dark input[type="text"],
html.dark input[type="number"],
html.dark input[type="search"],
html.dark .search-input   { background: var(--input-bg) !important; border-color: var(--input-border) !important; color: var(--text-primary) !important; }
html.dark input::placeholder { color: var(--text-muted) !important; }

/* Budget bar (Restocking) */
html.dark .budget-bar     { background: var(--bg-surface) !important; border-color: var(--border) !important; }
html.dark .budget-label   { color: var(--text-secondary) !important; }
html.dark .budget-input-wrap { border-color: var(--input-border) !important; }
html.dark .currency-prefix { background: var(--bg-subtle) !important; border-color: var(--input-border) !important; color: var(--text-secondary) !important; }
html.dark .budget-input   { background: var(--input-bg) !important; color: var(--text-primary) !important; }

/* Summary / order health card inner */
html.dark .summary-card,
html.dark .order-health,
html.dark .health-stats,
html.dark .health-stat    { background: transparent; color: var(--text-primary) !important; }
html.dark .health-label   { color: var(--text-secondary) !important; }
html.dark .health-value   { color: var(--text-primary) !important; }

/* Chart areas */
html.dark .chart-container,
html.dark .chart-area     { background: transparent; }
html.dark .y-axis span,
html.dark .bar-label      { color: var(--text-secondary) !important; }

/* Modals */
html.dark .modal-content,
html.dark .modal-overlay .modal { background: var(--bg-surface) !important; color: var(--text-primary) !important; }
html.dark .modal-header   { border-color: var(--border) !important; color: var(--text-primary) !important; }

/* Misc text */
html.dark .loading        { color: var(--text-secondary); }
html.dark code            { background: #0f172a; color: var(--text-secondary); }
html.dark strong          { color: inherit; }

/* Nav: language switcher + profile menu buttons */
html.dark .profile-button    { background: var(--bg-surface) !important; border-color: var(--border) !important; color: var(--text-primary) !important; }
html.dark .profile-name      { color: var(--text-primary) !important; }
html.dark .language-switcher button { background: var(--bg-surface) !important; border-color: var(--border) !important; color: var(--text-primary) !important; }
html.dark .profile-dropdown,
html.dark .lang-dropdown      { background: var(--bg-surface) !important; border-color: var(--border) !important; }
html.dark .profile-menu li,
html.dark .language-switcher li { color: var(--text-primary) !important; }
html.dark .profile-menu li:hover,
html.dark .language-switcher li:hover { background: #334155 !important; }

/* Profile dropdown menu */
html.dark .dropdown-menu     { background: var(--bg-surface) !important; border-color: var(--border) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }
html.dark .dropdown-header   { background: var(--bg-subtle) !important; border-color: var(--border) !important; }
html.dark .user-name         { color: var(--text-primary) !important; }
html.dark .user-email        { color: var(--text-secondary) !important; }
html.dark .dropdown-item     { color: var(--text-primary) !important; }
html.dark .dropdown-item:hover { background: #334155 !important; }
html.dark .dropdown-divider  { background: var(--border) !important; }
html.dark .task-badge        { background: #2563eb !important; }

/* Modals (Profile Details + Tasks) */
html.dark .modal-overlay     { background: rgba(0,0,0,0.7) !important; }
html.dark .modal-container   { background: var(--bg-surface) !important; border: 1px solid var(--border); box-shadow: 0 16px 48px rgba(0,0,0,0.5) !important; }
html.dark .modal-header      { border-color: var(--border) !important; }
html.dark .modal-title       { color: var(--text-primary) !important; }
html.dark .modal-body        { background: var(--bg-surface) !important; }
html.dark .close-button      { color: var(--text-secondary) !important; background: transparent !important; }
html.dark .close-button:hover { background: #334155 !important; color: var(--text-primary) !important; }

/* Profile Details modal content */
html.dark .profile-section   { background: transparent !important; }
html.dark .profile-job-title { color: var(--text-secondary) !important; }
html.dark .info-label        { color: var(--text-secondary) !important; }
html.dark .info-value        { color: var(--text-primary) !important; }
html.dark .info-item         { border-color: var(--border) !important; }

/* Tasks modal */
html.dark .task-form         { background: var(--bg-subtle) !important; border-color: var(--border) !important; }
html.dark .task-input,
html.dark .task-select       { background: var(--input-bg) !important; border-color: var(--input-border) !important; color: var(--text-primary) !important; }
html.dark .form-label,
html.dark .form-group label  { color: var(--text-secondary) !important; }
html.dark .tasks-divider     { background: var(--border) !important; }
html.dark .task-item         { background: var(--bg-surface) !important; border-color: var(--border) !important; }
html.dark .task-item:hover   { background: var(--bg-subtle) !important; }
html.dark .task-title        { color: var(--text-primary) !important; }
html.dark .task-meta         { color: var(--text-secondary) !important; }
html.dark .modal-footer      { border-color: var(--border) !important; background: var(--bg-surface) !important; }
html.dark .cancel-btn,
html.dark .close-btn,
html.dark .btn-secondary     { background: #334155 !important; border-color: var(--border) !important; color: var(--text-primary) !important; }
html.dark .btn-secondary:hover { background: #475569 !important; }

/* Revenue bars — make visible on dark background */
html.dark .revenue-bar { background: #60a5fa !important; }

/* Order Health — boost contrast */
html.dark .order-health-metrics [class*="label"],
html.dark .order-health-metrics [class*="stat"] > :first-child { color: var(--text-secondary) !important; }
html.dark .order-health-metrics [class*="value"],
html.dark .order-health-metrics [class*="stat"] > :last-child  { color: var(--text-primary) !important; }
html.dark .donut-center-label { fill: #94a3b8 !important; }
html.dark .donut-center-value { fill: #f1f5f9 !important; }
html.dark .donut-legend-compact [class*="label"] { color: var(--text-secondary) !important; }

/* Demand trend items */
html.dark .trend-item        { background: #0f172a !important; }
html.dark .trend-item:hover  { background: #334155 !important; }
html.dark .item-name         { color: var(--text-primary) !important; }

/* Restocking urgency row highlights — dark equivalents */
html.dark .row-critical td   { background: rgba(239,68,68,0.12) !important; }
html.dark .row-high td       { background: rgba(249,115,22,0.1) !important; }
html.dark .row-medium td     { background: rgba(234,179,8,0.08) !important; }
html.dark .restock-table tbody td { color: var(--text-primary) !important; }

/* Theme toggle button */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  margin-right: 0.5rem;
  flex-shrink: 0;
}
html.dark .theme-toggle   { background: var(--bg-surface); border-color: var(--border); }
.theme-toggle:hover       { background: var(--bg-subtle); color: var(--text-primary); }
</style>
