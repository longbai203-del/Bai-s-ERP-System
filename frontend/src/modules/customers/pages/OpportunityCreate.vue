<!-- 
  文件路径: frontend/src/modules/customers/pages/OpportunityCreate.vue
  功能: 新建商机
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建商机</h2>
          <p class="subtitle">录入销售机会信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">保存商机</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商机名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入商机名称" />
            </el-form-item>
          </el-col>
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
            <el-form-item label="预计金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商机阶段" prop="stage">
              <el-select v-model="form.stage" placeholder="请选择阶段" style="width: 100%">
                <el-option label="初步接触" value="initial" />
                <el-option label="需求分析" value="analysis" />
                <el-option label="方案提案" value="proposal" />
                <el-option label="谈判签约" value="negotiation" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赢率" prop="probability">
              <el-slider v-model="form.probability" :min="0" :max="100" show-stops />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="owner">
              <el-select v-model="form.owner" placeholder="请选择负责人" style="width: 100%">
                <el-option label="Ahmed Al-Fahd" value="Ahmed" />
                <el-option label="Mohammed Al-Qahtani" value="Mohammed" />
                <el-option label="Saud Al-Otaibi" value="Saud" />
                <el-option label="Faisal Al-Dossary" value="Faisal" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计成交日期" prop="expectedCloseDate">
              <el-date-picker v-model="form.expectedCloseDate" type="date" placeholder="选择预计成交日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商机来源" prop="source">
              <el-select v-model="form.source" placeholder="请选择来源" style="width: 100%">
                <el-option label="客户主动" value="主动" />
                <el-option label="销售开发" value="开发" />
                <el-option label="渠道推荐" value="推荐" />
                <el-option label="市场活动" value="活动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商机描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入商机描述" />
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
  name: '',
  customer: '',
  amount: 0,
  stage: 'initial',
  probability: 50,
  owner: '',
  expectedCloseDate: '',
  source: '主动',
  description: '',
  remark: '',
})

const rules = {
  name: [{ required: true, message: '请输入商机名称', trigger: 'blur' }],
  customer: [{ required: true, message: '请选择客户', trigger: 'change' }],
  amount: [{ required: true, message: '请输入预计金额', trigger: 'blur' }],
  stage: [{ required: true, message: '请选择商机阶段', trigger: 'change' }],
  owner: [{ required: true, message: '请选择负责人', trigger: 'change' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('商机已创建')
  router.push('/customers/opportunities')
}

const handleCancel = () => { router.push('/customers/opportunities') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>