<template>
  <div class="finance-detail">
    <div class="page-header">
      <el-button @click="router.back()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
      <h1>Finance详情</h1>
      <el-button type="primary" @click="handleEdit">编辑</el-button>
    </div>
    <el-card v-loading="loading">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ store.current?.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ store.current?.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="store.current?.status === 'active' ? 'success' : 'info'">
            {{ store.current?.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ store.current?.created_at }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useFinanceStore } from '../store'

const route = useRoute()
const router = useRouter()
const store = useFinanceStore()
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  await store.fetchById(route.params.id as string)
  loading.value = false
}

const handleEdit = () => router.push(/finance//edit)
onMounted(loadData)
</script>

<style scoped>
.finance-detail { padding: 20px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 24px; flex: 1; }
</style>
