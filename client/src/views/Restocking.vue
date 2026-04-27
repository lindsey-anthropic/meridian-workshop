<template>
  <div class="restocking">
    <div class="page-header">
      <div>
        <h2>{{ t('restocking.title') }}</h2>
        <p>{{ t('restocking.description') }}</p>
      </div>
      <button class="export-btn" @click="exportCsv" :disabled="!recommendations.length">
        {{ t('restocking.exportCsv') }}
      </button>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-wrap">
        <span class="currency-prefix">{{ currencySymbol }}</span>
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

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">{{ t('restocking.stats.itemsToRestock') }}</div>
        <div class="stat-value">{{ recommendations.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">{{ t('restocking.stats.totalEstCost') }}</div>
        <div class="stat-value">{{ formatCurrency(totalEstCost) }}</div>
      </div>
      <div class="stat-card" :class="budgetCeiling ? (withinBudgetCount === recommendations.length ? 'stat-card--ok' : 'stat-card--warn') : ''">
        <div class="stat-label">{{ budgetCeiling ? (withinBudgetCount === recommendations.length ? t('restocking.stats.withinBudget') : t('restocking.stats.overBudget')) : t('restocking.stats.withinBudget') }}</div>
        <div class="stat-value">{{ budgetCeiling ? formatCurrency(Math.min(totalEstCost, budgetCeiling)) + ' / ' + formatCurrency(budgetCeiling) : '—' }}</div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!recommendations.length" class="empty">{{ t('restocking.noRecommendations') }}</div>
    <div v-else class="card">
      <div class="table-container">
        <table class="restock-table">
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
              <th class="num">{{ t('restocking.table.unitCost') }}</th>
              <th class="num">{{ t('restocking.table.estCost') }}</th>
              <th>{{ t('restocking.table.urgency') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in recommendations"
              :key="item.sku + item.warehouse"
              :class="['row-' + item.urgency, budgetCeiling && item.estimated_cost > remainingBudgetFor(item) ? 'row-over-budget' : '']"
            >
              <td><code>{{ item.sku }}</code></td>
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.warehouse }}</td>
              <td class="num">{{ item.quantity_on_hand }}</td>
              <td class="num">{{ item.reorder_point }}</td>
              <td class="num">{{ item.forecasted_demand }}</td>
              <td class="num"><strong>{{ item.recommended_qty }}</strong></td>
              <td class="num">{{ formatCurrency(item.unit_cost) }}</td>
              <td class="num"><strong>{{ formatCurrency(item.estimated_cost) }}</strong></td>
              <td>
                <span :class="'badge badge-' + item.urgency">
                  {{ t('restocking.urgency.' + item.urgency) }}
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
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetCeiling = ref(null)

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const totalEstCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const withinBudgetCount = computed(() => {
      if (!budgetCeiling.value) return recommendations.value.length
      let running = 0
      let count = 0
      for (const r of recommendations.value) {
        if (running + r.estimated_cost <= budgetCeiling.value) {
          running += r.estimated_cost
          count++
        }
      }
      return count
    })

    const remainingBudgetFor = (item) => {
      if (!budgetCeiling.value) return Infinity
      let running = 0
      for (const r of recommendations.value) {
        if (r === item) return budgetCeiling.value - running
        running += r.estimated_cost
      }
      return 0
    }

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestocking(filters)
      } catch (err) {
        error.value = 'Failed to load restocking data: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    const formatCurrency = (num) =>
      num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

    const exportCsv = () => {
      const headers = ['SKU', 'Name', 'Category', 'Warehouse', 'On Hand', 'Reorder Point',
        'Forecasted Demand', 'Recommended Qty', 'Unit Cost', 'Est. Cost', 'Urgency']
      const rows = recommendations.value.map(r => [
        r.sku, r.name, r.category, r.warehouse,
        r.quantity_on_hand, r.reorder_point, r.forecasted_demand,
        r.recommended_qty, r.unit_cost, r.estimated_cost, r.urgency
      ])
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'restocking-recommendations.csv'
      a.click()
      URL.revokeObjectURL(url)
    }

    return {
      t, currencySymbol,
      loading, error, recommendations, budgetCeiling,
      totalEstCost, withinBudgetCount, remainingBudgetFor,
      formatCurrency, exportCsv
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.page-header p { font-size: 0.875rem; color: #64748b; }

.export-btn {
  background: #0f172a;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.export-btn:hover:not(:disabled) { background: #1e293b; }
.export-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Budget bar */
.budget-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
}

.budget-label {
  font-size: 0.813rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
}

.currency-prefix {
  padding: 0.4rem 0.6rem;
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  font-size: 0.875rem;
  color: #64748b;
}

.budget-input {
  border: none;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  color: #0f172a;
  width: 180px;
  outline: none;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border-left: 4px solid #e2e8f0;
}

.stat-card--ok  { border-left-color: #22c55e; }
.stat-card--warn { border-left-color: #ef4444; }

.stat-label { font-size: 0.813rem; color: #64748b; margin-bottom: 0.4rem; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; }

/* Table card */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  overflow: hidden;
}

.table-container { overflow-x: auto; }

.restock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restock-table th {
  background: #f8fafc;
  padding: 0.75rem 0.875rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restock-table th.num,
.restock-table td.num { text-align: right; }

.restock-table td {
  padding: 0.75rem 0.875rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.restock-table tr:last-child td { border-bottom: none; }
.restock-table tr:hover td { background: #f8fafc; }

code {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #475569;
}

/* Row urgency highlights */
.row-critical td { background: #fff5f5; }
.row-critical td:first-child { border-left: 3px solid #ef4444; }
.row-high td { background: #fff7ed; }
.row-high td:first-child { border-left: 3px solid #f97316; }
.row-medium td { background: #fefce8; }
.row-medium td:first-child { border-left: 3px solid #eab308; }
.row-over-budget td { opacity: 0.5; }

/* Badges */
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-critical { background: #fee2e2; color: #991b1b; }
.badge-high     { background: #ffedd5; color: #c2410c; }
.badge-medium   { background: #fef9c3; color: #854d0e; }

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border-radius: 12px;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
}
</style>
