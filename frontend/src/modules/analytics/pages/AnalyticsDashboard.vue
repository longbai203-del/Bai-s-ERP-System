<!-- 
  文件路径: frontend/src/modules/analytics/pages/AnalyticsDashboard.vue
  功能: 分析中心首页 - 数据分析总览
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>数据分析中心</h2>
          <p class="subtitle">多维度业务数据分析</p>
        </div>
        <div>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="large"
            style="width: 280px"
          />
          <el-button type="primary" size="large" @click="handleRefresh" style="margin-left: 12px;">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- KPI卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in kpiData" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.trend">
          <div class="kpi-header">
            <span class="kpi-label">{{ kpi.label }}</span>
            <el-tag :type="kpi.trend === 'up' ? 'success' : 'danger'" size="small">
              {{ kpi.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
            </el-tag>
          </div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-footer">较上期 {{ kpi.change > 0 ? '增长' : '下降' }} {{ Math.abs(kpi.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分析入口 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in analyticsEntries" :key="item.label">
        <el-card class="entry-card" @click="handleNavigate(item.path)">
          <div class="entry-icon" :style="{ background: item.color }">
            <el-icon :size="32"><component :is="item.icon" /></el-icon>
          </div>
          <div class="entry-label">{{ item.label }}</div>
          <div class="entry-desc">{{ item.desc }}</div>
          <div class="entry-action">
            <el-button type="primary" text>查看分析 →</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>分析趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>分析维度分布</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import {
  Plus,
  Search,
  Refresh,
  View,
  Edit,
  Delete
} from '@element-plus/icons-vue'
// ============================================================
// API 导入
// ============================================================
import {  } from '@/api/modules/analytics'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()])

const kpiData = ref([
  { label: '总分析量', value: '12,856', change: 12.5, trend: 'up' },
  { label: '分析准确率', value: '94.8%', change: 3.2, trend: 'up' },
  { label: '活跃分析用户', value: '286', change: 8.3, trend: 'up' },
  { label: '分析报告数', value: '856', change: -2.1, trend: 'down' },
])

const analyticsEntries = ref([
  { label: '销售分析', desc: '多维度销售数据分析', icon: 'TrendCharts', color: '#409EFF', path: '/analytics/sales' },
  { label: '客户分析', desc: '客户画像与行为分析', icon: 'User', color: '#67C23A', path: '/analytics/customer' },
  { label: '产品分析', desc: '产品表现与优化分析', icon: 'Box', color: '#E6A23C', path: '/analytics/product' },
  { label: '渠道分析', desc: '渠道效果与优化分析', icon: 'DataLine', color: '#9B59B6', path: '/analytics/channel' },
])

const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const handleRefresh = () => { /* 刷新逻辑 */ }
const handleNavigate = (path: string) => { router.push(path) }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['分析量', '准确率'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: [
        { type: 'value', name: '分析量', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '准确率(%)', min: 0, max: 100, splitLine: { show: false } },
      ],
      series: [
        { name: '分析量', type: 'bar', data: [120, 200, 150, 180, 220, 260], itemStyle: { color: '#409EFF' } },
        { name: '准确率', type: 'line', yAxisIndex: 1, data: [85, 88, 90, 92, 94, 95], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
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
          { value: 35, name: '销售分析', itemStyle: { color: '#409EFF' } },
          { value: 25, name: '客户分析', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '产品分析', itemStyle: { color: '#E6A23C' } },
          { value: 12, name: '渠道分析', itemStyle: { color: '#F56C6C' } },
          { value: 8, name: '其他', itemStyle: { color: '#909399' } },
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
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { border-radius: 12px; transition: all 0.3s; }
.kpi-card.up { border-left: 4px solid #67C23A; }
.kpi-card.down { border-left: 4px solid #F56C6C; }
.kpi-header { display: flex; justify-content: space-between; align-items: center; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 28px; font-weight: 700; color: #303133; margin: 8px 0; }
.kpi-footer { color: #909399; font-size: 12px; }
.entry-card { text-align: center; border-radius: 12px; cursor: pointer; transition: all 0.3s; padding: 16px 0; }
.entry-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
.entry-icon { width: 56px; height: 56px; border-radius: 12px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; }
.entry-label { font-size: 16px; font-weight: 600; }
.entry-desc { color: #909399; font-size: 13px; margin: 4px 0; }
.entry-action { margin-top: 8px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
</style>
