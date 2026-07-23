<!-- 
  文件路径: frontend/src/modules/marketing/pages/Campaigns.vue
  功能: 营销活动列表 - 管理所有营销活动
-->

<template>
  <div class="marketing-campaigns-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>📢 营销活动管理</h1>
        <p class="header-subtitle">管理所有营销活动，支持多维度筛选</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon> 新建活动
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
            placeholder="搜索活动名称..."
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="促销活动" value="promotion" />
            <el-option label="品牌活动" value="brand" />
            <el-option label="获客活动" value="acquisition" />
            <el-option label="会员活动" value="member" />
            <el-option label="节日活动" value="holiday" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="进行中" value="active" />
            <el-option label="已结束" value="ended" />
            <el-option label="待启动" value="pending" />
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
          <span>活动列表</span>
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
        <el-table-column prop="name" label="活动名称" min-width="180">
          <template #default="{ row }">
            <div class="cell-name">
              <span class="name-icon">{{ getTypeIcon(row.type) }}</span>
              <span class="name-text">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="预算" width="130" align="right">
          <template #default="{ row }">
            {{ formatCurrency(row.budget) }}
          </template>
        </el-table-column>
        <el-table-column prop="reach" label="触达人数" width="120" align="center">
          <template #default="{ row }">
            {{ row.reach?.toLocaleString() || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dateRange" label="活动周期" width="200" />
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
        <p>确定要删除活动 <strong>{{ deleteTarget?.name }}</strong> 吗？</p>
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
  Megaphone,
  Plus,
  Search,
  Refresh,
  Download,
  View,
  Edit,
  Delete,
  Top,
  Bottom,
  Play,
  Pause
} from '@element-plus/icons-vue'
// ============================================================
// API 导入
// ============================================================
import { getCampaignList, deleteCampaign, startCampaign, pauseCampaign } from '@/api/modules/marketing'

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
  { label: '总活动', value: '86', icon: 'TrendCharts', color: '#409EFF', trend: 'up', change: 12.5, path: '' },
  { label: '进行中', value: '28', icon: 'Present', color: '#67C23A', trend: 'up', change: 8.3, path: 'active' },
  { label: '待启动', value: '18', icon: 'Calendar', color: '#E6A23C', trend: 'down', change: -3.2, path: 'pending' },
  { label: '总预算', value: 'SAR 8.5M', icon: 'Star', color: '#F56C6C', trend: 'up', change: 15.2, path: '' },
])

// ============================================================
// 表格数据
// ============================================================

const tableData = ref([
  {
    id: 1,
    name: '双十一促销活动',
    type: 'promotion',
    budget: 1250000,
    reach: 285600,
    status: 'active',
    dateRange: '2024-11-01 ~ 2024-11-11'
  },
  {
    id: 2,
    name: '品牌周年庆',
    type: 'brand',
    budget: 980000,
    reach: 198700,
    status: 'active',
    dateRange: '2024-10-15 ~ 2024-10-31'
  },
  {
    id: 3,
    name: '新客户获客计划',
    type: 'acquisition',
    budget: 750000,
    reach: 176500,
    status: 'pending',
    dateRange: '2024-12-01 ~ 2024-12-31'
  },
  {
    id: 4,
    name: 'VIP会员专享活动',
    type: 'member',
    budget: 450000,
    reach: 85600,
    status: 'ended',
    dateRange: '2024-09-01 ~ 2024-09-30'
  },
])

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    promotion: '促销活动',
    brand: '品牌活动',
    acquisition: '获客活动',
    member: '会员活动',
    holiday: '节日活动'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    promotion: 'danger',
    brand: 'primary',
    acquisition: 'success',
    member: 'warning',
    holiday: 'info'
  }
  return map[type] || 'info'
}

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    promotion: '🎉',
    brand: '🏷️',
    acquisition: '📈',
    member: '👑',
    holiday: '🎊'
  }
  return map[type] || '📢'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: '进行中',
    ended: '已结束',
    pending: '待启动',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    ended: 'info',
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
    total.value = 86
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
  router.push('/marketing/campaigns/create')
}

const handleRefresh = () => {
  loadData()
  ElMessage.success('已刷新')
}

const handleView = (row: any) => {
  router.push(`/marketing/campaigns/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`/marketing/campaigns/${row.id}/edit`)
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
    ElMessage.success('✅ 活动已删除')
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
  if (stat.path === 'active') {
    searchForm.status = 'active'
    handleSearch()
  } else if (stat.path === 'pending') {
    searchForm.status = 'pending'
    handleSearch()
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
.marketing-campaigns-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

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

.cell-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-icon {
  font-size: 18px;
}

.name-text {
  font-weight: 500;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #F3F4F6;
  margin-top: 4px;
}

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

[data-theme="dark"] .marketing-campaigns-page {
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

@media (max-width: 768px) {
  .marketing-campaigns-page {
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
