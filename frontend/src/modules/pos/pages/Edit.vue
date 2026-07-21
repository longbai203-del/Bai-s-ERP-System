<template>
  <div class="pos-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑 pos</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-empty description="编辑 pos 页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.push('/pos')
}
</script>

<style scoped>
.pos-edit { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
