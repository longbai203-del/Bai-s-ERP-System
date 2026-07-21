<template>
  <div class="system-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑 system</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-empty description="编辑 system 页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.push('/system')
}
</script>

<style scoped>
.system-edit { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
