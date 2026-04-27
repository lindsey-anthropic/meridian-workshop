<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-controls">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-wrapper">
        <span class="budget-prefix">$</span>
        <input
          type="number"
          v-model.number="budget"
          class="budget-input"
          min="0"
          step="1000"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.totalItems') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.withinBudget') }}</div>
          <div class="stat-value">{{ withinBudgetCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="stat-value">${{ formatNumber(totalCost) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.budgetUsed') }}</div>
          <div class="stat-value">${{ formatNumber(withinBudgetCost) }}</div>
        </div>
      </div>

      <div v-if="recommendations.length === 0" class="empty-state">
        {{ t('restocking.noItems') }}
      </div>

      <div v-else class="card">
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.itemName') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.forecast') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in recommendations"
                :key="rec.id"
                :class="{ 'over-budget-row': !rec.within_budget }"
              >
                <td><code>{{ rec.sku }}</code></td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.category }}</td>
                <td>{{ rec.warehouse }}</td>
                <td>{{ rec.quantity_on_hand }}</td>
                <td>{{ rec.reorder_point }}</td>
                <td>
                  <span v-if="rec.has_forecast">{{ rec.forecasted_demand }}</span>
                  <span v-else class="muted">{{ t('restocking.noForecast') }}</span>
                </td>
                <td>
                  <span v-if="rec.trend" :class="['badge', rec.trend]">{{ rec.trend }}</span>
                  <span v-else class="muted">—</span>
                </td>
                <td><strong>{{ rec.recommended_qty }}</strong></td>
                <td>${{ formatNumber(rec.unit_cost) }}</td>
                <td><strong>${{ formatNumber(rec.estimated_cost) }}</strong></td>
                <td>
                  <span :class="['badge', rec.within_budget ? 'success' : 'warning']">
                    {{ rec.within_budget ? t('restocking.withinBudgetLabel') : t('restocking.overBudgetLabel') }}
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
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const recommendations = ref([])
    const loading = ref(true)
    const error = ref(null)
    const budget = ref(100000)

    let budgetTimer = null

    const totalCost = computed(() => recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0))
    const withinBudgetCost = computed(() => recommendations.value.filter(r => r.within_budget).reduce((sum, r) => sum + r.estimated_cost, 0))
    const withinBudgetCount = computed(() => recommendations.value.filter(r => r.within_budget).length)

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations({
          warehouse: filters.warehouse,
          category: filters.category,
          budget: budget.value
        })
      } catch (err) {
        error.value = 'Failed to load restocking recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadRecommendations)

    watch(budget, () => {
      clearTimeout(budgetTimer)
      budgetTimer = setTimeout(loadRecommendations, 400)
    })

    onMounted(loadRecommendations)

    const formatNumber = (num) =>
      Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return {
      t,
      recommendations,
      loading,
      error,
      budget,
      totalCost,
      withinBudgetCost,
      withinBudgetCount,
      formatNumber
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.budget-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.budget-label {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.budget-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-surface);
}

.budget-prefix {
  padding: 0.5rem 0.75rem;
  background: var(--bg-muted);
  color: var(--text-secondary);
  font-weight: 600;
  border-right: 1px solid var(--border-color);
}

.budget-input {
  padding: 0.5rem 0.75rem;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 160px;
  background: var(--bg-surface);
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restocking-table th {
  background: var(--bg-muted);
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
}

.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.restocking-table tr:hover {
  background: var(--bg-muted);
}

.over-budget-row {
  background: #fffbeb;
}

.over-budget-row:hover {
  background: #fef3c7;
}

code {
  font-family: monospace;
  font-size: 0.8rem;
  background: var(--bg-muted);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.muted {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.8rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
}
</style>
