<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerSource.vue
  功能: 客户来源 - 分析客户来源渠道
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
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 分析</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header><span>客户来源分布</span></template>
          <div ref="sourceChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>来源占比</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>来源渠道明细</span></template>
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="source" label="渠道名称" />
            <el-table-column prop="count" label="客户数" align="center" />
            <el-table-column label="占比" align="center" width="200">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="row.percentage > 20 ? '#67C23A' : '#409EFF'" />
              </template>
            </el-table-column>
            <el-table-column prop="conversionRate" label="转化率" align="center">
              <template #default="{ row }">{{ row.conversionRate }}%</template>
            </el-table-column>
            <el-table-column prop="avgOrderValue" label="平均客单价" align="right">
              <template #default="{ row }">{{ formatCurrency(row.avgOrderValue) }}</template>
            </el-table-column>
          </el-table>
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

const searchForm = reactive({ dateRange: [] as [Date, Date] | [] })

const tableData = ref([
  { source: '线下门店', count: 856, percentage: 35, conversionRate: 82, avgOrderValue: 28560 },
  { source: '官网', count: 520, percentage: 21, conversionRate: 75, avgOrderValue: 35600 },
  { source: '社交媒体', count: 386, percentage: 16, conversionRate: 68, avgOrderValue: 22500 },
  { source: '电话销售', count: 320, percentage: 13, conversionRate: 72, avgOrderValue: 29800 },
  { source: '推荐介绍', count: 256, percentage: 10, conversionRate: 88, avgOrderValue: 42500 },
  { source: '其他', count: 120, percentage: 5, conversionRate: 55, avgOrderValue: 18500 },
])

const sourceChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.dateRange = [] }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (sourceChartRef.value) {
    const chart = echarts.init(sourceChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: tableData.value.map(d => d.source) },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: tableData.value.map((d, i) => ({
          value: d.count,
          itemStyle: { color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6', '#1ABC9C'][i] }
        })),
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: (params: any) => params.value + '人' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: tableData.value.map(d => ({ value: d.count, name: d.source })),
        label: { formatter: '{b}\n{d}%' },
        emphasis: { scale: true },
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
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>