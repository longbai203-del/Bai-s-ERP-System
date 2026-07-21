<!-- 
  文件路径: frontend/src/modules/finance/pages/Receipts.vue
  功能: 收款管理 - 管理所有收款记录
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="收款编号">
              <el-input v-model="searchForm.receiptNo" placeholder="请输入收款编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="客户">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待确认" value="pending" />
                <el-option label="已确认" value="confirmed" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon> 导出</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新增收款</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="receiptNo" label="收款编号" width="140" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="amount" label="收款金额" align="right">
          <template #default="{ row }"><span style="color: #67C23A; font-weight: 600;">{{ formatCurrency(row.amount) }}</span></template>
        </el-table-column>
        <el-table-column prop="method" label="收款方式" width="100" />
        <el-table-column prop="receiptDate" label="收款日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'confirmed' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待确认' : row.status === 'confirmed' ? '已确认' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Download, Plus, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ receiptNo: '', customer: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, receiptNo: 'REC-2024-001', customer: '沙特电信公司', amount: 285600, method: '银行转账', receiptDate: '2024-11-20', status: 'confirmed' },
  { id: 2, receiptNo: 'REC-2024-002', customer: '阿尔拉吉银行', amount: 198700, method: '信用卡', receiptDate: '2024-11-19', status: 'pending' },
  { id: 3, receiptNo: 'REC-2024-003', customer: '沙特阿美', amount: 176500, method: '现金', receiptDate: '2024-11-18', status: 'confirmed' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.receiptNo = ''; searchForm.customer = ''; searchForm.status = '' }
const handleExport = () => { ElMessage.success('导出完成') }
const handleCreate = () => { ElMessage.info('新增收款') }
const handleView = (row: any) => { ElMessage.info(`查看收款: ${row.receiptNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除收款 ${row.receiptNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>