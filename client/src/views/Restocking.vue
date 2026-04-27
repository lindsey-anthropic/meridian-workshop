<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.subtitle') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrap">
        <span class="currency-symbol">{{ currentCurrency === 'JPY' ? '¥' : '$' }}</span>
        <input
          v-model="budget"
          type="number"
          min="0"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
      <div v-if="active.length > 0" class="budget-summary">
        {{ withinBudget.length }} items · est. {{ formatCurrency(totalCost) }}
        <span v-if="budgetValue < Infinity"> · {{ formatCurrency(remaining) }} remaining</span>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="active.length === 0" class="empty-state">
      {{ t('restocking.noRecommendations') }}
    </div>
    <div v-else class="table-container">
      <table class="restocking-table">
        <thead>
          <tr>
            <th>{{ t('restocking.columns.priority') }}</th>
            <th>{{ t('restocking.columns.sku') }}</th>
            <th>{{ t('restocking.columns.name') }}</th>
            <th>{{ t('restocking.columns.warehouse') }}</th>
            <th>{{ t('restocking.columns.category') }}</th>
            <th class="num">{{ t('restocking.columns.onHand') }}</th>
            <th class="num">{{ t('restocking.columns.reorderPoint') }}</th>
            <th>{{ t('restocking.columns.trend') }}</th>
            <th class="num">{{ t('restocking.columns.qtyToOrder') }}</th>
            <th class="num">{{ t('restocking.columns.estCost') }}</th>
            <th>{{ t('restocking.columns.action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in active"
            :key="item.sku"
            :class="{ 'over-budget': !withinBudgetSet.has(item.sku) && budgetValue < Infinity }"
          >
            <td>
              <span :class="priorityClass(item.priority)">
                {{ t('restocking.priority.' + item.priority) }}
              </span>
            </td>
            <td class="mono">{{ item.sku }}</td>
            <td>{{ item.name }}</td>
            <td>{{ translateWarehouse(item.warehouse) }}</td>
            <td>{{ item.category }}</td>
            <td class="num">{{ item.quantity_on_hand }}</td>
            <td class="num">{{ item.reorder_point }}</td>
            <td>
              <span :class="trendClass(item.trend)">
                {{ t('restocking.trend.' + item.trend) }}
              </span>
            </td>
            <td class="num">{{ item.quantity_to_order }}</td>
            <td class="num">{{ formatCurrency(item.estimated_cost) }}</td>
            <td>
              <button class="dismiss-btn" @click="dismiss(item.sku)">
                {{ t('restocking.dismiss') }}
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="footer-row">
            <td colspan="9" class="footer-label">
              {{ t('restocking.footer.withinBudget', { count: withinBudget.length }) }}
            </td>
            <td class="num footer-total">{{ formatCurrency(totalCost) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
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
    const { t, currentCurrency, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budget = ref('')
    const dismissed = ref(new Set())

    const budgetValue = computed(() => {
      const v = parseFloat(budget.value)
      return isNaN(v) || v <= 0 ? Infinity : v
    })

    const active = computed(() =>
      recommendations.value.filter(r => !dismissed.value.has(r.sku))
    )

    const withinBudget = computed(() => {
      if (budgetValue.value === Infinity) return active.value
      let running = 0
      return active.value.filter(r => {
        if (running + r.estimated_cost <= budgetValue.value) {
          running += r.estimated_cost
          return true
        }
        return false
      })
    })

    const withinBudgetSet = computed(() => new Set(withinBudget.value.map(r => r.sku)))

    const totalCost = computed(() =>
      withinBudget.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const remaining = computed(() => budgetValue.value - totalCost.value)

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        dismissed.value = new Set()
        recommendations.value = await api.getRestockingRecommendations(getCurrentFilters())
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    const dismiss = (sku) => {
      dismissed.value = new Set([...dismissed.value, sku])
    }

    const formatCurrency = (num) => {
      const locale = currentCurrency.value === 'JPY' ? 'ja-JP' : 'en-US'
      return num.toLocaleString(locale, { style: 'currency', currency: currentCurrency.value, maximumFractionDigits: 0 })
    }

    const priorityClass = (priority) => {
      return { critical: 'badge danger', high: 'badge warning', medium: 'badge info' }[priority] || 'badge'
    }

    const trendClass = (trend) => {
      return trend === 'increasing' ? 'badge danger' : trend === 'decreasing' ? 'badge success' : 'badge neutral'
    }

    return {
      t, currentCurrency, translateWarehouse,
      loading, error, budget,
      active, withinBudget, withinBudgetSet,
      totalCost, remaining, budgetValue,
      dismiss, formatCurrency, priorityClass, trendClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-cell);
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  overflow: hidden;
}

.currency-symbol {
  padding: 0.4rem 0.625rem;
  background: var(--bg-muted);
  color: var(--text-muted);
  font-size: 0.875rem;
  border-right: 1px solid var(--border-strong);
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  width: 160px;
  background: var(--bg-surface);
  color: var(--text-primary);
  font-family: inherit;
}

.budget-summary {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-left: auto;
}

.table-container { overflow-x: auto; }

.restocking-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-surface);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.restocking-table th {
  background: var(--bg-muted);
  padding: 0.625rem 0.875rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-th);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.restocking-table th.num,
.restocking-table td.num { text-align: right; }

.restocking-table td {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.875rem;
  color: var(--text-cell);
  vertical-align: middle;
}

.restocking-table tr:last-child td { border-bottom: none; }
.restocking-table tr:hover td { background: var(--bg-hover); }
.restocking-table tr.over-budget td { opacity: 0.35; }

.mono { font-family: 'Consolas', monospace; font-size: 0.8rem; color: var(--text-muted); }

tfoot .footer-row td {
  padding: 0.625rem 0.875rem;
  background: var(--bg-muted);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-cell);
  border-top: 1px solid var(--border);
}

.footer-total { color: var(--text-primary); font-size: 1rem; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge.danger  { background: var(--badge-danger-bg);  color: var(--badge-danger-text); }
.badge.warning { background: var(--badge-warning-bg); color: var(--badge-warning-text); }
.badge.info    { background: var(--badge-info-bg);    color: var(--badge-info-text); }
.badge.success { background: var(--badge-success-bg); color: var(--badge-success-text); }
.badge.neutral { background: var(--badge-neutral-bg); color: var(--badge-neutral-text); }

.dismiss-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}
.dismiss-btn:hover {
  background: var(--badge-danger-bg);
  color: var(--badge-danger-text);
  border-color: var(--badge-danger-bg);
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  background: var(--bg-surface);
  border-radius: 10px;
  border: 1px solid var(--border);
}

.error {
  background: var(--badge-danger-bg);
  color: var(--badge-danger-text);
  padding: 1rem;
  border-radius: 8px;
}
</style>
