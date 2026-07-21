<!-- 
  文件路径: frontend/src/modules/customers/pages/SalesFunnel.vue
  功能: 销售漏斗 - 可视化销售管道
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人">
              <el-select v-model="searchForm.owner" placeholder="全部" clearable style="width: 100%">
                <el-option label="Ahmed" value="Ahmed" />
                <el-option label="Mohammed" value="Mohammed" />
                <el-option label="Saud" value="Saud" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 分析</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 销售漏斗KPI -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in funnelKpis" :key="kpi.label">
        <el-card class="stat-card" :class="kpi.type">
          <div class="stat-label">{{ kpi.label }}</div>
          <div class="stat-value">{{ kpi.value }}</div>
          <div class="stat-sub">{{ kpi.sub }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 漏斗图表 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header><span>销售漏斗</span></template>
          <div ref="funnelChartRef" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>阶段分析</span></template>
          <div class="stage-analysis">
            <div v-for="stage in stageData" :key="stage.name" class="stage-item">
              <div class="stage-header">
                <span class="stage-name">{{ stage.name }}</span>
                <span class="stage-count">{{ stage.count }}</span>
              </div>
              <el-progress :percentage="stage.percentage" :color="stage.color" />
              <div class="stage-value">金额: {{ formatCurrency(stage.value) }}</div>
            </div>
          </div>
          <el-divider />
          <div class="funnel-summary">
            <div class="summary-item">
              <span>转化率</span>
              <span style="font-weight: 700; color: #67C23A;">32.5%</span>
            </div>
            <div class="summary-item">
              <span>平均赢率</span>
              <span style="font-weight: 700; color: #409EFF;">65%</span>
            </div>
            <div class="summary-item">
              <span>平均成交周期</span>
              <span style="font-weight: 700; color: #E6A23C;">45天</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 阶段明细 -->
    <el-card style="margin-top: 20px">
      <template #header><span>各阶段商机明细</span></template>
      <el-table :data="stageDetails" style="width: 100%" stripe>
        <el-table-column prop="opportunity" label="商机名称" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="stage" label="阶段" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStageType(row.stage)">{{ getStageLabel(row.stage) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="probability" label="赢率" align="center" width="100">
          <template #default="{ row }">{{ row.probability }}%</template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="100" />
        <el-table-column prop="expectedCloseDate" label="预计成交" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ period: new Date(), owner: '' })

const funnelKpis = ref([
  { label: '总商机数', value: '86', sub: '↑ 12% 较上期', type: 'primary' },
  { label: '商机总金额', value: 'SAR 12,856,000', sub: '↑ 18% 较上期', type: 'success' },
  { label: '已成交', value: '28', sub: '转化率 32.5%', type: 'warning' },
  { label: '平均成交周期', value: '45天', sub: '↑ 5天 较上期', type: 'primary' },
])

const stageData = ref([
  { name: '初步接触', count: 28, percentage: 100, value: 4200000, color: '#409EFF' },
  { name: '需求分析', count: 22, percentage: 78.6, value: 3500000, color: '#67C23A' },
  { name: '方案提案', count: 18, percentage: 64.3, value: 2800000, color: '#E6A23C' },
  { name: '谈判签约', count: 12, percentage: 42.9, value: 2000000, color: '#F56C6C' },
  { name: '已成交', count: 6, percentage: 21.4, value: 1000000, color: '#9B59B6' },
])

const stageDetails = ref([
  { opportunity: 'STC年度设备采购', customer: '沙特电信公司', amount: 2856000, stage: 'negotiation', probability: 80, owner: 'Ahmed', expectedCloseDate: '2024-12-15' },
  { opportunity: '阿尔拉吉银行IT系统', customer: '阿尔拉吉银行', amount: 1987000, stage: 'proposal', probability: 60, owner: 'Mohammed', expectedCloseDate: '2025-01-20' },
  { opportunity: '沙特阿美软件许可', customer: '沙特阿美', amount: 1765000, stage: 'analysis', probability: 40, owner: 'Saud', expectedCloseDate: '2025-02-10' },
  { opportunity: '利雅得银行POS系统', customer: '利雅得银行', amount: 1250000, stage: 'initial', probability: 30, owner: 'Faisal', expectedCloseDate: '2025-03-01' },
])

const funnelChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const getStageType = (stage: string) => {
  const map: Record<string, string> = { initial: 'info', analysis: 'primary', proposal: 'warning', negotiation: 'danger', won: 'success', lost: 'info' }
  return map[stage] || 'info'
}

const getStageLabel = (stage: string) => {
  const map: Record<string, string> = { initial: '初步接触', analysis: '需求分析', proposal: '方案提案', negotiation: '谈判签约', won: '已成交', lost: '已流失' }
  return map[stage] || stage
}

const handleSearch = () => { ElMessage.success('分析完成') }
const handleReset = () => { searchForm.owner = '' }
const handleExport = () => { ElMessage.success('导出完成') }

const initChart = async () => {
  await nextTick()
  if (funnelChartRef.value) {
    const chart = echarts.init(funnelChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { data: ['初步接触', '需求分析', '方案提案', '谈判签约', '已成交'] },
      series: [{
        type: 'funnel',
        left: '15%',
        right: '15%',
        top: 20,
        bottom: 20,
        min: 0,
        max: 30,
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}\n{c}个' },
        itemStyle: { borderRadius: 4 },
        data: [
          { value: 28, name: '初步接触', itemStyle: { color: '#409EFF' } },
          { value: 22, name: '需求分析', itemStyle: { color: '#67C23A' } },
          { value: 18, name: '方案提案', itemStyle: { color: '#E6A23C' } },
          { value: 12, name: '谈判签约', itemStyle: { color: '#F56C6C' } },
          { value: 6, name: '已成交', itemStyle: { color: '#9B59B6' } },
        ],
      }],
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
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-sub { color: #909399; font-size: 12px; }
.chart-container { width: 100%; }
.stage-analysis { padding: 4px 0; }
.stage-item { margin-bottom: 16px; }
.stage-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.stage-name { font-weight: 500; }
.stage-count { color: #909399; }
.stage-value { color: #909399; font-size: 12px; margin-top: 2px; }
.funnel-summary { display: flex; justify-content: space-around; padding: 8px 0; }
.summary-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #909399; font-size: 13px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>