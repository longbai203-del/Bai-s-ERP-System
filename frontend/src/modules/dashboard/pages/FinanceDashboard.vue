<!-- 
  文件路径: frontend/src/modules/dashboard/pages/FinanceDashboard.vue
  功能: 财务仪表盘 - 展示财务核心指标
-->

<template>
  <div class="page-container">
    <!-- 筛选区域 -->
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
          <el-select v-model="selectedPeriod" placeholder="选择周期" style="width: 100%">
            <el-option label="本月" value="month" />
            <el-option label="本季" value="quarter" />
            <el-option label="本年" value="year" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 财务KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="4" v-for="kpi in financeKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">{{ kpi.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <span>收入 vs 支出</span>
          </template>
          <div ref="incomeExpenseRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>费用结构</span>
          </template>
          <div ref="expenseStructureRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>现金流</span>
          </template>
          <div ref="cashFlowRef" class="chart-container" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>财务健康度</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="health in healthIndicators" :key="health.label">
              <div class="health-item">
                <div class="health-label">{{ health.label }}</div>
                <div class="health-value">{{ health.value }}</div>
                <el-progress :percentage="health.percentage" :color="health.color" />
                <div class="health-status">{{ health.status }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()])
const selectedPeriod = ref('month')

const financeKpis = ref([
  { label: '总收入', value: 'SAR 1,285,600', sub: '↑ 12.5% 较上月', type: 'income' },
  { label: '总支出', value: 'SAR 856,200', sub: '↑ 8.3% 较上月', type: 'expense' },
  { label: '净利润', value: 'SAR 429,400', sub: '↑ 18.7% 较上月', type: 'profit' },
  { label: '毛利率', value: '33.4%', sub: '↑ 2.1% 较上月', type: 'margin' },
  { label: '现金流', value: 'SAR 856,700', sub: '↑ 5.6% 较上月', type: 'cash' },
])

const healthIndicators = ref([
  { label: '资产负债率', value: '45.2%', percentage: 45, color: '#67C23A', status: '健康' },
  { label: '流动比率', value: '2.8', percentage: 85, color: '#67C23A', status: '良好' },
  { label: '速动比率', value: '1.6', percentage: 75, color: '#E6A23C', status: '一般' },
  { label: '利息保障倍数', value: '8.5', percentage: 90, color: '#409EFF', status: '优秀' },
])

const incomeExpenseRef = ref<HTMLElement>()
const expenseStructureRef = ref<HTMLElement>()
const cashFlowRef = ref<HTMLElement>()

const handleSearch = () => {}

const initCharts = async () => {
  await nextTick()

  if (incomeExpenseRef.value) {
    const chart = echarts.init(incomeExpenseRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['收入', '支出'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '收入', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] } },
        { name: '支出', type: 'bar', data: [220, 250, 280, 260, 300, 340, 320, 360, 380, 400, 370, 390], itemStyle: { color: '#F56C6C', borderRadius: [4, 4, 0, 0] } },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (expenseStructureRef.value) {
    const chart = echarts.init(expenseStructureRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 35, name: '采购成本', itemStyle: { color: '#409EFF' } },
            { value: 20, name: '人力成本', itemStyle: { color: '#67C23A' } },
            { value: 15, name: '租金', itemStyle: { color: '#E6A23C' } },
            { value: 12, name: '营销费用', itemStyle: { color: '#F56C6C' } },
            { value: 10, name: '行政费用', itemStyle: { color: '#909399' } },
            { value: 8, name: '其他', itemStyle: { color: '#9B59B6' } },
          ],
          label: { formatter: '{b}\n{d}%' },
          emphasis: { scale: true },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (cashFlowRef.value) {
    const chart = echarts.init(cashFlowRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          type: 'bar',
          data: [
            { value: 120, itemStyle: { color: '#67C23A' } },
            { value: -80, itemStyle: { color: '#F56C6C' } },
            { value: 150, itemStyle: { color: '#67C23A' } },
            { value: -100, itemStyle: { color: '#F56C6C' } },
            { value: 200, itemStyle: { color: '#67C23A' } },
            { value: -60, itemStyle: { color: '#F56C6C' } },
          ],
          barWidth: '50%',
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
.kpi-card.income { border-left: 4px solid #409EFF; }
.kpi-card.expense { border-left: 4px solid #F56C6C; }
.kpi-card.profit { border-left: 4px solid #67C23A; }
.kpi-card.margin { border-left: 4px solid #E6A23C; }
.kpi-card.cash { border-left: 4px solid #9B59B6; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.health-item { text-align: center; padding: 12px; }
.health-label { color: #909399; font-size: 13px; }
.health-value { font-size: 20px; font-weight: 700; color: #303133; margin: 4px 0; }
.health-status { color: #909399; font-size: 12px; margin-top: 4px; }
</style>