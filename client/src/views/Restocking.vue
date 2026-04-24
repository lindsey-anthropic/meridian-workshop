<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="card budget-card">
      <div class="budget-row">
        <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
        <div class="budget-input-group">
          <span class="currency-prefix">$</span>
          <input
            v-model.number="budget"
            type="number"
            min="0"
            step="1000"
            :placeholder="t('restocking.budgetPlaceholder')"
            class="budget-input"
            @keyup.enter="loadRecommendations"
          />
          <button class="btn-primary" @click="loadRecommendations" :disabled="loading">
            {{ t('restocking.generate') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="generated">

      <!-- Summary bar -->
      <div class="summary-bar">
        <div class="summary-stat">
          <span class="summary-value">{{ acceptedItems.length }}</span>
          <span class="summary-label">{{ t('restocking.summary.accepted') }}</span>
        </div>
        <div class="summary-stat">
          <span class="summary-value">{{ pendingItems.length }}</span>
          <span class="summary-label">{{ t('restocking.summary.pending') }}</span>
        </div>
        <div class="summary-stat">
          <span class="summary-value">{{ rejectedItems.length }}</span>
          <span class="summary-label">{{ t('restocking.summary.rejected') }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-stat highlight">
          <span class="summary-value">{{ formatCurrency(acceptedCost) }}</span>
          <span class="summary-label">{{ t('restocking.totalCost') }}</span>
        </div>
        <div class="summary-stat" v-if="budget > 0">
          <span class="summary-value" :class="budgetRemaining >= 0 ? 'positive' : 'negative'">
            {{ formatCurrency(budgetRemaining) }}
          </span>
          <span class="summary-label">{{ t('restocking.budgetRemaining') }}</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="recommendations.length === 0" class="empty-state">
        {{ t('restocking.noItems') }}
      </div>

      <!-- Recommendations table -->
      <div v-else class="card">
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.item') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.demand') }}</th>
                <th>{{ t('restocking.table.recommended') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.totalCost') }}</th>
                <th>{{ t('restocking.table.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.sku + item.warehouse"
                :class="rowClass(item)"
              >
                <td><code>{{ item.sku }}</code></td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <span class="stock-low">{{ item.quantity_on_hand }}</span>
                  <span class="stock-divider"> / {{ item.reorder_point }}</span>
                </td>
                <td>{{ item.reorder_point }}</td>
                <td>
                  <span :class="trendClass(item.demand_trend)">
                    {{ t('restocking.trends.' + item.demand_trend) }}
                  </span>
                </td>
                <td><strong>{{ item.recommended_qty }}</strong></td>
                <td>{{ formatCurrency(item.unit_cost) }}</td>
                <td><strong>{{ formatCurrency(item.estimated_cost) }}</strong></td>
                <td>
                  <div class="action-buttons" v-if="item.status === 'pending'">
                    <button class="btn-accept" @click="accept(item)">{{ t('restocking.actions.accept') }}</button>
                    <button class="btn-reject" @click="reject(item)">{{ t('restocking.actions.reject') }}</button>
                  </div>
                  <span v-else-if="item.status === 'accepted'" class="status-accepted">✓ {{ t('restocking.summary.accepted') }}</span>
                  <span v-else class="status-rejected">✕ {{ t('restocking.summary.rejected') }}</span>
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
import { ref, computed, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const budget = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const recommendations = ref([])
    const generated = ref(false)

    const acceptedItems = computed(() => recommendations.value.filter(r => r.status === 'accepted'))
    const rejectedItems = computed(() => recommendations.value.filter(r => r.status === 'rejected'))
    const pendingItems = computed(() => recommendations.value.filter(r => r.status === 'pending'))
    const acceptedCost = computed(() => acceptedItems.value.reduce((sum, r) => sum + r.estimated_cost, 0))
    const budgetRemaining = computed(() => (budget.value || 0) - acceptedCost.value)

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        const data = await api.getRestockingRecommendations(budget.value, filters)
        recommendations.value = data.map(r => ({ ...r, status: 'pending' }))
        generated.value = true
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const accept = (item) => { item.status = 'accepted' }
    const reject = (item) => { item.status = 'rejected' }

    const formatCurrency = (num) =>
      Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    const trendClass = (trend) => ({
      'trend-increasing': trend === 'increasing',
      'trend-stable': trend === 'stable',
      'trend-decreasing': trend === 'decreasing'
    })

    const rowClass = (item) => ({
      'row-accepted': item.status === 'accepted',
      'row-rejected': item.status === 'rejected'
    })

    // Reload when warehouse/category filters change (if already generated)
    watch([selectedLocation, selectedCategory], () => {
      if (generated.value) loadRecommendations()
    })

    return {
      t,
      budget,
      loading,
      error,
      recommendations,
      generated,
      acceptedItems,
      rejectedItems,
      pendingItems,
      acceptedCost,
      budgetRemaining,
      loadRecommendations,
      accept,
      reject,
      formatCurrency,
      trendClass,
      rowClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-card {
  margin-bottom: 1.5rem;
}

.budget-row {
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

.budget-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.currency-prefix {
  font-size: 1.25rem;
  font-weight: 600;
  color: #64748b;
}

.budget-input {
  flex: 1;
  max-width: 260px;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.15s;
}

.budget-input:focus { border-color: #3b82f6; }

.btn-primary {
  padding: 0.625rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { opacity: 0.5; cursor: default; }

.summary-bar {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.75rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-value.positive { color: #16a34a; }
.summary-value.negative { color: #dc2626; }

.summary-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

.summary-stat.highlight .summary-value { color: #3b82f6; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restocking-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.restocking-table tr:hover:not(.row-accepted):not(.row-rejected) { background: #f8fafc; }

.row-accepted { background: #f0fdf4 !important; }
.row-rejected { background: #fafafa !important; opacity: 0.55; }

code {
  font-family: monospace;
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #334155;
}

.stock-low { color: #dc2626; font-weight: 700; }
.stock-divider { color: #94a3b8; font-size: 0.8rem; }

.trend-increasing { color: #16a34a; font-weight: 600; }
.trend-stable { color: #2563eb; font-weight: 600; }
.trend-decreasing { color: #d97706; font-weight: 600; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-accept {
  padding: 0.35rem 0.875rem;
  background: #dcfce7;
  color: #166534;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-accept:hover { background: #bbf7d0; }

.btn-reject {
  padding: 0.35rem 0.875rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-reject:hover { background: #fecaca; }

.status-accepted { color: #16a34a; font-weight: 600; font-size: 0.875rem; }
.status-rejected { color: #94a3b8; font-size: 0.875rem; }

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
