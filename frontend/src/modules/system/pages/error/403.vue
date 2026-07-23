<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <p class="error-message">您没有权限访问此页面</p>
      <el-button type="primary" @click="goBack">返回上一页</el-button>
      <el-button @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.error-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}
.error-content {
  text-align: center;
}
.error-code {
  font-size: 120px;
  color: #F56C6C;
  margin: 0;
}
.error-message {
  font-size: 20px;
  color: #666;
  margin: 20px 0;
}
</style>
