<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="$router.push('/dashboard')">
        返回仪表板
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}
.content {
  text-align: center;
}
.content h1 {
  font-size: 120px;
  margin: 0;
  color: #409eff;
}
.content h2 {
  font-size: 32px;
  margin: 16px 0;
  color: #333;
}
.content p {
  color: #666;
  margin-bottom: 24px;
}
</style>
