<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesOutbound.vue
  功能: 销售出库 - 管理销售出库单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="出库单号">
              <el-input v-model="searchForm.outboundNo" placeholder="请输入出库单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input v-model="searchForm.customer" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 100%">
                <el-option label="待出库" value="pending" />
                <el-option label="出库中" value="processing" />
                <el-option label="已完成" value="completed" />
                <el-option label="已取消" value="cancelled" />
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
                <el-icon><Plus /></el-icon> 新建出库单
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="outboundNo" label="出库单号" width="140" />
        <el-table-column prop="orderNo" label="关联订单" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="totalAmount" label="出库金额" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #409EFF;">{{ formatCurrency(row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outboundDate" label="出库日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
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
  outboundNo: '',
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
  { id: 1, outboundNo: 'SO-2024-001', orderNo: 'SO-2024-001', customer: '沙特电信公司', totalAmount: 285600, outboundDate: '2024-11-20', status: 'pending' },
  { id: 2, outboundNo: 'SO-2024-002', orderNo: 'SO-2024-003', customer: '阿尔拉吉银行', totalAmount: 198700, outboundDate: '2024-11-18', status: 'completed' },
  { id: 3, outboundNo: 'SO-2024-003', orderNo: 'SO-2024-005', customer: '沙特阿美', totalAmount: 176500, outboundDate: '2024-11-15', status: 'processing' },
])

const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = { pending: 'warning', processing: 'primary', completed: 'success', cancelled: 'danger' }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = { pending: '待出库', processing: '出库中', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.outboundNo = ''; searchForm.customer = ''; searchForm.status = ''; searchForm.dateRange = [] }
const handleCreate = () => { ElMessage.info('新建出库单') }
const handleView = (row: any) => { ElMessage.info(`查看出库单: ${row.outboundNo}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑出库单: ${row.outboundNo}`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除出库单 ${row.outboundNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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