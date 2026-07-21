<!-- 
  文件路径: frontend/src/modules/analytics/pages/ProductAnalytics.vue
  功能: 产品分析 - 产品表现分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品分类">
              <el-select v-model="searchForm.category" placeholder="全部分类" clearable style="width: 100%">
                <el-option label="电子产品" value="electronics" />
                <el-option label="服装鞋帽" value="clothing" />
                <el-option label="食品饮料" value="food" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 分析</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleDetail"><el-icon><View /></el-icon> 详情</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in productKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.trend">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.trend">{{ kpi.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>产品销量排行</span></template>
          <div ref="rankingChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>分类占比</span></template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 产品明细 -->
    <el-card style="margin-top: 20px">
      <template #header><span>产品明细</span></template>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sales" label="销量" align="center" />
        <el-table-column prop="revenue" label="营收" align="right">
          <template #default="{ row }">{{ formatCurrency(row.revenue) }}</template>
        </el-table-column>
        <el-table-column prop="profit" label="利润" align="right">
          <template #default="{ row }">{{ formatCurrency(row.profit) }}</template>
        </el-table-column>
        <el-table-column prop="margin" label="利润率" align="center">
          <template #default="{ row }">
            <el-tag :type="row.margin > 30 ? 'success' : row.margin > 20 ? 'warning' : 'danger'">
              {{ row.margin }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="趋势" align="center">
          <template #default="{ row }">
            <el-tag :type="row.trend >= 0 ? 'success' : 'danger'">
              {{ row.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(row.trend) }}%
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download, View } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const searchForm = reactive({
  dateRange: [] as [Date, Date] | [],
  category: '',
})

const productKpis = ref([
  { label: '总SKU数', value: '1,286', change: 5.2, trend: 'up' },
  { label: '热销产品数', value: '86', change: 8.3, trend: 'up' },
  { label: '平均毛利率', value: '33.4%', change: 2.1, trend: 'up' },
  { label: '滞销产品数', value: '18', change: -12.5, trend: 'down' },
])

const tableData = ref([
  { product: 'iPhone 15 Pro Max', sales: 256, revenue: 1285000, profit: 429000, margin: 33.4, trend: 12.5 },
  { product: '三星 Galaxy S24 Ultra', sales: 198, revenue: 985000, profit: 335000, margin: 34.0, trend: 8.3 },
  { product: 'MacBook Pro 16"', sales: 86, revenue: 876000, profit: 256000, margin: 29.2, trend: -3.2 },
])

const loading = ref(false)
const rankingChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.dateRange = []; searchForm.category = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = () => { router.push('/analytics/product/detail') }

const initCharts = async () => {
  await nextTick()
  if (rankingChartRef.value) {
    const chart = echarts.init(rankingChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['iPhone', '三星', 'MacBook', 'iPad', 'AirPods'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 256, itemStyle: { color: '#F56C6C' } },
          { value: 198, itemStyle: { color: '#E6A23C' } },
          { value: 86, itemStyle: { color: '#409EFF' } },
          { value: 120, itemStyle: { color: '#67C23A' } },
          { value: 45, itemStyle: { color: '#9B59B6' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (categoryChartRef.value) {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45, name: '电子产品', itemStyle: { color: '#409EFF' } },
          { value: 25, name: '服装鞋帽', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '食品饮料', itemStyle: { color: '#E6A23C' } },
          { value: 10, name: '其他', itemStyle: { color: '#909399' } },
        ],
        label: { formatter: '{b}\n{d}%' },
        emphasis: { scale: true },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initCharts() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-card.up { border-left: 4px solid #67C23A; }
.kpi-card.down { border-left: 4px solid #F56C6C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-change { font-size: 12px; }
.kpi-change.up { color: #67C23A; }
.kpi-change.down { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>