<!-- 
  文件路径: frontend/src/modules/marketing/pages/CampaignDetail.vue
  功能: 营销活动详情 - 查看完整活动信息
-->

<template>
  <div class="campaign-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>📢 活动详情</h1>
          <p class="header-subtitle">活动ID: {{ detail.id || 'CAM-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="success" @click="handleDuplicate">
          <el-icon><CopyDocument /></el-icon> 复制
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
      <el-card class="overview-card" shadow="hover">
        <div class="overview-content">
          <div class="overview-icon">
            <span class="icon-large">{{ getTypeIcon(detail.type) }}</span>
          </div>
          <div class="overview-info">
            <div class="overview-name">{{ detail.name || '未命名活动' }}</div>
            <div class="overview-meta">
              <el-tag :type="getTypeTag(detail.type)" size="large">
                {{ getTypeLabel(detail.type) }}
              </el-tag>
              <el-tag :type="getStatusTag(detail.status)" size="large">
                {{ getStatusLabel(detail.status) }}
              </el-tag>
              <span class="overview-id">活动ID: {{ detail.id || 'CAM-001' }}</span>
            </div>
            <div class="overview-slogan">{{ detail.slogan || '无口号' }}</div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-label">预算</div>
              <div class="stat-value">{{ formatCurrency(detail.budget) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">触达人数</div>
              <div class="stat-value">{{ detail.reach?.toLocaleString() || 0 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">转化率</div>
              <div class="stat-value">{{ detail.conversionRate || '0%' }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细信息 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📋 活动信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="活动名称">{{ detail.name || '-' }}</el-descriptions-item>
              <el-descriptions-item label="活动类型">
                <el-tag :type="getTypeTag(detail.type)">{{ getTypeLabel(detail.type) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="活动口号">{{ detail.slogan || '-' }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusTag(detail.status)">{{ getStatusLabel(detail.status) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="开始日期">{{ detail.startDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="结束日期">{{ detail.endDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="预算金额">{{ formatCurrency(detail.budget) }}</el-descriptions-item>
              <el-descriptions-item label="目标触达">{{ detail.targetReach?.toLocaleString() || 0 }} 人</el-descriptions-item>
              <el-descriptions-item label="实际触达">{{ detail.reach?.toLocaleString() || 0 }} 人</el-descriptions-item>
              <el-descriptions-item label="转化率">{{ detail.conversionRate || '0%' }}</el-descriptions-item>
              <el-descriptions-item label="推广渠道" :span="2">
                <el-tag v-for="ch in detail.channels" :key="ch" size="small" class="tag-item">
                  {{ getChannelLabel(ch) }}
                </el-tag>
                <span v-if="!detail.channels?.length" style="color: #9CA3AF;">未选择</span>
              </el-descriptions-item>
              <el-descriptions-item label="目标受众" :span="2">
                <el-tag v-for="aud in detail.targetAudience" :key="aud" size="small" class="tag-item">
                  {{ getAudienceLabel(aud) }}
                </el-tag>
                <span v-if="!detail.targetAudience?.length" style="color: #9CA3AF;">未选择</span>
              </el-descriptions-item>
              <el-descriptions-item label="活动描述" :span="2">{{ detail.description || '-' }}</el-descriptions-item>
              <el-descriptions-item label="活动亮点" :span="2">{{ detail.highlights || '-' }}</el-descriptions-item>
              <el-descriptions-item label="创建时间" :span="2">{{ detail.createdAt || '2024-10-15 14:30' }}</el-descriptions-item>
              <el-descriptions-item label="创建人" :span="2">{{ detail.createdBy || '系统管理员' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 活动进度 -->
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📊 活动进度</span>
            </template>
            <div class="progress-container">
              <div class="progress-item">
                <span class="progress-label">时间进度</span>
                <el-progress :percentage="timeProgress" :color="timeProgress < 50 ? '#409EFF' : timeProgress < 80 ? '#E6A23C' : '#67C23A'" />
              </div>
              <div class="progress-item">
                <span class="progress-label">预算使用</span>
                <el-progress :percentage="budgetUsage" :color="budgetUsage < 50 ? '#409EFF' : budgetUsage < 80 ? '#E6A23C' : '#F56C6C'" />
              </div>
              <div class="progress-item">
                <span class="progress-label">目标完成</span>
                <el-progress :percentage="reachProgress" :color="reachProgress < 50 ? '#409EFF' : reachProgress < 80 ? '#E6A23C' : '#67C23A'" />
              </div>
            </div>
          </el-card>

          <!-- 附件 -->
          <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span>📎 活动素材 ({{ attachments.length }})</span>
            </template>
            <div class="attachments">
              <div v-for="file in attachments" :key="file.name" class="attachment-item">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
                <el-button type="primary" size="small" text @click="handleDownload(file)">
                  下载
                </el-button>
              </div>
              <div v-if="!attachments.length" class="no-attachment">
                <el-empty description="暂无素材" :image-size="60" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 效果数据 -->
      <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <div class="card-header-with-action">
            <span>📈 活动效果数据</span>
            <el-button size="small" type="text" @click="handleViewFullReport">
              查看完整报告 →
            </el-button>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="6" v-for="metric in performanceMetrics" :key="metric.label">
            <div class="metric-card">
              <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-change" :class="metric.trend">
                {{ metric.trend === 'up' ? '↑' : '↓' }} {{ Math.abs(metric.change) }}%
              </div>
            </div>
          </el-col>
        </el-row>
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
        <p>确定要删除活动 <strong>{{ detail.name }}</strong> 吗？</p>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, CopyDocument, Delete, WarningFilled,
  Document
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
  id: 'CAM-001',
  name: '双十一促销活动',
  type: 'promotion',
  slogan: '全年最低价，错过等一年！',
  status: 'active',
  startDate: '2024-11-01',
  endDate: '2024-11-11',
  budget: 1250000,
  targetReach: 300000,
  reach: 285600,
  conversionRate: '8.5%',
  channels: ['social', 'email', 'sms'],
  targetAudience: ['new', 'existing', 'vip'],
  description: '双十一购物节大型促销活动，覆盖线上线下全渠道，目标提升品牌知名度和销售额。',
  highlights: '全场低至5折\n满1000减200\n限时秒杀活动',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30'
})

// ============================================================
// 附件
// ============================================================

const attachments = ref([
  { name: '活动海报_v2.jpg', size: '3.2 MB' },
  { name: '活动方案.pdf', size: '1.8 MB' },
  { name: '投放计划.xlsx', size: '856 KB' },
])

// ============================================================
// 效果指标
// ============================================================

const performanceMetrics = ref([
  { label: '总曝光量', value: '1,285,600', color: '#409EFF', trend: 'up', change: 12.5 },
  { label: '点击量', value: '156,800', color: '#67C23A', trend: 'up', change: 8.3 },
  { label: '转化订单', value: '12,856', color: '#E6A23C', trend: 'up', change: 5.2 },
  { label: 'ROI', value: '3.8x', color: '#F56C6C', trend: 'up', change: 15.2 },
])

// ============================================================
// 计算属性
// ============================================================

const timeProgress = computed(() => {
  if (!detail.startDate || !detail.endDate) return 0
  const start = new Date(detail.startDate).getTime()
  const end = new Date(detail.endDate).getTime()
  const now = Date.now()
  if (now < start) return 0
  if (now > end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
})

const budgetUsage = computed(() => {
  // 模拟预算使用率
  return Math.min(Math.round(Math.random() * 60 + 20), 100)
})

const reachProgress = computed(() => {
  if (!detail.targetReach || !detail.reach) return 0
  return Math.min(Math.round((detail.reach / detail.targetReach) * 100), 100)
})

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

const getChannelLabel = (channel: string) => {
  const map: Record<string, string> = {
    social: '社交媒体',
    email: '邮件营销',
    sms: '短信营销',
    offline: '线下活动',
    partner: '合作伙伴',
    website: '官网'
  }
  return map[channel] || channel
}

const getAudienceLabel = (audience: string) => {
  const map: Record<string, string> = {
    new: '新客户',
    existing: '老客户',
    vip: 'VIP客户',
    business: '企业客户',
    individual: '个人客户'
  }
  return map[audience] || audience
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
// 页面操作
// ============================================================

const handleBack = () => {
  router.push('/marketing/campaigns')
}

const handleEdit = () => {
  router.push(`/marketing/campaigns/${detail.id}/edit`)
}

const handleDuplicate = () => {
  ElMessage.success('✅ 活动已复制，请在列表中查看')
}

const handleDelete = () => {
  deleteVisible.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('✅ 活动已删除')
    deleteVisible.value = false
    router.push('/marketing/campaigns')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

const handleDownload = (file: any) => {
  ElMessage.success(`📥 下载: ${file.name}`)
}

const handleViewFullReport = () => {
  ElMessage.info('查看完整报告功能开发中')
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
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
.campaign-detail-page {
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

.loading-container {
  padding: 20px 0;
}

.overview-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.overview-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.overview-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.overview-icon {
  flex-shrink: 0;
}

.icon-large {
  font-size: 48px;
}

.overview-info {
  flex: 1;
}

.overview-name {
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
}

.overview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin: 4px 0;
}

.overview-id {
  font-size: 13px;
  color: #9CA3AF;
}

.overview-slogan {
  font-size: 14px;
  color: #6B7280;
  font-style: italic;
}

.overview-stats {
  display: flex;
  gap: 24px;
  flex-shrink: 0;
}

.overview-stats .stat-item {
  text-align: center;
}

.overview-stats .stat-label {
  font-size: 11px;
  color: #9CA3AF;
}

.overview-stats .stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
}

.info-row {
  margin-bottom: 20px;
}

.info-card {
  border-radius: 12px;
}

.info-card :deep(.el-card__header) {
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

.tag-item {
  margin-right: 4px;
  margin-bottom: 2px;
}

.progress-container {
  padding: 4px 0;
}

.progress-item {
  margin-bottom: 16px;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.progress-label {
  display: block;
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 4px;
}

.attachments {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F9FAFB;
  border-radius: 6px;
}

.attachment-item .file-name {
  flex: 1;
  font-size: 13px;
  color: #4B5563;
}

.attachment-item .file-size {
  font-size: 12px;
  color: #9CA3AF;
}

.no-attachment {
  padding: 4px 0;
}

.card-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-card {
  text-align: center;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
}

.metric-label {
  font-size: 13px;
  color: #9CA3AF;
  margin-top: 2px;
}

.metric-change {
  font-size: 12px;
  margin-top: 4px;
}

.metric-change.up {
  color: #67C23A;
}

.metric-change.down {
  color: #F56C6C;
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

[data-theme="dark"] .campaign-detail-page {
  background: #1A1A2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .overview-card {
  background: #2C2C2E;
}

[data-theme="dark"] .overview-name {
  color: #F5F5F7;
}

[data-theme="dark"] .overview-slogan {
  color: #9CA3AF;
}

[data-theme="dark"] .overview-stats .stat-value {
  color: #F5F5F7;
}

[data-theme="dark"] .info-card {
  background: #2C2C2E;
}

[data-theme="dark"] .info-card :deep(.el-card__header) {
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

[data-theme="dark"] .attachment-item {
  background: #3A3A3C;
}

[data-theme="dark"] .attachment-item .file-name {
  color: #D1D5DB;
}

[data-theme="dark"] .metric-card {
  background: #3A3A3C;
}

[data-theme="dark"] .metric-value {
  color: #F5F5F7;
}

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

@media (max-width: 768px) {
  .campaign-detail-page {
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

  .overview-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-stats {
    width: 100%;
    justify-content: space-around;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    width: 80px;
  }
}
</style>