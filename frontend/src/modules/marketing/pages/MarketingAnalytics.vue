<!-- 
  文件路径: frontend/src/modules/marketing/pages/MarketingAnalytics.vue
  功能: 营销分析 - 营销效果分析
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
            <el-select v-model="searchForm.channel" placeholder="选择渠道" clearable style="width: 100%">
              <el-option label="全部" value="all" />
              <el-option label="邮件" value="email" />
              <el-option label="社交媒体" value="social" />
              <el-option label="线下" value="offline" />
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
      <el-col :span="6" v-for="kpi in analyticsKpis" :key="kpi.label">
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
          <template #header><span>营销ROI趋势</span></template>
          <div ref="roiChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>渠道贡献</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
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

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], channel: 'all' })

const analyticsKpis = ref([
  { label: '营销总支出', value: 'SAR 2,856,000', change: 8.5, trend: 'up' },
  { label: '总营收贡献', value: 'SAR 8,560,000', change: 12.3, trend: 'up' },
  { label: '整体ROI', value: '285%', change: 5.6, trend: 'up' },
  { label: '客户获取成本', value: 'SAR 285', change: -3.2, trend: 'down' },
])

const roiChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.dateRange = []; searchForm.channel = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (roiChartRef.value) {
    const chart = echarts.init(roiChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['支出', '营收', 'ROI'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: [
        { type: 'value', name: '金额', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: 'ROI(%)', splitLine: { show: false } },
      ],
      series: [
        { name: '支出', type: 'bar', data: [320, 380, 420, 390, 450, 520], itemStyle: { color: '#F56C6C' } },
        { name: '营收', type: 'bar', data: [960, 1140, 1260, 1170, 1350, 1560], itemStyle: { color: '#67C23A' } },
        { name: 'ROI', type: 'line', yAxisIndex: 1, data: [200, 200, 200, 200, 200, 200], lineStyle: { color: '#409EFF', width: 3 }, smooth: true },
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
          { value: 35, name: '邮件营销', itemStyle: { color: '#409EFF' } },
          { value: 30, name: '社交媒体', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '线下活动', itemStyle: { color: '#E6A23C' } },
          { value: 15, name: '其他', itemStyle: { color: '#F56C6C' } },
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