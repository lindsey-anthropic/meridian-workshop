<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-wrapper">
        <span class="currency-prefix">{{ currencySymbol }}</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
          @keyup.enter="applyBudget"
        />
      </div>
      <button class="apply-btn" @click="applyBudget">{{ t('restocking.applyBudget') }}</button>
      <button v-if="budget" class="clear-btn" @click="clearBudget">
        {{ t('restocking.clearBudget') }}
      </button>
      <span class="budget-status" v-if="!budget">{{ t('restocking.noBudget') }}</span>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.allItems') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">{{ t('restocking.withinBudget') }}</div>
          <div class="stat-value">{{ withinBudgetCount }}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">{{ t('restocking.highPriority') }}</div>
          <div class="stat-value">{{ highPriorityCount }}</div>
        </div>
        <div class="stat-card info">
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ totalEstimatedCost.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card" v-if="recommendations.length">
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th class="num">{{ t('restocking.table.onHand') }}</th>
                <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
                <th class="num">{{ t('restocking.table.forecastedDemand') }}</th>
                <th class="num">{{ t('restocking.table.recommendedQty') }}</th>
                <th class="num">{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.priority') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.sku + item.warehouse"
                :class="{ 'out-of-budget': !item.within_budget }"
              >
                <td class="sku">{{ item.sku }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.warehouse }}</td>
                <td class="num" :class="{ 'low-stock': item.quantity_on_hand <= item.reorder_point }">
                  {{ item.quantity_on_hand }}
                </td>
                <td class="num">{{ item.reorder_point }}</td>
                <td class="num">
                  <span v-if="item.forecasted_demand">
                    {{ item.forecasted_demand }}
                    <span :class="getTrendClass(item.trend)" class="trend-icon">{{ getTrendIcon(item.trend) }}</span>
                  </span>
                  <span v-else class="muted">—</span>
                </td>
                <td class="num bold">{{ item.recommended_qty }}</td>
                <td class="num bold">{{ currencySymbol }}{{ item.estimated_cost.toLocaleString() }}</td>
                <td>
                  <span :class="getPriorityClass(item.priority)" class="badge">
                    {{ t(`restocking.priority.${item.priority}`) }}
                  </span>
                  <span v-if="!item.within_budget" class="over-budget-tag">
                    {{ t('restocking.outOfBudget') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-state">
        {{ t('restocking.noRecommendations') }}
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
    const { t, currentCurrency } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budget = ref(null)
    const budgetInput = ref(null)

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const withinBudgetCount = computed(() =>
      recommendations.value.filter(r => r.within_budget).length
    )

    const highPriorityCount = computed(() =>
      recommendations.value.filter(r => r.priority === 'high').length
    )

    const totalEstimatedCost = computed(() =>
      Math.round(recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0))
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = { ...getCurrentFilters() }
        if (budget.value) filters.budget = budget.value
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      budget.value = budgetInput.value || null
      loadData()
    }

    const clearBudget = () => {
      budget.value = null
      budgetInput.value = null
      loadData()
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    const getPriorityClass = (priority) => {
      return { high: 'danger', medium: 'warning', low: 'info' }[priority] || 'info'
    }

    const getTrendClass = (trend) => {
      return { increasing: 'trend-up', stable: 'trend-stable', decreasing: 'trend-down' }[trend] || ''
    }

    const getTrendIcon = (trend) => {
      return { increasing: '↑', stable: '→', decreasing: '↓' }[trend] || ''
    }

    return {
      t,
      loading,
      error,
      currencySymbol,
      recommendations,
      budget,
      budgetInput,
      withinBudgetCount,
      highPriorityCount,
      totalEstimatedCost,
      applyBudget,
      clearBudget,
      getPriorityClass,
      getTrendClass,
      getTrendIcon
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 1.5rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}

.budget-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  background: #f8fafc;
}

.currency-prefix {
  padding: 6px 10px;
  font-size: 0.875rem;
  color: #64748b;
  background: #f1f5f9;
  border-right: 1px solid #e2e8f0;
}

.budget-input {
  border: none;
  background: transparent;
  padding: 6px 12px;
  font-size: 0.875rem;
  width: 180px;
  outline: none;
  color: #0f172a;
}

.apply-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}
.apply-btn:hover { background: #2563eb; }

.clear-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
}
.clear-btn:hover { background: #f1f5f9; }

.budget-status { font-size: 0.8rem; color: #94a3b8; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border-left: 4px solid #3b82f6;
}
.stat-card.success { border-left-color: #10b981; }
.stat-card.danger  { border-left-color: #ef4444; }
.stat-card.info    { border-left-color: #6366f1; }

.stat-label { font-size: 0.8rem; color: #64748b; margin-bottom: 6px; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; }

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  overflow: hidden;
}

.restocking-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

.restocking-table th {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.restocking-table th.num { text-align: right; }

.restocking-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.restocking-table tr:last-child td { border-bottom: none; }
.restocking-table tr:hover td { background: #f8fafc; }

.restocking-table tr.out-of-budget td { opacity: 0.45; }

td.num { text-align: right; }
td.bold { font-weight: 600; }
td.sku { font-family: monospace; font-size: 0.8rem; color: #475569; }
td.low-stock { color: #dc2626; font-weight: 600; }

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge.danger  { background: #fee2e2; color: #991b1b; }
.badge.warning { background: #fef3c7; color: #92400e; }
.badge.info    { background: #ede9fe; color: #5b21b6; }

.over-budget-tag {
  display: inline-block;
  margin-left: 6px;
  font-size: 0.7rem;
  color: #94a3b8;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 1px 5px;
}

.trend-icon { font-size: 0.75rem; margin-left: 3px; }
.trend-up     { color: #dc2626; }
.trend-stable { color: #64748b; }
.trend-down   { color: #16a34a; }

.muted { color: #94a3b8; }

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border-radius: 12px;
  border: 1px dashed #e2e8f0;
}

.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
</style>
