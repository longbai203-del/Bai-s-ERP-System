<!-- 
  文件路径: frontend/src/modules/marketing/pages/CampaignEdit.vue
  功能: 编辑营销活动 - 修改活动信息
-->

<template>
  <div class="campaign-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>✏️ 编辑活动</h1>
          <p class="header-subtitle">修改活动信息 - ID: {{ form.id || 'CAM-001' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 保存更改
        </el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 编辑表单 -->
    <el-card v-else class="main-card" shadow="hover">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        label-position="right"
        size="large"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📋 基本信息</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="活动ID" prop="id">
                <el-input
                  v-model="form.id"
                  disabled
                  style="background: #F9FAFB;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动类型" prop="type" required>
                <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%">
                  <el-option label="🎉 促销活动" value="promotion" />
                  <el-option label="🏷️ 品牌活动" value="brand" />
                  <el-option label="📈 获客活动" value="acquisition" />
                  <el-option label="👑 会员活动" value="member" />
                  <el-option label="🎊 节日活动" value="holiday" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="活动名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入活动名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动口号" prop="slogan">
                <el-input
                  v-model="form.slogan"
                  placeholder="请输入活动口号"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="活动状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button label="active">🟢 进行中</el-radio-button>
                  <el-radio-button label="pending">⏳ 待启动</el-radio-button>
                  <el-radio-button label="ended">🔚 已结束</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input
                  v-model="form.createdBy"
                  disabled
                  style="background: #F9FAFB;"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 时间与预算 -->
        <div class="form-section">
          <div class="section-title">
            <span>📅 时间与预算</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="开始日期" prop="startDate" required>
                <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="请选择开始日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期" prop="endDate" required>
                <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  placeholder="请选择结束日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="预算金额" prop="budget" required>
                <el-input-number
                  v-model="form.budget"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目标触达人数" prop="targetReach">
                <el-input-number
                  v-model="form.targetReach"
                  :min="0"
                  :step="100"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 营销渠道 -->
        <div class="form-section">
          <div class="section-title">
            <span>📢 营销渠道</span>
          </div>

          <el-form-item label="推广渠道" prop="channels">
            <el-checkbox-group v-model="form.channels">
              <el-checkbox label="social">社交媒体</el-checkbox>
              <el-checkbox label="email">邮件营销</el-checkbox>
              <el-checkbox label="sms">短信营销</el-checkbox>
              <el-checkbox label="offline">线下活动</el-checkbox>
              <el-checkbox label="partner">合作伙伴</el-checkbox>
              <el-checkbox label="website">官网</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="目标受众" prop="targetAudience">
            <el-select
              v-model="form.targetAudience"
              multiple
              placeholder="请选择目标受众"
              style="width: 100%"
            >
              <el-option label="新客户" value="new" />
              <el-option label="老客户" value="existing" />
              <el-option label="VIP客户" value="vip" />
              <el-option label="企业客户" value="business" />
              <el-option label="个人客户" value="individual" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 活动内容 -->
        <div class="form-section">
          <div class="section-title">
            <span>📝 活动内容</span>
          </div>

          <el-form-item label="活动描述" prop="description" required>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请详细描述活动内容、目标和预期效果..."
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="活动亮点" prop="highlights">
            <el-input
              v-model="form.highlights"
              type="textarea"
              :rows="2"
              placeholder="请输入活动亮点，每行一个..."
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 附件 -->
        <div class="form-section">
          <div class="section-title">
            <span>📎 附件</span>
          </div>

          <el-form-item label="上传素材">
            <el-upload
              v-model:file-list="fileList"
              action="#"
              multiple
              :auto-upload="false"
              :limit="5"
              :on-exceed="handleExceed"
              list-type="text"
            >
              <el-button type="primary" text>
                <el-icon><Upload /></el-icon> 上传附件
              </el-button>
              <template #tip>
                <div class="upload-tip">
                  支持图片、PDF、视频等格式，单个文件不超过20MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 更新信息 -->
        <div class="update-info">
          <span>创建时间: {{ form.createdAt || '2024-10-15 14:30' }}</span>
          <span>最后更新: {{ form.updatedAt || '2024-10-20 10:00' }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleCancel">取消</el-button>
          <el-button size="large" @click="handlePreview">
            <el-icon><View /></el-icon> 预览
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon> 保存更改
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="活动预览"
      width="700px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-icon">
            <span class="icon-large">{{ getTypeIcon(form.type) }}</span>
          </div>
          <div class="preview-info">
            <div class="preview-name">{{ form.name || '未命名活动' }}</div>
            <div class="preview-meta">
              <el-tag :type="getTypeTag(form.type)">{{ getTypeLabel(form.type) }}</el-tag>
              <el-tag :type="form.status === 'active' ? 'success' : form.status === 'pending' ? 'warning' : 'info'">
                {{ getStatusLabel(form.status) }}
              </el-tag>
              <span>{{ formatDate(form.startDate) }} ~ {{ formatDate(form.endDate) }}</span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="preview-body">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="预算">{{ formatCurrency(form.budget) }}</el-descriptions-item>
            <el-descriptions-item label="目标触达">{{ form.targetReach?.toLocaleString() || 0 }} 人</el-descriptions-item>
            <el-descriptions-item label="活动口号">{{ form.slogan || '-' }}</el-descriptions-item>
            <el-descriptions-item label="推广渠道">
              <el-tag v-for="ch in form.channels" :key="ch" size="small" class="tag-item">
                {{ getChannelLabel(ch) }}
              </el-tag>
              <span v-if="!form.channels?.length">未选择</span>
            </el-descriptions-item>
            <el-descriptions-item label="目标受众" :span="2">
              <el-tag v-for="aud in form.targetAudience" :key="aud" size="small" class="tag-item">
                {{ getAudienceLabel(aud) }}
              </el-tag>
              <span v-if="!form.targetAudience?.length">未选择</span>
            </el-descriptions-item>
            <el-descriptions-item label="活动描述" :span="2">{{ form.description || '-' }}</el-descriptions-item>
            <el-descriptions-item label="活动亮点" :span="2">{{ form.highlights || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check, View, Upload } from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()
const route = useRoute()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const previewVisible = ref(false)
const fileList = ref<any[]>([])

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  id: 'CAM-001',
  name: '双十一促销活动',
  type: 'promotion',
  slogan: '全年最低价，错过等一年！',
  status: 'active',
  startDate: new Date('2024-11-01'),
  endDate: new Date('2024-11-11'),
  budget: 1250000,
  targetReach: 300000,
  channels: ['social', 'email', 'sms'],
  targetAudience: ['new', 'existing', 'vip'],
  description: '双十一购物节大型促销活动，覆盖线上线下全渠道，目标提升品牌知名度和销售额。',
  highlights: '全场低至5折\n满1000减200\n限时秒杀活动',
  createdBy: 'Ahmed Al-Fahd',
  createdAt: '2024-10-15 14:30',
  updatedAt: '2024-10-20 10:00'
})

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' }
  ],
  budget: [
    { required: true, message: '请输入预算金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '预算必须大于0', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' }
  ]
}

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

const formatDate = (date: Date | null) => {
  if (!date) return '未选择'
  return date.toLocaleDateString('zh-CN')
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (formRef.value?.isDirty) {
    ElMessageBox.confirm('确定要返回吗？未保存的更改将丢失。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/marketing/campaigns')
    }).catch(() => {})
  } else {
    router.push('/marketing/campaigns')
  }
}

const handleCancel = () => {
  handleBack()
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有更改吗？', '确认重置', {
    type: 'warning'
  }).then(() => {
    loadDetail()
    ElMessage.success('已重置所有更改')
  }).catch(() => {})
}

const handlePreview = () => {
  if (!form.name) {
    ElMessage.warning('请先填写活动名称')
    return
  }
  if (!form.description) {
    ElMessage.warning('请先填写活动描述')
    return
  }
  previewVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请完善必填信息')
      return
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      ElMessage.warning('开始日期不能晚于结束日期')
      return
    }

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      ElMessage.success({
        message: `✅ 活动 "${form.name}" 已更新！`,
        duration: 3000
      })
      router.push('/marketing/campaigns')
    } catch (error) {
      ElMessage.error('更新失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

const handleExceed = () => {
  ElMessage.warning('最多上传5个文件')
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
.campaign-edit-page {
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
}

.loading-container {
  padding: 20px 0;
}

.main-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.main-card :deep(.el-card__body) {
  padding: 32px 40px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F3F4F6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.section-title span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-hint {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
  line-height: 1.4;
}

.upload-tip {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #4B5563;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background: #F9FAFB;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.update-info {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  font-size: 13px;
  color: #9CA3AF;
  border-top: 1px solid #F3F4F6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #F3F4F6;
  margin-top: 8px;
}

.form-actions .el-button {
  padding: 10px 28px;
  font-weight: 500;
}

.preview-container {
  padding: 4px 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-large {
  font-size: 36px;
}

.preview-name {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.preview-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}

.preview-body {
  padding: 8px 0;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 2px;
}

[data-theme="dark"] .campaign-edit-page {
  background: #1A1A2E;
}

[data-theme="dark"] .main-card {
  background: #2C2C2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .form-section {
  border-color: #3A3A3C;
}

[data-theme="dark"] .section-title {
  color: #F5F5F7;
}

[data-theme="dark"] :deep(.el-form-item__label) {
  color: #9CA3AF;
}

[data-theme="dark"] .form-hint,
[data-theme="dark"] .upload-tip {
  color: #6B7280;
}

[data-theme="dark"] :deep(.el-input.is-disabled .el-input__wrapper) {
  background: #3A3A3C;
}

[data-theme="dark"] .update-info {
  border-color: #3A3A3C;
  color: #6B7280;
}

[data-theme="dark"] .form-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .preview-name {
  color: #F5F5F7;
}

@media (max-width: 768px) {
  .campaign-edit-page {
    padding: 16px;
  }

  .main-card :deep(.el-card__body) {
    padding: 20px 16px;
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

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
    justify-content: center;
  }

  .update-info {
    flex-direction: column;
    gap: 4px;
  }

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>