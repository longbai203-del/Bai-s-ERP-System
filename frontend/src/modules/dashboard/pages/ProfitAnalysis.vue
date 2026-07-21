<!-- 
  文件路径: frontend/src/modules/dashboard/pages/ProfitAnalysis.vue
  功能: 利润分析 - 深度利润结构分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedDimension" placeholder="分析维度" style="width: 100%">
            <el-option label="产品维度" value="product" />
            <el-option label="客户维度" value="customer" />
            <el-option label="部门维度" value="department" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 分析
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in profitKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">{{ kpi.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>利润瀑布图</span>
          </template>
          <div ref="waterfallRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>毛利率分析</span>
          </template>
          <div ref="marginChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>产品利润排行</span>
          </template>
          <el-table :data="productProfit" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="revenue" label="营收" align="right">
              <template #default="{ row }">{{ formatCurrency(row.revenue) }}</template>
            </el-table-column>
            <el-table-column prop="cost" label="成本" align="right">
              <template #default="{ row }">{{ formatCurrency(row.cost) }}</template>
            </el-table-column>
            <el-table-column prop="profit" label="利润" align="right">
              <template #default="{ row }">{{ formatCurrency(row.profit) }}</template>
            </el-table-column>
            <el-table-column prop="margin" label="利润率" align="center">
              <template #default="{ row }">
                <el-tag :type="row.margin >= 30 ? 'success' : row.margin >= 20 ? 'warning' : 'danger'">
                  {{ row.margin }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 90)), new Date()])
const selectedDimension = ref('product')

const profitKpis = ref([
  { label: '总利润', value: 'SAR 5.2M', sub: '↑ 22.3% 同比', type: 'profit' },
  { label: '毛利率', value: '33.4%', sub: '↑ 2.1% 较上期', type: 'margin' },
  { label: '净利率', value: '12.8%', sub: '↑ 1.5% 较上期', type: 'net' },
  { label: 'EBITDA', value: 'SAR 6.8M', sub: '↑ 18.7% 同比', type: 'ebitda' },
])

const productProfit = ref([
  { name: 'iPhone 15 Pro Max', revenue: 1285000, cost: 856000, profit: 429000, margin: 33.4 },
  { name: '三星 Galaxy S24 Ultra', revenue: 985000, cost: 650000, profit: 335000, margin: 34.0 },
  { name: 'MacBook Pro 16"', revenue: 876000, cost: 620000, profit: 256000, margin: 29.2 },
  { name: 'iPad Pro 12.9"', revenue: 654000, cost: 450000, profit: 204000, margin: 31.2 },
  { name: 'AirPods Pro 2', revenue: 523000, cost: 380000, profit: 143000, margin: 27.3 },
])

const waterfallRef = ref<HTMLElement>()
const marginChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const handleSearch = () => {}

const initCharts = async () => {
  await nextTick()

  if (waterfallRef.value) {
    const chart = echarts.init(waterfallRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['营收', '成本', '毛利', '费用', '净利润'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          type: 'bar',
          data: [
            { value: 1285, itemStyle: { color: '#409EFF' } },
            { value: -856, itemStyle: { color: '#F56C6C' } },
            { value: 429, itemStyle: { color: '#67C23A' } },
            { value: -230, itemStyle: { color: '#E6A23C' } },
            { value: 199, itemStyle: { color: '#9B59B6' } },
          ],
          barWidth: '40%',
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (marginChartRef.value) {
    const chart = echarts.init(marginChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          type: 'bar',
          data: [
            { value: 30.2, itemStyle: { color: '#E6A23C' } },
            { value: 31.8, itemStyle: { color: '#67C23A' } },
            { value: 33.4, itemStyle: { color: '#67C23A' } },
            { value: 35.0, itemStyle: { color: '#409EFF' } },
          ],
          barWidth: '50%',
          label: { show: true, position: 'top', formatter: '{c}%' },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; }
.kpi-card.profit { border-left: 4px solid #67C23A; }
.kpi-card.margin { border-left: 4px solid #409EFF; }
.kpi-card.net { border-left: 4px solid #9B59B6; }
.kpi-card.ebitda { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
</style>