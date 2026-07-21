<!-- 
  文件路径: frontend/src/modules/inventory/pages/AbcAnalysis.vue
  功能: ABC分析 - 库存ABC分类分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="分析基准">
              <el-select v-model="searchForm.basis" style="width: 100%">
                <el-option label="销售额" value="sales" />
                <el-option label="销售量" value="quantity" />
                <el-option label="利润贡献" value="profit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
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

    <!-- ABC统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="8" v-for="stat in abcStats" :key="stat.class">
        <el-card class="stat-card" :class="stat.class">
          <div class="stat-label">{{ stat.class }}类产品</div>
          <div class="stat-value">{{ stat.count }}个</div>
          <div class="stat-sub">占比: {{ stat.percentage }}%</div>
          <el-progress :percentage="stat.percentage" :color="stat.class === 'A' ? '#F56C6C' : stat.class === 'B' ? '#E6A23C' : '#67C23A'" />
          <div class="stat-sub">累计占比: {{ stat.cumulative }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>ABC分类曲线</span></template>
          <div ref="abcChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>分类明细</span></template>
          <el-table :data="abcDetail" style="width: 100%">
            <el-table-column prop="class" label="分类" align="center" width="80">
              <template #default="{ row }">
                <el-tag :type="row.class === 'A' ? 'danger' : row.class === 'B' ? 'warning' : 'success'">
                  {{ row.class }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="产品数" align="center" />
            <el-table-column prop="percentage" label="占比" align="center" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类列表 -->
    <el-card style="margin-top: 20px">
      <template #header><span>A类产品明细</span></template>
      <el-table :data="aClassProducts" style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" />
        <el-table-column prop="sales" label="销售额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.sales) }}</template>
        </el-table-column>
        <el-table-column prop="percentage" label="占比" align="center">
          <template #default="{ row }"><el-progress :percentage="row.percentage" :color="'#F56C6C'" /></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ basis: 'sales', dateRange: [] as [Date, Date] | [] })

const abcStats = ref([
  { class: 'A', count: 128, percentage: 10, cumulative: 10, color: '#F56C6C' },
  { class: 'B', count: 386, percentage: 30, cumulative: 40, color: '#E6A23C' },
  { class: 'C', count: 772, percentage: 60, cumulative: 100, color: '#67C23A' },
])

const abcDetail = ref([
  { class: 'A', count: 128, percentage: '10%' },
  { class: 'B', count: 386, percentage: '30%' },
  { class: 'C', count: 772, percentage: '60%' },
])

const aClassProducts = ref([
  { product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', sales: 1285000, percentage: 15 },
  { product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', sales: 985000, percentage: 11.5 },
  { product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', sales: 876000, percentage: 10.2 },
  { product: 'iPad Pro 12.9"', sku: 'IPP-129-M2-256', sales: 654000, percentage: 7.6 },
  { product: 'AirPods Pro 2', sku: 'APP-2-WH', sales: 523000, percentage: 6.1 },
])

const abcChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => {}
const handleExport = () => { ElMessage.success('导出完成') }

const initChart = async () => {
  await nextTick()
  if (abcChartRef.value) {
    const chart = echarts.init(abcChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['累计占比', '产品占比'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['A类(10%)', 'B类(30%)', 'C类(60%)'] },
      yAxis: [
        { type: 'value', name: '占比(%)', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '产品数', splitLine: { show: false } },
      ],
      series: [
        {
          name: '累计占比',
          type: 'line',
          yAxisIndex: 0,
          data: [10, 40, 100],
          smooth: true,
          lineStyle: { color: '#409EFF', width: 3 },
          areaStyle: { color: 'rgba(64,158,255,0.1)' },
        },
        {
          name: '产品占比',
          type: 'bar',
          yAxisIndex: 1,
          data: [
            { value: 128, itemStyle: { color: '#F56C6C' } },
            { value: 386, itemStyle: { color: '#E6A23C' } },
            { value: 772, itemStyle: { color: '#67C23A' } },
          ],
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
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 16px; }
.stat-card.A { border-left: 4px solid #F56C6C; }
.stat-card.B { border-left: 4px solid #E6A23C; }
.stat-card.C { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 28px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-sub { color: #909399; font-size: 12px; margin-top: 4px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 300px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>