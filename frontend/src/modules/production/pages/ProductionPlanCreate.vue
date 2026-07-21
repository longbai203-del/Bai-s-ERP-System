<!-- 
  文件路径: frontend/src/modules/production/pages/ProductionPlanCreate.vue
  功能: 新建生产计划
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建生产计划</h2>
          <p class="subtitle">创建生产计划</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交计划</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="计划编号" prop="planNo">
              <el-input v-model="form.planNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称" prop="product">
              <el-select v-model="form.product" placeholder="请选择产品" style="width: 100%" filterable>
                <el-option label="iPhone 15 Pro Max" value="iPhone 15 Pro Max" />
                <el-option label="三星 Galaxy S24 Ultra" value="三星 Galaxy S24 Ultra" />
                <el-option label="MacBook Pro 16\"" value="MacBook Pro 16\"" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划周期" prop="period">
              <el-date-picker v-model="form.period" type="month" placeholder="选择计划周期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划产量" prop="plannedQuantity">
              <el-input-number v-model="form.plannedQuantity" :min="1" controls-position="right" style="width: 100%" />
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
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" style="width: 100%" />
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
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  planNo: 'PP-2024-004',
  product: '',
  period: '',
  plannedQuantity: 100,
  priority: 'medium',
  startDate: '',
  remark: '',
})

const rules = {
  product: [{ required: true, message: '请选择产品', trigger: 'change' }],
  period: [{ required: true, message: '请选择计划周期', trigger: 'change' }],
  plannedQuantity: [{ required: true, message: '请输入计划产量', trigger: 'blur' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('生产计划已提交')
  router.push('/production/plan')
}
const handleCancel = () => { router.push('/production/plan') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>