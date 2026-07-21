<!-- 
  文件路径: frontend/src/modules/dashboard/pages/BusinessAnalysis.vue
  功能: 经营分析 - 全面经营数据分析
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectedAnalysis" placeholder="分析类型" style="width: 100%">
            <el-option label="综合分析" value="comprehensive" />
            <el-option label="产品分析" value="product" />
            <el-option label="市场分析" value="market" />
            <el-option label="运营分析" value="operations" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 分析
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon> 导出
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="8" v-for="analysis in analysisCards" :key="analysis.label">
        <el-card class="analysis-card">
          <div class="analysis-header">
            <div class="analysis-icon" :style="{ background: analysis.color }">
              <el-icon size="24"><component :is="analysis.icon" /></el-icon>
            </div>
            <div class="analysis-content">
              <div class="analysis-label">{{ analysis.label }}</div>
              <div class="analysis-value">{{ analysis.value }}</div>
              <div class="analysis-change" :class="analysis.trend">
                {{ analysis.trend === 'up' ? '↑' : '↓' }} {{ analysis.change }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <span>多维经营分析</span>
          </template>
          <div ref="radarChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>经营评分</span>
          </template>
          <div ref="gaugeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>SWOT分析</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="swot-box strengths">
                <div class="swot-title">优势</div>
                <ul>
                  <li v-for="item in swot.strengths" :key="item">{{ item }}</li>
                </ul>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="swot-box weaknesses">
                <div class="swot-title">劣势</div>
                <ul>
                  <li v-for="item in swot.weaknesses" :key="item">{{ item }}</li>
                </ul>
              </div>
            </el-col>
            <el-col :span="12" style="margin-top: 20px">
              <div class="swot-box opportunities">
                <div class="swot-title">机会</div>
                <ul>
                  <li v-for="item in swot.opportunities" :key="item">{{ item }}</li>
                </ul>
              </div>
            </el-col>
            <el-col :span="12" style="margin-top: 20px">
              <div class="swot-box threats">
                <div class="swot-title">威胁</div>
                <ul>
                  <li v-for="item in swot.threats" :key="item">{{ item }}</li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>经营建议</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              :type="suggestion.type"
              :icon="suggestion.icon"
            >
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-desc">{{ suggestion.desc }}</div>
              <div class="suggestion-priority">
                <el-tag :type="suggestion.priority === '高' ? 'danger' : suggestion.priority === '中' ? 'warning' : 'info'">
                  优先级: {{ suggestion.priority }}
                </el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Search, Download, TrendCharts, User, ShoppingCart, Money, DataLine } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const dateRange = ref<[Date, Date]>([new Date(new Date().setDate(new Date().getDate() - 90)), new Date()])
const selectedAnalysis = ref('comprehensive')

const analysisCards = ref([
  { label: '市场占有率', value: '12.8%', change: 1.8, trend: 'up', color: '#409EFF', icon: 'TrendCharts' },
  { label: '客户增长率', value: '23.5%', change: 4.2, trend: 'up', color: '#67C23A', icon: 'User' },
  { label: '产品覆盖率', value: '85.6%', change: 3.1, trend: 'up', color: '#E6A23C', icon: 'ShoppingCart' },
  { label: '运营效率', value: '92.3%', change: 2.5, trend: 'up', color: '#9B59B6', icon: 'DataLine' },
])

const swot = ref({
  strengths: ['品牌知名度高', '产品线丰富', '客户基础稳固', '财务实力雄厚'],
  weaknesses: ['部分流程效率低', '某些地区覆盖不足', '新产品开发周期长', 'IT系统需升级'],
  opportunities: ['市场持续增长', '数字化转型机遇', '政府政策支持', '新技术应用'],
  threats: ['竞争加剧', '成本上升', '人才短缺', '政策变化'],
})

const suggestions = ref([
  { id: 1, title: '优化供应链管理', desc: '通过数字化手段优化采购和库存管理，降低成本15%', type: 'primary', priority: '高', icon: 'TrendCharts' },
  { id: 2, title: '加强客户关系管理', desc: '实施CRM系统，提升客户满意度和复购率', type: 'success', priority: '高', icon: 'User' },
  { id: 3, title: '拓展新市场', desc: '在吉达和达曼开设新门店，扩大市场份额', type: 'warning', priority: '中', icon: 'ShoppingCart' },
  { id: 4, title: '员工培训计划', desc: '实施全员技能提升培训，提高运营效率', type: 'info', priority: '低', icon: 'DataLine' },
])

const radarChartRef = ref<HTMLElement>()
const gaugeChartRef = ref<HTMLElement>()

const handleSearch = () => {}
const handleExport = () => {}

const initCharts = async () => {
  await nextTick()

  if (radarChartRef.value) {
    const chart = echarts.init(radarChartRef.value)
    chart.setOption({
      tooltip: {},
      legend: { data: ['当前', '目标'] },
      radar: {
        indicator: [
          { name: '市场竞争力', max: 100 },
          { name: '产品力', max: 100 },
          { name: '运营效率', max: 100 },
          { name: '客户满意度', max: 100 },
          { name: '创新能力', max: 100 },
          { name: '财务健康', max: 100 },
        ],
        shape: 'circle',
        splitNumber: 5,
        axisName: { color: '#666' },
        splitLine: { lineStyle: { color: '#e4e7ed' } },
        splitArea: { areaStyle: { color: ['rgba(64,158,255,0.02)', 'rgba(64,158,255,0.02)'] } },
        axisLine: { lineStyle: { color: '#e4e7ed' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            { value: [82, 78, 88, 85, 75, 90], name: '当前', areaStyle: { color: 'rgba(64,158,255,0.3)' }, lineStyle: { color: '#409EFF', width: 2 } },
            { value: [90, 85, 92, 90, 85, 95], name: '目标', lineStyle: { color: '#F56C6C', width: 2, type: 'dashed' } },
          ],
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (gaugeChartRef.value) {
    const chart = echarts.init(gaugeChartRef.value)
    chart.setOption({
      series: [
        {
          type: 'gauge',
          progress: { show: true, width: 18 },
          axisLine: {
            lineStyle: {
              width: 18,
              color: [[0.82, '#F56C6C'], [0.85, '#E6A23C'], [0.9, '#67C23A'], [1, '#409EFF']],
            },
          },
          axisTick: { show: false },
          splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
          axisLabel: { distance: 25, color: '#999', fontSize: 14 },
          pointer: { width: 5, length: '70%' },
          detail: {
            formatter: '{value}分',
            fontSize: 24,
            fontWeight: 700,
            color: '#303133',
          },
          data: [{ value: 85, name: '经营评分' }],
          title: { fontSize: 14, color: '#909399', offsetCenter: [0, '30%'] },
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
.analysis-card { border-radius: 12px; }
.analysis-header { display: flex; align-items: center; gap: 16px; }
.analysis-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.analysis-label { color: #909399; font-size: 14px; }
.analysis-value { font-size: 22px; font-weight: 700; color: #303133; }
.analysis-change { font-size: 12px; }
.analysis-change.up { color: #67C23A; }
.analysis-change.down { color: #F56C6C; }
.chart-card { border-radius: 12px; }
.chart-container { height: 280px; width: 100%; }
.swot-box { padding: 16px; border-radius: 8px; min-height: 120px; }
.swot-box.strengths { background: #E8F5E9; border-left: 4px solid #67C23A; }
.swot-box.weaknesses { background: #FFEBEE; border-left: 4px solid #F56C6C; }
.swot-box.opportunities { background: #E3F2FD; border-left: 4px solid #409EFF; }
.swot-box.threats { background: #FFF3E0; border-left: 4px solid #E6A23C; }
.swot-title { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
.swot-box ul { list-style: none; padding: 0; margin: 0; }
.swot-box ul li { padding: 4px 0; color: #666; font-size: 14px; }
.swot-box ul li:before { content: '•'; margin-right: 8px; color: #409EFF; }
.suggestion-title { font-weight: 600; font-size: 15px; }
.suggestion-desc { color: #666; font-size: 13px; margin: 4px 0; }
.suggestion-priority { margin-top: 4px; }
</style>