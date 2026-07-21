<!-- 
  文件路径: frontend/src/modules/reports/pages/CRMReport.vue
  功能: CRM报表 - 客户关系管理报表
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
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in crmKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>客户等级分布</span></template>
          <div ref="levelChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>客户来源分布</span></template>
          <div ref="sourceChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="level" label="等级" align="center" />
        <el-table-column prop="totalSales" label="累计消费" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalSales) }}</template>
        </el-table-column>
        <el-table-column prop="orders" label="订单数" align="center" />
        <el-table-column prop="lastOrder" label="最后订单" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ dateRange: [] as [Date, Date] | [] })

const crmKpis = ref([
  { label: '总客户数', value: '2,856' },
  { label: '活跃客户', value: '1,856' },
  { label: '新增客户', value: '286' },
  { label: '客户流失率', value: '8.5%' },
])

const tableData = ref([
  { customer: '沙特电信公司', level: '钻石', totalSales: 8560000, orders: 286, lastOrder: '2024-11-20' },
  { customer: '阿尔拉吉银行', level: '黄金', totalSales: 5200000, orders: 198, lastOrder: '2024-11-19' },
  { customer: '沙特阿美', level: '黄金', totalSales: 3200000, orders: 156, lastOrder: '2024-11-18' },
])

const loading = ref(false)
const levelChartRef = ref<HTMLElement>()
const sourceChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (levelChartRef.value) {
    const chart = echarts.init(levelChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['钻石', '黄金', '白银', '青铜'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{ type: 'bar', data: [128, 386, 772, 1256], itemStyle: { color: '#409EFF' } }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (sourceChartRef.value) {
    const chart = echarts.init(sourceChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 35, name: '线下门店', itemStyle: { color: '#409EFF' } },
          { value: 21, name: '官网', itemStyle: { color: '#67C23A' } },
          { value: 16, name: '社交媒体', itemStyle: { color: '#E6A23C' } },
          { value: 13, name: '电话销售', itemStyle: { color: '#F56C6C' } },
          { value: 10, name: '推荐介绍', itemStyle: { color: '#9B59B6' } },
          { value: 5, name: '其他', itemStyle: { color: '#909399' } },
        ],
        label: { formatter: '{b}\n{d}%' },
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
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>