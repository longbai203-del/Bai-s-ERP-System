<!-- 
  文件路径: frontend/src/modules/reports/pages/InventoryReport.vue
  功能: 库存报表 - 库存数据报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="仓库">
              <el-select v-model="searchForm.warehouse" placeholder="请选择仓库" style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="利雅得仓库" value="riyadh" />
                <el-option label="吉达仓库" value="jeddah" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品分类">
              <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 100%">
                <el-option label="全部" value="all" />
                <el-option label="电子产品" value="electronics" />
                <el-option label="服装鞋帽" value="clothing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in inventoryKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>库存分类占比</span></template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>库存状态</span></template>
          <div ref="statusChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="sku" label="SKU" />
        <el-table-column prop="quantity" label="库存数量" align="center" />
        <el-table-column prop="value" label="库存金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.value) }}</template>
        </el-table-column>
        <el-table-column prop="turnoverRate" label="周转率" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ warehouse: 'all', category: 'all' })

const inventoryKpis = ref([
  { label: '总库存数量', value: '285,600' },
  { label: '总库存金额', value: 'SAR 8,560,000' },
  { label: 'SKU总数', value: '1,286' },
  { label: '周转天数', value: '28天' },
])

const tableData = ref([
  { product: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', quantity: 156, value: 812000, turnoverRate: 6.8 },
  { product: '三星 Galaxy S24 Ultra', sku: 'SGS-S24-U-512', quantity: 89, value: 427000, turnoverRate: 5.2 },
  { product: 'MacBook Pro 16"', sku: 'MBP-16-M3-512', quantity: 34, value: 333000, turnoverRate: 4.5 },
])

const loading = ref(false)
const categoryChartRef = ref<HTMLElement>()
const statusChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (categoryChartRef.value) {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['电子产品', '服装鞋帽', '食品饮料', '家居用品', '其他'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{ type: 'bar', data: [35, 25, 20, 12, 8], itemStyle: { color: '#409EFF' } }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (statusChartRef.value) {
    const chart = echarts.init(statusChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45, name: '库存充足', itemStyle: { color: '#67C23A' } },
          { value: 35, name: '库存正常', itemStyle: { color: '#409EFF' } },
          { value: 15, name: '库存偏低', itemStyle: { color: '#E6A23C' } },
          { value: 5, name: '库存紧缺', itemStyle: { color: '#F56C6C' } },
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