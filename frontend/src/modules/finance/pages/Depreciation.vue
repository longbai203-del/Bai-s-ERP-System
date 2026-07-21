<!-- 
  文件路径: frontend/src/modules/finance/pages/Depreciation.vue
  功能: 折旧管理 - 管理资产折旧
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="期间">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称">
              <el-input v-model="searchForm.assetName" placeholder="请输入资产名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCalculate"><el-icon><Monitor /></el-icon> 计算折旧</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 折旧统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in deprecationStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="assetNo" label="资产编号" width="120" />
        <el-table-column prop="assetName" label="资产名称" />
        <el-table-column prop="method" label="折旧方法" width="100" />
        <el-table-column prop="originalCost" label="原值" align="right">
          <template #default="{ row }">{{ formatCurrency(row.originalCost) }}</template>
        </el-table-column>
        <el-table-column prop="periodDepreciation" label="本期折旧" align="right">
          <template #default="{ row }">{{ formatCurrency(row.periodDepreciation) }}</template>
        </el-table-column>
        <el-table-column prop="accumulatedDepreciation" label="累计折旧" align="right">
          <template #default="{ row }">{{ formatCurrency(row.accumulatedDepreciation) }}</template>
        </el-table-column>
        <el-table-column prop="netBookValue" label="账面净值" align="right">
          <template #default="{ row }">{{ formatCurrency(row.netBookValue) }}</template>
        </el-table-column>
        <el-table-column prop="remainingLife" label="剩余年限" align="center" />
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), assetName: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const deprecationStats = ref([
  { label: '资产总数', value: '128', type: 'primary' },
  { label: '本期折旧总额', value: 'SAR 1,280,000', type: 'warning' },
  { label: '累计折旧', value: 'SAR 5,860,000', type: 'danger' },
])

const tableData = ref([
  { id: 1, assetNo: 'FA-001', assetName: '服务器', method: '直线法', originalCost: 125000, periodDepreciation: 2500, accumulatedDepreciation: 25000, netBookValue: 100000, remainingLife: 4 },
  { id: 2, assetNo: 'FA-002', assetName: '办公桌椅', method: '直线法', originalCost: 58000, periodDepreciation: 966, accumulatedDepreciation: 11600, netBookValue: 46400, remainingLife: 5 },
  { id: 3, assetNo: 'FA-003', assetName: '车辆', method: '直线法', originalCost: 180000, periodDepreciation: 3000, accumulatedDepreciation: 72000, netBookValue: 108000, remainingLife: 3 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.assetName = '' }
const handleCalculate = () => { ElMessage.success('折旧计算完成') }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>