<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push('/dashboard')
</script>

<style scoped>
.error-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: #f0f2f5; }
.error-content { text-align: center; }
.error-code { font-size: 120px; color: #409EFF; margin: 0; }
.error-message { font-size: 20px; color: #666; margin: 20px 0; }
</style>
