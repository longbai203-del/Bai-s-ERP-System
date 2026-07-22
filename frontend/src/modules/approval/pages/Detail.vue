<!-- 
  文件路径: frontend/src/modules/approval/pages/Detail.vue
  功能: 审批详情 - 查看审批详情
-->

<template>
  <div class="approval-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>📋 审批详情</h1>
          <p class="header-subtitle">审批编号: {{ detail.approvalNo || 'AP-2024-001' }}</p>
        </div>
      </div>
      <div class="header-actions" v-if="detail.status === 'pending'">
        <el-button type="success" @click="handleApprove" :loading="processing">
          <el-icon><Check /></el-icon> 批准
        </el-button>
        <el-button type="danger" @click="handleReject" :loading="processing">
          <el-icon><Close /></el-icon> 驳回
        </el-button>
        <el-button @click="handleDelegate">
          <el-icon><User /></el-icon> 委托
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 详情内容 -->
    <template v-else>
      <!-- 状态卡片 -->
      <el-card class="status-card" shadow="hover">
        <div class="status-content">
          <div class="status-left">
            <div class="status-badge" :class="detail.status">
              <el-icon :size="24"><component :is="getStatusIcon(detail.status)" /></el-icon>
            </div>
            <div>
              <div class="status-title">{{ detail.title || '采购申请 PR-2024-001' }}</div>
              <div class="status-meta">
                <el-tag :type="getStatusTag(detail.status)" size="large">
                  {{ getStatusLabel(detail.status) }}
                </el-tag>
                <el-tag v-if="detail.urgent === 'critical'" type="danger" size="large">
                  🚨 特急
                </el-tag>
                <el-tag v-else-if="detail.urgent === 'urgent'" type="warning" size="large">
                  ⚡ 紧急
                </el-tag>
                <span class="status-time">提交于: {{ detail.createdAt || '2024-11-20 10:30' }}</span>
              </div>
            </div>
          </div>
          <div class="status-right">
            <div class="status-amount">
              <span class="amount-label">审批金额</span>
              <span class="amount-value">{{ formatCurrency(detail.amount) }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细信息 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📋 审批信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="审批编号">
                <span class="mono-text">{{ detail.approvalNo || 'AP-2024-001' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="审批类型">
                <el-tag :type="getTypeTag(detail.type)" size="small">
                  {{ getTypeLabel(detail.type) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="关联单据">
                {{ detail.referenceNo || 'PR-2024-001' }}
              </el-descriptions-item>
              <el-descriptions-item label="申请人">
                {{ detail.applicant || 'Ahmed Al-Fahd' }}
              </el-descriptions-item>
              <el-descriptions-item label="申请金额">
                <span class="amount-highlight">{{ formatCurrency(detail.amount) }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="紧急程度">
                <el-tag :type="detail.urgent === 'critical' ? 'danger' : detail.urgent === 'urgent' ? 'warning' : 'info'">
                  {{ detail.urgent === 'critical' ? '特急' : detail.urgent === 'urgent' ? '紧急' : '普通' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="审批人">
                {{ detail.approver || 'Mohammed Al-Qahtani' }}
              </el-descriptions-item>
              <el-descriptions-item label="抄送人">
                <el-tag v-for="cc in detail.cc || []" :key="cc" size="small" class="cc-tag">
                  {{ cc }}
                </el-tag>
                <span v-if="!detail.cc?.length" style="color: #9CA3AF;">无</span>
              </el-descriptions-item>
              <el-descriptions-item label="期望完成日期" :span="2">
                {{ detail.expectedDate || '2024-11-25' }}
              </el-descriptions-item>
              <el-descriptions-item label="审批说明" :span="2">
                <div class="description-text">{{ detail.description || '详细说明内容...' }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">
                {{ detail.remark || '无备注' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 审批流程 -->
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>🔀 审批流程</span>
            </template>
            <el-steps direction="vertical" :active="activeStep" finish-status="success">
              <el-step
                v-for="(step, index) in flowSteps"
                :key="index"
                :title="step.title"
                :description="step.description"
                :status="getStepStatus(index)"
              />
            </el-steps>
          </el-card>

          <!-- 附件 -->
          <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span>📎 附件 ({{ attachments.length }})</span>
            </template>
            <div v-for="file in attachments" :key="file.name" class="attachment-item">
              <el-icon><Document /></el-icon>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
              <el-button type="primary" size="small" text @click="handleDownload(file)">
                下载
              </el-button>
            </div>
            <div v-if="!attachments.length" class="no-attachment">
              <el-empty description="暂无附件" :image-size="60" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 审批历史 -->
      <el-card class="history-card" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <span>📜 审批历史</span>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in historyRecords"
            :key="index"
            :timestamp="record.time"
            :type="record.type"
            placement="top"
          >
            <div class="history-content">
              <span class="history-action">{{ record.action }}</span>
              <span class="history-user">—— {{ record.user }}</span>
              <span v-if="record.comment" class="history-comment">{{ record.comment }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </template>

    <!-- 驳回对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="驳回审批"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请说明驳回原因..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="processing" @click="confirmReject">
          确认驳回
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Check, Close, User, Document,
  Clock, CircleCheck, CircleClose, Loading
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
const processing = ref(false)
const rejectDialogVisible = ref(false)

// ============================================================
// 详情数据
// ============================================================

const detail = reactive({
  approvalNo: 'AP-2024-001',
  title: '采购申请 PR-2024-001 - iPhone 15 Pro Max',
  type: 'purchase',
  status: 'pending',
  referenceNo: 'PR-2024-001',
  applicant: 'Ahmed Al-Fahd',
  amount: 285600,
  urgent: 'urgent',
  approver: 'Mohammed Al-Qahtani',
  cc: ['Khalid Al-Ghamdi'],
  expectedDate: '2024-11-25',
  description: '采购100台iPhone 15 Pro Max用于库存补充，已获得供应商报价。',
  remark: '紧急采购，请尽快审批。',
  createdAt: '2024-11-20 10:30',
  updatedAt: '2024-11-20 10:30'
})

// ============================================================
// 审批流程
// ============================================================

const flowSteps = ref([
  { title: '提交申请', description: '申请人: Ahmed Al-Fahd' },
  { title: '部门审批', description: '审批人: Mohammed Al-Qahtani' },
  { title: '财务审批', description: '审批人: Saud Al-Otaibi' },
  { title: '完成', description: '归档' },
])

const activeStep = computed(() => {
  if (detail.status === 'approved') return 3
  if (detail.status === 'pending') return 1
  if (detail.status === 'rejected') return 1
  return 0
})

const getStepStatus = (index: number) => {
  if (detail.status === 'approved') return index < 3 ? 'success' : 'finish'
  if (detail.status === 'rejected') return index === 1 ? 'error' : index === 0 ? 'success' : 'wait'
  if (index < activeStep.value) return 'success'
  if (index === activeStep.value) return 'process'
  return 'wait'
}

// ============================================================
// 附件
// ============================================================

const attachments = ref([
  { name: '采购申请单.pdf', size: '2.4 MB' },
  { name: '供应商报价单.xlsx', size: '856 KB' },
])

// ============================================================
// 审批历史
// ============================================================

const historyRecords = ref([
  { time: '2024-11-20 10:30', action: '提交审批申请', user: 'Ahmed Al-Fahd', type: 'primary' },
  { time: '2024-11-20 10:35', action: '部门审批通过', user: 'Mohammed Al-Qahtani', type: 'success' },
  { time: '2024-11-20 11:00', action: '财务审批待处理', user: 'Saud Al-Otaibi', type: 'warning' },
])

// ============================================================
// 驳回表单
// ============================================================

const rejectForm = reactive({
  reason: ''
})

// ============================================================
// 工具函数
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    purchase: '采购审批',
    payment: '付款审批',
    expense: '费用审批',
    contract: '合同审批',
    leave: '请假审批',
    vehicle: '用车审批'
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

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已驳回'
  }
  return map[status] || status
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusIcon = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Loading',
    approved: 'CircleCheck',
    rejected: 'CircleClose'
  }
  return map[status] || 'Clock'
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
  router.push('/approval')
}

const handleApprove = () => {
  ElMessageBox.confirm('确认批准该审批申请？', '批准确认', {
    confirmButtonText: '确认批准',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    processing.value = true
    setTimeout(() => {
      detail.status = 'approved'
      processing.value = false
      ElMessage.success('✅ 审批已批准')
      // 更新历史
      historyRecords.value.push({
        time: new Date().toLocaleString(),
        action: '审批通过',
        user: '当前用户',
        type: 'success'
      })
    }, 1000)
  }).catch(() => {})
}

const handleReject = () => {
  rejectForm.reason = ''
  rejectDialogVisible.value = true
}

const confirmReject = () => {
  if (!rejectForm.reason.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }

  processing.value = true
  setTimeout(() => {
    detail.status = 'rejected'
    processing.value = false
    rejectDialogVisible.value = false
    ElMessage.warning('✅ 审批已驳回')
    // 更新历史
    historyRecords.value.push({
      time: new Date().toLocaleString(),
      action: '审批驳回',
      user: '当前用户',
      comment: rejectForm.reason,
      type: 'danger'
    })
  }, 1000)
}

const handleDelegate = () => {
  ElMessage.info('委托审批功能开发中')
}

const handleDownload = (file: any) => {
  ElMessage.success(`📥 下载: ${file.name}`)
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // 实际项目中调用 API
    // const res = await api.get(`/approvals/${id}`)
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
.approval-detail-page {
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
   状态卡片
   ============================================================ */

.status-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.status-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.status-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.status-badge.pending { background: #E6A23C; }
.status-badge.approved { background: #67C23A; }
.status-badge.rejected { background: #F56C6C; }

.status-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.status-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}

.status-time {
  font-size: 13px;
  color: #9CA3AF;
}

.status-right {
  text-align: right;
}

.status-amount .amount-label {
  display: block;
  font-size: 12px;
  color: #9CA3AF;
}

.status-amount .amount-value {
  font-size: 24px;
  font-weight: 700;
  color: #4F46E5;
}

/* ============================================================
   信息卡片
   ============================================================ */

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

.mono-text {
  font-family: 'Courier New', monospace;
  color: #4F46E5;
  background: #EEF2FF;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.amount-highlight {
  font-weight: 700;
  color: #4F46E5;
}

.cc-tag {
  margin-right: 4px;
  margin-bottom: 2px;
}

.description-text {
  line-height: 1.8;
  color: #4B5563;
}

/* ============================================================
   附件
   ============================================================ */

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.attachment-item:last-child {
  border-bottom: none;
}

.attachment-item .file-name {
  flex: 1;
  color: #4B5563;
}

.attachment-item .file-size {
  font-size: 12px;
  color: #9CA3AF;
}

.no-attachment {
  padding: 8px 0;
}

/* ============================================================
   审批历史
   ============================================================ */

.history-card {
  border-radius: 12px;
}

.history-card :deep(.el-card__header) {
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
  border-bottom: 1px solid #F3F4F6;
}

.history-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.history-action {
  font-weight: 500;
  color: #1F2937;
}

.history-user {
  color: #6B7280;
  font-size: 13px;
}

.history-comment {
  color: #F56C6C;
  font-size: 13px;
  padding: 4px 12px;
  background: #FEF2F2;
  border-radius: 4px;
  margin-left: 4px;
}

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .approval-detail-page {
  background: #1A1A2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .status-card {
  background: #2C2C2E;
}

[data-theme="dark"] .status-title {
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

[data-theme="dark"] .description-text {
  color: #D1D5DB;
}

[data-theme="dark"] .attachment-item {
  border-color: #3A3A3C;
}

[data-theme="dark"] .attachment-item .file-name {
  color: #D1D5DB;
}

[data-theme="dark"] .history-card {
  background: #2C2C2E;
}

[data-theme="dark"] .history-card :deep(.el-card__header) {
  color: #F5F5F7;
  border-color: #3A3A3C;
}

[data-theme="dark"] .history-action {
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
  .approval-detail-page {
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
    justify-content: stretch;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .status-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .status-right {
    text-align: left;
    width: 100%;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }

  :deep(.el-descriptions__label) {
    width: 80px;
  }

  .status-amount .amount-value {
    font-size: 20px;
  }
}
</style>