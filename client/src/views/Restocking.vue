<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-bar">
      <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
      <div class="budget-input-wrap">
        <span class="currency-prefix">{{ currencySymbol }}</span>
        <input
          v-model.number="budgetCeiling"
          type="number"
          min="0"
          class="budget-input"
          :placeholder="t('restocking.budgetPlaceholder')"
        />
      </div>
      <div class="summary-chips">
        <div class="chip chip-red">
          <span class="chip-value">{{ recommendations.length }}</span>
          <span class="chip-label">{{ t('restocking.itemsNeedingRestock') }}</span>
        </div>
        <div class="chip chip-blue">
          <span class="chip-value">{{ formatCurrency(totalCost) }}</span>
          <span class="chip-label">{{ t('restocking.totalEstimatedCost') }}</span>
        </div>
        <div class="chip chip-green">
          <span class="chip-value">{{ budgetCeiling ? itemsWithinBudget : '—' }}</span>
          <span class="chip-label">{{ t('restocking.itemsWithinBudget') }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="recommendations.length === 0" class="empty">
      {{ t('restocking.noItems') }}
    </div>
    <div v-else>
      <div v-if="budgetCeiling && totalCost > budgetCeiling" class="budget-warning">
        {{ t('restocking.budgetExceeded') }}
      </div>

      <div class="card">
        <div class="table-container">
          <table class="restock-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.itemName') }}</th>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th class="num">{{ t('restocking.table.onHand') }}</th>
                <th class="num">{{ t('restocking.table.reorderPoint') }}</th>
                <th class="num">{{ t('restocking.table.shortage') }}</th>
                <th>{{ t('restocking.table.demandTrend') }}</th>
                <th class="num">{{ t('restocking.table.recommendedQty') }}</th>
                <th class="num">{{ t('restocking.table.estimatedCost') }}</th>
                <th v-if="budgetCeiling">{{ t('restocking.table.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in recommendations"
                :key="item.id"
                :class="{ 'over-budget': budgetCeiling && item.overBudget }"
              >
                <td class="item-name">{{ item.name }}</td>
                <td><code>{{ item.sku }}</code></td>
                <td>{{ translateWarehouse(item.warehouse) }}</td>
                <td>{{ item.category }}</td>
                <td class="num">{{ item.quantity_on_hand }}</td>
                <td class="num">{{ item.reorder_point }}</td>
                <td class="num shortage">{{ item.shortage }}</td>
                <td>
                  <span :class="trendClass(item.trend)">
                    {{ trendLabel(item.trend) }}
                  </span>
                </td>
                <td class="num"><strong>{{ item.recommended_qty }}</strong></td>
                <td class="num">{{ formatCurrency(item.estimated_cost) }}</td>
                <td v-if="budgetCeiling">
                  <span :class="item.overBudget ? 'badge danger' : 'badge success'">
                    {{ item.overBudget ? t('restocking.status.overBudget') : t('restocking.status.withinBudget') }}
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

const TREND_URGENCY = { increasing: 3, stable: 2, decreasing: 1 }

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const inventoryItems = ref([])
    const demandForecasts = ref([])
    const budgetCeiling = ref(null)

    const currencySymbol = computed(() =>
      currentCurrency.value === 'JPY' ? '¥' : '$'
    )

    const formatCurrency = (num) => {
      const currency = currentCurrency.value
      return Math.round(num).toLocaleString(
        currency === 'JPY' ? 'ja-JP' : 'en-US',
        { style: 'currency', currency, maximumFractionDigits: 0 }
      )
    }

    const demandBySku = computed(() => {
      const map = {}
      for (const d of demandForecasts.value) map[d.item_sku] = d
      return map
    })

    const recommendations = computed(() => {
      const candidates = inventoryItems.value
        .filter(item => item.quantity_on_hand <= item.reorder_point)
        .map(item => {
          const demand = demandBySku.value[item.sku]
          const trend = demand?.trend ?? 'stable'
          const shortage = item.reorder_point - item.quantity_on_hand
          const recommended_qty = Math.ceil(
            trend === 'increasing' ? shortage * 1.2 : shortage
          )
          const estimated_cost = recommended_qty * item.unit_cost
          return {
            ...item,
            trend,
            shortage,
            recommended_qty,
            estimated_cost,
            urgency: TREND_URGENCY[trend] ?? 2
          }
        })
        .sort((a, b) => {
          if (b.urgency !== a.urgency) return b.urgency - a.urgency
          return (b.shortage / b.reorder_point) - (a.shortage / a.reorder_point)
        })

      if (!budgetCeiling.value) return candidates

      let running = 0
      return candidates.map(item => {
        running += item.estimated_cost
        return { ...item, overBudget: running > budgetCeiling.value }
      })
    })

    const totalCost = computed(() =>
      recommendations.value.reduce((sum, i) => sum + i.estimated_cost, 0)
    )

    const itemsWithinBudget = computed(() => {
      if (!budgetCeiling.value) return recommendations.value.length
      return recommendations.value.filter(i => !i.overBudget).length
    })

    const trendClass = (trend) => {
      if (trend === 'increasing') return 'badge danger'
      if (trend === 'decreasing') return 'badge success'
      return 'badge warning'
    }

    const trendLabel = (trend) =>
      t(`restocking.trend.${trend ?? 'unknown'}`)

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        const [inv, demand] = await Promise.all([
          api.getInventory(filters),
          api.getDemandForecasts()
        ])
        inventoryItems.value = inv
        demandForecasts.value = demand
      } catch (err) {
        console.error('Failed to load restocking data:', err)
        error.value = 'Failed to load data: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch([selectedLocation, selectedCategory], loadData)
    onMounted(loadData)

    return {
      t,
      translateWarehouse,
      loading,
      error,
      budgetCeiling,
      currencySymbol,
      recommendations,
      totalCost,
      itemsWithinBudget,
      formatCurrency,
      trendClass,
      trendLabel
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-bar {
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  background: #f9fafb;
}

.currency-prefix {
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 600;
  border-right: 1px solid #d1d5db;
}

.budget-input {
  border: none;
  background: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  width: 180px;
  outline: none;
  color: #0f172a;
}

.summary-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-left: auto;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-width: 110px;
}

.chip-red    { background: #fff1f2; }
.chip-blue   { background: #eff6ff; }
.chip-green  { background: #f0fdf4; }

.chip-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}
.chip-red  .chip-value { color: #be123c; }
.chip-blue .chip-value { color: #1d4ed8; }
.chip-green .chip-value { color: #15803d; }

.chip-label {
  font-size: 0.7rem;
  color: #64748b;
  text-align: center;
  margin-top: 2px;
}

.budget-warning {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.restock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.restock-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.restock-table th.num,
.restock-table td.num { text-align: right; }

.restock-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.restock-table tr:hover { background: #f8fafc; }

.restock-table tr.over-budget { opacity: 0.4; }

.item-name { font-weight: 500; color: #0f172a; max-width: 200px; }

code {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

.shortage { color: #dc2626; font-weight: 600; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge.danger  { background: #fee2e2; color: #991b1b; }
.badge.warning { background: #fef3c7; color: #92400e; }
.badge.success { background: #dcfce7; color: #166534; }

.empty {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: #64748b;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
}
</style>
