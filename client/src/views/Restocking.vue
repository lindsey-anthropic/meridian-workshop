<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.description') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <!-- Budget panel -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.budget.title') }}</h3>
        </div>
        <div class="budget-panel">
          <div class="budget-input-group">
            <label>{{ t('restocking.budget.label') }}</label>
            <input
              v-model.number="budget"
              type="number"
              min="0"
              step="100"
              :placeholder="t('restocking.budget.placeholder')"
              class="budget-input"
            />
          </div>
          <div class="budget-tiles">
            <div class="budget-tile">
              <div class="tile-label">{{ t('restocking.budget.totalRecommended') }}</div>
              <div class="tile-value">{{ formatCurrency(response?.total_recommended_cost ?? 0, currentCurrency) }}</div>
            </div>
            <div class="budget-tile">
              <div class="tile-label">{{ t('restocking.budget.totalDeferred') }}</div>
              <div class="tile-value">{{ formatCurrency(response?.total_deferred_cost ?? 0, currentCurrency) }}</div>
            </div>
            <div class="budget-tile">
              <div class="tile-label">{{ t('restocking.budget.utilization') }}</div>
              <div class="tile-value">{{ utilizationLabel }}</div>
            </div>
          </div>
          <div v-if="hasUtilization" class="budget-bar-track">
            <div
              class="budget-bar"
              :class="utilizationClass"
              :style="{ width: utilizationBarWidth + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Recommendations card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('restocking.title') }}</h3>
        </div>
        <div v-if="!response || response.recommendations.length === 0" class="empty-state">
          {{ t('restocking.empty') }}
        </div>
        <div v-else class="table-container">
          <table class="recommendations-table">
            <thead>
              <tr>
                <th>{{ t('restocking.table.sku') }}</th>
                <th>{{ t('restocking.table.name') }}</th>
                <th>{{ t('restocking.table.category') }}</th>
                <th>{{ t('restocking.table.warehouse') }}</th>
                <th>{{ t('restocking.table.onHand') }}</th>
                <th>{{ t('restocking.table.threshold') }}</th>
                <th>{{ t('restocking.table.shortage') }}</th>
                <th>{{ t('restocking.table.recommendQty') }}</th>
                <th>{{ t('restocking.table.unitCost') }}</th>
                <th>{{ t('restocking.table.estimatedCost') }}</th>
                <th>{{ t('restocking.table.status') }}</th>
                <th>{{ t('restocking.table.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in response.recommendations" :key="rec.id">
                <td><strong>{{ rec.sku }}</strong></td>
                <td>{{ rec.name }}</td>
                <td>{{ rec.category }}</td>
                <td>{{ rec.warehouse }}</td>
                <td>{{ rec.quantity_on_hand }}</td>
                <td>{{ Math.round(rec.threshold) }}</td>
                <td>{{ Math.round(rec.shortage_units) }}</td>
                <td>{{ rec.recommended_quantity }}</td>
                <td>{{ formatCurrency(rec.unit_cost, currentCurrency) }}</td>
                <td>{{ formatCurrency(rec.estimated_cost, currentCurrency) }}</td>
                <td>
                  <span :class="statusBadgeClass(rec)">{{ statusLabel(rec) }}</span>
                </td>
                <td>
                  <button
                    v-if="!rec.po_issued"
                    class="issue-po-btn"
                    :disabled="issuingPo.has(rec.id)"
                    @click="issuePo(rec)"
                  >
                    {{ issuingPo.has(rec.id) ? t('restocking.actions.issuingPo') : t('restocking.actions.issuePo') }}
                  </button>
                  <span v-else class="po-issued-pill">{{ t('restocking.actions.poIssuedPill') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'
import { formatCurrency } from '../utils/currency'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const response = ref(null)
    const budget = ref(null)
    const issuingPo = reactive(new Set())

    const hasUtilization = computed(() =>
      response.value?.budget_utilization !== null && response.value?.budget_utilization !== undefined
    )

    const utilizationLabel = computed(() => {
      const u = response.value?.budget_utilization
      if (u === null || u === undefined) return '—'
      return `${(u * 100).toFixed(1)}%`
    })

    const utilizationBarWidth = computed(() => {
      const u = response.value?.budget_utilization ?? 0
      return Math.min(100, u * 100)
    })

    const utilizationClass = computed(() => {
      const u = response.value?.budget_utilization ?? 0
      if (u > 1.0) return 'danger'
      if (u > 0.8) return 'warning'
      return 'safe'
    })

    const statusBadgeClass = (rec) => {
      if (rec.po_issued) return 'badge info'
      if (rec.status === 'deferred') return 'badge warning'
      return 'badge success'
    }

    const statusLabel = (rec) => {
      if (rec.po_issued) return t('restocking.status.poIssued')
      if (rec.status === 'deferred') return t('restocking.status.deferred')
      return t('restocking.status.recommended')
    }

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        response.value = await api.getRecommendations({
          warehouse: filters.warehouse,
          category: filters.category,
          budget: budget.value
        })
      } catch (err) {
        error.value = `${t('common.error')}: ${err.message}`
        console.error('Recommendation load failed:', err)
      } finally {
        loading.value = false
      }
    }

    let budgetDebounceTimer = null
    watch(budget, () => {
      if (budgetDebounceTimer) clearTimeout(budgetDebounceTimer)
      budgetDebounceTimer = setTimeout(loadRecommendations, 400)
    })

    watch([selectedLocation, selectedCategory], loadRecommendations)

    const issuePo = async (rec) => {
      if (issuingPo.has(rec.id)) return
      issuingPo.add(rec.id)
      try {
        const today = new Date()
        const deliveryDate = new Date(today)
        deliveryDate.setDate(today.getDate() + (rec.lead_time_days || 14))
        const expectedDelivery = deliveryDate.toISOString().split('T')[0]
        await api.createPurchaseOrder({
          sku: rec.sku,
          warehouse: rec.warehouse,
          quantity: rec.recommended_quantity,
          unit_cost: rec.unit_cost,
          supplier_name: rec.preferred_supplier,
          expected_delivery_date: expectedDelivery,
          notes: ''
        })
        await loadRecommendations()
      } catch (err) {
        error.value = `${t('restocking.poError')}: ${err.message}`
        console.error('Issue PO failed:', err)
      } finally {
        issuingPo.delete(rec.id)
      }
    }

    onMounted(loadRecommendations)

    return {
      t,
      currentCurrency,
      formatCurrency,
      loading,
      error,
      response,
      budget,
      issuingPo,
      hasUtilization,
      utilizationLabel,
      utilizationBarWidth,
      utilizationClass,
      statusBadgeClass,
      statusLabel,
      issuePo
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.page-header { margin-bottom: 1.5rem; }
.page-header h2 { margin: 0 0 0.25rem 0; color: #0f172a; }
.page-header p { margin: 0; color: #64748b; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.card-header { margin-bottom: 1.5rem; }
.card-title { font-size: 1.25rem; font-weight: 600; color: #0f172a; margin: 0; }

.budget-panel { display: grid; gap: 1.5rem; }
.budget-input-group { display: flex; align-items: center; gap: 1rem; }
.budget-input-group label { font-weight: 600; color: #0f172a; font-size: 0.875rem; min-width: 80px; }
.budget-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  width: 200px;
  background: white;
}
.budget-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

.budget-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.budget-tile {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}
.tile-label { font-size: 0.8125rem; color: #64748b; margin-bottom: 0.4rem; }
.tile-value { font-size: 1.25rem; font-weight: 700; color: #0f172a; }

.budget-bar-track {
  background: #f1f5f9;
  border-radius: 6px;
  height: 12px;
  overflow: hidden;
}
.budget-bar { height: 100%; transition: width 0.3s ease; border-radius: 6px; }
.budget-bar.safe { background: linear-gradient(to right, #3b82f6, #60a5fa); }
.budget-bar.warning { background: linear-gradient(to right, #f59e0b, #fbbf24); }
.budget-bar.danger { background: linear-gradient(to right, #ef4444, #f87171); }

.recommendations-table { width: 100%; border-collapse: collapse; }
.recommendations-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.8125rem;
  white-space: nowrap;
}
.recommendations-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}
.recommendations-table tr:hover { background: #f8fafc; }

.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge.success { background: #dcfce7; color: #166534; }
.badge.warning { background: #fef3c7; color: #92400e; }
.badge.info { background: #dbeafe; color: #1e40af; }

.issue-po-btn {
  padding: 0.4rem 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 0.15s;
}
.issue-po-btn:hover:not(:disabled) { background: #2563eb; }
.issue-po-btn:disabled { background: #94a3b8; cursor: not-allowed; }

.po-issued-pill {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-style: italic;
}

.loading { text-align: center; padding: 3rem; color: #64748b; }
.error { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
</style>
