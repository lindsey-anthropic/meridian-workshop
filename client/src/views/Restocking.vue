<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on stock levels and demand forecasts</p>
    </div>

    <div class="budget-control card">
      <label class="budget-label">Budget Ceiling (USD)</label>
      <div class="budget-input-row">
        <span class="currency-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          placeholder="No limit"
          class="budget-input"
        />
        <button v-if="budgetInput" @click="budgetInput = null" class="clear-btn">Clear</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Items Below Reorder Point</div>
          <div class="stat-value">{{ items.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Estimated Cost</div>
          <div class="stat-value">{{ formatCurrency(totalCost) }}</div>
        </div>
        <div class="stat-card" v-if="budgetInput">
          <div class="stat-label">Within Budget</div>
          <div class="stat-value">{{ items.length }} items</div>
        </div>
        <div class="stat-card" v-if="budgetInput">
          <div class="stat-label">Budget Remaining</div>
          <div class="stat-value">{{ formatCurrency(budgetInput - totalCost) }}</div>
        </div>
      </div>

      <div class="card" v-if="items.length === 0">
        <p class="empty-state">No items below reorder point for the selected filters.</p>
      </div>

      <div class="card" v-else>
        <div class="card-header">
          <h3 class="card-title">Recommended Purchase Orders</h3>
          <span class="card-subtitle">Sorted by urgency (lowest days of coverage first)</span>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Warehouse</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Point</th>
                <th>Days of Coverage</th>
                <th>Rec. Qty</th>
                <th>Est. Cost</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.sku" :class="getUrgencyRowClass(item)">
                <td><code>{{ item.sku }}</code></td>
                <td><strong>{{ item.name }}</strong></td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.category }}</td>
                <td>
                  <span :class="getStockClass(item)">{{ item.current_stock }}</span>
                </td>
                <td>{{ item.reorder_point }}</td>
                <td>
                  <span :class="getDaysClass(item.days_of_coverage)">
                    {{ item.days_of_coverage }}d
                  </span>
                </td>
                <td><strong>{{ item.recommended_qty }}</strong></td>
                <td>{{ formatCurrency(item.estimated_cost) }}</td>
                <td>
                  <span :class="getTrendClass(item.demand_trend)">
                    {{ item.demand_trend }}
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
import { api } from '@/api'
import { useFilters } from '@/composables/useFilters'

export default {
  name: 'Restocking',
  setup() {
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const items = ref([])
    const budgetInput = ref(null)

    const totalCost = computed(() => items.value.reduce((sum, i) => sum + i.estimated_cost, 0))

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        if (budgetInput.value) filters.budget = budgetInput.value
        items.value = await api.getRestocking(filters)
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory, budgetInput], loadData)
    onMounted(loadData)

    const formatCurrency = (num) =>
      num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

    const getUrgencyRowClass = (item) => item.days_of_coverage < 10 ? 'row-critical' : item.days_of_coverage < 20 ? 'row-warning' : ''
    const getStockClass = (item) => item.current_stock < item.reorder_point * 0.5 ? 'badge danger' : 'badge warning'
    const getDaysClass = (days) => days < 10 ? 'badge danger' : days < 20 ? 'badge warning' : 'badge success'
    const getTrendClass = (trend) => trend === 'increasing' ? 'trend-up' : trend === 'decreasing' ? 'trend-down' : 'trend-stable'

    return {
      loading, error, items, budgetInput, totalCost,
      formatCurrency, getUrgencyRowClass, getStockClass, getDaysClass, getTrendClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-control {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.budget-label {
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}

.budget-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.currency-prefix {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;
}

.budget-input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  width: 200px;
  outline: none;
  transition: border-color 0.2s;
}

.budget-input:focus { border-color: #3b82f6; }

.clear-btn {
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: #64748b;
  font-size: 0.875rem;
}

.clear-btn:hover { background: #e2e8f0; }

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
  border-left: 4px solid #f59e0b;
}

.stat-label { font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; }

.card-header { margin-bottom: 1rem; }
.card-title { font-size: 1.125rem; font-weight: 600; color: #0f172a; margin: 0 0 0.25rem; }
.card-subtitle { font-size: 0.8rem; color: #94a3b8; }

.table-container { overflow-x: auto; }

.restocking-table { width: 100%; border-collapse: collapse; }
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

.row-critical { background: #fff5f5; }
.row-critical:hover { background: #fee2e2; }
.row-warning { background: #fffbeb; }
.row-warning:hover { background: #fef3c7; }

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge.danger { background: #fee2e2; color: #991b1b; }
.badge.warning { background: #fef3c7; color: #92400e; }
.badge.success { background: #dcfce7; color: #166534; }

.trend-up { color: #dc2626; font-weight: 600; }
.trend-down { color: #16a34a; font-weight: 600; }
.trend-stable { color: #64748b; }

code { font-family: monospace; font-size: 0.85rem; background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 4px; }

.empty-state { text-align: center; color: #94a3b8; padding: 2rem; }
.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; }
</style>
