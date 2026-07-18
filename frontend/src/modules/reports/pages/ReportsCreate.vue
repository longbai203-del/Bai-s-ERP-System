<template>
  <div class="reports-create">
    <div class="page-header">
      <el-button @click="router.back()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
      <h1>新建Reports</h1>
    </div>
    <el-card>
      <el-form :model="form" label-width="100px" @submit.prevent="handleSubmit">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="submitting">提交</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useReportsStore } from '../store'

const router = useRouter()
const store = useReportsStore()
const submitting = ref(false)

const form = reactive({ name: '', status: 'active' })

const handleSubmit = async () => {
  submitting.value = true
  await store.create(form)
  ElMessage.success('创建成功')
  router.push('/reports')
  submitting.value = false
}
</script>

<style scoped>
.reports-create { padding: 20px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 24px; }
</style>
