<template>
  <div class="pos-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>pos 管理</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建
          </el-button>
        </div>
      </template>
      <el-empty description="pos 页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()

const handleCreate = () => {
  router.push('/pos/create')
}
</script>

<style scoped>
.pos-page { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
