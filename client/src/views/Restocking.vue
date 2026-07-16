<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('restocking.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Controls -->
      <div class="card">
        <div class="controls-grid">
          <div class="control-field">
            <label for="budget-input">{{ t('restocking.budget.label') }}</label>
            <input
              id="budget-input"
              v-model.number="budget"
              type="number"
              min="0"
              step="0.01"
              :placeholder="t('restocking.budget.placeholder')"
              class="control-input"
            />
          </div>
          <div class="control-field">
            <label for="supplier-input">{{ t('restocking.supplier.label') }}</label>
            <input
              id="supplier-input"
              v-model="supplierName"
              type="text"
              :placeholder="t('restocking.supplier.placeholder')"
              class="control-input"
            />
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-stat">
            <div class="summary-label">{{ t('restocking.summary.itemsSelected') }}</div>
            <div class="summary-value">{{ selectedItems.length }}</div>
          </div>
          <div class="summary-stat">
            <div class="summary-label">{{ t('restocking.summary.totalEstimatedCost') }}</div>
            <div class="summary-value">{{ formatCurrency(totalEstimatedCost) }}</div>
          </div>
          <div class="summary-stat">
            <div class="summary-label">{{ t('restocking.summary.remainingBudget') }}</div>
            <div class="summary-value" :class="{ 'negative-value': remainingBudget < 0 }">
              {{ formatCurrency(remainingBudget) }}
            </div>
          </div>
        </div>

        <div class="action-row">
          <button
            class="create-btn"
            :disabled="creating || selectedItems.length === 0"
            @click="createPurchaseOrders"
          >
            {{ creating ? t('restocking.actions.creating') : t('restocking.actions.createPurchaseOrders') }}
          </button>
          <span v-if="createResult" :class="['create-result', createResult.success ? 'success-text' : 'error-text']">
            {{ createResult.message }}
          </span>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }} ({{ recommendations.length }})</h3>
        </div>
        <div v-if="recommendations.length === 0" class="empty-state">
          {{ t('restocking.noRecommendations') }}
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.select') }}</th>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.itemName') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.quantityOnHand') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.shortfall') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.recommendedQuantity') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku">
                <td>
                  <input
                    type="checkbox"
                    :checked="isSelected(item)"
                    @change="toggleSelection(item)"
                  />
                </td>
                <td><strong>{{ item.sku }}</strong></td>
                <td>{{ translateProductName(item.item_name) }}</td>
                <td>{{ translateWarehouse(item.warehouse) }}</td>
                <td>{{ translateCategory(item.category) }}</td>
                <td>{{ item.quantity_on_hand }}</td>
                <td>{{ item.reorder_point }}</td>
                <td><strong>{{ item.shortfall }}</strong></td>
                <td>
                  <span :class="['badge', item.trend]">
                    {{ t('trends.' + item.trend) }}
                  </span>
                </td>
                <td>{{ item.recommended_quantity }}</td>
                <td>{{ formatCurrency(item.unit_cost) }}</td>
                <td>{{ formatCurrency(item.estimated_cost) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Purchase orders list -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.poList.title') }} ({{ purchaseOrders.length }})</h3>
        </div>
        <div v-if="purchaseOrders.length === 0" class="empty-state">
          {{ t('restocking.poList.empty') }}
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.poList.id') }}</th>
                <th>{{ t('restocking.poList.sku') }}</th>
                <th>{{ t('restocking.poList.supplier') }}</th>
                <th>{{ t('restocking.poList.quantity') }}</th>
                <th>{{ t('restocking.poList.unitCost') }}</th>
                <th>{{ t('restocking.poList.expectedDelivery') }}</th>
                <th>{{ t('restocking.poList.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="po in purchaseOrders" :key="po.id">
                <td><strong>{{ po.id }}</strong></td>
                <td>{{ po.item_sku }}</td>
                <td>{{ po.supplier_name }}</td>
                <td>{{ po.quantity }}</td>
                <td>{{ formatCurrency(po.unit_cost) }}</td>
                <td>{{ po.expected_delivery_date }}</td>
                <td>
                  <span class="badge warning">{{ po.status }}</span>
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
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { formatCurrencyWithDecimals } from '../utils/currency'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, translateProductName, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const purchaseOrders = ref([])

    const budget = ref(0)
    const supplierName = ref('')

    // Map of sku -> boolean for rows the operator has manually toggled.
    // These rows stop following automatic greedy recomputation on budget changes.
    const manualOverrides = ref({})

    const creating = ref(false)
    const createResult = ref(null)

    const formatCurrency = (amount) => formatCurrencyWithDecimals(amount, currentCurrency.value, 2)

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

    // Pure client-side greedy selection over the already-fetched recommendations,
    // which arrive pre-sorted by priority_score descending. Adjusting the budget
    // never triggers a network request - this is purely derived state.
    const greedySelectedSkus = computed(() => {
      const selected = new Set()
      let remaining = budget.value || 0
      for (const item of recommendations.value) {
        if (item.estimated_cost <= remaining) {
          selected.add(item.sku)
          remaining -= item.estimated_cost
        }
      }
      return selected
    })

    const isSelected = (item) => {
      if (Object.prototype.hasOwnProperty.call(manualOverrides.value, item.sku)) {
        return manualOverrides.value[item.sku]
      }
      return greedySelectedSkus.value.has(item.sku)
    }

    const toggleSelection = (item) => {
      const newValue = !isSelected(item)
      manualOverrides.value = { ...manualOverrides.value, [item.sku]: newValue }
    }

    const selectedItems = computed(() => recommendations.value.filter(isSelected))

    const totalEstimatedCost = computed(() =>
      selectedItems.value.reduce((sum, item) => sum + item.estimated_cost, 0)
    )

    const remainingBudget = computed(() => (budget.value || 0) - totalEstimatedCost.value)

    const loadRecommendations = async () => {
      const filters = getCurrentFilters()
      // Restocking only supports warehouse/category filters, same as Inventory
      recommendations.value = await api.getRestockingRecommendations({
        warehouse: filters.warehouse,
        category: filters.category
      })
      // Reset manual overrides whenever the underlying recommendation set changes
      manualOverrides.value = {}
    }

    const loadPurchaseOrders = async () => {
      purchaseOrders.value = await api.getPurchaseOrders()
    }

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        await Promise.all([loadRecommendations(), loadPurchaseOrders()])
      } catch (err) {
        error.value = t('restocking.loadError', { message: err.message })
      } finally {
        loading.value = false
      }
    }

    const createPurchaseOrders = async () => {
      if (selectedItems.value.length === 0) return

      creating.value = true
      createResult.value = null

      try {
        const deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + 14)
        const expectedDeliveryDate = deliveryDate.toISOString().split('T')[0]
        const supplier = supplierName.value.trim() || 'Default Supplier'

        let count = 0
        for (const item of selectedItems.value) {
          await api.createPurchaseOrder({
            item_sku: item.sku,
            supplier_name: supplier,
            quantity: item.recommended_quantity,
            unit_cost: item.unit_cost,
            expected_delivery_date: expectedDeliveryDate,
            notes: `Auto-generated from restocking recommendations (priority score ${item.priority_score})`
          })
          count++
        }

        createResult.value = { success: true, message: t('restocking.createSuccess', { count }) }
        await loadData()
      } catch (err) {
        createResult.value = { success: false, message: t('restocking.createError', { message: err.message }) }
      } finally {
        creating.value = false
      }
    }

    watch([selectedLocation, selectedCategory], () => {
      loadData()
    })

    onMounted(loadData)

    return {
      t,
      loading,
      error,
      recommendations,
      purchaseOrders,
      budget,
      supplierName,
      creating,
      createResult,
      selectedItems,
      totalEstimatedCost,
      remainingBudget,
      isSelected,
      toggleSelection,
      createPurchaseOrders,
      formatCurrency,
      translateCategory,
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

.page-header h2 {
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.error {
  color: #ef4444;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.938rem;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.control-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.control-field label {
  font-size: 0.813rem;
  font-weight: 600;
  color: #475569;
}

.control-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
}

.control-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-value.negative-value {
  color: #dc2626;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.create-btn {
  padding: 0.625rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.create-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.create-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.create-result {
  font-size: 0.875rem;
  font-weight: 500;
}

.success-text {
  color: #16a34a;
}

.error-text {
  color: #dc2626;
}

.badge.unknown {
  background: #f1f5f9;
  color: #475569;
}
</style>
