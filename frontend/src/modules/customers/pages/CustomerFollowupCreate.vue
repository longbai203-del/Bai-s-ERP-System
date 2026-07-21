<!-- 
  文件路径: frontend/src/modules/customers/pages/CustomerFollowupCreate.vue
  功能: 新建跟进
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建跟进记录</h2>
          <p class="subtitle">记录客户跟进信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">保存跟进</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customer">
              <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
                <el-option label="沙特电信公司" value="沙特电信公司" />
                <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                <el-option label="沙特阿美" value="沙特阿美" />
                <el-option label="利雅得银行" value="利雅得银行" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跟进方式" prop="method">
              <el-select v-model="form.method" placeholder="请选择跟进方式" style="width: 100%">
                <el-option label="电话" value="phone" />
                <el-option label="拜访" value="visit" />
                <el-option label="邮件" value="email" />
                <el-option label="微信/WhatsApp" value="chat" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跟进日期" prop="followupDate">
              <el-date-picker v-model="form.followupDate" type="datetime" placeholder="选择跟进时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跟进人" prop="followupBy">
              <el-select v-model="form.followupBy" placeholder="请选择跟进人" style="width: 100%">
                <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
                <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
                <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="跟进内容" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入跟进内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="下一步计划" prop="nextPlan">
              <el-input v-model="form.nextPlan" type="textarea" :rows="3" placeholder="请输入下一步计划" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
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
  customer: '',
  method: 'phone',
  followupDate: new Date(),
  followupBy: '',
  content: '',
  nextPlan: '',
  remark: '',
})

const rules = {
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  method: [{ required: true, message: '请选择跟进方式', trigger: 'change' }],
  followupDate: [{ required: true, message: '请选择跟进日期', trigger: 'change' }],
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('跟进记录已保存')
  router.push('/customers/followup')
}

const handleCancel = () => { router.push('/customers/followup') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>