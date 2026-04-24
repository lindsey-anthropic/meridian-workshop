<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrapper">
        <span class="currency-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
      <button v-if="budgetInput !== null && budgetInput !== ''" class="clear-budget" @click="budgetInput = null">✕</button>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Summary cards -->
      <div class="stats-grid">
        <div class="stat-card info">
          <div class="stat-label">{{ t('restocking.itemsRecommended') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card" :class="budgetExceeded ? 'danger' : 'warning'">
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="stat-value">{{ formatCurrency(totalCost) }}</div>
        </div>
        <div v-if="hasBudget" class="stat-card" :class="budgetRemaining >= 0 ? 'success' : 'danger'">
          <div class="stat-label">{{ t('restocking.budgetRemaining') }}</div>
          <div class="stat-value">{{ formatCurrency(budgetRemaining) }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ t('restocking.title') }}
            <span v-if="recommendations.length" class="count-badge">{{ recommendations.length }}</span>
          </h3>
        </div>

        <div v-if="recommendations.length === 0" class="empty-state">
          <div class="empty-icon">✓</div>
          <p>{{ hasBudget ? t('restocking.noItemsBudget') : t('restocking.noItems') }}</p>
        </div>

        <div v-else class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.itemName') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th class="text-right">{{ t('restocking.table.stockVsReorder') }}</th>
                <th class="text-right">{{ t('restocking.table.recommendedQty') }}</th>
                <th class="text-right">{{ t('restocking.table.unitCost') }}</th>
                <th class="text-right">{{ t('restocking.table.lineTotal') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku">
                <td><code class="sku">{{ item.sku }}</code></td>
                <td class="item-name">{{ item.item_name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.category }}</td>
                <td class="text-right stock-cell">
                  <span class="stock-current" :class="{ 'stock-critical': item.quantity_on_hand === 0 }">
                    {{ item.quantity_on_hand }}
                  </span>
                  <span class="stock-divider">/</span>
                  <span class="stock-reorder">{{ item.reorder_point }}</span>
                </td>
                <td class="text-right"><strong>{{ item.recommended_qty }}</strong></td>
                <td class="text-right">{{ formatCurrency(item.unit_cost) }}</td>
                <td class="text-right"><strong>{{ formatCurrency(item.line_total) }}</strong></td>
                <td>
                  <span :class="['badge', item.trend]">{{ t(`trends.${item.trend}`) }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="7" class="text-right total-label">Total</td>
                <td class="text-right total-value">{{ formatCurrency(totalCost) }}</td>
                <td></td>
              </tr>
            </tfoot>
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
    const { t } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetInput = ref(null)

    let debounceTimer = null

    const hasBudget = computed(() => budgetInput.value !== null && budgetInput.value !== '' && !isNaN(budgetInput.value))
    const totalCost = computed(() => recommendations.value.reduce((sum, r) => sum + r.line_total, 0))
    const budgetRemaining = computed(() => hasBudget.value ? budgetInput.value - totalCost.value : null)
    const budgetExceeded = computed(() => hasBudget.value && budgetRemaining.value < 0)

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        if (hasBudget.value) filters.budget = budgetInput.value
        recommendations.value = await api.getRestocking(filters)
      } catch (err) {
        error.value = 'Failed to load restocking data: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const debouncedLoad = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(loadData, 400)
    }

    watch([selectedLocation, selectedCategory], loadData)
    watch(budgetInput, debouncedLoad)

    onMounted(loadData)

    const formatCurrency = (num) =>
      (num ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

    return {
      t, loading, error,
      recommendations, budgetInput,
      hasBudget, totalCost, budgetRemaining, budgetExceeded,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.938rem;
  color: #0f172a;
  width: 180px;
}

.budget-input::-webkit-outer-spin-button,
.budget-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.budget-input[type=number] { appearance: textfield; }

.clear-budget {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  transition: color 0.15s;
}
.clear-budget:hover { color: #475569; }

.count-badge {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
  margin-left: 0.5rem;
  vertical-align: middle;
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
}

.text-right { text-align: right; }

.sku {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.813rem;
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  color: #475569;
}

.item-name {
  font-weight: 500;
  color: #0f172a;
  max-width: 220px;
}

.stock-cell {
  white-space: nowrap;
}

.stock-current {
  font-weight: 700;
  color: #dc2626;
}

.stock-current.stock-critical {
  color: #7f1d1d;
}

.stock-divider {
  color: #94a3b8;
  margin: 0 0.25rem;
}

.stock-reorder {
  color: #64748b;
  font-size: 0.813rem;
}

.total-row td {
  border-top: 2px solid #e2e8f0;
  padding-top: 0.75rem;
}

.total-label {
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-icon {
  font-size: 2.5rem;
  color: #4ade80;
  margin-bottom: 0.75rem;
}
</style>
