<!-- 
  文件路径: frontend/src/modules/reports/pages/ProfitReport.vue
  功能: 利润报表 - 利润分析报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.dimension" placeholder="分析维度" style="width: 100%">
              <el-option label="按产品" value="product" />
              <el-option label="按客户" value="customer" />
              <el-option label="按部门" value="department" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in profitKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>利润趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>利润构成</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="revenue" label="营收" align="right">
          <template #default="{ row }">{{ formatCurrency(row.revenue) }}</template>
        </el-table-column>
        <el-table-column prop="profit" label="利润" align="right">
          <template #default="{ row }">
            <span style="color: #67C23A; font-weight: 600;">{{ formatCurrency(row.profit) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="margin" label="利润率" align="center">
          <template #default="{ row }">{{ row.margin }}%</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], dimension: 'product' })

const profitKpis = ref([
  { label: '总利润', value: 'SAR 4,296,000', type: 'success' },
  { label: '毛利率', value: '33.4%', type: 'primary' },
  { label: '净利率', value: '12.8%', type: 'warning' },
  { label: '同比增长', value: '+18.5%', type: 'success' },
])

const tableData = ref([
  { product: 'iPhone 15 Pro Max', revenue: 1285000, profit: 429000, margin: 33.4 },
  { product: '三星 Galaxy S24 Ultra', revenue: 985000, profit: 335000, margin: 34.0 },
  { product: 'MacBook Pro 16"', revenue: 876000, profit: 256000, margin: 29.2 },
])

const loading = ref(false)
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '利润'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '营收', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF' } },
        { name: '利润', type: 'line', data: [98, 125, 140, 130, 150, 180, 160, 180, 200, 220, 190, 210], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 35, name: '电子产品', itemStyle: { color: '#409EFF' } },
          { value: 25, name: '服装鞋帽', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '食品饮料', itemStyle: { color: '#E6A23C' } },
          { value: 12, name: '家居用品', itemStyle: { color: '#F56C6C' } },
          { value: 8, name: '其他', itemStyle: { color: '#909399' } },
        ],
        label: { formatter: '{b}\n{d}%' },
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
.stat-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>