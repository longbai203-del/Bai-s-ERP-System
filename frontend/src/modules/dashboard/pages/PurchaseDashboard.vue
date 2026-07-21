<!-- 
  文件路径: frontend/src/modules/dashboard/pages/PurchaseDashboard.vue
  功能: 采购仪表盘 - 展示采购核心指标
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedSupplier" placeholder="选择供应商" style="width: 100%">
            <el-option label="全部供应商" value="all" />
            <el-option label="Apple Supplier" value="apple" />
            <el-option label="Samsung Supplier" value="samsung" />
            <el-option label="Dell Supplier" value="dell" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 查询
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20" class="kpi-row">
      <el-col :span="4" v-for="kpi in purchaseKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="kpi.change >= 0 ? 'positive' : 'negative'">
            {{ kpi.change >= 0 ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <span>采购趋势</span>
          </template>
          <div ref="purchaseTrendRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>供应商占比</span>
          </template>
          <div ref="supplierChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>采购订单状态</span>
          </template>
          <div ref="orderStatusRef" class="chart-container" style="height: 250px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>待处理采购单</span>
          </template>
          <el-table :data="pendingOrders" style="width: 100%">
            <el-table-column prop="poNumber" label="采购单号" />
            <el-table-column prop="supplier" label="供应商" />
            <el-table-column prop="amount" label="金额" align="right">
              <template #default="{ row }">
                {{ formatCurrency(row.amount) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === '待审批' ? 'warning' : 'info'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleApprove(row)">审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()])
const selectedSupplier = ref('all')

const purchaseKpis = ref([
  { label: '采购总额', value: 'SAR 3,856,200', change: 8.5 },
  { label: '采购订单数', value: '286', change: 3.2 },
  { label: '平均采购单价', value: 'SAR 13,482', change: -2.1 },
  { label: '供应商数量', value: '58', change: 5.6 },
  { label: '交货准时率', value: '96.8%', change: 1.2 },
])

const pendingOrders = ref([
  { poNumber: 'PO-2024-001', supplier: 'Apple Supplier', amount: 125000, status: '待审批' },
  { poNumber: 'PO-2024-002', supplier: 'Samsung Supplier', amount: 98000, status: '待收货' },
  { poNumber: 'PO-2024-003', supplier: 'Dell Supplier', amount: 75600, status: '待审批' },
  { poNumber: 'PO-2024-004', supplier: 'Sony Supplier', amount: 52300, status: '待付款' },
])

const purchaseTrendRef = ref<HTMLElement>()
const supplierChartRef = ref<HTMLElement>()
const orderStatusRef = ref<HTMLElement>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const handleSearch = () => {}
const handleApprove = (row: any) => { console.log('审批', row) }

const initCharts = async () => {
  await nextTick()

  if (purchaseTrendRef.value) {
    const chart = echarts.init(purchaseTrendRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['采购金额', '采购数量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: [
        { type: 'value', name: '金额(SAR)', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '数量', splitLine: { show: false } },
      ],
      series: [
        { name: '采购金额', type: 'bar', data: [280, 320, 360, 340, 380, 420, 400, 440, 460, 480, 450, 490], itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] } },
        { name: '采购数量', type: 'line', yAxisIndex: 1, data: [180, 210, 240, 220, 260, 290, 270, 310, 330, 350, 320, 360], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (supplierChartRef.value) {
    const chart = echarts.init(supplierChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 28, name: 'Apple', itemStyle: { color: '#409EFF' } },
            { value: 22, name: 'Samsung', itemStyle: { color: '#67C23A' } },
            { value: 18, name: 'Dell', itemStyle: { color: '#E6A23C' } },
            { value: 15, name: 'Sony', itemStyle: { color: '#F56C6C' } },
            { value: 10, name: 'LG', itemStyle: { color: '#909399' } },
            { value: 7, name: '其他', itemStyle: { color: '#9B59B6' } },
          ],
          label: { formatter: '{b}\n{d}%' },
          emphasis: { scale: true },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (orderStatusRef.value) {
    const chart = echarts.init(orderStatusRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['待审批', '待收货', '待付款', '已完成', '已取消'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          type: 'bar',
          data: [
            { value: 12, itemStyle: { color: '#E6A23C' } },
            { value: 25, itemStyle: { color: '#409EFF' } },
            { value: 18, itemStyle: { color: '#F56C6C' } },
            { value: 180, itemStyle: { color: '#67C23A' } },
            { value: 8, itemStyle: { color: '#909399' } },
          ],
          barWidth: '50%',
        },
      ],
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