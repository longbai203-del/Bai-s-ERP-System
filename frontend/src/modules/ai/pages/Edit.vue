<!-- 
  文件路径: frontend/src/modules/ai/pages/Edit.vue
  功能: AI 功能编辑页面 - 编辑 AI 助手配置
-->

<template>
  <div class="ai-edit-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>✏️ 编辑 AI 助手</h1>
          <p class="header-subtitle">修改 AI 助手的配置和参数</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="danger" plain @click="handleDelete">
          <el-icon><Delete /></el-icon> 删除
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
              <el-form-item label="AI 名称" prop="name" required>
                <el-input
                  v-model="form.name"
                  placeholder="请输入 AI 助手名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="AI ID" prop="id">
                <el-input
                  v-model="form.id"
                  disabled
                  style="background: #F9FAFB;"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="AI 类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择 AI 类型" style="width: 100%">
                  <el-option label="💬 智能聊天" value="chat" />
                  <el-option label="📝 合同分析" value="contract" />
                  <el-option label="📊 数据分析" value="analytics" />
                  <el-option label="📄 OCR 识别" value="ocr" />
                  <el-option label="🔮 预测分析" value="prediction" />
                  <el-option label="📋 报表生成" value="report" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button label="active">
                    <el-icon><CircleCheck /></el-icon> 启用
                  </el-radio-button>
                  <el-radio-button label="inactive">
                    <el-icon><CircleClose /></el-icon> 停用
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 模型配置 -->
        <div class="form-section">
          <div class="section-title">
            <span>🤖 模型配置</span>
          </div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="AI 模型" prop="model">
                <el-select v-model="form.model" style="width: 100%">
                  <el-option label="GPT-4 Turbo" value="gpt-4-turbo" />
                  <el-option label="GPT-4" value="gpt-4" />
                  <el-option label="GPT-3.5 Turbo" value="gpt-3.5-turbo" />
                  <el-option label="Claude 3.5 Sonnet" value="claude-3.5" />
                  <el-option label="DeepSeek V3" value="deepseek-v3" />
                  <el-option label="Qwen 2.5" value="qwen-2.5" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="语言" prop="language">
                <el-select v-model="form.language" style="width: 100%">
                  <el-option label="简体中文" value="zh-CN" />
                  <el-option label="英文" value="en-US" />
                  <el-option label="阿拉伯语" value="ar-SA" />
                  <el-option label="双语 (中英)" value="bilingual" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="温度" prop="temperature">
                <el-slider
                  v-model="form.temperature"
                  :min="0"
                  :max="2"
                  :step="0.1"
                  :marks="{ 0: '精准', 1: '平衡', 2: '创意' }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最大 Token" prop="maxTokens">
                <el-input-number
                  v-model="form.maxTokens"
                  :min="100"
                  :max="4096"
                  :step="100"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Top P" prop="topP">
                <el-slider
                  v-model="form.topP"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  :marks="{ 0: '保守', 0.5: '平衡', 1: '多样' }"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="响应格式" prop="responseFormat">
                <el-radio-group v-model="form.responseFormat">
                  <el-radio label="text">文本</el-radio>
                  <el-radio label="json">JSON</el-radio>
                  <el-radio label="markdown">Markdown</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 高级设置 -->
        <div class="form-section">
          <div class="section-title">
            <span>🔧 高级设置</span>
            <el-button type="text" @click="showAdvanced = !showAdvanced">
              {{ showAdvanced ? '收起' : '展开' }}
              <el-icon><component :is="showAdvanced ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
            </el-button>
          </div>

          <el-collapse-transition>
            <div v-show="showAdvanced">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="系统提示词">
                    <el-input
                      v-model="form.systemPrompt"
                      type="textarea"
                      :rows="4"
                      placeholder="设置 AI 的角色定位和行为准则..."
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="知识库">
                    <el-select
                      v-model="form.knowledgeBase"
                      multiple
                      placeholder="选择关联的知识库"
                      style="width: 100%"
                    >
                      <el-option label="产品知识库" value="products" />
                      <el-option label="客户知识库" value="customers" />
                      <el-option label="订单知识库" value="orders" />
                      <el-option label="财务知识库" value="finance" />
                      <el-option label="合同知识库" value="contracts" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="标签">
                    <el-tag
                      v-for="tag in form.tags"
                      :key="tag"
                      closable
                      @close="removeTag(tag)"
                      class="tag-item"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      v-if="tagInputVisible"
                      ref="tagInputRef"
                      v-model="tagInputValue"
                      class="tag-input"
                      size="small"
                      @keyup.enter="addTag"
                      @blur="addTag"
                    />
                    <el-button
                      v-else
                      class="tag-add-btn"
                      size="small"
                      @click="showTagInput"
                    >
                      + 添加标签
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
        </div>

        <!-- 描述信息 -->
        <div class="form-section">
          <div class="section-title">
            <span>📝 描述信息</span>
          </div>
          <el-form-item label="功能描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请描述 AI 的功能、适用场景和使用方法..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="使用示例">
            <el-input
              v-model="form.example"
              type="textarea"
              :rows="2"
              placeholder="请提供一个使用示例，帮助用户理解..."
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 更新信息 -->
        <div class="update-info">
          <span>最后更新: {{ form.updatedAt || '2024-11-20 14:30' }}</span>
          <span>创建时间: {{ form.createdAt || '2024-11-20 10:00' }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button size="large" @click="handleReset">重置</el-button>
          <el-button size="large" @click="handlePreview">
            <el-icon><View /></el-icon> 预览
          </el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon> 保存更新
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="AI 助手预览"
      width="700px"
      :destroy-on-close="true"
    >
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-avatar">
            <el-avatar :size="48" icon="Cpu" />
          </div>
          <div class="preview-info">
            <div class="preview-name">{{ form.name || '未命名 AI' }}</div>
            <div class="preview-type">{{ getTypeLabel(form.type) }}</div>
          </div>
          <el-tag :type="form.status === 'active' ? 'success' : 'info'">
            {{ form.status === 'active' ? '🟢 已启用' : '⛔ 已停用' }}
          </el-tag>
        </div>

        <el-divider />

        <div class="preview-body">
          <div class="preview-message assistant">
            <div class="preview-message-avatar">
              <el-avatar :size="32" icon="Cpu" />
            </div>
            <div class="preview-message-content">
              <div class="preview-message-text">
                您好！我是 <strong>{{ form.name || 'AI 助手' }}</strong>。
                <span v-if="form.description">{{ form.description }}</span>
                <span v-else>请问有什么可以帮您？</span>
              </div>
              <div class="preview-message-time">刚刚</div>
            </div>
          </div>

          <div class="preview-message user">
            <div class="preview-message-content">
              <div class="preview-message-text">{{ form.example || '请帮我分析一下这个数据...' }}</div>
              <div class="preview-message-time">刚刚</div>
            </div>
            <div class="preview-message-avatar">
              <el-avatar :size="32" icon="UserFilled" />
            </div>
          </div>

          <div class="preview-message assistant">
            <div class="preview-message-avatar">
              <el-avatar :size="32" icon="Cpu" />
            </div>
            <div class="preview-message-content">
              <div class="preview-message-text">
                <span style="color: #409EFF;">🤖 正在思考中...</span>
                <br>
                <span style="color: #909399; font-size: 13px;">配置参数: 温度 {{ form.temperature }} | Top P {{ form.topP }}</span>
              </div>
              <div class="preview-message-time">刚刚</div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="preview-footer">
          <div class="preview-stats">
            <span>模型: {{ getModelLabel(form.model) }}</span>
            <span>最大 Token: {{ form.maxTokens }}</span>
            <span>语言: {{ getLanguageLabel(form.language) }}</span>
          </div>
          <div class="preview-tags">
            <el-tag
              v-for="tag in form.tags"
              :key="tag"
              size="small"
              type="info"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmit; previewVisible = false">
          <el-icon><Check /></el-icon> 确认更新
        </el-button>
      </template>
    </el-dialog>

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
        <p>确定要删除 AI 助手 <strong>{{ form.name }}</strong> 吗？</p>
        <p class="delete-hint">此操作将删除所有配置和数据，不可恢复！</p>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, ArrowUp, ArrowDown, CircleCheck, CircleClose,
  View, Check, Delete, UserFilled, Cpu, WarningFilled
} from '@element-plus/icons-vue'
import { useAiStore } from '../store'

// ============================================================
// 路由与 Store
// ============================================================

const router = useRouter()
const route = useRoute()
const store = useAiStore()

// ============================================================
// 响应式数据
// ============================================================

const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const previewVisible = ref(false)
const deleteVisible = ref(false)
const showAdvanced = ref(false)
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

// ============================================================
// 表单数据
// ============================================================

const form = reactive({
  id: 'AI-001',
  name: '智能客服助手',
  type: 'chat',
  model: 'gpt-4-turbo',
  status: 'active',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  systemPrompt: '你是一个专业的 AI 客服助手，负责解答客户问题、处理订单查询和提供产品建议。请用友好、专业的语气回复。',
  knowledgeBase: ['products', 'orders', 'customers'],
  responseFormat: 'text',
  language: 'zh-CN',
  tags: ['客服', 'AI', '智能对话'],
  description: '用于处理客户咨询、订单查询和产品推荐，提供7x24小时智能客服服务。',
  example: '您好，我想查询我的订单状态...',
  createdAt: '2024-11-20 10:00:00',
  updatedAt: '2024-11-20 14:30:00'
})

// ============================================================
// 表单验证规则
// ============================================================

const rules = {
  name: [
    { required: true, message: '请输入 AI 名称', trigger: 'blur' },
    { min: 2, max: 30, message: '名称长度在 2 到 30 个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择 AI 类型', trigger: 'change' }
  ],
  model: [
    { required: true, message: '请选择 AI 模型', trigger: 'change' }
  ]
}

// ============================================================
// 辅助方法
// ============================================================

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    chat: '💬 智能聊天',
    contract: '📝 合同分析',
    analytics: '📊 数据分析',
    ocr: '📄 OCR 识别',
    prediction: '🔮 预测分析',
    report: '📋 报表生成'
  }
  return map[type] || type
}

const getModelLabel = (model: string) => {
  const map: Record<string, string> = {
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-4': 'GPT-4',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'claude-3.5': 'Claude 3.5 Sonnet',
    'deepseek-v3': 'DeepSeek V3',
    'qwen-2.5': 'Qwen 2.5'
  }
  return map[model] || model
}

const getLanguageLabel = (lang: string) => {
  const map: Record<string, string> = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ar-SA': 'العربية',
    'bilingual': '双语 (中英)'
  }
  return map[lang] || lang
}

// ============================================================
// 标签管理
// ============================================================

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const addTag = () => {
  const value = tagInputValue.value.trim()
  if (value && !form.tags.includes(value)) {
    form.tags.push(value)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const removeTag = (tag: string) => {
  form.tags = form.tags.filter(t => t !== tag)
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  if (formRef.value?.isDirty) {
    ElMessageBox.confirm('确定要返回吗？未保存的更改将丢失。', '确认返回', {
      type: 'warning'
    }).then(() => {
      router.push('/ai')
    }).catch(() => {})
  } else {
    router.push('/ai')
  }
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
    ElMessage.warning('请先填写 AI 名称')
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

    submitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      // await store.update(form.id, form)
      ElMessage.success('✅ AI 助手更新成功！')
      router.push('/ai')
    } catch (error) {
      ElMessage.error('更新失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = () => {
  deleteVisible.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // await store.delete(form.id)
    ElMessage.success('✅ AI 助手已删除')
    deleteVisible.value = false
    router.push('/ai')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // const data = await store.fetchById(id)
    // Object.assign(form, data)
    await new Promise(resolve => setTimeout(resolve, 800))
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
.ai-edit-page {
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
   加载状态
   ============================================================ */

.loading-container {
  padding: 20px 0;
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

.section-title .el-button {
  font-size: 14px;
  font-weight: 400;
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
   Slider 样式
   ============================================================ */

:deep(.el-slider) {
  width: 100%;
}

:deep(.el-slider .el-slider__marks-text) {
  font-size: 11px;
  color: #9CA3AF;
}

:deep(.el-slider .el-slider__runway) {
  margin: 12px 0;
}

/* ============================================================
   标签样式
   ============================================================ */

.tag-item {
  margin-right: 8px;
  margin-bottom: 8px;
}

.tag-input {
  width: 120px;
  margin-right: 8px;
}

.tag-add-btn {
  border-style: dashed;
  border-color: #D1D5DB;
  color: #6B7280;
}

.tag-add-btn:hover {
  border-color: #4F46E5;
  color: #4F46E5;
}

/* ============================================================
   更新信息
   ============================================================ */

.update-info {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  font-size: 13px;
  color: #9CA3AF;
  border-top: 1px solid #F3F4F6;
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

.preview-type {
  font-size: 13px;
  color: #6B7280;
}

.preview-body {
  padding: 8px 0;
}

.preview-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.preview-message.user {
  flex-direction: row-reverse;
}

.preview-message.user .preview-message-content {
  background: #409EFF;
  color: white;
  border-radius: 12px 12px 4px 12px;
}

.preview-message.assistant .preview-message-content {
  background: #F3F4F6;
  color: #1F2937;
  border-radius: 12px 12px 12px 4px;
}

.preview-message-content {
  max-width: 75%;
  padding: 12px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.preview-message-text {
  font-size: 14px;
  line-height: 1.6;
}

.preview-message-time {
  font-size: 10px;
  color: #9CA3AF;
  margin-top: 4px;
}

.preview-message.user .preview-message-time {
  color: rgba(255, 255, 255, 0.6);
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #9CA3AF;
}

.preview-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
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

[data-theme="dark"] .ai-edit-page {
  background: #1A1A2E;
}

[data-theme="dark"] .header-title h1 {
  color: #F5F5F7;
}

[data-theme="dark"] .main-card {
  background: #2C2C2E;
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

[data-theme="dark"] .update-info {
  border-color: #3A3A3C;
  color: #6B7280;
}

[data-theme="dark"] .form-actions {
  border-color: #3A3A3C;
}

[data-theme="dark"] .preview-message.assistant .preview-message-content {
  background: #3A3A3C;
  color: #F5F5F7;
}

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .ai-edit-page {
    padding: 16px;
  }

  .main-card :deep(.el-card__body) {
    padding: 20px 16px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
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

  .preview-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview-stats {
    flex-wrap: wrap;
  }

  .preview-header {
    flex-wrap: wrap;
  }
}
</style>