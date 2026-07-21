<!-- 
  文件路径: frontend/src/modules/dashboard/pages/Overview.vue
  功能: 总览仪表盘 - 展示系统整体运营数据
-->

<template>
  <div class="page-container">
    <!-- 时间筛选 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="large"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedStore" placeholder="选择门店" size="large" style="width: 100%">
            <el-option label="全部门店" value="all" />
            <el-option label="利雅得店" value="riyadh" />
            <el-option label="吉达店" value="jeddah" />
            <el-option label="达曼店" value="dammam" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="large" @click="handleRefresh">
            <el-icon><Refresh /></el-icon> 刷新数据
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- KPI卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="kpi in kpiData" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.trend === 'up' ? 'trend-up' : 'trend-down'">
          <div class="kpi-header">
            <span class="kpi-label">{{ kpi.label }}</span>
            <el-tag :type="kpi.trend === 'up' ? 'success' : 'danger'" size="small">
              {{ kpi.trend === 'up' ? '↑' : '↓' }} {{ kpi.change }}%
            </el-tag>
          </div>
          <div class="kpi-value">{{ formatCurrency(kpi.value) }}</div>
          <div class="kpi-footer">较昨日 {{ kpi.change > 0 ? '增长' : '下降' }} {{ Math.abs(kpi.change) }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 - 行1 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>销售占比</span>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 - 行2 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>库存预警</span>
          </template>
          <div ref="stockChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>经营趋势</span>
          </template>
          <div ref="businessChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 排行榜 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>销售排行 TOP10</span>
          </template>
          <el-table :data="topProducts" size="small" style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="amount" label="销售额" align="right">
              <template #default="{ row }">
                {{ formatCurrency(row.amount) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>客户排行 TOP10</span>
          </template>
          <el-table :data="topCustomers" size="small" style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="客户名称" />
            <el-table-column prop="amount" label="消费额" align="right">
              <template #default="{ row }">
                {{ formatCurrency(row.amount) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>员工排行 TOP10</span>
          </template>
          <el-table :data="topEmployees" size="small" style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="员工姓名" />
            <el-table-column prop="amount" label="业绩额" align="right">
              <template #default="{ row }">
                {{ formatCurrency(row.amount) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 经营分析 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <span>关键经营指标</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="indicator in indicators" :key="indicator.label">
          <div class="indicator-item">
            <div class="indicator-label">{{ indicator.label }}</div>
            <div class="indicator-value">{{ indicator.value }}</div>
            <div class="indicator-target">目标: {{ indicator.target }}</div>
            <el-progress 
              :percentage="indicator.progress" 
              :color="indicator.progress >= 90 ? '#67C23A' : indicator.progress >= 70 ? '#E6A23C' : '#F56C6C'"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useDashboardStore } from '../store'

// Store
const store = useDashboardStore()

// 响应式数据
const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()])
const selectedStore = ref('all')
const trendPeriod = ref('month')
const loading = ref(false)

// 图表引用
const salesChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const stockChartRef = ref<HTMLElement>()
const businessChartRef = ref<HTMLElement>()

// KPI数据
const kpiData = ref([
  { label: '今日销售额', value: 285600, change: 12.5, trend: 'up' },
  { label: '今日利润', value: 85600, change: 8.3, trend: 'up' },
  { label: '今日订单数', value: 286, change: -3.2, trend: 'down' },
  { label: '今日客流量', value: 423, change: 5.7, trend: 'up' },
  { label: '客单价', value: 998, change: 2.1, trend: 'up' },
  { label: '库存周转率', value: 8.6, change: -1.8, trend: 'down' },
])

// 排行榜数据
const topProducts = ref([
  { name: 'iPhone 15 Pro Max', amount: 128500 },
  { name: '三星 Galaxy S24 Ultra', amount: 98500 },
  { name: 'MacBook Pro 16"', amount: 87600 },
  { name: 'iPad Pro 12.9"', amount: 65400 },
  { name: 'AirPods Pro 2', amount: 52300 },
  { name: 'Apple Watch Ultra 2', amount: 48700 },
  { name: '索尼 WH-1000XM5', amount: 42300 },
  { name: '戴尔 XPS 16', amount: 38900 },
  { name: '联想 ThinkPad X1', amount: 35600 },
  { name: '华为 Mate 60 Pro', amount: 32400 },
])

const topCustomers = ref([
  { name: '沙特电信公司', amount: 285600 },
  { name: '阿尔拉吉银行', amount: 256800 },
  { name: '沙特阿美', amount: 223400 },
  { name: '利雅得银行', amount: 198700 },
  { name: '沙特航空', amount: 176500 },
  { name: 'SABIC', amount: 165400 },
  { name: '沙特电力公司', amount: 154300 },
  { name: 'STC Solutions', amount: 143200 },
  { name: 'Zain KSA', amount: 132100 },
  { name: 'Mobily', amount: 121000 },
])

const topEmployees = ref([
  { name: 'Ahmed Al-Fahd', amount: 185600 },
  { name: 'Mohammed Al-Qahtani', amount: 168500 },
  { name: 'Saud Al-Otaibi', amount: 154300 },
  { name: 'Faisal Al-Dossary', amount: 143200 },
  { name: 'Khalid Al-Ghamdi', amount: 132100 },
  { name: 'Abdullah Al-Shammari', amount: 121000 },
  { name: 'Nasser Al-Harbi', amount: 115600 },
  { name: 'Sultan Al-Mutairi', amount: 108500 },
  { name: 'Majed Al-Zahrani', amount: 102300 },
  { name: 'Turki Al-Anazi', amount: 98200 },
])

// 经营指标
const indicators = ref([
  { label: '预算完成率', value: '87%', target: '100%', progress: 87 },
  { label: 'KPI达成率', value: '92%', target: '100%', progress: 92 },
  { label: '客户满意度', value: '4.8/5', target: '4.5/5', progress: 96 },
  { label: '员工满意度', value: '4.2/5', target: '4.0/5', progress: 84 },
])

// 方法
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const handleRefresh = async () => {
  loading.value = true
  try {
    // 刷新数据逻辑
    await store.fetchDashboardData()
    await initCharts()
  } finally {
    loading.value = false
  }
}

// 初始化图表
const initCharts = async () => {
  await nextTick()
  
  // 销售趋势图
  if (salesChartRef.value) {
    const chart = echarts.init(salesChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '利润额', '订单量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      series: [
        {
          name: '销售额',
          type: 'bar',
          data: [120, 200, 150, 180, 220, 260, 210],
          itemStyle: { color: '#409EFF' },
        },
        {
          name: '利润额',
          type: 'bar',
          data: [36, 60, 45, 54, 66, 78, 63],
          itemStyle: { color: '#67C23A' },
        },
        {
          name: '订单量',
          type: 'line',
          data: [28, 45, 32, 40, 52, 58, 46],
          lineStyle: { color: '#E6A23C' },
          smooth: true,
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  // 销售占比饼图
  if (pieChartRef.value) {
    const chart = echarts.init(pieChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: { label: { show: true } },
          data: [
            { value: 35, name: '电子产品', itemStyle: { color: '#409EFF' } },
            { value: 25, name: '服装鞋帽', itemStyle: { color: '#67C23A' } },
            { value: 20, name: '食品饮料', itemStyle: { color: '#E6A23C' } },
            { value: 12, name: '家居用品', itemStyle: { color: '#F56C6C' } },
            { value: 8, name: '其他', itemStyle: { color: '#909399' } },
          ],
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  // 库存预警图
  if (stockChartRef.value) {
    const chart = echarts.init(stockChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['库存充足', '库存正常', '库存偏低', '库存紧缺', '已断货'],
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: 120, itemStyle: { color: '#67C23A' } },
            { value: 200, itemStyle: { color: '#409EFF' } },
            { value: 80, itemStyle: { color: '#E6A23C' } },
            { value: 45, itemStyle: { color: '#F56C6C' } },
            { value: 15, itemStyle: { color: '#FF0000' } },
          ],
          barWidth: '50%',
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  // 经营趋势图
  if (businessChartRef.value) {
    const chart = echarts.init(businessChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['收入', '成本', '利润'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      series: [
        {
          name: '收入',
          type: 'line',
          data: [320, 380, 420, 390, 450, 520, 480, 540, 580, 620, 560, 600],
          smooth: true,
          lineStyle: { color: '#409EFF', width: 3 },
          areaStyle: { color: 'rgba(64, 158, 255, 0.1)' },
        },
        {
          name: '成本',
          type: 'line',
          data: [220, 250, 280, 260, 300, 340, 320, 360, 380, 400, 370, 390],
          smooth: true,
          lineStyle: { color: '#E6A23C', width: 3 },
        },
        {
          name: '利润',
          type: 'line',
          data: [100, 130, 140, 130, 150, 180, 160, 180, 200, 220, 190, 210],
          smooth: true,
          lineStyle: { color: '#67C23A', width: 3 },
          areaStyle: { color: 'rgba(103, 194, 58, 0.1)' },
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

// 生命周期
onMounted(async () => {
  await initCharts()
})

// 监听周期变化
import { watch } from 'vue'
watch(trendPeriod, () => {
  initCharts()
})
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.kpi-row { margin-bottom: 20px; }
.kpi-card { border-radius: 12px; transition: all 0.3s; cursor: pointer; }
.kpi-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
.kpi-card.trend-up { border-left: 4px solid #67C23A; }
.kpi-card.trend-down { border-left: 4px solid #F56C6C; }
.kpi-header { display: flex; justify-content: space-between; align-items: center; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 28px; font-weight: 700; color: #303133; margin: 8px 0; }
.kpi-footer { color: #909399; font-size: 12px; }
.chart-card { border-radius: 12px; }
.chart-container { height: 300px; width: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.indicator-item { text-align: center; padding: 16px; border-right: 1px solid #e4e7ed; }
.indicator-item:last-child { border-right: none; }
.indicator-label { color: #909399; font-size: 14px; }
.indicator-value { font-size: 24px; font-weight: 700; color: #303133; margin: 8px 0; }
.indicator-target { color: #909399; font-size: 12px; margin-bottom: 8px; }
</style>