<!-- 
  文件路径: frontend/src/modules/analytics/pages/ChannelAnalytics.vue
  功能: 渠道分析 - 渠道效果分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="渠道类型">
              <el-select v-model="searchForm.channelType" placeholder="全部" clearable style="width: 100%">
                <el-option label="线下门店" value="offline" />
                <el-option label="在线商城" value="online" />
                <el-option label="社交媒体" value="social" />
                <el-option label="电话销售" value="phone" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 分析</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleDetail"><el-icon><View /></el-icon> 详情</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in channelKpis" :key="kpi.label">
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
          <template #header><span>渠道表现趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>渠道占比</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 渠道明细 -->
    <el-card style="margin-top: 20px">
      <template #header><span>渠道明细</span></template>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="channel" label="渠道名称" />
        <el-table-column prop="visitors" label="访问量" align="center" />
        <el-table-column prop="conversion" label="转化率" align="center">
          <template #default="{ row }"><el-progress :percentage="row.conversion" :color="row.conversion > 20 ? '#67C23A' : '#E6A23C'" /></template>
        </el-table-column>
        <el-table-column prop="revenue" label="营收" align="right">
          <template #default="{ row }">{{ formatCurrency(row.revenue) }}</template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" align="right">
          <template #default="{ row }">{{ formatCurrency(row.cost) }}</template>
        </el-table-column>
        <el-table-column prop="roi" label="ROI" align="center">
          <template #default="{ row }">
            <el-tag :type="row.roi > 300 ? 'success' : row.roi > 150 ? 'warning' : 'danger'">
              {{ row.roi }}%
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download, View } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const searchForm = reactive({
  dateRange: [] as [Date, Date] | [],
  channelType: '',
})

const channelKpis = ref([
  { label: '总访问量', value: '128,560', change: 12.5, trend: 'up' },
  { label: '总转化率', value: '18.5%', change: 2.3, trend: 'up' },
  { label: '总营收', value: 'SAR 12,856,000', change: 15.2, trend: 'up' },
  { label: '平均ROI', value: '285%', change: 8.5, trend: 'up' },
])

const tableData = ref([
  { channel: '线下门店', visitors: 85600, conversion: 22.5, revenue: 8560000, cost: 2800000, roi: 305.7 },
  { channel: '在线商城', visitors: 28600, conversion: 18.2, revenue: 2856000, cost: 1200000, roi: 238.0 },
  { channel: '社交媒体', visitors: 8560, conversion: 12.8, revenue: 856000, cost: 450000, roi: 190.2 },
])

const loading = ref(false)
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.dateRange = []; searchForm.channelType = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = () => { router.push('/analytics/channel/detail') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['线下门店', '在线商城', '社交媒体'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '线下门店', type: 'bar', data: [320, 380, 420, 390, 450, 520], itemStyle: { color: '#409EFF' } },
        { name: '在线商城', type: 'bar', data: [120, 150, 180, 160, 200, 240], itemStyle: { color: '#67C23A' } },
        { name: '社交媒体', type: 'line', data: [80, 95, 105, 98, 112, 130], lineStyle: { color: '#E6A23C', width: 3 }, smooth: true },
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
          { value: 55, name: '线下门店', itemStyle: { color: '#409EFF' } },
          { value: 25, name: '在线商城', itemStyle: { color: '#67C23A' } },
          { value: 15, name: '社交媒体', itemStyle: { color: '#E6A23C' } },
          { value: 5, name: '电话销售', itemStyle: { color: '#F56C6C' } },
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