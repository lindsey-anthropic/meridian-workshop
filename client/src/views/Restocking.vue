<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget Input -->
    <div class="budget-bar card">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-wrapper">
        <span class="currency-prefix">$</span>
        <input
          v-model.number="budgetCeiling"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          placeholder="0"
        />
      </div>
      <p v-if="budgetCeiling === 0" class="budget-hint">{{ t('restocking.setBudget') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="recommendations.length === 0" class="empty-state">
      {{ t('restocking.noRecommendations') }}
    </div>
    <div v-else>
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.totalRecommendations') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.estimatedTotal') }}</div>
          <div class="stat-value">${{ formatNumber(estimatedTotal) }}</div>
        </div>
        <div class="stat-card" v-if="budgetCeiling > 0">
          <div class="stat-label">{{ t('restocking.withinBudget') }}</div>
          <div class="stat-value">{{ itemsWithinBudget }} / {{ recommendations.length }}</div>
          <div class="budget-progress">
            <div
              class="budget-progress-bar"
              :class="{ 'over-budget': estimatedTotal > budgetCeiling }"
              :style="{ width: Math.min((estimatedTotal / budgetCeiling) * 100, 100) + '%' }"
            ></div>
          </div>
          <div class="budget-used-label">
            ${{ formatNumber(Math.min(estimatedTotal, budgetCeiling)) }} / ${{ formatNumber(budgetCeiling) }}
          </div>
        </div>
      </div>

      <!-- Recommendations Table -->
      <div class="card">
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.priority') }}</th>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.forecastedDemand') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in enrichedRecommendations"
                :key="item.sku + item.warehouse"
                :class="{ 'row-over-budget': item.over_budget }"
              >
                <td>
                  <span :class="priorityClass(item.priority)">
                    {{ t('priority.' + item.priority) }}
                  </span>
                </td>
                <td class="sku-cell">{{ item.sku }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td :class="{ 'low-stock': item.current_stock === 0 }">
                  {{ item.current_stock }}
                </td>
                <td>{{ item.reorder_point }}</td>
                <td>{{ item.forecasted_demand }}</td>
                <td>
                  <span :class="trendClass(item.trend)">{{ item.trend }}</span>
                </td>
                <td><strong>{{ item.recommended_qty }}</strong></td>
                <td>${{ formatNumber(item.unit_cost) }}</td>
                <td :class="{ 'cost-over': item.over_budget }">
                  ${{ formatNumber(item.estimated_cost) }}
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
    const { selectedLocation, selectedCategory } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetCeiling = ref(0)

    const estimatedTotal = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const enrichedRecommendations = computed(() => {
      let running = 0
      return recommendations.value.map(r => {
        running += r.estimated_cost
        return {
          ...r,
          over_budget: budgetCeiling.value > 0 && running > budgetCeiling.value
        }
      })
    })

    const itemsWithinBudget = computed(() =>
      enrichedRecommendations.value.filter(r => !r.over_budget).length
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockingRecommendations({
          warehouse: selectedLocation.value,
          category: selectedCategory.value
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    const formatNumber = (num) =>
      (num ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const priorityClass = (priority) => ({
      badge: true,
      danger: priority === 'high',
      warning: priority === 'medium',
      neutral: priority === 'low'
    })

    const trendClass = (trend) => ({
      'trend-badge': true,
      'trend-up': trend === 'increasing',
      'trend-stable': trend === 'stable',
      'trend-down': trend === 'decreasing'
    })

    return {
      t,
      loading,
      error,
      recommendations,
      budgetCeiling,
      estimatedTotal,
      enrichedRecommendations,
      itemsWithinBudget,
      formatNumber,
      priorityClass,
      trendClass
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.budget-label {
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}

.budget-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  border-right: 1px solid #e2e8f0;
}

.budget-input {
  padding: 0.5rem 0.75rem;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 160px;
}

.budget-hint {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
}

.budget-progress {
  margin-top: 0.75rem;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.budget-progress-bar {
  height: 100%;
  background: #22c55e;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.budget-progress-bar.over-budget {
  background: #ef4444;
}

.budget-used-label {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: #64748b;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.restocking-table tr:hover {
  background: #f8fafc;
}

.row-over-budget {
  background: #fef2f2 !important;
}

.row-over-budget:hover {
  background: #fee2e2 !important;
}

.sku-cell {
  font-family: monospace;
  font-size: 0.8rem;
  color: #475569;
}

.low-stock {
  color: #dc2626;
  font-weight: 700;
}

.cost-over {
  color: #dc2626;
  font-weight: 600;
}

/* Priority badges */
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.danger   { background: #fee2e2; color: #991b1b; }
.badge.warning  { background: #fef3c7; color: #92400e; }
.badge.neutral  { background: #f1f5f9; color: #475569; }

/* Trend badges */
.trend-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.trend-up     { background: #dcfce7; color: #166534; }
.trend-stable { background: #dbeafe; color: #1e40af; }
.trend-down   { background: #fee2e2; color: #991b1b; }

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #64748b;
  font-size: 1.125rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
