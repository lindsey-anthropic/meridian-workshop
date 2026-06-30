<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Controls -->
    <div class="controls-row">
      <div class="control-group">
        <label class="control-label" for="budget-input">{{ t('restocking.budgetLabel') }}</label>
        <input
          id="budget-input"
          v-model.number="budgetInput"
          type="number"
          class="control-input"
          min="0"
          step="1000"
        />
      </div>
      <div class="control-group">
        <label class="control-label" for="lead-time-input">{{ t('restocking.leadTimeLabel') }}</label>
        <input
          id="lead-time-input"
          v-model.number="leadTimeInput"
          type="number"
          class="control-input"
          min="1"
          step="1"
        />
      </div>
      <button class="btn-calculate" @click="runCalculation">
        {{ t('restocking.calculate') }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ t('restocking.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Summary Cards -->
      <div class="stats-grid" v-if="summary">
        <div class="stat-card budget-card">
          <div class="stat-label">{{ t('restocking.budget') }}</div>
          <div class="stat-value">{{ formatCurrency(summary.budget) }}</div>
        </div>
        <div class="stat-card spend-card">
          <div class="stat-label">{{ t('restocking.recommendedSpend') }}</div>
          <div class="stat-value">{{ formatCurrency(summary.total_recommended_cost) }}</div>
          <div class="stat-meta">{{ t('restocking.budgetUtilization', { pct: budgetUtilizationPct }) }}</div>
        </div>
        <div class="stat-card funded-card">
          <div class="stat-label">{{ t('restocking.withinBudget') }}</div>
          <div class="stat-value">{{ summary.items_within_budget }} / {{ summary.items_total }}</div>
          <div class="stat-meta">{{ t('restocking.items') }}</div>
        </div>
        <div class="stat-card deferred-card">
          <div class="stat-label">{{ t('restocking.deferred') }}</div>
          <div class="stat-value">{{ summary.items_deferred }}</div>
          <div class="stat-meta">{{ t('restocking.items') }}</div>
        </div>
        <div class="stat-card critical-card">
          <div class="stat-label">{{ t('restocking.criticalItems') }}</div>
          <div class="stat-value">{{ summary.critical_count }}</div>
          <div class="stat-meta">{{ summary.critical_within_budget }} {{ t('restocking.withinBudgetShort') }}</div>
        </div>
        <div class="stat-card remaining-card">
          <div class="stat-label">{{ t('restocking.budgetRemaining') }}</div>
          <div class="stat-value">{{ formatCurrency(summary.budget_remaining) }}</div>
        </div>
      </div>

      <!-- Recommendations Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }}</h3>
          <div class="table-meta" v-if="recommendations.length">
            {{ recommendations.length }} {{ t('restocking.items') }}
          </div>
        </div>

        <div v-if="recommendations.length === 0" class="empty-state">
          {{ t('restocking.noRecommendations') }}
        </div>
        <div v-else class="table-container">
          <table class="restock-table">
            <thead>
              <tr>
                <th>{{ t('restocking.item') }}</th>
                <th>{{ t('restocking.warehouse') }}</th>
                <th class="text-right">{{ t('restocking.onHand') }}</th>
                <th class="text-right">{{ t('restocking.daysOfCover') }}</th>
                <th class="text-right">{{ t('restocking.demand30') }}</th>
                <th class="text-right">{{ t('restocking.recommendedQty') }}</th>
                <th class="text-right">{{ t('restocking.unitCost') }}</th>
                <th class="text-right">{{ t('restocking.lineCost') }}</th>
                <th>{{ t('restocking.urgency') }}</th>
                <th>{{ t('restocking.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.sku"
                :class="[
                  'restock-row',
                  { 'row-deferred': !item.within_budget },
                  { 'row-stockout': item.will_stock_out }
                ]"
              >
                <td class="item-cell">
                  <div class="item-name">
                    <span v-if="item.will_stock_out" class="stockout-indicator" :title="t('restocking.willStockOut')"></span>
                    {{ item.name }}
                  </div>
                  <div class="item-sku">{{ item.sku }}</div>
                  <div v-if="item.will_stock_out" class="stockout-label">{{ t('restocking.willStockOut') }}</div>
                </td>
                <td class="warehouse-cell">{{ item.warehouse }}</td>
                <td class="text-right">{{ (item.quantity_on_hand ?? 0).toLocaleString() }}</td>
                <td class="text-right">
                  <span v-if="item.days_of_cover !== null && item.days_of_cover !== undefined">
                    {{ typeof item.days_of_cover === 'number' ? Math.round(item.days_of_cover) : item.days_of_cover }}
                  </span>
                  <span v-else class="null-value">—</span>
                </td>
                <td class="text-right">
                  <span v-if="item.has_forecast">{{ Math.round(item.forecasted_demand).toLocaleString() }}</span>
                  <span v-else class="null-value">—</span>
                </td>
                <td class="text-right font-semibold">{{ (item.recommended_qty ?? 0).toLocaleString() }}</td>
                <td class="text-right">{{ formatCurrency(item.unit_cost) }}</td>
                <td class="text-right font-semibold">{{ formatCurrency(item.line_cost) }}</td>
                <td>
                  <span :class="['badge', 'urgency-badge', `urgency-${item.urgency}`]">
                    {{ urgencyLabel(item.urgency) }}
                  </span>
                </td>
                <td>
                  <span :class="['badge', 'status-badge', item.within_budget ? 'status-funded' : 'status-deferred']">
                    {{ item.within_budget ? t('restocking.statusFunded') : t('restocking.statusDeferred') }}
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
import { formatCurrency as formatCurrencyUtil } from '../utils/currency'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency } = useI18n()
    const { selectedLocation, selectedCategory } = useFilters()

    const loading = ref(false)
    const error = ref(null)
    const summary = ref(null)
    const recommendations = ref([])

    const budgetInput = ref(50000)
    const leadTimeInput = ref(14)

    // Active values used for the last API call
    const activeBudget = ref(50000)
    const activeLeadTime = ref(14)

    const formatCurrency = (v) => formatCurrencyUtil(v, currentCurrency.value)

    const budgetUtilizationPct = computed(() => {
      if (!summary.value) return 0
      return summary.value.budget_utilization.toFixed(1)
    })

    const urgencyLabel = (urgency) => {
      if (urgency === 'critical') return t('restocking.urgencyCritical')
      if (urgency === 'high') return t('restocking.urgencyHigh')
      return t('restocking.urgencyMedium')
    }

    const loadData = async () => {
      loading.value = true
      error.value = null
      try {
        const params = {
          budget: activeBudget.value,
          leadTime: activeLeadTime.value,
          warehouse: selectedLocation.value,
          category: selectedCategory.value
        }
        const response = await api.getRestockingRecommendations(params)
        summary.value = response.summary
        recommendations.value = response.recommendations
      } catch (err) {
        error.value = t('restocking.loadError')
        console.error('Failed to load restocking data:', err)
      } finally {
        loading.value = false
      }
    }

    const runCalculation = () => {
      // Guard against invalid input before hitting the API, so the operator gets
      // an actionable message instead of a generic load failure (or wrong data).
      if (!budgetInput.value || budgetInput.value <= 0 ||
          !leadTimeInput.value || leadTimeInput.value < 1) {
        error.value = t('restocking.invalidInputs')
        return
      }
      activeBudget.value = budgetInput.value
      activeLeadTime.value = leadTimeInput.value
      loadData()
    }

    watch([selectedLocation, selectedCategory], loadData)

    onMounted(loadData)

    return {
      t,
      loading,
      error,
      summary,
      recommendations,
      budgetInput,
      leadTimeInput,
      budgetUtilizationPct,
      formatCurrency,
      urgencyLabel,
      runCalculation
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

/* Controls */
.controls-row {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.control-label {
  font-size: 0.813rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.control-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.938rem;
  color: #0f172a;
  width: 160px;
  transition: border-color 0.15s ease;
}

.control-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-calculate {
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
  white-space: nowrap;
}

.btn-calculate:hover {
  background: #1d4ed8;
}

.btn-calculate:active {
  background: #1e40af;
}

/* Summary cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #e2e8f0;
}

.budget-card  { border-left-color: #64748b; }
.spend-card   { border-left-color: #2563eb; }
.funded-card  { border-left-color: #16a34a; }
.deferred-card { border-left-color: #d97706; }
.critical-card { border-left-color: #dc2626; }
.remaining-card { border-left-color: #059669; }

.stat-label {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.1;
}

.stat-meta {
  margin-top: 0.375rem;
  font-size: 0.813rem;
  color: #64748b;
}

/* Card shell */
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.table-meta {
  font-size: 0.813rem;
  color: #64748b;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.restock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restock-table thead {
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 1;
}

.restock-table th {
  padding: 0.625rem 0.875rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restock-table th.text-right {
  text-align: right;
}

.restock-table td {
  padding: 0.75rem 0.875rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #0f172a;
}

.restock-table td.text-right {
  text-align: right;
}

/* Row states */
.restock-row {
  transition: background-color 0.12s ease;
}

.restock-row:hover {
  background: #f8fafc;
}

.row-deferred {
  opacity: 0.55;
}

.row-deferred:hover {
  opacity: 0.75;
}

/* Stock-out highlight: left red border via box-shadow on cells */
.row-stockout td:first-child {
  border-left: 3px solid #dc2626;
  padding-left: calc(0.875rem - 3px);
}

/* Item cell */
.item-cell {
  min-width: 200px;
}

.item-name {
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.item-sku {
  font-size: 0.75rem;
  color: #94a3b8;
  font-family: 'Monaco', 'Courier New', monospace;
  margin-top: 0.125rem;
}

.stockout-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc2626;
  flex-shrink: 0;
}

.stockout-label {
  font-size: 0.7rem;
  color: #dc2626;
  font-weight: 600;
  margin-top: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.warehouse-cell {
  color: #475569;
  white-space: nowrap;
}

.null-value {
  color: #cbd5e1;
}

.font-semibold {
  font-weight: 600;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.urgency-badge.urgency-critical {
  background: #fee2e2;
  color: #991b1b;
}

.urgency-badge.urgency-high {
  background: #fef3c7;
  color: #92400e;
}

.urgency-badge.urgency-medium {
  background: #f1f5f9;
  color: #475569;
}

.status-badge.status-funded {
  background: #dcfce7;
  color: #166534;
}

.status-badge.status-deferred {
  background: #f1f5f9;
  color: #94a3b8;
}

/* States */
.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 0.938rem;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 0.938rem;
}
</style>
