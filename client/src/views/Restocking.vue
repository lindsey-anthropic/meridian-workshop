<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Budget input -->
      <div class="card budget-card">
        <div class="budget-input-row">
          <label for="budget-ceiling">{{ t('restocking.budget.label') }}</label>
          <input
            id="budget-ceiling"
            v-model.number="budgetCeiling"
            type="number"
            min="0"
            step="100"
            :placeholder="t('restocking.budget.placeholder')"
            class="budget-input"
          />
        </div>

        <div v-if="budgetCeiling > 0" class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">{{ t('restocking.budget.totalRecommended') }}</div>
            <div class="stat-value">{{ formatCurrency(totalRecommendedCost, selectedCurrency) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ t('restocking.budget.totalFunded') }}</div>
            <div class="stat-value">{{ formatCurrency(totalFundedCost, selectedCurrency) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ t('restocking.budget.remaining') }}</div>
            <div class="stat-value">{{ formatCurrency(remainingBudget, selectedCurrency) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ t('restocking.budget.itemsFunded') }}</div>
            <div class="stat-value">{{ itemsFundedCount }} / {{ recommendations.length }}</div>
          </div>
        </div>
        <div v-else class="budget-prompt">{{ t('restocking.budget.enterPrompt') }}</div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.item') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.stockStatus') }}</th>
                <th>{{ t('restocking.table.demand') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.fundedStatus') }}</th>
                <th>{{ t('restocking.table.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in fundedRecommendations" :key="rec.sku">
                <td>
                  <strong>{{ rec.name }}</strong>
                  <div class="sku-label">{{ rec.sku }}</div>
                </td>
                <td>{{ translateWarehouse(rec.warehouse) }}</td>
                <td>{{ translateCategory(rec.category) }}</td>
                <td>
                  <span :class="['badge', stockStatusClass(rec.stock_status)]">
                    {{ t(`restocking.stockStatus.${camelCase(rec.stock_status)}`) }}
                  </span>
                </td>
                <td>
                  <span v-if="rec.has_demand_data" :class="['badge', trendClass(rec.trend)]">
                    {{ rec.trend }}
                  </span>
                  <span v-else class="badge muted">{{ t('restocking.noDemandData') }}</span>
                </td>
                <td>{{ rec.recommended_quantity }}</td>
                <td>{{ formatCurrency(rec.estimated_cost, selectedCurrency) }}</td>
                <td>
                  <span :class="['badge', fundedStatusClass(rec.funded_status)]">
                    {{ t(`restocking.fundedStatus.${rec.funded_status}`) }}
                    <template v-if="rec.funded_status === 'partial'">({{ rec.funded_quantity }})</template>
                  </span>
                </td>
                <td>
                  <button
                    class="create-order-btn"
                    :disabled="rec.funded_quantity === 0 || orderedSkus.has(rec.sku)"
                    @click="openCreateOrder(rec)"
                  >
                    {{ t('restocking.createOrder') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="recommendations.length === 0" class="no-data">{{ t('restocking.noData') }}</div>
        </div>
      </div>
    </div>

    <CreateRestockOrderModal
      :is-open="showOrderModal"
      :recommendation="selectedRecommendation"
      @close="showOrderModal = false"
      @order-created="handleOrderCreated"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { formatCurrency } from '../utils/currency'
import CreateRestockOrderModal from '../components/CreateRestockOrderModal.vue'

export default {
  name: 'Restocking',
  components: {
    CreateRestockOrderModal
  },
  setup() {
    const { t, currentCurrency, translateWarehouse } = useI18n()
    const { getCurrentFilters, selectedPeriod, selectedLocation, selectedCategory, selectedStatus } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetCeiling = ref(0)
    const orderedSkus = ref(new Set())

    const showOrderModal = ref(false)
    const selectedRecommendation = ref(null)

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = 'Failed to load restocking recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    // Walks the already priority-sorted list, greedily funding items against the
    // budget ceiling; when an item doesn't fully fit, partially funds what does
    // fit and keeps scanning rest of the list rather than stopping.
    const fundedRecommendations = computed(() => {
      let remaining = budgetCeiling.value > 0 ? budgetCeiling.value : Infinity

      return recommendations.value.map(rec => {
        if (orderedSkus.value.has(rec.sku)) {
          return { ...rec, funded_status: 'ordered', funded_quantity: 0 }
        }

        if (budgetCeiling.value <= 0) {
          return { ...rec, funded_status: 'unfunded', funded_quantity: 0 }
        }

        if (remaining >= rec.estimated_cost) {
          remaining -= rec.estimated_cost
          return { ...rec, funded_status: 'funded', funded_quantity: rec.recommended_quantity }
        }

        const affordableUnits = Math.floor(remaining / rec.unit_cost)
        if (affordableUnits > 0) {
          remaining -= affordableUnits * rec.unit_cost
          return { ...rec, funded_status: 'partial', funded_quantity: affordableUnits }
        }

        return { ...rec, funded_status: 'unfunded', funded_quantity: 0 }
      })
    })

    const itemsFundedCount = computed(() => {
      return fundedRecommendations.value.filter(r => r.funded_status === 'funded' || r.funded_status === 'partial').length
    })

    const totalRecommendedCost = computed(() => {
      return recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    })

    const totalFundedCost = computed(() => {
      return fundedRecommendations.value.reduce((sum, r) => sum + (r.funded_quantity * r.unit_cost), 0)
    })

    const remainingBudget = computed(() => {
      return Math.max(budgetCeiling.value - totalFundedCost.value, 0)
    })

    const camelCase = (snake) => {
      return snake.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    }

    const stockStatusClass = (status) => {
      if (status === 'low_stock') return 'danger'
      if (status === 'adequate') return 'warning'
      return 'success'
    }

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'danger'
      if (trend === 'decreasing') return 'success'
      return 'info'
    }

    const fundedStatusClass = (status) => {
      if (status === 'funded') return 'success'
      if (status === 'partial') return 'warning'
      if (status === 'ordered') return 'info'
      return 'muted'
    }

    const translateCategory = (category) => {
      const categoryMap = {
        'Circuit Boards': t('categories.circuitBoards'),
        'Sensors': t('categories.sensors'),
        'Actuators': t('categories.actuators'),
        'Controllers': t('categories.controllers'),
        'Power Supplies': t('categories.powerSupplies')
      }
      return categoryMap[category] || category
    }

    const openCreateOrder = (rec) => {
      selectedRecommendation.value = fundedRecommendations.value.find(r => r.sku === rec.sku)
      showOrderModal.value = true
    }

    const handleOrderCreated = ({ sku }) => {
      orderedSkus.value.add(sku)
      showOrderModal.value = false
    }

    watch([selectedPeriod, selectedLocation, selectedCategory, selectedStatus], () => {
      loadData()
    })

    onMounted(loadData)

    return {
      t,
      selectedCurrency: currentCurrency,
      loading,
      error,
      recommendations,
      budgetCeiling,
      orderedSkus,
      fundedRecommendations,
      itemsFundedCount,
      totalRecommendedCost,
      totalFundedCost,
      remainingBudget,
      camelCase,
      stockStatusClass,
      trendClass,
      fundedStatusClass,
      translateCategory,
      translateWarehouse,
      formatCurrency,
      showOrderModal,
      selectedRecommendation,
      openCreateOrder,
      handleOrderCreated
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
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
  flex-direction: column;
  gap: 1.25rem;
}

.budget-input-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.budget-input-row label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.budget-input {
  flex: 1;
  max-width: 280px;
  padding: 0.6rem 0.9rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.budget-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.budget-prompt {
  color: #94a3b8;
  font-size: 0.9rem;
  font-style: italic;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f8fafc;
  border-radius: 10px;
  padding: 1.1rem;
  border-left: 4px solid #3b82f6;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.4rem;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.reports-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.reports-table tr:hover {
  background: #f8fafc;
}

.sku-label {
  font-size: 0.78rem;
  color: #94a3b8;
  font-family: 'Monaco', 'Courier New', monospace;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.success {
  background: #dcfce7;
  color: #166534;
}

.badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.badge.muted {
  background: #f1f5f9;
  color: #64748b;
}

.create-order-btn {
  padding: 0.45rem 0.9rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.create-order-btn:hover:not(:disabled) {
  background: #2563eb;
}

.create-order-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

.no-data {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}
</style>
