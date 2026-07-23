<template>
  <div class="production-detail-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack">
          <el-icon><ArrowLeft /></el-icon> 返回列表
        </el-button>
        <h1>
          <el-icon :size="28" color="#4F46E5"><Document /></el-icon>
          {{ moduleName }} 详情
        </h1>
        <el-tag :type="getStatusTag(detailData.status)" size="large" effect="dark">
          {{ getStatusLabel(detailData.status) }}
        </el-tag>
      </div>
      <div class="header-actions">
        <el-button type="warning" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
        <el-button type="success" @click="handleExport">
          <el-icon><Download /></el-icon> 导出
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
    </div>

    <!-- 详情内容 -->
    <div v-loading="loading">
      <el-row :gutter="20">
        <!-- 主信息 -->
        <el-col :xs="24" :lg="16">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <span class="card-title">
                <el-icon><InfoFilled /></el-icon> 基本信息
              </span>
            </template>

            <el-descriptions :column="2" border>
              <el-descriptions-item label="名称">
                <strong>{{ detailData.name }}</strong>
              </el-descriptions-item>
              <el-descriptions-item label="编号">
                {{ detailData.code }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusTag(detailData.status)">
                  {{ getStatusLabel(detailData.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="分类">
                {{ getCategoryLabel(detailData.category) }}
              </el-descriptions-item>
              <el-descriptions-item label="优先级">
                <el-tag :type="getPriorityTag(detailData.priority)">
                  {{ getPriorityLabel(detailData.priority) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="负责人">
                {{ detailData.assignee || '未指定' }}
              </el-descriptions-item>
              <el-descriptions-item label="开始日期">
                {{ detailData.startDate || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="截止日期">
                {{ detailData.endDate || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="数量">
                {{ detailData.quantity || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="完成进度">
                <el-progress :percentage="detailData.progress || 0" :show-text="true" />
              </el-descriptions-item>
              <el-descriptions-item label="创建时间" :span="2">
                {{ detailData.createdAt || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间" :span="2">
                {{ detailData.updatedAt || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="备注" :span="2">
                <div class="remark-text">{{ detailData.remark || '暂无备注' }}</div>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 附件 -->
          <el-card class="attachment-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span class="card-title">
                <el-icon><Files /></el-icon> 附件
                <span class="attachment-count">{{ attachments.length }} 个</span>
              </span>
            </template>

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
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 侧边信息 -->
        <el-col :xs="24" :lg="8">
          <!-- 操作日志 -->
          <el-card class="log-card" shadow="hover">
            <template #header>
              <span class="card-title">
                <el-icon><Clock /></el-icon> 操作日志
              </span>
            </template>

            <div class="timeline-wrapper">
              <el-timeline>
                <el-timeline-item
                  v-for="(log, index) in logs"
                  :key="index"
                  :timestamp="log.time"
                  :type="log.type"
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
          </el-card>

          <!-- 关联信息 -->
          <el-card class="related-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span class="card-title">
                <el-icon><Link /></el-icon> 关联信息
              </span>
            </template>

            <div class="related-item">
              <span class="related-label">关联工单</span>
              <span class="related-value">{{ relatedData.workOrders || 0 }} 个</span>
            </div>
            <div class="related-item">
              <span class="related-label">关联BOM</span>
              <span class="related-value">{{ relatedData.boms || 0 }} 个</span>
            </div>
            <div class="related-item">
              <span class="related-label">关联质检</span>
              <span class="related-value">{{ relatedData.qualityChecks || 0 }} 次</span>
            </div>
            <div class="related-item">
              <span class="related-label">关联物料</span>
              <span class="related-value">{{ relatedData.materials || 0 }} 项</span>
            </div>
          </el-card>

          <!-- 快捷操作 -->
          <el-card class="quick-actions-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span class="card-title">
                <el-icon><Operation /></el-icon> 快捷操作
              </span>
            </template>

            <div class="quick-actions">
              <el-button type="primary" plain size="small" @click="handleEdit">
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
              <el-button type="success" plain size="small" @click="handleExport">
                <el-icon><Download /></el-icon> 导出
              </el-button>
              <el-button type="warning" plain size="small" @click="handlePrint">
                <el-icon><Printer /></el-icon> 打印
              </el-button>
              <el-button type="danger" plain size="small" @click="handleDelete">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="delete-confirm">
        <el-icon color="#f56c6c" size="56"><WarningFilled /></el-icon>
        <p>确定要删除该记录吗？</p>
        <p class="delete-hint">名称：<strong>{{ detailData.name }}</strong></p>
        <p class="delete-hint">此操作不可恢复，请谨慎操作！</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleteLoading" @click="confirmDelete">
          确定删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Document,
  Edit,
  Download,
  Delete,
  InfoFilled,
  Files,
  Clock,
  Link,
  Operation,
  Printer,
  WarningFilled,
  Picture,
  VideoCamera,
  Headset,
  Grid,
  User,
  ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// ========== 响应式数据 ==========
const loading = ref(false)
const deleteLoading = ref(false)
const deleteDialogVisible = ref(false)

// 模块名称
const moduleName = computed(() => {
  const path = route.path
  if (path.includes('bom')) return 'BOM'
  if (path.includes('workorder')) return '工单'
  if (path.includes('plan')) return '生产计划'
  if (path.includes('quality')) return '质检'
  if (path.includes('equipment')) return '设备'
  return '记录'
})

// 详情数据
const detailData = reactive({
  id: 0,
  name: '',
  code: '',
  status: '',
  category: '',
  priority: '',
  assignee: '',
  startDate: '',
  endDate: '',
  quantity: 0,
  progress: 0,
  createdAt: '',
  updatedAt: '',
  remark: ''
})

// 附件列表
const attachments = ref([
  {
    name: '技术文档.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadTime: '2026-07-20 10:30:00'
  },
  {
    name: '图纸_20260701.jpg',
    type: 'image',
    size: '1.8 MB',
    uploadTime: '2026-07-20 10:35:00'
  }
])

// 操作日志
const logs = ref([
  {
    time: '2026-07-20 10:30:00',
    type: 'primary',
    action: '创建记录',
    user: '张三',
    remark: '新建记录'
  },
  {
    time: '2026-07-20 14:20:00',
    type: 'warning',
    action: '更新状态',
    user: '李四',
    remark: '状态变更为待审核'
  },
  {
    time: '2026-07-21 09:15:00',
    type: 'success',
    action: '审批通过',
    user: '王五',
    remark: '审批通过'
  }
])

// 关联数据
const relatedData = reactive({
  workOrders: 3,
  boms: 2,
  qualityChecks: 5,
  materials: 12
})

// ========== 计算属性 ==========
const getStatusTag = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    draft: 'info',
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: '启用',
    draft: '草稿',
    pending: '待审核',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    plan: '生产计划',
    workorder: '工单管理',
    bom: 'BOM管理',
    quality: '质量管理',
    equipment: '设备管理'
  }
  return map[category] || category
}

const getPriorityTag = (priority: string) => {
  const map: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return map[priority] || 'info'
}

const getPriorityLabel = (priority: string) => {
  const map: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[priority] || priority
}

const getFileIcon = (type: string) => {
  const map: Record<string, any> = {
    pdf: Files,
    image: Picture,
    video: VideoCamera,
    audio: Headset,
    excel: Grid
  }
  return map[type] || Document
}

const getFileIconColor = (type: string) => {
  const map: Record<string, string> = {
    pdf: '#f56c6c',
    image: '#67c23a',
    video: '#409eff',
    audio: '#e6a23c',
    excel: '#67c23a'
  }
  return map[type] || '#909399'
}

// ========== 获取详情数据 ==========
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('无效的ID')
    router.push('/production')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))

    const mockData = {
      id: parseInt(id),
      name: `${moduleName.value} ${id}`,
      code: `${moduleName.value.toUpperCase()}-${String(id).padStart(6, '0')}`,
      status: ['active', 'pending', 'completed', 'draft'][parseInt(id) % 4],
      category: ['plan', 'workorder', 'bom', 'quality'][parseInt(id) % 4],
      priority: ['high', 'medium', 'low'][parseInt(id) % 3],
      assignee: ['Ahmed', 'Mohammed', 'Saud'][parseInt(id) % 3],
      startDate: '2026-07-20',
      endDate: '2026-08-20',
      quantity: Math.floor(Math.random() * 500 + 50),
      progress: Math.floor(Math.random() * 100),
      createdAt: '2026-07-20 10:30:00',
      updatedAt: '2026-07-22 14:20:00',
      remark: '这是一条示例备注信息'
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
  router.push('/production')
}

const handleEdit = () => {
  router.push(`/production/edit/${detailData.id}`)
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
    router.push('/production')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleteLoading.value = false
  }
}

const handleExport = () => {
  ElMessage.success('导出任务已提交')
}

const handlePrint = () => {
  window.print()
}

const handleDownload = (file: any) => {
  ElMessage.success(`正在下载：${file.name}`)
}

// ========== 生命周期 ==========
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.production-detail-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.info-card,
.log-card,
.related-card,
.quick-actions-card {
  border-radius: 12px;
  overflow: hidden;
}

.attachment-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.attachment-count {
  font-size: 13px;
  font-weight: 400;
  color: #909399;
  margin-left: 8px;
}

.remark-text {
  line-height: 1.8;
  color: #606266;
  word-break: break-all;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-attachment {
  padding: 8px 0;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: #fafbfc;
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
  width: 40px;
  height: 40px;
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

.timeline-wrapper {
  padding: 4px 0;
  max-height: 350px;
  overflow-y: auto;
}

.timeline-wrapper::-webkit-scrollbar {
  width: 4px;
}

.timeline-wrapper::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
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
  display: flex;
  align-items: center;
  gap: 4px;
}

.log-remark {
  font-size: 13px;
  color: #606266;
  margin-top: 4px;
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 4px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}

.related-item:last-child {
  border-bottom: none;
}

.related-label {
  color: #909399;
  font-size: 14px;
}

.related-value {
  font-weight: 600;
  color: #303133;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.quick-actions .el-button {
  width: 100%;
}

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

@media (max-width: 768px) {
  .production-detail-page {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
    font-size: 12px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .attachment-item {
    flex-wrap: wrap;
  }

  .attachment-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media print {
  .header-actions,
  .quick-actions .el-button,
  .attachment-actions {
    display: none !important;
  }

  .production-detail-page {
    background: white;
    padding: 0;
  }

  .info-card,
  .attachment-card,
  .log-card,
  .related-card,
  .quick-actions-card {
    box-shadow: none !important;
    border: 1px solid #ebeef5;
  }

  .page-header {
    margin-bottom: 12px;
  }
}
</style>