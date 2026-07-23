<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="page-header">
          <span class="page-title">创建system</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = reactive({ name: '', description: '' })

const handleSubmit = () => {
  ElMessage.success('创建成功')
  router.push('/system')
}

const handleBack = () => {
  router.push('/system')
}
</script>

<style scoped>
.page-container { padding: 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 18px; font-weight: bold; }
</style>
