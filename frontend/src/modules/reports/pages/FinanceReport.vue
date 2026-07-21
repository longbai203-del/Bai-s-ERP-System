<!-- 
  文件路径: frontend/src/modules/reports/pages/FinanceReport.vue
  功能: 财务报表 - 财务数据报表
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
            <el-select v-model="searchForm.reportType" placeholder="报表类型" style="width: 100%">
              <el-option label="资产负债表" value="balance" />
              <el-option label="利润表" value="income" />
              <el-option label="现金流量表" value="cashflow" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- KPI -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="kpi in financeKpis" :key="kpi.label">
        <el-card class="kpi-card" :class="kpi.type">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span>利润表</span></template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="item" label="项目" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="percentage" label="占比" align="center">
          <template #default="{ row }">{{ row.percentage }}%</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), reportType: 'income' })

const financeKpis = ref([
  { label: '总收入', value: 'SAR 12,856,000', type: 'primary' },
  { label: '总支出', value: 'SAR 8,560,000', type: 'danger' },
  { label: '净利润', value: 'SAR 4,296,000', type: 'success' },
  { label: '毛利率', value: '33.4%', type: 'warning' },
])

const tableData = ref([
  { item: '主营业务收入', amount: 12856000, percentage: 100 },
  { item: '减: 主营业务成本', amount: 8560000, percentage: 66.6 },
  { item: '主营业务利润', amount: 4296000, percentage: 33.4 },
  { item: '减: 期间费用', amount: 2000000, percentage: 15.6 },
  { item: '营业利润', amount: 2296000, percentage: 17.8 },
])

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('报表生成完成') }
const handleExport = () => { ElMessage.success('导出完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.kpi-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.kpi-card.primary { border-left: 4px solid #409EFF; }
.kpi-card.danger { border-left: 4px solid #F56C6C; }
.kpi-card.success { border-left: 4px solid #67C23A; }
.kpi-card.warning { border-left: 4px solid #E6A23C; }
.kpi-label { color: #909399; font-size: 14px; }
.kpi-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>