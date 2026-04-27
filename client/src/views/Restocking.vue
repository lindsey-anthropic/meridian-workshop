<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Recommendations</h2>
      <p>Purchase order recommendations based on stock levels, demand forecasts, and your budget</p>
    </div>

    <!-- Budget input -->
    <div class="card budget-card">
      <div class="budget-row">
        <label class="budget-label">Budget ceiling (USD)</label>
        <div class="budget-input-group">
          <span class="currency-symbol">$</span>
          <input
            v-model.number="budget"
            type="number"
            min="1"
            step="1000"
            class="budget-input"
            @keyup.enter="loadRecommendations"
          />
          <button class="apply-btn" @click="loadRecommendations">Apply</button>
        </div>
      </div>

      <!-- Budget tracker -->
      <div v-if="recommendations.length" class="budget-tracker">
        <div class="budget-tracker-labels">
          <span>Budget used: ${{ formatNumber(budgetUsed) }}</span>
          <span>Remaining: ${{ formatNumber(budget - budgetUsed) }}</span>
        </div>
        <div class="budget-bar-bg">
          <div class="budget-bar-fill" :style="{ width: budgetPercent + '%' }" :class="budgetBarClass"></div>
        </div>
        <div class="budget-percent">{{ budgetPercent.toFixed(1) }}% of ${{ formatNumber(budget) }}</div>
      </div>
    </div>

    <div v-if="loading" class="loading">Calculating recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!recommendations.length && hasLoaded" class="empty">
      No understocked items match the current filters, or budget is too low.
    </div>
    <div v-else-if="recommendations.length">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ recommendations.length }} recommended purchase orders</h3>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>In stock</th>
                <th>Reorder at</th>
                <th>Qty to order</th>
                <th>Unit cost</th>
                <th>Total cost</th>
                <th>Trend</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in recommendations" :key="rec.id">
                <td class="sku">{{ rec.sku }}</td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.category }}</td>
                <td>{{ rec.warehouse }}</td>
                <td class="number">{{ rec.current_stock }}</td>
                <td class="number">{{ rec.reorder_point }}</td>
                <td class="number bold">{{ rec.qty_to_order }}</td>
                <td class="number">${{ formatNumber(rec.unit_cost) }}</td>
                <td class="number bold">${{ formatNumber(rec.total_cost) }}</td>
                <td><span :class="trendClass(rec.demand_trend)">{{ rec.demand_trend }}</span></td>
                <td class="number">{{ rec.priority_score.toFixed(0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { api } from '@/api'
import { useFilters } from '@/composables/useFilters'

export default {
  name: 'Restocking',
  setup() {
    const budget = ref(50000)
    const recommendations = ref([])
    const loading = ref(false)
    const error = ref(null)
    const hasLoaded = ref(false)

    const { selectedLocation, selectedCategory } = useFilters()

    const budgetUsed = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.total_cost, 0)
    )

    const budgetPercent = computed(() =>
      budget.value > 0 ? Math.min(100, (budgetUsed.value / budget.value) * 100) : 0
    )

    const budgetBarClass = computed(() => {
      if (budgetPercent.value >= 90) return 'danger'
      if (budgetPercent.value >= 70) return 'warning'
      return 'ok'
    })

    const loadRecommendations = async () => {
      if (!budget.value || budget.value <= 0) return
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockingRecommendations(budget.value, {
          warehouse: selectedLocation.value,
          category: selectedCategory.value,
        })
        hasLoaded.value = true
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadRecommendations)

    const formatNumber = (num) => {
      if (num == null) return '0.00'
      return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'trend increasing'
      if (trend === 'decreasing') return 'trend decreasing'
      return 'trend stable'
    }

    return {
      budget, recommendations, loading, error, hasLoaded,
      budgetUsed, budgetPercent, budgetBarClass,
      loadRecommendations, formatNumber, trendClass,
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }
.card { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.budget-card { }
.budget-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.budget-label { font-weight: 600; color: #0f172a; white-space: nowrap; }
.budget-input-group { display: flex; align-items: center; gap: 0; }
.currency-symbol { padding: 8px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-right: none; border-radius: 6px 0 0 6px; color: #64748b; font-weight: 600; }
.budget-input { padding: 8px 12px; border: 1px solid #e2e8f0; font-size: 1rem; width: 160px; outline: none; }
.budget-input:focus { border-color: #3b82f6; }
.apply-btn { padding: 8px 20px; background: #3b82f6; color: white; border: none; border-radius: 0 6px 6px 0; font-weight: 600; cursor: pointer; }
.apply-btn:hover { background: #2563eb; }
.budget-tracker { margin-top: 20px; }
.budget-tracker-labels { display: flex; justify-content: space-between; font-size: .875rem; color: #64748b; margin-bottom: 8px; }
.budget-bar-bg { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.budget-bar-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }
.budget-bar-fill.ok { background: #22c55e; }
.budget-bar-fill.warning { background: #f59e0b; }
.budget-bar-fill.danger { background: #ef4444; }
.budget-percent { font-size: .75rem; color: #94a3b8; margin-top: 4px; text-align: right; }
.card-header { margin-bottom: 1.5rem; }
.card-title { font-size: 1.25rem; font-weight: 600; color: #0f172a; margin: 0; }
.restocking-table { width: 100%; border-collapse: collapse; font-size: .875rem; }
.restocking-table th { background: #f8fafc; padding: .6rem .75rem; text-align: left; font-weight: 600; color: #64748b; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
.restocking-table td { padding: .6rem .75rem; border-bottom: 1px solid #e2e8f0; }
.restocking-table tr:hover td { background: #f8fafc; }
.sku { font-family: monospace; font-size: .8rem; color: #64748b; }
.number { text-align: right; font-variant-numeric: tabular-nums; }
.bold { font-weight: 600; color: #0f172a; }
.trend { padding: .2rem .6rem; border-radius: 9999px; font-size: .75rem; font-weight: 500; }
.trend.increasing { background: #fee2e2; color: #991b1b; }
.trend.stable { background: #f1f5f9; color: #475569; }
.trend.decreasing { background: #dcfce7; color: #166534; }
.loading, .empty { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
</style>
