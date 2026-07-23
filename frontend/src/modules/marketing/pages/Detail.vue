<template>
  <div class="finance-detail">
    <el-card class="detail-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="default" @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回列表
            </el-button>
            <span class="header-title">财务记录详情</span>
            <el-tag :type="getStatusTag(detailData.status)" size="large" effect="dark">
              {{ getStatusLabel(detailData.status) }}
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button type="warning" @click="handleEdit">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="danger" @click="handleDelete">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon> 导出
            </el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <!-- 顶部概览 -->
        <div class="detail-overview">
          <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">交易编号</div>
                <div class="overview-value">{{ detailData.transactionNo }}</div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">交易类型</div>
                <div class="overview-value">
                  <el-tag :type="getTypeTag(detailData.type)">
                    {{ getTypeLabel(detailData.type) }}
                  </el-tag>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">交易金额</div>
                <div class="overview-value amount" :style="{ color: getAmountColor(detailData.type) }">
                  {{ detailData.type === 'income' ? '+' : '-' }} ¥{{ formatNumber(detailData.amount) }}
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <div class="overview-item">
                <div class="overview-label">交易日期</div>
                <div class="overview-value">{{ detailData.date }}</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 详细信息 -->
        <el-divider />
        
        <el-row :gutter="32">
          <el-col :xs="24" :lg="16">
            <!-- 基本信息 -->
            <div class="info-section">
              <div class="section-title">
                <span class="section-indicator"></span>
                基本信息
              </div>
              <el-descriptions :column="2" border size="default">
                <el-descriptions-item label="交易类型">
                  <el-tag :type="getTypeTag(detailData.type)" size="small">
                    {{ getTypeLabel(detailData.type) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="交易状态">
                  <el-tag :type="getStatusTag(detailData.status)" size="small">
                    {{ getStatusLabel(detailData.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="交易分类">
                  {{ detailData.category || '-' }}
                </el-descriptions-item>
                <el-descriptions-item label="交易金额">
                  <span :style="{ color: getAmountColor(detailData.type), fontWeight: 'bold', fontSize: '16px' }">
                    {{ detailData.type === 'income' ? '+' : '-' }} ¥{{ formatNumber(detailData.amount) }}
                  </span>
                </el-descriptions-item>
                <el-descriptions-item label="交易日期">
                  {{ detailData.date }}
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                  {{ detailData.createdAt || detailData.date + ' 00:00:00' }}
                </el-descriptions-item>
                <el-descriptions-item label="创建人">
                  {{ detailData.createdBy || '系统管理员' }}
                </el-descriptions-item>
                <el-descriptions-item label="最后更新">
                  {{ detailData.updatedAt || detailData.date + ' 00:00:00' }}
                </el-descriptions-item>
                <el-descriptions-item label="交易描述" :span="2">
                  <div class="description-text">{{ detailData.description || '暂无描述' }}</div>
                </el-descriptions-item>
                <el-descriptions-item label="备注" :span="2">
                  <div class="description-text">{{ detailData.remarks || '暂无备注' }}</div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 相关附件 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                相关附件
              </div>
              <div class="attachment-list">
                <div v-if="attachments.length === 0" class="empty-attachment">
                  <el-empty description="暂无附件" :image-size="60" />
                </div>
                <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
                  <div class="attachment-icon">
                    <el-icon :size="32" :color="getFileIconColor(file.type)">
                      <component :is="getFileIcon(file.type)" />
                    </el-icon>
                  </div>
                  <div class="attachment-info">
                    <div class="attachment-name">{{ file.name }}</div>
                    <div class="attachment-meta">
                      <span>{{ file.size }}</span>
                      <span>{{ file.uploadTime }}</span>
                    </div>
                  </div>
                  <div class="attachment-actions">
                    <el-button type="primary" link size="small" @click="handleDownload(file)">
                      <el-icon><Download /></el-icon> 下载
                    </el-button>
                    <el-button type="danger" link size="small" @click="handleDeleteAttachment(index)">
                      <el-icon><Delete /></el-icon> 删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :lg="8">
            <!-- 操作日志 -->
            <div class="info-section">
              <div class="section-title">
                <span class="section-indicator"></span>
                操作日志
              </div>
              <div class="timeline-wrapper">
                <el-timeline>
                  <el-timeline-item
                    v-for="(log, index) in logs"
                    :key="index"
                    :timestamp="log.time"
                    :type="log.type"
                    :icon="log.icon"
                    size="large"
                  >
                    <div class="log-content">
                      <div class="log-action">{{ log.action }}</div>
                      <div class="log-user">{{ log.user }}</div>
                      <div v-if="log.remark" class="log-remark">{{ log.remark }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>

            <!-- 审批信息 -->
            <div class="info-section" style="margin-top: 24px;">
              <div class="section-title">
                <span class="section-indicator"></span>
                审批信息
              </div>
              <div v-if="detailData.status === 'pending'" class="approval-status pending">
                <el-icon class="status-icon"><Clock /></el-icon>
                <span>等待审批中...</span>
                <div class="approval-actions">
                  <el-button type="success" size="small" @click="handleApprove">
                    <el-icon><Select /></el-icon> 通过
                  </el-button>
                  <el-button type="danger" size="small" @click="handleReject">
                    <el-icon><Close /></el-icon> 驳回
                  </el-button>
                </div>
              </div>
              <div v-else-if="detailData.status === 'completed'" class="approval-status approved">
                <el-icon class="status-icon"><SuccessFilled /></el-icon>
                <span>已审批通过</span>
                <div class="approval-meta">
                  <span>审批人：{{ detailData.approver || '李四' }}</span>
                  <span>审批时间：{{ detailData.approvalTime || '2026-07-20 14:30:00' }}</span>
                </div>
              </div>
              <div v-else-if="detailData.status === 'rejected'" class="approval-status rejected">
                <el-icon class="status-icon"><CircleCloseFilled /></el-icon>
                <span>已驳回</span>
                <div class="approval-meta">
                  <span>驳回原因：{{ detailData.rejectReason || '信息不完整，请补充相关资料' }}</span>
                </div>
              </div>
              <div v-else class="approval-status draft">
                <el-icon class="status-icon"><Document /></el-icon>
                <span>草稿状态，尚未提交审批</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 底部操作 -->
        <el-divider />
        <div class="detail-footer">
          <div class="footer-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon> 返回
            </el-button>
          </div>
          <div class="footer-right">
            <el-button type="warning" @click="handleEdit">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button type="primary" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon> 导出PDF
            </el-icon>
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <el-icon color="#f56c6c" size="56"><WarningFilled /></el-icon>
        <p>确定要删除该财务记录吗？</p>
        <p class="delete-hint">交易编号：<strong>{{ detailData.transactionNo }}</strong></p>
        <p class="delete-hint">此操作不可恢复，请谨慎操作！</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleteLoading" @click="confirmDelete">
          确定删除
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog
      v-model="exportDialogVisible"
      title="导出选项"
      width="400px"
    >
      <el-form label-width="100px">
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportFormat">
            <el-radio label="pdf">PDF</el-radio>
            <el-radio label="excel">Excel</el-radio>
            <el-radio label="print">打印</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="包含附件">
          <el-switch v-model="exportIncludeAttachments" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="exportLoading" @click="confirmExport">
          确认导出
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
  ArrowLeft,
  Edit,
  Delete,
  Download,
  Document,
  Clock,
  Select,
  Close,
  SuccessFilled,
  CircleCloseFilled,
  WarningFilled,
  Printer,
  Files,
  Picture,
  VideoCamera,
  Headset,
  Grid,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const loading = ref(false)
const deleteLoading = ref(false)
const exportLoading = ref(false)
const deleteDialogVisible = ref(false)
const exportDialogVisible = ref(false)
const exportFormat = ref('pdf')
const exportIncludeAttachments = ref(true)

// 详情数据
const detailData = reactive({
  id: 0,
  transactionNo: '',
  type: '',
  category: '',
  amount: 0,
  status: '',
  date: '',
  description: '',
  remarks: '',
  createdBy: '',
  createdAt: '',
  updatedAt: '',
  approver: '',
  approvalTime: '',
  rejectReason: ''
})

// 附件列表
const attachments = ref([
  {
    name: '财务凭证_20260701.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadTime: '2026-07-01 10:30:00'
  },
  {
    name: '发票扫描件_20260701.jpg',
    type: 'image',
    size: '1.8 MB',
    uploadTime: '2026-07-01 10:35:00'
  }
])

// 操作日志
const logs = ref([
  {
    time: '2026-07-01 10:30:00',
    type: 'primary',
    icon: 'user',
    action: '创建记录',
    user: '张三',
    remark: '新建财务记录'
  },
  {
    time: '2026-07-01 14:20:00',
    type: 'warning',
    icon: 'edit',
    action: '编辑记录',
    user: '张三',
    remark: '更新交易描述'
  },
  {
    time: '2026-07-02 09:15:00',
    type: 'success',
    icon: 'check',
    action: '提交审核',
    user: '张三',
    remark: '提交审批流程'
  }
])

// ========== 计算属性 ==========
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getTypeTag = (type: string) => {
  const map: Record<string, string> = {
    income: 'success',
    expense: 'danger',
    transfer: 'info'
  }
  return map[type] || 'info'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    income: '收入',
    expense: '支出',
    transfer: '转账'
  }
  return map[type] || type
}

const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    rejected: 'danger',
    draft: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '待审核',
    rejected: '已拒绝',
    draft: '草稿'
  }
  return map[status] || status
}

const getAmountColor = (type: string) => {
  return type === 'income' ? '#67c23a' : '#f56c6c'
}

const getFileIcon = (type: string) => {
  const map: Record<string, any> = {
    pdf: Files,
    image: Picture,
    video: VideoCamera,
    audio: Headset,
    excel: Grid,
    word: Document
  }
  return map[type] || Document
}

const getFileIconColor = (type: string) => {
  const map: Record<string, string> = {
    pdf: '#f56c6c',
    image: '#67c23a',
    video: '#409eff',
    audio: '#e6a23c',
    excel: '#67c23a',
    word: '#409eff'
  }
  return map[type] || '#909399'
}

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的记录ID')
    router.push('/marketing')
    return
  }

  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // 模拟数据
    const mockData = {
      id: parseInt(id),
      transactionNo: `TRX${String(id).padStart(6, '0')}`,
      type: 'income',
      category: '销售收入',
      amount: 12580.50,
      status: 'pending',
      date: '2026-07-22',
      description: '月度服务费 - 企业客户A',
      remarks: '合同编号：CT-2026-001，服务周期：2026年6月',
      createdBy: '张三',
      createdAt: '2026-07-22 09:00:00',
      updatedAt: '2026-07-22 10:30:00',
      approver: '李四',
      approvalTime: '2026-07-22 14:30:00',
      rejectReason: ''
    }
    
    Object.assign(detailData, mockData)
  } catch (error) {
    ElMessage.error('加载详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// ========== 事件处理 ==========
const handleBack = () => {
  router.push('/marketing')
}

const handleEdit = () => {
  router.push(`/marketing/edit/${detailData.id}`)
}

const handleDelete = () => {
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('删除成功！')
    deleteDialogVisible.value = false
    router.push('/marketing')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleteLoading.value = false
  }
}

const handleExport = () => {
  exportDialogVisible.value = true
}

const confirmExport = async () => {
  exportLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success(`导出${exportFormat.value.toUpperCase()}格式成功！`)
    exportDialogVisible.value = false
  } catch (error) {
    ElMessage.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}

const handlePrint = () => {
  window.print()
}

const handleDownload = (file: any) => {
  ElMessage.success(`正在下载：${file.name}`)
}

const handleDeleteAttachment = (index: number) => {
  ElMessageBox.confirm('确定要删除该附件吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    attachments.value.splice(index, 1)
    ElMessage.success('附件删除成功')
  }).catch(() => {})
}

const handleApprove = () => {
  ElMessageBox.confirm('确定要通过该审批吗？', '审批确认', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    detailData.status = 'completed'
    detailData.approver = '当前用户'
    detailData.approvalTime = new Date().toLocaleString()
    logs.value.push({
      time: new Date().toLocaleString(),
      type: 'success',
      icon: 'check',
      action: '审批通过',
      user: '当前用户',
      remark: '审批通过'
    })
    ElMessage.success('审批通过！')
  }).catch(() => {})
}

const handleReject = () => {
  ElMessageBox.prompt('请输入驳回原因', '驳回审批', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请填写驳回原因...',
    inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return '驳回原因不能为空'
      }
      return true
    }
  }).then(({ value }) => {
    detailData.status = 'rejected'
    detailData.rejectReason = value
    logs.value.push({
      time: new Date().toLocaleString(),
      type: 'danger',
      icon: 'close',
      action: '审批驳回',
      user: '当前用户',
      remark: `驳回原因：${value}`
    })
    ElMessage.warning('已驳回！')
  }).catch(() => {})
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.finance-detail {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-content {
  padding: 8px 0;
}

/* 概览 */
.detail-overview {
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 8px;
  padding: 24px 20px;
  margin-bottom: 8px;
}

.overview-item {
  padding: 4px 0;
}

.overview-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.overview-value.amount {
  font-size: 20px;
  font-weight: 700;
}

/* 信息区域 */
.info-section {
  background: #fafbfc;
  border-radius: 8px;
  padding: 16px 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.section-indicator {
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  border-radius: 2px;
  margin-right: 10px;
}

.description-text {
  line-height: 1.8;
  color: #606266;
  word-break: break-all;
}

/* 附件 */
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-attachment {
  padding: 10px 0;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.12);
}

.attachment-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  border-radius: 8px;
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
  word-break: break-all;
}

.attachment-meta {
  font-size: 12px;
  color: #909399;
}

.attachment-meta span:not(:last-child)::after {
  content: ' · ';
}

.attachment-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

/* 时间线 */
.timeline-wrapper {
  padding: 4px 0;
}

.log-content {
  padding: 2px 0;
}

.log-action {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.log-user {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.log-remark {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 4px;
}

/* 审批状态 */
.approval-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 8px;
}

.approval-status .status-icon {
  font-size: 48px;
}

.approval-status.pending .status-icon {
  color: #e6a23c;
}

.approval-status.approved .status-icon {
  color: #67c23a;
}

.approval-status.rejected .status-icon {
  color: #f56c6c;
}

.approval-status.draft .status-icon {
  color: #909399;
}

.approval-status span {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.approval-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.approval-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  text-align: center;
}

/* 底部 */
.detail-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px 0;
}

.footer-right {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 删除确认 */
.delete-confirm {
  text-align: center;
  padding: 20px 0;
}

.delete-confirm p {
  margin: 12px 0 0;
  font-size: 16px;
  color: #606266;
}

.delete-confirm .delete-hint {
  font-size: 14px;
  color: #909399;
  margin-top: 6px;
}

.delete-confirm .delete-hint strong {
  color: #303133;
}

/* 响应式 */
@media (max-width: 768px) {
  .finance-detail {
    padding: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-wrap: wrap;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .detail-overview {
    padding: 16px;
  }

  .overview-value.amount {
    font-size: 18px;
  }

  .attachment-item {
    flex-wrap: wrap;
  }

  .attachment-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .detail-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-right {
    justify-content: stretch;
  }

  .footer-right .el-button {
    flex: 1;
  }
}

@media print {
  .header-actions,
  .detail-footer .el-button,
  .attachment-actions,
  .approval-actions {
    display: none !important;
  }
  
  .finance-detail {
    background: white;
    padding: 0;
  }
  
  .detail-card {
    box-shadow: none !important;
  }
}
</style>