<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div class="budget-row">
      <label class="budget-label">
        <span class="budget-label-text">{{ t('restocking.budgetLabel') }}</span>
        <div class="budget-input-wrapper">
          <span class="currency-prefix">{{ currencySymbol }}</span>
          <input
            v-model="budgetInput"
            type="number"
            min="0"
            step="1000"
            class="budget-input"
            aria-label="Monthly budget"
          />
        </div>
      </label>
    </div>

    <div v-if="loading" class="loading">{{ t('restocking.loading') }}</div>
    <div v-else-if="error" class="error">{{ t('restocking.errorPrefix') }}: {{ error }}</div>
    <div v-else-if="data">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.recommendationCount') }}</div>
          <div class="stat-value">{{ formatNumber(recommendationCount) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.totalCost') }}</div>
          <div class="stat-value">{{ formatCurrency(totalCost) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.budgetUsedPct') }}</div>
          <div class="stat-value">{{ formatPercent(budgetUsedFraction) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('restocking.summary.remaining') }}</div>
          <div class="stat-value">{{ formatCurrency(remainingBudget) }}</div>
        </div>
      </div>

      <div v-if="recommendationCount === 0" class="card empty">
        {{ t('restocking.empty') }}
      </div>

      <div v-else class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }}</h3>
          <button
            type="button"
            class="btn-export"
            :disabled="recommendationCount === 0"
            @click="handleExport"
          >
            {{ t('restocking.exportCsv') }}
          </button>
        </div>
        <div class="table-container">
          <table class="restocking-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.rank') }}</th>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.currentStock') }}</th>
                <th>{{ t('restocking.table.recommendedQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.lineTotal') }}</th>
                <th>{{ t('restocking.table.rationale') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rec, index) in recommendations" :key="rec.sku">
                <td><strong>{{ index + 1 }}</strong></td>
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.warehouse }}</td>
                <td>{{ rec.category }}</td>
                <td>{{ formatNumber(rec.current_stock) }}</td>
                <td>{{ formatNumber(rec.recommended_quantity) }}</td>
                <td>{{ formatCurrency(rec.unit_cost) }}</td>
                <td><strong>{{ formatCurrency(rec.line_total) }}</strong></td>
                <td class="rationale-cell">{{ getRationale(rec) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="skipped.length > 0" class="card skipped-card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.skipped.title') }}</h3>
        </div>
        <ul class="skipped-list">
          <li v-for="s in skipped" :key="s.sku">
            <strong>{{ s.sku }}</strong> — {{ s.name }}
            <span class="skipped-reason">{{ t('restocking.skipped.' + s.reason_key) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { toCSV, downloadCSV } from '../utils/csv'

const STORAGE_KEY = 'restocking-budget'
const DEFAULT_BUDGET = 500000
const DEBOUNCE_MS = 300

const loadStoredBudget = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored !== null) {
    const n = Number(stored)
    if (!Number.isNaN(n) && n >= 0) return n
  }
  return DEFAULT_BUDGET
}

export default {
  name: 'Restocking',
  setup() {
    const { t, currentLocale, currentCurrency } = useI18n()
    const { selectedLocation, selectedCategory } = useFilters()

    const budgetInput = ref(loadStoredBudget())
    const activeBudget = ref(budgetInput.value)

    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const recommendations = computed(() => data.value?.recommendations ?? [])
    const skipped = computed(() => data.value?.skipped ?? [])
    const recommendationCount = computed(() => recommendations.value.length)
    const totalCost = computed(() => data.value?.total_recommended_cost ?? 0)
    const remainingBudget = computed(() => data.value?.remaining_budget ?? 0)
    const budgetUsedFraction = computed(() => {
      if (activeBudget.value <= 0) return 0
      return totalCost.value / activeBudget.value
    })

    const currencySymbol = computed(() => {
      const formatter = new Intl.NumberFormat(currentLocale.value, {
        style: 'currency',
        currency: currentCurrency.value
      })
      const parts = formatter.formatToParts(0)
      return parts.find(p => p.type === 'currency')?.value ?? ''
    })

    const formatCurrency = (value) => {
      if (value === null || value === undefined || Number.isNaN(value)) return '—'
      return Number(value).toLocaleString(currentLocale.value, {
        style: 'currency',
        currency: currentCurrency.value
      })
    }

    const formatPercent = (fraction) => {
      if (fraction === null || fraction === undefined || Number.isNaN(fraction)) return '—'
      return fraction.toLocaleString(currentLocale.value, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      })
    }

    const formatNumber = (value) => {
      if (value === null || value === undefined || Number.isNaN(value)) return '—'
      return Number(value).toLocaleString(currentLocale.value)
    }

    const getRationale = (rec) => {
      const deficit = Math.max(0, rec.reorder_point - rec.current_stock)
      return t(`restocking.rationale.${rec.rationale_key}`, {
        forecast: rec.forecasted_demand,
        deficit
      })
    }

    const loadData = async () => {
      if (activeBudget.value <= 0) {
        data.value = {
          budget: 0,
          total_recommended_cost: 0,
          remaining_budget: 0,
          recommendations: [],
          skipped: []
        }
        loading.value = false
        return
      }
      try {
        loading.value = true
        error.value = null
        data.value = await api.getRestockingRecommendations({
          budget: activeBudget.value,
          warehouse: selectedLocation.value,
          category: selectedCategory.value
        })
      } catch (err) {
        console.error('Error loading restocking recommendations:', err)
        error.value = err.message || String(err)
        data.value = null
      } finally {
        loading.value = false
      }
    }

    let debounceTimer = null
    watch(budgetInput, (value) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        const n = Number(value)
        const next = Number.isNaN(n) ? 0 : Math.max(0, n)
        activeBudget.value = next
        if (next > 0) {
          window.localStorage.setItem(STORAGE_KEY, String(next))
        }
      }, DEBOUNCE_MS)
    })

    watch([activeBudget, selectedLocation, selectedCategory], () => loadData())

    const handleExport = () => {
      if (recommendationCount.value === 0) return
      const headers = [
        t('restocking.table.rank'),
        t('restocking.table.sku'),
        t('restocking.table.name'),
        t('restocking.table.warehouse'),
        t('restocking.table.category'),
        t('restocking.table.currentStock'),
        t('restocking.table.recommendedQty'),
        t('restocking.table.unitCost'),
        t('restocking.table.lineTotal'),
        t('restocking.table.rationale')
      ]
      const rows = recommendations.value.map((rec, i) => [
        i + 1,
        rec.sku,
        rec.name,
        rec.warehouse,
        rec.category,
        rec.current_stock,
        rec.recommended_quantity,
        rec.unit_cost,
        rec.line_total,
        getRationale(rec)
      ])
      const csv = toCSV(headers, rows)
      const filename = `restocking-${new Date().toISOString().slice(0, 10)}.csv`
      downloadCSV(filename, csv)
    }

    onMounted(() => {
      loadData()
    })

    onUnmounted(() => {
      clearTimeout(debounceTimer)
    })

    return {
      t,
      data,
      loading,
      error,
      budgetInput,
      currencySymbol,
      recommendations,
      skipped,
      recommendationCount,
      totalCost,
      remainingBudget,
      budgetUsedFraction,
      formatCurrency,
      formatPercent,
      formatNumber,
      getRationale,
      handleExport
    }
  }
}
</script>

<style scoped>
.restocking {
  padding: 0;
}

.page-header {
  margin-bottom: 1.5rem;
}

.budget-row {
  background: var(--color-paper);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.budget-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 320px;
}

.budget-label-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink-soft);
}

.budget-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-rule-strong);
  border-radius: 8px;
  background: var(--color-page-bg);
  overflow: hidden;
  transition: border-color 0.15s;
}

.budget-input-wrapper:focus-within {
  border-color: var(--color-accent);
  background: var(--color-paper);
}

.currency-prefix {
  padding: 0 0.5rem 0 0.75rem;
  color: var(--color-ink-muted);
  font-size: 1.125rem;
  font-weight: 600;
}

.budget-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.125rem;
  padding: 0.625rem 0.75rem 0.625rem 0;
  color: var(--color-ink);
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--color-paper);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--color-accent);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-ink-muted);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-ink);
}

.card {
  background: var(--color-paper);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card.empty {
  text-align: center;
  color: var(--color-ink-muted);
  padding: 3rem 1.5rem;
  font-size: 0.95rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0;
}

.btn-export {
  background: var(--color-accent);
  color: var(--color-paper);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.15s;
}

.btn-export:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.btn-export:disabled {
  background: var(--color-rule-strong);
  cursor: not-allowed;
}

.table-container {
  overflow-x: auto;
}

.restocking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.restocking-table th {
  background: var(--color-page-bg);
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-ink-muted);
  border-bottom: 2px solid var(--color-rule);
  white-space: nowrap;
}

.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-rule);
}

.restocking-table tr:hover {
  background: var(--color-page-bg);
}

.restocking-table .rationale-cell {
  color: var(--color-ink-soft);
  font-size: 0.85rem;
}

.skipped-card {
  border-left: 4px solid var(--color-warning);
}

.skipped-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skipped-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-rule);
  color: var(--color-ink-soft);
  font-size: 0.9rem;
}

.skipped-list li:last-child {
  border-bottom: none;
}

.skipped-reason {
  color: var(--color-warning-text);
  font-style: italic;
  margin-left: 0.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--color-ink-muted);
}

.error {
  background: var(--color-danger-soft);
  color: var(--color-danger-text);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
