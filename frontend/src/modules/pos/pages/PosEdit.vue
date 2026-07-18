<template>
  <div class="pos-edit">
    <div class="page-header">
      <el-button @click="router.back()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
      <h1>编辑Pos</h1>
    </div>
    <el-card v-loading="loading">
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
          <el-button type="primary" native-type="submit" :loading="submitting">更新</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { usePosStore } from '../store'

const route = useRoute()
const router = useRouter()
const store = usePosStore()
const loading = ref(false)
const submitting = ref(false)

const form = reactive({ id: '', name: '', status: 'active' })

const loadData = async () => {
  loading.value = true
  await store.fetchById(route.params.id as string)
  Object.assign(form, store.current)
  loading.value = false
}

const handleSubmit = async () => {
  submitting.value = true
  await store.update(form.id, form)
  ElMessage.success('更新成功')
  router.push('/pos')
  submitting.value = false
}

onMounted(loadData)
</script>

<style scoped>
.pos-edit { padding: 20px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 24px; }
</style>
