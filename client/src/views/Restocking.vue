<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget control -->
    <div class="card budget-card">
      <label class="budget-label" for="budget">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrap">
        <span class="budget-symbol">{{ currencySymbol }}</span>
        <input
          id="budget"
          v-model.number="budget"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="recommendations.length === 0" class="loading">{{ t('restocking.noRecommendations') }}</div>
    <div v-else>
      <!-- Summary -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.recommended') }}</div>
          <div class="stat-value">{{ summary.recommended_count }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.deferred') }}</div>
          <div class="stat-value">{{ summary.deferred_count }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.totalCost') }}</div>
          <div class="stat-value">{{ formatMoney(summary.total_cost) }}</div>
        </div>
        <div class="stat-card" :class="{ negative: summary.budget_remaining < 0 }">
          <div class="stat-label">{{ t('restocking.summary.budgetRemaining') }}</div>
          <div class="stat-value">{{ formatMoney(summary.budget_remaining) }}</div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="card">
        <div class="card-header recommendations-header">
          <h3 class="card-title">{{ t('restocking.recommendationsTitle') }}</h3>
          <div class="action-area">
            <span v-if="created" class="created-msg">✓ {{ t('restocking.created') }}</span>
            <button
              v-else
              class="create-orders-btn"
              :disabled="creating || summary.recommended_count === 0"
              @click="createOrders"
            >
              {{ creating ? t('restocking.creating') : t('restocking.createOrders') }}
            </button>
          </div>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.item') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th class="num">{{ t('restocking.table.onHand') }}</th>
                <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
                <th class="num">{{ t('restocking.table.forecast') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th class="num">{{ t('restocking.table.recommendedQty') }}</th>
                <th class="num">{{ t('restocking.table.estCost') }}</th>
                <th>{{ t('restocking.table.urgency') }}</th>
                <th>{{ t('restocking.table.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in recommendations" :key="rec.sku" :class="{ deferred: !rec.recommended }">
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ translateProductName(rec.name) }}</td>
                <td>{{ translateWarehouse(rec.warehouse) }}</td>
                <td class="num">{{ formatCount(rec.quantity_on_hand) }}</td>
                <td class="num">{{ formatCount(rec.reorder_point) }}</td>
                <td class="num">{{ formatCount(rec.forecasted_demand) }}</td>
                <td>
                  <span :class="['trend', rec.trend]">{{ t('trends.' + rec.trend) }}</span>
                </td>
                <td class="num"><strong>{{ formatCount(rec.recommended_qty) }}</strong></td>
                <td class="num">{{ formatMoney(rec.estimated_cost) }}</td>
                <td>
                  <span :class="['badge', urgencyClass(rec.urgency)]">
                    {{ t('priority.' + rec.urgency.toLowerCase()) }}
                  </span>
                </td>
                <td>
                  <span :class="['status-pill', rec.recommended ? 'within' : 'deferred']">
                    {{ rec.recommended ? t('restocking.status.within') : t('restocking.status.deferred') }}
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

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, currentLocale, translateProductName, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const budget = ref(50000)
    const recommendations = ref([])
    const summary = ref({})
    const creating = ref(false)
    const created = ref(false)

    const currencySymbol = computed(() => (currentCurrency.value === 'JPY' ? '¥' : '$'))
    const numberLocale = computed(() => (currentLocale.value === 'ja' ? 'ja-JP' : 'en-US'))

    const formatMoney = (v) => `${currencySymbol.value}${Number(v || 0).toLocaleString(numberLocale.value, { maximumFractionDigits: 0 })}`
    const formatCount = (v) => Number(v || 0).toLocaleString(numberLocale.value)

    const urgencyClass = (urgency) => ({ High: 'danger', Medium: 'warning', Low: 'success' }[urgency] || 'info')

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        created.value = false
        const data = await api.getRestockingRecommendations({
          budget: budget.value >= 0 ? budget.value : 0,
          warehouse: selectedLocation.value,
          category: selectedCategory.value
        })
        recommendations.value = data.recommendations
        summary.value = data.summary
      } catch (err) {
        error.value = t('common.error') + ': ' + err.message
      } finally {
        loading.value = false
      }
    }

    const createOrders = async () => {
      try {
        creating.value = true
        const toCreate = recommendations.value.filter((r) => r.recommended)
        await Promise.all(
          toCreate.map((r) =>
            api.createPurchaseOrder({
              sku: r.sku,
              item_name: r.name,
              quantity: r.recommended_qty,
              unit_cost: r.unit_cost
            })
          )
        )
        created.value = true
      } catch (err) {
        error.value = t('common.error') + ': ' + err.message
      } finally {
        creating.value = false
      }
    }

    // Reload on budget or shared filter changes
    watch([budget, selectedLocation, selectedCategory], loadRecommendations)

    onMounted(loadRecommendations)

    return {
      t,
      loading,
      error,
      budget,
      recommendations,
      summary,
      creating,
      created,
      currencySymbol,
      formatMoney,
      formatCount,
      urgencyClass,
      createOrders,
      translateProductName,
      translateWarehouse
    }
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.budget-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.budget-label {
  font-weight: 600;
  color: #0f172a;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.25rem 0.75rem;
  background: white;
}

.budget-symbol {
  color: #64748b;
  font-weight: 600;
  margin-right: 0.25rem;
}

.budget-input {
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  width: 160px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
}

.stat-card.negative {
  border-left-color: #dc2626;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
}

.recommendations-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.create-orders-btn {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease, opacity 0.2s ease;
}

.create-orders-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.create-orders-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.created-msg {
  color: #166534;
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
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

.restocking-table th.num,
.restocking-table td.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.restocking-table tr.deferred {
  opacity: 0.55;
}

.restocking-table tr:hover {
  background: #f8fafc;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.danger { background: #fee2e2; color: #991b1b; }
.badge.warning { background: #fef3c7; color: #92400e; }
.badge.success { background: #dcfce7; color: #166534; }
.badge.info { background: #e0e7ff; color: #3730a3; }

.trend.increasing { color: #16a34a; font-weight: 600; }
.trend.decreasing { color: #dc2626; font-weight: 600; }
.trend.stable { color: #64748b; }

.status-pill {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.status-pill.within { background: #dcfce7; color: #166534; }
.status-pill.deferred { background: #f1f5f9; color: #64748b; }

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
