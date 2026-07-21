<!-- 
  文件路径: frontend/src/modules/approval/pages/ContractApproval.vue
  功能: 合同审批 - 合同审批流程
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="合同编号">
              <el-input v-model="searchForm.contractNo" placeholder="请输入合同编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="客户/供应商">
              <el-input v-model="searchForm.party" placeholder="请输入名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="contractNo" label="合同编号" width="140" />
        <el-table-column prop="party" label="合同方" />
        <el-table-column prop="amount" label="合同金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="type" label="合同类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'sales' ? 'success' : 'primary'">
              {{ row.type === 'sales' ? '销售' : '采购' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已批准' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 批准</el-button>
            <el-button type="danger" size="small" @click="handleReject(row)" v-if="row.status === 'pending'"><el-icon><Close /></el-icon> 驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:page-size="pagination.pageSize" v-model:current-page="pagination.currentPage" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, View, Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ contractNo: '', party: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, contractNo: 'SC-2024-001', party: '沙特电信公司', amount: 1250000, type: 'sales', applicant: 'Ahmed Al-Fahd', status: 'pending' },
  { id: 2, contractNo: 'SC-2024-002', party: 'Apple Supplier', amount: 980000, type: 'purchase', applicant: 'Mohammed Al-Qahtani', status: 'approved' },
  { id: 3, contractNo: 'SC-2024-003', party: '三星供应商', amount: 756000, type: 'purchase', applicant: 'Saud Al-Otaibi', status: 'rejected' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.contractNo = ''; searchForm.party = ''; searchForm.status = '' }
const handleView = (row: any) => { ElMessage.info(`查看合同: ${row.contractNo}`) }
const handleApprove = (row: any) => {
  ElMessageBox.confirm(`批准合同 ${row.contractNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
    .then(() => { row.status = 'approved'; ElMessage.success('已批准') }).catch(() => {})
}
const handleReject = (row: any) => {
  ElMessageBox.confirm(`驳回合同 ${row.contractNo}？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { row.status = 'rejected'; ElMessage.warning('已驳回') }).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>