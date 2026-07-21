<template>
  <div class="production-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑 Production</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" ref="formRef" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            :rows="4" 
            placeholder="请输入描述信息" 
          />
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
        <el-button @click="handleBack">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductionDetail, updateProduction } from '@/api/production'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const submitting = ref(false)

const formData = reactive({
  name: '',
  status: 'active',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度为 2-50 个字符', trigger: 'blur' }
  ]
}

const handleBack = () => {
  router.push('/production')
}

const loadDetail = async () => {
  try {
    const id = Number(route.params.id)
    const res = await getProductionDetail(id)
    Object.assign(formData, res.data)
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const id = Number(route.params.id)
      await updateProduction(id, formData)
      ElMessage.success('更新成功')
      handleBack()
    } catch (error) {
      ElMessage.error('更新失败，请重试')
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.production-edit {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form-actions {
  margin-top: 20px;
  text-align: center;
}
</style>
