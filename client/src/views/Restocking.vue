<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.subtitle') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-wrap">
        <span class="currency-symbol">$</span>
        <input
          v-model.number="budgetCeiling"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Summary stats -->
      <div class="stats-grid">
        <div class="stat-card warning">
          <div class="stat-label">{{ t('restocking.totalItems') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="stat-value">{{ formatCurrency(totalEstimatedCost) }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">{{ t('restocking.withinBudget') }}</div>
          <div class="stat-value">{{ itemsWithinBudget }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }}</h3>
        </div>
        <div class="table-container">
          <table v-if="recommendationsWithBudget.length > 0">
            <thead>
              <tr>
                <th>{{ t('restocking.item') }}</th>
                <th>{{ t('restocking.warehouse') }}</th>
                <th>{{ t('restocking.stockStatus') }}</th>
                <th>{{ t('restocking.demandTrend') }}</th>
                <th>{{ t('restocking.recommendedQty') }}</th>
                <th>{{ t('restocking.estimatedCost') }}</th>
                <th>{{ t('restocking.priority') }}</th>
                <th>{{ t('restocking.budgetStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendationsWithBudget"
                :key="item.sku"
                :class="{ 'row-excluded': !item.within_budget }"
              >
                <td>
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-sku">{{ item.sku }}</div>
                </td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <div class="stock-status">
                    <span class="stock-numbers">{{ item.quantity_on_hand }} / {{ item.reorder_point }}</span>
                    <div class="stock-bar-wrap">
                      <div
                        class="stock-bar"
                        :style="{ width: Math.min(100, (item.quantity_on_hand / item.reorder_point) * 100) + '%' }"
                        :class="item.quantity_on_hand === 0 ? 'critical' : 'low'"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="['badge', item.trend]">{{ item.trend }}</span>
                  <div v-if="item.days_delayed" class="days-delayed">
                    {{ t('restocking.daysDelayed', { days: item.days_delayed }) }}
                  </div>
                </td>
                <td class="qty-cell">{{ item.recommended_qty.toLocaleString() }}</td>
                <td class="cost-cell">{{ formatCurrency(item.estimated_cost) }}</td>
                <td><span :class="['badge', item.priority]">{{ t('restocking.' + item.priority) }}</span></td>
                <td>
                  <span v-if="budgetCeiling > 0" :class="['badge', item.within_budget ? 'success' : 'danger']">
                    {{ t(item.within_budget ? 'restocking.included' : 'restocking.excluded') }}
                  </span>
                  <span v-else class="no-budget">—</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">{{ t('restocking.noItems') }}</div>
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
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()
    const { t, currentLocale, currentCurrency } = useI18n()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetCeiling = ref(0)

    const totalEstimatedCost = computed(() =>
      recommendations.value.reduce((sum, item) => sum + item.estimated_cost, 0)
    )

    const recommendationsWithBudget = computed(() => {
      if (budgetCeiling.value <= 0) {
        return recommendations.value.map(item => ({ ...item, within_budget: true }))
      }
      let remaining = budgetCeiling.value
      return recommendations.value.map(item => {
        const withinBudget = remaining >= item.estimated_cost
        if (withinBudget) remaining -= item.estimated_cost
        return { ...item, within_budget: withinBudget }
      })
    })

    const itemsWithinBudget = computed(() =>
      recommendationsWithBudget.value.filter(item => item.within_budget).length
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockingRecommendations(getCurrentFilters())
      } catch (err) {
        error.value = t('common.loadError')
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (num) =>
      num.toLocaleString(currentLocale.value === 'ja' ? 'ja-JP' : 'en-US', {
        style: 'currency',
        currency: currentCurrency.value
      })

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    return {
      t, loading, error,
      budgetCeiling, recommendations,
      recommendationsWithBudget, totalEstimatedCost, itemsWithinBudget,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  background: #f8fafc;
}

.currency-symbol {
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  border-right: 1px solid #cbd5e1;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.938rem;
  font-weight: 500;
  color: #0f172a;
  background: transparent;
  width: 200px;
}

.budget-input::-webkit-outer-spin-button,
.budget-input::-webkit-inner-spin-button { -webkit-appearance: none; }

.item-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.item-sku {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}

.stock-status { display: flex; flex-direction: column; gap: 4px; }

.stock-numbers {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
}

.stock-bar-wrap {
  width: 80px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.stock-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}

.stock-bar.low { background: #f59e0b; }
.stock-bar.critical { background: #ef4444; }

.days-delayed {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 4px;
  font-weight: 500;
}

.qty-cell { font-weight: 600; color: #0f172a; }
.cost-cell { font-weight: 600; color: #0f172a; }

.row-excluded { opacity: 0.45; }

.no-budget { color: #94a3b8; }

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 0.938rem;
}
</style>
