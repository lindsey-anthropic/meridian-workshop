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
            Restocking
          </router-link>
          <router-link to="/spending" :class="{ active: $route.path === '/spending' }">
            {{ t('nav.finance') }}
          </router-link>
          <router-link to="/demand" :class="{ active: $route.path === '/demand' }">
            {{ t('nav.demandForecast') }}
          </router-link>
          <router-link to="/reports" :class="{ active: $route.path === '/reports' }">
            Reports
          </router-link>
        </nav>
        <DarkModeToggle />
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
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher,
    DarkModeToggle
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
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
/* ── CSS CUSTOM PROPERTIES ─────────────────────────── */
:root {
  --bg-page:    #f8fafc;
  --bg-card:    #ffffff;
  --bg-nav:     #ffffff;
  --bg-thead:   #f8fafc;
  --bg-hover:   #f1f5f9;
  --bg-row-hover: #f8fafc;

  --text-primary:   #0f172a;
  --text-secondary: #1e293b;
  --text-muted:     #64748b;
  --text-table:     #334155;
  --text-th:        #475569;

  --border:       #e2e8f0;
  --border-light: #f1f5f9;
  --border-strong: #cbd5e1;

  --accent:       #2563eb;
  --accent-bg:    #eff6ff;

  --color-warning: #ea580c;
  --color-success: #059669;
  --color-danger:  #dc2626;
  --color-info:    #2563eb;

  --badge-success-bg:    #d1fae5; --badge-success-text:    #065f46;
  --badge-warning-bg:    #fed7aa; --badge-warning-text:    #92400e;
  --badge-danger-bg:     #fecaca; --badge-danger-text:     #991b1b;
  --badge-info-bg:       #dbeafe; --badge-info-text:       #1e40af;
  --badge-stable-bg:     #e0e7ff; --badge-stable-text:     #3730a3;
  --badge-increasing-bg: #d1fae5; --badge-increasing-text: #065f46;
  --badge-decreasing-bg: #fecaca; --badge-decreasing-text: #991b1b;
  --badge-high-bg:       #fecaca; --badge-high-text:       #991b1b;
  --badge-medium-bg:     #fed7aa; --badge-medium-text:     #92400e;
  --badge-low-bg:        #dbeafe; --badge-low-text:        #1e40af;

  --error-bg:     #fef2f2;
  --error-border: #fecaca;
  --error-text:   #991b1b;
}

html.dark {
  --bg-page:    #0f1117;
  --bg-card:    #1e2130;
  --bg-nav:     #161b27;
  --bg-thead:   #151824;
  --bg-hover:   #252b3b;
  --bg-row-hover: #1a1f2e;

  --text-primary:   #f1f5f9;
  --text-secondary: #e2e8f0;
  --text-muted:     #94a3b8;
  --text-table:     #cbd5e1;
  --text-th:        #94a3b8;

  --border:       #2d3348;
  --border-light: #1a1f2e;
  --border-strong: #3d4663;

  --accent:       #60a5fa;
  --accent-bg:    #1e2f4d;

  --color-warning: #fb923c;
  --color-success: #34d399;
  --color-danger:  #f87171;
  --color-info:    #60a5fa;

  --badge-success-bg:    #064e3b; --badge-success-text:    #6ee7b7;
  --badge-warning-bg:    #78350f; --badge-warning-text:    #fdba74;
  --badge-danger-bg:     #7f1d1d; --badge-danger-text:     #fca5a5;
  --badge-info-bg:       #1e3a5f; --badge-info-text:       #93c5fd;
  --badge-stable-bg:     #312e81; --badge-stable-text:     #c4b5fd;
  --badge-increasing-bg: #064e3b; --badge-increasing-text: #6ee7b7;
  --badge-decreasing-bg: #7f1d1d; --badge-decreasing-text: #fca5a5;
  --badge-high-bg:       #7f1d1d; --badge-high-text:       #fca5a5;
  --badge-medium-bg:     #78350f; --badge-medium-text:     #fdba74;
  --badge-low-bg:        #1e3a5f; --badge-low-text:        #93c5fd;

  --error-bg:     #2d1b1b;
  --error-border: #7f1d1d;
  --error-text:   #fca5a5;
}

/* ── RESET ─────────────────────────────────────────── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-page);
  color: var(--text-secondary);
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
  background: var(--bg-nav);
  border-bottom: 1px solid var(--border);
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
  background: var(--bg-card);
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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

.stat-card.warning .stat-value { color: var(--color-warning); }
.stat-card.success .stat-value { color: var(--color-success); }
.stat-card.danger  .stat-value { color: var(--color-danger); }
.stat-card.info    .stat-value { color: var(--color-info); }

.card {
  background: var(--bg-card);
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
  background: var(--bg-thead);
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
  border-top: 1px solid var(--border-light);
  color: var(--text-table);
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: var(--bg-row-hover);
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

.badge.success    { background: var(--badge-success-bg);    color: var(--badge-success-text); }
.badge.warning    { background: var(--badge-warning-bg);    color: var(--badge-warning-text); }
.badge.danger     { background: var(--badge-danger-bg);     color: var(--badge-danger-text); }
.badge.info       { background: var(--badge-info-bg);       color: var(--badge-info-text); }
.badge.increasing { background: var(--badge-increasing-bg); color: var(--badge-increasing-text); }
.badge.decreasing { background: var(--badge-decreasing-bg); color: var(--badge-decreasing-text); }
.badge.stable     { background: var(--badge-stable-bg);     color: var(--badge-stable-text); }
.badge.high       { background: var(--badge-high-bg);       color: var(--badge-high-text); }
.badge.medium     { background: var(--badge-medium-bg);     color: var(--badge-medium-text); }
.badge.low        { background: var(--badge-low-bg);        color: var(--badge-low-text); }

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.938rem;
}

.error {
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  color: var(--error-text);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}
</style>
