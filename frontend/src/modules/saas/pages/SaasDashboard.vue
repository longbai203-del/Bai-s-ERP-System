<!-- 
  文件路径: frontend/src/modules/saas/pages/SaasDashboard.vue
  功能: SaaS中心首页 - SaaS管理总览
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>SaaS管理中心</h2>
          <p class="subtitle">多租户SaaS平台管理</p>
        </div>
        <div>
          <el-tag type="success" size="large">🟢 系统运行中</el-tag>
        </div>
      </div>
    </el-card>

    <!-- KPI卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in saasKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.trend">
          <div class="kpi-header">
            <span class="kpi-label">{{ kpi.label }}</span>
            <el-tag :type="kpi.trend === 'up' ? 'success' : 'danger'" size="small">
              {{ kpi.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(kpi.change) }}%
            </el-tag>
          </div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-footer">{{ kpi.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 功能入口 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in saasEntries" :key="item.label">
        <el-card class="entry-card" @click="handleNavigate(item.path)">
          <div class="entry-icon" :style="{ background: item.color }">
            <el-icon :size="32"><component :is="item.icon" /></el-icon>
          </div>
          <div class="entry-label">{{ item.label }}</div>
          <div class="entry-desc">{{ item.desc }}</div>
          <div class="entry-action">
            <el-button type="primary" text>进入 →</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 租户趋势 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header><span>租户增长趋势</span></template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header><span>订阅分布</span></template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 近期活动 -->
    <el-card style="margin-top: 20px">
      <template #header><span>近期活动</span></template>
      <el-table :data="activities" style="width: 100%" stripe>
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="tenant" label="租户" />
        <el-table-column prop="action" label="操作" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '成功' ? 'success' : 'warning'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
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
import {  } from '@/api/modules/saas'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const saasKpis = ref([
  { label: '总租户数', value: '286', change: 12.5, trend: 'up', sub: '较上期增长 12.5%' },
  { label: '活跃租户', value: '256', change: 8.3, trend: 'up', sub: '活跃率 89.5%' },
  { label: '总订阅数', value: '386', change: 15.2, trend: 'up', sub: '较上期增长 15.2%' },
  { label: '月经常性收入', value: 'SAR 856,000', change: 10.8, trend: 'up', sub: 'MRR 稳步增长' },
])

const saasEntries = ref([
  { label: '租户管理', desc: '管理所有租户', icon: 'User', color: '#409EFF', path: '/saas/tenants' },
  { label: '订阅管理', desc: '管理订阅与计费', icon: 'Money', color: '#67C23A', path: '/saas/subscriptions' },
  { label: '套餐管理', desc: '管理服务套餐', icon: 'Box', color: '#E6A23C', path: '/saas/plans' },
  { label: 'SaaS分析', desc: 'SaaS数据分析', icon: 'DataLine', color: '#9B59B6', path: '/saas/analytics' },
])

const activities = ref([
  { time: '2024-11-20 10:30', tenant: '沙特电信公司', action: '升级到企业版', status: '成功' },
  { time: '2024-11-20 09:15', tenant: '阿尔拉吉银行', action: '新增用户授权', status: '成功' },
  { time: '2024-11-19 16:00', tenant: '沙特阿美', action: '续订订阅', status: '成功' },
])

const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

const handleNavigate = (path: string) => { router.push(path) }

const initCharts = async () => {
  await nextTick()
  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['总租户数', '新增租户'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: [
        { type: 'value', name: '租户数', splitLine: { lineStyle: { color: '#f0f0f0' } } },
        { type: 'value', name: '新增数', splitLine: { show: false } },
      ],
      series: [
        { name: '总租户数', type: 'bar', data: [120, 150, 180, 210, 240, 286], itemStyle: { color: '#409EFF' } },
        { name: '新增租户', type: 'line', yAxisIndex: 1, data: [12, 15, 18, 16, 20, 26], lineStyle: { color: '#67C23A', width: 3 }, smooth: true },
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
          { value: 45, name: '企业版', itemStyle: { color: '#409EFF' } },
          { value: 30, name: '专业版', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '标准版', itemStyle: { color: '#E6A23C' } },
          { value: 5, name: '基础版', itemStyle: { color: '#909399' } },
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
.page-header { display: flex; justify-content: space-between; align-items: center; }
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
