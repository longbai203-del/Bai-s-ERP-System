<!-- 
  文件路径: frontend/src/modules/finance/pages/Detail.vue
  功能: 财务交易详情 - 查看完整交易信息
-->

<template>
  <div class="finance-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>💰 交易详情</h1>
          <p class="header-subtitle">交易编号: {{ detail.transactionNo || 'TRX-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="success" @click="handlePrint">
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
      <el-card class="overview-card" shadow="hover">
        <div class="overview-content">
          <div class="overview-icon">
            <span class="icon-large">{{ getTypeIcon(detail.type) }}</span>
          </div>
          <div class="overview-info">
            <div class="overview-name">{{ detail.counterparty || '未指定' }}</div>
            <div class="overview-meta">
              <el-tag :type="detail.type === 'income' ? 'success' : detail.type === 'expense' ? 'danger' : 'info'" size="large">
                {{ getTypeLabel(detail.type) }}
              </el-tag>
              <el-tag :type="getStatusTag(detail.status)" size="large">
                {{ getStatusLabel(detail.status) }}
              </el-tag>
              <span class="overview-id">交易编号: {{ detail.transactionNo || 'TRX-001' }}</span>
            </div>
            <div class="overview-amount">
              交易金额: <span class="amount-value" :style="{ color: detail.type === 'income' ? '#67C23A' : '#F56C6C' }">
                {{ formatCurrency(detail.amount) }}
              </span>
            </div>
          </div>
          <div class="overview-stats">
            <div class="stat-item">
              <div class="stat-label">交易日期</div>
              <div class="stat-value small">{{ detail.transactionDate || '-' }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">支付方式</div>
              <div class="stat-value small">{{ getPaymentMethodLabel(detail.paymentMethod) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">创建人</div>
              <div class="stat-value small">{{ detail.createdBy || '系统管理员' }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细信息 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📋 交易信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="交易编号">
                <span class="mono-text">{{ detail.transactionNo || 'TRX-001' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="交易类型">
                <el-tag :type="detail.type === 'income' ? 'success' : detail.type === 'expense' ? 'danger' : 'info'">
                  {{ getTypeLabel(detail.type) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="交易金额">
                <span class="amount-highlight" :style="{ color: detail.type === 'income' ? '#67C23A' : '#F56C6C' }">
                  {{ formatCurrency(detail.amount) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="交易日期">{{ detail.transactionDate || '-' }}</el-descriptions-item>
              <el-descriptions-item label="客户/供应商">{{ detail.counterparty || '-' }}</el-descriptions-item>
              <el-descriptions-item label="支付方式">{{ getPaymentMethodLabel(detail.paymentMethod) }}</el-descriptions-item>
              <el-descriptions-item label="会计科目">{{ detail.account || '-' }}</el-descriptions-item>
              <el-descriptions-item label="成本中心">{{ detail.costCenter || '-' }}</el-descriptions-item>
              <el-descriptions-item label="发票号码">{{ detail.invoiceNo || '-' }}</el-descriptions-item>
              <el-descriptions-item label="参考号">{{ detail.referenceNo || '-' }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusTag(detail.status)">{{ getStatusLabel(detail.status) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ detail.createdAt || '2024-10-15 14:30' }}</el-descriptions-item>
              <el-descriptions-item label="交易说明" :span="2">{{ detail.description || '-' }}</el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">{{ detail.remark || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 关联凭证 -->
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span>📎 关联凭证</span>
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
                <el-empty description="暂无附件" :image-size="60" />
              </div>
            </div>
          </el-card>

          <!-- 操作日志 -->
          <el-card class="info-card" shadow="hover" style="margin-top: 20px;">
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
        <p>确定要删除交易 <strong>{{ detail.transactionNo }}</strong> 吗？</p>
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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, Printer, Delete, WarningFilled,
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
  transactionNo: 'TRX-2024-001',
  type: 'income',
  counterparty: '沙特电信公司',
  amount: 285600,
  transactionDate: '2024-10-15',
  paymentMethod: 'bank_transfer',
  account: '1002 银行存款',
  costCenter: 'CC-001 销售成本中心',
  invoiceNo: 'INV-2024-001',
  referenceNo: 'PO-2024-001',
  status: 'completed',
  description: '沙特电信公司 2024年Q3技术服务费',
  remark: '发票已收到，付款已完成',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-15 16:45'
})

// ============================================================
// 附件
// ============================================================

const attachments = ref([
  { name: '发票_INV-2024-001.pdf', size: '2.4 MB' },
  { name: '合同_CT-2024-001.pdf', size: '1.8 MB' },
])

// ============================================================
// 操作日志
// ============================================================

const logs = ref([
  { id: 1, time: '2024-10-15 14:30', content: '创建交易记录' },
  { id: 2, time: '2024-10-15 15:20', content: '财务审核通过' },
  { id: 3, time: '2024-10-15 16:45', content: '付款已完成' },
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

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    income: '📈',
    expense: '📉',
    transfer: '🔄'
  }
  return map[type] || '💰'
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

const getPaymentMethodLabel = (method: string) => {
  const map: Record<string, string> = {
    bank_transfer: '银行转账',
    cash: '现金',
    credit_card: '信用卡',
    cheque: '支票',
    online: '在线支付'
  }
  return map[method] || method
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
  router.push('/finance')
}

const handleEdit = () => {
  router.push(`/finance/${detail.transactionNo}/edit`)
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
    ElMessage.success('✅ 交易已删除')
    deleteVisible.value = false
    router.push('/finance')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
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
    // const res = await api.get(`/finance/transactions/${id}`)
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
.finance-detail-page {
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

.overview-amount {
  font-size: 16px;
  margin-top: 4px;
}

.amount-value {
  font-weight: 700;
  font-size: 22px;
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

.overview-stats .stat-value.small {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
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
  font-size: 16px;
}

/* ============================================================
   附件
   ============================================================ */

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

[data-theme="dark"] .finance-detail-page {
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

[data-theme="dark"] .overview-stats .stat-value.small {
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

[data-theme="dark"] .log-item {
  border-color: #3A3A3C;
}

[data-theme="dark"] .log-content {
  color: #D1D5DB;
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
  .finance-detail-page {
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