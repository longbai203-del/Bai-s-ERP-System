<!-- 
  文件路径: frontend/src/modules/reports/pages/SalesReport.vue
  功能: 销售报表 - 销售数据报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="维度">
              <el-select v-model="searchForm.dimension" placeholder="请选择维度" style="width: 100%">
                <el-option label="按产品" value="product" />
                <el-option label="按客户" value="customer" />
                <el-option label="按地区" value="region" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="报表类型">
              <el-select v-model="searchForm.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="汇总" value="summary" />
                <el-option label="明细" value="detail" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handlePrint"><el-icon><Printer /></el-icon> 打印</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in salesKpis" :key="kpi.label">
        <el-card class="kpi-card">
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
          <template #header><span>销售趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>销售构成</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 明细表 -->
    <el-card style="margin-top: 20px">
      <template #header><span>销售明细</span></template>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="quantity" label="数量" align="center" />
        <el-table-column prop="amount" label="销售额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" align="right">
          <template #default="{ row }">{{ formatCurrency(row.cost) }}</template>
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
import { Search, Download, Printer } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], dimension: 'product', type: 'summary' })

const salesKpis = ref([
  { label: '总销售额', value: 'SAR 12,856,000', change: 12.5, trend: 'up' },
  { label: '总订单数', value: '1,286', change: 8.3, trend: 'up' },
  { label: '客单价', value: 'SAR 9,998', change: 3.2, trend: 'up' },
  { label: '利润率', value: '33.4%', change: 2.1, trend: 'up' },
])

const tableData = ref([
  { product: 'iPhone 15 Pro Max', quantity: 256, amount: 1285000, cost: 856000, profit: 429000, margin: 33.4 },
  { product: '三星 Galaxy S24 Ultra', quantity: 198, amount: 985000, cost: 650000, profit: 335000, margin: 34.0 },
  { product: 'MacBook Pro 16"', quantity: 86, amount: 876000, cost: 620000, profit: 256000, margin: 29.2 },
])

const loading = ref(false)
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.dateRange = []; searchForm.dimension = 'product' }
const handleExport = () => { ElMessage.success('导出完成') }
const handlePrint = () => { window.print() }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '订单量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: [
        { type: 'value', name: '销售额', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '订单量', splitLine: { show: false } },
      ],
      series: [
        { name: '销售额', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF' } },
        { name: '订单量', type: 'line', yAxisIndex: 1, data: [80, 95, 105, 98, 112, 130, 120, 135, 145, 155, 140, 150], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
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
.stat-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-change { font-size: 12px; }
.kpi-change.up { color: #67C23A; }
.kpi-change.down { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>