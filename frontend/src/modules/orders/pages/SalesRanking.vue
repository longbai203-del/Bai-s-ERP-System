<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesRanking.vue
  功能: 销售排行 - 多维度销售排行榜
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="searchForm.type" placeholder="排行榜类型" style="width: 100%">
              <el-option label="产品排行" value="product" />
              <el-option label="客户排行" value="customer" />
              <el-option label="销售员排行" value="salesperson" />
              <el-option label="地区排行" value="region" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.period" placeholder="时间周期" style="width: 100%">
              <el-option label="本月" value="month" />
              <el-option label="本季" value="quarter" />
              <el-option label="本年" value="year" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input-number v-model="searchForm.limit" :min="5" :max="50" label="显示数量" />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header><span>{{ rankingTitle }}</span></template>
          <el-table :data="rankingData" v-loading="loading" style="width: 100%" stripe>
            <el-table-column type="index" label="排名" width="70">
              <template #default="{ $index }">
                <div class="rank-badge" :class="getRankClass($index)">{{ $index + 1 }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="amount" label="销售额" align="right">
              <template #default="{ row }"><span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.amount) }}</span></template>
            </el-table-column>
            <el-table-column prop="share" label="占比" align="center">
              <template #default="{ row }"><el-progress :percentage="row.share" :color="row.share >= 20 ? '#67C23A' : row.share >= 10 ? '#E6A23C' : '#409EFF'" /></template>
            </el-table-column>
            <el-table-column prop="trend" label="趋势" align="center" width="100">
              <template #default="{ row }">
                <el-tag :type="row.trend > 0 ? 'success' : 'danger'">
                  {{ row.trend > 0 ? '↑' : '↓' }} {{ Math.abs(row.trend) }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>排行图表</span></template>
          <div ref="rankingChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ type: 'product', period: 'month', limit: 10 })

const rankingData = ref([
  { name: 'iPhone 15 Pro Max', amount: 1285000, share: 28, trend: 12.5 },
  { name: '三星 Galaxy S24 Ultra', amount: 985000, share: 21, trend: 8.3 },
  { name: 'MacBook Pro 16"', amount: 876000, share: 19, trend: -3.2 },
  { name: 'iPad Pro 12.9"', amount: 654000, share: 14, trend: 5.7 },
  { name: 'AirPods Pro 2', amount: 523000, share: 11, trend: 15.2 },
  { name: 'Apple Watch Ultra 2', amount: 487000, share: 10, trend: 6.8 },
  { name: '索尼 WH-1000XM5', amount: 423000, share: 9, trend: -1.5 },
  { name: '戴尔 XPS 16', amount: 389000, share: 8, trend: 4.2 },
  { name: '联想 ThinkPad X1', amount: 356000, share: 7, trend: -2.1 },
  { name: '华为 Mate 60 Pro', amount: 324000, share: 7, trend: 18.6 },
])

const loading = ref(false)
const rankingChartRef = ref<HTMLElement>()

const rankingTitle = computed(() => {
  const map = { product: '产品销售排行', customer: '客户销售排行', salesperson: '销售员排行', region: '地区排行' }
  return map[searchForm.type as keyof typeof map] || '销售排行'
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const getRankClass = (index: number) => {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('排行榜已更新')
  }, 500)
}

const initChart = async () => {
  await nextTick()
  if (rankingChartRef.value) {
    const chart = echarts.init(rankingChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: rankingData.value.map(d => d.name.length > 8 ? d.name.slice(0, 8) + '...' : d.name),
        axisLabel: { rotate: 30 },
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
      series: [{
        type: 'bar',
        data: rankingData.value.map((d, i) => ({
          value: d.amount,
          itemStyle: { color: ['#F56C6C', '#E6A23C', '#409EFF', '#67C23A', '#9B59B6', '#1ABC9C', '#3498DB', '#E74C3C', '#2ECC71', '#F39C12'][i] || '#409EFF' }
        })),
        barWidth: '50%',
      }],
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

watch(() => searchForm.type, () => { handleSearch(); initChart() })
onMounted(() => { initChart() })
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.chart-container { height: 350px; width: 100%; }
.rank-badge { display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background: #f0f0f0; color: #666; font-weight: 600; font-size: 12px; }
.rank-badge.rank-1 { background: #FFD700; color: #8B6914; font-size: 14px; }
.rank-badge.rank-2 { background: #C0C0C0; color: #666; font-size: 14px; }
.rank-badge.rank-3 { background: #CD7F32; color: #FFF; font-size: 14px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>