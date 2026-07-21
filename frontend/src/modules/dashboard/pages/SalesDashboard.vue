<!-- 
  文件路径: frontend/src/modules/dashboard/pages/SalesDashboard.vue
  功能: 销售仪表盘 - 展示销售业务核心指标
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
          <el-select v-model="selectedSalesperson" placeholder="选择销售员" style="width: 100%">
            <el-option label="全部销售" value="all" />
            <el-option label="Ahmed Al-Fahd" value="ahmed" />
            <el-option label="Mohammed Al-Qahtani" value="mohammed" />
            <el-option label="Saud Al-Otaibi" value="saud" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedRegion" placeholder="选择区域" style="width: 100%">
            <el-option label="全部区域" value="all" />
            <el-option label="利雅得" value="riyadh" />
            <el-option label="吉达" value="jeddah" />
            <el-option label="达曼" value="dammam" />
            <el-option label="麦加" value="makkah" />
            <el-option label="麦地那" value="madinah" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- KPI卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="4" v-for="kpi in salesKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.change >= 0 ? 'positive' : 'negative'">
            {{ kpi.change >= 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="salesPeriod" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesTrendRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>销售渠道占比</span>
          </template>
          <div ref="channelChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>销售目标完成率</span>
          </template>
          <div ref="targetChartRef" class="chart-container" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>销售员排行</span>
          </template>
          <el-table :data="salesRanking" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column prop="name" label="销售员" />
            <el-table-column prop="amount" label="销售额" align="right">
              <template #default="{ row }">
                {{ formatCurrency(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="target" label="目标完成率" align="right">
              <template #default="{ row }">
                <el-progress :percentage="row.completion" :color="row.completion >= 90 ? '#67C23A' : row.completion >= 70 ? '#E6A23C' : '#F56C6C'" />
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

// 数据
const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()])
const selectedSalesperson = ref('all')
const selectedRegion = ref('all')
const salesPeriod = ref('month')

const salesKpis = ref([
  { label: '总销售额', value: 'SAR 1,285,600', change: 12.5 },
  { label: '订单数', value: '1,286', change: 8.3 },
  { label: '客单价', value: 'SAR 998', change: 3.2 },
  { label: '转化率', value: '32.5%', change: -1.8 },
  { label: '复购率', value: '45.8%', change: 2.1 },
])

const salesRanking = ref([
  { name: 'Ahmed Al-Fahd', amount: 285600, completion: 95 },
  { name: 'Mohammed Al-Qahtani', amount: 256800, completion: 88 },
  { name: 'Saud Al-Otaibi', amount: 223400, completion: 76 },
  { name: 'Faisal Al-Dossary', amount: 198700, completion: 82 },
  { name: 'Khalid Al-Ghamdi', amount: 176500, completion: 70 },
])

const salesTrendRef = ref<HTMLElement>()
const channelChartRef = ref<HTMLElement>()
const targetChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const handleSearch = () => { /* 搜索逻辑 */ }
const handleReset = () => { /* 重置逻辑 */ }

const initCharts = async () => {
  await nextTick()

  if (salesTrendRef.value) {
    const chart = echarts.init(salesTrendRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '订单量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1日', '3日', '5日', '7日', '9日', '11日', '13日', '15日', '17日', '19日', '21日', '23日', '25日', '27日', '29日', '31日'],
      },
      yAxis: [
        { type: 'value', name: '销售额(SAR)', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '订单量', splitLine: { show: false } },
      ],
      series: [
        {
          name: '销售额',
          type: 'bar',
          data: [82, 96, 78, 105, 92, 118, 132, 98, 115, 126, 134, 108, 145, 128, 156, 142],
          itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: '订单量',
          type: 'line',
          yAxisIndex: 1,
          data: [24, 28, 22, 30, 26, 34, 38, 28, 32, 36, 38, 30, 42, 36, 45, 40],
          lineStyle: { color: '#E6A23C', width: 3 },
          smooth: true,
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (channelChartRef.value) {
    const chart = echarts.init(channelChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 45, name: '线下门店', itemStyle: { color: '#409EFF' } },
            { value: 25, name: '在线商城', itemStyle: { color: '#67C23A' } },
            { value: 15, name: '电话销售', itemStyle: { color: '#E6A23C' } },
            { value: 10, name: '社交媒体', itemStyle: { color: '#F56C6C' } },
            { value: 5, name: '其他渠道', itemStyle: { color: '#909399' } },
          ],
          label: { formatter: '{b}\n{d}%' },
          emphasis: { scale: true },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (targetChartRef.value) {
    const chart = echarts.init(targetChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['目标', '实际'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '目标', type: 'bar', data: [200, 220, 240, 260, 280, 300], itemStyle: { color: '#909399' } },
        { name: '实际', type: 'bar', data: [180, 210, 230, 250, 290, 320], itemStyle: { color: '#409EFF' } },
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
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-change { font-size: 12px; }
.kpi-change.positive { color: #67C23A; }
.kpi-change.negative { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>