<!-- 
  文件路径: frontend/src/modules/approval/pages/ApprovalCreate.vue
  功能: 新建审批 - 发起新的审批
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>发起审批</h2>
          <p class="subtitle">创建新的审批申请</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交审批</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="审批类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择审批类型" style="width: 100%">
                <el-option label="采购审批" value="purchase" />
                <el-option label="付款审批" value="payment" />
                <el-option label="费用审批" value="expense" />
                <el-option label="合同审批" value="contract" />
                <el-option label="请假审批" value="leave" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入审批标题" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联单据" prop="referenceNo">
              <el-input v-model="form.referenceNo" placeholder="请输入关联单据号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急程度" prop="urgent">
              <el-select v-model="form.urgent" placeholder="请选择紧急程度" style="width: 100%">
                <el-option label="普通" value="normal" />
                <el-option label="紧急" value="urgent" />
                <el-option label="特急" value="critical" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批人" prop="approver">
              <el-select v-model="form.approver" placeholder="请选择审批人" style="width: 100%">
                <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
                <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
                <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审批说明" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请详细说明审批事项" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="attachments">
              <el-upload action="#" multiple :auto-upload="false">
                <el-button type="primary" text><el-icon><Upload /></el-icon> 上传附件</el-button>
              </el-upload>
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
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  type: 'purchase',
  title: '',
  referenceNo: '',
  amount: 0,
  urgent: 'normal',
  approver: '',
  description: '',
})

const rules = {
  type: [{ required: true, message: '请选择审批类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入审批标题', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入审批金额', trigger: 'blur' }],
  approver: [{ required: true, message: '请选择审批人', trigger: 'change' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('审批已提交')
  router.push('/approval/my')
}
const handleCancel = () => { router.push('/approval/dashboard') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>