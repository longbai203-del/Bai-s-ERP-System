<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerAnalysis.vue
  功能: 客户分析 - 多维度客户数据分析
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
            <el-select v-model="searchForm.analysisType" placeholder="分析类型" style="width: 100%">
              <el-option label="客户价值" value="value" />
              <el-option label="客户活跃度" value="activity" />
              <el-option label="客户留存" value="retention" />
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

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in analysisStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header><span>客户价值分布</span></template>
          <div ref="valueChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>客户留存曲线</span></template>
          <div ref="retentionChartRef" class="chart-container"></div>
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

const searchForm = reactive({ dateRange: [] as [Date, Date] | [], analysisType: 'value' })

const analysisStats = ref([
  { label: '总客户数', value: '2,858', type: 'primary' },
  { label: '活跃客户', value: '1,856', type: 'success' },
  { label: '客户流失率', value: '8.5%', type: 'danger' },
  { label: '平均客户价值', value: 'SAR 29,930', type: 'warning' },
])

const valueChartRef = ref<HTMLElement>()
const retentionChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.dateRange = []; searchForm.analysisType = 'value' }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (valueChartRef.value) {
    const chart = echarts.init(valueChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['0-1万', '1-5万', '5-10万', '10-50万', '50万以上'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 856, itemStyle: { color: '#409EFF' } },
          { value: 520, itemStyle: { color: '#67C23A' } },
          { value: 386, itemStyle: { color: '#E6A23C' } },
          { value: 128, itemStyle: { color: '#F56C6C' } },
          { value: 45, itemStyle: { color: '#9B59B6' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (retentionChartRef.value) {
    const chart = echarts.init(retentionChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['第1月', '第2月', '第3月', '第6月', '第12月'] },
      yAxis: { type: 'value', min: 0, max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'line',
        data: [100, 85, 72, 58, 45],
        smooth: true,
        lineStyle: { color: '#409EFF', width: 3 },
        areaStyle: { color: 'rgba(64,158,255,0.2)' },
        label: { show: true, formatter: '{c}%' },
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
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>