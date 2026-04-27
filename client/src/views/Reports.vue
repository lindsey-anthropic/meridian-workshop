<template>
  <div class="reports">
    <div class="page-header">
      <h2>{{ t('reports.title') }}</h2>
      <p>{{ t('reports.description') }}</p>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <!-- Quarterly Performance -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ t('reports.quarterlyPerformance') }}</h3>
        </div>
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>{{ t('reports.quarter') }}</th>
                <th>{{ t('reports.totalOrders') }}</th>
                <th>{{ t('reports.totalRevenue') }}</th>
                <th>{{ t('reports.avgOrderValue') }}</th>
                <th>{{ t('reports.fulfillmentRate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in quarterlyData" :key="q.quarter">
                <td><strong>{{ q.quarter }}</strong></td>
                <td>{{ q.total_orders }}</td>
                <td>{{ currencySymbol }}{{ formatNumber(q.total_revenue) }}</td>
                <td>{{ currencySymbol }}{{ formatNumber(q.avg_order_value) }}</td>
                <td>
                  <span :class="getFulfillmentClass(q.fulfillment_rate)">
                    {{ q.fulfillment_rate }}%
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
          <h3 class="card-title">{{ t('reports.monthlyRevenueTrend') }}</h3>
        </div>
        <div class="chart-container">
          <div class="bar-chart">
            <div v-for="month in monthlyData" :key="month.month" class="bar-wrapper">
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{ height: getBarHeight(month.revenue) + 'px' }"
                  :title="currencySymbol + formatNumber(month.revenue)"
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
          <h3 class="card-title">{{ t('reports.monthOverMonthAnalysis') }}</h3>
        </div>
        <div class="table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>{{ t('reports.month') }}</th>
                <th>{{ t('reports.orders') }}</th>
                <th>{{ t('reports.revenue') }}</th>
                <th>{{ t('reports.change') }}</th>
                <th>{{ t('reports.growthRate') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(month, index) in monthlyData" :key="month.month">
                <td><strong>{{ formatMonth(month.month) }}</strong></td>
                <td>{{ month.order_count }}</td>
                <td>{{ currencySymbol }}{{ formatNumber(month.revenue) }}</td>
                <td>
                  <span v-if="index > 0" :class="getChangeClass(month.revenue, monthlyData[index - 1].revenue)">
                    {{ getChangeValue(month.revenue, monthlyData[index - 1].revenue) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span v-if="index > 0" :class="getChangeClass(month.revenue, monthlyData[index - 1].revenue)">
                    {{ getGrowthRate(month.revenue, monthlyData[index - 1].revenue) }}
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
          <div class="stat-label">{{ t('reports.totalRevenueYTD') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ formatNumber(totalRevenue) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.avgMonthlyRevenue') }}</div>
          <div class="stat-value">{{ currencySymbol }}{{ formatNumber(avgMonthlyRevenue) }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.totalOrdersYTD') }}</div>
          <div class="stat-value">{{ totalOrders }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">{{ t('reports.bestPerformingQuarter') }}</div>
          <div class="stat-value">{{ bestQuarter || '-' }}</div>
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
  name: 'Reports',
  setup() {
    const { t, currentLocale, currentCurrency } = useI18n()

    const currencySymbol = computed(() =>
      currentCurrency.value === 'JPY' ? '¥' : '$'
    )

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

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        const [quarterly, monthly] = await Promise.all([
          api.getQuarterlyReports(filters),
          api.getMonthlyTrends(filters)
        ])
        quarterlyData.value = quarterly
        monthlyData.value = monthly
      } catch (err) {
        error.value = t('reports.failedToLoad') + err.message
      } finally {
        loading.value = false
      }
    }

    const totalRevenue = computed(() =>
      monthlyData.value.reduce((sum, m) => sum + m.revenue, 0)
    )

    const avgMonthlyRevenue = computed(() =>
      monthlyData.value.length > 0 ? totalRevenue.value / monthlyData.value.length : 0
    )

    const totalOrders = computed(() =>
      monthlyData.value.reduce((sum, m) => sum + m.order_count, 0)
    )

    const bestQuarter = computed(() => {
      const best = quarterlyData.value.reduce(
        (acc, q) => (q.total_revenue > acc.total_revenue ? q : acc),
        { quarter: '', total_revenue: 0 }
      )
      return best.quarter
    })

    const maxMonthlyRevenue = computed(() =>
      monthlyData.value.reduce((max, m) => Math.max(max, m.revenue), 0)
    )

    const formatNumber = (num) =>
      Number(num).toLocaleString(
        currentLocale.value === 'ja' ? 'ja-JP' : 'en-US',
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )

    const formatMonth = (monthStr) => {
      const [year, month] = monthStr.split('-')
      const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      const monthLabel = t(`months.${monthKeys[parseInt(month, 10) - 1]}`)
      if (currentLocale.value === 'ja') {
        return `${year}年${monthLabel}`
      }
      return `${monthLabel} ${year}`
    }

    const getBarHeight = (revenue) => {
      const max = maxMonthlyRevenue.value
      return max === 0 ? 0 : (revenue / max) * 200
    }

    const getFulfillmentClass = (rate) => {
      if (rate >= 90) return 'badge success'
      if (rate >= 75) return 'badge warning'
      return 'badge danger'
    }

    const getChangeValue = (current, previous) => {
      const change = current - previous
      const symbol = currencySymbol.value
      if (change > 0) return '+' + symbol + formatNumber(change)
      if (change < 0) return '-' + symbol + formatNumber(Math.abs(change))
      return symbol + '0.00'
    }

    const getChangeClass = (current, previous) => {
      const change = current - previous
      if (change > 0) return 'positive-change'
      if (change < 0) return 'negative-change'
      return ''
    }

    const getGrowthRate = (current, previous) => {
      if (previous === 0) return 'N/A'
      const rate = ((current - previous) / previous) * 100
      const sign = rate > 0 ? '+' : ''
      return sign + rate.toFixed(1) + '%'
    }

    onMounted(loadData)

    watch(
      [selectedPeriod, selectedLocation, selectedCategory, selectedStatus],
      loadData
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
      currencySymbol,
      formatNumber,
      formatMonth,
      getBarHeight,
      getFulfillmentClass,
      getChangeValue,
      getChangeClass,
      getGrowthRate
    }
  }
}
</script>

<style scoped>
/* View-specific styles only. Shared patterns (.card, .badge, .stats-grid,
   .stat-card, .loading, .error, .positive-change, .negative-change, table
   baseline) come from src/styles/base.css. */

.reports {
  padding: 0;
}

.chart-container {
  padding: var(--space-6) var(--space-4);
  min-height: 300px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  gap: var(--space-2);
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
  background: linear-gradient(to top, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: all 0.3s;
  cursor: pointer;
}

.bar:hover {
  background: linear-gradient(to top, var(--color-primary-dark), var(--color-primary));
}

.bar-label {
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  text-align: center;
  transform: rotate(-45deg);
  white-space: nowrap;
  margin-top: var(--space-5);
}
</style>
