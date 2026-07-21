<!-- 
  文件路径: frontend/src/modules/finance/pages/CashFlow.vue
  功能: 现金流 - 分析现金流量状况
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="现金流类型">
              <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 100%">
                <el-option label="经营活动" value="operating" />
                <el-option label="投资活动" value="investing" />
                <el-option label="融资活动" value="financing" />
              </el-select>
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

    <!-- 现金流KPI -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in cashflowKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>现金流趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>现金流构成</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>现金流明细</span></template>
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="category" label="类别" width="120" />
            <el-table-column prop="description" label="说明" min-width="180" />
            <el-table-column prop="inflow" label="流入" align="right">
              <template #default="{ row }"><span style="color: #67C23A;">{{ row.inflow ? formatCurrency(row.inflow) : '-' }}</span></template>
            </el-table-column>
            <el-table-column prop="outflow" label="流出" align="right">
              <template #default="{ row }"><span style="color: #F56C6C;">{{ row.outflow ? formatCurrency(row.outflow) : '-' }}</span></template>
            </el-table-column>
            <el-table-column prop="net" label="净额" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.net >= 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
                  {{ formatCurrency(row.net) }}
                </span>
              </template>
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

const searchForm = reactive({ period: new Date(), type: '' })

const cashflowKpis = ref([
  { label: '经营现金流', value: 'SAR 2,856,000', type: 'success' },
  { label: '投资现金流', value: 'SAR -856,000', type: 'danger' },
  { label: '融资现金流', value: 'SAR 1,200,000', type: 'primary' },
  { label: '期末现金余额', value: 'SAR 4,656,000', type: 'primary' },
])

const tableData = ref([
  { date: '2024-11-20', category: '经营活动', description: '销售收款-沙特电信', inflow: 285600, outflow: 0, net: 285600 },
  { date: '2024-11-19', category: '经营活动', description: '采购付款-苹果供应商', inflow: 0, outflow: 156800, net: -156800 },
  { date: '2024-11-18', category: '投资活动', description: '购置设备', inflow: 0, outflow: 450000, net: -450000 },
  { date: '2024-11-15', category: '融资活动', description: '银行贷款', inflow: 1200000, outflow: 0, net: 1200000 },
])

const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.type = '' }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['经营现金流', '投资现金流', '融资现金流'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '经营现金流', type: 'bar', data: [320, 380, 420, 390, 450, 520], itemStyle: { color: '#67C23A' } },
        { name: '投资现金流', type: 'bar', data: [-120, -80, -150, -100, -200, -80], itemStyle: { color: '#F56C6C' } },
        { name: '融资现金流', type: 'bar', data: [200, -100, 0, 150, -50, 0], itemStyle: { color: '#409EFF' } },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 65, name: '经营活动', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '投资活动', itemStyle: { color: '#F56C6C' } },
          { value: 15, name: '融资活动', itemStyle: { color: '#409EFF' } },
        ],
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
.stat-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.danger { border-left: 4px solid #F56C6C; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>