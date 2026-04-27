<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order suggestions based on stock levels and demand forecasts</p>
    </div>

    <div class="controls card">
      <div class="controls-row">
        <div class="control-group">
          <label>Budget Ceiling ($)</label>
          <input
            v-model.number="budget"
            type="number"
            min="0"
            step="1000"
            placeholder="No limit"
            class="budget-input"
            @change="loadRecommendations"
          />
        </div>
        <div class="control-group">
          <label>Warehouse</label>
          <select v-model="warehouse" @change="loadRecommendations">
            <option value="all">All Warehouses</option>
            <option value="San Francisco">San Francisco</option>
            <option value="London">London</option>
            <option value="Tokyo">Tokyo</option>
          </select>
        </div>
        <button class="btn btn-primary" @click="loadRecommendations">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Analyzing stock levels...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="summary-bar card">
        <div class="summary-item">
          <span class="summary-label">Items to Restock</span>
          <span class="summary-value">{{ data.item_count }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Total Cost</span>
          <span class="summary-value">${{ formatNumber(data.total_cost) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Critical Items</span>
          <span class="summary-value critical-count">{{ criticalCount }}</span>
        </div>
      </div>

      <div v-if="data.recommendations.length === 0" class="card empty-state">
        <p>No restocking needed{{ budget ? ' within the specified budget' : '' }}.</p>
      </div>

      <div v-else class="card">
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item</th>
                <th>Warehouse</th>
                <th>On Hand</th>
                <th>Reorder Point</th>
                <th>Forecasted Demand</th>
                <th>Qty to Order</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in data.recommendations" :key="rec.sku" :class="rec.urgency">
                <td><code>{{ rec.sku }}</code></td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.warehouse }}</td>
                <td>
                  <span :class="rec.urgency === 'critical' ? 'badge danger' : 'badge warning'">
                    {{ rec.qty_on_hand }}
                  </span>
                </td>
                <td>{{ rec.reorder_point }}</td>
                <td>{{ rec.forecasted_demand }}</td>
                <td><strong>{{ rec.qty_recommended }}</strong></td>
                <td>${{ rec.unit_cost.toFixed(2) }}</td>
                <td>${{ formatNumber(rec.total_cost) }}</td>
                <td>
                  <button
                    class="btn btn-small btn-primary"
                    :disabled="orderedSkus.has(rec.sku)"
                    @click="createOrder(rec)"
                  >
                    {{ orderedSkus.has(rec.sku) ? 'Ordered' : 'Order' }}
                  </button>
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
import { api } from '../api'

export default {
  name: 'Restocking',
  data() {
    return {
      budget: null,
      warehouse: 'all',
      loading: true,
      error: null,
      data: { recommendations: [], total_cost: 0, item_count: 0 },
      orderedSkus: new Set()
    }
  },
  computed: {
    criticalCount() {
      return this.data.recommendations.filter(r => r.urgency === 'critical').length
    }
  },
  mounted() {
    this.loadRecommendations()
  },
  methods: {
    async loadRecommendations() {
      try {
        this.loading = true
        this.error = null
        this.data = await api.getRestockRecommendations(this.budget, this.warehouse)
      } catch (err) {
        this.error = 'Failed to load recommendations: ' + err.message
      } finally {
        this.loading = false
      }
    },

    async createOrder(rec) {
      try {
        await api.createRestockOrder({
          item_sku: rec.sku,
          item_name: rec.name,
          quantity: rec.qty_recommended,
          unit_cost: rec.unit_cost,
          warehouse: rec.warehouse
        })
        this.orderedSkus = new Set([...this.orderedSkus, rec.sku])
      } catch (err) {
        alert('Failed to create order: ' + err.message)
      }
    },

    formatNumber(num) {
      return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
}
</script>

<style scoped>
.controls-row {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.control-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
}

.budget-input,
.control-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  font-size: 0.9rem;
  width: 200px;
}

.summary-bar {
  display: flex;
  gap: 2rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #6b7280);
}

.summary-value {
  font-size: 1.4rem;
  font-weight: 600;
}

.critical-count {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary, #6b7280);
}

tr.critical td:first-child {
  border-left: 3px solid #ef4444;
}

tr.warning td:first-child {
  border-left: 3px solid #f59e0b;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
}

.btn-small:disabled {
  opacity: 0.5;
  cursor: default;
}

code {
  font-family: monospace;
  font-size: 0.85rem;
  background: var(--bg-secondary, #f3f4f6);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
</style>
