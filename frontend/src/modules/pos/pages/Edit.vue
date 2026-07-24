<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">编辑pos</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  name: '',
  description: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      // TODO: 调用 API 更新数据
      ElMessage.success('保存成功')
      router.push('/pos/list')
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

const handleBack = () => {
  router.push('/pos/list')
}

onMounted(() => {
  const id = route.params.id
  // TODO: 加载数据
  console.log('编辑ID:', id)
})
</script>

<style scoped>
.page-container { padding: 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 18px; font-weight: bold; }
</style>
