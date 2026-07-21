<!-- 
  文件路径: frontend/src/modules/ai/pages/InventoryPrediction.vue
  功能: AI库存预测 - 智能库存需求预测
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
            <el-form-item label="产品分类">
              <el-select v-model="searchForm.category" placeholder="全部分类" clearable style="width: 100%">
                <el-option label="电子产品" value="electronics" />
                <el-option label="服装鞋帽" value="clothing" />
                <el-option label="食品饮料" value="food" />
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

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in forecastKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>库存需求预测</span>
          <el-tag type="warning" size="small">🤖 AI预测</el-tag>
        </div>
      </template>
      <div ref="forecastChartRef" class="chart-container"></div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>建议补货清单</span></template>
      <el-table :data="suggestions" style="width: 100%" stripe>
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="currentStock" label="当前库存" align="center" />
        <el-table-column prop="forecastDemand" label="预测需求" align="center" />
        <el-table-column prop="suggestedOrder" label="建议补货" align="center">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 700;">{{ row.suggestedOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="urgency" label="紧急程度" align="center">
          <template #default="{ row }">
            <el-tag :type="row.urgency === 'high' ? 'danger' : row.urgency === 'medium' ? 'warning' : 'info'">
              {{ row.urgency === 'high' ? '紧急' : row.urgency === 'medium' ? '中等' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleCreateOrder(row)">生成采购单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Monitor, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ period: '30d', category: '' })

const forecastKpis = ref([
  { label: '预测总需求', value: '45,600件', type: 'primary' },
  { label: '建议采购量', value: '28,500件', type: 'warning' },
  { label: '库存周转率', value: '8.6次', type: 'success' },
  { label: '缺货风险', value: '中等', type: 'primary' },
])

const suggestions = ref([
  { product: 'iPhone 15 Pro Max', currentStock: 156, forecastDemand: 250, suggestedOrder: 144, urgency: 'high' },
  { product: '三星 Galaxy S24 Ultra', currentStock: 89, forecastDemand: 180, suggestedOrder: 131, urgency: 'medium' },
  { product: 'AirPods Pro 2', currentStock: 8, forecastDemand: 350, suggestedOrder: 342, urgency: 'high' },
])

const forecastChartRef = ref<HTMLElement>()

const handlePredict = () => { ElMessage.success('预测已生成') }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreateOrder = (row: any) => { ElMessage.info(`为 ${row.product} 生成采购单`) }

const initChart = async () => {
  await nextTick()
  if (forecastChartRef.value) {
    const chart = echarts.init(forecastChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['历史需求', '预测需求'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '历史需求', type: 'bar', data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600], itemStyle: { color: '#409EFF' } },
        { name: '预测需求', type: 'line', data: [null, null, null, null, null, null, null, null, null, null, null, null, 680, 720], smooth: true, lineStyle: { color: '#F56C6C', width: 3 } },
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
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.chart-card { border-radius: 12px; }
.chart-container { height: 300px; width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>