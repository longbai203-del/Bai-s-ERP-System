<!-- 
  文件路径: frontend/src/modules/saas/pages/SaasAnalytics.vue
  功能: SaaS分析 - SaaS数据分析
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
            <el-select v-model="searchForm.metric" placeholder="选择指标" style="width: 100%">
              <el-option label="MRR" value="mrr" />
              <el-option label="用户数" value="users" />
              <el-option label="租户数" value="tenants" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 分析</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in saasAnalyticsKpis" :key="kpi.label">
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
          <template #header><span>MRR增长趋势</span></template>
          <div ref="mrrChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>租户分布</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 明细 -->
    <el-card style="margin-top: 20px">
      <template #header><span>SaaS指标明细</span></template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="mrr" label="MRR" align="right">
          <template #default="{ row }">{{ formatCurrency(row.mrr) }}</template>
        </el-table-column>
        <el-table-column prop="tenants" label="租户数" align="center" />
        <el-table-column prop="users" label="用户数" align="center" />
        <el-table-column prop="arpu" label="ARPU" align="right">
          <template #default="{ row }">{{ formatCurrency(row.arpu) }}</template>
        </el-table-column>
        <el-table-column prop="churn" label="流失率" align="center">
          <template #default="{ row }">{{ row.churn }}%</template>
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

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], metric: 'mrr' })

const saasAnalyticsKpis = ref([
  { label: 'MRR', value: 'SAR 856,000', change: 12.5, trend: 'up' },
  { label: 'ARR', value: 'SAR 10,272,000', change: 15.3, trend: 'up' },
  { label: 'ARPU', value: 'SAR 2,993', change: 3.2, trend: 'up' },
  { label: '流失率', value: '2.5%', change: -0.8, trend: 'down' },
])

const tableData = ref([
  { month: '2024-06', mrr: 720000, tenants: 256, users: 2856, arpu: 2813, churn: 2.8 },
  { month: '2024-07', mrr: 750000, tenants: 262, users: 2956, arpu: 2863, churn: 2.6 },
  { month: '2024-08', mrr: 780000, tenants: 268, users: 3056, arpu: 2910, churn: 2.5 },
  { month: '2024-09', mrr: 810000, tenants: 275, users: 3156, arpu: 2945, churn: 2.3 },
  { month: '2024-10', mrr: 830000, tenants: 280, users: 3256, arpu: 2964, churn: 2.2 },
  { month: '2024-11', mrr: 856000, tenants: 286, users: 3356, arpu: 2993, churn: 2.0 },
])

const mrrChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.dateRange = []; searchForm.metric = 'mrr' }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (mrrChartRef.value) {
    const chart = echarts.init(mrrChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['MRR', '租户数'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['6月', '7月', '8月', '9月', '10月', '11月'] },
      yAxis: [
        { type: 'value', name: 'MRR', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '租户数', splitLine: { show: false } },
      ],
      series: [
        { name: 'MRR', type: 'bar', data: [720, 750, 780, 810, 830, 856], itemStyle: { color: '#409EFF' } },
        { name: '租户数', type: 'line', yAxisIndex: 1, data: [256, 262, 268, 275, 280, 286], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
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
          { value: 45, name: '企业版', itemStyle: { color: '#409EFF' } },
          { value: 30, name: '专业版', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '标准版', itemStyle: { color: '#E6A23C' } },
          { value: 5, name: '基础版', itemStyle: { color: '#909399' } },
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