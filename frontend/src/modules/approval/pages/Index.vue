<!-- 
  文件路径: frontend/src/modules/approval/pages/Index.vue
  功能: 审批列表 - 管理所有审批记录
-->

<template>
  <div class="approval-index-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>📋 审批管理</h1>
        <p class="header-subtitle">管理所有审批申请，支持多类型审批流程</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon> 发起审批
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
            placeholder="搜索审批标题..."
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="审批类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="采购审批" value="purchase" />
            <el-option label="付款审批" value="payment" />
            <el-option label="费用审批" value="expense" />
            <el-option label="合同审批" value="contract" />
            <el-option label="请假审批" value="leave" />
            <el-option label="用车审批" value="vehicle" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待审批" value="pending" />
            <el-option label="已批准" value="approved" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select v-model="searchForm.urgent" placeholder="全部" clearable style="width: 120px">
            <el-option label="普通" value="normal" />
            <el-option label="紧急" value="urgent" />
            <el-option label="特急" value="critical" />
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
          <span>审批列表</span>
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
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="title" label="审批事项" min-width="200">
          <template #default="{ row }">
            <div class="cell-title">
              <span class="title-icon">{{ getTypeIcon(row.type) }}</span>
              <span class="title-text">{{ row.title }}</span>
              <el-tag v-if="row.urgent === 'critical'" type="danger" size="small" class="urgent-tag">
                特急
              </el-tag>
              <el-tag v-else-if="row.urgent === 'urgent'" type="warning" size="small" class="urgent-tag">
                紧急
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="120" />
        <el-table-column prop="amount" label="金额" width="120" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="170" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click.stop="handleView(row)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button size="small" type="primary" @click.stop="handleEdit(row)" v-if="row.status === 'draft'">
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
        <p>确定要删除审批 <strong>{{ deleteTarget?.title }}</strong> 吗？</p>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Refresh, Download, Search, RefreshLeft,
  View, Edit, Delete, WarningFilled,
  ShoppingCart, Money, Coin, Document, User, Van
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
  urgent: '',
  dateRange: [] as [Date, Date] | []
})

// ============================================================
// 统计数据
// ============================================================

const statsData = ref([
  { label: '待审批', value: '12', icon: 'Document', color: '#E6A23C', trend: 'up', change: 8.5, path: 'pending' },
  { label: '我发起的', value: '28', icon: 'User', color: '#409EFF', trend: 'up', change: 3.2, path: 'my' },
  { label: '已批准', value: '156', icon: 'Check', color: '#67C23A', trend: 'up', change: 12.5, path: 'approved' },
  { label: '平均耗时', value: '2.5h', icon: 'Clock', color: '#8B5CF6', trend: 'down', change: -5.6, path: '' },
])

// ============================================================
// 表格数据
// ============================================================

const tableData = ref([
  {
    id: 1,
    title: '采购申请 PR-2024-001 - iPhone 15 Pro Max',
    type: 'purchase',
    applicant: 'Ahmed Al-Fahd',
    amount: 285600,
    status: 'pending',
    urgent: 'urgent',
    createdAt: '2024-11-20 10:30'
  },
  {
    id: 2,
    title: '付款申请 PY-2024-002 - 供应商货款',
    type: 'payment',
    applicant: 'Mohammed Al-Qahtani',
    amount: 198700,
    status: 'approved',
    urgent: 'normal',
    createdAt: '2024-11-19 14:20'
  },
  {
    id: 3,
    title: '年假申请 - 2024年度年假',
    type: 'leave',
    applicant: 'Saud Al-Otaibi',
    amount: 0,
    status: 'rejected',
    urgent: 'normal',
    createdAt: '2024-11-18 09:00'
  },
  {
    id: 4,
    title: '办公费用报销 - Q4办公用品',
    type: 'expense',
    applicant: 'Faisal Al-Dossary',
    amount: 28560,
    status: 'pending',
    urgent: 'normal',
    createdAt: '2024-11-17 16:45'
  },
  {
    id: 5,
    title: '销售合同审批 - 沙特电信公司',
    type: 'contract',
    applicant: 'Khalid Al-Ghamdi',
    amount: 1250000,
    status: 'approved',
    urgent: 'critical',
    createdAt: '2024-11-16 11:20'
  },
])

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    purchase: '采购',
    payment: '付款',
    expense: '费用',
    contract: '合同',
    leave: '请假',
    vehicle: '用车'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    purchase: 'primary',
    payment: 'warning',
    expense: 'info',
    contract: 'success',
    leave: 'danger',
    vehicle: 'primary'
  }
  return map[type] || 'info'
}

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    purchase: '🛒',
    payment: '💳',
    expense: '💰',
    contract: '📄',
    leave: '🏖️',
    vehicle: '🚗'
  }
  return map[type] || '📋'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已驳回',
    draft: '草稿'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    draft: 'info'
  }
  return map[status] || 'info'
}

const formatCurrency = (value: number) => {
  if (!value) return '—'
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
    total.value = 156
    // 实际项目中调用 API
    // const res = await api.get('/approvals', { params: { page: currentPage.value, limit: pageSize.value, ...searchForm } })
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
  searchForm.urgent = ''
  searchForm.dateRange = []
  currentPage.value = 1
  loadData()
}

const handleCreate = () => {
  router.push('/approval/create')
}

const handleRefresh = () => {
  loadData()
  ElMessage.success('已刷新')
}

const handleView = (row: any) => {
  router.push(`/approval/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`/approval/${row.id}/edit`)
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
    ElMessage.success('✅ 审批已删除')
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
  if (stat.path === 'pending') {
    searchForm.status = 'pending'
    handleSearch()
  } else if (stat.path === 'approved') {
    searchForm.status = 'approved'
    handleSearch()
  } else if (stat.path === 'my') {
    ElMessage.info('查看我发起的审批')
  }
}

// ============================================================
// 生命周期
// ============================================================

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.approval-index-page {
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

.cell-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 18px;
}

.title-text {
  font-weight: 500;
}

.urgent-tag {
  margin-left: 4px;
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

[data-theme="dark"] .approval-index-page {
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
  .approval-index-page {
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