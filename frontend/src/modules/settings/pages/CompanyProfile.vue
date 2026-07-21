<!-- 
  文件路径: frontend/src/modules/settings/pages/CompanyProfile.vue
  功能: 企业资料 - 管理企业基本信息
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>企业资料</h2>
          <p class="subtitle">管理企业基本信息</p>
        </div>
        <div>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业简称" prop="shortName">
              <el-input v-model="form.shortName" placeholder="请输入企业简称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="taxId">
              <el-input v-model="form.taxId" placeholder="请输入统一社会信用代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人编号" prop="vatNumber">
              <el-input v-model="form.vatNumber" placeholder="请输入纳税人编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入企业邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业网站" prop="website">
              <el-input v-model="form.website" placeholder="请输入企业网站" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业" prop="industry">
              <el-select v-model="form.industry" placeholder="请选择行业" style="width: 100%">
                <el-option label="信息技术" value="IT" />
                <el-option label="零售" value="retail" />
                <el-option label="制造业" value="manufacturing" />
                <el-option label="服务业" value="service" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="注册地址" prop="address">
              <el-input v-model="form.address" type="textarea" :rows="2" placeholder="请输入注册地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="企业简介" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入企业简介" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()

const form = reactive({
  companyName: 'Bai\'s ERP 科技有限公司',
  shortName: 'Bai\'s ERP',
  taxId: '91370100MA3XXXXX',
  vatNumber: 'SA-1234567890',
  phone: '+966 50 123 4567',
  email: 'info@bai-erp.com',
  website: 'www.bai-erp.com',
  industry: 'IT',
  address: '利雅得，沙特阿拉伯',
  description: 'Bai\'s ERP 是一站式企业资源管理系统，致力于帮助企业实现数字化转型。',
})

const rules = {
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  taxId: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
}

const handleSave = async () => {
  await formRef.value?.validate()
  ElMessage.success('企业资料已保存')
}
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
</style>