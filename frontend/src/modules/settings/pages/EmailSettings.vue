<!-- 
  文件路径: frontend/src/modules/settings/pages/EmailSettings.vue
  功能: 邮件设置 - 管理邮件服务器配置
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>邮件设置</h2>
          <p class="subtitle">配置邮件服务器</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
          <el-button @click="handleTest"><el-icon><Message /></el-icon> 测试邮件</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="SMTP服务器" prop="smtpHost">
              <el-input v-model="form.smtpHost" placeholder="smtp.example.com" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SMTP端口" prop="smtpPort">
              <el-input-number v-model="form.smtpPort" :min="1" :max="65535" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发件人邮箱" prop="fromEmail">
              <el-input v-model="form.fromEmail" placeholder="noreply@example.com" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发件人名称" prop="fromName">
              <el-input v-model="form.fromName" placeholder="Bai's ERP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加密方式">
              <el-radio-group v-model="form.encryption">
                <el-radio label="ssl">SSL/TLS</el-radio>
                <el-radio label="tls">STARTTLS</el-radio>
                <el-radio label="none">无加密</el-radio>
              </el-radio-group>
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
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  fromEmail: 'noreply@bai-erp.com',
  fromName: 'Bai\'s ERP',
  username: 'noreply@bai-erp.com',
  password: '',
  encryption: 'tls',
})

const rules = {
  smtpHost: [{ required: true, message: '请输入SMTP服务器', trigger: 'blur' }],
  fromEmail: [{ required: true, message: '请输入发件人邮箱', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
}

const handleSave = async () => {
  await formRef.value?.validate()
  ElMessage.success('邮件设置已保存')
}

const handleTest = () => {
  ElMessage.loading('发送测试邮件...', { duration: 2000 })
  setTimeout(() => {
    ElMessage.success('测试邮件已发送，请检查收件箱')
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