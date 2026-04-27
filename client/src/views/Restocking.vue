<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="card budget-card">
      <div class="budget-row">
        <div class="budget-field">
          <label for="budget-input">{{ t('restocking.budgetCeiling') }}</label>
          <input
            id="budget-input"
            v-model.number="budgetInput"
            type="number"
            min="0"
            step="10000"
            :placeholder="t('restocking.budgetPlaceholder')"
            class="input-field"
            @keyup.enter="calculate"
          />
        </div>
        <button class="btn-primary" :disabled="!budgetInput || budgetInput <= 0" @click="calculate">
          {{ t('restocking.calculate') }}
        </button>
      </div>
    </div>

    <!-- No budget state -->
    <div v-if="!budget" class="empty-state">
      {{ t('restocking.noBudget') }}
    </div>

    <template v-else>
      <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <template v-else>

        <!-- Stats -->
        <div class="stats-grid" v-if="recommendations.length">
          <div class="stat-card success">
            <div class="stat-label">{{ t('restocking.totalItems') }}</div>
            <div class="stat-value">{{ withinBudgetCount }}</div>
          </div>
          <div class="stat-card info">
            <div class="stat-label">{{ t('restocking.budgetUsed') }}</div>
            <div class="stat-value">{{ currencySymbol }}{{ formatNumber(budgetUsed) }}</div>
          </div>
          <div class="stat-card warning">
            <div class="stat-label">{{ t('restocking.totalCost') }}</div>
            <div class="stat-value">{{ currencySymbol }}{{ formatNumber(totalCost) }}</div>
          </div>
        </div>

        <!-- No results -->
        <div v-if="!recommendations.length" class="empty-state">
          {{ t('restocking.noResults') }}
        </div>

        <!-- Table -->
        <div v-else class="card">
          <div class="card-header">
            <h3 class="card-title">{{ t('restocking.title') }} ({{ recommendations.length }})</h3>
          </div>
          <div class="table-container">
            <table class="restocking-table">
              <thead>
                <tr>
                  <th>{{ t('restocking.table.sku') }}</th>
                  <th>{{ t('restocking.table.itemName') }}</th>
                  <th>{{ t('restocking.table.warehouse') }}</th>
                  <th>{{ t('restocking.table.currentStock') }}</th>
                  <th>{{ t('restocking.table.reorderPoint') }}</th>
                  <th>{{ t('restocking.table.forecastedDemand') }}</th>
                  <th>{{ t('restocking.table.trend') }}</th>
                  <th>{{ t('restocking.table.recommendedQty') }}</th>
                  <th>{{ t('restocking.table.estimatedCost') }}</th>
                  <th>{{ t('restocking.table.priority') }}</th>
                  <th>{{ t('restocking.table.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recommendations" :key="item.sku + item.warehouse" :class="{ 'row-dim': !item.within_budget }">
                  <td><strong>{{ item.sku }}</strong></td>
                  <td>{{ translateProductName(item.item_name) }}</td>
                  <td>{{ translateWarehouse(item.warehouse) }}</td>
                  <td>{{ item.current_stock }}</td>
                  <td>{{ item.reorder_point }}</td>
                  <td>{{ item.forecasted_demand }}</td>
                  <td><span :class="['badge', trendClass(item.trend)]">{{ t('restocking.trend.' + item.trend) }}</span></td>
                  <td><strong>{{ item.recommended_qty }}</strong></td>
                  <td>{{ currencySymbol }}{{ formatNumber(item.estimated_cost) }}</td>
                  <td><span :class="['badge', priorityClass(item.priority)]">{{ t('restocking.priority.' + item.priority) }}</span></td>
                  <td>
                    <span :class="['badge', item.within_budget ? 'success' : 'neutral']">
                      {{ item.within_budget ? t('restocking.withinBudget') : t('restocking.exceedsBudget') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </template>
    </template>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, translateProductName, translateWarehouse } = useI18n()
    const { getCurrentFilters, selectedLocation, selectedCategory } = useFilters()

    const budgetInput = ref(null)
    const budget = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const recommendations = ref([])

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const withinBudgetCount = computed(() => recommendations.value.filter(r => r.within_budget).length)
    const budgetUsed = computed(() => recommendations.value.filter(r => r.within_budget).reduce((s, r) => s + r.estimated_cost, 0))
    const totalCost = computed(() => recommendations.value.reduce((s, r) => s + r.estimated_cost, 0))

    const loadData = async () => {
      if (!budget.value) return
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestocking(budget.value, getCurrentFilters())
      } catch (err) {
        error.value = 'Failed to load restocking recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const calculate = () => {
      if (!budgetInput.value || budgetInput.value <= 0) return
      budget.value = budgetInput.value
      loadData()
    }

    watch([selectedLocation, selectedCategory], () => {
      if (budget.value) loadData()
    })

    const formatNumber = (num) =>
      Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const priorityClass = (p) => ({ high: 'danger', medium: 'warning', low: 'info' }[p] || '')
    const trendClass = (t) => ({ increasing: 'success', stable: 'neutral', decreasing: 'danger' }[t] || '')

    return {
      t, currencySymbol, translateProductName, translateWarehouse,
      budgetInput, budget, loading, error, recommendations,
      withinBudgetCount, budgetUsed, totalCost,
      calculate, formatNumber, priorityClass, trendClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-card { margin-bottom: 1.5rem; }

.budget-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.budget-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  max-width: 360px;
}

.budget-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

.input-field {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.938rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.55rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.938rem;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { background: #cbd5e1; cursor: not-allowed; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
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
  font-size: 0.9rem;
}

.restocking-table tr:hover { background: #f8fafc; }

.row-dim { opacity: 0.5; }

.badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge.success  { background: #d1fae5; color: #065f46; }
.badge.warning  { background: #fed7aa; color: #92400e; }
.badge.danger   { background: #fecaca; color: #991b1b; }
.badge.info     { background: #dbeafe; color: #1e40af; }
.badge.neutral  { background: #f1f5f9; color: #64748b; }

.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; }
</style>
