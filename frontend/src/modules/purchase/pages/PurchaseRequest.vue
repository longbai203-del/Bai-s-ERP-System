<!-- 
  文件路径: frontend/src/modules/purchase/pages/PurchaseRequest.vue
  功能: 采购申请列表 - 管理内部采购申请
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="申请编号">
              <el-input v-model="searchForm.requestNo" placeholder="请输入申请编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人">
              <el-input v-model="searchForm.applicant" placeholder="请输入申请人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已驳回" value="rejected" />
                <el-option label="已采购" value="purchased" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建申请</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="requestNo" label="申请编号" width="140" />
        <el-table-column prop="applicant" label="申请人" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="totalAmount" label="申请金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.totalAmount) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请日期" width="160" />
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)" v-if="row.status === 'draft'"><el-icon><Edit /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 审批</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)" v-if="row.status === 'draft'"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ requestNo: '', applicant: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, requestNo: 'PR-2024-001', applicant: 'Ahmed Al-Fahd', department: '销售部', totalAmount: 285600, status: 'pending', createdAt: '2024-11-20 10:30' },
  { id: 2, requestNo: 'PR-2024-002', applicant: 'Mohammed Al-Qahtani', department: '采购部', totalAmount: 156800, status: 'approved', createdAt: '2024-11-18 14:20' },
  { id: 3, requestNo: 'PR-2024-003', applicant: 'Saud Al-Otaibi', department: '运营部', totalAmount: 98500, status: 'draft', createdAt: '2024-11-15 09:00' },
  { id: 4, requestNo: 'PR-2024-004', applicant: 'Faisal Al-Dossary', department: '财务部', totalAmount: 45000, status: 'rejected', createdAt: '2024-11-12 16:30' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const getStatusType = (status: string) => {
  const map: Record<string, string> = { draft: 'info', pending: 'warning', approved: 'success', rejected: 'danger', purchased: 'primary' }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = { draft: '草稿', pending: '待审批', approved: '已批准', rejected: '已驳回', purchased: '已采购' }
  return map[status] || status
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.requestNo = ''; searchForm.applicant = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建采购申请') }
const handleView = (row: any) => { ElMessage.info(`查看申请: ${row.requestNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑申请: ${row.requestNo}`) }
const handleApprove = (row: any) => { ElMessage.success(`申请 ${row.requestNo} 已审批通过`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除申请 ${row.requestNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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