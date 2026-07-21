<!-- 
  文件路径: frontend/src/modules/finance/pages/AccountsPayable.vue
  功能: 应付管理 - 管理应付账款
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input v-model="searchForm.supplier" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账龄">
              <el-select v-model="searchForm.aging" placeholder="请选择账龄" clearable style="width: 100%">
                <el-option label="30天内" value="0-30" />
                <el-option label="30-60天" value="30-60" />
                <el-option label="60-90天" value="60-90" />
                <el-option label="90天以上" value="90+" />
              </el-select>
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

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="invoiceNo" label="发票号" />
        <el-table-column prop="amount" label="应付金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已付" align="right">
          <template #default="{ row }">{{ formatCurrency(row.paidAmount) }}</template>
        </el-table-column>
        <el-table-column prop="balance" label="未付余额" align="right">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 600;">{{ formatCurrency(row.balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日" width="120" />
        <el-table-column prop="aging" label="账龄" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.aging === '0-30' ? 'success' : row.aging === '30-60' ? 'warning' : 'danger'">
              {{ row.aging }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePay(row)"><el-icon><Money /></el-icon> 付款</el-button>
            <el-button type="warning" size="small" @click="handleDetail(row)"><el-icon><Document /></el-icon> 明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Money, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ supplier: '', aging: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, supplier: 'Apple Supplier', invoiceNo: 'AP-2024-001', amount: 285600, paidAmount: 200000, balance: 85600, dueDate: '2024-12-20', aging: '0-30' },
  { id: 2, supplier: 'Samsung Supplier', invoiceNo: 'AP-2024-002', amount: 198700, paidAmount: 50000, balance: 148700, dueDate: '2024-11-18', aging: '30-60' },
  { id: 3, supplier: 'Dell Supplier', invoiceNo: 'AP-2024-003', amount: 176500, paidAmount: 0, balance: 176500, dueDate: '2024-10-15', aging: '90+' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.supplier = ''; searchForm.aging = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handlePay = (row: any) => { ElMessage.info(`付款: ${row.supplier}`) }
const handleDetail = (row: any) => { ElMessage.info(`查看明细: ${row.supplier}`) }
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>