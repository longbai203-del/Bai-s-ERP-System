<!-- 
  文件路径: frontend/src/modules/reports/pages/SaudiZatcaReport.vue
  功能: ZATCA报表 - ZATCA合规报表
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
            <el-select v-model="searchForm.status" placeholder="上报状态" style="width: 100%">
              <el-option label="全部" value="all" />
              <el-option label="已上报" value="reported" />
              <el-option label="待上报" value="pending" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
            <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            <el-button type="primary" @click="handleSync"><el-icon><Refresh /></el-icon> 同步ZATCA</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in zatcaStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="invoiceNo" label="发票号" />
        <el-table-column prop="amount" label="发票金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="vat" label="VAT" align="right">
          <template #default="{ row }">{{ formatCurrency(row.vat) }}</template>
        </el-table-column>
        <el-table-column prop="total" label="含税总额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.total) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="ZATCA状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'reported' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'reported' ? '已上报' : row.status === 'pending' ? '待上报' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportDate" label="上报日期" width="160" />
        <el-table-column label="二维码" align="center" width="100">
          <template #default>
            <el-button type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), status: 'all' })

const zatcaStats = ref([
  { label: '电子发票总数', value: '856', type: 'primary' },
  { label: '已上报ZATCA', value: '720', type: 'success' },
  { label: '待上报', value: '86', type: 'warning' },
  { label: '上报失败', value: '12', type: 'danger' },
])

const tableData = ref([
  { id: 1, invoiceNo: 'INV-2024-001', amount: 285600, vat: 42840, total: 328440, status: 'reported', reportDate: '2024-11-20 10:30' },
  { id: 2, invoiceNo: 'INV-2024-002', amount: 198700, vat: 29805, total: 228505, status: 'pending', reportDate: '-' },
  { id: 3, invoiceNo: 'INV-2024-003', amount: 176500, vat: 26475, total: 202975, status: 'reported', reportDate: '2024-11-18 14:20' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleExport = () => { ElMessage.success('导出完成') }
const handleSync = () => { ElMessage.success('ZATCA同步完成') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; padding: 8px 0; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>