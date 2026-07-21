<!-- 
  文件路径: frontend/src/modules/analytics/pages/TrendAnalysis.vue
  功能: 趋势分析 - 业务趋势分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="分析指标">
              <el-select v-model="searchForm.metric" style="width: 100%">
                <el-option label="销售额" value="sales" />
                <el-option label="订单量" value="orders" />
                <el-option label="客户数" value="customers" />
                <el-option label="利润" value="profit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间粒度">
              <el-select v-model="searchForm.granularity" style="width: 100%">
                <el-option label="日" value="day" />
                <el-option label="周" value="week" />
                <el-option label="月" value="month" />
                <el-option label="季度" value="quarter" />
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
      <el-col :span="6" v-for="kpi in trendKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.trend">{{ kpi.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主趋势图 -->
    <el-card class="chart-card">
      <template #header><span>趋势分析</span></template>
      <div ref="trendChartRef" class="chart-container" style="height: 320px;"></div>
    </el-card>

    <!-- 季节性分析 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>季节性分析</span></template>
          <div ref="seasonalChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>趋势洞察</span></template>
          <div class="insight-list">
            <div v-for="insight in insights" :key="insight.id" class="insight-item">
              <el-icon :color="insight.type === 'positive' ? '#67C23A' : '#F56C6C'">
                <component :is="insight.type === 'positive' ? 'Check' : 'Warning'" />
              </el-icon>
              <span>{{ insight.text }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download, View, Check, Warning } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const searchForm = reactive({
  metric: 'sales',
  granularity: 'month',
})

const trendKpis = ref([
  { label: '整体趋势', value: '↑ 12.5%', change: 12.5, trend: 'up' },
  { label: '环比增长', value: '3.2%', change: 3.2, trend: 'up' },
  { label: '同比增长', value: '18.5%', change: 18.5, trend: 'up' },
  { label: '趋势强度', value: '0.85', change: 0.05, trend: 'up' },
])

const insights = ref([
  { id: 1, text: 'Q3-Q4呈现明显增长趋势，节假日效应显著', type: 'positive' },
  { id: 2, text: '7月份出现季节性低点，建议提前准备', type: 'warning' },
  { id: 3, text: '增长趋势持续加强，建议加大投入', type: 'positive' },
])

const trendChartRef = ref<HTMLElement>()
const seasonalChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.metric = 'sales'; searchForm.granularity = 'month' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = () => { router.push('/analytics/trend/detail') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['实际值', '趋势线', '预测值'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '实际值', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF' } },
        { name: '趋势线', type: 'line', data: [340, 360, 400, 410, 440, 480, 500, 530, 560, 590, 580, 620], smooth: true, lineStyle: { color: '#67C23A', width: 3 } },
        { name: '预测值', type: 'line', data: [null, null, null, null, null, null, null, null, null, null, null, 640], smooth: true, lineStyle: { color: '#F56C6C', width: 3, type: 'dashed' } },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (seasonalChartRef.value) {
    const chart = echarts.init(seasonalChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'line',
        data: [85, 90, 92, 88, 95, 100, 80, 92, 98, 105, 102, 108],
        smooth: true,
        lineStyle: { color: '#E6A23C', width: 3 },
        areaStyle: { color: 'rgba(230, 162, 60, 0.2)' },
        label: { show: true, formatter: (params: any) => params.value + '%' },
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
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-change { font-size: 12px; }
.kpi-change.up { color: #67C23A; }
.kpi-change.down { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.insight-list { padding: 8px 0; }
.insight-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.insight-item:last-child { border-bottom: none; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>