<!-- 
  文件路径: frontend/src/modules/orders/pages/SalesReturns.vue
  功能: 销售退货 - 管理销售退货单
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <el-form :model="searchForm" layout="inline">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="退货单号">
              <el-input v-model="searchForm.returnNo" placeholder="请输入退货单号" clearable />
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
                <el-option label="待审核" value="pending" />
                <el-option label="已审核" value="approved" />
                <el-option label="已退货" value="completed" />
                <el-option label="已拒绝" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期范围">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleCreate" style="float: right"><el-icon><Plus /></el-icon> 新建退货单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="stat in statistics" :key="stat.label">
        <el-card class="stat-card">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change" :class="stat.trend">{{ stat.trend === 'up' ? '↑' : '↓' }} {{ stat.change }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="tableData" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="returnNo" label="退货单号" width="140" />
        <el-table-column prop="orderNo" label="原订单" width="140" />
        <el-table-column prop="customer" label="客户名称" />
        <el-table-column prop="totalAmount" label="退货金额" align="right">
          <template #default="{ row }"><span style="font-weight: 600; color: #F56C6C;">{{ formatCurrency(row.totalAmount) }}</span></template>
        </el-table-column>
        <el-table-column prop="reason" label="退货原因" width="150" />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="{ row }"><el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon></el-button>
            <el-button type="success" size="small" @click="handleApprove(row)"><el-icon><Check /></el-icon> 审核</el-button>
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
import { Search, Plus, View, Check, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ returnNo: '', customer: '', status: '', dateRange: [] as [Date, Date] | [] })
const pagination = reactive({ currentPage: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, returnNo: 'SR-2024-001', orderNo: 'SO-2024-002', customer: '沙特电信公司', totalAmount: 45600, reason: '产品质量问题', status: 'pending' },
  { id: 2, returnNo: 'SR-2024-002', orderNo: 'SO-2024-004', customer: '阿尔拉吉银行', totalAmount: 32800, reason: '客户取消订单', status: 'approved' },
  { id: 3, returnNo: 'SR-2024-003', orderNo: 'SO-2024-006', customer: '利雅得银行', totalAmount: 21500, reason: '发货错误', status: 'completed' },
])

const statistics = ref([
  { label: '退货总数', value: '28', change: 5.2, trend: 'up' },
  { label: '退货金额', value: 'SAR 856,000', change: 8.3, trend: 'up' },
  { label: '待审核', value: '6', change: -3.2, trend: 'down' },
  { label: '退货率', value: '2.8%', change: 0.5, trend: 'up' },
])

const loading = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value)
const getStatusType = (status: string) => ({ pending: 'warning', approved: 'primary', completed: 'success', rejected: 'danger' }[status] || 'info')
const getStatusLabel = (status: string) => ({ pending: '待审核', approved: '已审核', completed: '已退货', rejected: '已拒绝' }[status] || status)

const handleSearch = () => { loading.value = true; setTimeout(() => { loading.value = false }, 500) }
const handleReset = () => { searchForm.returnNo = ''; searchForm.customer = ''; searchForm.status = ''; searchForm.dateRange = [] }
const handleCreate = () => { ElMessage.info('新建退货单') }
const handleView = (row: any) => { ElMessage.info(`查看退货单: ${row.returnNo}`) }
const handleApprove = (row: any) => { ElMessage.success(`退货单 ${row.returnNo} 已审核`) }
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除退货单 ${row.returnNo} 吗？`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
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
.stat-label { color: #909399; font-size: 14px; }
.stat-value { font-size: 22px; font-weight: 700; color: #303133; margin: 4px 0; }
.stat-change { font-size: 12px; }
.stat-change.up { color: #67C23A; }
.stat-change.down { color: #F56C6C; }
:deep(.el-form-item) { margin-bottom: 0; }
</style>