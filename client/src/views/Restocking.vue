<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.subtitle') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-group">
        <span class="currency-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
          @keyup.enter="applyBudget"
        />
      </div>
      <button class="apply-btn" @click="applyBudget">{{ t('restocking.apply') }}</button>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Summary stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.stats.itemsAtRisk') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.stats.totalRestockCost') }}</div>
          <div class="stat-value">{{ formatCurrency(totalRestockCost) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.stats.withinBudget') }}</div>
          <div class="stat-value">{{ withinBudgetCount }}</div>
        </div>
        <div class="stat-card" :class="{ 'stat-card-warning': budgetRemaining < 0 }">
          <div class="stat-label">{{ t('restocking.stats.budgetRemaining') }}</div>
          <div class="stat-value">{{ activeBudget > 0 ? formatCurrency(budgetRemaining) : '—' }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div v-if="recommendations.length === 0" class="no-items">
          {{ t('restocking.noItems') }}
        </div>
        <div v-else class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th class="num">{{ t('restocking.table.onHand') }}</th>
                <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
                <th class="num">{{ t('restocking.table.gap') }}</th>
                <th class="num">{{ t('restocking.table.unitCost') }}</th>
                <th class="num">{{ t('restocking.table.restockCost') }}</th>
                <th>{{ t('restocking.table.demandTrend') }}</th>
                <th v-if="activeBudget > 0">{{ t('restocking.table.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.sku"
                :class="{ 'row-over-budget': activeBudget > 0 && !item.within_budget }"
              >
                <td class="sku">{{ item.sku }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.warehouse }}</td>
                <td class="num">{{ item.quantity_on_hand }}</td>
                <td class="num">{{ item.reorder_point }}</td>
                <td class="num gap">{{ item.stock_gap }}</td>
                <td class="num">{{ formatCurrency(item.unit_cost) }}</td>
                <td class="num">{{ formatCurrency(item.restock_cost) }}</td>
                <td>
                  <span :class="trendClass(item.demand_trend)">
                    {{ trendLabel(item.demand_trend) }}
                  </span>
                </td>
                <td v-if="activeBudget > 0">
                  <span :class="item.within_budget ? 'badge success' : 'badge muted'">
                    {{ item.within_budget ? t('restocking.status.withinBudget') : t('restocking.status.overBudget') }}
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
    const { t } = useI18n()
    const { getCurrentFilters, selectedLocation, selectedCategory } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetInput = ref(0)
    const activeBudget = ref(0)

    const totalRestockCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.restock_cost, 0)
    )

    const withinBudgetCount = computed(() =>
      recommendations.value.filter(r => r.within_budget).length
    )

    const budgetRemaining = computed(() => {
      if (!activeBudget.value) return 0
      const used = recommendations.value
        .filter(r => r.within_budget)
        .reduce((sum, r) => sum + r.restock_cost, 0)
      return activeBudget.value - used
    })

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = { ...getCurrentFilters(), budget: activeBudget.value }
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      activeBudget.value = budgetInput.value || 0
      loadData()
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    const formatCurrency = (num) =>
      num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    const trendLabel = (trend) => {
      const map = { increasing: t('restocking.trend.increasing'), stable: t('restocking.trend.stable'), decreasing: t('restocking.trend.decreasing') }
      return map[trend] || t('restocking.trend.unknown')
    }

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'trend trend-up'
      if (trend === 'decreasing') return 'trend trend-down'
      return 'trend trend-stable'
    }

    return {
      t, loading, error,
      recommendations, budgetInput, activeBudget,
      totalRestockCost, withinBudgetCount, budgetRemaining,
      applyBudget, formatCurrency, trendLabel, trendClass
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
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.875rem;
  border-right: 1px solid #e2e8f0;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  width: 180px;
  color: #0f172a;
}

.apply-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.apply-btn:hover { background: #2563eb; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid #3b82f6;
}

.stat-card-warning { border-left-color: #ef4444; }

.stat-label { font-size: 0.875rem; color: #64748b; margin-bottom: 0.4rem; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restocking-table th {
  background: #f8fafc;
  padding: 0.75rem 0.625rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restocking-table th.num,
.restocking-table td.num { text-align: right; }

.restocking-table td {
  padding: 0.75rem 0.625rem;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
}

.restocking-table tr:hover td { background: #f8fafc; }

.row-over-budget td { color: #94a3b8; }

.sku { font-family: monospace; font-size: 0.8rem; color: #3b82f6; }
.gap { font-weight: 700; color: #dc2626; }

.trend { font-size: 0.8rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; }
.trend-up { background: #fee2e2; color: #b91c1c; }
.trend-stable { background: #f1f5f9; color: #475569; }
.trend-down { background: #dcfce7; color: #166534; }

.badge { padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 500; }
.badge.success { background: #dcfce7; color: #166534; }
.badge.muted { background: #f1f5f9; color: #94a3b8; }

.no-items { text-align: center; padding: 3rem; color: #94a3b8; }

.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; }
</style>
