<template>
  <div class="marketing-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>marketing 详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      <el-empty description="marketing 详情页面开发中" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.push('/marketing')
}
</script>

<style scoped>
.marketing-detail { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
