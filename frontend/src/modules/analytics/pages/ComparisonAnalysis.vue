<!-- 
  文件路径: frontend/src/modules/analytics/pages/ComparisonAnalysis.vue
  功能: 对比分析 - 多维度对比分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="对比维度">
              <el-select v-model="searchForm.dimension" style="width: 100%">
                <el-option label="产品对比" value="product" />
                <el-option label="区域对比" value="region" />
                <el-option label="渠道对比" value="channel" />
                <el-option label="时间对比" value="time" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="对比指标">
              <el-select v-model="searchForm.metric" style="width: 100%">
                <el-option label="销售额" value="sales" />
                <el-option label="增长率" value="growth" />
                <el-option label="利润率" value="margin" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="对比数量">
              <el-input-number v-model="searchForm.limit" :min="2" :max="10" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 对比</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleDetail"><el-icon><View /></el-icon> 详情</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 对比KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in comparisonKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">{{ kpi.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对比图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>对比分析</span></template>
          <div ref="comparisonChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>差距分析</span></template>
          <div ref="gapChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对比明细 -->
    <el-card style="margin-top: 20px">
      <template #header><span>对比明细</span></template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="value" label="数值" align="right" />
        <el-table-column prop="rank" label="排名" align="center" width="80" />
        <el-table-column prop="gap" label="差距" align="center">
          <template #default="{ row }">
            <el-tag :type="row.gap >= 0 ? 'success' : 'danger'">
              {{ row.gap >= 0 ? '+' : '' }}{{ row.gap }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="趋势" align="center" width="80">
          <template #default="{ row }">
            <el-tag :type="row.trend >= 0 ? 'success' : 'danger'">
              {{ row.trend >= 0 ? '↑' : '↓' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download, View } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const searchForm = reactive({
  dimension: 'product',
  metric: 'sales',
  limit: 5,
})

const comparisonKpis = ref([
  { label: '最优值', value: 'SAR 1,285,000', sub: 'iPhone 15 Pro Max' },
  { label: '平均值', value: 'SAR 856,000', sub: '整体平均' },
  { label: '中位数', value: 'SAR 654,000', sub: '中间值' },
  { label: '差距率', value: '48.5%', sub: '最优与最差差距' },
])

const tableData = ref([
  { name: 'iPhone 15 Pro Max', value: 1285000, rank: 1, gap: 0, trend: 12.5 },
  { name: '三星 Galaxy S24 Ultra', value: 985000, rank: 2, gap: -23.3, trend: 8.3 },
  { name: 'MacBook Pro 16"', value: 876000, rank: 3, gap: -31.8, trend: -3.2 },
  { name: 'iPad Pro 12.9"', value: 654000, rank: 4, gap: -49.1, trend: 5.7 },
])

const comparisonChartRef = ref<HTMLElement>()
const gapChartRef = ref<HTMLElement>()

const handleSearch = () => { ElMessage.success('对比完成') }
const handleReset = () => { searchForm.dimension = 'product'; searchForm.metric = 'sales'; searchForm.limit = 5 }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = () => { router.push('/analytics/comparison/detail') }

const initCharts = async () => {
  await nextTick()
  if (comparisonChartRef.value) {
    const chart = echarts.init(comparisonChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['iPhone', '三星', 'MacBook', 'iPad', 'AirPods'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 1285, itemStyle: { color: '#F56C6C' } },
          { value: 985, itemStyle: { color: '#E6A23C' } },
          { value: 876, itemStyle: { color: '#409EFF' } },
          { value: 654, itemStyle: { color: '#67C23A' } },
          { value: 523, itemStyle: { color: '#9B59B6' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: (params: any) => 'SAR ' + params.value + 'K' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (gapChartRef.value) {
    const chart = echarts.init(gapChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['iPhone', '三星', 'MacBook', 'iPad'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 0, itemStyle: { color: '#67C23A' } },
          { value: -23.3, itemStyle: { color: '#E6A23C' } },
          { value: -31.8, itemStyle: { color: '#F56C6C' } },
          { value: -49.1, itemStyle: { color: '#F56C6C' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: (params: any) => params.value + '%' },
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
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>