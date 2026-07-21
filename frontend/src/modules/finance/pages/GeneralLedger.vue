<!-- 
  文件路径: frontend/src/modules/finance/pages/GeneralLedger.vue
  功能: 总账 - 总账科目管理与余额查询
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="会计期间">
              <el-date-picker v-model="searchForm.period" type="month" placeholder="选择期间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="科目代码">
              <el-input v-model="searchForm.accountCode" placeholder="请输入科目代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="科目名称">
              <el-input v-model="searchForm.accountName" placeholder="请输入科目名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 汇总 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in ledgerStats" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="科目代码" width="120" />
        <el-table-column prop="name" label="科目名称" min-width="160" />
        <el-table-column prop="type" label="科目类型" width="100" />
        <el-table-column prop="openingBalance" label="期初余额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.openingBalance) }}</template>
        </el-table-column>
        <el-table-column prop="debit" label="借方发生额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.debit) }}</template>
        </el-table-column>
        <el-table-column prop="credit" label="贷方发生额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.credit) }}</template>
        </el-table-column>
        <el-table-column prop="closingBalance" label="期末余额" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.closingBalance >= 0 ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.closingBalance) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)"><el-icon><View /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ period: new Date(), accountCode: '', accountName: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const ledgerStats = ref([
  { label: '资产总计', value: 'SAR 28,560,000', type: 'primary' },
  { label: '负债总计', value: 'SAR 12,800,000', type: 'warning' },
  { label: '权益总计', value: 'SAR 15,760,000', type: 'success' },
  { label: '损益总计', value: 'SAR 5,200,000', type: 'primary' },
])

const tableData = ref([
  { code: '1001', name: '库存现金', type: '资产', openingBalance: 500000, debit: 2856000, credit: 2560000, closingBalance: 796000 },
  { code: '1002', name: '银行存款', type: '资产', openingBalance: 2500000, debit: 8560000, credit: 7200000, closingBalance: 3860000 },
  { code: '1122', name: '应收账款', type: '资产', openingBalance: 1500000, debit: 5856000, credit: 4256000, closingBalance: 3100000 },
  { code: '1405', name: '库存商品', type: '资产', openingBalance: 3000000, debit: 8560000, credit: 7200000, closingBalance: 4360000 },
  { code: '2001', name: '应付账款', type: '负债', openingBalance: 1200000, credit: 6560000, debit: 5200000, closingBalance: 2560000 },
  { code: '4001', name: '实收资本', type: '权益', openingBalance: 10000000, credit: 0, debit: 0, closingBalance: 10000000 },
  { code: '6001', name: '主营业务收入', type: '损益', openingBalance: 0, credit: 12856000, debit: 0, closingBalance: 12856000 },
  { code: '6401', name: '主营业务成本', type: '损益', openingBalance: 0, debit: 8560000, credit: 0, closingBalance: 8560000 },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.accountCode = ''; searchForm.accountName = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleDetail = (row: any) => { ElMessage.info(`查看科目明细: ${row.code} - ${row.name}`) }
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
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>