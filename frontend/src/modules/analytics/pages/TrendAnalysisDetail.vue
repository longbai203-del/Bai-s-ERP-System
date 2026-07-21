<!-- 
  文件路径: frontend/src/modules/analytics/pages/TrendAnalysisDetail.vue
  功能: 趋势分析详情 - 深度趋势分析
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>趋势分析详情</h2>
          <p class="subtitle">深度趋势数据解读</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>趋势分解</span></template>
          <div ref="decompositionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>趋势统计</span></template>
          <div class="stat-item"><span>趋势斜率</span><span class="stat-value">0.85</span></div>
          <div class="stat-item"><span>R² 拟合度</span><span class="stat-value">0.92</span></div>
          <div class="stat-item"><span>预测误差</span><span class="stat-value">±3.2%</span></div>
          <div class="stat-item"><span>置信区间</span><span class="stat-value">95%</span></div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>趋势预测</span></template>
          <div class="forecast-item">
            <span>下月预测</span>
            <span class="forecast-value">↑ 8.5%</span>
          </div>
          <div class="forecast-item">
            <span>下季预测</span>
            <span class="forecast-value">↑ 12.3%</span>
          </div>
          <div class="forecast-item">
            <span>下年预测</span>
            <span class="forecast-value">↑ 18.7%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const decompositionChartRef = ref<HTMLElement>()

const handleBack = () => { router.push('/analytics/trend') }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (decompositionChartRef.value) {
    const chart = echarts.init(decompositionChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['趋势分量', '季节性分量', '随机分量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '趋势分量', type: 'line', data: [320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540], lineStyle: { color: '#409EFF', width: 3 } },
        { name: '季节性分量', type: 'line', data: [20, 10, 0, -10, -5, 15, 10, 5, -5, -10, 0, 10], lineStyle: { color: '#67C23A', width: 2, type: 'dashed' } },
        { name: '随机分量', type: 'line', data: [5, -3, 2, -1, 4, -2, 3, -1, 2, -3, 1, -2], lineStyle: { color: '#E6A23C', width: 2, type: 'dotted' } },
      ],
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
.chart-container { height: 300px; width: 100%; }
.stat-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.stat-item:last-child { border-bottom: none; }
.stat-value { font-weight: 700; color: #303133; }
.forecast-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.forecast-item:last-child { border-bottom: none; }
.forecast-value { font-weight: 700; color: #409EFF; font-size: 16px; }
</style>