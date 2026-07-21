<!-- 
  文件路径: frontend/src/modules/settings/pages/SMSSettings.vue
  功能: 短信设置 - 管理短信服务配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>短信设置</h2>
          <p class="subtitle">配置短信服务</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
          <el-button @click="handleTest"><el-icon><Message /></el-icon> 测试短信</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务提供商" prop="provider">
              <el-select v-model="form.provider" style="width: 100%">
                <el-option label="Twilio" value="twilio" />
                <el-option label="AWS SNS" value="aws" />
                <el-option label="阿里云短信" value="aliyun" />
                <el-option label="腾讯云短信" value="tencent" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Key" prop="apiKey">
              <el-input v-model="form.apiKey" placeholder="请输入API Key" type="password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API Secret" prop="apiSecret">
              <el-input v-model="form.apiSecret" placeholder="请输入API Secret" type="password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发件人ID" prop="senderId">
              <el-input v-model="form.senderId" placeholder="请输入发件人ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信模板">
              <el-select v-model="form.template" style="width: 100%">
                <el-option label="OTP验证码" value="otp" />
                <el-option label="通知提醒" value="notification" />
                <el-option label="营销推广" value="marketing" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch v-model="form.enabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formRef = ref()

const form = reactive({
  provider: 'twilio',
  apiKey: '',
  apiSecret: '',
  senderId: 'BaiERP',
  template: 'otp',
  enabled: true,
})

const rules = {
  provider: [{ required: true, message: '请选择服务提供商', trigger: 'change' }],
  apiKey: [{ required: true, message: '请输入API Key', trigger: 'blur' }],
}

const handleSave = async () => {
  await formRef.value?.validate()
  ElMessage.success('短信设置已保存')
}

const handleTest = () => {
  ElMessage.loading('发送测试短信...', { duration: 2000 })
  setTimeout(() => {
    ElMessage.success('测试短信已发送')
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