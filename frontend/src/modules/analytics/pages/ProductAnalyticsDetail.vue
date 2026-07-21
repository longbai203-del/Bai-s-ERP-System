<!-- 
  文件路径: frontend/src/modules/analytics/pages/ProductAnalyticsDetail.vue
  功能: 产品分析详情 - 深度产品分析
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>产品分析详情</h2>
          <p class="subtitle">深度产品数据分析</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
        </div>
      </div>
    </el-card>

    <!-- 产品核心数据 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="8" v-for="kpi in productKpis" :key="kpi.label">
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
          <template #header><span>产品生命周期分析</span></template>
          <div ref="lifecycleChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>产品健康度</span></template>
          <div ref="healthChartRef" class="chart-container" style="height: 250px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header><span>产品优化建议</span></template>
      <el-timeline>
        <el-timeline-item
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          :type="suggestion.type"
          :timestamp="suggestion.priority"
        >
          <div class="suggestion-title">{{ suggestion.title }}</div>
          <div class="suggestion-desc">{{ suggestion.desc }}</div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const productKpis = ref([
  { label: '总营收', value: 'SAR 12,856,000', sub: '↑ 12.5% 较上期', type: 'primary' },
  { label: '平均毛利率', value: '33.4%', sub: '↑ 2.1% 较上期', type: 'success' },
  { label: 'TOP3占比', value: '68.5%', sub: '集中度高', type: 'warning' },
])

const suggestions = ref([
  { id: 1, title: 'iPhone 15 Pro Max 库存优化', desc: '建议增加20%备货，预期销售增长15%', type: 'success', priority: '高' },
  { id: 2, title: '三星 Galaxy S24 价格策略', desc: '建议调整价格至SAR 4,500，提升竞争力', type: 'warning', priority: '中' },
  { id: 3, title: 'MacBook Pro 16" 市场推广', desc: '加大企业客户推广力度，提升B2B销量', type: 'primary', priority: '中' },
])

const lifecycleChartRef = ref<HTMLElement>()
const healthChartRef = ref<HTMLElement>()

const handleBack = () => { router.push('/analytics/product') }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (lifecycleChartRef.value) {
    const chart = echarts.init(lifecycleChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['引入期', '成长期', '成熟期', '衰退期'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['iPhone', '三星', 'MacBook', 'iPad', 'AirPods'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '引入期', type: 'bar', stack: 'total', data: [5, 10, 15, 8, 12], itemStyle: { color: '#909399' } },
        { name: '成长期', type: 'bar', stack: 'total', data: [20, 30, 25, 18, 22], itemStyle: { color: '#409EFF' } },
        { name: '成熟期', type: 'bar', stack: 'total', data: [50, 45, 35, 40, 30], itemStyle: { color: '#67C23A' } },
        { name: '衰退期', type: 'bar', stack: 'total', data: [25, 15, 25, 34, 36], itemStyle: { color: '#F56C6C' } },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (healthChartRef.value) {
    const chart = echarts.init(healthChartRef.value)
    chart.setOption({
      series: [{
        type: 'gauge',
        progress: { show: true, width: 18 },
        axisLine: { lineStyle: { width: 18, color: [[0.85, '#67C23A'], [0.95, '#E6A23C'], [1, '#F56C6C']] } },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
        axisLabel: { distance: 25, color: '#999', fontSize: 14 },
        pointer: { width: 5, length: '70%' },
        detail: { formatter: '{value}分', fontSize: 24, fontWeight: 700, color: '#303133' },
        data: [{ value: 85, name: '产品健康度' }],
        title: { fontSize: 14, color: '#909399', offsetCenter: [0, '30%'] },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initCharts() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.suggestion-title { font-weight: 600; font-size: 15px; }
.suggestion-desc { color: #606266; font-size: 13px; }
</style>