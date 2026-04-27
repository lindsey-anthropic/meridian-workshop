<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-card">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrapper">
        <span class="currency-prefix">{{ currencySymbol }}</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="100"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="result">
      <!-- Summary -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summaryRecommended') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ formatMoney(result.total_recommended) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summaryBudget') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ formatMoney(result.budget) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summaryWithinBudget') }}</div>
          <div class="stat-value">{{ result.items_within_budget }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summaryAboveBudget') }}</div>
          <div class="stat-value">{{ result.items_above_budget }}</div>
        </div>
      </div>

      <!-- Within budget table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ t('restocking.withinBudgetTitle', { count: result.recommendations.length }) }}
          </h3>
        </div>
        <div v-if="result.recommendations.length === 0" class="empty-state">
          {{ t('restocking.noResults') }}
        </div>
        <div v-else class="table-container">
          <table class="rec-table">
            <thead>
              <tr>
                <th class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                    :title="t('restocking.selectAll')"
                  />
                </th>
                <th>{{ t('restocking.columns.priority') }}</th>
                <th>{{ t('restocking.columns.sku') }}</th>
                <th>{{ t('restocking.columns.name') }}</th>
                <th>{{ t('restocking.columns.warehouse') }}</th>
                <th class="col-num">{{ t('restocking.columns.currentStock') }}</th>
                <th class="col-num">{{ t('restocking.columns.reorderPoint') }}</th>
                <th class="col-num">{{ t('restocking.columns.recommendedQty') }}</th>
                <th class="col-num">{{ t('restocking.columns.unitCost') }}</th>
                <th class="col-num">{{ t('restocking.columns.totalCost') }}</th>
                <th>{{ t('restocking.columns.forecast') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in result.recommendations" :key="rec.sku">
                <td class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="selectedSkus.has(rec.sku)"
                    @change="toggleRow(rec.sku)"
                  />
                </td>
                <td>
                  <span :class="['badge', priorityClass(rec.priority)]">
                    {{ priorityLabel(rec.priority) }}
                  </span>
                </td>
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ translateProductName(rec.name) }}</td>
                <td>{{ translateWarehouse(rec.warehouse) }}</td>
                <td class="col-num">{{ rec.current_stock }}</td>
                <td class="col-num">{{ rec.reorder_point }}</td>
                <td class="col-num"><strong>{{ rec.recommended_qty }}</strong></td>
                <td class="col-num">{{ currencySymbol }}{{ formatMoney(rec.unit_cost) }}</td>
                <td class="col-num"><strong>{{ currencySymbol }}{{ formatMoney(rec.total_cost) }}</strong></td>
                <td>
                  <span v-if="rec.has_forecast" class="forecast-yes">
                    {{ t('restocking.forecastAvailable') }}
                  </span>
                  <span v-else class="forecast-no">
                    {{ t('restocking.forecastMissing') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Above budget (collapsible) -->
      <div v-if="result.overflow.length > 0" class="card">
        <div class="card-header collapsible" @click="overflowExpanded = !overflowExpanded">
          <h3 class="card-title">
            {{ t('restocking.aboveBudgetTitle', { count: result.overflow.length }) }}
          </h3>
          <span class="chevron">{{ overflowExpanded ? '▾' : '▸' }}</span>
        </div>
        <div v-if="overflowExpanded" class="table-container">
          <table class="rec-table">
            <thead>
              <tr>
                <th>{{ t('restocking.columns.priority') }}</th>
                <th>{{ t('restocking.columns.sku') }}</th>
                <th>{{ t('restocking.columns.name') }}</th>
                <th>{{ t('restocking.columns.warehouse') }}</th>
                <th class="col-num">{{ t('restocking.columns.currentStock') }}</th>
                <th class="col-num">{{ t('restocking.columns.recommendedQty') }}</th>
                <th class="col-num">{{ t('restocking.columns.totalCost') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in result.overflow" :key="rec.sku">
                <td>
                  <span :class="['badge', priorityClass(rec.priority)]">
                    {{ priorityLabel(rec.priority) }}
                  </span>
                </td>
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ translateProductName(rec.name) }}</td>
                <td>{{ translateWarehouse(rec.warehouse) }}</td>
                <td class="col-num">{{ rec.current_stock }}</td>
                <td class="col-num">{{ rec.recommended_qty }}</td>
                <td class="col-num">{{ currencySymbol }}{{ formatMoney(rec.total_cost) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Sticky footer for selection -->
    <div v-if="result && result.recommendations.length > 0" class="action-bar">
      <div class="action-summary">
        {{ t('restocking.selectedSummary', {
          count: selectedSkus.size,
          symbol: currencySymbol,
          total: formatMoney(selectedTotal)
        }) }}
      </div>
      <button
        class="action-btn"
        :disabled="selectedSkus.size === 0 || creating"
        @click="createPurchaseOrders"
      >
        {{ creating ? t('restocking.creating') : t('restocking.createPurchaseOrders') }}
      </button>
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
    const { t, currentLocale, currentCurrency, translateProductName, translateWarehouse } = useI18n()

    const currencySymbol = computed(() =>
      currentCurrency.value === 'JPY' ? '¥' : '$'
    )

    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const budgetInput = ref(50000)
    const loading = ref(true)
    const error = ref(null)
    const result = ref(null)
    const selectedSkus = ref(new Set())
    const overflowExpanded = ref(false)
    const creating = ref(false)

    let debounceTimer = null

    const loadRecommendations = async () => {
      const budget = Number(budgetInput.value) || 0
      if (budget <= 0) {
        result.value = null
        loading.value = false
        return
      }
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        result.value = await api.getRestockingRecommendations({
          budget,
          warehouse: filters.warehouse,
          category: filters.category
        })
        // Reset selection on new data
        selectedSkus.value = new Set()
      } catch (err) {
        error.value = t('restocking.failedToLoad') + (err.message || err)
      } finally {
        loading.value = false
      }
    }

    const scheduleLoad = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(loadRecommendations, 300)
    }

    onMounted(loadRecommendations)
    watch(budgetInput, scheduleLoad)
    watch([selectedLocation, selectedCategory], loadRecommendations)

    const allSelected = computed(() => {
      if (!result.value || result.value.recommendations.length === 0) return false
      return result.value.recommendations.every(r => selectedSkus.value.has(r.sku))
    })

    const toggleSelectAll = () => {
      if (allSelected.value) {
        selectedSkus.value = new Set()
      } else {
        selectedSkus.value = new Set(result.value.recommendations.map(r => r.sku))
      }
    }

    const toggleRow = (sku) => {
      const next = new Set(selectedSkus.value)
      if (next.has(sku)) {
        next.delete(sku)
      } else {
        next.add(sku)
      }
      selectedSkus.value = next
    }

    const selectedTotal = computed(() => {
      if (!result.value) return 0
      return result.value.recommendations
        .filter(r => selectedSkus.value.has(r.sku))
        .reduce((sum, r) => sum + r.total_cost, 0)
    })

    const formatMoney = (n) =>
      Number(n).toLocaleString(
        currentLocale.value === 'ja' ? 'ja-JP' : 'en-US',
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )

    const priorityClass = (p) => {
      if (p === 'high') return 'danger'
      if (p === 'medium') return 'warning'
      return 'success'
    }

    const priorityLabel = (p) => {
      if (p === 'high') return t('restocking.priorityHigh')
      if (p === 'medium') return t('restocking.priorityMedium')
      return t('restocking.priorityLow')
    }

    const isoDatePlusDays = (days) => {
      const d = new Date()
      d.setDate(d.getDate() + days)
      return d.toISOString().slice(0, 10)
    }

    const createPurchaseOrders = async () => {
      if (selectedSkus.value.size === 0 || !result.value) return
      const selected = result.value.recommendations.filter(r => selectedSkus.value.has(r.sku))
      try {
        creating.value = true
        const expectedDelivery = isoDatePlusDays(14)
        await Promise.all(
          selected.map(rec => api.createPurchaseOrder({
            supplier_name: 'TBD',
            quantity: rec.recommended_qty,
            unit_cost: rec.unit_cost,
            expected_delivery_date: expectedDelivery,
            sku: rec.sku,
            notes: 'Generated from Restocking'
          }))
        )
        alert(t('restocking.createSuccess', { count: selected.length }))
        await loadRecommendations()
      } catch (err) {
        alert(t('restocking.createError') + (err.message || err))
      } finally {
        creating.value = false
      }
    }

    return {
      t,
      currencySymbol,
      budgetInput,
      loading,
      error,
      result,
      selectedSkus,
      overflowExpanded,
      creating,
      allSelected,
      selectedTotal,
      toggleSelectAll,
      toggleRow,
      formatMoney,
      priorityClass,
      priorityLabel,
      translateProductName,
      translateWarehouse,
      createPurchaseOrders
    }
  }
}
</script>

<style scoped>
/* View-specific styles only. Shared patterns (.card, .badge, .stats-grid,
   .stat-card, .loading, .error, table baseline) come from src/styles/base.css. */

.restocking {
  padding: 0;
  padding-bottom: 5rem;
}

.budget-card {
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-5);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.budget-label {
  font-weight: var(--weight-semibold);
  color: var(--color-text);
  white-space: nowrap;
}

.budget-input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.currency-prefix {
  position: absolute;
  left: var(--space-3);
  color: var(--color-text-dim);
  font-weight: var(--weight-semibold);
}

.budget-input {
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-6);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  width: 200px;
  color: var(--color-text);
}

.budget-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.card-header.collapsible {
  cursor: pointer;
  margin-bottom: 0;
}

.card-header.collapsible:hover .card-title {
  color: var(--color-primary);
}

.chevron {
  color: var(--color-text-dim);
  font-size: var(--text-base);
}

.col-checkbox {
  width: 40px;
  text-align: center;
}

.col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.forecast-yes {
  color: var(--color-success);
  font-weight: var(--weight-medium);
  font-size: var(--text-sm);
}

.forecast-no {
  color: var(--color-text-dim);
  font-style: italic;
  font-size: var(--text-sm);
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 6px rgba(15, 23, 42, 0.05);
  z-index: 50;
}

.action-summary {
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: var(--weight-medium);
}

.action-btn {
  padding: var(--space-2) var(--space-5);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.action-btn:disabled {
  background: var(--color-border-strong);
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  color: var(--color-text-dim);
  padding: var(--space-6);
  font-style: italic;
}
</style>
