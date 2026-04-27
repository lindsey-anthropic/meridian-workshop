<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrap">
        <span class="currency-prefix">{{ currencySymbol }}</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          :placeholder="t('restocking.budgetPlaceholder')"
          class="budget-input"
        />
        <button v-if="budgetInput" @click="budgetInput = null" class="clear-budget">✕</button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ recommendations.length }}</div>
          <div class="stat-label">{{ t('restocking.totalItems') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ currencySymbol }}{{ totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ withinBudgetCount }}</div>
          <div class="stat-label">{{ t('restocking.withinBudget') }}</div>
        </div>
      </div>

      <div class="card">
        <div v-if="recommendations.length === 0" class="empty-state">
          {{ t('restocking.noBelowReorder') }}
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.item') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.estCost') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.sku"
                :class="{ 'out-of-budget': budgetInput && !item.within_budget }"
              >
                <td>
                  <div class="item-name">{{ translateProductName(item.name) }}</div>
                  <div class="item-sku">{{ item.sku }}</div>
                </td>
                <td>{{ translateWarehouse(item.warehouse) }}</td>
                <td>
                  <span class="badge danger">{{ item.quantity_on_hand }}</span>
                </td>
                <td>{{ item.reorder_point }}</td>
                <td><strong>{{ item.recommended_quantity }}</strong></td>
                <td>{{ currencySymbol }}{{ item.estimated_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                <td>
                  <span :class="['badge', trendClass(item.demand_trend)]">
                    {{ t('restocking.trend.' + item.demand_trend) }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn-primary btn-sm"
                    :disabled="budgetInput && !item.within_budget"
                    @click="createPO(item)"
                  >
                    Create PO
                  </button>
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
    const { t, currentCurrency, translateProductName, translateWarehouse } = useI18n()
    const { selectedLocation, getCurrentFilters } = useFilters()

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetInput = ref(null)

    let debounceTimer = null

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations({
          budget: budgetInput.value || null,
          warehouse: filters.warehouse,
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const totalCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const withinBudgetCount = computed(() => {
      if (!budgetInput.value) return recommendations.value.length
      return recommendations.value.filter(r => r.within_budget).length
    })

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'warning'
      if (trend === 'decreasing') return 'success'
      return 'info'
    }

    const createPO = (item) => {
      alert(`Create PO for ${item.sku}: ${item.recommended_quantity} units @ ${currencySymbol.value}${item.unit_cost.toFixed(2)} each`)
    }

    watch(selectedLocation, () => { loadRecommendations() })

    watch(budgetInput, () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => { loadRecommendations() }, 400)
    })

    onMounted(loadRecommendations)

    return {
      t,
      loading,
      error,
      recommendations,
      budgetInput,
      totalCost,
      withinBudgetCount,
      currencySymbol,
      trendClass,
      createPO,
      translateProductName,
      translateWarehouse,
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
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
  position: relative;
  min-width: 220px;
}

.currency-prefix {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  pointer-events: none;
}

.budget-input {
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 1.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
}

.budget-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.budget-input::placeholder {
  color: #94a3b8;
}

.clear-budget {
  position: absolute;
  right: 0.5rem;
  padding: 0.2rem 0.4rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
}

.clear-budget:hover {
  background: #e2e8f0;
  color: #64748b;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.error {
  color: #ef4444;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.item-name {
  font-weight: 500;
  color: #0f172a;
  font-size: 0.875rem;
}

.item-sku {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}

.out-of-budget {
  opacity: 0.45;
}

.btn-sm {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
}

.badge.info {
  background: #e0f2fe;
  color: #0369a1;
}
</style>
