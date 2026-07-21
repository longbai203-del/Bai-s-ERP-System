<!-- 
  文件路径: frontend/src/modules/reports/pages/PurchaseReport.vue
  功能: 采购报表 - 采购数据报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
          </el-col>
          <el-col :span="5">
            <el-select v-model="searchForm.dimension" placeholder="分析维度" style="width: 100%">
              <el-option label="按供应商" value="supplier" />
              <el-option label="按产品" value="product" />
              <el-option label="按类别" value="category" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in purchaseKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>采购趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>供应商占比</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="orders" label="订单数" align="center" />
        <el-table-column prop="amount" label="采购金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="onTimeRate" label="准时率" align="center">
          <template #default="{ row }">{{ row.onTimeRate }}%</template>
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

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], dimension: 'supplier' })

const purchaseKpis = ref([
  { label: '采购总额', value: 'SAR 8,560,000' },
  { label: '采购订单数', value: '286' },
  { label: '供应商数量', value: '58' },
  { label: '交货准时率', value: '96.8%' },
])

const tableData = ref([
  { supplier: 'Apple Supplier', orders: 86, amount: 2856000, onTimeRate: 98 },
  { supplier: 'Samsung Supplier', orders: 72, amount: 2568000, onTimeRate: 95 },
  { supplier: 'Dell Supplier', orders: 58, amount: 2234000, onTimeRate: 92 },
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
      legend: { data: ['采购金额'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{ type: 'bar', data: [280, 320, 360, 340, 380, 420, 400, 440, 460, 480, 450, 490], itemStyle: { color: '#409EFF' } }],
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
          { value: 32, name: 'Apple', itemStyle: { color: '#409EFF' } },
          { value: 28, name: 'Samsung', itemStyle: { color: '#67C23A' } },
          { value: 25, name: 'Dell', itemStyle: { color: '#E6A23C' } },
          { value: 15, name: 'Sony', itemStyle: { color: '#F56C6C' } },
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
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>