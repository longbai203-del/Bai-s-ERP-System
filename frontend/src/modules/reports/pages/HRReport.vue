<!-- 
  文件路径: frontend/src/modules/reports/pages/HRReport.vue
  功能: HR报表 - 人力资源报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="年份">
              <el-select v-model="searchForm.year" placeholder="请选择年份" style="width: 100%">
                <el-option label="2024" value="2024" />
                <el-option label="2025" value="2025" />
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
      <el-col :span="6" v-for="kpi in hrKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>部门人数分布</span></template>
          <div ref="deptChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>员工学历分布</span></template>
          <div ref="eduChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="total" label="总人数" align="center" />
        <el-table-column prop="male" label="男" align="center" />
        <el-table-column prop="female" label="女" align="center" />
        <el-table-column prop="turnoverRate" label="离职率" align="center">
          <template #default="{ row }">{{ row.turnoverRate }}%</template>
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

const searchForm = reactive({ year: '2024' })

const hrKpis = ref([
  { label: '员工总数', value: '286' },
  { label: '平均年龄', value: '32岁' },
  { label: '男女比例', value: '65:35' },
  { label: '离职率', value: '4.5%' },
])

const tableData = ref([
  { department: '销售部', total: 45, male: 38, female: 7, turnoverRate: 6.8 },
  { department: '采购部', total: 28, male: 22, female: 6, turnoverRate: 4.2 },
  { department: '财务部', total: 18, male: 10, female: 8, turnoverRate: 3.5 },
  { department: '运营部', total: 35, male: 28, female: 7, turnoverRate: 5.1 },
])

const loading = ref(false)
const deptChartRef = ref<HTMLElement>()
const eduChartRef = ref<HTMLElement>()

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (deptChartRef.value) {
    const chart = echarts.init(deptChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['销售部', '采购部', '财务部', '运营部', 'HR部'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{ type: 'bar', data: [45, 28, 18, 35, 12], itemStyle: { color: '#409EFF' } }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (eduChartRef.value) {
    const chart = echarts.init(eduChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 45, name: '硕士及以上', itemStyle: { color: '#409EFF' } },
          { value: 128, name: '本科', itemStyle: { color: '#67C23A' } },
          { value: 86, name: '大专', itemStyle: { color: '#E6A23C' } },
          { value: 27, name: '高中及以下', itemStyle: { color: '#909399' } },
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