<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesForecast.vue
  功能: 销售预测 - AI驱动的销售预测分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="预测周期">
              <el-select v-model="searchForm.period" style="width: 100%">
                <el-option label="未来30天" value="30d" />
                <el-option label="未来60天" value="60d" />
                <el-option label="未来90天" value="90d" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预测模型">
              <el-select v-model="searchForm.model" style="width: 100%">
                <el-option label="机器学习" value="ml" />
                <el-option label="时间序列" value="time_series" />
                <el-option label="神经网络" value="neural" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handlePredict"><el-icon><Monitor /></el-icon> 生成预测</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 预测KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in forecastKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">置信区间: {{ kpi.confidence }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预测图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <span>销售预测趋势</span>
            <el-tag type="warning" size="small">AI预测</el-tag>
          </template>
          <div ref="forecastChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>预测精度</span></template>
          <div class="accuracy-detail">
            <div class="accuracy-item">
              <span>MAE</span>
              <span>SAR 12,500</span>
            </div>
            <div class="accuracy-item">
              <span>RMSE</span>
              <span>SAR 18,200</span>
            </div>
            <div class="accuracy-item">
              <span>MAPE</span>
              <span>8.5%</span>
            </div>
            <div class="accuracy-item">
              <span>R²</span>
              <span>0.92</span>
            </div>
          </div>
          <el-divider />
          <div class="accuracy-summary">
            <div class="accuracy-score">
              <span>模型准确率</span>
              <span style="font-size: 28px; font-weight: 700; color: #67C23A;">91.5%</span>
            </div>
            <el-progress :percentage="91.5" color="#67C23A" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预测明细 -->
    <el-card style="margin-top: 20px">
      <template #header><span>预测明细数据</span></template>
      <el-table :data="forecastDetail" style="width: 100%" stripe>
        <el-table-column prop="period" label="周期" />
        <el-table-column prop="predictedSales" label="预测销售额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.predictedSales) }}</template>
        </el-table-column>
        <el-table-column prop="lowerBound" label="下限" align="right">
          <template #default="{ row }">{{ formatCurrency(row.lowerBound) }}</template>
        </el-table-column>
        <el-table-column prop="upperBound" label="上限" align="right">
          <template #default="{ row }">{{ formatCurrency(row.upperBound) }}</template>
        </el-table-column>
        <el-table-column prop="confidence" label="置信度" align="center">
          <template #default="{ row }">{{ row.confidence }}%</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Monitor, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ period: '30d', model: 'ml' })

const forecastKpis = ref([
  { label: '预测总销售额', value: 'SAR 4,856,000', confidence: '±8.5%', type: 'primary' },
  { label: '预测订单数', value: '486 单', confidence: '±5.2%', type: 'success' },
  { label: '预测增长', value: '+15.6%', confidence: '±3.8%', type: 'warning' },
  { label: '预测准确性', value: '91.5%', confidence: '较高', type: 'success' },
])

const forecastDetail = ref([
  { period: '第1周', predictedSales: 320000, lowerBound: 290000, upperBound: 350000, confidence: 95 },
  { period: '第2周', predictedSales: 380000, lowerBound: 345000, upperBound: 415000, confidence: 93 },
  { period: '第3周', predictedSales: 420000, lowerBound: 380000, upperBound: 460000, confidence: 90 },
  { period: '第4周', predictedSales: 465000, lowerBound: 420000, upperBound: 510000, confidence: 88 },
  { period: '第5周', predictedSales: 510000, lowerBound: 460000, upperBound: 560000, confidence: 85 },
  { period: '第6周', predictedSales: 560000, lowerBound: 505000, upperBound: 615000, confidence: 82 },
])

const forecastChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handlePredict = () => { ElMessage.success('预测已生成') }
const handleExport = () => { ElMessage.success('导出完成') }

const initChart = async () => {
  await nextTick()
  if (forecastChartRef.value) {
    const chart = echarts.init(forecastChartRef.value)
    const periods = forecastDetail.value.map(d => d.period)
    const predicted = forecastDetail.value.map(d => d.predictedSales)
    const lower = forecastDetail.value.map(d => d.lowerBound)
    const upper = forecastDetail.value.map(d => d.upperBound)

    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['预测值', '上限', '下限'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: periods },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          name: '预测值',
          type: 'line',
          data: predicted,
          smooth: true,
          lineStyle: { color: '#409EFF', width: 3 },
          areaStyle: { color: 'rgba(64,158,255,0.2)' },
          symbol: 'circle',
          symbolSize: 8,
        },
        {
          name: '上限',
          type: 'line',
          data: upper,
          smooth: true,
          lineStyle: { color: '#67C23A', width: 2, type: 'dashed' },
          symbol: 'diamond',
          symbolSize: 6,
        },
        {
          name: '下限',
          type: 'line',
          data: lower,
          smooth: true,
          lineStyle: { color: '#F56C6C', width: 2, type: 'dashed' },
          symbol: 'diamond',
          symbolSize: 6,
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initChart() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 300px; width: 100%; }
.accuracy-detail { padding: 8px 0; }
.accuracy-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
.accuracy-item:last-child { border-bottom: none; }
.accuracy-score { display: flex; justify-content: space-between; align-items: center; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>