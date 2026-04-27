<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-group">
        <span class="budget-prefix">$</span>
        <input
          v-model.number="budgetInput"
          type="number"
          min="0"
          step="1000"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
          @keyup.enter="applyBudget"
        />
        <button class="btn-apply" @click="applyBudget">{{ t('restocking.applyBudget') }}</button>
        <button v-if="activeBudget" class="btn-clear" @click="clearBudget">{{ t('restocking.clearBudget') }}</button>
      </div>
      <span v-if="activeBudget" class="budget-active">
        Budget: ${{ activeBudget.toLocaleString() }}
      </span>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!recommendations.length" class="empty">
      {{ t('restocking.noRecommendations') }}
    </div>
    <div v-else>
      <!-- Summary stats -->
      <div class="stats-grid">
        <div class="stat-card danger">
          <div class="stat-label">{{ t('restocking.totalItems') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">{{ t('restocking.totalCost') }}</div>
          <div class="stat-value">${{ totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}</div>
        </div>
        <div class="stat-card" :class="activeBudget ? 'info' : ''">
          <div class="stat-label">{{ t('restocking.budgetRemaining') }}</div>
          <div class="stat-value">
            {{ activeBudget ? '$' + budgetRemaining.toLocaleString(undefined, { maximumFractionDigits: 0 }) : t('restocking.noBudgetSet') }}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.urgency.critical') }}</div>
          <div class="stat-value" style="color:#dc2626">{{ criticalCount }}</div>
        </div>
      </div>

      <!-- Recommendations table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ activeBudget ? t('restocking.withinBudget') : t('restocking.allRecommendations') }}
            ({{ recommendations.length }})
          </h3>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.urgency') }}</th>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.demandTrend') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku + item.warehouse">
                <td>
                  <span :class="['badge', urgencyClass(item.urgency)]">
                    {{ t(`restocking.urgency.${item.urgency}`) }}
                  </span>
                </td>
                <td><strong>{{ item.sku }}</strong></td>
                <td>{{ item.name }}</td>
                <td>{{ item.warehouse }}</td>
                <td>
                  <span :class="item.current_stock === 0 ? 'out-of-stock' : ''">
                    {{ item.current_stock.toLocaleString() }}
                  </span>
                </td>
                <td>{{ item.reorder_point.toLocaleString() }}</td>
                <td><strong>{{ item.recommended_qty.toLocaleString() }}</strong></td>
                <td>${{ item.unit_cost.toFixed(2) }}</td>
                <td><strong>${{ item.estimated_cost.toLocaleString() }}</strong></td>
                <td>
                  <span v-if="item.demand_trend" :class="['badge', trendClass(item.demand_trend)]">
                    {{ item.demand_trend }}
                  </span>
                  <span v-else class="muted">—</span>
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
    const { getCurrentFilters } = useFilters()

    const loading = ref(false)
    const error = ref(null)
    const recommendations = ref([])
    const budgetInput = ref(null)
    const activeBudget = ref(null)

    const totalCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )
    const budgetRemaining = computed(() =>
      activeBudget.value ? activeBudget.value - totalCost.value : 0
    )
    const criticalCount = computed(() =>
      recommendations.value.filter(r => r.urgency === 'critical').length
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = { ...getCurrentFilters() }
        if (activeBudget.value) filters.budget = activeBudget.value
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = t('common.error') + ': ' + err.message
      } finally {
        loading.value = false
      }
    }

    const applyBudget = () => {
      activeBudget.value = budgetInput.value && budgetInput.value > 0 ? budgetInput.value : null
      loadData()
    }

    const clearBudget = () => {
      activeBudget.value = null
      budgetInput.value = null
      loadData()
    }

    const urgencyClass = (urgency) => {
      if (urgency === 'critical') return 'danger'
      if (urgency === 'high') return 'warning'
      return 'info'
    }

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'increasing'
      if (trend === 'decreasing') return 'decreasing'
      return 'stable'
    }

    watch(getCurrentFilters, loadData, { deep: true })
    onMounted(loadData)

    return {
      t, loading, error, recommendations,
      budgetInput, activeBudget,
      totalCost, budgetRemaining, criticalCount,
      applyBudget, clearBudget, urgencyClass, trendClass
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.budget-prefix {
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
}

.budget-input {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  width: 180px;
  outline: none;
  transition: border-color 0.15s;
}

.budget-input:focus { border-color: #2563eb; }

.btn-apply {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-apply:hover { background: #1d4ed8; }

.btn-clear {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-clear:hover { border-color: #94a3b8; color: #334155; }

.budget-active {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 99px;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.out-of-stock {
  color: #dc2626;
  font-weight: 700;
}

.muted { color: #94a3b8; }
</style>
