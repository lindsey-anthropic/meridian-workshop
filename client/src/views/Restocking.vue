<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-section">
      <label for="budget" class="budget-label">{{ t('restocking.budgetLabel') }}</label>
      <input
        id="budget"
        v-model.number="budgetCeiling"
        type="number"
        :placeholder="t('restocking.budgetPlaceholder')"
        class="budget-input"
        min="0"
        step="1000"
      />
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="priority-cards">
        <div class="priority-card urgent-card">
          <div class="priority-header">
            <div class="priority-icon">⚠</div>
            <div>
              <div class="priority-label">{{ t('restocking.urgentPriority') }}</div>
              <div class="priority-count">{{ getRecommendationsByPriority('urgent').length }} items</div>
            </div>
          </div>
          <div class="priority-items">
            <div v-for="item in getRecommendationsByPriority('urgent').slice(0, 5)" :key="item.id" class="priority-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">{{ item.recommended_quantity }} units</span>
            </div>
            <div v-if="getRecommendationsByPriority('urgent').length > 5" class="more-items">
              +{{ getRecommendationsByPriority('urgent').length - 5 }} more
            </div>
          </div>
        </div>

        <div class="priority-card medium-card">
          <div class="priority-header">
            <div class="priority-icon">⚡</div>
            <div>
              <div class="priority-label">{{ t('restocking.mediumPriority') }}</div>
              <div class="priority-count">{{ getRecommendationsByPriority('medium').length }} items</div>
            </div>
          </div>
          <div class="priority-items">
            <div v-for="item in getRecommendationsByPriority('medium').slice(0, 5)" :key="item.id" class="priority-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">{{ item.recommended_quantity }} units</span>
            </div>
            <div v-if="getRecommendationsByPriority('medium').length > 5" class="more-items">
              +{{ getRecommendationsByPriority('medium').length - 5 }} more
            </div>
          </div>
        </div>

        <div class="priority-card low-card">
          <div class="priority-header">
            <div class="priority-icon">ℹ</div>
            <div>
              <div class="priority-label">{{ t('restocking.lowPriority') }}</div>
              <div class="priority-count">{{ getRecommendationsByPriority('low').length }} items</div>
            </div>
          </div>
          <div class="priority-items">
            <div v-for="item in getRecommendationsByPriority('low').slice(0, 5)" :key="item.id" class="priority-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">{{ item.recommended_quantity }} units</span>
            </div>
            <div v-if="getRecommendationsByPriority('low').length > 5" class="more-items">
              +{{ getRecommendationsByPriority('low').length - 5 }} more
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.recommendationsTable') }}</h3>
          <div v-if="budgetCeiling" class="budget-summary">
            Budget: {{ formatCurrency(totalCostWithinBudget) }} / {{ formatCurrency(budgetCeiling) }}
            <span v-if="totalCostWithinBudget > budgetCeiling" class="over-budget"> (Over Budget)</span>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.reorderPoint') }}</th>
                <th>{{ t('restocking.table.forecast') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.totalCost') }}</th>
                <th>{{ t('restocking.table.priority') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in displayedRecommendations"
                :key="rec.id"
                :class="{ 'budget-excluded': budgetCeiling && !isWithinBudget(rec) }"
              >
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.quantity_on_hand }}</td>
                <td>{{ rec.reorder_point }}</td>
                <td><strong>{{ rec.forecasted_demand }}</strong></td>
                <td><strong>{{ rec.recommended_quantity }}</strong></td>
                <td>{{ formatCurrency(rec.unit_cost) }}</td>
                <td><strong>{{ formatCurrency(rec.total_cost) }}</strong></td>
                <td>
                  <span :class="['badge', getPriorityBadgeClass(rec.priority)]">
                    {{ t(`restocking.priorities.${rec.priority}`) }}
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
import { ref, onMounted, watch, computed } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { formatCurrency as formatCurrencyUtil } from '../utils/currency'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency } = useI18n()
    const loading = ref(true)
    const error = ref(null)
    const allRecommendations = ref([])
    const budgetCeiling = ref(null)

    const { getCurrentFilters } = useFilters()

    // Budget filtering
    const displayedRecommendations = computed(() => {
      if (!budgetCeiling.value) return allRecommendations.value

      let runningTotal = 0
      const withinBudget = []
      const overBudget = []

      for (const rec of allRecommendations.value) {
        if (runningTotal + rec.total_cost <= budgetCeiling.value) {
          withinBudget.push(rec)
          runningTotal += rec.total_cost
        } else {
          overBudget.push(rec)
        }
      }

      return [...withinBudget, ...overBudget]
    })

    const totalCostWithinBudget = computed(() => {
      if (!budgetCeiling.value) return 0

      let total = 0
      for (const rec of allRecommendations.value) {
        if (total + rec.total_cost <= budgetCeiling.value) {
          total += rec.total_cost
        } else {
          break
        }
      }
      return total
    })

    const isWithinBudget = (recommendation) => {
      if (!budgetCeiling.value) return true

      let runningTotal = 0
      for (const rec of allRecommendations.value) {
        runningTotal += rec.total_cost
        if (rec.id === recommendation.id) {
          return runningTotal <= budgetCeiling.value
        }
      }
      return false
    }

    const getRecommendationsByPriority = (priority) => {
      return allRecommendations.value.filter(r => r.priority === priority)
    }

    const getPriorityBadgeClass = (priority) => {
      const classes = {
        urgent: 'danger',
        medium: 'warning',
        low: 'info'
      }
      return classes[priority] || 'info'
    }

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        const data = await api.getRestockingRecommendations(filters)
        allRecommendations.value = data
      } catch (err) {
        error.value = t('common.errorLoading')
        console.error('Failed to load restocking recommendations:', err)
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (value) => {
      return formatCurrencyUtil(value, currentCurrency.value)
    }

    onMounted(loadRecommendations)

    // Reload when filters change
    watch(getCurrentFilters, loadRecommendations, { deep: true })

    return {
      t,
      formatCurrency,
      loading,
      error,
      allRecommendations,
      budgetCeiling,
      displayedRecommendations,
      totalCostWithinBudget,
      isWithinBudget,
      getRecommendationsByPriority,
      getPriorityBadgeClass
    }
  }
}
</script>

<style scoped>
.restocking {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #64748b;
  font-size: 0.95rem;
}

.budget-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.budget-label {
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.budget-input {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.budget-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.priority-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.priority-card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid;
}

.urgent-card {
  background: #fef2f2;
  border-color: #fee2e2;
}

.medium-card {
  background: #fffbeb;
  border-color: #fef3c7;
}

.low-card {
  background: #eff6ff;
  border-color: #dbeafe;
}

.priority-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.priority-icon {
  font-size: 2rem;
}

.priority-label {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.95rem;
}

.priority-count {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.priority-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.priority-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.item-name {
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.item-qty {
  color: #64748b;
  font-weight: 600;
  margin-left: 1rem;
}

.more-items {
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  padding: 0.5rem;
}

.budget-summary {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 600;
}

.over-budget {
  color: #ef4444;
}

.budget-excluded {
  opacity: 0.5;
  background-color: #f8fafc;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  color: #ef4444;
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

tr:hover {
  background: #f8fafc;
}
</style>
