<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on current stock levels and demand forecast</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label for="budget-input">Budget ceiling</label>
      <div class="budget-input-wrap">
        <span class="budget-prefix">$</span>
        <input
          id="budget-input"
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          placeholder="No limit"
          class="budget-input"
        />
      </div>
      <span v-if="budgetInput" class="budget-hint">
        Showing highest-priority items within ${{ budgetInput.toLocaleString() }}
      </span>
    </div>

    <div v-if="loading" class="loading">Calculating recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Summary cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Recommendations</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card stat-card--critical">
          <div class="stat-label">Critical Items</div>
          <div class="stat-value">{{ criticalCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Est. Cost</div>
          <div class="stat-value">{{ formatCurrency(totalCost) }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card" v-if="recommendations.length">
        <div class="card-header">
          <h3 class="card-title">Purchase Order Recommendations</h3>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>SKU</th>
                <th>Item</th>
                <th>Warehouse</th>
                <th>On Hand / Reorder</th>
                <th>Forecast (30d)</th>
                <th>Days Left</th>
                <th>Qty to Order</th>
                <th>Est. Cost</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku + item.warehouse">
                <td>
                  <span :class="priorityClass(item.priority)">{{ item.priority }}</span>
                </td>
                <td class="sku">{{ item.sku }}</td>
                <td>{{ item.item_name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <span :class="stockClass(item.quantity_on_hand, item.reorder_point)">
                    {{ item.quantity_on_hand }}
                  </span>
                  <span class="muted"> / {{ item.reorder_point }}</span>
                </td>
                <td>{{ item.forecasted_demand }}</td>
                <td :class="daysClass(item.days_until_shortage)">
                  {{ item.days_until_shortage }}d
                </td>
                <td><strong>{{ item.recommended_quantity }}</strong></td>
                <td>{{ formatCurrency(item.estimated_cost) }}</td>
                <td>
                  <span :class="trendClass(item.trend)">{{ item.trend }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No restocking needed{{ budgetInput ? ' within this budget' : '' }} for the selected filters.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'

const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

const loading = ref(true)
const error = ref(null)
const recommendations = ref([])
const budgetInput = ref(null)

const criticalCount = computed(() => recommendations.value.filter(r => r.priority === 'critical').length)
const totalCost = computed(() => recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0))

const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    const filters = getCurrentFilters()
    if (budgetInput.value) filters.budget = budgetInput.value
    recommendations.value = await api.getRestockingRecommendations(filters)
  } catch (err) {
    error.value = 'Failed to load recommendations: ' + err.message
  } finally {
    loading.value = false
  }
}

let budgetTimer = null
watch(budgetInput, () => {
  clearTimeout(budgetTimer)
  budgetTimer = setTimeout(loadData, 500)
})
watch([selectedLocation, selectedCategory], loadData)
onMounted(loadData)

const formatCurrency = (num) =>
  num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

const priorityClass = (p) => ({
  badge: true,
  'badge--critical': p === 'critical',
  'badge--high': p === 'high',
  'badge--medium': p === 'medium',
  'badge--low': p === 'low',
})

const trendClass = (t) => ({
  badge: true,
  'badge--trend-up': t === 'increasing',
  'badge--trend-down': t === 'decreasing',
  'badge--trend-stable': t === 'stable',
})

const stockClass = (onHand, reorderPoint) =>
  onHand <= reorderPoint ? 'stock-low' : 'stock-ok'

const daysClass = (days) => {
  if (days < 7) return 'days-critical'
  if (days < 14) return 'days-high'
  if (days < 30) return 'days-medium'
  return ''
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-bar label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.budget-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.875rem;
  border-right: 1px solid #e2e8f0;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  width: 180px;
  color: #0f172a;
}

.budget-hint {
  font-size: 0.8rem;
  color: #64748b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid #3b82f6;
}

.stat-card--critical { border-left-color: #ef4444; }

.stat-label { font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem; }
.stat-value { font-size: 1.875rem; font-weight: 700; color: #0f172a; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-header { margin-bottom: 1.5rem; }
.card-title { font-size: 1.25rem; font-weight: 600; color: #0f172a; margin: 0; }

.restocking-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

.restocking-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restocking-table td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
.restocking-table tr:hover { background: #f8fafc; }

.sku { font-family: monospace; font-size: 0.8rem; color: #475569; }
.muted { color: #94a3b8; }

.stock-low { color: #dc2626; font-weight: 600; }
.stock-ok  { color: #16a34a; }

.days-critical { color: #dc2626; font-weight: 700; }
.days-high     { color: #ea580c; font-weight: 600; }
.days-medium   { color: #d97706; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge--critical { background: #fee2e2; color: #991b1b; }
.badge--high     { background: #ffedd5; color: #9a3412; }
.badge--medium   { background: #fef3c7; color: #92400e; }
.badge--low      { background: #dbeafe; color: #1e40af; }

.badge--trend-up     { background: #dcfce7; color: #166534; }
.badge--trend-down   { background: #fee2e2; color: #991b1b; }
.badge--trend-stable { background: #f1f5f9; color: #475569; }

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
