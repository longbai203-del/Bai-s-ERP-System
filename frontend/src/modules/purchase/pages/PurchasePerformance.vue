<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchasePerformance.vue
  功能: 采购绩效 - 采购部门绩效考核
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="searchForm.period" placeholder="选择周期" style="width: 100%">
              <el-option label="本月" value="month" />
              <el-option label="本季" value="quarter" />
              <el-option label="本年" value="year" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.buyer" placeholder="选择采购员" clearable style="width: 100%">
              <el-option label="全部" value="all" />
              <el-option label="Ahmed Al-Fahd" value="ahmed" />
              <el-option label="Mohammed Al-Qahtani" value="mohammed" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in performanceKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.trend">{{ kpi.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 绩效排名 -->
    <el-card>
      <template #header><span>采购员绩效排名</span></template>
      <el-table :data="rankingData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column type="index" label="排名" width="70">
          <template #default="{ $index }">
            <div class="rank-badge" :class="getRankClass($index)">{{ $index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="采购员" />
        <el-table-column prop="poCount" label="采购单数" align="center" />
        <el-table-column prop="totalAmount" label="采购总额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
        </el-table-column>
        <el-table-column prop="savings" label="节省金额" align="right">
          <template #default="{ row }">
            <span style="color: #67C23A;">{{ formatCurrency(row.savings) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="savingsRate" label="节省率" align="center">
          <template #default="{ row }">{{ row.savingsRate }}%</template>
        </el-table-column>
        <el-table-column prop="onTimeRate" label="准时率" align="center">
          <template #default="{ row }">{{ row.onTimeRate }}%</template>
        </el-table-column>
        <el-table-column prop="rating" label="评级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.rating === 'A' ? 'success' : row.rating === 'B' ? 'primary' : 'warning'">
              {{ row.rating }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 绩效图表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>采购绩效趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>绩效雷达图</span></template>
          <div ref="radarChartRef" class="chart-container"></div>
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

const searchForm = reactive({ period: 'month', buyer: 'all' })

const performanceKpis = ref([
  { label: '采购总额', value: 'SAR 3,856,200', change: 12.5, trend: 'up' },
  { label: '采购单数', value: '286', change: 8.3, trend: 'up' },
  { label: '成本节省', value: 'SAR 456,000', change: 15.6, trend: 'up' },
  { label: '准时交货率', value: '96.8%', change: 2.1, trend: 'up' },
])

const rankingData = ref([
  { name: 'Ahmed Al-Fahd', poCount: 86, totalAmount: 1856000, savings: 256000, savingsRate: 12.1, onTimeRate: 98.5, rating: 'A' },
  { name: 'Mohammed Al-Qahtani', poCount: 72, totalAmount: 1568000, savings: 198000, savingsRate: 11.2, onTimeRate: 96.8, rating: 'A' },
  { name: 'Saud Al-Otaibi', poCount: 58, totalAmount: 1234000, savings: 142000, savingsRate: 10.3, onTimeRate: 95.2, rating: 'B' },
  { name: 'Faisal Al-Dossary', poCount: 45, totalAmount: 987000, savings: 98000, savingsRate: 9.0, onTimeRate: 93.5, rating: 'B' },
  { name: 'Khalid Al-Ghamdi', poCount: 25, totalAmount: 523000, savings: 45000, savingsRate: 7.9, onTimeRate: 91.0, rating: 'C' },
])

const loading = ref(false)
const trendChartRef = ref<HTMLElement>()
const radarChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const getRankClass = (index: number) => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.buyer = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['采购金额', '节省金额'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '采购金额', type: 'bar', data: [280, 320, 360, 340, 380, 420], itemStyle: { color: '#409EFF' } },
        { name: '节省金额', type: 'line', data: [28, 35, 42, 38, 45, 52], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (radarChartRef.value) {
    const chart = echarts.init(radarChartRef.value)
    chart.setOption({
      radar: {
        indicator: [
          { name: '成本控制', max: 100 },
          { name: '准时率', max: 100 },
          { name: '质量管控', max: 100 },
          { name: '供应商管理', max: 100 },
          { name: '谈判能力', max: 100 },
          { name: '合规性', max: 100 },
        ],
        shape: 'circle',
        splitNumber: 5,
      },
      series: [{
        type: 'radar',
        data: [
          { value: [85, 98, 88, 82, 90, 95], name: '当前', areaStyle: { color: 'rgba(64,158,255,0.3)' }, lineStyle: { color: '#409EFF', width: 2 } },
          { value: [90, 95, 92, 88, 92, 95], name: '目标', lineStyle: { color: '#F56C6C', width: 2, type: 'dashed' } },
        ],
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
.kpi-card { text-align: center; border-radius: 12px; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-change { font-size: 12px; }
.kpi-change.up { color: #67C23A; }
.kpi-change.down { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.rank-badge { display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background: #f0f0f0; color: #666; font-weight: 600; font-size: 12px; }
.rank-badge.rank-1 { background: #FFD700; color: #8B6914; font-size: 14px; }
.rank-badge.rank-2 { background: #C0C0C0; color: #666; font-size: 14px; }
.rank-badge.rank-3 { background: #CD7F32; color: #FFF; font-size: 14px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>