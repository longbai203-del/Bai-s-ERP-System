<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesAnalysis.vue
  功能: 销售分析 - 多维度销售数据分析
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
              <el-option label="产品维度" value="product" />
              <el-option label="客户维度" value="customer" />
              <el-option label="地区维度" value="region" />
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
          <template #header><span>销售趋势分析</span></template>
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

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>TOP10 产品</span></template>
          <el-table :data="topProducts" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="amount" label="销售额" align="right">
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
          <template #header><span>TOP10 客户</span></template>
          <el-table :data="topCustomers" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="客户名称" />
            <el-table-column prop="amount" label="销售额" align="right">
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
import * as echarts from 'echarts'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], dimension: 'product' })

const topProducts = ref([
  { name: 'iPhone 15 Pro Max', amount: 1285000, share: 28 },
  { name: '三星 Galaxy S24 Ultra', amount: 985000, share: 21 },
  { name: 'MacBook Pro 16"', amount: 876000, share: 19 },
  { name: 'iPad Pro 12.9"', amount: 654000, share: 14 },
  { name: 'AirPods Pro 2', amount: 523000, share: 11 },
  { name: 'Apple Watch Ultra 2', amount: 487000, share: 10 },
])

const topCustomers = ref([
  { name: '沙特电信公司', amount: 2856000, share: 22 },
  { name: '阿尔拉吉银行', amount: 2568000, share: 20 },
  { name: '沙特阿美', amount: 2234000, share: 17 },
  { name: '利雅得银行', amount: 1987000, share: 15 },
  { name: '沙特航空', amount: 1765000, share: 14 },
  { name: 'SABIC', amount: 1654000, share: 13 },
])

const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
const handleSearch = () => {}
const handleReset = () => {}
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '订单量', '客单价'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: [
        { type: 'value', name: '销售额', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '数量', splitLine: { show: false } },
      ],
      series: [
        { name: '销售额', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF' } },
        { name: '订单量', type: 'line', yAxisIndex: 1, data: [80, 95, 105, 98, 112, 130, 120, 135, 145, 155, 140, 150], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
        { name: '客单价', type: 'line', yAxisIndex: 1, data: [4000, 4000, 4000, 3980, 4018, 4000, 4000, 4000, 4000, 4000, 4000, 4000], lineStyle: { color: '#E6A23C', width: 3, type: 'dashed' } },
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
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>