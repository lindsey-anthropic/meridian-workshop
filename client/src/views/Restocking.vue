<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-row">
      <label class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <div class="budget-input-wrap">
        <span class="budget-prefix">$</span>
        <input
          v-model.number="budget"
          type="number"
          min="0"
          step="500"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
      <button class="btn-primary" @click="loadData" :disabled="loading">
        {{ t('restocking.getRecommendations') }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card info">
          <div class="stat-label">{{ t('restocking.stats.recommendations') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card" :class="totalCost > 0 ? 'warning' : ''">
          <div class="stat-label">{{ t('restocking.stats.totalCost') }}</div>
          <div class="stat-value">${{ formatNumber(totalCost) }}</div>
        </div>
        <div class="stat-card" :class="criticalCount > 0 ? 'danger' : 'success'">
          <div class="stat-label">{{ t('restocking.stats.criticalItems') }}</div>
          <div class="stat-value">{{ criticalCount }}</div>
        </div>
      </div>

      <div v-if="recommendations.length === 0" class="empty-state">
        {{ t('restocking.noRecommendations') }}
      </div>

      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }}</h3>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th class="num">{{ t('restocking.table.onHand') }}</th>
                <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
                <th class="num">{{ t('restocking.table.recommendedQty') }}</th>
                <th class="num">{{ t('restocking.table.unitCost') }}</th>
                <th class="num">{{ t('restocking.table.totalCost') }}</th>
                <th>{{ t('restocking.table.reason') }}</th>
                <th>{{ t('restocking.table.priority') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rec, index) in recommendations" :key="index">
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.warehouse }}</td>
                <td>{{ rec.category }}</td>
                <td class="num">{{ rec.quantity_on_hand }}</td>
                <td class="num">{{ rec.reorder_point }}</td>
                <td class="num"><strong>{{ rec.recommended_qty }}</strong></td>
                <td class="num">${{ rec.unit_cost.toFixed(2) }}</td>
                <td class="num"><strong>${{ formatNumber(rec.total_cost) }}</strong></td>
                <td><span :class="['badge', getReasonClass(rec.reason)]">{{ getReasonLabel(rec.reason) }}</span></td>
                <td><span :class="['badge', rec.priority]">{{ t(`priority.${rec.priority}`) }}</span></td>
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
import { useI18n } from '../composables/useI18n'
import { useFilters } from '../composables/useFilters'

export default {
  name: 'Restocking',
  setup() {
    const { t } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(false)
    const error = ref(null)
    const budget = ref(0)
    const recommendations = ref([])

    const totalCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.total_cost, 0)
    )

    const criticalCount = computed(() =>
      recommendations.value.filter(r => r.priority === 'high').length
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        recommendations.value = await api.getRestockingRecommendations(budget.value, filters)
      } catch (err) {
        error.value = t('common.error') + ': ' + err.message
      } finally {
        loading.value = false
      }
    }

    const formatNumber = (num) => {
      const n = Number(num)
      if (isNaN(n)) return '0.00'
      return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const getReasonClass = (reason) => {
      if (reason === 'backlog') return 'danger'
      if (reason === 'low_stock+demand') return 'warning'
      return 'info'
    }

    const getReasonLabel = (reason) => {
      if (reason === 'backlog') return t('restocking.reasons.backlog')
      if (reason === 'low_stock+demand') return t('restocking.reasons.lowStockDemand')
      return t('restocking.reasons.lowStock')
    }

    watch([selectedLocation, selectedCategory], () => {
      loadData()
    })

    onMounted(() => {
      loadData()
    })

    return {
      t,
      loading,
      error,
      budget,
      recommendations,
      totalCost,
      criticalCount,
      loadData,
      formatNumber,
      getReasonClass,
      getReasonLabel
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.budget-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  background: #f8fafc;
}

.budget-prefix {
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
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
  background: transparent;
  width: 180px;
  color: #0f172a;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-primary:hover { background: #1d4ed8; }
.btn-primary:disabled { background: #94a3b8; cursor: default; }

.restocking-table {
  width: 100%;
  border-collapse: collapse;
}

.restocking-table th {
  background: #f8fafc;
  padding: 0.625rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restocking-table th.num,
.restocking-table td.num {
  text-align: right;
}

.restocking-table td {
  padding: 0.625rem 0.75rem;
  border-top: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.875rem;
}

.restocking-table tbody tr:hover {
  background: #f8fafc;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 0.938rem;
}
</style>
