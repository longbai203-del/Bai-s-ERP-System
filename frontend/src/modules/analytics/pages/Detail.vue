<!-- 
  文件路径: frontend/src/modules/analytics/pages/Detail.vue
  功能: 分析报告详情 - 查看分析报告详情
-->

<template>
  <div class="analytics-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>📊 分析报告详情</h1>
          <p class="header-subtitle">查看分析报告的详细信息和数据</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="success" @click="handleExport">
          <el-icon><Download /></el-icon> 导出
        </el-button>
        <el-button type="info" @click="handlePrint">
          <el-icon><Printer /></el-icon> 打印
        </el-button>
        <el-button type="danger" plain @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 详情内容 -->
    <template v-else>
      <!-- 概览卡片 -->
      <el-row :gutter="20" class="overview-row">
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">报告名称</div>
            <div class="overview-value">{{ detail.name || '未命名' }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">分析类型</div>
            <div class="overview-value">
              <el-tag :type="getTypeTag(detail.type)" size="large">
                {{ getTypeLabel(detail.type) }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">状态</div>
            <div class="overview-value">
              <el-tag :type="getStatusTag(detail.status)" size="large">
                {{ getStatusLabel(detail.status) }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">创建时间</div>
            <div class="overview-value">{{ detail.createdAt || '2024-10-15 14:30' }}</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细信息 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="detail-card" shadow="hover">
            <template #header>
              <span>📋 详细信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="报告ID">
                <span class="mono-text">{{ detail.id || 'AN-001' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="创建人">
                {{ detail.createdBy || 'Ahmed Al-Fahd' }}
              </el-descriptions-item>
              <el-descriptions-item label="分析维度">
                {{ getDimensionLabel(detail.dimension) }}
              </el-descriptions-item>
              <el-descriptions-item label="对比周期">
                {{ getCompareLabel(detail.compare) }}
              </el-descriptions-item>
              <el-descriptions-item label="数据粒度">
                {{ getGranularityLabel(detail.granularity) }}
              </el-descriptions-item>
              <el-descriptions-item label="数据范围">
                {{ formatDateRange(detail.dateRange) }}
              </el-descriptions-item>
              <el-descriptions-item label="分析指标" :span="2">
                <el-tag
                  v-for="metric in detail.metrics || []"
                  :key="metric"
                  size="small"
                  class="metric-tag"
                >
                  {{ getMetricLabel(metric) }}
                </el-tag>
                <span v-if="!detail.metrics?.length" style="color: #9CA3AF;">未选择</span>
              </el-descriptions-item>
              <el-descriptions-item label="报告描述" :span="2">
                {{ detail.description || '无描述' }}
              </el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">
                {{ detail.remark || '无备注' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 统计信息 -->
          <el-card class="detail-card" shadow="hover">
            <template #header>
              <span>📊 统计信息</span>
            </template>
            <div class="stats-list">
              <div class="stats-item">
                <span class="stats-label">数据点数</span>
                <span class="stats-value">{{ detail.dataPoints || '12,856' }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">分析维度数</span>
                <span class="stats-value">{{ detail.dimensions || '5' }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">图表数量</span>
                <span class="stats-value">{{ detail.charts || '8' }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">报告大小</span>
                <span class="stats-value">{{ detail.size || '2.4 MB' }}</span>
              </div>
            </div>
          </el-card>

          <!-- 操作日志 -->
          <el-card class="detail-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span>📋 操作日志</span>
            </template>
            <div class="log-list">
              <div v-for="log in logs" :key="log.id" class="log-item">
                <div class="log-time">{{ log.time }}</div>
                <div class="log-content">{{ log.content }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 数据预览 -->
      <el-card class="detail-card" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <div class="card-header-with-action">
            <span>📈 数据预览</span>
            <el-button size="small" type="text" @click="handleViewFullData">
              查看完整数据 →
            </el-button>
          </div>
        </template>
        <el-table :data="previewData" style="width: 100%" stripe>
          <el-table-column prop="dimension" label="维度" min-width="120" />
          <el-table-column prop="value" label="数值" align="right" width="120" />
          <el-table-column prop="change" label="变化" align="center" width="120">
            <template #default="{ row }">
              <el-tag :type="row.change >= 0 ? 'success' : 'danger'" size="small">
                {{ row.change >= 0 ? '+' : '' }}{{ row.change }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="trend" label="趋势" align="center" width="80">
            <template #default="{ row }">
              <el-icon :color="row.trend >= 0 ? '#67C23A' : '#F56C6C'">
                <component :is="row.trend >= 0 ? 'Top' : 'Bottom'" />
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteVisible"
      title="⚠️ 确认删除"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <el-icon class="delete-icon" color="#F56C6C" size="48">
          <WarningFilled />
        </el-icon>
        <p>确定要删除分析报告 <strong>{{ detail.name }}</strong> 吗？</p>
        <p class="delete-hint">此操作将删除所有数据和关联文件，不可恢复！</p>
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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, Download, Printer, Delete, WarningFilled,
  Top, Bottom
} from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()
const route = useRoute()

// ============================================================
// 响应式数据
// ============================================================

const loading = ref(false)
const deleting = ref(false)
const deleteVisible = ref(false)

// ============================================================
// 详情数据
// ============================================================

const detail = reactive({
  id: 'AN-001',
  name: '2024年Q4销售分析报告',
  type: 'sales',
  status: 'completed',
  dimension: 'product',
  compare: 'mom',
  granularity: 'month',
  dateRange: ['2024-10-01', '2024-10-31'],
  metrics: ['sales', 'profit', 'orders'],
  description: '2024年第四季度销售数据分析，涵盖产品、区域和客户维度。',
  remark: '本报告用于季度经营会议。',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-15 16:45',
  dataPoints: '12,856',
  dimensions: '5',
  charts: '8',
  size: '2.4 MB'
})

// ============================================================
// 操作日志
// ============================================================

const logs = ref([
  { id: 1, time: '2024-10-15 14:30', content: '创建分析报告' },
  { id: 2, time: '2024-10-15 15:20', content: '数据导入完成' },
  { id: 3, time: '2024-10-15 16:00', content: '分析执行完成' },
  { id: 4, time: '2024-10-15 16:45', content: '报告生成完成' },
])

// ============================================================
// 预览数据
// ============================================================

const previewData = ref([
  { dimension: 'iPhone 15 Pro Max', value: 'SAR 1,285,000', change: 12.5, trend: 12.5 },
  { dimension: '三星 Galaxy S24 Ultra', value: 'SAR 985,000', change: 8.3, trend: 8.3 },
  { dimension: 'MacBook Pro 16"', value: 'SAR 876,000', change: -3.2, trend: -3.2 },
  { dimension: 'iPad Pro 12.9"', value: 'SAR 654,000', change: 5.7, trend: 5.7 },
  { dimension: 'AirPods Pro 2', value: 'SAR 523,000', change: 2.1, trend: 2.1 },
])

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    sales: '销售分析',
    customer: '客户分析',
    product: '产品分析',
    channel: '渠道分析',
    comparison: '对比分析',
    trend: '趋势分析'
  }
  return map[type] || type
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    sales: 'primary',
    customer: 'success',
    product: 'warning',
    channel: 'danger',
    comparison: 'info',
    trend: 'primary'
  }
  return map[type] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    processing: '进行中',
    pending: '待审核',
    draft: '草稿'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    processing: 'warning',
    pending: 'info',
    draft: 'info'
  }
  return map[status] || 'info'
}

const getDimensionLabel = (dimension: string) => {
  const map: Record<string, string> = {
    product: '按产品',
    customer: '按客户',
    region: '按地区',
    time: '按时间',
    channel: '按渠道'
  }
  return map[dimension] || dimension
}

const getCompareLabel = (compare: string) => {
  const map: Record<string, string> = {
    mom: '环比 (MoM)',
    yoy: '同比 (YoY)',
    none: '无对比'
  }
  return map[compare] || compare
}

const getGranularityLabel = (granularity: string) => {
  const map: Record<string, string> = {
    day: '日',
    week: '周',
    month: '月',
    quarter: '季度'
  }
  return map[granularity] || granularity
}

const getMetricLabel = (metric: string) => {
  const map: Record<string, string> = {
    sales: '销售额',
    profit: '利润',
    orders: '订单量',
    customers: '客户数',
    conversion: '转化率',
    avgOrder: '客单价'
  }
  return map[metric] || metric
}

const formatDateRange = (range: string[] | null) => {
  if (!range || range.length !== 2) return '未选择'
  return `${range[0]} 至 ${range[1]}`
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  router.push('/analytics')
}

const handleEdit = () => {
  router.push(`/analytics/${detail.id}/edit`)
}

const handleExport = () => {
  ElMessage.success('📥 导出完成')
}

const handlePrint = () => {
  window.print()
}

const handleDelete = () => {
  deleteVisible.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('✅ 分析报告已删除')
    deleteVisible.value = false
    router.push('/analytics')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

const handleViewFullData = () => {
  ElMessage.info('查看完整数据功能开发中')
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // 实际项目中调用 API
    // const res = await api.get(`/analytics/${id}`)
    // Object.assign(detail, res.data)
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.analytics-detail-page {
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

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-btn {
  margin-top: 4px;
}

.header-title h1 {
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
   加载状态
   ============================================================ */

.loading-container {
  padding: 20px 0;
}

/* ============================================================
   概览卡片
   ============================================================ */

.overview-row {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 12px;
  text-align: center;
}

.overview-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.overview-label {
  font-size: 13px;
  color: #9CA3AF;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

/* ============================================================
   详情卡片
   ============================================================ */

.detail-card {
  border-radius: 12px;
}

.detail-card :deep(.el-card__header) {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
  border-bottom: 1px solid #F3F4F6;
}

:deep(.el-descriptions) {
  font-size: 14px;
}

:deep(.el-descriptions__label) {
  color: #6B7280;
  font-weight: 500;
  width: 120px;
}

.mono-text {
  font-family: 'Courier New', monospace;
  color: #4F46E5;
  background: #EEF2FF;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.metric-tag {
  margin-right: 4px;
  margin-bottom: 2px;
}

/* ============================================================
   统计信息
   ============================================================ */

.stats-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background: #F9FAFB;
  border-radius: 8px;
}

.stats-label {
  font-size: 12px;
  color: #9CA3AF;
}

.stats-value {
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
  margin-top: 4px;
}

/* ============================================================
   操作日志
   ============================================================ */

.log-list {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 12px;
  color: #9CA3AF;
  white-space: nowrap;
  min-width: 130px;
}

.log-content {
  font-size: 13px;
  color: #4B5563;
}

/* ============================================================
   卡片头部带操作
   ============================================================ */

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

[data-theme="dark"] .analytics-detail-page {
  background: #1A1A2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .overview-card {
  background: #2C2C2E;
}

[data-theme="dark"] .overview-value {
  color: #F5F5F7;
}

[data-theme="dark"] .detail-card {
  background: #2C2C2E;
}

[data-theme="dark"] .detail-card :deep(.el-card__header) {
  color: #F5F5F7;
  border-color: #3A3A3C;
}

[data-theme="dark"] :deep(.el-descriptions) {
  color: #F5F5F7;
}

[data-theme="dark"] :deep(.el-descriptions__label) {
  color: #9CA3AF;
}

[data-theme="dark"] :deep(.el-descriptions .el-descriptions__body .el-descriptions__table .el-descriptions-item__cell) {
  border-color: #3A3A3C;
}

[data-theme="dark"] .stats-item {
  background: #3A3A3C;
}

[data-theme="dark"] .stats-value {
  color: #F5F5F7;
}

[data-theme="dark"] .log-item {
  border-color: #3A3A3C;
}

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

[data-theme="dark"] .mono-text {
  background: #3A3A3C;
  color: #818CF8;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .analytics-detail-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .header-actions .el-button {
    flex: 1;
    min-width: 80px;
  }

  .stats-list {
    grid-template-columns: 1fr;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    width: 80px;
  }
}
</style>