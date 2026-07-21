<!-- 
  文件路径: frontend/src/modules/ai/pages/SalesPrediction.vue
  功能: AI销售预测 - 智能销售预测
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
                <el-option label="Prophet" value="prophet" />
                <el-option label="LSTM" value="lstm" />
                <el-option label="ARIMA" value="arima" />
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
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in predictionKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">置信度: {{ kpi.confidence }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预测图表 -->
    <el-card class="chart-card">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>销售预测趋势</span>
          <el-tag type="warning" size="small">🤖 AI预测</el-tag>
        </div>
      </template>
      <div ref="predictionChartRef" class="chart-container"></div>
    </el-card>

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
        <el-table-column prop="confidence" label="置信度" align="center">{{ row.confidence }}%</el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Monitor, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ period: '30d', model: 'prophet' })

const predictionKpis = ref([
  { label: '预测总销售额', value: 'SAR 4,856,000', confidence: 92, type: 'primary' },
  { label: '预测订单数', value: '486 单', confidence: 88, type: 'success' },
  { label: '预测增长率', value: '+15.6%', confidence: 85, type: 'warning' },
  { label: '模型准确率', value: '92.3%', confidence: 95, type: 'success' },
])

const forecastDetail = ref([
  { period: '第1周', predictedSales: 320000, lowerBound: 290000, upperBound: 350000, confidence: 95 },
  { period: '第2周', predictedSales: 380000, lowerBound: 345000, upperBound: 415000, confidence: 92 },
  { period: '第3周', predictedSales: 420000, lowerBound: 380000, upperBound: 460000, confidence: 90 },
  { period: '第4周', predictedSales: 465000, lowerBound: 420000, upperBound: 510000, confidence: 88 },
])

const predictionChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handlePredict = () => { ElMessage.success('预测已生成') }
const handleExport = () => { ElMessage.success('导出完成') }

const initChart = async () => {
  await nextTick()
  if (predictionChartRef.value) {
    const chart = echarts.init(predictionChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['历史数据', '预测值', '置信区间'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '历史数据', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF' } },
        { name: '预测值', type: 'line', data: [null, null, null, null, null, null, null, null, null, null, null, null, 680, 720], smooth: true, lineStyle: { color: '#F56C6C', width: 3 } },
        { name: '置信区间', type: 'line', data: [null, null, null, null, null, null, null, null, null, null, null, null, 650, 690], lineStyle: { color: '#E6A23C', width: 2, type: 'dotted' } },
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
.stat-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 300px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>