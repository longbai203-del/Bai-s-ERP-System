<!-- 
  文件路径: frontend/src/modules/finance/pages/Index.vue
  功能: 财务仪表盘 - 财务数据总览
-->

<template>
  <div class="finance-index-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>💰 财务管理</h1>
        <p class="header-subtitle">财务数据总览与核心指标监控</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon> 新建财务记录
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
        <el-button type="success" @click="handleExportAll">
          <el-icon><Download /></el-icon> 批量导出
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in statsData" :key="stat.label">
        <el-card class="stat-card" shadow="hover" @click="handleStatClick(stat)">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="20"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
          <div class="stat-trend" :class="stat.trend">
            {{ stat.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(stat.change) }}% 较上期
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索工具栏 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :model="searchForm" layout="inline" class="filter-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索客户、供应商..."
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
            <el-option label="转账" value="transfer" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="已完成" value="completed" />
            <el-option label="待处理" value="pending" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
            size="default"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card" shadow="hover">
      <template #header>
        <div class="table-header">
          <span>财务交易记录</span>
          <span class="table-total">共 {{ total }} 条记录</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="transactionNo" label="交易编号" width="140" />
        <el-table-column prop="customer" label="客户/供应商" min-width="150" />
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : row.type === 'expense' ? 'danger' : 'info'" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="140" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.type === 'income' ? '#67C23A' : '#F56C6C', fontWeight: 600 }">
              {{ formatCurrency(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="交易日期" width="170" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click.stop="handleView(row)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button size="small" type="primary" @click.stop="handleEdit(row)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button size="small" type="danger" @click.stop="handleDelete(row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteVisible"
      title="确认删除"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <el-icon class="delete-icon" color="#F56C6C" size="48">
          <WarningFilled />
        </el-icon>
        <p>确定要删除交易 <strong>{{ deleteTarget?.transactionNo }}</strong> 吗？</p>
        <p class="delete-hint">此操作将删除所有相关数据，不可恢复！</p>
      </div>
      <template #footer>
        <el-button @click="deleteVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleting" @click="confirmDelete">
          确认删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Plus, Refresh, Download, Search, RefreshLeft,
  View, Edit, Delete, WarningFilled,
  Money, TrendCharts, Coin, Box
} from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()

// ============================================================
// 响应式数据
// ============================================================

const loading = ref(false)
const deleting = ref(false)
const deleteVisible = ref(false)
const deleteTarget = ref<any>(null)

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// ============================================================
// 搜索表单
// ============================================================

const searchForm = reactive({
  keyword: '',
  type: '',
  status: '',
  dateRange: [] as [Date, Date] | []
})

// ============================================================
// 统计数据
// ============================================================

const statsData = ref([
  { label: '总资产', value: 'SAR 28.6M', icon: 'Money', color: '#409EFF', trend: 'up', change: 12.5, path: '' },
  { label: '总负债', value: 'SAR 12.8M', icon: 'Coin', color: '#F56C6C', trend: 'up', change: 5.3, path: '' },
  { label: '净资产', value: 'SAR 15.8M', icon: 'TrendCharts', color: '#67C23A', trend: 'up', change: 18.7, path: '' },
  { label: '本月收入', value: 'SAR 5.8M', icon: 'Box', color: '#E6A23C', trend: 'up', change: 8.2, path: '' },
])

// ============================================================
// 表格数据
// ============================================================

const tableData = ref([
  {
    id: 1,
    transactionNo: 'TRX-2024-001',
    customer: '沙特电信公司',
    type: 'income',
    amount: 285600,
    status: 'completed',
    createdAt: '2024-10-15 14:30'
  },
  {
    id: 2,
    transactionNo: 'TRX-2024-002',
    customer: 'Apple Supplier',
    type: 'expense',
    amount: 156800,
    status: 'pending',
    createdAt: '2024-10-12 09:20'
  },
  {
    id: 3,
    transactionNo: 'TRX-2024-003',
    customer: '阿尔拉吉银行',
    type: 'income',
    amount: 198700,
    status: 'completed',
    createdAt: '2024-10-10 16:45'
  },
  {
    id: 4,
    transactionNo: 'TRX-2024-004',
    customer: '内部转账',
    type: 'transfer',
    amount: 50000,
    status: 'completed',
    createdAt: '2024-10-08 11:00'
  },
  {
    id: 5,
    transactionNo: 'TRX-2024-005',
    customer: '沙特阿美',
    type: 'income',
    amount: 176500,
    status: 'pending',
    createdAt: '2024-10-05 13:15'
  },
])

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    income: '收入',
    expense: '支出',
    transfer: '转账'
  }
  return map[type] || type
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '待处理',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0
  }).format(value)
}

// ============================================================
// 加载数据
// ============================================================

const loadData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    total.value = 1286
    // 实际项目中调用 API
    // const res = await api.get('/finance/transactions', { params: { page: currentPage.value, limit: pageSize.value, ...searchForm } })
    // tableData.value = res.data.list
    // total.value = res.data.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// ============================================================
// 页面操作
// ============================================================

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.dateRange = []
  currentPage.value = 1
  loadData()
}

const handleCreate = () => {
  router.push('/finance/create')
}

const handleRefresh = () => {
  loadData()
  ElMessage.success('已刷新')
}

const handleView = (row: any) => {
  router.push(`/finance/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`/finance/${row.id}/edit`)
}

const handleRowClick = (row: any) => {
  handleView(row)
}

const handleDelete = (row: any) => {
  deleteTarget.value = row
  deleteVisible.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return

  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    const index = tableData.value.findIndex(item => item.id === deleteTarget.value.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('✅ 交易已删除')
    deleteVisible.value = false
    deleteTarget.value = null
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

const handleExportAll = () => {
  ElMessage.success('📥 批量导出完成')
}

const handleStatClick = (stat: any) => {
  ElMessage.info(`查看: ${stat.label}`)
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.finance-index-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ============================================================
   页面头部
   ============================================================ */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 4px 0;
}

.header-subtitle {
  color: #6B7280;
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ============================================================
   统计卡片
   ============================================================ */

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #6B7280;
}

.stat-trend {
  font-size: 12px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #F3F4F6;
}

.stat-trend.up {
  color: #67C23A;
}

.stat-trend.down {
  color: #F56C6C;
}

/* ============================================================
   筛选卡片
   ============================================================ */

.filter-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.filter-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.filter-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #4B5563;
}

/* ============================================================
   表格卡片
   ============================================================ */

.table-card {
  border-radius: 12px;
}

.table-card :deep(.el-card__header) {
  border-bottom: 1px solid #F3F4F6;
  padding: 16px 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header span {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
}

.table-total {
  font-weight: 400;
  font-size: 13px;
  color: #6B7280;
}

/* ============================================================
   分页
   ============================================================ */

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #F3F4F6;
  margin-top: 4px;
}

/* ============================================================
   删除确认对话框
   ============================================================ */

.delete-confirm {
  text-align: center;
  padding: 16px 0;
}

.delete-icon {
  margin-bottom: 16px;
}

.delete-confirm p {
  font-size: 16px;
  color: #1F2937;
  margin: 8px 0;
}

.delete-hint {
  font-size: 13px;
  color: #EF4444 !important;
}

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .finance-index-page {
  background: #1A1A2E;
}

[data-theme="dark"] .page-header .header-left h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .stat-card {
  background: #2C2C2E;
}

[data-theme="dark"] .stat-value {
  color: #F5F5F7;
}

[data-theme="dark"] .stat-trend {
  border-color: #3A3A3C;
}

[data-theme="dark"] .filter-card {
  background: #2C2C2E;
}

[data-theme="dark"] .table-card {
  background: #2C2C2E;
}

[data-theme="dark"] .table-card :deep(.el-card__header) {
  border-color: #3A3A3C;
}

[data-theme="dark"] .table-header span {
  color: #F5F5F7;
}

[data-theme="dark"] .table-card :deep(.el-table) {
  background: #2C2C2E;
  color: #F5F5F7;
}

[data-theme="dark"] .table-card :deep(.el-table th) {
  background: #3A3A3C;
  color: #9CA3AF;
}

[data-theme="dark"] .table-card :deep(.el-table td) {
  border-color: #3A3A3C;
}

[data-theme="dark"] .table-card :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #323234;
}

[data-theme="dark"] .filter-form :deep(.el-form-item__label) {
  color: #9CA3AF;
}

[data-theme="dark"] .pagination-wrapper {
  border-color: #3A3A3C;
}

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .finance-index-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-form :deep(.el-form-item) {
    width: 100%;
  }

  .filter-form :deep(.el-form-item .el-input),
  .filter-form :deep(.el-form-item .el-select),
  .filter-form :deep(.el-form-item .el-date-editor) {
    width: 100% !important;
  }

  .stats-row .el-col {
    margin-bottom: 12px;
  }

  .table-card :deep(.el-table) {
    font-size: 13px;
  }

  .table-card :deep(.el-table .cell) {
    padding: 6px 8px;
  }

  .pagination-wrapper {
    justify-content: center;
  }
}
</style>