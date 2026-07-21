<!-- 
  文件路径: frontend/src/modules/ai/pages/AIQA.vue
  功能: AI问答 - 智能业务问答
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>AI 智能问答</h3>
        <el-tag type="warning" size="large">🤖 知识库已加载</el-tag>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <div class="chat-container">
            <div class="chat-messages" ref="messagesContainer">
              <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.role">
                <div class="message-avatar">
                  <el-avatar :size="36" :icon="msg.role === 'user' ? 'UserFilled' : 'Cpu'" />
                </div>
                <div class="message-content">
                  <div class="message-text">{{ msg.content }}</div>
                  <div class="message-time">{{ msg.time }}</div>
                </div>
              </div>
              <div v-if="loading" class="message assistant">
                <div class="message-avatar">
                  <el-avatar :size="36" icon="Cpu" />
                </div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <el-input
                v-model="question"
                placeholder="请输入您的问题..."
                size="large"
                @keyup.enter="handleAsk"
                clearable
              >
                <template #append>
                  <el-button type="primary" @click="handleAsk" :loading="loading">
                    <el-icon><Promotion /></el-icon> 提问
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>热门问题</span></template>
          <div v-for="q in hotQuestions" :key="q.id" class="hot-question" @click="handleHotQuestion(q)">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ q.question }}</span>
          </div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>AI能力</span></template>
          <div class="ai-capability">✅ 业务知识问答</div>
          <div class="ai-capability">✅ 数据分析查询</div>
          <div class="ai-capability">✅ 报表解读</div>
          <div class="ai-capability">✅ 操作指导</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Promotion, ChatDotRound, UserFilled, Cpu } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const question = ref('')
const loading = ref(false)
const messagesContainer = ref<HTMLElement>()

const messages = ref([
  { role: 'assistant', content: '您好！我是AI业务助手，可以帮您解答业务问题、查询数据或提供建议。请问有什么可以帮您？', time: '2024-11-20 10:00' },
])

const hotQuestions = ref([
  { id: 1, question: '本月销售总额是多少？' },
  { id: 2, question: '哪些产品库存低于安全库存？' },
  { id: 3, question: '最近一周的利润趋势如何？' },
  { id: 4, question: '如何创建采购订单？' },
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleAsk = async () => {
  if (!question.value.trim()) return
  if (loading.value) return

  messages.value.push({
    role: 'user',
    content: question.value,
    time: new Date().toLocaleString(),
  })
  const userQuestion = question.value
  question.value = ''
  loading.value = true
  await scrollToBottom()

  // 模拟AI响应
  setTimeout(() => {
    const responses = [
      '根据系统数据，本月销售总额为 SAR 12,856,000，环比增长 12.5%。',
      '当前有 5 款产品库存低于安全库存，建议尽快补货。',
      '最近一周利润趋势良好，同比增长 18.5%。',
      '创建采购订单：进入采购模块 → 点击"新建采购单" → 填写供应商和产品信息 → 提交审批。',
    ]
    messages.value.push({
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      time: new Date().toLocaleString(),
    })
    loading.value = false
    scrollToBottom()
  }, 1500)
}

const handleHotQuestion = (q: any) => {
  question.value = q.question
  handleAsk()
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.chat-container { display: flex; flex-direction: column; height: 500px; }
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; background: #fafafa; border-radius: 8px; }
.message { display: flex; gap: 12px; margin-bottom: 16px; }
.message.user { flex-direction: row-reverse; }
.message.user .message-content { background: #409EFF; color: white; border-radius: 12px 12px 4px 12px; }
.message.assistant .message-content { background: white; border-radius: 12px 12px 12px 4px; }
.message-content { max-width: 80%; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.message-text { font-size: 14px; line-height: 1.6; }
.message-time { font-size: 11px; color: #909399; margin-top: 4px; }
.message.user .message-time { color: rgba(255,255,255,0.7); }
.typing-indicator { display: flex; gap: 4px; padding: 4px 0; }
.typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: #909399; animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-8px); opacity: 1; } }
.chat-input { margin-top: 16px; }
.hot-question { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s; }
.hot-question:hover { background: #f5f7fa; }
.hot-question:last-child { border-bottom: none; }
.hot-question .el-icon { color: #409EFF; }
.ai-capability { padding: 8px 0; color: #606266; }
</style>