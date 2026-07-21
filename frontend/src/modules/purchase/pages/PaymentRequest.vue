<!-- 
  文件路径: frontend/src/modules/purchase/pages/PaymentRequest.vue
  功能: 付款申请 - 管理采购付款申请
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="付款编号">
              <el-input v-model="searchForm.paymentNo" placeholder="请输入付款编号" clearable />
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
                <el-option label="待审批" value="pending" />
                <el-option label="已批准" value="approved" />
                <el-option label="已付款" value="paid" />
                <el-option label="已驳回" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建付款申请</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="paymentNo" label="付款编号" width="140" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="poNo" label="采购订单" width="140" />
        <el-table-column prop="amount" label="付款金额" align="right">
          <template #default="{ row }">{{ formatCurrency(row.amount) }}</template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日期" width="120" />
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'success' : row.status === 'approved' ? 'primary' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'pending' ? '待审批' : row.status === 'approved' ? '已批准' : row.status === 'paid' ? '已付款' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'"><el-icon><Check /></el-icon> 批准</el-button>
            <el-button type="warning" size="small" @click="handlePay(row)" v-if="row.status === 'approved'"><el-icon><Money /></el-icon> 付款</el-button>
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
import { Search, Plus, View, Check, Money, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ paymentNo: '', supplier: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, paymentNo: 'PY-2024-001', supplier: 'Apple Supplier', poNo: 'PO-2024-001', amount: 285600, dueDate: '2024-12-20', status: 'pending' },
  { id: 2, paymentNo: 'PY-2024-002', supplier: 'Samsung Supplier', poNo: 'PO-2024-003', amount: 198700, dueDate: '2024-12-18', status: 'approved' },
  { id: 3, paymentNo: 'PY-2024-003', supplier: 'Dell Supplier', poNo: 'PO-2024-005', amount: 176500, dueDate: '2024-12-15', status: 'paid' },
])

const statistics = ref([
  { label: '待付款总额', value: 'SAR 3,856,200', type: 'warning' },
  { label: '已批准待付', value: 'SAR 1,856,000', type: 'primary' },
  { label: '逾期未付', value: 'SAR 456,000', type: 'danger' },
  { label: '本月已付', value: 'SAR 2,856,000', type: 'success' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.paymentNo = ''; searchForm.supplier = ''; searchForm.status = '' }
const handleCreate = () => { ElMessage.info('新建付款申请') }
const handleView = (row: any) => { ElMessage.info(`查看付款: ${row.paymentNo}`) }
const handleApprove = (row: any) => { ElMessage.success(`付款 ${row.paymentNo} 已批准`) }
const handlePay = (row: any) => { ElMessage.success(`付款 ${row.paymentNo} 已完成`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除付款 ${row.paymentNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => ElMessage.success('删除成功')).catch(() => {})
}
const handleSizeChange = (val: number) => { pagination.pageSize = val; handleSearch() }
const handleCurrentChange = (val: number) => { pagination.currentPage = val; handleSearch() }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.stat-row { margin-bottom: 20px; }
.stat-card { text-align: center; border-radius: 12px; }
.stat-card.warning { border-left: 4px solid #E6A23C; }
.stat-card.primary { border-left: 4px solid #409EFF; }
.stat-card.danger { border-left: 4px solid #F56C6C; }
.stat-card.success { border-left: 4px solid #67C23A; }
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>