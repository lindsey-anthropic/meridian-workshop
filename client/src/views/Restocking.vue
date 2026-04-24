<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <div class="budget-input-group">
        <label>{{ t('restocking.budgetCeiling') }}</label>
        <div class="budget-input-wrap">
          <span class="currency-prefix">{{ currencySymbol }}</span>
          <input
            v-model.number="budget"
            type="number"
            min="0"
            class="budget-input"
            :placeholder="t('restocking.budgetPlaceholder')"
          />
        </div>
      </div>
      <div v-if="!loading && !error" class="budget-summary">
        <span class="chip chip-green">
          {{ t('restocking.itemsWithinBudget', { count: withinBudgetCount }) }}
        </span>
        <span class="chip chip-slate">
          {{ t('restocking.totalCost', { cost: formatCurrency(withinBudgetTotal) }) }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!recommendations.length" class="empty">
      {{ t('restocking.noRecommendations') }}
    </div>
    <div v-else class="card">
      <div class="table-container">
        <table class="restocking-table">
          <thead>
            <tr>
              <th>{{ t('restocking.table.sku') }}</th>
              <th>{{ t('restocking.table.item') }}</th>
              <th>{{ t('restocking.table.category') }}</th>
              <th>{{ t('restocking.table.warehouse') }}</th>
              <th class="num">{{ t('restocking.table.onHand') }}</th>
              <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
              <th class="num">{{ t('restocking.table.forecasted') }}</th>
              <th>{{ t('restocking.table.trend') }}</th>
              <th>{{ t('restocking.table.urgency') }}</th>
              <th class="num">{{ t('restocking.table.recommendedQty') }}</th>
              <th class="num">{{ t('restocking.table.estimatedCost') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in recommendations"
              :key="item.sku + item.warehouse"
              :class="{ 'over-budget': !item.within_budget }"
            >
              <td class="sku">{{ item.sku }}</td>
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.category }}</td>
              <td>{{ item.warehouse }}</td>
              <td class="num" :class="{ 'low-stock': item.quantity_on_hand < item.reorder_point }">
                {{ item.quantity_on_hand }}
              </td>
              <td class="num">{{ item.reorder_point }}</td>
              <td class="num">{{ item.forecasted_demand }}</td>
              <td>
                <span :class="trendClass(item.trend)">
                  {{ t('restocking.trend.' + item.trend) }}
                </span>
              </td>
              <td>
                <span :class="urgencyClass(item.urgency)">
                  {{ t('restocking.urgency.' + item.urgency) }}
                </span>
              </td>
              <td class="num"><strong>{{ item.recommended_qty }}</strong></td>
              <td class="num">
                <span :class="item.within_budget ? '' : 'muted'">
                  {{ formatCurrency(item.estimated_cost) }}
                </span>
                <span v-if="!item.within_budget" class="over-tag">
                  {{ t('restocking.overBudget') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
    const { getCurrentFilters, selectedLocation, selectedCategory } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budget = ref(null)

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const withinBudgetCount = computed(() =>
      recommendations.value.filter(r => r.within_budget).length
    )

    const withinBudgetTotal = computed(() =>
      recommendations.value
        .filter(r => r.within_budget)
        .reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const formatCurrency = (num) => {
      return currencySymbol.value + Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = {
          ...getCurrentFilters(),
          budget: budget.value != null ? budget.value : undefined
        }
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = 'Failed to load restocking recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory, budget], loadData)
    onMounted(loadData)

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'badge trend-up'
      if (trend === 'decreasing') return 'badge trend-down'
      return 'badge trend-stable'
    }

    const urgencyClass = (urgency) => {
      if (urgency === 'high') return 'badge urgency-high'
      if (urgency === 'medium') return 'badge urgency-medium'
      return 'badge urgency-low'
    }

    return {
      t, currencySymbol,
      loading, error,
      recommendations, budget,
      withinBudgetCount, withinBudgetTotal,
      formatCurrency, trendClass, urgencyClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.budget-input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  width: 160px;
  color: #0f172a;
}

.budget-summary {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.813rem;
  font-weight: 600;
}

.chip-green { background: #dcfce7; color: #166534; }
.chip-slate { background: #f1f5f9; color: #475569; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table-container { overflow-x: auto; }

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

.restocking-table th.num,
.restocking-table td.num { text-align: right; }

.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  vertical-align: middle;
}

.restocking-table tr:hover td { background: #f8fafc; }

.restocking-table tr.over-budget td {
  opacity: 0.45;
}

.sku { font-family: monospace; font-size: 0.813rem; color: #64748b; }

.low-stock { color: #dc2626; font-weight: 700; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.trend-up    { background: #dcfce7; color: #166534; }
.trend-down  { background: #fee2e2; color: #991b1b; }
.trend-stable { background: #f1f5f9; color: #475569; }

.urgency-high   { background: #fee2e2; color: #991b1b; }
.urgency-medium { background: #fef3c7; color: #92400e; }
.urgency-low    { background: #f1f5f9; color: #475569; }

.muted { color: #94a3b8; }

.over-tag {
  display: block;
  font-size: 0.688rem;
  color: #94a3b8;
  margin-top: 2px;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
}
</style>
