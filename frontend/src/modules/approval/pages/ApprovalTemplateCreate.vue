<!-- 
  文件路径: frontend/src/modules/approval/pages/ApprovalTemplateCreate.vue
  功能: 新建审批模板
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建审批模板</h2>
          <p class="subtitle">创建审批流程模板</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">保存模板</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入模板名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择适用类型" style="width: 100%">
                <el-option label="采购审批" value="purchase" />
                <el-option label="付款审批" value="payment" />
                <el-option label="费用审批" value="expense" />
                <el-option label="合同审批" value="contract" />
                <el-option label="请假审批" value="leave" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审批步骤" prop="steps">
              <div v-for="(step, index) in form.steps" :key="index" class="step-row">
                <el-input v-model="form.steps[index]" placeholder="请输入审批步骤名称" style="width: 70%" />
                <el-button type="danger" size="small" @click="removeStep(index)">×</el-button>
              </div>
              <el-button type="primary" text @click="addStep"><el-icon><Plus /></el-icon> 添加步骤</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  name: '',
  type: 'purchase',
  steps: ['部门主管', '财务经理'],
  remark: '',
})

const rules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择适用类型', trigger: 'change' }],
  steps: [{ required: true, message: '请至少添加一个审批步骤', trigger: 'change' }],
}

const addStep = () => { form.steps.push('') }
const removeStep = (index: number) => { form.steps.splice(index, 1) }

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('审批模板已保存')
  router.push('/approval/templates')
}

const handleCancel = () => { router.push('/approval/templates') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.step-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
</style>