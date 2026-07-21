<!-- 
  文件路径: frontend/src/modules/ai/pages/AICustomerService.vue
  功能: AI客服 - 智能客户服务
-->

<template>
  <div class="page-container">
    <el-card class="filter-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>AI 智能客服</h3>
        <el-tag type="success" size="large">🟢 在线 - 已接入</el-tag>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header><span>客服统计</span></template>
          <div class="stats-item">
            <span>今日会话</span>
            <span class="stats-value">{{ todaySessions }}</span>
          </div>
          <div class="stats-item">
            <span>排队人数</span>
            <span class="stats-value">{{ queueCount }}</span>
          </div>
          <div class="stats-item">
            <span>平均响应时间</span>
            <span class="stats-value">{{ avgResponseTime }}</span>
          </div>
          <div class="stats-item">
            <span>客户满意度</span>
            <span class="stats-value">{{ satisfactionRate }}</span>
          </div>
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header><span>快捷回复</span></template>
          <div v-for="reply in quickReplies" :key="reply.id" class="quick-reply" @click="handleQuickReply(reply)">
            {{ reply.text }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div class="chat-container">
            <div class="chat-header">
              <span>客户: Ahmed Al-Fahd</span>
              <el-tag size="small" type="success">在线</el-tag>
            </div>
            <div class="chat-messages" ref="messagesContainer">
              <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.role">
                <div class="message-avatar">
                  <el-avatar :size="32" :icon="msg.role === 'customer' ? 'UserFilled' : 'Service'" />
                </div>
                <div class="message-content">
                  <div class="message-text">{{ msg.content }}</div>
                  <div class="message-time">{{ msg.time }}</div>
                </div>
              </div>
              <div v-if="loading" class="message agent">
                <div class="message-avatar"><el-avatar :size="32" icon="Service" /></div>
                <div class="message-content">
                  <div class="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <el-input
                v-model="reply"
                placeholder="输入回复..."
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
import { Promotion, UserFilled, Service } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const reply = ref('')
const loading = ref(false)
const messagesContainer = ref<HTMLElement>()

const todaySessions = ref('156')
const queueCount = ref('3')
const avgResponseTime = ref('12秒')
const satisfactionRate = ref('4.8/5')

const quickReplies = ref([
  { id: 1, text: '您好，请问有什么可以帮助您？' },
  { id: 2, text: '您的问题我已了解，正在处理中...' },
  { id: 3, text: '感谢您的耐心等待，已为您解决。' },
  { id: 4, text: '如有其他问题，随时联系我们。' },
])

const messages = ref([
  { role: 'customer', content: '你好，我的订单还没有收到，请帮忙查询一下。', time: '10:30' },
  { role: 'agent', content: '好的，请提供您的订单号，我帮您查询。', time: '10:31' },
  { role: 'customer', content: '订单号是 ORD-2024-001', time: '10:32' },
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSend = async () => {
  if (!reply.value.trim()) return
  if (loading.value) return

  messages.value.push({
    role: 'agent',
    content: reply.value,
    time: new Date().toLocaleTimeString(),
  })
  reply.value = ''
  loading.value = true
  await scrollToBottom()

  setTimeout(() => {
    const responses = [
      '好的，已经为您查询到订单信息，预计今天送达。',
      '明白了，我马上为您处理这个问题。',
      '感谢您的反馈，我们会尽快解决。',
    ]
    messages.value.push({
      role: 'customer',
      content: responses[Math.floor(Math.random() * responses.length)],
      time: new Date().toLocaleTimeString(),
    })
    loading.value = false
    scrollToBottom()
  }, 1000)
}

const handleQuickReply = (replyObj: any) => {
  reply.value = replyObj.text
  handleSend()
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.filter-card { margin-bottom: 20px; border-radius: 12px; }
.filter-card h3 { margin: 0; }
.stats-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.stats-item:last-child { border-bottom: none; }
.stats-value { font-weight: 700; color: #303133; }
.quick-reply { padding: 8px 12px; border: 1px solid #e4e7ed; border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; font-size: 13px; }
.quick-reply:hover { background: #f0f7ff; border-color: #409EFF; }
.quick-reply:last-child { margin-bottom: 0; }
.chat-container { display: flex; flex-direction: column; height: 500px; }
.chat-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background: #f5f7fa; border-radius: 8px 8px 0 0; font-weight: 600; }
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; background: #fafafa; border-radius: 0 0 8px 8px; }
.message { display: flex; gap: 12px; margin-bottom: 12px; }
.message.customer { flex-direction: row; }
.message.agent { flex-direction: row-reverse; }
.message.agent .message-content { background: #409EFF; color: white; border-radius: 12px 12px 4px 12px; }
.message.customer .message-content { background: white; border-radius: 12px 12px 12px 4px; }
.message-content { max-width: 75%; padding: 10px 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.message-text { font-size: 14px; line-height: 1.5; }
.message-time { font-size: 10px; color: #909399; margin-top: 2px; }
.message.agent .message-time { color: rgba(255,255,255,0.7); }
.typing-indicator { display: flex; gap: 4px; padding: 4px 0; }
.typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: #909399; animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-8px); opacity: 1; } }
.chat-input { margin-top: 16px; }
</style>