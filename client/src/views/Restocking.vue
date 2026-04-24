<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order suggestions based on current stock levels and demand forecasts</p>
    </div>

    <div class="budget-bar card">
      <label class="budget-label">Budget Ceiling</label>
      <div class="budget-inputs">
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          placeholder="No limit"
          class="budget-field"
          @keyup.enter="applyBudget"
        />
        <button class="btn-primary" @click="applyBudget">Apply</button>
        <button v-if="activeBudget" class="btn-secondary" @click="clearBudget">Clear</button>
      </div>
      <div v-if="activeBudget" class="budget-status">
        Budget: <strong>${{ activeBudget.toLocaleString() }}</strong> —
        <span class="positive-change">${{ (data.cost_within_budget || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} fits</span>,
        <span class="negative-change">{{ data.items_excluded_budget }} items excluded</span>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card warning">
          <div class="stat-label">Items Below Reorder Point</div>
          <div class="stat-value">{{ data.recommendations.length }}</div>
        </div>
        <div class="stat-card danger">
          <div class="stat-label">Total Estimated Cost</div>
          <div class="stat-value">${{ (data.total_estimated_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Items Within Budget</div>
          <div class="stat-value">{{ activeBudget ? data.items_within_budget : data.recommendations.length }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recommended Purchase Orders</h3>
          <span class="badge info">Sorted by priority</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU / Item</th>
                <th>Warehouse</th>
                <th>Current Stock</th>
                <th>Reorder Point</th>
                <th>Recommended Qty</th>
                <th>Unit Cost</th>
                <th>Estimated Cost</th>
                <th>Demand</th>
                <th>Priority</th>
                <th v-if="activeBudget">Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in data.recommendations"
                :key="rec.sku"
                :class="{ 'excluded-row': activeBudget && !rec.within_budget }"
              >
                <td>
                  <div class="item-name">{{ rec.name }}</div>
                  <div class="item-sku">{{ rec.sku }}</div>
                </td>
                <td>{{ rec.warehouse }}</td>
                <td>
                  <span class="stock-low">{{ rec.current_stock }}</span>
                  <span class="stock-of"> / {{ rec.reorder_point }}</span>
                </td>
                <td>{{ rec.reorder_point }}</td>
                <td><strong>{{ rec.recommended_qty.toLocaleString() }}</strong></td>
                <td>${{ rec.unit_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
                <td><strong>${{ rec.estimated_cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</strong></td>
                <td><span :class="['badge', rec.demand_trend]">{{ rec.demand_trend }}</span></td>
                <td><span :class="['badge', rec.priority]">{{ rec.priority }}</span></td>
                <td v-if="activeBudget">
                  <span v-if="rec.within_budget" class="badge success">In</span>
                  <span v-else class="badge danger">Out</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!data.recommendations.length" class="empty-state">
          No items below reorder point — inventory levels look healthy.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'

export default {
  name: 'Restocking',
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const data = ref({ recommendations: [], total_estimated_cost: 0, cost_within_budget: 0, items_within_budget: 0, items_excluded_budget: 0 })
    const budgetInput = ref(null)
    const activeBudget = ref(null)

    const { selectedLocation, selectedCategory } = useFilters()

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        data.value = await api.getRestockingRecommendations({
          budget: activeBudget.value,
          warehouse: selectedLocation.value,
          category: selectedCategory.value
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      activeBudget.value = budgetInput.value || null
      loadData()
    }

    const clearBudget = () => {
      budgetInput.value = null
      activeBudget.value = null
      loadData()
    }

    onMounted(loadData)

    return {
      loading, error, data, budgetInput, activeBudget,
      applyBudget, clearBudget
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.budget-label {
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.budget-inputs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.budget-field {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 160px;
  outline: none;
}

.budget-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.budget-status {
  font-size: 0.875rem;
  color: #475569;
}

.item-name {
  font-weight: 500;
  color: #0f172a;
}

.item-sku {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}

.stock-low {
  font-weight: 700;
  color: #dc2626;
}

.stock-of {
  color: #94a3b8;
  font-size: 0.8em;
}

.excluded-row {
  opacity: 0.45;
}

.positive-change {
  color: #16a34a;
  font-weight: 600;
}

.negative-change {
  color: #dc2626;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}
</style>
