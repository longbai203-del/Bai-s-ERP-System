<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesContracts.vue
  功能: 销售合同列表 - 管理所有销售合同
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
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="已签署" value="signed" />
                <el-option label="执行中" value="executing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已终止" value="terminated" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon> 查询
              </el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right">
                <el-icon><Plus /></el-icon> 新建合同
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="contractNo" label="合同编号" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="amount" label="合同金额" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="signDate" label="签署日期" width="120" />
        <el-table-column prop="expiryDate" label="到期日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({
  contractNo: '',
  customer: '',
  status: '',
  dateRange: [] as [Date, Date] | [],
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
})

const tableData = ref([
  {
    id: 1,
    contractNo: 'SC-2024-001',
    customer: '沙特电信公司',
    amount: 1250000,
    signDate: '2024-01-15',
    expiryDate: '2025-01-14',
    status: 'executing',
  },
  {
    id: 2,
    contractNo: 'SC-2024-002',
    customer: '阿尔拉吉银行',
    amount: 980000,
    signDate: '2024-03-20',
    expiryDate: '2025-03-19',
    status: 'executing',
  },
  {
    id: 3,
    contractNo: 'SC-2024-003',
    customer: '沙特阿美',
    amount: 756000,
    signDate: '2024-06-10',
    expiryDate: '2024-12-09',
    status: 'completed',
  },
])

const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    draft: 'info',
    signed: 'success',
    executing: 'primary',
    completed: 'success',
    terminated: 'danger',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    signed: '已签署',
    executing: '执行中',
    completed: '已完成',
    terminated: '已终止',
  }
  return map[status] || status
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 500)
}

const handleReset = () => {
  searchForm.contractNo = ''
  searchForm.customer = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleCreate = () => {
  ElMessage.info('新建合同')
}

const handleView = (row: any) => {
  ElMessage.info(`查看合同: ${row.contractNo}`)
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑合同: ${row.contractNo}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除合同 ${row.contractNo} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>