<!-- 
  文件路径: frontend/src/modules/analytics/pages/SalesAnalyticsDetail.vue
  功能: 销售分析详情 - 深度销售分析
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>销售分析详情</h2>
          <p class="subtitle">深度销售数据分析</p>
        </div>
        <div>
          <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
        </div>
      </div>
    </el-card>

    <!-- 深度KPI -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in depthKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-sub">{{ kpi.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>产品贡献度</span></template>
          <div ref="contributionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header><span>客户分层分析</span></template>
          <div ref="tierChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header><span>详细分析数据</span></template>
          <el-table :data="detailData" style="width: 100%" stripe>
            <el-table-column prop="category" label="分析维度" />
            <el-table-column prop="value" label="数值" align="right" />
            <el-table-column prop="change" label="变化" align="center">
              <template #default="{ row }">
                <el-tag :type="row.change >= 0 ? 'success' : 'danger'">
                  {{ row.change >= 0 ? '+' : '' }}{{ row.change }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="insight" label="分析洞察" min-width="200" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const depthKpis = ref([
  { label: '前10产品占比', value: '68.5%', sub: '集中度较高', type: 'primary' },
  { label: '大客户占比', value: '42.3%', sub: '贡献突出', type: 'success' },
  { label: '区域集中度', value: '35.2%', sub: '利雅得为主', type: 'warning' },
  { label: '复购率', value: '45.8%', sub: '稳步提升', type: 'primary' },
])

const detailData = ref([
  { category: '产品集中度', value: '68.5%', change: 2.3, insight: '前10产品贡献近七成销售' },
  { category: '客户集中度', value: '42.3%', change: 3.1, insight: '大客户贡献显著，建议维护' },
  { category: '区域集中度', value: '35.2%', change: -1.5, insight: '利雅得地区占比下降，需关注' },
  { category: '复购率', value: '45.8%', change: 2.8, insight: '复购率提升，客户粘性增强' },
])

const contributionChartRef = ref<HTMLElement>()
const tierChartRef = ref<HTMLElement>()

const handleBack = () => { router.push('/analytics/sales') }
const handleExport = () => { ElMessage.success('导出完成') }

const initCharts = async () => {
  await nextTick()
  if (contributionChartRef.value) {
    const chart = echarts.init(contributionChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['TOP1', 'TOP2', 'TOP3', 'TOP4', 'TOP5', '其他'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 28, itemStyle: { color: '#F56C6C' } },
          { value: 21, itemStyle: { color: '#E6A23C' } },
          { value: 19, itemStyle: { color: '#409EFF' } },
          { value: 14, itemStyle: { color: '#67C23A' } },
          { value: 11, itemStyle: { color: '#9B59B6' } },
          { value: 7, itemStyle: { color: '#909399' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: '{c}%' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
  if (tierChartRef.value) {
    const chart = echarts.init(tierChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['钻石', '黄金', '白银', '青铜'] },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: [
          { value: 28, itemStyle: { color: '#F56C6C' } },
          { value: 25, itemStyle: { color: '#E6A23C' } },
          { value: 22, itemStyle: { color: '#409EFF' } },
          { value: 25, itemStyle: { color: '#67C23A' } },
        ],
        barWidth: '50%',
        label: { show: true, position: 'top', formatter: '{c}%' },
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

onMounted(() => { initCharts() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.kpi-sub { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
</style>