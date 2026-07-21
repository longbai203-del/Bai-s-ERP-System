<!-- 
  文件路径: frontend/src/modules/dashboard/pages/PerformanceDashboard.vue
  功能: 绩效仪表盘 - 展示组织绩效指标
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-select v-model="selectedDepartment" placeholder="选择部门" style="width: 100%">
            <el-option label="全部门" value="all" />
            <el-option label="销售部" value="sales" />
            <el-option label="采购部" value="purchase" />
            <el-option label="运营部" value="operations" />
            <el-option label="财务部" value="finance" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectedPeriod" placeholder="选择周期" style="width: 100%">
            <el-option label="月度" value="month" />
            <el-option label="季度" value="quarter" />
            <el-option label="年度" value="year" />
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
      <el-col :span="6" v-for="kpi in performanceKpis" :key="kpi.label">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">{{ kpi.sub }}</div>
          <el-progress :percentage="kpi.progress" :color="kpi.progress >= 90 ? '#67C23A' : kpi.progress >= 70 ? '#E6A23C' : '#F56C6C'" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>部门绩效对比</span>
          </template>
          <div ref="deptChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>绩效趋势</span>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>员工绩效排名</span>
          </template>
          <el-table :data="employeeRanking" style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="员工姓名" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="score" label="绩效得分" align="center">
              <template #default="{ row }">
                <el-tag :type="row.score >= 90 ? 'success' : row.score >= 75 ? 'warning' : 'danger'">
                  {{ row.score }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="completion" label="完成率" align="center">
              <template #default="{ row }">
                <el-progress :percentage="row.completion" :color="row.completion >= 90 ? '#67C23A' : row.completion >= 70 ? '#E6A23C' : '#F56C6C'" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="评级" align="center">
              <template #default="{ row }">
                <el-tag :type="row.rating === 'A' ? 'success' : row.rating === 'B' ? 'warning' : 'danger'">
                  {{ row.rating }}
                </el-tag>
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

const selectedDepartment = ref('all')
const selectedPeriod = ref('month')

const performanceKpis = ref([
  { label: '整体绩效', value: '92分', sub: '↑ 5分 较上期', progress: 92 },
  { label: 'KPI达成率', value: '87%', sub: '↑ 3% 较上期', progress: 87 },
  { label: '项目完成率', value: '94%', sub: '↑ 6% 较上期', progress: 94 },
  { label: '员工满意度', value: '4.6/5', sub: '↑ 0.2 较上期', progress: 92 },
])

const employeeRanking = ref([
  { name: 'Ahmed Al-Fahd', department: '销售部', score: 96, completion: 98, rating: 'A' },
  { name: 'Mohammed Al-Qahtani', department: '销售部', score: 92, completion: 94, rating: 'A' },
  { name: 'Saud Al-Otaibi', department: '销售部', score: 88, completion: 90, rating: 'B' },
  { name: 'Faisal Al-Dossary', department: '采购部', score: 85, completion: 87, rating: 'B' },
  { name: 'Khalid Al-Ghamdi', department: '财务部', score: 82, completion: 84, rating: 'B' },
  { name: 'Abdullah Al-Shammari', department: '运营部', score: 78, completion: 80, rating: 'C' },
  { name: 'Nasser Al-Harbi', department: '运营部', score: 76, completion: 78, rating: 'C' },
])

const deptChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

const handleSearch = () => {}

const initCharts = async () => {
  await nextTick()

  if (deptChartRef.value) {
    const chart = echarts.init(deptChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['目标', '实际'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['销售部', '采购部', '财务部', '运营部', 'HR部'] },
      yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '目标', type: 'bar', data: [90, 85, 80, 85, 80], itemStyle: { color: '#909399', borderRadius: [4, 4, 0, 0] } },
        { name: '实际', type: 'bar', data: [92, 86, 82, 78, 84], itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] } },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        {
          type: 'line',
          data: [82, 85, 83, 88, 90, 92],
          smooth: true,
          lineStyle: { color: '#67C23A', width: 3 },
          areaStyle: { color: 'rgba(103, 194, 58, 0.1)' },
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
.kpi-value { font-size: 28px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; margin-bottom: 8px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
</style>