<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseContracts.vue
  功能: 采购合同 - 管理采购合同
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="合同编号">
              <el-input v-model="searchForm.contractNo" placeholder="请输入合同编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input v-model="searchForm.supplier" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已签署" value="signed" />
                <el-option label="执行中" value="executing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建合同</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="contractNo" label="合同编号" width="140" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="totalAmount" label="合同金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
        </el-table-column>
        <el-table-column prop="signDate" label="签署日期" width="120" />
        <el-table-column prop="expiryDate" label="到期日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'signed' ? 'success' : row.status === 'executing' ? 'primary' : row.status === 'completed' ? 'info' : 'warning'">
              {{ row.status === 'draft' ? '草稿' : row.status === 'signed' ? '已签署' : row.status === 'executing' ? '执行中' : '已完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon></el-button>
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
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ contractNo: '', supplier: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, contractNo: 'PC-2024-001', supplier: 'Apple Supplier', totalAmount: 1250000, signDate: '2024-01-15', expiryDate: '2025-01-14', status: 'executing' },
  { id: 2, contractNo: 'PC-2024-002', supplier: 'Samsung Supplier', totalAmount: 980000, signDate: '2024-03-20', expiryDate: '2025-03-19', status: 'signed' },
  { id: 3, contractNo: 'PC-2024-003', supplier: 'Dell Supplier', totalAmount: 756000, signDate: '2024-06-10', expiryDate: '2024-12-09', status: 'completed' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.contractNo = ''; searchForm.supplier = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建采购合同') }
const handleView = (row: any) => { ElMessage.info(`查看合同: ${row.contractNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑合同: ${row.contractNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除合同 ${row.contractNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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