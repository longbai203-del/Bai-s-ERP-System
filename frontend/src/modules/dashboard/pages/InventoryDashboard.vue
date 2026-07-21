<!-- 
  文件路径: frontend/src/modules/dashboard/pages/InventoryDashboard.vue
  功能: 库存仪表盘 - 展示库存核心指标
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-select v-model="selectedWarehouse" placeholder="选择仓库" style="width: 100%">
            <el-option label="全部仓库" value="all" />
            <el-option label="利雅得仓库" value="riyadh" />
            <el-option label="吉达仓库" value="jeddah" />
            <el-option label="达曼仓库" value="dammam" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedCategory" placeholder="产品分类" style="width: 100%">
            <el-option label="全部分类" value="all" />
            <el-option label="电子产品" value="electronics" />
            <el-option label="服装鞋帽" value="clothing" />
            <el-option label="食品饮料" value="food" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 库存KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="4" v-for="kpi in inventoryKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.change >= 0 ? 'positive' : 'negative'">
            {{ kpi.change >= 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警 -->
    <el-card style="margin-bottom: 20px">
      <template #header>
        <span style="color: #F56C6C; font-weight: 700;">⚠ 库存预警</span>
      </template>
      <el-table :data="alerts" style="width: 100%">
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="sku" label="SKU" />
        <el-table-column prop="current" label="当前库存" align="center" />
        <el-table-column prop="safety" label="安全库存" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'critical' ? 'danger' : row.status === 'low' ? 'warning' : 'info'">
              {{ row.status === 'critical' ? '紧急补货' : row.status === 'low' ? '库存偏低' : '需关注' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePurchase(row)">生成采购单</el-button>
            <el-button type="warning" size="small" @click="handleTransfer(row)">调拨</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>库存周转率</span>
          </template>
          <div ref="turnoverRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>分类库存占比</span>
          </template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>库存热力图</span>
          </template>
          <div ref="heatmapRef" class="chart-container" style="height: 250px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const selectedWarehouse = ref('all')
const selectedCategory = ref('all')

const inventoryKpis = ref([
  { label: '总库存数量', value: '285,600', change: 3.2 },
  { label: '总库存金额', value: 'SAR 8,560,000', change: 5.8 },
  { label: 'SKU总数', value: '1,286', change: 2.1 },
  { label: '周转天数', value: '28天', change: -3.5 },
  { label: '库存准确率', value: '98.6%', change: 0.8 },
])

const alerts = ref([
  { name: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', current: 5, safety: 20, status: 'critical' },
  { name: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', current: 8, safety: 25, status: 'critical' },
  { name: 'AirPods Pro 2', sku: 'APP-2-WH', current: 12, safety: 30, status: 'low' },
  { name: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', current: 3, safety: 10, status: 'critical' },
  { name: 'iPad Pro 12.9"', sku: 'IPP-129-M2-256', current: 10, safety: 15, status: 'low' },
])

const turnoverRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
const heatmapRef = ref<HTMLElement>()

const handleSearch = () => {}
const handlePurchase = (row: any) => { console.log('生成采购单', row) }
const handleTransfer = (row: any) => { console.log('调拨', row) }

const initCharts = async () => {
  await nextTick()

  if (turnoverRef.value) {
    const chart = echarts.init(turnoverRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          type: 'bar',
          data: [6.8, 7.2, 7.5, 7.8, 8.2, 8.5, 8.8, 9.0, 9.2, 9.5, 9.8, 10.0],
          itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', formatter: '{c}次' },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (categoryChartRef.value) {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 35, name: '电子产品', itemStyle: { color: '#409EFF' } },
            { value: 25, name: '服装鞋帽', itemStyle: { color: '#67C23A' } },
            { value: 20, name: '食品饮料', itemStyle: { color: '#E6A23C' } },
            { value: 12, name: '家居用品', itemStyle: { color: '#F56C6C' } },
            { value: 8, name: '其他', itemStyle: { color: '#909399' } },
          ],
          label: { formatter: '{b}\n{d}%' },
          emphasis: { scale: true },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (heatmapRef.value) {
    const chart = echarts.init(heatmapRef.value)
    const data = [
      [0, 0, 45], [0, 1, 32], [0, 2, 28], [0, 3, 18], [0, 4, 12],
      [1, 0, 38], [1, 1, 25], [1, 2, 20], [1, 3, 15], [1, 4, 8],
      [2, 0, 42], [2, 1, 30], [2, 2, 22], [2, 3, 10], [2, 4, 5],
      [3, 0, 35], [3, 1, 28], [3, 2, 18], [3, 3, 12], [3, 4, 3],
      [4, 0, 30], [4, 1, 22], [4, 2, 15], [4, 3, 8], [4, 4, 2],
    ]
    chart.setOption({
      tooltip: { formatter: (params: any) => {
        const row = ['A区', 'B区', 'C区', 'D区', 'E区'][params.data[0]]
        const col = ['1排', '2排', '3排', '4排', '5排'][params.data[1]]
        return `${row} ${col}: ${params.data[2]}件`
      }},
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1排', '2排', '3排', '4排', '5排'], splitArea: { show: true } },
      yAxis: { type: 'category', data: ['A区', 'B区', 'C区', 'D区', 'E区'], splitArea: { show: true } },
      visualMap: { min: 0, max: 50, calculable: true, inRange: { color: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#66BB6A', '#43A047', '#2E7D32'] } },
      series: [{ type: 'heatmap', data, label: { show: true, color: '#333' }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-change { font-size: 12px; }
.kpi-change.positive { color: #67C23A; }
.kpi-change.negative { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
</style>