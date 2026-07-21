<!-- 
  文件路径: frontend/src/modules/analytics/pages/ChannelAnalyticsDetail.vue
  功能: 渠道分析详情 - 深度渠道分析
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>渠道分析详情</h2>
          <p class="subtitle">深度渠道数据分析</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>渠道ROI对比</span></template>
          <div ref="roiChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>渠道转化漏斗</span></template>
          <div ref="funnelChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header><span>渠道优化建议</span></template>
      <el-row :gutter="20">
        <el-col :span="8" v-for="recommendation in recommendations" :key="recommendation.title">
          <div class="recommendation-card">
            <div class="recommendation-icon" :class="recommendation.type">
              <el-icon><component :is="recommendation.icon" /></el-icon>
            </div>
            <div class="recommendation-title">{{ recommendation.title }}</div>
            <div class="recommendation-desc">{{ recommendation.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, TrendCharts, Warning, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const recommendations = ref([
  { title: '线下门店拓展', desc: 'ROI最高，建议新增2-3家门店', type: 'success', icon: 'TrendCharts' },
  { title: '社交媒体优化', desc: '转化率偏低，建议优化内容策略', type: 'warning', icon: 'Warning' },
  { title: '在线商城升级', desc: '用户体验提升，预期转化率提升5%', type: 'info', icon: 'Check' },
])

const roiChartRef = ref<HTMLElement>()
const funnelChartRef = ref<HTMLElement>()

const handleBack = () => { router.push('/analytics/channel') }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (roiChartRef.value) {
    const chart = echarts.init(roiChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['线下门店', '在线商城', '社交媒体', '电话销售'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 305, itemStyle: { color: '#67C23A' } },
          { value: 238, itemStyle: { color: '#409EFF' } },
          { value: 190, itemStyle: { color: '#E6A23C' } },
          { value: 85, itemStyle: { color: '#F56C6C' } },
        ],
        barWidth: '40%',
        label: { show: true, position: 'top', formatter: '{c}%' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (funnelChartRef.value) {
    const chart = echarts.init(funnelChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'funnel',
        left: '10%',
        right: '10%',
        top: 20,
        bottom: 20,
        min: 0,
        max: 100,
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}\n{c}%' },
        itemStyle: { borderRadius: 4 },
        data: [
          { value: 100, name: '访问', itemStyle: { color: '#409EFF' } },
          { value: 65, name: '浏览', itemStyle: { color: '#67C23A' } },
          { value: 38, name: '咨询', itemStyle: { color: '#E6A23C' } },
          { value: 18, name: '购买', itemStyle: { color: '#F56C6C' } },
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
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.recommendation-card { text-align: center; padding: 16px; border-radius: 8px; background: #f5f7fa; }
.recommendation-icon { width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; }
.recommendation-icon.success { background: #67C23A; }
.recommendation-icon.warning { background: #E6A23C; }
.recommendation-icon.info { background: #409EFF; }
.recommendation-title { font-weight: 600; font-size: 15px; }
.recommendation-desc { color: #909399; font-size: 13px; margin-top: 4px; }
</style>