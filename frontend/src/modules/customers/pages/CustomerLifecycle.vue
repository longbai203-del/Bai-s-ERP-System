<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerLifecycle.vue
  功能: 客户生命周期 - 管理客户生命周期阶段
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生命周期阶段">
              <el-select v-model="searchForm.stage" placeholder="请选择阶段" clearable style="width: 100%">
                <el-option label="潜在客户" value="lead" />
                <el-option label="意向客户" value="prospect" />
                <el-option label="新客户" value="new" />
                <el-option label="活跃客户" value="active" />
                <el-option label="忠诚客户" value="loyal" />
                <el-option label="流失客户" value="lost" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 漏斗图 -->
    <el-card>
      <template #header><span>客户生命周期漏斗</span></template>
      <div ref="funnelChartRef" class="chart-container" style="height: 350px;"></div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>各阶段客户明细</span></template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="stage" label="阶段" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStageType(row.stage)">{{ getStageLabel(row.stage) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="停留时长" align="center" />
        <el-table-column prop="value" label="客户价值" align="right">
          <template #default="{ row }">{{ formatCurrency(row.value) }}</template>
        </el-table-column>
        <el-table-column prop="risk" label="流失风险" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="row.risk === '高' ? 'danger' : row.risk === '中' ? 'warning' : 'success'">
              {{ row.risk }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Search, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const searchForm = reactive({ customer: '', stage: '' })

const tableData = ref([
  { customer: '沙特电信公司', stage: 'active', duration: '18个月', value: 8560000, risk: '低' },
  { customer: '阿尔拉吉银行', stage: 'active', duration: '12个月', value: 5200000, risk: '低' },
  { customer: '沙特阿美', stage: 'new', duration: '3个月', value: 3200000, risk: '中' },
  { customer: '利雅得银行', stage: 'prospect', duration: '2个月', value: 0, risk: '高' },
  { customer: '沙特航空', stage: 'lost', duration: '6个月', value: 1800000, risk: '高' },
])

const funnelChartRef = ref<HTMLElement>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const getStageType = (stage: string) => {
  const map: Record<string, string> = { lead: 'info', prospect: 'warning', new: 'primary', active: 'success', loyal: 'success', lost: 'danger' }
  return map[stage] || 'info'
}

const getStageLabel = (stage: string) => {
  const map: Record<string, string> = { lead: '潜在客户', prospect: '意向客户', new: '新客户', active: '活跃客户', loyal: '忠诚客户', lost: '流失客户' }
  return map[stage] || stage
}

const handleSearch = () => { ElMessage.success('查询完成') }
const handleReset = () => { searchForm.customer = ''; searchForm.stage = '' }
const handleDetail = (row: any) => { ElMessage.info(`查看客户: ${row.customer}`) }

const initChart = async () => {
  await nextTick()
  if (funnelChartRef.value) {
    const chart = echarts.init(funnelChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'funnel',
        left: '10%',
        right: '10%',
        top: 20,
        bottom: 20,
        min: 0,
        max: 1200,
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}\n{c}人' },
        itemStyle: { borderRadius: 4 },
        data: [
          { value: 1200, name: '潜在客户', itemStyle: { color: '#409EFF' } },
          { value: 856, name: '意向客户', itemStyle: { color: '#67C23A' } },
          { value: 520, name: '新客户', itemStyle: { color: '#E6A23C' } },
          { value: 386, name: '活跃客户', itemStyle: { color: '#F56C6C' } },
          { value: 128, name: '忠诚客户', itemStyle: { color: '#9B59B6' } },
          { value: 86, name: '流失客户', itemStyle: { color: '#909399' } },
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
.chart-container { width: 100%; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>