<!-- 
  文件路径: frontend/src/modules/analytics/pages/CustomerAnalyticsDetail.vue
  功能: 客户分析详情 - 深度客户分析
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>客户分析详情</h2>
          <p class="subtitle">深度客户行为分析</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
        </div>
      </div>
    </el-card>

    <!-- 客户生命周期 -->
    <el-card>
      <template #header><span>客户生命周期分析</span></template>
      <div ref="lifecycleChartRef" class="chart-container" style="height: 250px;"></div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
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

    <el-card style="margin-top: 20px">
      <template #header><span>客户洞察</span></template>
      <el-row :gutter="20">
        <el-col :span="8" v-for="insight in insights" :key="insight.title">
          <div class="insight-card">
            <div class="insight-icon" :class="insight.type">
              <el-icon><component :is="insight.icon" /></el-icon>
            </div>
            <div class="insight-title">{{ insight.title }}</div>
            <div class="insight-desc">{{ insight.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, TrendCharts, User, Warning, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const insights = ref([
  { title: '企业客户价值高', desc: '企业客户平均价值是个人客户的3.2倍', type: 'success', icon: 'TrendCharts' },
  { title: 'VIP客户流失风险', desc: '近期VIP客户活跃度下降12%', type: 'warning', icon: 'Warning' },
  { title: '新客户留存率提升', desc: '新客户30天留存率提升至45%', type: 'success', icon: 'Check' },
])

const lifecycleChartRef = ref<HTMLElement>()
const valueChartRef = ref<HTMLElement>()
const retentionChartRef = ref<HTMLElement>()

const handleBack = () => { router.push('/analytics/customer') }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (lifecycleChartRef.value) {
    const chart = echarts.init(lifecycleChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['潜在', '意向', '新客户', '活跃', '忠诚', '流失'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 40, itemStyle: { color: '#909399' } },
          { value: 35, itemStyle: { color: '#409EFF' } },
          { value: 28, itemStyle: { color: '#67C23A' } },
          { value: 22, itemStyle: { color: '#409EFF' } },
          { value: 15, itemStyle: { color: '#F56C6C' } },
          { value: 8, itemStyle: { color: '#909399' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (valueChartRef.value) {
    const chart = echarts.init(valueChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['0-1万', '1-5万', '5-10万', '10-50万', '50万+'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 30, itemStyle: { color: '#909399' } },
          { value: 28, itemStyle: { color: '#409EFF' } },
          { value: 20, itemStyle: { color: '#67C23A' } },
          { value: 15, itemStyle: { color: '#E6A23C' } },
          { value: 7, itemStyle: { color: '#F56C6C' } },
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
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.chart-container { height: 280px; width: 100%; }
.insight-card { text-align: center; padding: 16px; border-radius: 8px; background: #f5f7fa; }
.insight-icon { width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; }
.insight-icon.success { background: #67C23A; }
.insight-icon.warning { background: #E6A23C; }
.insight-icon.info { background: #409EFF; }
.insight-title { font-weight: 600; font-size: 15px; }
.insight-desc { color: #909399; font-size: 13px; margin-top: 4px; }
</style>