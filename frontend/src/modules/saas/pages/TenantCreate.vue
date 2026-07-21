<!-- 
  文件路径: frontend/src/modules/saas/pages/TenantCreate.vue
  功能: 新建租户
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>新建租户</h2>
          <p class="subtitle">创建新租户</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSubmit">创建租户</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="租户名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入租户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户代码" prop="code">
              <el-input v-model="form.code" placeholder="请输入租户代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐" prop="plan">
              <el-select v-model="form.plan" placeholder="请选择套餐" style="width: 100%">
                <el-option label="企业版" value="enterprise" />
                <el-option label="专业版" value="professional" />
                <el-option label="标准版" value="standard" />
                <el-option label="基础版" value="basic" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="active">激活</el-radio>
                <el-radio label="frozen">冻结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" type="textarea" :rows="2" placeholder="请输入地址" />
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
  code: '',
  plan: 'standard',
  status: 'active',
  contact: '',
  phone: '',
  address: '',
  remark: '',
})

const rules = {
  name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入租户代码', trigger: 'blur' }],
  plan: [{ required: true, message: '请选择套餐', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  ElMessage.success('租户已创建')
  router.push('/saas/tenants')
}
const handleCancel = () => { router.push('/saas/tenants') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>