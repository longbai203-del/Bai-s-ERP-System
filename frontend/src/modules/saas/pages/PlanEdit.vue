<!-- 
  文件路径: frontend/src/modules/saas/pages/PlanEdit.vue
  功能: 编辑套餐
-->

<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>编辑套餐</h2>
          <p class="subtitle">修改套餐信息</p>
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
            <el-form-item label="套餐名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入套餐名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套餐代码" prop="code">
              <el-input v-model="form.code" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计费周期" prop="period">
              <el-select v-model="form.period" placeholder="请选择计费周期" style="width: 100%">
                <el-option label="月" value="月" />
                <el-option label="季" value="季" />
                <el-option label="年" value="年" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="功能列表" prop="features">
              <div v-for="(feature, index) in form.features" :key="index" class="feature-row">
                <el-input v-model="form.features[index]" placeholder="请输入功能描述" style="width: 80%" />
                <el-button type="danger" size="small" @click="removeFeature(index)">×</el-button>
              </div>
              <el-button type="primary" text @click="addFeature"><el-icon><Plus /></el-icon> 添加功能</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入套餐描述" />
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()

const form = reactive({
  name: '企业版',
  code: 'PLAN_ENT',
  price: 120000,
  period: '年',
  features: ['无限用户', '所有功能模块', '专属客户支持', 'API完整访问'],
  description: '完整的企业级功能，包含所有高级特性',
})

const rules = {
  name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
}

const addFeature = () => { form.features.push('') }
const removeFeature = (index: number) => { form.features.splice(index, 1) }

const handleSave = async () => {
  await formRef.value?.validate()
  ElMessage.success('套餐信息已更新')
  router.push('/saas/plans')
}
const handleCancel = () => { router.push('/saas/plans') }
</script>

<style scoped>
.page-container { padding: 20px; background: #f5f7fa; min-height: 100vh; }
.header-card { border-radius: 12px; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-header h2 { margin: 0; font-size: 20px; }
.subtitle { color: #909399; margin: 4px 0 0 0; }
.feature-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
</style>