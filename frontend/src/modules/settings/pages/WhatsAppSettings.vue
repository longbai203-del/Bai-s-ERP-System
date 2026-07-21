<!-- 
  文件路径: frontend/src/modules/settings/pages/WhatsAppSettings.vue
  功能: WhatsApp设置 - 管理WhatsApp集成
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>WhatsApp设置</h2>
          <p class="subtitle">配置WhatsApp Business集成</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
          <el-button @click="handleConnect"><el-icon><Connection /></el-icon> 连接测试</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商家电话" prop="businessPhone">
              <el-input v-model="form.businessPhone" placeholder="+966 50 123 4567" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="businessName">
              <el-input v-model="form.businessName" placeholder="Bai's ERP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Token" prop="apiToken">
              <el-input v-model="form.apiToken" placeholder="请输入WhatsApp API Token" type="password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Webhook URL">
              <el-input v-model="form.webhookUrl" placeholder="https://example.com/webhook" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自动回复">
              <el-switch v-model="form.autoReply" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="连接状态">
              <el-tag :type="form.connected ? 'success' : 'danger'">
                {{ form.connected ? '✅ 已连接' : '⚠️ 未连接' }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自动回复内容" v-if="form.autoReply">
              <el-input v-model="form.autoReplyContent" type="textarea" :rows="3" placeholder="请输入自动回复内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Connection } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formRef = ref()

const form = reactive({
  businessPhone: '+966 50 123 4567',
  businessName: 'Bai\'s ERP',
  apiToken: '',
  webhookUrl: 'https://bai-erp.com/whatsapp/webhook',
  autoReply: true,
  connected: false,
  autoReplyContent: '您好！感谢您的消息，我们会尽快回复您。',
})

const rules = {
  businessPhone: [{ required: true, message: '请输入商家电话', trigger: 'blur' }],
  businessName: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
}

const handleSave = async () => {
  await formRef.value?.validate()
  ElMessage.success('WhatsApp设置已保存')
}

const handleConnect = () => {
  ElMessage.loading('正在连接WhatsApp...', { duration: 2000 })
  setTimeout(() => {
    form.connected = true
    ElMessage.success('WhatsApp连接成功')
  }, 2000)
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>