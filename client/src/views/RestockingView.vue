<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.subtitle') }}</p>
    </div>

    <div class="budget-bar card">
      <label class="budget-label" for="budget-input">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrapper">
        <span class="currency-prefix">$</span>
        <input
          id="budget-input"
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('restocking.calculate') }}...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="budgetInput === null || budgetInput === '' || budgetInput === undefined" class="no-budget-prompt">
      {{ t('restocking.noBudget') }}
    </div>
    <div v-else-if="!recommendations.length" class="loading">{{ t('restocking.noData') }}</div>
    <div v-else>
      <!-- Summary cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.budget') }}</div>
          <div class="stat-value">${{ formatCurrency(summary.budget) }}</div>
        </div>
        <div class="stat-card" :class="spendStatusClass">
          <div class="stat-label">{{ t('restocking.summary.totalSpend') }}</div>
          <div class="stat-value">${{ formatCurrency(summary.total_recommended_spend) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.itemsAtRisk') }}</div>
          <div class="stat-value">{{ summary.total_items_at_risk }}</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">{{ t('restocking.summary.itemsCovered') }}</div>
          <div class="stat-value">{{ summary.items_covered }}</div>
        </div>
      </div>

      <!-- Remaining budget callout -->
      <div class="remaining-bar" :class="remainingBarClass">
        <span class="remaining-label">{{ t('restocking.summary.budgetRemaining') }}</span>
        <span class="remaining-value">${{ formatCurrency(summary.budget_remaining) }}</span>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Purchase Order Recommendations</h3>
          <span class="row-count">{{ recommendations.length }} items</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th class="num-col">{{ t('restocking.table.currentStock') }}</th>
                <th class="num-col">{{ t('restocking.table.daysOfStock') }}</th>
                <th class="num-col">{{ t('restocking.table.qtyToOrder') }}</th>
                <th class="num-col">{{ t('restocking.table.unitCost') }}</th>
                <th class="num-col">{{ t('restocking.table.lineTotal') }}</th>
                <th>{{ t('restocking.table.urgency') }}</th>
                <th>{{ t('restocking.table.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku">
                <td><code class="sku">{{ item.sku }}</code></td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.category }}</td>
                <td class="num-col">{{ item.quantity_on_hand.toLocaleString() }}</td>
                <td class="num-col" :class="daysOfStockClass(item.days_of_stock)">
                  {{ item.days_of_stock.toFixed(1) }}d
                </td>
                <td class="num-col">{{ item.quantity_to_order.toLocaleString() }}</td>
                <td class="num-col">${{ formatCurrency(item.unit_cost) }}</td>
                <td class="num-col"><strong>${{ formatCurrency(item.line_total) }}</strong></td>
                <td>
                  <span :class="urgencyBadgeClass(item.urgency)">
                    {{ t('restocking.urgency.' + item.urgency) }}
                  </span>
                </td>
                <td>
                  <span :class="statusBadgeClass(item.budget_status)">
                    {{ t('restocking.status.' + item.budget_status) }}
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
import { useI18n } from '@/composables/useI18n'

export default {
  name: 'RestockingView',
  setup() {
    const { t } = useI18n()
    const { getCurrentFilters, selectedLocation, selectedCategory } = useFilters()

    const loading = ref(false)
    const error = ref(null)
    const recommendations = ref([])
    const summary = ref({
      total_items_at_risk: 0,
      items_covered: 0,
      items_partial: 0,
      items_uncovered: 0,
      total_recommended_spend: 0,
      budget: 0,
      budget_remaining: 0
    })

    const budgetInput = ref(null)

    let debounceTimer = null

    const loadData = async () => {
      if (budgetInput.value === null || budgetInput.value === '' || budgetInput.value === undefined) {
        recommendations.value = []
        return
      }

      loading.value = true
      error.value = null

      try {
        const filters = getCurrentFilters()
        filters.budget = budgetInput.value
        const data = await api.getRestockingRecommendations(filters)
        recommendations.value = data.recommendations || []
        summary.value = data.summary || {}
      } catch (err) {
        error.value = 'Failed to load restocking recommendations'
      } finally {
        loading.value = false
      }
    }

    const debouncedLoad = () => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(loadData, 400)
    }

    watch(budgetInput, debouncedLoad)
    watch([selectedLocation, selectedCategory], loadData)

    onMounted(() => {
      // Don't auto-fetch — wait for budget input
    })

    const formatCurrency = (value) =>
      Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const urgencyBadgeClass = (urgency) => {
      const map = { high: 'badge high', medium: 'badge warning', low: 'badge info' }
      return map[urgency] || 'badge'
    }

    const statusBadgeClass = (status) => {
      const map = { covered: 'badge success', partial: 'badge warning', uncovered: 'badge danger' }
      return map[status] || 'badge'
    }

    const daysOfStockClass = (days) => {
      if (days <= 7) return 'days-critical'
      if (days <= 14) return 'days-warning'
      return ''
    }

    const spendStatusClass = computed(() => {
      if (!summary.value.budget) return ''
      const ratio = summary.value.total_recommended_spend / summary.value.budget
      if (ratio > 1) return 'danger'
      if (ratio > 0.9) return 'warning'
      return ''
    })

    const remainingBarClass = computed(() => {
      if (summary.value.budget_remaining < 0) return 'remaining-bar--negative'
      if (summary.value.budget_remaining === 0) return 'remaining-bar--zero'
      return 'remaining-bar--positive'
    })

    return {
      t,
      loading,
      error,
      budgetInput,
      recommendations,
      summary,
      formatCurrency,
      urgencyBadgeClass,
      statusBadgeClass,
      daysOfStockClass,
      spendStatusClass,
      remainingBarClass
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

/* Budget input bar */
.budget-bar {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.budget-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #475569;
  white-space: nowrap;
}

.budget-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: border-color 0.15s;
}

.budget-input-wrapper:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  border-right: 1px solid #e2e8f0;
  font-size: 0.938rem;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.938rem;
  color: #0f172a;
  width: 180px;
  background: transparent;
}

.budget-input::placeholder {
  color: #94a3b8;
}

/* No budget prompt */
.no-budget-prompt {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

/* Remaining budget bar */
.remaining-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.remaining-bar--positive {
  background: #d1fae5;
  color: #065f46;
}

.remaining-bar--zero {
  background: #fef3c7;
  color: #92400e;
}

.remaining-bar--negative {
  background: #fecaca;
  color: #991b1b;
}

.remaining-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.remaining-value {
  font-size: 1.125rem;
}

/* Table extras */
.row-count {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
}

.num-col {
  text-align: right;
}

.sku {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.813rem;
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  color: #334155;
}

.days-critical {
  color: #dc2626;
  font-weight: 700;
}

.days-warning {
  color: #d97706;
  font-weight: 600;
}
</style>
