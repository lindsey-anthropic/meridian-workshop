<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-form">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-row">
        <span class="currency-prefix">{{ currencySymbol }}</span>
        <input
          v-model.number="budget"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
          @keyup.enter="loadRecommendations"
        />
        <button class="btn-primary" :disabled="!budget || loading" @click="loadRecommendations">
          {{ loading ? t('common.loading') : t('restocking.getRecommendations') }}
        </button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="hasResults">
      <!-- Summary bar -->
      <div class="summary-bar">
        <div class="summary-item">
          <span class="summary-number">{{ recommendations.length }}</span>
          <span class="summary-label">{{ t('restocking.summary.items') }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-number">{{ formatCurrency(totalCost) }}</span>
          <span class="summary-label">{{ t('restocking.summary.totalCost') }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-number highlight">{{ formatCurrency(remainingBudget) }}</span>
          <span class="summary-label">{{ t('restocking.summary.remaining') }}</span>
        </div>
        <div class="budget-bar-container">
          <div class="budget-bar" :style="{ width: budgetUsedPct + '%' }"></div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.rank') }}</th>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.daysLeft') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.justification') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in recommendations" :key="item.sku + item.warehouse">
                <td class="rank">{{ index + 1 }}</td>
                <td><code>{{ item.sku }}</code></td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.current_stock.toLocaleString() }}</td>
                <td>
                  <span :class="urgencyClass(item.days_of_stock)">
                    {{ urgencyLabel(item.days_of_stock) }} · {{ item.days_of_stock }}d
                  </span>
                </td>
                <td><strong>{{ item.recommended_qty.toLocaleString() }}</strong></td>
                <td>{{ formatCurrency(item.estimated_cost) }}</td>
                <td>
                  <span :class="trendClass(item.trend)">{{ item.trend }}</span>
                </td>
                <td class="justification">{{ item.justification }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else-if="searched && !loading" class="empty-state">
      {{ t('restocking.noRecommendations') }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentLocale, currentCurrency } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const budget = ref(null)
    const recommendations = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searched = ref(false)

    const hasResults = computed(() => recommendations.value.length > 0)
    const totalCost = computed(() => recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0))
    const remainingBudget = computed(() => (budget.value || 0) - totalCost.value)
    const budgetUsedPct = computed(() => budget.value ? Math.min(100, (totalCost.value / budget.value) * 100) : 0)

    const currencySymbol = computed(() => currentCurrency.value === 'JPY' ? '¥' : '$')

    const loadRecommendations = async () => {
      if (!budget.value) return
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations(budget.value, filters)
        searched.value = true
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (value) => {
      const locale = currentLocale.value === 'ja' ? 'ja-JP' : 'en-US'
      return value.toLocaleString(locale, { style: 'currency', currency: currentCurrency.value, maximumFractionDigits: 0 })
    }

    const urgencyClass = (days) => {
      if (days < 7) return 'badge danger'
      if (days < 14) return 'badge warning'
      return 'badge success'
    }

    const urgencyLabel = (days) => {
      if (days < 7) return t('restocking.urgency.critical')
      if (days < 14) return t('restocking.urgency.urgent')
      return t('restocking.urgency.ok')
    }

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'trend-up'
      if (trend === 'decreasing') return 'trend-down'
      return 'trend-stable'
    }

    return {
      t, budget, recommendations, loading, error, searched,
      hasResults, totalCost, remainingBudget, budgetUsedPct, currencySymbol,
      loadRecommendations, formatCurrency, urgencyClass, urgencyLabel, trendClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.budget-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.currency-prefix {
  font-size: 1.25rem;
  font-weight: 600;
  color: #64748b;
}

.budget-input {
  width: 220px;
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s;
}
.budget-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

.btn-primary {
  padding: 0.6rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.summary-bar {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}
.summary-number.highlight { color: #16a34a; }

.summary-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.budget-bar-container {
  flex: 1;
  min-width: 120px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.budget-bar {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.restocking-table th {
  background: #f8fafc;
  padding: 0.65rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restocking-table td {
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.restocking-table tr:hover { background: #f8fafc; }

.rank { color: #94a3b8; font-weight: 600; width: 32px; }

code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #475569;
}

.justification { color: #64748b; font-size: 0.82rem; max-width: 260px; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge.danger  { background: #fee2e2; color: #991b1b; }
.badge.warning { background: #fef3c7; color: #92400e; }
.badge.success { background: #dcfce7; color: #166534; }

.trend-up     { color: #dc2626; font-weight: 600; }
.trend-down   { color: #16a34a; font-weight: 600; }
.trend-stable { color: #64748b; }

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
