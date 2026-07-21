<!-- 
  文件路径: frontend/src/modules/finance/pages/ExpenseCreate.vue
  功能: 新建费用
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建费用</h2>
          <p class="subtitle">录入费用信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">提交审批</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="费用编号" prop="expenseNo">
              <el-input v-model="form.expenseNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用类别" prop="category">
              <el-select v-model="form.category" placeholder="请选择费用类别" style="width: 100%">
                <el-option label="办公费用" value="办公费用" />
                <el-option label="差旅费用" value="差旅费用" />
                <el-option label="设备费用" value="设备费用" />
                <el-option label="人力成本" value="人力成本" />
                <el-option label="营销费用" value="营销费用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用日期" prop="expenseDate">
              <el-date-picker v-model="form.expenseDate" type="date" placeholder="选择费用日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
                <el-option label="采购部" value="采购部" />
                <el-option label="销售部" value="销售部" />
                <el-option label="市场部" value="市场部" />
                <el-option label="财务部" value="财务部" />
                <el-option label="人事部" value="人事部" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用说明" prop="description">
              <el-input v-model="form.description" placeholder="请输入费用说明" />
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
  expenseNo: 'EXP-2024-004',
  category: '',
  amount: 0,
  expenseDate: new Date(),
  department: '',
  description: '',
  remark: '',
})

const rules = {
  category: [{ required: true, message: '请选择费用类别', trigger: 'change' }],
  amount: [{ required: true, message: '请输入费用金额', trigger: 'blur' }],
  expenseDate: [{ required: true, message: '请选择费用日期', trigger: 'change' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('费用已提交审批')
  router.push('/finance/expenses')
}

const handleCancel = () => { router.push('/finance/expenses') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>