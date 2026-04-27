<template>
  <div class="reports">
    <div class="page-header">
      <h2>{{ t('reports.title') }}</h2>
      <p>{{ t('reports.description') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('reports.loading') }}</div>
    <div v-else-if="error" class="error">{{ t('reports.errorPrefix') }}: {{ error }}</div>
    <div v-else>
      <!-- Quarterly Performance -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('reports.quarterly.title') }}</h3>
        </div>
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>{{ t('reports.quarterly.quarter') }}</th>
                <th>{{ t('reports.quarterly.totalOrders') }}</th>
                <th>{{ t('reports.quarterly.totalRevenue') }}</th>
                <th>{{ t('reports.quarterly.avgOrderValue') }}</th>
                <th>{{ t('reports.quarterly.fulfillmentRate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in quarterlyData" :key="q.quarter">
                <td><strong>{{ q.quarter }}</strong></td>
                <td>{{ q.total_orders }}</td>
                <td>{{ formatCurrency(q.total_revenue) }}</td>
                <td>{{ formatCurrency(q.avg_order_value) }}</td>
                <td>
                  <span :class="getFulfillmentClass(q.fulfillment_rate)">
                    {{ formatPercent(q.fulfillment_rate) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Monthly Trends Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('reports.monthlyTrend.title') }}</h3>
        </div>
        <div class="chart-container">
          <div class="bar-chart">
            <div v-for="month in monthlyData" :key="month.month" class="bar-wrapper">
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{ height: getBarHeight(month.revenue) + 'px' }"
                  :title="formatCurrency(month.revenue)"
                ></div>
              </div>
              <div class="bar-label">{{ formatMonth(month.month) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month-over-Month Comparison -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('reports.monthOverMonth.title') }}</h3>
        </div>
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>{{ t('reports.monthOverMonth.month') }}</th>
                <th>{{ t('reports.monthOverMonth.orders') }}</th>
                <th>{{ t('reports.monthOverMonth.revenue') }}</th>
                <th>{{ t('reports.monthOverMonth.change') }}</th>
                <th>{{ t('reports.monthOverMonth.growthRate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(month, index) in monthlyData" :key="month.month">
                <td><strong>{{ formatMonth(month.month) }}</strong></td>
                <td>{{ month.order_count }}</td>
                <td>{{ formatCurrency(month.revenue) }}</td>
                <td>
                  <span v-if="index > 0" :class="getChangeClass(month.revenue, monthlyData[index - 1].revenue)">
                    {{ formatChangeValue(month.revenue, monthlyData[index - 1].revenue) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span v-if="index > 0" :class="getChangeClass(month.revenue, monthlyData[index - 1].revenue)">
                    {{ formatGrowthRate(month.revenue, monthlyData[index - 1].revenue) }}
                  </span>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.summary.totalRevenueYTD') }}</div>
          <div class="stat-value">{{ formatCurrency(totalRevenue) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.summary.avgMonthlyRevenue') }}</div>
          <div class="stat-value">{{ formatCurrency(avgMonthlyRevenue) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.summary.totalOrdersYTD') }}</div>
          <div class="stat-value">{{ totalOrders }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.summary.bestQuarter') }}</div>
          <div class="stat-value">{{ bestQuarter }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Reports',
  setup() {
    const { t, currentLocale, currentCurrency } = useI18n()
    const {
      selectedPeriod,
      selectedLocation,
      selectedCategory,
      selectedStatus,
      getCurrentFilters
    } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const quarterlyData = ref([])
    const monthlyData = ref([])
    const totalRevenue = ref(0)
    const avgMonthlyRevenue = ref(0)
    const totalOrders = ref(0)
    const bestQuarter = ref('')

    const calculateSummaryStats = () => {
      let total = 0
      for (const m of monthlyData.value) {
        total += m.revenue
      }
      totalRevenue.value = total

      if (monthlyData.value.length > 0) {
        avgMonthlyRevenue.value = total / monthlyData.value.length
      } else {
        avgMonthlyRevenue.value = 0
      }

      let orderCount = 0
      for (const m of monthlyData.value) {
        orderCount += m.order_count
      }
      totalOrders.value = orderCount

      let bestQ = ''
      let bestRevenue = 0
      for (const q of quarterlyData.value) {
        if (q.total_revenue > bestRevenue) {
          bestRevenue = q.total_revenue
          bestQ = q.quarter
        }
      }
      bestQuarter.value = bestQ
    }

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        quarterlyData.value = await api.getQuarterlyReports(filters)
        monthlyData.value = await api.getMonthlyTrends(filters)
        calculateSummaryStats()
      } catch (err) {
        console.error('Error loading reports:', err)
        error.value = err.message || String(err)
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (value) => {
      if (value === null || value === undefined || Number.isNaN(value)) return '—'
      return Number(value).toLocaleString(currentLocale.value, {
        style: 'currency',
        currency: currentCurrency.value
      })
    }

    const formatChangeValue = (current, previous) => {
      const change = current - previous
      if (Number.isNaN(change)) return ''
      return change.toLocaleString(currentLocale.value, {
        style: 'currency',
        currency: currentCurrency.value,
        signDisplay: 'exceptZero'
      })
    }

    const formatGrowthRate = (current, previous) => {
      if (previous === 0) return t('reports.notApplicable')
      const rate = (current - previous) / previous
      return rate.toLocaleString(currentLocale.value, {
        style: 'percent',
        signDisplay: 'exceptZero',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      })
    }

    const formatPercent = (value) => {
      if (value === null || value === undefined || Number.isNaN(value)) return '—'
      return (value / 100).toLocaleString(currentLocale.value, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      })
    }

    const formatMonth = (monthStr) => {
      if (!monthStr) return ''
      const [year, month] = monthStr.split('-')
      const yearNum = Number.parseInt(year, 10)
      const monthNum = Number.parseInt(month, 10)
      if (Number.isNaN(yearNum) || Number.isNaN(monthNum)) return monthStr
      const date = new Date(yearNum, monthNum - 1, 1)
      return date.toLocaleDateString(currentLocale.value, {
        month: 'short',
        year: 'numeric'
      })
    }

    const maxMonthlyRevenue = computed(() => {
      let max = 0
      for (const m of monthlyData.value) {
        if (m.revenue > max) max = m.revenue
      }
      return max
    })

    const getBarHeight = (revenue) => {
      const max = maxMonthlyRevenue.value
      if (max === 0) return 0
      return (revenue / max) * 200
    }

    const getFulfillmentClass = (rate) => {
      if (rate >= 90) return 'badge success'
      if (rate >= 75) return 'badge warning'
      return 'badge danger'
    }

    const getChangeClass = (current, previous) => {
      const change = current - previous
      if (change > 0) return 'positive-change'
      if (change < 0) return 'negative-change'
      return ''
    }

    onMounted(() => {
      loadData()
    })

    watch(
      [selectedPeriod, selectedLocation, selectedCategory, selectedStatus],
      () => loadData()
    )

    return {
      t,
      loading,
      error,
      quarterlyData,
      monthlyData,
      totalRevenue,
      avgMonthlyRevenue,
      totalOrders,
      bestQuarter,
      formatCurrency,
      formatChangeValue,
      formatGrowthRate,
      formatPercent,
      formatMonth,
      getBarHeight,
      getFulfillmentClass,
      getChangeClass
    }
  }
}
</script>

<style scoped>
.reports {
  padding: 0;
}

.card {
  background: var(--color-paper);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th {
  background: var(--color-page-bg);
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-ink-muted);
  border-bottom: 2px solid var(--color-rule);
}

.reports-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-rule);
}

.reports-table tr:hover {
  background: var(--color-page-bg);
}

.chart-container {
  padding: 2rem 1rem;
  min-height: 300px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  gap: 0.5rem;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
}

.bar-container {
  height: 200px;
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.bar {
  width: 100%;
  background: linear-gradient(to top, var(--color-accent), var(--color-accent-light));
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  cursor: pointer;
}

.bar:hover {
  background: linear-gradient(to top, var(--color-accent-hover), var(--color-accent));
}

.bar-label {
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: var(--color-ink-muted);
  text-align: center;
  transform: rotate(-45deg);
  white-space: nowrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
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
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-ink);
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.success {
  background: var(--color-success-softest);
  color: var(--color-success-text);
}

.badge.warning {
  background: var(--color-warning-soft);
  color: var(--color-warning-text);
}

.badge.danger {
  background: var(--color-danger-soft);
  color: var(--color-danger-text);
}

.positive-change {
  color: var(--color-success-strong);
  font-weight: 600;
}

.negative-change {
  color: var(--color-danger-strong);
  font-weight: 600;
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
