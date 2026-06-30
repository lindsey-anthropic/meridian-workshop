<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('nav.restocking') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget Input -->
    <div class="card budget-card">
      <div class="budget-row">
        <label class="budget-label" for="budget-input">{{ t('restocking.budgetLabel') }}</label>
        <div class="budget-input-group">
          <span class="currency-symbol">$</span>
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
        <button class="btn-calculate" @click="loadData" :disabled="loading">
          {{ loading ? t('common.loading') : t('restocking.calculate') }}
        </button>
        <button v-if="budgetInput" class="btn-clear" @click="clearBudget">
          {{ t('restocking.clearBudget') }}
        </button>
      </div>
      <p class="budget-hint">{{ t('restocking.budgetHint') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="loaded">

      <!-- Summary -->
      <div class="stats-grid" v-if="recommendations.length">
        <div class="stat-card danger">
          <div class="stat-label">{{ t('restocking.summary.criticalItems') }}</div>
          <div class="stat-value">{{ criticalCount }}</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">{{ t('restocking.summary.totalItems') }}</div>
          <div class="stat-value">{{ recommendations.length }}</div>
        </div>
        <div class="stat-card info">
          <div class="stat-label">{{ t('restocking.summary.totalCost') }}</div>
          <div class="stat-value">{{ formatCurrency(totalCost) }}</div>
        </div>
        <div class="stat-card" v-if="budgetInput > 0">
          <div class="stat-label">{{ t('restocking.summary.budgetRemaining') }}</div>
          <div class="stat-value" :class="budgetRemaining < 0 ? 'danger' : ''">
            {{ formatCurrency(budgetRemaining) }}
          </div>
        </div>
      </div>

      <!-- Recommendations Table -->
      <div class="card" v-if="recommendations.length">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.tableTitle') }}</h3>
          <span class="result-count">{{ recommendations.length }} {{ t('common.items') }}</span>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.item') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.reorderPt') }}</th>
                <th>{{ t('restocking.table.trend') }}</th>
                <th>{{ t('restocking.table.recQty') }}</th>
                <th>{{ t('restocking.table.estCost') }}</th>
                <th>{{ t('restocking.table.urgency') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.sku">
                <td><code>{{ item.sku }}</code></td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>{{ translateWarehouse(item.warehouse) }}</td>
                <td :class="item.quantity_on_hand < item.reorder_point ? 'text-danger' : ''">
                  {{ item.quantity_on_hand }}
                </td>
                <td>{{ item.reorder_point }}</td>
                <td>
                  <span v-if="item.trend !== 'N/A'" :class="['badge', item.trend]">
                    {{ t(`trends.${item.trend}`) }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td><strong>{{ item.recommended_qty }}</strong></td>
                <td>{{ formatCurrency(item.estimated_cost) }}</td>
                <td>
                  <span :class="urgencyBadgeClass(item.urgency)">
                    {{ t(`restocking.urgency.${item.urgency.toLowerCase()}`) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state card">
        <div class="empty-icon">✅</div>
        <h3>{{ t('restocking.empty.title') }}</h3>
        <p>{{ t('restocking.empty.description') }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

const { getCurrentFilters, selectedLocation, selectedCategory } = useFilters()
const { t, currentCurrency, translateWarehouse } = useI18n()

const budgetInput = ref(null)
const loading = ref(false)
const error = ref(null)
const loaded = ref(false)
const recommendations = ref([])

const totalCost = computed(() =>
  recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
)

const criticalCount = computed(() =>
  recommendations.value.filter(r => r.urgency === 'Critical').length
)

const budgetRemaining = computed(() =>
  budgetInput.value > 0 ? budgetInput.value - totalCost.value : 0
)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const filters = getCurrentFilters()
    recommendations.value = await api.getRestocking(budgetInput.value, filters)
    loaded.value = true
  } catch (err) {
    error.value = t('common.error') + ': ' + err.message
  } finally {
    loading.value = false
  }
}

function clearBudget() {
  budgetInput.value = null
  loadData()
}

function urgencyBadgeClass(urgency) {
  const map = { Critical: 'badge danger', High: 'badge warning', Medium: 'badge info' }
  return map[urgency] || 'badge'
}

function formatCurrency(num) {
  return new Intl.NumberFormat(currentCurrency.value === 'JPY' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: currentCurrency.value,
    maximumFractionDigits: 0
  }).format(num)
}

watch([selectedLocation, selectedCategory], loadData)

onMounted(loadData)
</script>

<style scoped>
.restocking { padding: 0; }

.budget-card { margin-bottom: 1.5rem; }

.budget-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.budget-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.938rem;
  white-space: nowrap;
}

.budget-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.currency-symbol {
  padding: 0 0.75rem;
  color: #6b7280;
  font-weight: 600;
  border-right: 1px solid #d1d5db;
  background: #f9fafb;
  height: 100%;
  display: flex;
  align-items: center;
}

.budget-input {
  border: none;
  outline: none;
  padding: 0.625rem 0.75rem;
  font-size: 0.938rem;
  width: 180px;
  color: #0f172a;
}

.btn-calculate {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-calculate:hover:not(:disabled) { background: #1d4ed8; }
.btn-calculate:disabled { opacity: 0.6; cursor: default; }

.btn-clear {
  background: transparent;
  color: #64748b;
  border: 1px solid #d1d5db;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-clear:hover { border-color: #94a3b8; color: #374151; }

.budget-hint {
  margin-top: 0.625rem;
  font-size: 0.813rem;
  color: #94a3b8;
}

.result-count {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
}

.text-danger { color: #dc2626; font-weight: 600; }
.text-muted { color: #94a3b8; }

code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #334155;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-state h3 { font-size: 1.25rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
.empty-state p { color: #64748b; }
</style>
