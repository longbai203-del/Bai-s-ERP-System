<!-- 
  文件路径: frontend/src/modules/saas/pages/SubscriptionEdit.vue
  功能: 编辑订阅
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>编辑订阅</h2>
          <p class="subtitle">修改订阅信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存修改</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="租户" prop="tenant">
              <el-input v-model="form.tenant" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐" prop="plan">
              <el-select v-model="form.plan" placeholder="请选择套餐" style="width: 100%">
                <el-option label="企业版" value="enterprise" />
                <el-option label="专业版" value="professional" />
                <el-option label="标准版" value="standard" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计费周期" prop="billingCycle">
              <el-select v-model="form.billingCycle" placeholder="请选择计费周期" style="width: 100%">
                <el-option label="月付" value="月付" />
                <el-option label="季付" value="季付" />
                <el-option label="年付" value="年付" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期日期" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" placeholder="选择到期日期" style="width: 100%" />
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
  tenant: '阿尔拉吉银行',
  plan: 'professional',
  billingCycle: '月付',
  amount: 8500,
  startDate: '2024-11-01',
  endDate: '2024-11-30',
  remark: '标准月付订阅',
})

const rules = {
  plan: [{ required: true, message: '请选择套餐', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  endDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
}

const handleSave = async () => {
  await formRef.value?.validate()
  ElMessage.success('订阅信息已更新')
  router.push('/saas/subscriptions')
}
const handleCancel = () => { router.push('/saas/subscriptions') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>