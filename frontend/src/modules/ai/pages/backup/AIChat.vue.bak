<!-- 
  文件路径: frontend/src/modules/ai/pages/AIChat.vue
  功能: AI聊天 - 智能对话助手
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>AI 智能聊天</h3>
        <div>
          <el-button type="warning" @click="handleNewChat"><el-icon><Plus /></el-icon> 新对话</el-button>
          <el-button @click="handleClear"><el-icon><Delete /></el-icon> 清空</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="4">
        <el-card>
          <template #header><span>对话历史</span></template>
          <div v-for="session in sessions" :key="session.id" class="session-item" :class="{ active: session.active }" @click="handleSelectSession(session)">
            <span>{{ session.title }}</span>
            <span class="session-time">{{ session.time }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
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
                <div class="message-avatar"><el-avatar :size="36" icon="Cpu" /></div>
                <div class="message-content">
                  <div class="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <el-input
                v-model="message"
                placeholder="输入消息..."
                size="large"
                @keyup.enter="handleSend"
                clearable
              >
                <template #append>
                  <el-button type="primary" @click="handleSend" :loading="loading">
                    <el-icon><Promotion /></el-icon> 发送
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Plus, Delete, Promotion, UserFilled, Cpu } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const message = ref('')
const loading = ref(false)
const messagesContainer = ref<HTMLElement>()

const sessions = ref([
  { id: 1, title: '产品咨询', time: '10:30', active: true },
  { id: 2, title: '订单问题', time: '09:15', active: false },
  { id: 3, title: '库存查询', time: '昨天', active: false },
])

const messages = ref([
  { role: 'assistant', content: '您好！我是AI聊天助手，可以帮您处理各种业务咨询。请问有什么需要帮助的？', time: '10:30' },
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSend = async () => {
  if (!message.value.trim()) return
  if (loading.value) return

  messages.value.push({
    role: 'user',
    content: message.value,
    time: new Date().toLocaleTimeString(),
  })
  const userMessage = message.value
  message.value = ''
  loading.value = true
  await scrollToBottom()

  setTimeout(() => {
    const responses = [
      '好的，我来帮您处理这个问题。根据系统信息，我建议...',
      '明白了！让我为您分析一下这个情况...',
      '这是一个很好的问题！根据我的理解...',
      '收到！我正在查询相关数据，请稍候...',
    ]
    messages.value.push({
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)] + '\n\n' + '您还有什么其他问题吗？',
      time: new Date().toLocaleTimeString(),
    })
    loading.value = false
    scrollToBottom()
  }, 1200)
}

const handleNewChat = () => {
  sessions.value.unshift({ id: Date.now(), title: '新对话', time: '刚刚', active: true })
  sessions.value.forEach(s => s.active = false)
  sessions.value[0].active = true
  messages.value = [
    { role: 'assistant', content: '您好！这是新的对话，请问有什么可以帮您？', time: new Date().toLocaleTimeString() },
  ]
  ElMessage.success('已创建新对话')
}

const handleClear = () => {
  messages.value = [
    { role: 'assistant', content: '对话已清空，有什么可以帮您的？', time: new Date().toLocaleTimeString() },
  ]
  ElMessage.success('已清空对话')
}

const handleSelectSession = (session: any) => {
  sessions.value.forEach(s => s.active = false)
  session.active = true
  ElMessage.info(`切换到: ${session.title}`)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.session-item { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
.session-item:hover { background: #f5f7fa; }
.session-item.active { background: #E3F2FD; border-left: 3px solid #409EFF; }
.session-time { color: #909399; font-size: 12px; }
.chat-container { display: flex; flex-direction: column; height: 500px; }
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; background: #fafafa; border-radius: 8px; }
.message { display: flex; gap: 12px; margin-bottom: 16px; }
.message.user { flex-direction: row-reverse; }
.message.user .message-content { background: #409EFF; color: white; border-radius: 12px 12px 4px 12px; }
.message.assistant .message-content { background: white; border-radius: 12px 12px 12px 4px; }
.message-content { max-width: 80%; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.message-text { font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
.message-time { font-size: 11px; color: #909399; margin-top: 4px; }
.message.user .message-time { color: rgba(255,255,255,0.7); }
.typing-indicator { display: flex; gap: 4px; padding: 4px 0; }
.typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: #909399; animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-8px); opacity: 1; } }
.chat-input { margin-top: 16px; }
</style>