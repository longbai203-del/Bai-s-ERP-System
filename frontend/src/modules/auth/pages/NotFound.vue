<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}
.not-found-content {
  text-align: center;
}
.not-found-content h1 {
  font-size: 120px;
  color: #667eea;
  margin: 0;
  font-weight: 700;
}
.not-found-content h2 {
  font-size: 36px;
  color: #333;
  margin: 20px 0;
}
.not-found-content p {
  color: #999;
  margin-bottom: 30px;
}
</style>
