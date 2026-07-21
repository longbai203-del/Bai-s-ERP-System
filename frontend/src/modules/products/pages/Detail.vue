<template>
  <div class="products-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>products 详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-empty description="products 详情页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.push('/products')
}
</script>

<style scoped>
.products-detail { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
