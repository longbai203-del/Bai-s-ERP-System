<!-- 
  文件路径: frontend/src/modules/finance/pages/FinancialAnalysis.vue
  功能: 财务分析 - 多维度财务数据分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.analysisType" placeholder="分析类型" style="width: 100%">
              <el-option label="财务比率" value="ratio" />
              <el-option label="趋势分析" value="trend" />
              <el-option label="结构分析" value="structure" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 分析</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 财务比率 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="ratio in financialRatios" :key="ratio.label">
        <el-card class="ratio-card" :class="ratio.status">
          <div class="ratio-label">{{ ratio.label }}</div>
          <div class="ratio-value">{{ ratio.value }}</div>
          <div class="ratio-status">{{ ratio.status === 'healthy' ? '健康' : '需关注' }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>财务趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>杜邦分析</span></template>
          <div ref="duPontChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 财务健康度 -->
    <el-card style="margin-top: 20px">
      <template #header><span>财务健康度评分</span></template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="health in healthIndicators" :key="health.label">
          <div class="health-item">
            <div class="health-label">{{ health.label }}</div>
            <div class="health-value">{{ health.value }}</div>
            <el-progress :percentage="health.score" :color="health.color" />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ period: new Date(), analysisType: 'ratio' })

const financialRatios = ref([
  { label: '流动比率', value: '2.8', status: 'healthy' },
  { label: '速动比率', value: '1.6', status: 'healthy' },
  { label: '资产负债率', value: '45.2%', status: 'healthy' },
  { label: '毛利率', value: '33.4%', status: 'healthy' },
  { label: '净利率', value: '12.8%', status: 'healthy' },
  { label: 'ROE', value: '18.5%', status: 'healthy' },
])

const healthIndicators = ref([
  { label: '偿债能力', value: 'A级', score: 92, color: '#67C23A' },
  { label: '盈利能力', value: 'A级', score: 88, color: '#67C23A' },
  { label: '运营效率', value: 'B级', score: 76, color: '#E6A23C' },
  { label: '成长能力', value: 'A级', score: 85, color: '#67C23A' },
])

const trendChartRef = ref<HTMLElement>()
const duPontChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => {}
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '净利润', '毛利率'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis: [
        { type: 'value', name: '营收(万)', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '毛利率(%)', splitLine: { show: false } },
      ],
      series: [
        { name: '营收', type: 'bar', data: [3200, 3800, 4200, 4600], itemStyle: { color: '#409EFF' } },
        { name: '净利润', type: 'bar', data: [980, 1250, 1400, 1570], itemStyle: { color: '#67C23A' } },
        { name: '毛利率', type: 'line', yAxisIndex: 1, data: [30.6, 32.9, 33.3, 34.1], lineStyle: { color: '#E6A23C', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (duPontChartRef.value) {
    const chart = echarts.init(duPontChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'treemap',
        data: [
          {
            name: 'ROE 18.5%',
            children: [
              { name: '净利率 12.8%', value: 128 },
              { name: '资产周转率 1.2', value: 120 },
              { name: '权益乘数 1.8', value: 180 },
            ],
          },
        ],
        label: { show: true, formatter: '{b}' },
        itemStyle: { borderColor: '#fff' },
        levels: [
          { itemStyle: { borderWidth: 0, gapWidth: 5 } },
          { itemStyle: { gapWidth: 2 } },
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
.stat-row { margin-bottom: 20px; }
.ratio-card { text-align: center; border-radius: 12px; padding: 16px; }
.ratio-card.healthy { border-left: 4px solid #67C23A; }
.ratio-card.unhealthy { border-left: 4px solid #F56C6C; }
.ratio-label { color: #909399; font-size: 14px; }
.ratio-value { font-size: 24px; font-weight: 700; color: #303133; margin: 4px 0; }
.ratio-status { font-size: 12px; color: #909399; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.health-item { text-align: center; padding: 12px; border-right: 1px solid #e4e7ed; }
.health-item:last-child { border-right: none; }
.health-label { color: #909399; font-size: 13px; }
.health-value { font-size: 20px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>