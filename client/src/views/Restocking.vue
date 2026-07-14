<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on current stock levels, demand forecasts, and your budget ceiling.</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <div class="budget-label">Budget ceiling per warehouse</div>
      <div class="budget-input-wrap">
        <span class="currency-symbol">$</span>
        <input
          v-model.number="budget"
          type="number"
          min="0"
          step="500"
          placeholder="No limit"
          class="budget-input"
        />
        <button v-if="budget" @click="budget = null" class="clear-budget" title="Remove budget limit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <span v-if="budget" class="budget-hint">
        ${{ formatNumber(budget) }} applied per warehouse independently
      </span>
      <span v-else class="budget-hint muted">No limit set — showing all recommendations</span>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>

      <!-- Summary stats -->
      <div class="stats-grid">
        <div class="stat-card danger">
          <div class="stat-label">Items needing restock</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card info">
          <div class="stat-label">{{ budget ? 'Within budget' : 'All items' }}</div>
          <div class="stat-value">{{ withinBudgetCount }}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Total estimated cost</div>
          <div class="stat-value">${{ formatNumber(totalEstimatedCost) }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">{{ budget ? 'Cost within budget' : 'Full cost' }}</div>
          <div class="stat-value">${{ formatNumber(budgetCost) }}</div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="recommendations.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>All items are well stocked. No restocking needed for the current filters.</p>
      </div>

      <!-- Recommendations table -->
      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">
            Recommendations
            <span class="count-badge">{{ recommendations.length }}</span>
          </h3>
          <div v-if="budget" class="budget-summary">
            {{ withinBudgetCount }} of {{ recommendations.length }} items fit within ${{ formatNumber(budget) }} / warehouse
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>On Hand</th>
                <th>Reorder Point</th>
                <th>Demand Trend</th>
                <th>Rec. Qty</th>
                <th>Est. Cost</th>
                <th>Priority</th>
                <th v-if="budget">Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in recommendations"
                :key="r.id"
                :class="{ 'over-budget': budget && !isWithinBudget(r) }"
              >
                <td><strong>{{ r.sku }}</strong></td>
                <td>{{ r.name }}</td>
                <td>{{ r.category }}</td>
                <td>{{ r.warehouse }}</td>
                <td>
                  <span :class="['qty', r.quantity_on_hand <= r.reorder_point ? 'qty-low' : 'qty-ok']">
                    {{ r.quantity_on_hand }}
                  </span>
                </td>
                <td>{{ r.reorder_point }}</td>
                <td>
                  <span :class="['badge', r.demand_trend]">{{ r.demand_trend }}</span>
                </td>
                <td><strong>{{ r.recommended_qty }}</strong></td>
                <td><strong>${{ formatNumber(r.estimated_cost) }}</strong></td>
                <td>
                  <span :class="['badge', priorityClass(r.priority)]">{{ r.priority }}</span>
                </td>
                <td v-if="budget">
                  <span v-if="isWithinBudget(r)" class="badge success">In budget</span>
                  <span v-else class="badge over">Over budget</span>
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
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budget = ref(null)

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations({
          warehouse: filters.warehouse,
          category: filters.category
        })
      } catch (err) {
        console.error('Failed to load restocking recommendations:', err)
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    // Budget filtering — applied independently per warehouse
    const withinBudgetIds = computed(() => {
      if (!budget.value) return null
      const budgetPerWarehouse = Number(budget.value)
      const remaining = {}
      const ids = new Set()
      for (const r of recommendations.value) {
        if (!(r.warehouse in remaining)) remaining[r.warehouse] = budgetPerWarehouse
        if (r.estimated_cost <= remaining[r.warehouse]) {
          remaining[r.warehouse] -= r.estimated_cost
          ids.add(r.id)
        }
      }
      return ids
    })

    const isWithinBudget = (r) => withinBudgetIds.value === null || withinBudgetIds.value.has(r.id)

    const withinBudgetCount = computed(() => {
      if (!withinBudgetIds.value) return recommendations.value.length
      return withinBudgetIds.value.size
    })

    const totalEstimatedCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const budgetCost = computed(() =>
      recommendations.value
        .filter(r => isWithinBudget(r))
        .reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const formatNumber = (num) =>
      Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const priorityClass = (priority) => {
      return { high: 'danger', medium: 'warning', low: 'info' }[priority] || 'info'
    }

    return {
      t,
      loading,
      error,
      recommendations,
      budget,
      isWithinBudget,
      withinBudgetCount,
      totalEstimatedCost,
      budgetCost,
      formatNumber,
      priorityClass
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

/* Budget bar */
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
  font-size: 0.813rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  pointer-events: none;
}

.budget-input {
  padding: 0.4rem 2rem 0.4rem 1.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #0f172a;
  width: 160px;
  transition: all 0.2s;
}

.budget-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-budget {
  position: absolute;
  right: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-budget:hover { color: #64748b; }
.clear-budget svg { width: 16px; height: 16px; }

.budget-hint {
  font-size: 0.813rem;
  color: #2563eb;
  font-weight: 500;
}

.budget-hint.muted { color: #94a3b8; font-weight: 400; }

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: #64748b;
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  color: #059669;
}

.empty-state p { font-size: 0.938rem; }

/* Card header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
}

.budget-summary {
  font-size: 0.813rem;
  color: #64748b;
}

/* Table row states */
.over-budget {
  opacity: 0.45;
}

/* Quantity display */
.qty {
  font-weight: 600;
}

.qty-low { color: #dc2626; }
.qty-ok  { color: #334155; }

/* Budget status badge */
.badge.over {
  background: #f1f5f9;
  color: #94a3b8;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
