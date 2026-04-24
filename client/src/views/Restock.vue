<template>
  <div class="restock">
    <div class="page-header">
      <h2>{{ t('restock.title') }}</h2>
      <p>{{ t('restock.description') }}</p>
    </div>

    <div class="card controls-card">
      <div class="budget-form">
        <label class="budget-label" for="budget-input">{{ t('restock.budgetLabel') }}</label>
        <div class="budget-input-group">
          <span class="currency-prefix">$</span>
          <input
            id="budget-input"
            type="number"
            class="budget-input"
            v-model.number="budget"
            min="0"
            step="1000"
          />
        </div>
        <button class="generate-btn" @click="loadRecommendations" :disabled="loading">
          {{ t('restock.generateButton') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('restock.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="hasLoaded">
      <div v-if="recommendations.length === 0" class="card empty-state">
        <p>{{ t('restock.empty') }}</p>
      </div>

      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ t('restock.summary.itemCount', { count: recommendations.length }) }}
          </h3>
        </div>

        <div class="table-container">
          <table class="restock-table">
            <thead>
              <tr>
                <th>{{ t('restock.table.sku') }}</th>
                <th>{{ t('restock.table.name') }}</th>
                <th>{{ t('restock.table.category') }}</th>
                <th>{{ t('restock.table.warehouse') }}</th>
                <th class="col-num">{{ t('restock.table.onHand') }}</th>
                <th class="col-num">{{ t('restock.table.reorderPoint') }}</th>
                <th class="col-num">{{ t('restock.table.forecastedDemand') }}</th>
                <th class="col-num">{{ t('restock.table.suggestedQty') }}</th>
                <th class="col-num">{{ t('restock.table.unitCost') }}</th>
                <th class="col-num">{{ t('restock.table.estimatedCost') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku">
                <td><span class="sku-badge">{{ item.sku }}</span></td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.warehouse }}</td>
                <td class="col-num" :class="{ 'low-stock': item.quantity_on_hand < item.reorder_point }">
                  {{ item.quantity_on_hand.toLocaleString() }}
                </td>
                <td class="col-num">{{ item.reorder_point.toLocaleString() }}</td>
                <td class="col-num">{{ item.forecasted_demand.toLocaleString() }}</td>
                <td class="col-num suggested">{{ item.suggested_qty.toLocaleString() }}</td>
                <td class="col-num">${{ item.unit_cost.toFixed(2) }}</td>
                <td class="col-num cost">${{ item.estimated_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="budget-summary">
          <div class="summary-text">
            <span class="summary-label">{{ t('restock.summary.totalSpend') }}:</span>
            <span class="summary-total">${{ totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
            <span class="summary-separator">{{ t('restock.summary.of') }}</span>
            <span class="summary-budget">${{ budget.toLocaleString() }}</span>
            <span class="summary-separator">{{ t('restock.summary.budget') }}</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: progressWidth + '%' }"
              :class="{ 'over-budget': isOverBudget }"
            ></div>
          </div>
          <div class="summary-percent">{{ progressWidth.toFixed(1) }}%</div>
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
  name: 'Restock',
  setup() {
    const { t } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const budget = ref(50000)
    const recommendations = ref([])
    const totalCost = ref(0)
    const loading = ref(false)
    const error = ref(null)
    const hasLoaded = ref(false)

    const progressWidth = computed(() => {
      if (!budget.value || budget.value <= 0) return 0
      const pct = (totalCost.value / budget.value) * 100
      return Math.min(pct, 100)
    })

    const isOverBudget = computed(() => {
      return totalCost.value > budget.value
    })

    const loadRecommendations = async () => {
      loading.value = true
      error.value = null
      try {
        const filters = getCurrentFilters()
        const data = await api.getRestockRecommendations(budget.value, filters)
        recommendations.value = data.recommendations || []
        totalCost.value = data.total_cost || 0
        hasLoaded.value = true
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + (err.message || err)
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], () => {
      if (hasLoaded.value) {
        loadRecommendations()
      }
    })

    onMounted(loadRecommendations)

    return {
      t,
      budget,
      recommendations,
      totalCost,
      loading,
      error,
      hasLoaded,
      progressWidth,
      isOverBudget,
      loadRecommendations
    }
  }
}
</script>

<style scoped>
.restock {
  /* uses global .main-content padding */
}

.controls-card {
  margin-bottom: 1.25rem;
}

.budget-form {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  transition: border-color 0.15s ease;
}

.budget-input-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.currency-prefix {
  padding: 0 0.625rem;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
  border-right: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  align-items: center;
  align-self: stretch;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.938rem;
  color: #0f172a;
  width: 140px;
  background: transparent;
  font-family: inherit;
}

.generate-btn {
  padding: 0.5rem 1.25rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.generate-btn:hover:not(:disabled) {
  background: #2563eb;
}

.generate-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
  font-size: 0.938rem;
}

.restock-table {
  table-layout: auto;
  width: 100%;
}

.col-num {
  text-align: right;
}

.sku-badge {
  display: inline-block;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 4px;
  padding: 0.188rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  font-family: 'Courier New', monospace;
}

.low-stock {
  color: #dc2626;
  font-weight: 600;
}

.suggested {
  color: #0f172a;
  font-weight: 700;
}

.cost {
  color: #0f172a;
  font-weight: 600;
}

/* Budget summary bar */
.budget-summary {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.summary-text {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
  flex-wrap: wrap;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.summary-total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-separator {
  font-size: 0.875rem;
  color: #94a3b8;
}

.summary-budget {
  font-size: 0.938rem;
  font-weight: 600;
  color: #64748b;
}

.progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-fill.over-budget {
  background: #dc2626;
}

.summary-percent {
  margin-top: 0.375rem;
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
}
</style>
