<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget card -->
    <div class="budget-card">
      <div class="budget-input-group">
        <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
        <div class="budget-input-wrap">
          <span class="currency-prefix">$</span>
          <input
            v-model.number="budget"
            type="number"
            min="0"
            step="1000"
            class="budget-input"
          />
        </div>
      </div>
      <div class="budget-stats">
        <div class="budget-stat">
          <div class="budget-stat-label">{{ t('restocking.withinBudget') }}</div>
          <div class="budget-stat-value">{{ withinBudget.length }} items</div>
        </div>
        <div class="budget-stat">
          <div class="budget-stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="budget-stat-value" :class="{ 'over': totalCost > budget }">
            {{ formatCurrency(totalCost) }}
          </div>
        </div>
        <div class="budget-stat">
          <div class="budget-stat-label">{{ t('restocking.remaining') }}</div>
          <div class="budget-stat-value" :class="remaining < 0 ? 'over' : 'under'">
            {{ formatCurrency(remaining) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!recommendations.length" class="empty">
      {{ t('restocking.noRecommendations') }}
    </div>
    <div v-else>
      <!-- Within budget -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.withinBudget') }}</h3>
          <span class="count-badge">{{ withinBudget.length }}</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.forecasted') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.lineCost') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.urgency') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in withinBudget" :key="item.sku + item.warehouse">
                <td class="sku">{{ item.sku }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td :class="item.quantity_on_hand === 0 ? 'qty-zero' : ''">{{ item.quantity_on_hand }}</td>
                <td>{{ item.reorder_point }}</td>
                <td>{{ item.forecasted_demand }}</td>
                <td class="qty-recommended">{{ item.recommended_qty }}</td>
                <td>{{ formatCurrency(item.unit_cost) }}</td>
                <td class="line-cost">{{ formatCurrency(item.line_cost) }}</td>
                <td><span :class="['badge', item.trend]">{{ t('trends.' + item.trend) }}</span></td>
                <td><span :class="['badge', item.urgency]">{{ t('restocking.urgency.' + item.urgency) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Over budget -->
      <div v-if="overBudget.length" class="card over-budget-card">
        <div class="card-header">
          <h3 class="card-title muted">{{ t('restocking.overBudget') }}</h3>
          <span class="count-badge muted">{{ overBudget.length }}</span>
        </div>
        <div class="table-container">
          <table class="muted-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.lineCost') }}</th>
                <th>{{ t('restocking.table.urgency') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in overBudget" :key="item.sku + item.warehouse">
                <td class="sku">{{ item.sku }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>{{ item.recommended_qty }}</td>
                <td>{{ formatCurrency(item.line_cost) }}</td>
                <td><span :class="['badge', item.urgency]">{{ t('restocking.urgency.' + item.urgency) }}</span></td>
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
    const { t } = useI18n()
    const { selectedPeriod, selectedLocation, selectedCategory, selectedStatus, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budget = ref(50000)

    const withinBudget = computed(() => {
      let running = 0
      return recommendations.value.filter(item => {
        if (running + item.line_cost <= budget.value) {
          running += item.line_cost
          return true
        }
        return false
      })
    })

    const overBudget = computed(() =>
      recommendations.value.filter(item => !withinBudget.value.includes(item))
    )

    const totalCost = computed(() =>
      withinBudget.value.reduce((sum, item) => sum + item.line_cost, 0)
    )

    const remaining = computed(() => budget.value - totalCost.value)

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = t('common.error') + ': ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedPeriod, selectedLocation, selectedCategory, selectedStatus], () => {
      loadData()
    })

    onMounted(loadData)

    const formatCurrency = (num) =>
      Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    return {
      t,
      loading,
      error,
      recommendations,
      budget,
      withinBudget,
      overBudget,
      totalCost,
      remaining,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-card {
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
}

.currency-prefix {
  padding: 0.4rem 0.6rem;
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  font-size: 0.875rem;
  color: #64748b;
}

.budget-input {
  padding: 0.4rem 0.75rem;
  border: none;
  outline: none;
  font-size: 0.938rem;
  font-weight: 600;
  color: #0f172a;
  width: 140px;
}

.budget-stats {
  display: flex;
  gap: 2.5rem;
}

.budget-stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.budget-stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.budget-stat-value.over { color: #dc2626; }
.budget-stat-value.under { color: #16a34a; }

.sku { font-family: monospace; font-size: 0.8rem; color: #64748b; }
.qty-zero { color: #dc2626; font-weight: 700; }
.qty-recommended { font-weight: 700; color: #0f172a; }
.line-cost { font-weight: 600; }

.count-badge {
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.count-badge.muted {
  background: #f1f5f9;
  color: #94a3b8;
}

.over-budget-card { opacity: 0.6; }
.card-title.muted { color: #94a3b8; }
.muted-table td, .muted-table th { color: #94a3b8; }

.badge.increasing { background: #d1fae5; color: #065f46; }
.badge.stable     { background: #e0e7ff; color: #3730a3; }
.badge.decreasing { background: #fecaca; color: #991b1b; }
.badge.critical   { background: #fecaca; color: #991b1b; }
.badge.low        { background: #dbeafe; color: #1e40af; }

.empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
</style>
