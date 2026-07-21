<!-- 
  文件路径: frontend/src/modules/marketing/pages/EmailMarketingCreate.vue
  功能: 新建邮件营销
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建邮件</h2>
          <p class="subtitle">创建邮件营销内容</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSend">发送邮件</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮件主题" prop="subject">
              <el-input v-model="form.subject" placeholder="请输入邮件主题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人列表" prop="recipients">
              <el-select v-model="form.recipients" placeholder="请选择收件人列表" style="width: 100%">
                <el-option label="全部客户" value="all" />
                <el-option label="VIP客户" value="vip" />
                <el-option label="活跃客户" value="active" />
                <el-option label="新客户" value="new" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮件内容" prop="content">
              <div class="editor-toolbar">
                <el-button size="small" @click="insertTag('{{customer_name}}')">插入客户名称</el-button>
                <el-button size="small" @click="insertTag('{{campaign_name}}')">插入活动名称</el-button>
                <el-button size="small" @click="insertTag('{{discount}}')">插入折扣</el-button>
              </div>
              <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入邮件内容，支持HTML" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  subject: '',
  recipients: 'all',
  content: '',
})

const rules = {
  subject: [{ required: true, message: '请输入邮件主题', trigger: 'blur' }],
  recipients: [{ required: true, message: '请选择收件人列表', trigger: 'change' }],
  content: [{ required: true, message: '请输入邮件内容', trigger: 'blur' }],
}

const insertTag = (tag: string) => {
  form.content += tag
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSend = async () => {
  await formRef.value?.validate()
  ElMessage.success('邮件已发送')
  router.push('/marketing/email')
}
const handleCancel = () => { router.push('/marketing/email') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.editor-toolbar { display: flex; gap: 8px; margin-bottom: 12px; }
</style>