<!-- 
  文件路径: frontend/src/modules/marketing/pages/SocialMediaCreate.vue
  功能: 新建社交媒体内容
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>创建社交媒体内容</h2>
          <p class="subtitle">发布社交媒体内容</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="内容标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入内容标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台" prop="platform">
              <el-select v-model="form.platform" placeholder="请选择平台" style="width: 100%">
                <el-option label="Twitter" value="twitter" />
                <el-option label="Instagram" value="instagram" />
                <el-option label="LinkedIn" value="linkedin" />
                <el-option label="TikTok" value="tiktok" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="媒体附件">
              <el-upload action="#" multiple :auto-upload="false">
                <el-button type="primary" text><el-icon><Upload /></el-icon> 上传图片/视频</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划发布时间" prop="scheduledAt">
              <el-date-picker v-model="form.scheduledAt" type="datetime" placeholder="选择发布时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-select v-model="form.tags" multiple placeholder="请选择标签" style="width: 100%">
                <el-option label="促销" value="promotion" />
                <el-option label="品牌" value="brand" />
                <el-option label="新品" value="new" />
                <el-option label="活动" value="event" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  title: '',
  platform: 'twitter',
  content: '',
  scheduledAt: '',
  tags: [],
})

const rules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('已提交审核')
  router.push('/marketing/social')
}
const handleCancel = () => { router.push('/marketing/social') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>