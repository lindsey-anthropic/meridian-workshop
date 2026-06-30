<template>
  <div class="backlog-page">
    <div class="page-header">
      <h2>Restocking & Backlog Management</h2>
      <p>Analyze inventory shortages, manage the backlog, and generate smart restocking purchase orders within your budget ceiling.</p>
    </div>

    <!-- Tab Selection -->
    <div class="tabs-nav">
      <button
        :class="['tab-btn', { active: activeTab === 'recommendations' }]"
        @click="activeTab = 'recommendations'"
      >
        Restocking Recommendations (R2)
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'list' }]"
        @click="activeTab = 'list'"
      >
        All Backlog Items
      </button>
    </div>

    <div v-if="loading" class="loading">Loading restocking data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>

      <!-- TAB 1: RESTOCKING RECOMMENDATIONS -->
      <div v-if="activeTab === 'recommendations'">

        <!-- Budget Configuration Panel -->
        <div class="budget-panel">
          <div class="budget-input-group">
            <label for="budget-ceiling"><strong>Budget Ceiling (USD):</strong></label>
            <div class="input-wrapper">
              <span class="currency-symbol">$</span>
              <input
                id="budget-ceiling"
                type="number"
                v-model.number="budgetCeiling"
                class="budget-input"
                min="0"
                step="5000"
              />
            </div>
          </div>

          <div class="budget-stats">
            <div class="budget-stat">
              <span class="stat-label">Total Backlog Cost</span>
              <span class="stat-value font-red">${{ formatNumber(totalBacklogCost) }}</span>
            </div>
            <div class="budget-stat">
              <span class="stat-label">Allocated Budget</span>
              <span class="stat-value font-blue">${{ formatNumber(allocatedBudget) }}</span>
            </div>
            <div class="budget-stat">
              <span class="stat-label">Remaining Funds</span>
              <span class="stat-value" :class="remainingBudget >= 0 ? 'font-green' : 'font-red'">
                ${{ formatNumber(remainingBudget) }}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="progress-bar-container">
            <div class="progress-bar-label">
              <span>Budget Usage</span>
              <span>{{ budgetUsagePercent.toFixed(1) }}%</span>
            </div>
            <div class="progress-bar-track">
              <div
                class="progress-bar-fill"
                :class="{ 'over-budget': remainingBudget < 0 }"
                :style="{ width: Math.min(budgetUsagePercent, 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Recommendations Table -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recommended Purchase Orders</h3>
            <p class="card-subtitle">Prioritized automatically by shortage severity, delay duration, and backlog importance.</p>
          </div>

          <div v-if="recommendations.length === 0" class="empty-state">
            No restocking recommendations needed. All items have sufficient stock or active purchase orders!
          </div>
          <div v-else class="table-container">
            <table class="backlog-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th>Shortage Qty</th>
                  <th>Unit Cost</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rec in recommendations" :key="rec.id">
                  <td>
                    <span :class="['priority-badge', rec.priority.toLowerCase()]">
                      {{ rec.priority }}
                    </span>
                  </td>
                  <td><strong>{{ rec.item_sku }}</strong></td>
                  <td>{{ rec.item_name }}</td>
                  <td>{{ rec.shortage }} units</td>
                  <td>${{ formatNumber(rec.unit_cost) }}</td>
                  <td><strong>${{ formatNumber(rec.total_cost) }}</strong></td>
                  <td>
                    <span :class="['status-badge', rec.status.toLowerCase()]">
                      {{ rec.statusLabel }}
                    </span>
                  </td>
                  <td>
                    <button
                      v-if="rec.status === 'recommended'"
                      class="btn btn-primary btn-sm"
                      @click="approvePO(rec)"
                    >
                      Approve PO
                    </button>
                    <span v-else-if="rec.status === 'approved'" class="approved-checkmark">
                      ✓ Approved
                    </span>
                    <button
                      v-else
                      class="btn btn-secondary btn-sm"
                      disabled
                      title="Exceeds current budget ceiling"
                    >
                      Exceeds Budget
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 2: ALL BACKLOG ITEMS LIST -->
      <div v-if="activeTab === 'list'" class="card">
        <div class="card-header">
          <h3 class="card-title">Backlog Inventory Shortages</h3>
          <p class="card-subtitle">Complete tracker of delayed customer orders waiting on stock replenishment.</p>
        </div>

        <div v-if="backlogItems.length === 0" class="empty-state">
          Hurray! No active inventory shortages or delayed orders on backlog.
        </div>
        <div v-else class="table-container">
          <table class="backlog-table">
            <thead>
              <tr>
                <th>Priority</th>
                  <th>Order ID</th>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Needed</th>
                <th>Available</th>
                <th>Shortage</th>
                <th>Days Delayed</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in backlogItems" :key="item.id">
                <td>
                  <span :class="['priority-badge', item.priority.toLowerCase()]">
                    {{ item.priority }}
                  </span>
                </td>
                <td>#{{ item.order_id }}</td>
                <td><strong>{{ item.item_sku }}</strong></td>
                <td>{{ item.item_name }}</td>
                <td>{{ item.quantity_needed }}</td>
                <td>{{ item.quantity_available }}</td>
                <td class="font-red"><strong>{{ item.quantity_needed - item.quantity_available }}</strong></td>
                <td>
                  <span class="days-delayed">{{ item.days_delayed }} days</span>
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

export default {
  name: 'Restocking',
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const activeTab = ref('recommendations')

    const allBacklogItems = ref([])
    const inventoryItems = ref([])
    const existingPOs = ref([])
    const budgetCeiling = ref(150000) // Default budget ceiling

    // Use shared filters
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    // Filter backlog based on inventory filters
    const backlogItems = computed(() => {
      if (selectedLocation.value === 'all' && selectedCategory.value === 'all') {
        return allBacklogItems.value
      }

      // Get SKUs of items that match the filters
      const validSkus = new Set(inventoryItems.value.map(item => item.sku))
      return allBacklogItems.value.filter(b => validSkus.has(b.item_sku))
    })

    // Load all datasets
    const loadData = async () => {
      try {
        loading.value = true
        error.value = null

        // Fetch backlog, inventory, and existing purchase orders
        const [backlog, inventory, pos] = await Promise.all([
          api.getBacklog(),
          api.getInventory(getCurrentFilters()),
          api.getPurchaseOrders()
        ])

        allBacklogItems.value = backlog
        inventoryItems.value = inventory
        existingPOs.value = pos
      } catch (err) {
        error.value = 'Failed to load restocking data: ' + err.message
      } finally {
        loading.value = false
      }
    }

    // Helper: Find item unit cost and category from inventory
    const getItemInventoryDetails = (sku) => {
      const match = inventoryItems.value.find(item => item.sku === sku)
      return {
        unit_cost: match ? match.unit_cost : 10.00, // fallback
        supplier_name: match && match.supplier ? match.supplier : 'Meridian Global Suppliers'
      }
    }

    // Recommendations Builder (R2 Core)
    const recommendations = computed(() => {
      // 1. Group backlog by SKU to aggregate shortages
      const groups = {}
      for (const item of backlogItems.value) {
        const shortage = item.quantity_needed - item.quantity_available
        if (shortage <= 0) continue

        if (!groups[item.item_sku]) {
          const details = getItemInventoryDetails(item.item_sku)
          groups[item.item_sku] = {
            id: item.id, // reference backlog item ID
            item_sku: item.item_sku,
            item_name: item.item_name,
            shortage: 0,
            unit_cost: details.unit_cost,
            supplier_name: details.supplier_name,
            priority: item.priority,
            days_delayed: item.days_delayed
          }
        } else {
          // Keep highest priority and max delay
          if (item.priority === 'High' || (item.priority === 'Medium' && groups[item.item_sku].priority === 'Low')) {
            groups[item.item_sku].priority = item.priority
          }
          if (item.days_delayed > groups[item.item_sku].days_delayed) {
            groups[item.item_sku].days_delayed = item.days_delayed
          }
        }
        groups[item.item_sku].shortage += shortage
      }

      // Convert map to array and compute total costs
      const list = Object.values(groups).map(item => ({
        ...item,
        total_cost: item.shortage * item.unit_cost
      }))

      // 2. Sort by Priority (High -> Medium -> Low) and Days Delayed (descending)
      const priorityWeights = { 'High': 3, 'Medium': 2, 'Low': 1 }
      list.sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 0
        const weightB = priorityWeights[b.priority] || 0
        if (weightB !== weightA) return weightB - weightA
        return b.days_delayed - a.days_delayed
      })

      // 3. Dynamically assign recommendation status using the budget ceiling
      let cumulativeSpent = 0
      return list.map(item => {
        // Check if PO already exists
        const matchedPO = existingPOs.value.find(po => po.backlog_item_id === item.id)

        let status = 'recommended'
        let statusLabel = 'Recommended'

        if (matchedPO) {
          status = 'approved'
          statusLabel = `Approved (${matchedPO.id})`
          cumulativeSpent += item.total_cost
        } else {
          if (cumulativeSpent + item.total_cost <= budgetCeiling.value) {
            status = 'recommended'
            statusLabel = 'Recommended'
            cumulativeSpent += item.total_cost
          } else {
            status = 'exceeds'
            statusLabel = 'Exceeds Budget'
          }
        }

        return {
          ...item,
          status,
          statusLabel
        }
      })
    })

    // Computed Stats
    const totalBacklogCost = computed(() => {
      return recommendations.value.reduce((sum, item) => sum + item.total_cost, 0)
    })

    const allocatedBudget = computed(() => {
      return recommendations.value
        .filter(item => item.status === 'recommended' || item.status === 'approved')
        .reduce((sum, item) => sum + item.total_cost, 0)
    })

    const remainingBudget = computed(() => {
      return budgetCeiling.value - allocatedBudget.value
    })

    const budgetUsagePercent = computed(() => {
      if (budgetCeiling.value === 0) return 0
      return (allocatedBudget.value / budgetCeiling.value) * 100
    })

    // Action: Create PO on Backend
    const approvePO = async (rec) => {
      try {
        loading.value = true

        // Post a new PO to backend API
        await api.createPurchaseOrder({
          backlog_item_id: rec.id,
          supplier_name: rec.supplier_name,
          quantity: rec.shortage,
          unit_cost: rec.unit_cost,
          expected_delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
          notes: `Auto-recommended restocking PO to resolve shortage of ${rec.item_name}.`
        })

        // Refresh entire dataset
        await loadData()
      } catch (err) {
        error.value = 'Failed to create purchase order: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const formatNumber = (num) => {
      if (num === undefined || num === null) return '0.00'
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Watchers for global filters
    watch([selectedLocation, selectedCategory], () => {
      loadData()
    })

    onMounted(() => {
      loadData()
    })

    return {
      activeTab,
      loading,
      error,
      backlogItems,
      recommendations,
      budgetCeiling,
      totalBacklogCost,
      allocatedBudget,
      remainingBudget,
      budgetUsagePercent,
      approvePO,
      formatNumber
    }
  }
}
</script>

<style scoped>
.backlog-page {
  padding: 0;
}

.page-header {
  margin-bottom: 2rem;
}

.tabs-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.tab-btn.active {
  color: #3b82f6;
  background: #eff6ff;
  border-bottom: 3px solid #3b82f6;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.budget-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.budget-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 300px;
  margin-bottom: 1.5rem;
}

.budget-input-group label {
  font-size: 0.9rem;
  color: #334155;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.budget-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #0f172a;
}

.budget-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.budget-stat {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.font-red { color: #dc2626 !important; }
.font-green { color: #16a34a !important; }
.font-blue { color: #2563eb !important; }

.progress-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.progress-bar-track {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-bar-fill.over-budget {
  background: #ef4444;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.backlog-table {
  width: 100%;
  border-collapse: collapse;
}

.backlog-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
}

.backlog-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.backlog-table tr:hover {
  background: #f8fafc;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #fee2e2;
  color: #991b1b;
}

.priority-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-badge.low {
  background: #f1f5f9;
  color: #475569;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.approved {
  background: #dcfce7;
  color: #166534;
}

.status-badge.recommended {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.exceeds {
  background: #fee2e2;
  color: #991b1b;
}

.days-delayed {
  color: #dc2626;
  font-weight: 600;
}

.approved-checkmark {
  color: #16a34a;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-weight: 600;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
</style>
