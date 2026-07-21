<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesPerformance.vue
  功能: 业务员绩效 - 销售员业绩考核看板
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="searchForm.salesperson" placeholder="选择销售员" style="width: 100%">
              <el-option label="全部销售" value="all" />
              <el-option label="Ahmed Al-Fahd" value="ahmed" />
              <el-option label="Mohammed Al-Qahtani" value="mohammed" />
              <el-option label="Saud Al-Otaibi" value="saud" />
              <el-option label="Faisal Al-Dossary" value="faisal" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.period" placeholder="选择周期" style="width: 100%">
              <el-option label="本月" value="month" />
              <el-option label="本季" value="quarter" />
              <el-option label="本年" value="year" />
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
      <template #header><span>销售员绩效排名</span></template>
      <el-table :data="rankingData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column type="index" label="排名" width="70">
          <template #default="{ $index }">
            <div class="rank-badge" :class="getRankClass($index)">{{ $index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="销售员" />
        <el-table-column prop="sales" label="销售额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.sales) }}</template>
        </el-table-column>
        <el-table-column prop="orders" label="订单数" align="center" />
        <el-table-column prop="target" label="目标" align="right">
          <template #default="{ row }">{{ formatCurrency(row.target) }}</template>
        </el-table-column>
        <el-table-column label="完成率" align="center" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.completion" :color="row.completion >= 90 ? '#67C23A' : row.completion >= 70 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评级" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.rating === 'A' ? 'success' : row.rating === 'B' ? 'primary' : row.rating === 'C' ? 'warning' : 'danger'">
              {{ row.rating }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="奖金" align="right">
          <template #default="{ row }">{{ formatCurrency(row.bonus) }}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 绩效图表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>绩效趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>绩效构成</span></template>
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

const searchForm = reactive({ salesperson: 'all', period: 'month' })

const performanceKpis = ref([
  { label: '总销售额', value: 'SAR 12,856,000', change: 12.5, trend: 'up' },
  { label: '总订单数', value: '1,286', change: 8.3, trend: 'up' },
  { label: '平均完成率', value: '91.2%', change: 3.5, trend: 'up' },
  { label: 'A级人数', value: '8人', change: 2, trend: 'up' },
])

const rankingData = ref([
  { name: 'Ahmed Al-Fahd', sales: 4856000, orders: 256, target: 5000000, completion: 97.1, rating: 'A', bonus: 48560 },
  { name: 'Mohammed Al-Qahtani', sales: 3568000, orders: 198, target: 4000000, completion: 89.2, rating: 'B', bonus: 28544 },
  { name: 'Saud Al-Otaibi', sales: 3234000, orders: 185, target: 3500000, completion: 92.4, rating: 'A', bonus: 32340 },
  { name: 'Faisal Al-Dossary', sales: 2587000, orders: 156, target: 3000000, completion: 86.2, rating: 'B', bonus: 20700 },
  { name: 'Khalid Al-Ghamdi', sales: 1987000, orders: 120, target: 2500000, completion: 79.5, rating: 'C', bonus: 11920 },
  { name: 'Abdullah Al-Shammari', sales: 1654000, orders: 98, target: 2000000, completion: 82.7, rating: 'B', bonus: 13232 },
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
const handleReset = () => { searchForm.salesperson = 'all' }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '完成率'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: [
        { type: 'value', name: '销售额', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '完成率', min: 0, max: 100, splitLine: { show: false } },
      ],
      series: [
        { name: '销售额', type: 'bar', data: [320, 380, 420, 390, 450, 520], itemStyle: { color: '#409EFF' } },
        { name: '完成率', type: 'line', yAxisIndex: 1, data: [85, 87, 88, 90, 92, 95], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (radarChartRef.value) {
    const chart = echarts.init(radarChartRef.value)
    chart.setOption({
      radar: {
        indicator: [
          { name: '销售额', max: 100 },
          { name: '订单量', max: 100 },
          { name: '客户满意度', max: 100 },
          { name: '产品知识', max: 100 },
          { name: '沟通能力', max: 100 },
          { name: '团队协作', max: 100 },
        ],
        shape: 'circle',
        splitNumber: 5,
      },
      series: [{
        type: 'radar',
        data: [
          { value: [95, 92, 88, 90, 85, 90], name: 'Ahmed', areaStyle: { color: 'rgba(64,158,255,0.3)' }, lineStyle: { color: '#409EFF', width: 2 } },
          { value: [85, 88, 90, 85, 92, 88], name: 'Mohammed', areaStyle: { color: 'rgba(103,194,58,0.3)' }, lineStyle: { color: '#67C23A', width: 2 } },
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