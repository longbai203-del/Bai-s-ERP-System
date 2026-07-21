<!-- 
  文件路径: frontend/src/modules/marketing/pages/CampaignCreate.vue
  功能: 新建营销活动
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建营销活动</h2>
          <p class="subtitle">创建营销活动</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交活动</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入活动名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%">
                <el-option label="促销活动" value="promotion" />
                <el-option label="品牌活动" value="brand" />
                <el-option label="内容营销" value="content" />
                <el-option label="线下活动" value="offline" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预算" prop="budget">
              <el-input-number v-model="form.budget" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标受众" prop="targetAudience">
              <el-select v-model="form.targetAudience" placeholder="请选择目标受众" style="width: 100%">
                <el-option label="企业客户" value="business" />
                <el-option label="个人客户" value="individual" />
                <el-option label="VIP客户" value="vip" />
                <el-option label="全部客户" value="all" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" placeholder="选择结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动目标" prop="goal">
              <el-input v-model="form.goal" type="textarea" :rows="2" placeholder="请输入活动目标" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入活动描述" />
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
  name: '',
  type: 'promotion',
  budget: 0,
  targetAudience: 'all',
  startDate: '',
  endDate: '',
  goal: '',
  description: '',
})

const rules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  budget: [{ required: true, message: '请输入预算', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('活动已提交')
  router.push('/marketing/campaigns')
}
const handleCancel = () => { router.push('/marketing/campaigns') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>