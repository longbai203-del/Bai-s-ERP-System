<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item :to="{ path: '/' }">
      <el-icon><HomeFilled /></el-icon>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute()

const breadcrumbs = computed(() => {
  const items = []
  const path = route.path
  const name = route.meta?.title || route.name || path

  if (path !== '/') {
    items.push({ name: name, path: path })
  }

  return items
})
</script>

<style scoped>
.breadcrumb {
  font-size: 14px;
  color: #6B7280;
}
.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #6B7280;
}
.breadcrumb :deep(.el-breadcrumb__inner.is-link) {
  color: #4F46E5;
}
.breadcrumb :deep(.el-breadcrumb__inner.is-link:hover) {
  color: #4338CA;
}
</style>
