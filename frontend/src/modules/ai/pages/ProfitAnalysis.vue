<!-- 
  文件路径: frontend/src/modules/ai/pages/ProfitAnalysis.vue
  功能: AI利润分析 - 智能利润归因分析
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
            <el-button type="primary" @click="handleAnalyze"><el-icon><Monitor /></el-icon> 分析</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in profitStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>利润归因分析</span></template>
          <div ref="attributionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>AI洞察</span></template>
          <div class="insight-item" v-for="insight in insights" :key="insight.id">
            <div class="insight-icon" :class="insight.type">
              <el-icon><component :is="insight.icon" /></el-icon>
            </div>
            <div class="insight-content">
              <div class="insight-title">{{ insight.title }}</div>
              <div class="insight-desc">{{ insight.desc }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Monitor, Download, TrendCharts, Warning, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [] })

const profitStats = ref([
  { label: '总利润', value: 'SAR 4,296,000', type: 'success' },
  { label: '毛利率', value: '33.4%', type: 'primary' },
  { label: '净利率', value: '12.8%', type: 'warning' },
  { label: '同比增长', value: '+18.5%', type: 'success' },
])

const insights = ref([
  { id: 1, title: '电子产品利润贡献最大', desc: '占总利润的42%，同比增长15%', type: 'success', icon: 'TrendCharts' },
  { id: 2, title: '服装品类利润下滑', desc: '同比下降8.5%，建议调整产品结构', type: 'warning', icon: 'Warning' },
  { id: 3, title: '利雅得地区表现优异', desc: '利润同比增长22%，为最佳区域', type: 'success', icon: 'Check' },
])

const attributionChartRef = ref<HTMLElement>()

const handleAnalyze = () => { ElMessage.success('分析完成') }
const handleExport = () => { ElMessage.success('导出完成') }

const initChart = async () => {
  await nextTick()
  if (attributionChartRef.value) {
    const chart = echarts.init(attributionChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['产品', '客户', '区域', '渠道'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 45, itemStyle: { color: '#409EFF' } },
          { value: 28, itemStyle: { color: '#67C23A' } },
          { value: 18, itemStyle: { color: '#E6A23C' } },
          { value: 9, itemStyle: { color: '#F56C6C' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: '{c}%' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initChart() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.insight-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.insight-item:last-child { border-bottom: none; }
.insight-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
.insight-icon.success { background: #67C23A; }
.insight-icon.warning { background: #E6A23C; }
.insight-icon.info { background: #409EFF; }
.insight-title { font-weight: 600; font-size: 14px; }
.insight-desc { color: #909399; font-size: 13px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>