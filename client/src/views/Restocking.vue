<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-control card">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-row">
        <span class="currency-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          :placeholder="t('restocking.budgetPlaceholder')"
          class="budget-input"
        />
        <button v-if="budgetInput" @click="budgetInput = null" class="clear-btn">{{ t('restocking.clearBudget') }}</button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('restocking.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.stats.itemsBelowReorder') }}</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.stats.totalEstCost') }}</div>
          <div class="stat-value">{{ formatCurrency(totalCost) }}</div>
        </div>
        <div class="stat-card" v-if="budgetInput">
          <div class="stat-label">{{ t('restocking.stats.withinBudget') }}</div>
          <div class="stat-value">{{ items.length }} items</div>
        </div>
        <div class="stat-card" v-if="budgetInput">
          <div class="stat-label">{{ t('restocking.stats.budgetRemaining') }}</div>
          <div class="stat-value">{{ formatCurrency(budgetInput - totalCost) }}</div>
        </div>
      </div>

      <div class="card" v-if="items.length === 0">
        <p class="empty-state">{{ t('restocking.empty') }}</p>
      </div>

      <div class="card" v-else>
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.table.title') }}</h3>
          <span class="card-subtitle">{{ t('restocking.table.subtitle') }}</span>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.product') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.daysCoverage') }}</th>
                <th>{{ t('restocking.table.recQty') }}</th>
                <th>{{ t('restocking.table.estCost') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.sku" :class="getUrgencyRowClass(item)">
                <td><code>{{ item.sku }}</code></td>
                <td><strong>{{ item.name }}</strong></td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.category }}</td>
                <td>
                  <span :class="getStockClass(item)">{{ item.current_stock }}</span>
                </td>
                <td>{{ item.reorder_point }}</td>
                <td>
                  <span :class="getDaysClass(item.days_of_coverage)">
                    {{ item.days_of_coverage }}d
                  </span>
                </td>
                <td><strong>{{ item.recommended_qty }}</strong></td>
                <td>{{ formatCurrency(item.estimated_cost) }}</td>
                <td>
                  <span :class="getTrendClass(item.demand_trend)">
                    {{ item.demand_trend }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '@/api'
import { useFilters } from '@/composables/useFilters'
import { useI18n } from '@/composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()
    const { t } = useI18n()

    const loading = ref(true)
    const error = ref(null)
    const items = ref([])
    const budgetInput = ref(null)

    const totalCost = computed(() => items.value.reduce((sum, i) => sum + i.estimated_cost, 0))

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        if (budgetInput.value) filters.budget = budgetInput.value
        items.value = await api.getRestocking(filters)
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory, budgetInput], loadData)
    onMounted(loadData)

    const formatCurrency = (num) =>
      num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

    const getUrgencyRowClass = (item) => item.days_of_coverage < 10 ? 'row-critical' : item.days_of_coverage < 20 ? 'row-warning' : ''
    const getStockClass = (item) => item.current_stock < item.reorder_point * 0.5 ? 'badge danger' : 'badge warning'
    const getDaysClass = (days) => days < 10 ? 'badge danger' : days < 20 ? 'badge warning' : 'badge success'
    const getTrendClass = (trend) => trend === 'increasing' ? 'trend-up' : trend === 'decreasing' ? 'trend-down' : 'trend-stable'

    return {
      loading, error, items, budgetInput, totalCost,
      formatCurrency, getUrgencyRowClass, getStockClass, getDaysClass, getTrendClass, t
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
}

.budget-control {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.budget-label {
  font-weight: 600;
  color: var(--color-text-strong);
  white-space: nowrap;
}

.budget-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.currency-prefix {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  font-weight: 600;
}

.budget-input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  width: 200px;
  outline: none;
  transition: border-color 0.2s;
  background: var(--color-surface);
  color: var(--color-text);
}

.budget-input:focus { border-color: var(--color-accent); }

.clear-btn {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  transition: background 0.15s;
}

.clear-btn:hover { background: var(--color-border); }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-warning);
}

.stat-label { font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: var(--color-text-strong); }

.card-header { margin-bottom: 1rem; }
.card-title { font-size: 1.125rem; font-weight: 600; color: var(--color-text-strong); margin: 0 0 0.25rem; }
.card-subtitle { font-size: 0.8rem; color: var(--color-text-muted); }

.table-container { overflow-x: auto; }

.restocking-table { width: 100%; border-collapse: collapse; }
.restocking-table th {
  background: var(--color-surface-secondary);
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}
.restocking-table td { padding: 0.75rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-body); }
.restocking-table tr:hover { background: var(--color-surface-secondary); }

.row-critical { background: var(--color-danger-bg); }
.row-critical:hover { background: var(--color-danger-bg); filter: brightness(0.95); }
.row-warning { background: var(--color-warning-bg); }
.row-warning:hover { background: var(--color-warning-bg); filter: brightness(0.95); }

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}
.badge.danger { background: var(--color-danger-bg); color: var(--color-danger-text); }
.badge.warning { background: var(--color-warning-bg); color: var(--color-warning-text); }
.badge.success { background: var(--color-success-bg); color: var(--color-success-text); }

.trend-up { color: var(--color-danger); font-weight: 600; }
.trend-down { color: var(--color-success); font-weight: 600; }
.trend-stable { color: var(--color-text-muted); }

code { font-family: monospace; font-size: 0.85rem; background: var(--color-surface-secondary); color: var(--color-text-body); padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); }

.empty-state { text-align: center; color: var(--color-text-muted); padding: 2rem; }
.loading { text-align: center; padding: 3rem; color: var(--color-text-muted); }
.error { background: var(--color-error-bg); color: var(--color-danger-text); padding: 1rem; border-radius: var(--radius-md); }
</style>
