<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on stock levels, demand forecast, and budget ceiling</p>
    </div>

    <!-- Controls -->
    <div class="controls-bar">
      <select v-model="selectedWarehouse" @change="loadData" class="filter-select">
        <option value="all">All Warehouses</option>
        <option value="San Francisco">San Francisco</option>
        <option value="London">London</option>
        <option value="Tokyo">Tokyo</option>
      </select>
      <select v-model="selectedCategory" @change="loadData" class="filter-select">
        <option value="all">All Categories</option>
        <option value="sensors">Sensors</option>
        <option value="actuators">Actuators</option>
        <option value="controllers">Controllers</option>
        <option value="circuit boards">Circuit Boards</option>
        <option value="power supplies">Power Supplies</option>
      </select>
      <div class="budget-input">
        <span class="budget-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          placeholder="Budget ceiling"
          class="budget-field"
        />
        <button @click="loadData" class="apply-btn">Apply</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card danger">
          <div class="stat-label">Items Needing Restock</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Items Within Budget</div>
          <div class="stat-value">{{ itemsWithinBudget }}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Total Recommended Spend</div>
          <div class="stat-value">${{ formatCurrency(totalSpend) }}</div>
        </div>
        <div class="stat-card info">
          <div class="stat-label">Spend Within Budget</div>
          <div class="stat-value">${{ formatCurrency(spendWithinBudget) }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recommended Purchase Orders</h3>
          <span v-if="budgetInput" class="budget-badge">
            Budget: ${{ formatCurrency(budgetInput) }}
          </span>
        </div>

        <div v-if="recommendations.length === 0" class="empty-state">
          No items currently below reorder point for the selected filters.
        </div>

        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Warehouse</th>
                <th>On Hand</th>
                <th>Reorder Point</th>
                <th>Order Qty</th>
                <th>Est. Cost</th>
                <th>Demand Trend</th>
                <th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.id"
                :class="{ 'out-of-budget': budgetInput && !item.within_budget }"
              >
                <td><code>{{ item.sku }}</code></td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <span class="stock-low">{{ item.quantity_on_hand }}</span>
                  <span class="stock-hint"> / {{ item.reorder_point }}</span>
                </td>
                <td>{{ item.reorder_point }}</td>
                <td><strong>{{ item.qty_to_order }}</strong></td>
                <td>${{ formatCurrency(item.estimated_cost) }}</td>
                <td><span :class="['badge', item.trend]">{{ item.trend }}</span></td>
                <td><span :class="['badge', urgencyClass(item.urgency_score)]">{{ urgencyLabel(item.urgency_score) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Algorithm note -->
      <div class="algorithm-note">
        <strong>How recommendations are ranked:</strong> Items at or below their reorder point are included.
        Order quantity restores stock to 2× the reorder point. Urgency is calculated from stock deficit
        adjusted by demand trend (increasing ×1.5, stable ×1.0, decreasing ×0.5).
        When a budget is set, items are included in priority order until the ceiling is reached —
        greyed-out rows exceed the budget.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'

export default {
  name: 'Restocking',
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const selectedWarehouse = ref('all')
    const selectedCategory = ref('all')
    const budgetInput = ref(null)

    const itemsWithinBudget = computed(() =>
      recommendations.value.filter(r => r.within_budget).length
    )

    const totalSpend = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const spendWithinBudget = computed(() =>
      recommendations.value.filter(r => r.within_budget).reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockingRecommendations({
          warehouse: selectedWarehouse.value,
          category: selectedCategory.value,
          budget: budgetInput.value || null
        })
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (val) =>
      Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const urgencyClass = (score) => {
      if (score >= 150) return 'danger'
      if (score >= 75) return 'warning'
      return 'info'
    }

    const urgencyLabel = (score) => {
      if (score >= 150) return 'High'
      if (score >= 75) return 'Medium'
      return 'Low'
    }

    onMounted(loadData)

    return {
      loading, error, recommendations,
      selectedWarehouse, selectedCategory, budgetInput,
      itemsWithinBudget, totalSpend, spendWithinBudget,
      loadData, formatCurrency, urgencyClass, urgencyLabel
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.controls-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #0f172a;
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-select:focus { outline: none; border-color: #3b82f6; }

.budget-input {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.budget-prefix {
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  color: #64748b;
  font-size: 0.875rem;
}

.budget-field {
  border: none;
  outline: none;
  padding: 0.5rem 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  width: 150px;
}

.apply-btn {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-btn:hover { background: #1d4ed8; }

.budget-badge {
  font-size: 0.813rem;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.stock-low { color: #dc2626; font-weight: 600; }
.stock-hint { color: #94a3b8; font-size: 0.8rem; }

.out-of-budget { opacity: 0.4; }

code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.813rem;
  background: #f1f5f9;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  color: #334155;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 0.938rem;
}

.algorithm-note {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  font-size: 0.813rem;
  color: #475569;
  line-height: 1.6;
  margin-top: 1rem;
}
</style>
