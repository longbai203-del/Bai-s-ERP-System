<!-- 
  文件路径: frontend/src/modules/finance/pages/ReceiptCreate.vue
  功能: 新建收款
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建收款</h2>
          <p class="subtitle">录入收款信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">提交收款</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收款编号" prop="receiptNo">
              <el-input v-model="form.receiptNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户" prop="customer">
              <el-select v-model="form.customer" placeholder="请选择客户" style="width: 100%" filterable>
                <el-option label="沙特电信公司" value="沙特电信公司" />
                <el-option label="阿尔拉吉银行" value="阿尔拉吉银行" />
                <el-option label="沙特阿美" value="沙特阿美" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方式" prop="method">
              <el-select v-model="form.method" placeholder="请选择收款方式" style="width: 100%">
                <el-option label="银行转账" value="银行转账" />
                <el-option label="信用卡" value="信用卡" />
                <el-option label="现金" value="现金" />
                <el-option label="支票" value="支票" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款日期" prop="receiptDate">
              <el-date-picker v-model="form.receiptDate" type="date" placeholder="选择收款日期" style="width: 100%" />
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
  receiptNo: 'REC-2024-004',
  customer: '',
  amount: 0,
  method: '银行转账',
  receiptDate: new Date(),
  reference: '',
  remark: '',
})

const rules = {
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  amount: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
  method: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
  receiptDate: [{ required: true, message: '请选择收款日期', trigger: 'change' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('收款已提交')
  router.push('/finance/receipts')
}

const handleCancel = () => { router.push('/finance/receipts') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>