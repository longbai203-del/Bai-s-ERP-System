<!-- 
  文件路径: frontend/src/modules/analytics/pages/CustomerAnalytics.vue
  功能: 客户分析 - 客户画像与行为分析
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
            <el-form-item label="客户类型">
              <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 100%">
                <el-option label="企业客户" value="business" />
                <el-option label="个人客户" value="individual" />
                <el-option label="VIP客户" value="vip" />
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
      <el-col :span="6" v-for="kpi in customerKpis" :key="kpi.label">
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
          <template #header><span>客户增长趋势</span></template>
          <div ref="growthChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>客户类型分布</span></template>
          <div ref="typeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 客户画像 -->
    <el-card style="margin-top: 20px">
      <template #header><span>客户画像分析</span></template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="profile in profiles" :key="profile.label">
          <div class="profile-item">
            <div class="profile-label">{{ profile.label }}</div>
            <div class="profile-value">{{ profile.value }}</div>
            <el-progress :percentage="profile.percentage" :color="profile.percentage > 70 ? '#67C23A' : '#409EFF'" />
          </div>
        </el-col>
      </el-row>
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
  type: '',
})

const customerKpis = ref([
  { label: '总客户数', value: '2,856', change: 12.5, trend: 'up' },
  { label: '活跃客户', value: '1,856', change: 8.3, trend: 'up' },
  { label: '新增客户', value: '286', change: 15.2, trend: 'up' },
  { label: '客户流失率', value: '4.5%', change: -1.8, trend: 'down' },
])

const profiles = ref([
  { label: '企业客户占比', value: '45.6%', percentage: 45.6 },
  { label: 'VIP客户占比', value: '15.2%', percentage: 15.2 },
  { label: '高活跃度客户', value: '32.8%', percentage: 32.8 },
  { label: '高复购率客户', value: '28.5%', percentage: 28.5 },
])

const growthChartRef = ref<HTMLElement>()
const typeChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.dateRange = []; searchForm.type = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = () => { router.push('/analytics/customer/detail') }

const initCharts = async () => {
  await nextTick()
  if (growthChartRef.value) {
    const chart = echarts.init(growthChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['新增客户', '活跃客户'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '新增客户', type: 'bar', data: [120, 150, 180, 160, 200, 240], itemStyle: { color: '#409EFF' } },
        { name: '活跃客户', type: 'line', data: [320, 380, 420, 400, 460, 520], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (typeChartRef.value) {
    const chart = echarts.init(typeChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45, name: '企业客户', itemStyle: { color: '#409EFF' } },
          { value: 35, name: '个人客户', itemStyle: { color: '#67C23A' } },
          { value: 15, name: 'VIP客户', itemStyle: { color: '#F56C6C' } },
          { value: 5, name: '其他', itemStyle: { color: '#909399' } },
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
.profile-item { text-align: center; padding: 12px; border-right: 1px solid #e4e7ed; }
.profile-item:last-child { border-right: none; }
.profile-label { color: #909399; font-size: 13px; }
.profile-value { font-size: 20px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>