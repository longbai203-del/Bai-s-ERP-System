<template>
  <div class="ai-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑 ai</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-empty description="编辑 ai 页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.push('/ai')
}
</script>

<style scoped>
.ai-edit { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
