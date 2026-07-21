<template>
  <div class="approval-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑 approval</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-empty description="编辑 approval 页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.push('/approval')
}
</script>

<style scoped>
.approval-edit { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
