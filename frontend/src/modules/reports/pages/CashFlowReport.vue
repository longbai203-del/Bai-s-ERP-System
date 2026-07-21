<!-- 
  文件路径: frontend/src/modules/reports/pages/CashFlowReport.vue
  功能: 现金流报表 - 现金流量分析报表
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
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in cashflowKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>现金流趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>现金流构成</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="category" label="项目" />
        <el-table-column prop="inflow" label="流入" align="right">
          <template #default="{ row }">{{ formatCurrency(row.inflow) }}</template>
        </el-table-column>
        <el-table-column prop="outflow" label="流出" align="right">
          <template #default="{ row }">{{ formatCurrency(row.outflow) }}</template>
        </el-table-column>
        <el-table-column prop="net" label="净额" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.net >= 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.net) }}
            </span>
          </template>
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

const searchForm = reactive({ dateRange: [] as [Date, Date] | [] })

const cashflowKpis = ref([
  { label: '经营现金流', value: 'SAR 2,856,000', type: 'success' },
  { label: '投资现金流', value: 'SAR -856,000', type: 'danger' },
  { label: '融资现金流', value: 'SAR 1,200,000', type: 'primary' },
  { label: '期末余额', value: 'SAR 4,656,000', type: 'primary' },
])

const tableData = ref([
  { category: '销售收款', inflow: 2856000, outflow: 0, net: 2856000 },
  { category: '采购付款', inflow: 0, outflow: 1568000, net: -1568000 },
  { category: '工资支出', inflow: 0, outflow: 856000, net: -856000 },
  { category: '投资支出', inflow: 0, outflow: 450000, net: -450000 },
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
      legend: { data: ['经营现金流', '投资现金流', '融资现金流'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '经营现金流', type: 'bar', data: [320, 380, 420, 390, 450, 520], itemStyle: { color: '#67C23A' } },
        { name: '投资现金流', type: 'bar', data: [-120, -80, -150, -100, -200, -80], itemStyle: { color: '#F56C6C' } },
        { name: '融资现金流', type: 'bar', data: [200, -100, 0, 150, -50, 0], itemStyle: { color: '#409EFF' } },
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
          { value: 65, name: '经营活动', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '投资活动', itemStyle: { color: '#F56C6C' } },
          { value: 15, name: '融资活动', itemStyle: { color: '#409EFF' } },
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
.kpi-card.danger { border-left: 4px solid #F56C6C; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>