<!-- 
  文件路径: frontend/src/modules/customers/pages/Create.vue
  功能: 创建客户 - 新建客户信息
-->

<template>
  <div class="customers-create-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>👤 创建客户</h1>
          <p class="header-subtitle">录入新客户信息，支持多维度数据管理</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button @click="handleSaveDraft" :loading="savingDraft">
          <el-icon><Document /></el-icon> 保存草稿
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          <el-icon><Check /></el-icon> 创建客户
        </el-button>
      </div>
    </div>

    <!-- 主表单 -->
    <el-card class="main-card" shadow="hover">
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
              <el-form-item label="客户名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入客户名称"
                  clearable
                />
                <div class="form-hint">建议使用完整的公司名称或个人姓名</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择客户类型" style="width: 100%">
                  <el-option label="🏢 企业客户" value="business" />
                  <el-option label="👤 个人客户" value="individual" />
                  <el-option label="🏛️ 政府客户" value="government" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone" required>
                <el-input
                  v-model="form.phone"
                  placeholder="请输入联系电话"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入电子邮箱"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="客户等级" prop="level">
                <el-select v-model="form.level" placeholder="请选择客户等级" style="width: 100%">
                  <el-option label="👑 VIP" value="vip" />
                  <el-option label="⭐ 黄金" value="gold" />
                  <el-option label="🥈 白银" value="silver" />
                  <el-option label="🥉 青铜" value="bronze" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户来源" prop="source">
                <el-select v-model="form.source" placeholder="请选择客户来源" style="width: 100%">
                  <el-option label="🏪 线下门店" value="store" />
                  <el-option label="🌐 官网" value="website" />
                  <el-option label="📱 社交媒体" value="social" />
                  <el-option label="🤝 推荐介绍" value="referral" />
                  <el-option label="📞 电话销售" value="phone" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 详细信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📍 详细信息</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="国家/地区">
                <el-select v-model="form.country" placeholder="请选择国家/地区" style="width: 100%">
                  <el-option label="沙特阿拉伯" value="saudi" />
                  <el-option label="阿联酋" value="uae" />
                  <el-option label="卡塔尔" value="qatar" />
                  <el-option label="科威特" value="kuwait" />
                  <el-option label="阿曼" value="oman" />
                  <el-option label="巴林" value="bahrain" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市">
                <el-select v-model="form.city" placeholder="请选择城市" style="width: 100%">
                  <el-option label="利雅得" value="riyadh" />
                  <el-option label="吉达" value="jeddah" />
                  <el-option label="达曼" value="dammam" />
                  <el-option label="麦加" value="makkah" />
                  <el-option label="麦地那" value="madinah" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="详细地址" prop="address">
                <el-input
                  v-model="form.address"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入详细地址"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="行业">
                <el-select v-model="form.industry" placeholder="请选择行业" style="width: 100%">
                  <el-option label="信息技术" value="it" />
                  <el-option label="金融银行" value="finance" />
                  <el-option label="石油能源" value="energy" />
                  <el-option label="零售贸易" value="retail" />
                  <el-option label="制造业" value="manufacturing" />
                  <el-option label="服务业" value="service" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业规模">
                <el-select v-model="form.size" placeholder="请选择企业规模" style="width: 100%">
                  <el-option label="1-10人" value="micro" />
                  <el-option label="11-50人" value="small" />
                  <el-option label="51-200人" value="medium" />
                  <el-option label="201-500人" value="large" />
                  <el-option label="500人以上" value="enterprise" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📎 其他信息</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button label="active">🟢 活跃</el-radio-button>
                  <el-radio-button label="inactive">⛔ 非活跃</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标签">
                <el-select
                  v-model="form.tags"
                  multiple
                  placeholder="请选择标签"
                  style="width: 100%"
                >
                  <el-option label="高价值客户" value="high-value" />
                  <el-option label="长期客户" value="long-term" />
                  <el-option label="新客户" value="new" />
                  <el-option label="重点关注" value="focus" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="form.notes"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleReset">重置</el-button>
          <el-button size="large" @click="handlePreview">
            <el-icon><View /></el-icon> 预览
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon> 创建客户
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="客户信息预览"
      width="700px"
      top="5vh"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-avatar">
            <el-avatar :size="48" icon="UserFilled" />
          </div>
          <div class="preview-info">
            <div class="preview-name">{{ form.name || '未命名客户' }}</div>
            <div class="preview-meta">
              <el-tag :type="getLevelTag(form.level)">{{ getLevelLabel(form.level) }}</el-tag>
              <el-tag :type="getStatusTag(form.status)">
                {{ form.status === 'active' ? '🟢 活跃' : '⛔ 非活跃' }}
              </el-tag>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="preview-body">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="客户类型">{{ getTypeLabel(form.type) }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ form.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="电子邮箱">{{ form.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="客户来源">{{ getSourceLabel(form.source) }}</el-descriptions-item>
            <el-descriptions-item label="国家/地区">{{ getCountryLabel(form.country) }}</el-descriptions-item>
            <el-descriptions-item label="城市">{{ getCityLabel(form.city) }}</el-descriptions-item>
            <el-descriptions-item label="行业">{{ getIndustryLabel(form.industry) }}</el-descriptions-item>
            <el-descriptions-item label="企业规模">{{ getSizeLabel(form.size) }}</el-descriptions-item>
            <el-descriptions-item label="地址" :span="2">{{ form.address || '-' }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ form.notes || '-' }}</el-descriptions-item>
            <el-descriptions-item label="标签" :span="2">
              <el-tag v-for="tag in form.tags" :key="tag" size="small" class="tag-item">
                {{ getTagLabel(tag) }}
              </el-tag>
              <span v-if="!form.tags?.length" style="color: #9CA3AF;">无标签</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Document, Check, View } from '@element-plus/icons-vue'

// ============================================================
// 路由
// ============================================================

const router = useRouter()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const submitting = ref(false)
const savingDraft = ref(false)
const previewVisible = ref(false)

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  name: '',
  type: 'business',
  phone: '',
  email: '',
  level: 'bronze',
  source: 'store',
  country: 'saudi',
  city: 'riyadh',
  address: '',
  industry: '',
  size: '',
  status: 'active',
  tags: [] as string[],
  notes: ''
})

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  name: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

// ============================================================
// 工具函数
// ============================================================

const getLevelLabel = (level: string) => {
  const map: Record<string, string> = {
    vip: 'VIP',
    gold: '黄金',
    silver: '白银',
    bronze: '青铜'
  }
  return map[level] || level
}

const getLevelTag = (level: string) => {
  const map: Record<string, string> = {
    vip: 'danger',
    gold: 'warning',
    silver: 'info',
    bronze: 'primary'
  }
  return map[level] || 'info'
}

const getStatusTag = (status: string) => {
  return status === 'active' ? 'success' : 'info'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    business: '企业客户',
    individual: '个人客户',
    government: '政府客户'
  }
  return map[type] || type
}

const getSourceLabel = (source: string) => {
  const map: Record<string, string> = {
    store: '线下门店',
    website: '官网',
    social: '社交媒体',
    referral: '推荐介绍',
    phone: '电话销售'
  }
  return map[source] || source
}

const getCountryLabel = (country: string) => {
  const map: Record<string, string> = {
    saudi: '沙特阿拉伯',
    uae: '阿联酋',
    qatar: '卡塔尔',
    kuwait: '科威特',
    oman: '阿曼',
    bahrain: '巴林'
  }
  return map[country] || country
}

const getCityLabel = (city: string) => {
  const map: Record<string, string> = {
    riyadh: '利雅得',
    jeddah: '吉达',
    dammam: '达曼',
    makkah: '麦加',
    madinah: '麦地那'
  }
  return map[city] || city
}

const getIndustryLabel = (industry: string) => {
  const map: Record<string, string> = {
    it: '信息技术',
    finance: '金融银行',
    energy: '石油能源',
    retail: '零售贸易',
    manufacturing: '制造业',
    service: '服务业'
  }
  return map[industry] || industry
}

const getSizeLabel = (size: string) => {
  const map: Record<string, string> = {
    micro: '1-10人',
    small: '11-50人',
    medium: '51-200人',
    large: '201-500人',
    enterprise: '500人以上'
  }
  return map[size] || size
}

const getTagLabel = (tag: string) => {
  const map: Record<string, string> = {
    'high-value': '高价值客户',
    'long-term': '长期客户',
    'new': '新客户',
    'focus': '重点关注'
  }
  return map[tag] || tag
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (form.name || form.phone) {
    ElMessageBox.confirm('确定要返回吗？已填写的内容将不会被保存。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/customers')
    }).catch(() => {})
  } else {
    router.push('/customers')
  }
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有表单数据吗？', '确认重置', {
    type: 'warning'
  }).then(() => {
    Object.assign(form, {
      name: '',
      type: 'business',
      phone: '',
      email: '',
      level: 'bronze',
      source: 'store',
      country: 'saudi',
      city: 'riyadh',
      address: '',
      industry: '',
      size: '',
      status: 'active',
      tags: [],
      notes: ''
    })
    formRef.value?.resetFields()
    ElMessage.success('已重置所有数据')
  }).catch(() => {})
}

const handlePreview = () => {
  if (!form.name) {
    ElMessage.warning('请先填写客户名称')
    return
  }
  previewVisible.value = true
}

const handleSaveDraft = async () => {
  savingDraft.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('✅ 草稿已保存')
  } catch (error) {
    ElMessage.error('保存草稿失败，请重试')
  } finally {
    savingDraft.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请完善必填信息')
      return
    }

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      ElMessage.success({
        message: `✅ 客户 "${form.name}" 创建成功！`,
        duration: 3000
      })
      router.push('/customers')
    } catch (error) {
      ElMessage.error('创建失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.customers-create-page {
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
}

/* ============================================================
   主卡片
   ============================================================ */

.main-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.main-card :deep(.el-card__body) {
  padding: 32px 40px;
}

/* ============================================================
   表单分区
   ============================================================ */

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

/* ============================================================
   表单样式
   ============================================================ */

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #4B5563;
}

/* ============================================================
   预览对话框
   ============================================================ */

.preview-container {
  padding: 4px 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.preview-name {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.preview-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.preview-body {
  padding: 8px 0;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 2px;
}

/* ============================================================
   操作按钮
   ============================================================ */

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

/* ============================================================
   暗色模式
   ============================================================ */

[data-theme="dark"] .customers-create-page {
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

[data-theme="dark"] .form-hint {
  color: #6B7280;
}

[data-theme="dark"] .form-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .preview-name {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .customers-create-page {
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

  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>