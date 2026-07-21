<!-- 
  文件路径: frontend/src/modules/finance/pages/PaymentCreate.vue
  功能: 新建付款
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建付款</h2>
          <p class="subtitle">录入付款信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">提交付款</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="付款编号" prop="paymentNo">
              <el-input v-model="form.paymentNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier">
              <el-select v-model="form.supplier" placeholder="请选择供应商" style="width: 100%" filterable>
                <el-option label="Apple Supplier" value="Apple Supplier" />
                <el-option label="Samsung Supplier" value="Samsung Supplier" />
                <el-option label="Dell Supplier" value="Dell Supplier" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式" prop="method">
              <el-select v-model="form.method" placeholder="请选择付款方式" style="width: 100%">
                <el-option label="银行转账" value="银行转账" />
                <el-option label="支票" value="支票" />
                <el-option label="现金" value="现金" />
                <el-option label="在线支付" value="在线支付" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款日期" prop="paymentDate">
              <el-date-picker v-model="form.paymentDate" type="date" placeholder="选择付款日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参考号" prop="reference">
              <el-input v-model="form.reference" placeholder="请输入参考号" />
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
  paymentNo: 'PAY-2024-004',
  supplier: '',
  amount: 0,
  method: '银行转账',
  paymentDate: new Date(),
  reference: '',
  remark: '',
})

const rules = {
  supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  amount: [{ required: true, message: '请输入付款金额', trigger: 'blur' }],
  method: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
  paymentDate: [{ required: true, message: '请选择付款日期', trigger: 'change' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('付款已提交')
  router.push('/finance/payments')
}

const handleCancel = () => { router.push('/finance/payments') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>