<!-- 
  文件路径: frontend/src/modules/ai/pages/Detail.vue
  功能: AI 功能详情页面 - 查看 AI 助手详情
-->

<template>
  <div class="ai-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <div class="header-title">
          <h1>🤖 AI 助手详情</h1>
          <p class="header-subtitle">查看 AI 助手的详细配置信息</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon> 编辑
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
            <div class="overview-label">AI 名称</div>
            <div class="overview-value">{{ detail.name || '未命名' }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">AI 类型</div>
            <div class="overview-value">{{ getTypeLabel(detail.type) }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">AI 模型</div>
            <div class="overview-value">{{ getModelLabel(detail.model) }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-label">状态</div>
            <div class="overview-value">
              <el-tag :type="detail.status === 'active' ? 'success' : 'info'" size="large">
                {{ detail.status === 'active' ? '🟢 已启用' : '⛔ 已停用' }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细信息 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="detail-card" shadow="hover">
            <template #header>
              <span>📋 基本信息</span>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="AI ID">
                <span class="mono-text">{{ detail.id || 'AI-001' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ detail.createdAt || '2024-11-20 10:00:00' }}
              </el-descriptions-item>
              <el-descriptions-item label="温度参数">
                {{ detail.temperature || 0.7 }}
              </el-descriptions-item>
              <el-descriptions-item label="最大 Token">
                {{ detail.maxTokens || 2048 }}
              </el-descriptions-item>
              <el-descriptions-item label="Top P">
                {{ detail.topP || 0.9 }}
              </el-descriptions-item>
              <el-descriptions-item label="响应格式">
                {{ getFormatLabel(detail.responseFormat) }}
              </el-descriptions-item>
              <el-descriptions-item label="语言">
                {{ getLanguageLabel(detail.language) }}
              </el-descriptions-item>
              <el-descriptions-item label="知识库">
                <el-tag
                  v-for="kb in detail.knowledgeBase || []"
                  :key="kb"
                  size="small"
                  class="kb-tag"
                >
                  {{ getKnowledgeLabel(kb) }}
                </el-tag>
                <span v-if="!detail.knowledgeBase?.length" style="color: #9CA3AF;">未关联</span>
              </el-descriptions-item>
              <el-descriptions-item label="标签" :span="2">
                <el-tag
                  v-for="tag in detail.tags || []"
                  :key="tag"
                  size="small"
                  type="info"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
                <span v-if="!detail.tags?.length" style="color: #9CA3AF;">无标签</span>
              </el-descriptions-item>
              <el-descriptions-item label="功能描述" :span="2">
                {{ detail.description || '无描述' }}
              </el-descriptions-item>
              <el-descriptions-item label="使用示例" :span="2">
                {{ detail.example || '无示例' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 系统提示词 -->
          <el-card class="detail-card" shadow="hover">
            <template #header>
              <span>🧠 系统提示词</span>
            </template>
            <div class="system-prompt">
              {{ detail.systemPrompt || '未设置系统提示词' }}
            </div>
          </el-card>

          <!-- 使用统计 -->
          <el-card class="detail-card" shadow="hover" style="margin-top: 20px;">
            <template #header>
              <span>📊 使用统计</span>
            </template>
            <div class="stats-list">
              <div class="stats-item">
                <span class="stats-label">总对话次数</span>
                <span class="stats-value">{{ detail.totalChats || 1,286 }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">今日对话</span>
                <span class="stats-value">{{ detail.todayChats || 86 }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">平均响应时间</span>
                <span class="stats-value">{{ detail.avgResponseTime || '1.2s' }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">用户满意度</span>
                <span class="stats-value">{{ detail.satisfaction || '4.8/5' }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 最近对话记录 -->
      <el-card class="detail-card" shadow="hover" style="margin-top: 20px;">
        <template #header>
          <div class="card-header-with-action">
            <span>💬 最近对话记录</span>
            <el-button size="small" type="text" @click="handleViewAllChats">
              查看全部 →
            </el-button>
          </div>
        </template>
        <el-table :data="recentChats" style="width: 100%" stripe>
          <el-table-column prop="user" label="用户" width="120" />
          <el-table-column prop="message" label="消息内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column label="操作" width="100" align="center">
            <template #default>
              <el-button size="small" type="primary" text>查看</el-button>
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
        <p>确定要删除 AI 助手 <strong>{{ detail.name }}</strong> 吗？</p>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete, WarningFilled } from '@element-plus/icons-vue'
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

const loading = ref(false)
const deleting = ref(false)
const deleteVisible = ref(false)

// ============================================================
// 详情数据
// ============================================================

const detail = reactive({
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
  totalChats: 1286,
  todayChats: 86,
  avgResponseTime: '1.2s',
  satisfaction: '4.8/5'
})

// ============================================================
// 最近对话记录
// ============================================================

const recentChats = ref([
  { user: 'Ahmed Al-Fahd', message: '您好，我的订单 ORD-2024-001 什么时候发货？', time: '2024-11-20 14:30' },
  { user: 'Mohammed Al-Qahtani', message: '请问 iPhone 15 Pro Max 有现货吗？', time: '2024-11-20 13:15' },
  { user: 'Saud Al-Otaibi', message: '我想查询一下我的会员等级和积分', time: '2024-11-20 11:45' },
  { user: 'Faisal Al-Dossary', message: '这个产品的保修期是多久？', time: '2024-11-20 10:20' },
  { user: 'Khalid Al-Ghamdi', message: '如何申请退款？麻烦给个流程', time: '2024-11-20 09:00' },
])

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

const getFormatLabel = (format: string) => {
  const map: Record<string, string> = {
    text: '文本',
    json: 'JSON',
    markdown: 'Markdown'
  }
  return map[format] || format
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

const getKnowledgeLabel = (kb: string) => {
  const map: Record<string, string> = {
    products: '产品知识库',
    customers: '客户知识库',
    orders: '订单知识库',
    finance: '财务知识库',
    contracts: '合同知识库'
  }
  return map[kb] || kb
}

// ============================================================
// 页面操作
// ============================================================

const handleBack = () => {
  router.push('/ai')
}

const handleEdit = () => {
  router.push(`/ai/${route.params.id}/edit`)
}

const handleDelete = () => {
  deleteVisible.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // await store.delete(detail.id)
    ElMessage.success('✅ AI 助手已删除')
    deleteVisible.value = false
    router.push('/ai')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
  } finally {
    deleting.value = false
  }
}

const handleViewAllChats = () => {
  ElMessage.info('查看全部对话记录功能开发中')
}

// ============================================================
// 加载数据
// ============================================================

const loadDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    // const data = await store.fetchById(id)
    // Object.assign(detail, data)
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
.ai-detail-page {
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
   概览卡片
   ============================================================ */

.overview-row {
  margin-bottom: 20px;
}

.overview-card {
  border-radius: 12px;
  text-align: center;
}

.overview-label {
  font-size: 13px;
  color: #9CA3AF;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 18px;
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

.kb-tag {
  margin-right: 4px;
  margin-bottom: 2px;
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 2px;
}

/* ============================================================
   系统提示词
   ============================================================ */

.system-prompt {
  padding: 12px 16px;
  background: #F9FAFB;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: #4B5563;
  white-space: pre-wrap;
  min-height: 80px;
}

/* ============================================================
   使用统计
   ============================================================ */

.stats-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
  margin-top: 4px;
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

[data-theme="dark"] .ai-detail-page {
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

[data-theme="dark"] .system-prompt {
  background: #3A3A3C;
  color: #D1D5DB;
}

[data-theme="dark"] .stats-item {
  background: #3A3A3C;
}

[data-theme="dark"] .stats-value {
  color: #F5F5F7;
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

[data-theme="dark"] .delete-confirm p {
  color: #F5F5F7;
}

/* ============================================================
   响应式
   ============================================================ */

@media (max-width: 768px) {
  .ai-detail-page {
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