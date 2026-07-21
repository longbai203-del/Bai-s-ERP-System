<!-- 
  文件路径: frontend/src/modules/reports/pages/SaudiVatReport.vue
  功能: 沙特VAT报表 - VAT申报报表
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker v-model="searchForm.period" type="month" placeholder="选择申报期间" style="width: 100%" />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 生成</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            <el-button type="primary" @click="handleSubmit"><el-icon><Upload /></el-icon> 提交申报</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in vatStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span>VAT计算明细</span></template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="category" label="项目" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="vatRate" label="税率" align="center">{{ row.vatRate }}%</el-table-column>
        <el-table-column prop="vatAmount" label="VAT金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.vatAmount) }}</template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 16px; font-size: 16px;">
        应缴VAT: <span style="font-weight: 700; color: #F56C6C; font-size: 20px;">{{ formatCurrency(totalVat) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Download, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date() })

const vatStats = ref([
  { label: '销项税', value: 'SAR 1,928,400', type: 'primary' },
  { label: '进项税', value: 'SAR 1,500,000', type: 'success' },
  { label: '应缴VAT', value: 'SAR 428,400', type: 'danger' },
  { label: '申报状态', value: '待申报', type: 'warning' },
])

const tableData = ref([
  { category: '商品销售', amount: 8560000, vatRate: 15, vatAmount: 1284000 },
  { category: '服务收入', amount: 4296000, vatRate: 15, vatAmount: 644400 },
  { category: '采购进项', amount: 8560000, vatRate: 15, vatAmount: 1284000 },
  { category: '费用进项', amount: 1440000, vatRate: 15, vatAmount: 216000 },
])

const totalVat = computed(() => {
  const outputVat = tableData.value.filter(d => d.category === '商品销售' || d.category === '服务收入')
    .reduce((sum, d) => sum + d.vatAmount, 0)
  const inputVat = tableData.value.filter(d => d.category === '采购进项' || d.category === '费用进项')
    .reduce((sum, d) => sum + d.vatAmount, 0)
  return outputVat - inputVat
})

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { ElMessage.success('报表生成完成') }
const handleExport = () => { ElMessage.success('导出完成') }
const handleSubmit = () => { ElMessage.success('VAT申报已提交') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>