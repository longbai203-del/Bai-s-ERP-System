<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseAnalysis.vue
  功能: 采购分析 - 多维度采购数据分析
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
              <el-option label="供应商维度" value="supplier" />
              <el-option label="产品维度" value="product" />
              <el-option label="时间维度" value="time" />
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

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>采购趋势分析</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>供应商占比</span></template>
          <div ref="supplierChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>TOP10 采购产品</span></template>
          <el-table :data="topProducts" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="amount" label="采购额" align="right">
              <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
            </el-table-column>
            <el-table-column prop="share" label="占比" align="center">
              <template #default="{ row }"><el-progress :percentage="row.share" :show-text="false" /></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>TOP10 供应商</span></template>
          <el-table :data="topSuppliers" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="供应商" />
            <el-table-column prop="amount" label="采购额" align="right">
              <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
            </el-table-column>
            <el-table-column prop="share" label="占比" align="center">
              <template #default="{ row }"><el-progress :percentage="row.share" :show-text="false" /></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], dimension: 'supplier' })

const topProducts = ref([
  { name: 'iPhone 15 Pro Max', amount: 1285000, share: 28 },
  { name: '三星 Galaxy S24 Ultra', amount: 985000, share: 21 },
  { name: 'MacBook Pro 16"', amount: 876000, share: 19 },
  { name: 'iPad Pro 12.9"', amount: 654000, share: 14 },
  { name: 'AirPods Pro 2', amount: 523000, share: 11 },
])

const topSuppliers = ref([
  { name: 'Apple Supplier', amount: 2856000, share: 32 },
  { name: 'Samsung Supplier', amount: 2568000, share: 28 },
  { name: 'Dell Supplier', amount: 2234000, share: 25 },
  { name: 'Sony Supplier', amount: 1987000, share: 22 },
  { name: 'LG Supplier', amount: 1765000, share: 19 },
])

const trendChartRef = ref<HTMLElement>()
const supplierChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => {}
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['采购金额', '采购数量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: [
        { type: 'value', name: '金额', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '数量', splitLine: { show: false } },
      ],
      series: [
        { name: '采购金额', type: 'bar', data: [280, 320, 360, 340, 380, 420, 400, 440, 460, 480, 450, 490], itemStyle: { color: '#409EFF' } },
        { name: '采购数量', type: 'line', yAxisIndex: 1, data: [180, 210, 240, 220, 260, 290, 270, 310, 330, 350, 320, 360], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (supplierChartRef.value) {
    const chart = echarts.init(supplierChartRef.value)
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
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>