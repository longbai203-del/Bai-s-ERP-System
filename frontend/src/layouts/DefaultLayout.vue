<template>
  <div class="default-layout">
    <AppSidebar />
    <div class="main-content">
      <AppHeader />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style scoped>
.default-layout {
  display: flex;
  height: 100vh;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-content {
  flex: 1;
  overflow: auto;
  background: #f0f2f5;
}
</style>
