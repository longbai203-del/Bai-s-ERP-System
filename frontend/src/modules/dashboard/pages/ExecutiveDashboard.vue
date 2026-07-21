<!-- 
  文件路径: frontend/src/modules/dashboard/pages/ExecutiveDashboard.vue
  功能: 老板驾驶舱 - 高管级经营决策看板
-->

<template>
  <div class="page-container">
    <!-- 顶部摘要 -->
    <el-card class="summary-card">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">年度营收</div>
            <div class="summary-value">SAR 15.8M</div>
            <div class="summary-change positive">↑ 18.5% 同比增长</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">年度净利润</div>
            <div class="summary-value">SAR 5.2M</div>
            <div class="summary-change positive">↑ 22.3% 同比增长</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">总资产</div>
            <div class="summary-value">SAR 28.6M</div>
            <div class="summary-change positive">↑ 12.8% 同比增长</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="summary-item">
            <div class="summary-label">员工总数</div>
            <div class="summary-value">286</div>
            <div class="summary-change positive">↑ 8.3% 同比增长</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 经营健康度 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8" v-for="health in businessHealth" :key="health.label">
        <el-card class="health-card">
          <div class="health-header">
            <span class="health-label">{{ health.label }}</span>
            <el-tag :type="health.status === '健康' ? 'success' : health.status === '一般' ? 'warning' : 'danger'">
              {{ health.status }}
            </el-tag>
          </div>
          <div class="health-value">{{ health.value }}</div>
          <el-progress :percentage="health.percentage" :color="health.color" />
          <div class="health-desc">{{ health.desc }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 关键图表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>营收 vs 利润趋势</span>
          </template>
          <div ref="revenueProfitRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>现金流状况</span>
          </template>
          <div ref="cashflowChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>关键经营指标</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="indicator in keyIndicators" :key="indicator.label">
              <div class="indicator-item">
                <div class="indicator-label">{{ indicator.label }}</div>
                <div class="indicator-value">{{ indicator.value }}</div>
                <div class="indicator-target">目标: {{ indicator.target }}</div>
                <el-progress :percentage="indicator.progress" :color="indicator.progress >= 90 ? '#67C23A' : indicator.progress >= 70 ? '#E6A23C' : '#F56C6C'" />
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 年度目标追踪 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <span>2024年度目标追踪</span>
      </template>
      <el-table :data="yearlyTargets" style="width: 100%">
        <el-table-column prop="goal" label="目标" />
        <el-table-column prop="target" label="年度目标" align="right" />
        <el-table-column prop="current" label="当前完成" align="right" />
        <el-table-column label="完成率" align="center">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :color="row.progress >= 90 ? '#67C23A' : row.progress >= 70 ? '#E6A23C' : '#F56C6C'" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.progress >= 90 ? 'success' : row.progress >= 70 ? 'warning' : 'danger'">
              {{ row.progress >= 90 ? '超前' : row.progress >= 70 ? '正常' : '滞后' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const businessHealth = ref([
  { label: '经营健康度', value: '92分', status: '健康', percentage: 92, color: '#67C23A', desc: '各项指标表现优秀' },
  { label: '财务健康度', value: '88分', status: '健康', percentage: 88, color: '#409EFF', desc: '财务结构稳健' },
  { label: '运营效率', value: '76分', status: '一般', percentage: 76, color: '#E6A23C', desc: '部分流程待优化' },
  { label: '市场竞争力', value: '85分', status: '健康', percentage: 85, color: '#67C23A', desc: '市场份额持续增长' },
])

const keyIndicators = ref([
  { label: 'ROE (净资产收益率)', value: '18.5%', target: '15%', progress: 123 },
  { label: 'ROI (投资回报率)', value: '22.3%', target: '20%', progress: 112 },
  { label: '毛利率', value: '33.4%', target: '35%', progress: 95 },
  { label: '净利率', value: '12.8%', target: '15%', progress: 85 },
])

const yearlyTargets = ref([
  { goal: '年度营收', target: 'SAR 20M', current: 'SAR 15.8M', progress: 79 },
  { goal: '净利润', target: 'SAR 6M', current: 'SAR 5.2M', progress: 87 },
  { goal: '市场份额', target: '15%', current: '12.8%', progress: 85 },
  { goal: '客户满意度', target: '4.8分', current: '4.6分', progress: 96 },
  { goal: '员工留存率', target: '95%', current: '91%', progress: 82 },
])

const revenueProfitRef = ref<HTMLElement>()
const cashflowChartRef = ref<HTMLElement>()

const initCharts = async () => {
  await nextTick()

  if (revenueProfitRef.value) {
    const chart = echarts.init(revenueProfitRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['营收', '净利润'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '营收', type: 'bar', data: [320, 380, 420, 460], itemStyle: { color: '#409EFF', borderRadius: [4, 4, 0, 0] } },
        { name: '净利润', type: 'bar', data: [98, 125, 140, 157], itemStyle: { color: '#67C23A', borderRadius: [4, 4, 0, 0] } },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (cashflowChartRef.value) {
    const chart = echarts.init(cashflowChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['经营性现金流', '投资性现金流', '融资性现金流'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [
        { name: '经营性现金流', type: 'bar', data: [120, 150, 180, 210], itemStyle: { color: '#67C23A' } },
        { name: '投资性现金流', type: 'bar', data: [-60, -80, -40, -30], itemStyle: { color: '#E6A23C' } },
        { name: '融资性现金流', type: 'bar', data: [30, -20, 10, 0], itemStyle: { color: '#409EFF' } },
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
.summary-card { border-radius: 12px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; }
.summary-item { text-align: center; padding: 10px 0; border-right: 1px solid rgba(255,255,255,0.1); }
.summary-item:last-child { border-right: none; }
.summary-label { color: rgba(255,255,255,0.7); font-size: 14px; }
.summary-value { font-size: 28px; font-weight: 700; color: white; margin: 4px 0; }
.summary-change { font-size: 12px; }
.summary-change.positive { color: #67C23A; }
.summary-change.negative { color: #F56C6C; }
.health-card { border-radius: 12px; border-left: 4px solid #409EFF; }
.health-header { display: flex; justify-content: space-between; align-items: center; }
.health-label { font-size: 16px; font-weight: 600; }
.health-value { font-size: 24px; font-weight: 700; color: #303133; margin: 8px 0; }
.health-desc { color: #909399; font-size: 12px; margin-top: 4px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.indicator-item { text-align: center; padding: 16px; border-right: 1px solid #e4e7ed; }
.indicator-item:last-child { border-right: none; }
.indicator-label { color: #909399; font-size: 14px; }
.indicator-value { font-size: 24px; font-weight: 700; color: #303133; margin: 4px 0; }
.indicator-target { color: #909399; font-size: 12px; margin-bottom: 8px; }
</style>