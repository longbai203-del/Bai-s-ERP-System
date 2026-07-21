<!-- 
  文件路径: frontend/src/modules/production/pages/WorkOrderCreate.vue
  功能: 新建工单
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建生产工单</h2>
          <p class="subtitle">创建生产工单</p>
        </div>
        <div>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" @click="handleSubmit">提交工单</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="工单号" prop="workOrderNo">
              <el-input v-model="form.workOrderNo" disabled />
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
            <el-form-item label="BOM版本" prop="bomVersion">
              <el-select v-model="form.bomVersion" placeholder="请选择BOM版本" style="width: 100%">
                <el-option label="V1.0" value="V1.0" />
                <el-option label="V2.0" value="V2.0" />
                <el-option label="V2.1" value="V2.1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划数量" prop="quantity">
              <el-input-number v-model="form.quantity" :min="1" controls-position="right" style="width: 100%" />
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
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker v-model="form.deadline" type="date" placeholder="选择截止日期" style="width: 100%" />
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
  workOrderNo: 'WO-2024-004',
  product: '',
  bomVersion: 'V1.0',
  quantity: 100,
  priority: 'medium',
  deadline: '',
  remark: '',
})

const rules = {
  product: [{ required: true, message: '请选择产品', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入计划数量', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
}

const handleSaveDraft = () => { ElMessage.success('已保存草稿') }
const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('工单已提交')
  router.push('/production/workorders')
}
const handleCancel = () => { router.push('/production/workorders') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>