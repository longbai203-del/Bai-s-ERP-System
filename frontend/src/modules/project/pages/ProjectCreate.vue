<!-- 
  文件路径: frontend/src/modules/project/pages/ProjectCreate.vue
  功能: 新建项目
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建项目</h2>
          <p class="subtitle">创建新项目</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交项目</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectNo">
              <el-input v-model="form.projectNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户" prop="customer">
              <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
                <el-option label="沙特电信公司" value="沙特电信公司" />
                <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                <el-option label="沙特阿美" value="沙特阿美" />
                <el-option label="利雅得银行" value="利雅得银行" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算" prop="budget">
              <el-input-number v-model="form.budget" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="规划中" value="planning" />
                <el-option label="进行中" value="active" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker v-model="form.deadline" type="date" placeholder="选择截止日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目经理" prop="projectManager">
              <el-select v-model="form.projectManager" placeholder="请选择项目经理" style="width: 100%">
                <el-option label="Ahmed Al-Fahd" value="Ahmed Al-Fahd" />
                <el-option label="Mohammed Al-Qahtani" value="Mohammed Al-Qahtani" />
                <el-option label="Saud Al-Otaibi" value="Saud Al-Otaibi" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入项目描述" />
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
  projectNo: 'PRJ-2024-005',
  name: '',
  customer: '',
  budget: 0,
  priority: 'medium',
  status: 'planning',
  startDate: '',
  deadline: '',
  projectManager: '',
  description: '',
  remark: '',
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  budget: [{ required: true, message: '请输入预算', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('项目已创建')
  router.push('/project/list')
}
const handleCancel = () => { router.push('/project/list') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>